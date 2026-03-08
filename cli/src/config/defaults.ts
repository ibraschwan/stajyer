import type { StajyerConfig } from './schema.js';

export function defaultConfig(projectName: string): StajyerConfig {
  return {
    project: {
      name: projectName,
      description: '',
    },
    agents: {
      lead: {
        adapter: 'claude-code',
        config: {
          model: 'claude-sonnet-4-6',
          max_turns: 50,
        },
        role: [
          'You are the lead. You coordinate the team.',
          'Your first task: audit the codebase, create tasks for gaps.',
          "You don't write code — you plan, review, and delegate.",
        ].join('\n'),
        owns: [],
      },
      'dev-1': {
        adapter: 'claude-code',
        config: {
          model: 'claude-sonnet-4-6',
          max_turns: 30,
        },
        role: 'You are a developer. You write code, fix bugs, and write tests.',
        owns: ['src/**'],
      },
    },
    protected: [
      { path: '.env*', requires: 'never' },
      { path: 'package.json', requires: 'lead' },
    ],
    rules: {
      auto_assign: true,
      require_build_on_complete: false,
      max_ci_rounds: 2,
    },
  };
}

export const GLOBAL_RULES_TEMPLATE = `# Global Rules

These rules apply to ALL agents.

## Communication
- Write status updates in your task file under "## Agent Notes"
- Never edit another agent's task file
- If you need to communicate, write to .stajyer/comms/general.md

## Code Quality
- Run type-check before marking a task as done
- Follow existing code style and conventions
- Don't modify files outside your ownership scope

## Task Lifecycle
- Read the full task description before starting
- Update task status to "in_progress" when you begin
- Update task status to "done" when complete
- If stuck, set status to "needs_human" with a note explaining why
`;

export const AGENT_PROFILE_TEMPLATE = (name: string, role: string) => `# Agent: ${name}

## Role
${role}

## Status
idle

## Session History
(auto-updated by daemon)
`;
