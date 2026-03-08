import { EventEmitter } from 'node:events';
import type { TaskFile } from '../task/parser.js';
import type { AgentEvent } from '../adapters/types.js';

export interface DaemonEvents {
  'task:created': (task: TaskFile) => void;
  'task:completed': (task: TaskFile, agentName: string) => void;
  'task:failed': (task: TaskFile, agentName: string, error: string) => void;
  'agent:idle': (agentName: string) => void;
  'agent:working': (agentName: string, task: TaskFile) => void;
  'agent:crashed': (agentName: string, error: string) => void;
  'agent:output': (agentName: string, event: AgentEvent) => void;
  'daemon:log': (source: string, message: string) => void;
  'daemon:shutdown': () => void;
}

export class DaemonEventBus extends EventEmitter {
  emitTyped<K extends keyof DaemonEvents>(
    event: K,
    ...args: Parameters<DaemonEvents[K]>
  ): boolean {
    return this.emit(event, ...args);
  }

  onTyped<K extends keyof DaemonEvents>(
    event: K,
    listener: DaemonEvents[K],
  ): this {
    return this.on(event, listener as (...args: unknown[]) => void);
  }
}
