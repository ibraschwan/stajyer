import path from 'node:path';
import fs from 'node:fs';

export function findProjectRoot(from: string = process.cwd()): string | null {
  let dir = from;
  while (true) {
    if (fs.existsSync(path.join(dir, '.stajyer'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

export function requireProjectRoot(from?: string): string {
  const root = findProjectRoot(from);
  if (!root) {
    throw new Error('Not a stajyer project. Run `stajyer init` first.');
  }
  return root;
}

export function stajyerDir(root?: string): string {
  return path.join(root ?? requireProjectRoot(), '.stajyer');
}

export function tasksDir(root?: string): string {
  return path.join(stajyerDir(root), 'tasks');
}

export function commsDir(root?: string): string {
  return path.join(stajyerDir(root), 'comms');
}

export function agentsDir(root?: string): string {
  return path.join(stajyerDir(root), 'agents');
}

export function rulesDir(root?: string): string {
  return path.join(stajyerDir(root), 'rules');
}

export function configPath(root?: string): string {
  return path.join(stajyerDir(root), 'config.yml');
}

export function pidPath(root?: string): string {
  return path.join(stajyerDir(root), 'daemon.pid');
}

export function socketPath(root?: string): string {
  return path.join(stajyerDir(root), 'daemon.sock');
}

export function queuePath(root?: string): string {
  return path.join(tasksDir(root), '_queue.md');
}
