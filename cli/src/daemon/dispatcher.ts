import type { DaemonEventBus } from './event-bus.js';
import type { StateStore } from '../state/store.js';
import type { ProcessManager } from './process-manager.js';
import type { StajyerConfig } from '../config/schema.js';
import { getNextTask } from '../task/queue.js';
import { updateTaskStatus } from '../task/manager.js';
import { generateQueueFile } from '../task/queue.js';
import { logger } from '../utils/logger.js';
import type { TaskFile } from '../task/parser.js';

/**
 * Core auto-dispatch logic — the main innovation.
 *
 * Listens for events and routes tasks to available agents:
 * - task:created → assign to idle agent
 * - task:completed → mark done, get next task for agent
 * - agent:idle → check queue for pending tasks
 * - agent:crashed → restart agent
 */
export class Dispatcher {
  private bus: DaemonEventBus;
  private store: StateStore;
  private processManager: ProcessManager;
  private config: StajyerConfig;
  private root: string;

  constructor(
    bus: DaemonEventBus,
    store: StateStore,
    processManager: ProcessManager,
    config: StajyerConfig,
    root: string,
  ) {
    this.bus = bus;
    this.store = store;
    this.processManager = processManager;
    this.config = config;
    this.root = root;

    this.wireEvents();
  }

  private wireEvents(): void {
    this.bus.onTyped('task:created', (task) => this.onTaskCreated(task));
    this.bus.onTyped('task:completed', (task, agentName) => this.onTaskCompleted(task, agentName));
    this.bus.onTyped('agent:idle', (agentName) => this.onAgentIdle(agentName));
    this.bus.onTyped('agent:crashed', (agentName, error) => this.onAgentCrashed(agentName, error));
  }

  private onTaskCreated(task: TaskFile): void {
    logger.info('dispatch', `Task created: ${task.frontmatter.id} - ${task.frontmatter.title}`);

    // If assigned to a specific agent, check if they're idle
    if (task.frontmatter.assigned_to) {
      const agent = this.store.getAgent(task.frontmatter.assigned_to);
      if (agent?.state === 'idle') {
        this.dispatchTask(task.frontmatter.assigned_to, task);
        return;
      }
    }

    // Auto-assign to first idle agent (if enabled)
    if (this.config.rules?.auto_assign !== false) {
      const idle = this.store.getIdleAgents();
      // Prefer non-lead agents for auto-assignment
      const worker = idle.find(a => a.name !== 'lead') ?? idle[0];
      if (worker) {
        this.dispatchTask(worker.name, task);
      }
    }

    generateQueueFile(this.root);
  }

  private onTaskCompleted(task: TaskFile, agentName: string): void {
    logger.info('dispatch', `Task completed: ${task.frontmatter.id} by ${agentName}`);

    // Mark task as done
    updateTaskStatus(this.root, task.frontmatter.id, 'done');
    this.store.setAgentTask(agentName, undefined);
    this.store.setAgentState(agentName, 'idle');

    generateQueueFile(this.root);

    // Auto-dispatch next task
    this.tryDispatchNext(agentName);
  }

  private onAgentIdle(agentName: string): void {
    logger.info('dispatch', `Agent idle: ${agentName}`);
    this.tryDispatchNext(agentName);
  }

  private onAgentCrashed(agentName: string, error: string): void {
    logger.error('dispatch', `Agent crashed: ${agentName} — ${error}`);

    // Auto-restart
    setTimeout(() => {
      logger.info('dispatch', `Restarting agent: ${agentName}`);
      this.processManager.restartAgent(agentName);
    }, 2000);
  }

  private tryDispatchNext(agentName: string): void {
    const next = getNextTask(this.root, agentName);

    if (next) {
      this.dispatchTask(agentName, next);
      return;
    }

    // No tasks left — notify lead if this is a worker
    if (agentName !== 'lead' && this.store.getWorkingAgents().length === 0) {
      const lead = this.store.getAgent('lead');
      if (lead?.state === 'idle' && lead?.process) {
        const allTasks = this.store.getAllTasks();
        const doneTasks = allTasks
          .filter(t => t.frontmatter.status === 'done')
          .map(t => `- [${t.frontmatter.id}] ${t.frontmatter.title}`)
          .join('\n');

        const prompt = [
          'All workers are idle. No pending tasks.',
          '',
          'Completed tasks:',
          doneTasks || '(none)',
          '',
          "What's next? Create new task files in .stajyer/tasks/ or say 'all done'.",
        ].join('\n');

        this.processManager.sendTaskToAgent('lead', prompt);
        this.store.setAgentState('lead', 'working');
      }
    }
  }

  private dispatchTask(agentName: string, task: TaskFile): void {
    logger.info('dispatch', `Dispatching ${task.frontmatter.id} → ${agentName}`);

    // Update task status
    updateTaskStatus(this.root, task.frontmatter.id, 'in_progress', {
      assigned_to: agentName,
    });

    this.store.setAgentTask(agentName, task.frontmatter.id);
    this.store.setAgentState(agentName, 'working');

    // Build prompt from task file
    const agentConfig = this.config.agents[agentName];
    const roleContext = agentConfig?.role ? `Your role: ${agentConfig.role}\n\n` : '';
    const prompt = `${roleContext}Task ${task.frontmatter.id}: ${task.frontmatter.title}\n\n${task.body}`;

    this.processManager.sendTaskToAgent(agentName, prompt);
    generateQueueFile(this.root);
  }
}
