import chokidar from 'chokidar';
import path from 'node:path';
import type { DaemonEventBus } from './event-bus.js';
import { parseTaskFile } from '../task/parser.js';
import { logger } from '../utils/logger.js';

export class FileWatcher {
  private watcher: chokidar.FSWatcher | null = null;
  private bus: DaemonEventBus;
  private tasksDir: string;
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(bus: DaemonEventBus, tasksDir: string) {
    this.bus = bus;
    this.tasksDir = tasksDir;
  }

  start(): void {
    logger.info('watcher', `Watching ${this.tasksDir}`);

    this.watcher = chokidar.watch(path.join(this.tasksDir, '*.md'), {
      ignoreInitial: true,
      awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 50 },
    });

    this.watcher.on('add', (filePath) => this.handleChange(filePath, 'add'));
    this.watcher.on('change', (filePath) => this.handleChange(filePath, 'change'));
  }

  private handleChange(filePath: string, eventType: 'add' | 'change'): void {
    const filename = path.basename(filePath);

    // Skip queue file and hidden files
    if (filename.startsWith('_') || filename.startsWith('.')) return;

    // Debounce
    const existing = this.debounceTimers.get(filePath);
    if (existing) clearTimeout(existing);

    this.debounceTimers.set(filePath, setTimeout(() => {
      this.debounceTimers.delete(filePath);
      this.processFileEvent(filePath, eventType);
    }, 300));
  }

  private processFileEvent(filePath: string, eventType: 'add' | 'change'): void {
    try {
      const task = parseTaskFile(filePath);

      if (eventType === 'add') {
        logger.info('watcher', `New task: ${task.frontmatter.id} - ${task.frontmatter.title}`);
        this.bus.emitTyped('task:created', task);
      }

      // On change, check if task was completed externally (e.g., by agent editing the file)
      if (eventType === 'change') {
        if (task.frontmatter.status === 'done') {
          const agent = task.frontmatter.assigned_to;
          if (agent) {
            this.bus.emitTyped('task:completed', task, agent);
          }
        }
      }
    } catch (err) {
      logger.error('watcher', `Failed to parse ${filePath}: ${err}`);
    }
  }

  async stop(): Promise<void> {
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
    await this.watcher?.close();
    this.watcher = null;
  }
}
