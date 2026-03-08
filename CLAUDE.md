# Stajyer — AI Agent Orchestration Tool

**Domain:** stajyer.app
**Tagline:** "Let your stajyer take over your job."
**What it is:** A lightweight CLI + daemon that orchestrates multiple AI coding agents (Claude Code, Codex, Cursor) without databases or heavy frameworks.

## Read These First

All project knowledge lives in `/docs`. Read them in this order:

1. `docs/VISION.md` — Product vision, why it exists, what it does
2. `docs/EXPERIMENT-REPORT.md` — The real multi-agent experiment that inspired this (3 agents, 2 hours, 17+ tasks)
3. `docs/ARCHITECTURE.md` — Technical architecture, 5 layers, how the daemon works
4. `docs/COMPETITIVE-ANALYSIS.md` — Deep analysis of Paperclip (source code) and Stripe Minions (blog post)
5. `docs/CLI-DESIGN.md` — CLI commands, UX, terminal dashboard design
6. `docs/ROADMAP.md` — v0.1 → v1.0, prioritized feature list
7. `docs/LANDING-PAGE.md` — stajyer.app website concept and copy

## Core Concept

The "continue" bottleneck: when you run multiple AI agents, each one waits for the user to type "continue" after finishing a task. The user becomes a human message broker switching between terminals. Stajyer solves this with a daemon that watches task files and auto-dispatches work to idle agents.

## Branding

- "stajyer" = "intern" in Turkish
- The metaphor: AI agents are your interns. You're the boss. You assign tasks, they work, you review.
- CLI uses workplace language: `hire`, `assign`, `review`, `fire` instead of `spawn`, `dispatch`, `kill`
- Landing page hero: "Let your [stajyer/intern/stagiaire/praktikant/実習生] take over your job" — the word rotates through languages

## Tech Decisions

- **Markdown as state** — Tasks, comms, agent profiles are all .md files. Git-trackable, human-readable.
- **No database** — In-memory state + markdown sync. DB is optional (SQLite) for v1.0+
- **Daemon architecture** — Single Node.js process, chokidar for file watching, child_process for agent management
- **Adapter pattern** — claude-code, codex, cursor, custom adapters. Same interface, different runtimes.
- **Task-per-file** — Each task is its own .md file. Eliminates file contention (the #1 problem from our experiment).

## Key Insight

Paperclip uses 35+ Postgres tables for agent orchestration. Stripe built years of internal tooling. We proved that markdown files + 4 rules can coordinate 3 agents to complete 17+ tasks in 2 hours. The missing piece is a lightweight daemon that auto-continues agents and prevents file conflicts. That's Stajyer.
