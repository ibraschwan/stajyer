import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { parseTaskFile, writeTaskFile, createTaskContent } from '../src/task/parser.js';
import type { TaskFile } from '../src/task/parser.js';

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'stajyer-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('task parser', () => {
  it('round-trips a task file', () => {
    const task = createTaskContent('001', 'Fix auth bug', 'The login form is broken.', {
      assigned_to: 'dev-1',
      created_by: 'lead',
    });

    const filePath = path.join(tmpDir, '001-fix-auth-bug.md');
    task.filePath = filePath;
    writeTaskFile(filePath, task);

    const parsed = parseTaskFile(filePath);

    expect(parsed.frontmatter.id).toBe('001');
    expect(parsed.frontmatter.title).toBe('Fix auth bug');
    expect(parsed.frontmatter.status).toBe('assigned');
    expect(parsed.frontmatter.assigned_to).toBe('dev-1');
    expect(parsed.frontmatter.created_by).toBe('lead');
    expect(parsed.body).toContain('Fix auth bug');
    expect(parsed.body).toContain('The login form is broken.');
  });

  it('handles all frontmatter statuses', () => {
    const statuses = ['pending', 'assigned', 'in_progress', 'done', 'failed', 'needs_human'] as const;

    for (const status of statuses) {
      const task = createTaskContent('001', 'Test', 'desc');
      task.frontmatter.status = status;
      const filePath = path.join(tmpDir, `test-${status}.md`);
      task.filePath = filePath;

      writeTaskFile(filePath, task);
      const parsed = parseTaskFile(filePath);
      expect(parsed.frontmatter.status).toBe(status);
    }
  });

  it('creates pending task when no assignee', () => {
    const task = createTaskContent('002', 'Write tests', 'Add vitest tests');
    expect(task.frontmatter.status).toBe('pending');
    expect(task.frontmatter.assigned_to).toBeUndefined();
  });

  it('creates assigned task when assignee provided', () => {
    const task = createTaskContent('003', 'Fix bug', 'desc', { assigned_to: 'dev-2' });
    expect(task.frontmatter.status).toBe('assigned');
    expect(task.frontmatter.assigned_to).toBe('dev-2');
  });
});
