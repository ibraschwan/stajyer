<div align="center">

<img src="website/public/icon-512.png" alt="Stajyer" width="120" />

# stajyer

**Let your intern take over your job.**

Orchestrate multiple AI coding agents (Claude Code, Codex, Cursor) without databases or heavy frameworks.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/ibraschwan/stajyer/pulls)

[Website](https://stajyer.app) · [Documentation](https://stajyer.app/docs) · [Report Bug](https://github.com/ibraschwan/stajyer/issues) · [Request Feature](https://github.com/ibraschwan/stajyer/issues)

</div>

---

## The Problem

Running multiple AI agents on the same project creates three unsolved problems:

1. **The "Continue" Bottleneck** — Each agent finishes and waits for you to type "continue." You become a human message broker switching between 3+ terminals, 20+ times per hour.

2. **File Contention** — Multiple agents editing the same files simultaneously. `Error: File has been modified since read`. Changes silently overwrite each other.

3. **Blast Radius** — An agent makes a sweeping architectural change (moves routes, rewrites middleware, changes 5+ files) without approval. You spend 30 minutes reverting.

## The Solution

```bash
npx stajyer init        # Set up the workspace
stajyer hire lead        # Hire a lead agent (coordinator)
stajyer hire dev         # Hire dev agents (workers)
stajyer up               # Start the daemon — they work, you review
```

Stajyer is a lightweight CLI + daemon that sits on top of your existing AI agents and solves all three problems:

### Auto-Continue

Agents finish → daemon dispatches next task → zero human intervention.

```
[14:30] lead     ▶ Auditing codebase...
[14:32] lead     ✓ Created 5 tasks
[14:32] daemon   → Assigned 001 → frontend
[14:35] frontend ✓ Completed: error-boundaries
[14:35] daemon   → Assigned 003 → frontend    ← no "continue" needed
```

### Ownership Guard

Each agent owns specific directories. Protected files need lead approval.

```yaml
# .stajyer/config.yml
agents:
  frontend:
    owns: ["src/components/**"]
  backend:
    owns: ["src/app/api/**"]

protected:
  - path: "src/middleware.ts"
    requires: "lead"
```

### Markdown State

No database. State lives in markdown files. Git-trackable. Human-readable.

```
.stajyer/tasks/
├── 001-error-boundaries.md   ← git tracked
├── 002-api-tests.md          ← human readable
└── 003-skeleton-states.md    ← agent writable
```

## How It Compares

### Multi-Agent Orchestrators

| Feature | Stajyer | Paperclip | Stripe Minions | CrewAI | LangGraph |
|---------|---------|-----------|----------------|--------|-----------|
| Open source | **MIT** | MIT | No | MIT | MIT |
| Setup time | **5 min** | 15+ min | Years (internal) | 30+ min | 1+ hour |
| Auto-continue | **Yes** | Heartbeat | Yes | Built-in | Built-in |
| File conflict prevention | **Ownership guard** | DB permissions | Isolated devboxes | No | No |
| Database required | **No** | Postgres (35+ tables) | Internal | No | Optional |
| State format | **Markdown (git)** | Postgres | Internal DB | Python objects | State graph |
| Agent runtime | **Any CLI agent** | Any CLI agent | Goose fork | CrewAI only | LangChain only |
| Coding-specific | **Yes** | Yes | Yes | General purpose | General purpose |
| Available to public | **Yes** | Self-hosted | No | Yes | Yes |

### Single AI Agents (what Stajyer orchestrates)

| Agent | By | Open Source | Stajyer Adapter |
|-------|-----|-----------|-----------------|
| Claude Code | Anthropic | Source-available | **Supported** |
| Codex CLI | OpenAI | Apache 2.0 | **Supported** |
| Cursor | Anysphere | No | **Supported** |
| Aider | Paul Gauthier | Apache 2.0 | Planned |
| Cline | Community | Apache 2.0 | Planned |
| OpenHands | All Hands AI | MIT | Planned |
| Goose | Block | Apache 2.0 | Planned |

> Stajyer doesn't replace these agents — it orchestrates them. Run 3 Claude Code instances, or mix Claude Code + Codex + Cursor on the same project.

## The Experiment

This project was born from a real experiment: **3 AI agents, 17 tasks, 115 tests, 2 hours.**

We coordinated 3 Claude Code instances using nothing but shared markdown files and 4 simple rules. The results were impressive — but the user had to type "continue" 20+ times and deal with 5+ file conflicts.

Stajyer automates what the human had to do manually.

→ [Read the full experiment report](docs/EXPERIMENT-REPORT.md)

## The Name

**"Stajyer"** (staj·yer) means **"intern"** in Turkish.

Your AI agents are your interns. You're the boss. The CLI uses workplace language everyone understands:

| Command | What it does |
|---------|-------------|
| `stajyer hire` | Hire an intern (spawn an agent) |
| `stajyer assign` | Give them a task |
| `stajyer review` | Check their work |
| `stajyer fire` | Let them go (stop an agent) |
| `stajyer up` | Start the office (launch daemon) |

## Architecture

```
┌────────────────────────────────────────────────┐
│  CLI Layer (stajyer hire / assign / review)     │
├────────────────────────────────────────────────┤
│  Daemon (file watcher + task dispatcher)        │
├────────────────────────────────────────────────┤
│  Adapters                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Claude   │ │  Codex   │ │  Cursor  │       │
│  │  Code     │ │  CLI     │ │  Agent   │       │
│  └──────────┘ └──────────┘ └──────────┘       │
├────────────────────────────────────────────────┤
│  State Layer (markdown files in .stajyer/)      │
└────────────────────────────────────────────────┘
```

- **No database** — in-memory state + markdown sync
- **No server** — single Node.js daemon process
- **No framework lock-in** — adapter pattern for any CLI agent
- **Task-per-file** — eliminates file contention between agents

## Project Structure

```
stajyer/
├── cli/              # CLI tool (stajyer hire, assign, etc.)
├── website/          # stajyer.app landing page (Next.js)
├── docs/             # All project documentation
│   ├── VISION.md
│   ├── ARCHITECTURE.md
│   ├── EXPERIMENT-REPORT.md
│   ├── COMPETITIVE-ANALYSIS.md
│   ├── CLI-DESIGN.md
│   ├── ROADMAP.md
│   └── LANDING-PAGE.md
└── CLAUDE.md         # AI agent instructions for this repo
```

## Roadmap

- [x] Experiment validation (3 agents, 17 tasks)
- [x] Architecture design
- [x] CLI design
- [x] Landing page (stajyer.app)
- [ ] `stajyer init` — workspace setup
- [ ] `stajyer hire` — agent spawning with adapters
- [ ] `stajyer up` — daemon with auto-continue
- [ ] Ownership guard system
- [ ] Claude Code adapter
- [ ] Codex adapter
- [ ] Cursor adapter
- [ ] Terminal dashboard (TUI)
- [ ] Stajyer Cloud (web dashboard, team features)

## Contributing

Contributions are welcome! Please read the docs first:

1. [Vision](docs/VISION.md) — understand what Stajyer is (and isn't)
2. [Architecture](docs/ARCHITECTURE.md) — how it works
3. [CLI Design](docs/CLI-DESIGN.md) — command structure

```bash
git clone https://github.com/ibraschwan/stajyer.git
cd stajyer
npm install
```

## License

MIT — free forever. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built by developers who got tired of typing "continue".**

[stajyer.app](https://stajyer.app)

</div>
