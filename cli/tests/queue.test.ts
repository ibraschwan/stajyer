import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { getNextTask, generateQueueFile } from '../src/task/queue.js';
import { createTask } from '../src/task/manager.js';

let tmpDir: string;

function setupProject(dir: string): string {
  const stajyerDir = path.join(dir, '.stajyer');
  const tasksDir = path.join(stajyerDir, 'tasks');
  fs.mkdirSync(tasksDir, { recursive: true });
  return dir;
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'stajyer-test-'));
  setupProject(tmpDir);
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('getNextTask', () => {
  it('returns assigned task for agent', () => {
    createTask(tmpDir, 'Task 1', 'desc', { assigned_to: 'dev-1' });
    createTask(tmpDir, 'Task 2', 'desc', { assigned_to: 'dev-2' });

    const next = getNextTask(tmpDir, 'dev-1');
    expect(next).not.toBeNull();
    expect(next!.frontmatter.assigned_to).toBe('dev-1');
    expect(next!.frontmatter.title).toBe('Task 1');
  });

  it('returns unassigned pending task when no assigned tasks', () => {
    createTask(tmpDir, 'Unassigned task', 'desc');

    const next = getNextTask(tmpDir, 'dev-1');
    expect(next).not.toBeNull();
    expect(next!.frontmatter.title).toBe('Unassigned task');
  });

  it('returns null when queue is empty', () => {
    const next = getNextTask(tmpDir, 'dev-1');
    expect(next).toBeNull();
  });

  it('returns null when all tasks are done', () => {
    const task = createTask(tmpDir, 'Done task', 'desc');
    // Manually mark as done
    task.frontmatter.status = 'done';
    const { writeTaskFile } = require('../src/task/parser.js');
    writeTaskFile(task.filePath, task);

    const next = getNextTask(tmpDir, 'dev-1');
    expect(next).toBeNull();
  });
});

describe('generateQueueFile', () => {
  it('generates _queue.md summary', () => {
    createTask(tmpDir, 'Pending task', 'desc');
    createTask(tmpDir, 'Assigned task', 'desc', { assigned_to: 'dev-1' });

    generateQueueFile(tmpDir);

    const queuePath = path.join(tmpDir, '.stajyer', 'tasks', '_queue.md');
    expect(fs.existsSync(queuePath)).toBe(true);

    const content = fs.readFileSync(queuePath, 'utf-8');
    expect(content).toContain('Task Queue');
    expect(content).toContain('2 total');
    expect(content).toContain('Pending task');
    expect(content).toContain('Assigned task');
  });
});
