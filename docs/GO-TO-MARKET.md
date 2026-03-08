# Go-to-Market Strategy

## Phase 1: Build in Public (Week 1-4)

### Target
Solo developers and small indie teams who use Claude Code / Codex daily and have felt the "continue" pain.

### Actions
1. **Ship v0.1 on npm** — `npx stajyer init` must work
2. **Launch stajyer.app** — Landing page with the rotating languages hero
3. **GitHub repo** — MIT license, clear README, contributing guide
4. **Demo video** — 2-minute screencast: init → hire 3 agents → watch them work autonomously
5. **Twitter/X thread** — "I ran 3 AI agents on one project. Here's what happened." (the experiment story)
6. **Blog post** — Full experiment report adapted for dev audience (English)

### Distribution channels
- Hacker News ("Show HN: Stajyer — Docker Compose for AI coding agents")
- r/ClaudeAI, r/LocalLLaMA, r/programming
- AI Twitter (tag Anthropic devrel, Paperclip creators)
- Dev.to / Hashnode cross-post
- Product Hunt launch

### Messaging
**Primary:** "Stop typing 'continue'. Let your AI interns work."
**Secondary:** "Markdown-based agent coordination. No database. No framework. Just `npx`."
**Technical:** "File watcher daemon that auto-dispatches tasks to idle Claude Code instances."

## Phase 2: Community (Week 4-8)

- Discord server for users and contributors
- Adapter contributions (Codex, Cursor, custom)
- Template contributions ("Next.js team", "Python API team")
- Bug fixes and feature requests from real usage
- v0.2 release (ownership guard)

## Phase 3: Cloud Waitlist (Week 8-12)

- stajyer.app/cloud — waitlist for web dashboard
- Collect emails and usage patterns
- Understand what users want from cloud vs CLI
- Plan pricing

## Monetization Model

### Open Source (forever free)
- CLI tool
- All adapters
- All features
- No limits

### Stajyer Cloud (future, paid)
- **Web dashboard** — Monitor agents from browser/phone
- **Team mode** — Multiple developers, shared task board, permissions
- **Analytics** — Token usage trends, agent efficiency metrics, cost optimization
- **Templates store** — Premium pre-built team configs
- **Priority support**

Pricing TBD. Likely:
- Free tier: 1 project, 3 agents, basic dashboard
- Pro ($19/mo): Unlimited projects, unlimited agents, full analytics
- Team ($49/mo per seat): Collaboration, shared boards, admin controls

---

## Key Narrative

The story sells itself:

> We ran an experiment. 3 AI agents, one codebase, markdown files for coordination.
> 17 tasks completed in 2 hours. 115 tests written. Zero framework.
>
> But we typed "continue" 20+ times. Files conflicted. An agent rewrote our middleware without asking.
>
> So we analyzed how Stripe and Paperclip solve this.
> Stripe uses years of internal tooling. Paperclip uses 35 Postgres tables.
>
> We built Stajyer: the same solutions in one `npx` command.

This is a "scratched our own itch" story. Authentic, technical, relatable.
