# Paperclip Source Code Notes

Raw findings from analyzing github.com/paperclipai/paperclip source code.
These are implementation details useful when building Stajyer.

---

## How Paperclip Spawns Claude Code

File: `packages/adapters/claude-local/src/server/execute.ts`

```
Command: claude --print --output-format stream-json
Flags:
  --session-id <id>           Resume existing session
  --model <model>             Model selection
  --max-turns <n>             Limit turns per run
  --dangerously-skip-permissions   Skip permission checks
  --add-dir <path>            Add skills directory
  --chrome                    Enable Chrome integration
  --effort <low|medium|high>  Reasoning effort

Stdin: prompt text (task instructions + context)
Stdout: stream-json events (parsed line by line)
```

### Stream JSON parsing

Paperclip's `parseClaudeStreamJson()` extracts:
- `resultJson` — Final result
- `usage` — `{ inputTokens, cachedInputTokens, outputTokens }`
- `sessionId` — For resume
- `model` — Which model was used
- `costUsd` — Total cost
- `summary` — Text summary of what was done

### Session recovery

If Claude reports "unknown session" error on resume:
1. Log: "session unavailable; retrying with fresh session"
2. Retry with `sessionId: null` (fresh start)
3. Set `clearSession: true` in result

### Skills injection

Creates temp directory with `.claude/skills/` containing symlinks to skills from repo's `skills/` directory. Passes via `--add-dir`. Cleaned up after run.

---

## Heartbeat Service

File: `server/src/services/heartbeat.ts`

### Constants
- `MAX_LIVE_LOG_CHUNK_BYTES = 8 * 1024` (8KB)
- `HEARTBEAT_MAX_CONCURRENT_RUNS_DEFAULT = 1`
- `HEARTBEAT_MAX_CONCURRENT_RUNS_MAX = 10`
- `MAX_EXCERPT_BYTES` (from adapter-utils)

### Agent start locking

```typescript
// Prevents concurrent starts of same agent
const startLocksByAgent = new Map<string, Promise<void>>();

async function withAgentStartLock<T>(agentId: string, fn: () => Promise<T>) {
  const previous = startLocksByAgent.get(agentId) ?? Promise.resolve();
  const run = previous.then(fn);
  // ...serializes starts per agent
}
```

### Wakeup sources

```typescript
interface WakeupOptions {
  source?: "timer" | "assignment" | "on_demand" | "automation";
  triggerDetail?: "manual" | "ping" | "callback" | "system";
  reason?: string | null;
  payload?: Record<string, unknown> | null;
  idempotencyKey?: string | null;
  requestedByActorType?: "user" | "agent" | "system";
  requestedByActorId?: string | null;
  contextSnapshot?: Record<string, unknown>;
}
```

### Workspace resolution

```typescript
type ResolvedWorkspaceForRun = {
  cwd: string;
  source: "project_primary" | "task_session" | "agent_home";
  projectId: string | null;
};
```

Three workspace sources, in priority order:
1. `project_primary` — Project's configured workspace
2. `task_session` — Previous session's workspace (for resume)
3. `agent_home` — Agent's default home directory

---

## Task Checkout & Wakeup

File: `server/src/routes/issues-checkout-wakeup.ts`

```typescript
type CheckoutWakeInput = {
  actorType: "board" | "agent" | "none";
  actorAgentId: string | null;
  checkoutAgentId: string;
  checkoutRunId: string | null;
};

export function shouldWakeAssigneeOnCheckout(input: CheckoutWakeInput): boolean {
  // Don't wake if:
  // - Actor is the same agent (already running, assigned to self)
  // - Actor is an agent AND same as checkout agent AND has a run ID
  // Wake in all other cases (human assigned, different agent assigned, etc.)
  if (input.actorType !== "agent") return true;
  if (!input.actorAgentId) return true;
  if (input.actorAgentId !== input.checkoutAgentId) return true;
  if (!input.checkoutRunId) return true;
  return false;
}
```

**Key insight for Stajyer:** When lead assigns a task to worker, worker should auto-wake. When worker picks up its own next task from queue, no need to "wake" (already running).

---

## Database Schema (35+ tables)

### Agent-related
- `agents` — Agent definitions (name, type, config)
- `agent_runtime_state` — Current state (running, idle, etc.)
- `agent_task_sessions` — Which agent is working on what, in which workspace
- `agent_wakeup_requests` — Pending wakeup requests
- `agent_api_keys` — API keys for agents
- `agent_config_revisions` — Config change history

### Task/Issue-related
- `issues` — Tasks/tickets
- `issue_comments` — Discussion on tasks
- `issue_labels` — Categorization
- `issue_attachments` — Files attached to tasks
- `issue_approvals` — Approval status
- `issue_read_states` — Who has read what

### Heartbeat-related
- `heartbeat_runs` — Each agent run
- `heartbeat_run_events` — Events within a run

### Organization
- `companies` — Multi-company support
- `company_memberships` — Who belongs where
- `company_secrets` / `company_secret_versions` — Secret management
- `goals` — Company/project goals
- `project_goals` — Goal-project relationships
- `projects` — Projects within companies
- `project_workspaces` — Workspace definitions

### Governance
- `approvals` — General approval system
- `approval_comments` — Discussion on approvals
- `principal_permission_grants` — Permission system
- `labels` — Label definitions

### Cost
- `cost_events` — Token/cost tracking per run

### Auth/Access
- `auth` — Authentication
- `instance_user_roles` — User roles
- `invites` — Invitation system
- `join_requests` — Request to join

### Other
- `assets` — File/asset storage
- `activity_log` — Full audit trail

---

## Adapter Registry

File: `packages/adapters/`

Available adapters:
- `claude-local` — Claude Code CLI
- `codex-local` — Codex CLI
- `cursor-local` — Cursor CLI
- `openclaw-gateway` — OpenClaw via HTTP gateway
- `opencode-local` — OpenCode CLI
- `pi-local` — Pi CLI

Utility packages:
- `adapter-utils` — Shared utilities for all adapters
- `create-agent-adapter` — Scaffold new adapter

Each adapter exports:
```typescript
export const type = "claude_local";
export const label = "Claude Code (local)";
export const models = [
  { id: "claude-opus-4-6", label: "Claude Opus 4.6" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6" },
  // ...
];
export const agentConfigurationDoc = `...markdown documentation...`;
```

Plus `server/execute.ts` with the actual spawn + parse logic.
