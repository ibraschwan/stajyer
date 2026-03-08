import type { StajyerAdapter } from './types.js';
import { claudeCodeAdapter } from './claude-code.js';

const adapters: Record<string, StajyerAdapter> = {
  'claude-code': claudeCodeAdapter,
};

export function getAdapter(type: string): StajyerAdapter {
  const adapter = adapters[type];
  if (!adapter) {
    throw new Error(
      `Unknown adapter: "${type}". Available: ${Object.keys(adapters).join(', ')}`
    );
  }
  return adapter;
}

export function registerAdapter(adapter: StajyerAdapter): void {
  adapters[adapter.type] = adapter;
}
