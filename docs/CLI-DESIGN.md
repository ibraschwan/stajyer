# CLI Design

## Command Reference

All commands use workplace metaphor. No "spawn", "daemon", "dispatch" — just "hire", "assign", "review", "fire".

```bash
# Setup
npx stajyer init                        # Create .stajyer/ directory structure
npx stajyer init --interactive           # Guided wizard

# Lifecycle
stajyer up                               # Start daemon + all agents
stajyer up --agent lead                  # Start only lead agent
stajyer up --dry-run                     # Show what would start without starting
stajyer down                             # Gracefully stop everything
stajyer restart                          # Down + Up

# Hiring (agent management)
stajyer hire lead                        # Add lead agent (interactive config)
stajyer hire dev --name frontend         # Add a worker named "frontend"
stajyer hire dev --adapter codex         # Add a Codex worker
stajyer fire frontend                    # Remove an agent
stajyer promote dev-1 lead              # Change agent role

# Task management
stajyer task "Fix the auth bug"          # Create task (auto-assigns to available worker)
stajyer task "Write API tests" --to backend   # Create + assign to specific agent
stajyer tasks                            # List all tasks with status
stajyer tasks --status pending           # Filter by status
stajyer assign 003 frontend             # Assign existing task to agent

# Monitoring
stajyer status                           # Agent states + current tasks
stajyer watch                            # Real-time terminal dashboard
stajyer logs frontend                    # Stream agent logs
stajyer logs --all                       # All agent logs interleaved
stajyer costs                            # Token usage per agent

# Agent interaction
stajyer wake backend                     # Manually wake an idle agent
stajyer pause frontend                   # Pause agent (finish current task, then idle)
stajyer review                           # Show completed tasks awaiting review
stajyer review 003 --approve             # Mark task as reviewed/approved

# Utilities
stajyer history                          # Timeline of completed tasks
stajyer import ./agents                  # Import existing agents/ markdown setup
stajyer export                           # Export config for sharing
stajyer doctor                           # Check dependencies (claude CLI, node, etc.)
```

---

## Terminal Dashboard (`stajyer watch`)

Built with ink (React for terminals). Updates in real-time.

```
┌─────────────────────────────────────────────────────────────────┐
│  stajyer v0.1.0 — my-project — 3 agents                        │
├────────────┬──────────┬─────────────────────────┬───────────────┤
│  Agent     │  Status  │  Current Task           │  Tokens       │
├────────────┼──────────┼─────────────────────────┼───────────────┤
│  lead      │  ● idle  │  —                      │  12,400       │
│  frontend  │  ▶ work  │  003-skeleton-states    │  45,200       │
│  backend   │  ▶ work  │  002-api-tests          │  38,100       │
├────────────┴──────────┴─────────────────────────┴───────────────┤
│  Queue: 2 pending │ 2 in progress │ 5 done │ 0 failed          │
├─────────────────────────────────────────────────────────────────┤
│  [14:35] frontend  ✓ Completed: 001-error-boundaries            │
│  [14:35] daemon    → Auto-assigned 003-skeleton-states → frontend│
│  [14:34] backend   ▶ Started: 002-api-tests                     │
│  [14:33] lead      + Created: 003-skeleton-states                │
│  [14:32] lead      + Created: 002-api-tests                     │
│  [14:31] lead      ✓ Completed: 000-codebase-audit              │
│  [14:30] daemon    ⚡ All agents started                         │
├─────────────────────────────────────────────────────────────────┤
│  [q] quit  [p] pause all  [t] new task  [l] logs  [c] costs    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Config File

```yaml
# .stajyer/config.yml

project:
  name: "my-project"
  description: "Next.js SaaS application"

agents:
  lead:
    adapter: claude-code
    config:
      model: claude-opus-4-6
      effort: high
      max_turns: 50
    role: |
      You are the lead. You coordinate the team.
      Your first task: audit the codebase, create tasks for gaps.
      You don't write code — you plan, review, and delegate.
    owns: []

  frontend:
    adapter: claude-code
    config:
      model: claude-sonnet-4-6
      effort: medium
      max_turns: 30
    role: |
      You are the frontend developer.
      You write React components, pages, styles, and frontend tests.
    owns:
      - "src/components/**"
      - "src/app/**/page.tsx"
      - "src/app/**/layout.tsx"
      - "src/__tests__/**/*.test.tsx"

  backend:
    adapter: claude-code
    config:
      model: claude-sonnet-4-6
      effort: medium
      max_turns: 30
    role: |
      You are the backend developer.
      You write API routes, middleware, database logic, and backend tests.
    owns:
      - "src/app/api/**"
      - "src/lib/**"
      - "src/middleware.ts"
      - "src/__tests__/**/*.test.ts"

protected:
  - path: "src/middleware.ts"
    requires: "lead"
  - path: "package.json"
    requires: "build-pass"
  - path: ".env*"
    requires: "never"
  - path: "*.config.*"
    requires: "lead"

rules:
  build_runner: "lead"
  max_ci_rounds: 2
  local_lint_on_save: true
  phantom_task_audit: true
  auto_assign: true              # Auto-assign pending tasks to idle agents
  require_build_on_complete: true
```

---

## First-Run Experience

```bash
$ npx stajyer init

  Welcome to Stajyer — your AI intern coordinator.

  ? Project name: my-saas-app
  ? What kind of project? (Next.js / Python / React Native / Custom)
    > Next.js
  ? How many interns do you need?
    > 1 lead + 2 workers
  ? Which AI agents? (Claude Code / Codex / Cursor / Custom)
    > Claude Code for all

  Created .stajyer/config.yml
  Created .stajyer/tasks/
  Created .stajyer/comms/
  Created .stajyer/agents/ (lead, dev-1, dev-2)
  Created .stajyer/rules/ (global.md, components.md, api.md)

  Next steps:
    1. Review .stajyer/config.yml
    2. Run: stajyer up
    3. Create your first task: stajyer task "Build the login page"

  Or let the lead handle everything:
    stajyer up
    stajyer task "Audit codebase and create tasks for all gaps" --to lead
```
