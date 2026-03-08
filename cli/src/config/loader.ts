import fs from 'node:fs';
import yaml from 'js-yaml';
import { configPath } from '../utils/paths.js';
import type { StajyerConfig } from './schema.js';

export function loadConfig(root: string): StajyerConfig {
  const cfgPath = configPath(root);

  if (!fs.existsSync(cfgPath)) {
    throw new Error(`Config not found: ${cfgPath}\nRun \`stajyer init\` first.`);
  }

  const raw = fs.readFileSync(cfgPath, 'utf-8');
  const parsed = yaml.load(raw) as StajyerConfig;

  if (!parsed?.project?.name) {
    throw new Error(`Invalid config: missing project.name in ${cfgPath}`);
  }

  if (!parsed?.agents || Object.keys(parsed.agents).length === 0) {
    throw new Error(`Invalid config: no agents defined in ${cfgPath}`);
  }

  for (const [name, agent] of Object.entries(parsed.agents)) {
    if (!agent.adapter) {
      throw new Error(`Invalid config: agent "${name}" has no adapter`);
    }
  }

  return parsed;
}

export function saveConfig(root: string, config: StajyerConfig): void {
  const cfgPath = configPath(root);
  const content = yaml.dump(config, {
    lineWidth: 120,
    noRefs: true,
    quotingType: '"',
  });
  fs.writeFileSync(cfgPath, content, 'utf-8');
}
