import type { ChildProcess } from 'node:child_process';
import type { AgentConfig } from '../config/schema.js';

export interface AgentProcess {
  name: string;
  child: ChildProcess;
  sessionId?: string;
  adapter: string;
}

export interface AgentEvent {
  type: 'progress' | 'result' | 'error' | 'tool_use' | 'idle';
  content?: string;
  usage?: TokenUsage;
  sessionId?: string;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
}

export interface StajyerAdapter {
  type: string;

  spawn(name: string, config: AgentConfig, cwd: string): AgentProcess;
  sendTask(process: AgentProcess, prompt: string): void;
  parseOutput(chunk: string): AgentEvent[];
  terminate(process: AgentProcess): Promise<void>;
}
