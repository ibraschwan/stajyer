# Stajyer Documentation Index

## Quick Context

Stajyer is a CLI tool + daemon that orchestrates multiple AI coding agents. Born from a real experiment where 3 AI agents coordinated via markdown files and completed 17+ tasks in 2 hours — but the user had to type "continue" 20+ times and deal with file conflicts.

**Domain:** stajyer.app
**Core insight:** The "continue" bottleneck — AI agents wait for human input between tasks. Stajyer's daemon auto-dispatches the next task.
**Analogy:** Docker Compose for AI agents.

## Document Map

| Doc | What It Contains | Read When |
|-----|-----------------|-----------|
| [VISION.md](./VISION.md) | Product definition, problem, solution, positioning | Starting any work |
| [EXPERIMENT-REPORT.md](./EXPERIMENT-REPORT.md) | The real 3-agent experiment — what worked, what broke, why | Understanding the origin story |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 5-layer technical design, daemon internals, adapter interface | Building the CLI/daemon |
| [COMPETITIVE-ANALYSIS.md](./COMPETITIVE-ANALYSIS.md) | Deep analysis of Paperclip (source code) and Stripe Minions | Making design decisions |
| [CLI-DESIGN.md](./CLI-DESIGN.md) | All commands, config format, terminal dashboard design | Building the CLI UX |
| [ROADMAP.md](./ROADMAP.md) | v0.1 → v1.0, prioritized checklist | Planning sprints |
| [LANDING-PAGE.md](./LANDING-PAGE.md) | stajyer.app website concept, hero animation, copy, sections | Building the website |
| [GO-TO-MARKET.md](./GO-TO-MARKET.md) | Launch strategy, distribution, monetization | Planning launch |
| [PAPERCLIP-SOURCE-NOTES.md](./PAPERCLIP-SOURCE-NOTES.md) | Raw findings from Paperclip repo analysis | Implementing adapters, heartbeat, wakeup |
| [STRIPE-MINIONS-NOTES.md](./STRIPE-MINIONS-NOTES.md) | Key takeaways from Stripe's Minions blog post | Implementing CI rules, conditional rules |

## Key Technical References

- **Claude Code `--print` mode:** How to spawn Claude non-interactively → see PAPERCLIP-SOURCE-NOTES.md
- **`shouldWakeAssigneeOnCheckout()`:** Core dispatch logic → see PAPERCLIP-SOURCE-NOTES.md
- **Stream JSON parsing:** How to read Claude's output → see PAPERCLIP-SOURCE-NOTES.md
- **Task file format:** Frontmatter + markdown body → see ARCHITECTURE.md Layer 1
- **Config.yml schema:** Agent definitions, rules, protected paths → see CLI-DESIGN.md
- **Adapter interface:** TypeScript interface for agent adapters → see ARCHITECTURE.md Layer 5
