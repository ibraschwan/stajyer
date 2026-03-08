# Roadmap

## v0.1 — "Heartbeat" (MVP)

**Goal:** Solve the "continue" bottleneck. Just this is enough value.

- [ ] `stajyer init` — Project structure creation with interactive wizard
- [ ] `stajyer up` — Daemon + process manager
- [ ] `stajyer down` — Graceful shutdown
- [ ] Claude Code adapter (`--print` + stream-json parsing)
- [ ] Task-per-file system with frontmatter (gray-matter)
- [ ] Auto-dispatch: agent finishes → daemon pipes next task
- [ ] Lead notification when workers are idle
- [ ] `stajyer status` — Agent states
- [ ] `stajyer task` — Create tasks from CLI
- [ ] `stajyer tasks` — List tasks
- [ ] `stajyer watch` — Terminal dashboard (ink)
- [ ] `stajyer logs` — Stream agent output
- [ ] Crash recovery: save session ID → restart with --resume
- [ ] npm package: `npx stajyer init` works

**Ship criteria:** 3 Claude Code instances coordinate on a real project without user typing "continue."

## v0.2 — "Guard"

**Goal:** Prevent the landing page disaster. Blast radius protection.

- [ ] File ownership enforcement (config.yml `owns` field)
- [ ] Protected path system (lead approval for middleware, config files)
- [ ] Build runner isolation (only lead runs build/test)
- [ ] Local lint on file save (shift-left, < 5s)
- [ ] Max 2 CI rounds rule
- [ ] Conditional rules (directory-based rule files in .stajyer/rules/)
- [ ] Phantom task audit (lead's first task: scan → create tasks)
- [ ] `stajyer review` — View completed task diffs

## v0.3 — "Fleet"

**Goal:** Support Codex, Cursor, and custom agents.

- [ ] Codex adapter
- [ ] Cursor adapter
- [ ] Custom adapter (any stdin/stdout CLI)
- [ ] Token tracking per agent
- [ ] Budget enforcement (max tokens per task / per agent)
- [ ] `stajyer costs` — Token usage dashboard
- [ ] `stajyer hire` / `stajyer fire` — Dynamic agent management
- [ ] Session persistence across daemon restarts (markdown-backed)

## v0.4 — "Autopilot"

**Goal:** Fully autonomous lead-worker cycle.

- [ ] Lead → Worker delegation cycle (lead creates tasks, workers execute, lead reviews, repeat)
- [ ] Task dependency graph (task B waits for task A)
- [ ] Auto PR creation (task done → `gh pr create`)
- [ ] Slack / Discord notifications
- [ ] `stajyer import` — Import existing agents/ markdown setups
- [ ] Templates: "Next.js team", "Python API team", "React Native team"

## v1.0 — "Production"

- [ ] Optional SQLite state backend (for larger projects)
- [ ] Web dashboard at stajyer.app (remote monitoring)
- [ ] MCP server mode (agents can use stajyer as MCP tool)
- [ ] Plugin system for community adapters
- [ ] Team mode: multiple developers, shared task board
- [ ] `stajyer export` — Share agent configs
- [ ] Comprehensive docs at stajyer.app/docs
