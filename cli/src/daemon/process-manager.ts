import type { StajyerConfig } from '../config/schema.js';
import type { AgentProcess } from '../adapters/types.js';
import type { DaemonEventBus } from './event-bus.js';
import type { StateStore } from '../state/store.js';
import { getAdapter } from '../adapters/registry.js';
import { logger } from '../utils/logger.js';

export class ProcessManager {
  private bus: DaemonEventBus;
  private store: StateStore;
  private config: StajyerConfig;
  private cwd: string;

  constructor(bus: DaemonEventBus, store: StateStore, config: StajyerConfig, cwd: string) {
    this.bus = bus;
    this.store = store;
    this.config = config;
    this.cwd = cwd;
  }

  startAgent(name: string): void {
    const agentConfig = this.config.agents[name];
    if (!agentConfig) {
      throw new Error(`Agent "${name}" not found in config`);
    }

    const adapter = getAdapter(agentConfig.adapter);
    const record = this.store.getAgent(name);
    if (!record) {
      throw new Error(`Agent "${name}" not initialized in store`);
    }

    this.store.setAgentState(name, 'starting');
    logger.info('process', `Starting agent: ${name} (${agentConfig.adapter})`);

    const proc = adapter.spawn(name, agentConfig, this.cwd);
    this.store.setAgentProcess(name, proc);

    // Handle stdout
    let buffer = '';
    proc.child.stdout?.on('data', (chunk: Buffer) => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.trim()) continue;
        const events = adapter.parseOutput(line);
        for (const event of events) {
          this.bus.emitTyped('agent:output', name, event);

          if (event.type === 'result') {
            if (event.sessionId) {
              record.sessionId = event.sessionId;
            }
            if (event.usage) {
              this.store.addTokens(name, event.usage);
            }
            // Task completed — the dispatcher handles this
            const taskId = record.currentTaskId;
            if (taskId) {
              const tasks = this.store.getAllTasks();
              const task = tasks.find(t => t.frontmatter.id === taskId);
              if (task) {
                this.bus.emitTyped('task:completed', task, name);
              }
            }
          }
        }
      }
    });

    // Handle stderr
    proc.child.stderr?.on('data', (chunk: Buffer) => {
      const msg = chunk.toString().trim();
      if (msg) {
        logger.warn(name, msg);
      }
    });

    // Handle exit
    proc.child.on('exit', (code, signal) => {
      logger.info('process', `Agent ${name} exited (code=${code}, signal=${signal})`);
      this.store.setAgentProcess(name, undefined);

      if (code !== 0 && signal !== 'SIGTERM') {
        this.store.setAgentState(name, 'crashed');
        this.bus.emitTyped('agent:crashed', name, `Exit code ${code}`);
      } else {
        this.store.setAgentState(name, 'stopped');
      }
    });

    this.store.setAgentState(name, 'idle');
    this.bus.emitTyped('agent:idle', name);
  }

  async stopAgent(name: string): Promise<void> {
    const record = this.store.getAgent(name);
    if (!record?.process) return;

    const adapter = getAdapter(this.config.agents[name].adapter);
    logger.info('process', `Stopping agent: ${name}`);

    await adapter.terminate(record.process);
    this.store.setAgentProcess(name, undefined);
    this.store.setAgentState(name, 'stopped');
  }

  async stopAll(): Promise<void> {
    const promises = [...this.store.agents.keys()].map(name => this.stopAgent(name));
    await Promise.all(promises);
  }

  sendTaskToAgent(name: string, prompt: string): void {
    const record = this.store.getAgent(name);
    if (!record?.process) {
      throw new Error(`Agent "${name}" has no running process`);
    }

    const adapter = getAdapter(this.config.agents[name].adapter);
    adapter.sendTask(record.process, prompt);
    this.store.setAgentState(name, 'working');
  }

  restartAgent(name: string): void {
    const record = this.store.getAgent(name);
    if (record?.process) {
      this.stopAgent(name).then(() => this.startAgent(name));
    } else {
      this.startAgent(name);
    }
  }
}
