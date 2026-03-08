# Stajyer — Product Vision

**"Let your stajyer take over your job."**

## The Problem

2026: AI coding agents are production-ready. Claude Code, Codex, Cursor — each one powerful alone. But running multiple agents on the same project creates three unsolved problems:

### 1. The "Continue" Bottleneck

```
Terminal 1: [Claude Code] → task done → waiting for "continue"...
Terminal 2: [Claude Code] → task done → waiting for "continue"...
Terminal 3: [Codex]       → task done → waiting for "continue"...

You: Switch to Terminal 1 → type "continue" → switch to Terminal 2 → type "continue" → ...
```

The user becomes a **human message broker**. AI's parallel advantage is nullified by human sequential "continue" typing. In our experiment, the user had to switch terminals 20+ times in 2 hours.

### 2. File Contention

Multiple agents editing the same files simultaneously:

```
Error: File has been modified since read
```

We hit this 5+ times in our experiment. No automatic resolution. Agent changes can silently overwrite each other.

### 3. Blast Radius

An agent makes a sweeping architectural change (moves routes, rewrites middleware, changes 5+ files) without approval. In our experiment, this caused a 30-minute revert. No guardrails exist in the current workflow.

## The Solution

Stajyer is a CLI tool and daemon that sits on top of existing AI agents and solves all three problems:

```bash
npx stajyer init        # Set up the workspace
npx stajyer hire lead   # Hire a lead agent (coordinator)
npx stajyer hire dev    # Hire a dev agent (worker)
npx stajyer up          # Start the daemon — agents work autonomously
```

**What the daemon does:**

1. **Auto-Continue** — Detects when an agent finishes, checks the task queue, pipes the next task automatically. No human "continue" needed.
2. **Task-per-File** — Each task is its own markdown file. Agents never edit the same file. Zero contention.
3. **Ownership Guard** — Agents own specific directories. Protected files require lead approval before changes apply.

## The Metaphor

"Stajyer" means "intern" in Turkish.

Your AI agents are your interns. You're the boss.
- `stajyer hire` — Hire an intern
- `stajyer assign` — Give them a task
- `stajyer review` — Check their work
- `stajyer fire` — Let them go

No jargon. No "spawn daemon" or "dispatch orchestrator." Just workplace language everyone understands.

## What Stajyer Is NOT

- **Not an agent framework** — Doesn't build agents. Orchestrates existing ones.
- **Not a chatbot** — No chat UI. CLI + daemon.
- **Not a database** — State lives in markdown files. Git-trackable. Human-readable.
- **Not a Paperclip competitor** — Paperclip models companies with org charts and budgets. Stajyer coordinates interns on a single project.
- **Not a LangGraph alternative** — No graph definitions. No state machines. Just files and processes.

**Stajyer is Docker Compose for AI agents.** It doesn't build containers. It orchestrates them.

## The Opportunity

| Tool | Setup Time | Multi-Agent | Auto-Continue | DB Required |
|------|-----------|-------------|---------------|-------------|
| Raw terminals | 0 min | Manual | No | No |
| Markdown protocol | 5 min | File-based | No | No |
| **Stajyer** | **5 min** | **Daemon** | **Yes** | **No** |
| Paperclip | 15+ min | Heartbeat | Yes | Postgres |
| LangGraph | Hours | Graph-based | N/A | Optional |
| Stripe Minions | Years | Isolated | Yes | Internal |

Stajyer occupies the empty quadrant: **fast setup + automatic coordination.**
