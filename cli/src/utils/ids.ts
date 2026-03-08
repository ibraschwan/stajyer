import fs from 'node:fs';
import path from 'node:path';

/**
 * Scan existing task files and return the next auto-incremented ID.
 * IDs are zero-padded 3-digit strings: "001", "002", etc.
 */
export function nextTaskId(tasksDirectory: string): string {
  let maxId = 0;

  try {
    const files = fs.readdirSync(tasksDirectory);
    for (const file of files) {
      if (file.startsWith('_')) continue; // Skip _queue.md
      const match = file.match(/^(\d{3})-/);
      if (match) {
        const id = parseInt(match[1], 10);
        if (id > maxId) maxId = id;
      }
    }
  } catch {
    // Directory might not exist yet
  }

  return String(maxId + 1).padStart(3, '0');
}

/**
 * Generate a filename-safe slug from a title.
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}

/**
 * Generate a full task filename: "001-fix-auth-bug.md"
 */
export function taskFilename(id: string, title: string): string {
  return `${id}-${slugify(title)}.md`;
}
