import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import yaml from 'js-yaml';
import { loadConfig, saveConfig } from '../src/config/loader.js';
import { defaultConfig } from '../src/config/defaults.js';

let tmpDir: string;

function setupProject(dir: string): string {
  fs.mkdirSync(path.join(dir, '.stajyer'), { recursive: true });
  return dir;
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'stajyer-test-'));
  setupProject(tmpDir);
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('config loader', () => {
  it('loads a valid config', () => {
    const config = defaultConfig('test-project');
    saveConfig(tmpDir, config);

    const loaded = loadConfig(tmpDir);
    expect(loaded.project.name).toBe('test-project');
    expect(loaded.agents.lead).toBeDefined();
    expect(loaded.agents.lead.adapter).toBe('claude-code');
  });

  it('throws on missing config', () => {
    expect(() => loadConfig(tmpDir)).toThrow('Config not found');
  });

  it('throws on missing project name', () => {
    const cfgPath = path.join(tmpDir, '.stajyer', 'config.yml');
    fs.writeFileSync(cfgPath, yaml.dump({ agents: { dev: { adapter: 'claude-code' } } }), 'utf-8');

    expect(() => loadConfig(tmpDir)).toThrow('missing project.name');
  });

  it('throws on missing agents', () => {
    const cfgPath = path.join(tmpDir, '.stajyer', 'config.yml');
    fs.writeFileSync(cfgPath, yaml.dump({ project: { name: 'test' } }), 'utf-8');

    expect(() => loadConfig(tmpDir)).toThrow('no agents defined');
  });

  it('throws on agent without adapter', () => {
    const cfgPath = path.join(tmpDir, '.stajyer', 'config.yml');
    fs.writeFileSync(cfgPath, yaml.dump({
      project: { name: 'test' },
      agents: { dev: {} },
    }), 'utf-8');

    expect(() => loadConfig(tmpDir)).toThrow('no adapter');
  });
});
