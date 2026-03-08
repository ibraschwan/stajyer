import fs from 'node:fs';
import path from 'node:path';
import { tasksDir } from '../utils/paths.js';
import { nextTaskId, taskFilename } from '../utils/ids.js';
import { parseTaskFile, writeTaskFile, createTaskContent } from './parser.js';
import type { TaskFile, TaskStatus } from './parser.js';

export function createTask(
  root: string,
  title: string,
  description: string,
  options?: { assigned_to?: string; created_by?: string }
): TaskFile {
  const dir = tasksDir(root);
  fs.mkdirSync(dir, { recursive: true });

  const id = nextTaskId(dir);
  const filename = taskFilename(id, title);
  const filePath = path.join(dir, filename);

  const task = createTaskContent(id, title, description, options);
  task.filePath = filePath;

  writeTaskFile(filePath, task);
  return task;
}

export function listTasks(root: string, filter?: { status?: TaskStatus }): TaskFile[] {
  const dir = tasksDir(root);

  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))
    .sort();

  const tasks = files.map(f => parseTaskFile(path.join(dir, f)));

  if (filter?.status) {
    return tasks.filter(t => t.frontmatter.status === filter.status);
  }

  return tasks;
}

export function getTask(root: string, id: string): TaskFile | null {
  const dir = tasksDir(root);
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir);
  const match = files.find(f => f.startsWith(`${id}-`));
  if (!match) return null;

  return parseTaskFile(path.join(dir, match));
}

export function updateTaskStatus(
  root: string,
  id: string,
  status: TaskStatus,
  extra?: Partial<{ assigned_to: string; session_id: string; tokens_used: number }>
): TaskFile | null {
  const task = getTask(root, id);
  if (!task) return null;

  task.frontmatter.status = status;

  if (status === 'done' || status === 'failed') {
    task.frontmatter.completed_at = new Date().toISOString();
  }

  if (extra) {
    Object.assign(task.frontmatter, extra);
  }

  writeTaskFile(task.filePath, task);
  return task;
}
