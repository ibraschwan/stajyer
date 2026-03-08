import { listTasks } from '../task/manager.js';
import type { TaskFile } from '../task/parser.js';
import type { AgentProcess, TokenUsage } from '../adapters/types.js';

export type AgentState = 'idle' | 'working' | 'starting' | 'crashed' | 'stopped';

export interface AgentRecord {
  name: string;
  state: AgentState;
  currentTaskId?: string;
  process?: AgentProcess;
  sessionId?: string;
  tokens: TokenUsage;
  lastActivity?: Date;
}

export class StateStore {
  agents: Map<string, AgentRecord> = new Map();
  private root: string;

  constructor(root: string) {
    this.root = root;
  }

  initAgent(name: string): AgentRecord {
    const record: AgentRecord = {
      name,
      state: 'stopped',
      tokens: { inputTokens: 0, outputTokens: 0 },
    };
    this.agents.set(name, record);
    return record;
  }

  getAgent(name: string): AgentRecord | undefined {
    return this.agents.get(name);
  }

  setAgentState(name: string, state: AgentState): void {
    const agent = this.agents.get(name);
    if (agent) {
      agent.state = state;
      agent.lastActivity = new Date();
    }
  }

  setAgentTask(name: string, taskId: string | undefined): void {
    const agent = this.agents.get(name);
    if (agent) {
      agent.currentTaskId = taskId;
    }
  }

  setAgentProcess(name: string, process: AgentProcess | undefined): void {
    const agent = this.agents.get(name);
    if (agent) {
      agent.process = process;
    }
  }

  addTokens(name: string, usage: TokenUsage): void {
    const agent = this.agents.get(name);
    if (agent) {
      agent.tokens.inputTokens += usage.inputTokens;
      agent.tokens.outputTokens += usage.outputTokens;
    }
  }

  getIdleAgents(): AgentRecord[] {
    return [...this.agents.values()].filter(a => a.state === 'idle');
  }

  getWorkingAgents(): AgentRecord[] {
    return [...this.agents.values()].filter(a => a.state === 'working');
  }

  getAllTasks(): TaskFile[] {
    return listTasks(this.root);
  }

  syncFromDisk(): void {
    // Refresh task state from markdown files
    const tasks = listTasks(this.root);
    for (const agent of this.agents.values()) {
      if (agent.currentTaskId) {
        const task = tasks.find(t => t.frontmatter.id === agent.currentTaskId);
        if (task && (task.frontmatter.status === 'done' || task.frontmatter.status === 'failed')) {
          agent.currentTaskId = undefined;
          agent.state = 'idle';
        }
      }
    }
  }

  toJSON(): Record<string, unknown> {
    const agents: Record<string, unknown> = {};
    for (const [name, record] of this.agents) {
      agents[name] = {
        state: record.state,
        currentTaskId: record.currentTaskId,
        sessionId: record.sessionId,
        tokens: record.tokens,
        lastActivity: record.lastActivity?.toISOString(),
      };
    }
    return { agents };
  }
}
