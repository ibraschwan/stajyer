import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { nextTaskId, slugify, taskFilename } from '../src/utils/ids.js';

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'stajyer-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('nextTaskId', () => {
  it('returns 001 for empty directory', () => {
    expect(nextTaskId(tmpDir)).toBe('001');
  });

  it('returns sequential id', () => {
    fs.writeFileSync(path.join(tmpDir, '001-first.md'), '', 'utf-8');
    fs.writeFileSync(path.join(tmpDir, '002-second.md'), '', 'utf-8');
    expect(nextTaskId(tmpDir)).toBe('003');
  });

  it('handles gaps', () => {
    fs.writeFileSync(path.join(tmpDir, '001-first.md'), '', 'utf-8');
    fs.writeFileSync(path.join(tmpDir, '005-fifth.md'), '', 'utf-8');
    expect(nextTaskId(tmpDir)).toBe('006');
  });

  it('skips _queue.md', () => {
    fs.writeFileSync(path.join(tmpDir, '_queue.md'), '', 'utf-8');
    expect(nextTaskId(tmpDir)).toBe('001');
  });

  it('handles nonexistent directory', () => {
    expect(nextTaskId(path.join(tmpDir, 'nonexistent'))).toBe('001');
  });
});

describe('slugify', () => {
  it('converts to lowercase kebab-case', () => {
    expect(slugify('Fix the Auth Bug')).toBe('fix-the-auth-bug');
  });

  it('removes special characters', () => {
    expect(slugify('Add error.tsx & global-error.tsx')).toBe('add-error-tsx-global-error-tsx');
  });

  it('truncates to 50 chars', () => {
    const long = 'a'.repeat(100);
    expect(slugify(long).length).toBeLessThanOrEqual(50);
  });
});

describe('taskFilename', () => {
  it('generates correct filename', () => {
    expect(taskFilename('001', 'Fix Auth Bug')).toBe('001-fix-auth-bug.md');
  });
});
