# Competitive Analysis

Deep analysis based on Paperclip source code review and Stripe Minions blog post.

---

## 1. Paperclip (github.com/paperclipai/paperclip)

**What:** "Open-source orchestration for zero-human companies"
**Stars:** 10,000+
**Stack:** Node.js, TypeScript, Postgres (Drizzle ORM), React UI
**License:** MIT

### Architecture (from source code analysis)

**Monorepo structure:**
```
packages/
├── db/              # Drizzle ORM, 35+ schema files
├── shared/          # Shared types
├── adapters/        # Agent runtime adapters
│   ├── claude-local/    # Spawns `claude --print`
│   ├── codex-local/
│   ├── cursor-local/
│   └── openclaw-gateway/
├── adapter-utils/   # Shared adapter utilities
server/              # Express API server
cli/                 # CLI tool
ui/                  # React dashboard
skills/              # Agent skills (injected at runtime)
```

**Database (35+ tables):**
- `agents`, `agent_runtime_state`, `agent_task_sessions`, `agent_wakeup_requests`
- `issues`, `issue_comments`, `issue_labels`, `issue_attachments`, `issue_approvals`, `issue_read_states`
- `heartbeat_runs`, `heartbeat_run_events`
- `companies`, `company_memberships`, `company_secrets`, `company_secret_versions`
- `goals`, `project_goals`, `projects`, `project_workspaces`
- `approvals`, `approval_comments`
- `cost_events`
- `labels`, `assets`, `activity_log`
- `auth`, `instance_user_roles`, `invites`, `join_requests`
- `agent_api_keys`, `agent_config_revisions`
- `principal_permission_grants`

### Heartbeat System (from server/src/services/heartbeat.ts)

The core mechanism. Key findings:

```typescript
// Wakeup sources
interface WakeupOptions {
  source?: "timer" | "assignment" | "on_demand" | "automation";
  triggerDetail?: "manual" | "ping" | "callback" | "system";
  reason?: string | null;
  requestedByActorType?: "user" | "agent" | "system";
}
```

- Agents wake on a schedule (timer), when assigned a task (assignment), manually (on_demand), or via automation
- `shouldWakeAssigneeOnCheckout()` — When a task is assigned to an agent, auto-wake that agent. But if the agent assigned it to itself (already running), don't wake.
- Max concurrent runs per agent: 1-10 (configurable, default 1)
- Agent start operations are serialized per agent via `withAgentStartLock()`
- Session persistence: agents resume from where they left off across heartbeats

### Claude Code Adapter (from packages/adapters/claude-local/)

How Paperclip spawns Claude Code:

```typescript
// Spawns: claude --print --output-format stream-json --session-id <id>
// Reads JSON stream from stdout
// Parses: result, usage (tokens), session_id, model, cost_usd
// On crash: detects "unknown session" error → retries with fresh session
// Skills: creates temp dir with .claude/skills/ symlinks, passes via --add-dir
```

Key details:
- Uses `--print` flag for non-interactive mode
- Stdin receives the prompt, stdout emits stream-json
- Tracks billing type: "api" (ANTHROPIC_API_KEY) vs "subscription" (local login)
- Detects login required state and surfaces loginUrl
- Max turns per run configurable (`maxTurnsPerRun`)
- `dangerouslySkipPermissions` option exists (passes `--dangerously-skip-permissions`)

### Strengths
- Full-featured: org charts, budgets, governance, approvals, audit trail
- Adapter pattern is excellent — supports Claude, Codex, Cursor, custom
- Session persistence across crashes
- Atomic task checkout (no double-work)
- Multi-company isolation

### Weaknesses
- Heavy setup: Postgres required, server deployment, UI
- 35+ tables for what is often a single-developer use case
- "Company" metaphor doesn't fit every project
- No git-trackable state — everything in DB
- Overkill for "I just want 3 Claude Code instances to not conflict"

### What Stajyer Takes From Paperclip
1. Adapter pattern (different agents, same interface)
2. Wakeup mechanism concept (but file-based, not DB-based)
3. Session persistence idea (store session ID in task markdown)
4. `shouldWakeAssigneeOnCheckout()` logic (auto-dispatch on assignment)

### What Stajyer Does Differently
1. Markdown instead of Postgres (git-trackable, human-readable)
2. In-memory daemon instead of server (no deployment)
3. Task-per-file instead of issues table (no contention)
4. Workplace metaphor instead of company metaphor (simpler mental model)

---

## 2. Stripe Minions (stripe.dev/blog, February 2026)

**What:** Stripe's internal one-shot coding agents
**Scale:** 1,000+ PRs merged per week, fully agent-produced, human-reviewed
**Stack:** Fork of Block's "goose" agent, custom devboxes, MCP

### Architecture (from blog post)

**Flow:**
```
Slack message → Minion spawns in isolated devbox →
  Context gathering (MCP tools, links) →
  Agent loop (goose fork) interleaved with deterministic steps →
  Local lint (<5s) → CI run → Fix if needed → CI run #2 (max) →
  Branch + PR ready for review
```

**Key Design Decisions:**

1. **One-shot, not iterative** — Task starts from Slack, ends in a PR. Zero interaction in between. Engineers spin up multiple minions in parallel.

2. **Isolated devboxes** — Each minion gets its own machine. Pre-warmed, spins up in 10 seconds. Stripe code + services pre-loaded. Isolated from production and internet. No git worktrees (don't scale at Stripe's size).

3. **Goose fork** — Block's open-source coding agent, customized. Orchestration flow interleaves agent loops with deterministic code (git, linters, testing). "Mix creativity of agent with assurance they'll always complete required steps."

4. **Conditional agent rules** — "Almost all agent rules at Stripe are conditionally applied based on subdirectories." Impractical to have many unconditional rules at scale.

5. **MCP with 400+ tools** — Central internal MCP server called "Toolshed." Context like internal docs, ticket details, build statuses, code intelligence (Sourcegraph). "We deterministically run relevant MCP tools over likely-looking links before a minion run even starts."

6. **Shift feedback left** — Local executable on git push, heuristic-based lint selection, <5 seconds. "Best for humans and agents if any lint step that would fail in CI is enforced in the IDE or on a git push."

7. **At most two CI rounds** — "Diminishing marginal returns for an LLM to run many rounds of a full CI loop." First CI run. If fail → fix → second CI run. Then done. If still failing, human takes over.

8. **Autofix for CI failures** — Many tests have autofixes for failures, automatically applied. Only failures without autofixes go back to the minion.

### Strengths
- Proven at massive scale (hundreds of millions of lines of code, $1T+ payment volume)
- Perfect isolation — no file contention, no build conflicts
- One-shot means no coordination overhead between agents
- Deep integration with existing developer tooling

### Weaknesses
- Years of investment in internal tooling — not replicable
- No agent-to-agent coordination — each minion is isolated
- Task decomposition done by humans (engineer decides what each minion does)
- Not open source, not available outside Stripe

### What Stajyer Takes From Stripe
1. "At most two CI rounds" as default rule
2. "Shift feedback left" — local lint on save
3. Conditional rules by subdirectory
4. Pre-hydrating context before agent starts (phantom task audit)
5. Deterministic interleaving concept (lint/test checkpoints)

### What Stajyer Does Differently
1. Agents CAN coordinate (lead assigns tasks to workers)
2. Shared codebase (not isolated environments) — with ownership guard
3. Available as npm package (not internal tooling)
4. Lightweight (no devbox infra needed)

---

## 3. Other Players

### LangGraph
- Python graph-based agent orchestration
- Powerful but heavy: graph definitions, node functions, edge logic
- Framework lock-in
- Not designed for CLI coding agents specifically

### CrewAI
- Python multi-agent framework with role-based agents
- "Crew" metaphor (similar to Stajyer's "intern" metaphor)
- Tightly coupled — agents must be built within CrewAI
- Not a coordination layer for existing CLI tools

### AutoGen (Microsoft)
- Multi-agent conversation framework
- Conversation-based coordination (agents talk to each other)
- Python-centric
- More suited for chat/reasoning tasks than coding

### Claude Code Subagents
- Built-in: Claude Code can spawn subagents via the Agent tool
- Limited: subagents can't persist, can't run in parallel terminals, no file ownership
- Not a coordination layer — it's a single-session feature

---

## Positioning Matrix

```
                    Light ←──────────────────────→ Heavy
                      │                              │
  Coding-specific     │   Stajyer        Paperclip   │
                      │     ↑               ↑        │
                      │     │               │        │
                      │     │               │        │
  General-purpose     │   (gap)    LangGraph/CrewAI  │
                      │                              │
                      │              AutoGen          │
                      │                              │
```

Stajyer's position: **lightweight + coding-specific.** The only tool in that quadrant.
