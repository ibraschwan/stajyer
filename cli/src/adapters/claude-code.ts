import { spawn } from 'node:child_process';
import type { StajyerAdapter, AgentProcess, AgentEvent } from './types.js';
import type { AgentConfig } from '../config/schema.js';

export const claudeCodeAdapter: StajyerAdapter = {
  type: 'claude-code',

  spawn(name: string, config: AgentConfig, cwd: string): AgentProcess {
    const args = [
      '--print',
      '--output-format', 'stream-json',
    ];

    if (config.config?.model) {
      args.push('--model', config.config.model);
    }

    if (config.config?.max_turns) {
      args.push('--max-turns', String(config.config.max_turns));
    }

    const child = spawn('claude', args, {
      cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env },
    });

    return { name, child, adapter: 'claude-code' };
  },

  sendTask(proc: AgentProcess, prompt: string): void {
    if (!proc.child.stdin) {
      throw new Error(`Cannot write to stdin of agent ${proc.name}`);
    }
    proc.child.stdin.write(prompt + '\n');
  },

  parseOutput(chunk: string): AgentEvent[] {
    const events: AgentEvent[] = [];
    const lines = chunk.split('\n').filter(l => l.trim());

    for (const line of lines) {
      try {
        const data = JSON.parse(line);

        switch (data.type) {
          case 'assistant': {
            const text = data.message?.content
              ?.filter((c: { type: string }) => c.type === 'text')
              ?.map((c: { text: string }) => c.text)
              ?.join('') ?? '';

            if (text) {
              events.push({ type: 'progress', content: text });
            }

            // Check for tool use
            const toolUses = data.message?.content?.filter(
              (c: { type: string }) => c.type === 'tool_use'
            );
            if (toolUses?.length > 0) {
              for (const tu of toolUses) {
                events.push({
                  type: 'tool_use',
                  content: `${tu.name}: ${JSON.stringify(tu.input).slice(0, 200)}`,
                });
              }
            }
            break;
          }

          case 'result': {
            events.push({
              type: 'result',
              content: data.result ?? '',
              sessionId: data.session_id,
              usage: data.usage ? {
                inputTokens: data.usage.input_tokens ?? 0,
                outputTokens: data.usage.output_tokens ?? 0,
              } : undefined,
            });
            break;
          }

          case 'error': {
            events.push({
              type: 'error',
              content: data.error?.message ?? data.message ?? 'Unknown error',
            });
            break;
          }
        }
      } catch {
        // Not JSON — skip
      }
    }

    return events;
  },

  async terminate(proc: AgentProcess): Promise<void> {
    return new Promise((resolve) => {
      if (proc.child.killed) {
        resolve();
        return;
      }

      proc.child.once('exit', () => resolve());
      proc.child.kill('SIGTERM');

      // Force kill after 5s
      setTimeout(() => {
        if (!proc.child.killed) {
          proc.child.kill('SIGKILL');
        }
        resolve();
      }, 5000);
    });
  },
};
