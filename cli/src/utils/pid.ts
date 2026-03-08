import fs from 'node:fs';
import { pidPath } from './paths.js';

export function writePid(root: string): void {
  fs.writeFileSync(pidPath(root), String(process.pid), 'utf-8');
}

export function readPid(root: string): number | null {
  try {
    const content = fs.readFileSync(pidPath(root), 'utf-8').trim();
    const pid = parseInt(content, 10);
    return isNaN(pid) ? null : pid;
  } catch {
    return null;
  }
}

export function isProcessRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export function isDaemonRunning(root: string): { running: boolean; pid: number | null } {
  const pid = readPid(root);
  if (pid === null) return { running: false, pid: null };
  const running = isProcessRunning(pid);
  if (!running) {
    // Stale PID file — clean up
    try { fs.unlinkSync(pidPath(root)); } catch {}
  }
  return { running, pid };
}

export function removePid(root: string): void {
  try { fs.unlinkSync(pidPath(root)); } catch {}
}
