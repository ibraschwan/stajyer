import { loadConfig } from '../config/loader.js';
import { tasksDir } from '../utils/paths.js';
import { writePid, removePid } from '../utils/pid.js';
import { logger, setLogLevel } from '../utils/logger.js';
import { DaemonEventBus } from './event-bus.js';
import { StateStore } from '../state/store.js';
import { ProcessManager } from './process-manager.js';
import { FileWatcher } from './file-watcher.js';
import { Dispatcher } from './dispatcher.js';
import { IpcServer } from './ipc.js';

export interface DaemonOptions {
  root: string;
  foreground?: boolean;
  dryRun?: boolean;
}

export async function startDaemon(options: DaemonOptions): Promise<void> {
  const { root, dryRun } = options;

  if (dryRun) {
    const config = loadConfig(root);
    logger.info('daemon', 'Dry run — would start:');
    for (const [name, agent] of Object.entries(config.agents)) {
      logger.info('daemon', `  ${name}: ${agent.adapter} (${agent.config?.model ?? 'default'})`);
    }
    return;
  }

  // Load config
  const config = loadConfig(root);
  logger.info('daemon', `Starting stajyer daemon for "${config.project.name}"`);

  // Write PID
  writePid(root);

  // Initialize components
  const bus = new DaemonEventBus();
  const store = new StateStore(root);
  const processManager = new ProcessManager(bus, store, config, root);
  const watcher = new FileWatcher(bus, tasksDir(root));
  const ipc = new IpcServer(bus, store, root);

  // Forward log events
  const origLog = logger.info;
  bus.onTyped('daemon:log', () => {}); // Ensure listener exists

  // Initialize agent records
  for (const name of Object.keys(config.agents)) {
    store.initAgent(name);
  }

  // Sync existing state from disk
  store.syncFromDisk();

  // Create dispatcher (wires event handlers)
  new Dispatcher(bus, store, processManager, config, root);

  // Start systems
  watcher.start();
  ipc.start();

  // Start all agents
  for (const name of Object.keys(config.agents)) {
    try {
      processManager.startAgent(name);
    } catch (err) {
      logger.error('daemon', `Failed to start ${name}: ${err}`);
    }
  }

  logger.info('daemon', `All agents started. Watching for tasks...`);

  // Graceful shutdown
  const shutdown = async () => {
    logger.info('daemon', 'Shutting down...');
    bus.emitTyped('daemon:shutdown');

    await processManager.stopAll();
    await watcher.stop();
    await ipc.stop();
    removePid(root);

    logger.info('daemon', 'Shutdown complete.');
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  // Check for pending tasks on startup
  const tasks = store.getAllTasks();
  const pending = tasks.filter(t =>
    t.frontmatter.status === 'pending' || t.frontmatter.status === 'assigned'
  );

  if (pending.length > 0) {
    logger.info('daemon', `Found ${pending.length} pending tasks. Dispatching...`);
    for (const task of pending) {
      bus.emitTyped('task:created', task);
    }
  }
}
