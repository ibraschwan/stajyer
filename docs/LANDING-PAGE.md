# Landing Page — stajyer.app

## Hero Section

### Concept

Large centered text with one word rotating through languages, creating intrigue and internationality:

```
Let your [stajyer] take over your job.
         [intern]
         [stagiaire]
         [praktikant]
         [実習生]
         [인턴]
         [стажёр]
         [becario]
         [estagiário]
         [tirocinante]
```

The rotating word has a highlight/accent treatment (different color, underline, or background). Cycles every 2 seconds with a smooth crossfade or typewriter effect.

Subtitle below:
> "AI interns that actually work. You assign, they code, you review."

Two CTAs:
```
[Get Started — it's free]     [Watch Demo →]
npx stajyer init
```

The "npx stajyer init" is styled as a terminal snippet, copy-on-click.

### Design Direction

- Dark background (#0a0a0f or similar deep dark)
- Clean, monospace-accented typography
- Subtle grid/dot pattern background
- The rotating word in a warm accent color (amber/orange to match "intern" energy)
- Terminal-style code blocks with subtle glow

---

## Problem Section

### "Sound familiar?"

Three cards, each showing a pain point:

**Card 1: "The Continue Tax"**
```
Terminal 1: ✓ Done. Waiting...
Terminal 2: ✓ Done. Waiting...
Terminal 3: ✓ Done. Waiting...

You: *switching tabs for the 20th time*
     "continue" ↵
```
"Your AI agents finish work and wait. You become the bottleneck."

**Card 2: "File Wars"**
```
Error: File has been modified since read
Error: File has been modified since read
Error: File has been modified since read
```
"Multiple agents editing the same file. Changes overwrite each other."

**Card 3: "The Oops Moment"**
```
Agent: Moved dashboard, rewrote middleware,
       changed 5 files. Done! ✓

You: ...that was supposed to stay where it was.

*30 minutes of reverting*
```
"No guardrails. An agent makes a sweeping change. You clean up the mess."

---

## Solution Section

### "Stajyer fixes this."

Split into 3 features with terminal animations:

**1. Auto-Continue**
```bash
$ stajyer up

[14:30] lead     ▶ Auditing codebase...
[14:32] lead     ✓ Created 5 tasks
[14:32] daemon   → Assigned 001 → frontend
[14:32] daemon   → Assigned 002 → backend
[14:35] frontend ✓ Completed: error-boundaries
[14:35] daemon   → Assigned 003 → frontend    # ← no "continue" needed
[14:38] backend  ✓ Completed: api-tests
[14:38] daemon   → Assigned 004 → backend     # ← automatic
```
"Agents finish. Daemon dispatches. Zero human intervention."

**2. Ownership Guard**
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
"Each agent has a territory. Protected files need lead approval."

**3. Markdown State**
```
.stajyer/tasks/
├── 001-error-boundaries.md   ← git tracked
├── 002-api-tests.md          ← human readable
└── 003-skeleton-states.md    ← agent writable
```
"State lives in markdown. Track progress in git. Read it in VS Code. No database."

---

## How It Works — 3 Steps

**Step 1: Init**
```bash
npx stajyer init
# Creates .stajyer/ with config, task board, agent profiles
```

**Step 2: Hire**
```bash
stajyer hire lead        # The coordinator
stajyer hire dev         # The workers (Claude Code, Codex, Cursor)
```

**Step 3: Let them work**
```bash
stajyer up
stajyer task "Build the login page" --to frontend
stajyer task "Write API tests" --to backend
# Go grab coffee. ☕
```

---

## Social Proof / Metrics Section

(Post-launch, replace with real numbers. For launch, use experiment data:)

> "3 AI agents. 17 tasks. 115 tests. 2 hours. Zero 'continue' commands."
> — The experiment that started Stajyer

---

## Comparison Table

```
Feature              You Today        Stajyer          Paperclip
─────────────────────────────────────────────────────────────────
Setup                0 min            5 min            15+ min
"Continue" needed    Yes (20+/hr)     No               No
File conflicts       Constant         Never            Never
Change protection    None             Ownership guard  DB permissions
State format         N/A              Markdown (git)   Postgres
Database required    No               No               Yes
Agent support        1 type           Any CLI agent    Any CLI agent
```

---

## Pricing Section

**Free & Open Source**

Stajyer CLI is MIT licensed. Always free. No limits.

```bash
npx stajyer init && stajyer up
```

**Stajyer Cloud** (coming soon)
- Web dashboard — monitor from anywhere
- Team collaboration — shared task boards
- Agent analytics — which agent is most efficient
- Templates marketplace

[Join waitlist →]

---

## Footer

```
stajyer.app
GitHub → [repo link]
Docs → stajyer.app/docs
Discord → [community link]

Built by developers who got tired of typing "continue".
```

---

## Technical Notes for Implementation

- **Framework:** Next.js 15+ (App Router) or Astro for static perf
- **Animations:** Framer Motion for hero word rotation
- **Terminal blocks:** Custom component with syntax highlighting (shiki)
- **Dark theme:** Primary dark, accent amber/orange
- **Responsive:** Mobile-first, terminal blocks scroll horizontally on mobile
- **Performance:** Static site, no JS needed except hero animation
- **Analytics:** Simple (Plausible or Umami, privacy-friendly)
- **Domain:** stajyer.app (owned)
