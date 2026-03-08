import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { DaemonEventBus } from '../src/daemon/event-bus.js';
import { StateStore } from '../src/state/store.js';
import { Dispatcher } from '../src/daemon/dispatcher.js';
import { createTask } from '../src/task/manager.js';
import { defaultConfig } from '../src/config/defaults.js';
import type { ProcessManager } from '../src/daemon/process-manager.js';

let tmpDir: string;

function setupProject(dir: string): string {
  const stajyerDir = path.join(dir, '.stajyer');
  fs.mkdirSync(path.join(stajyerDir, 'tasks'), { recursive: true });

  const { saveConfig } = require('../src/config/loader.js');
  saveConfig(dir, defaultConfig('test'));
  return dir;
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'stajyer-test-'));
  setupProject(tmpDir);
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

function createMockProcessManager(): ProcessManager {
  return {
    startAgent: vi.fn(),
    stopAgent: vi.fn(),
    stopAll: vi.fn(),
    sendTaskToAgent: vi.fn(),
    restartAgent: vi.fn(),
  } as unknown as ProcessManager;
}

describe('Dispatcher', () => {
  it('dispatches task to idle agent on task:created', () => {
    const bus = new DaemonEventBus();
    const store = new StateStore(tmpDir);
    const pm = createMockProcessManager();
    const config = defaultConfig('test');

    // Init agents
    store.initAgent('lead');
    store.initAgent('dev-1');
    store.setAgentState('lead', 'idle');
    store.setAgentState('dev-1', 'idle');
    store.setAgentProcess('dev-1', { name: 'dev-1', child: {} as any, adapter: 'claude-code' });

    new Dispatcher(bus, store, pm, config, tmpDir);

    const task = createTask(tmpDir, 'Test task', 'Do something');
    bus.emitTyped('task:created', task);

    expect(pm.sendTaskToAgent).toHaveBeenCalledWith('dev-1', expect.stringContaining('Test task'));
  });

  it('dispatches to assigned agent', () => {
    const bus = new DaemonEventBus();
    const store = new StateStore(tmpDir);
    const pm = createMockProcessManager();
    const config = defaultConfig('test');

    store.initAgent('lead');
    store.initAgent('dev-1');
    store.setAgentState('lead', 'idle');
    store.setAgentState('dev-1', 'idle');
    store.setAgentProcess('lead', { name: 'lead', child: {} as any, adapter: 'claude-code' });
    store.setAgentProcess('dev-1', { name: 'dev-1', child: {} as any, adapter: 'claude-code' });

    new Dispatcher(bus, store, pm, config, tmpDir);

    const task = createTask(tmpDir, 'Lead task', 'Plan architecture', { assigned_to: 'lead' });
    bus.emitTyped('task:created', task);

    expect(pm.sendTaskToAgent).toHaveBeenCalledWith('lead', expect.stringContaining('Lead task'));
  });

  it('auto-dispatches next task on completion', () => {
    const bus = new DaemonEventBus();
    const store = new StateStore(tmpDir);
    const pm = createMockProcessManager();
    const config = defaultConfig('test');

    store.initAgent('dev-1');
    store.setAgentState('dev-1', 'working');
    store.setAgentProcess('dev-1', { name: 'dev-1', child: {} as any, adapter: 'claude-code' });

    new Dispatcher(bus, store, pm, config, tmpDir);

    // Create two tasks
    const task1 = createTask(tmpDir, 'First', 'desc', { assigned_to: 'dev-1' });
    createTask(tmpDir, 'Second', 'desc');

    // Simulate first task completion
    store.setAgentTask('dev-1', task1.frontmatter.id);
    bus.emitTyped('task:completed', task1, 'dev-1');

    // Should dispatch second task
    expect(pm.sendTaskToAgent).toHaveBeenCalledWith('dev-1', expect.stringContaining('Second'));
  });
});
