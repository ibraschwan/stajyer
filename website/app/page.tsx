import Image from "next/image";
import RotatingWord from "./components/RotatingWord";
import TerminalBlock from "./components/TerminalBlock";
import CopySnippet from "./components/CopySnippet";
import GitHubButton from "./components/GitHubButton";
import WaitlistForm from "./components/WaitlistForm";
import MobileNav from "./components/MobileNav";

const GITHUB_REPO = "ibraschwan/stajyer";

export default function Home() {
  return (
    <main className="dot-grid min-h-screen">
      {/* ─── Nav ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-card-border/50">
        <a href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/icon-96.png"
            alt="Stajyer logo"
            width={32}
            height={32}
            className="rounded-md"
            priority
          />
          <span className="font-mono font-bold text-lg tracking-tight group-hover:text-accent transition-colors">
            stajyer
          </span>
        </a>
        <div className="flex items-center gap-6">
          <a
            href="#how-it-works"
            className="text-sm text-muted hover:text-foreground transition-colors hidden sm:block"
          >
            How it works
          </a>
          <a
            href="#comparison"
            className="text-sm text-muted hover:text-foreground transition-colors hidden sm:block"
          >
            Compare
          </a>
          <a
            href="#get-started"
            className="text-sm text-muted hover:text-foreground transition-colors hidden sm:block"
          >
            Pricing
          </a>
          <GitHubButton repo={GITHUB_REPO} />
          <MobileNav />
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Badge */}
        <a
          href={`https://github.com/${GITHUB_REPO}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-sm text-accent hover:border-accent/40 transition-colors"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          Now open source on GitHub
        </a>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight max-w-4xl">
          Let your <RotatingWord /> take over your job.
        </h1>

        <p className="mt-8 text-lg sm:text-xl text-muted max-w-2xl leading-relaxed">
          Orchestrate multiple AI coding agents without databases or heavy
          frameworks.{" "}
          <span className="text-foreground">You assign, they code, you review.</span>
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#get-started"
            className="px-7 py-3.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-hover transition-colors text-sm shadow-lg shadow-accent/20"
          >
            Get Started — it&apos;s free
          </a>
          <a
            href="#how-it-works"
            className="px-7 py-3.5 rounded-lg border border-card-border text-foreground hover:border-accent/40 transition-colors text-sm"
          >
            See how it works &darr;
          </a>
        </div>

        <div className="mt-8">
          <CopySnippet text="npx stajyer init" />
        </div>

        {/* Supported agents */}
        <div className="mt-12 flex items-center gap-3 text-xs text-muted">
          <span>Works with:</span>
          <span className="px-2 py-1 rounded bg-card-bg border border-card-border font-mono">
            Claude Code
          </span>
          <span className="px-2 py-1 rounded bg-card-bg border border-card-border font-mono">
            Codex
          </span>
          <span className="px-2 py-1 rounded bg-card-bg border border-card-border font-mono">
            Cursor
          </span>
        </div>

        <div className="absolute bottom-10 text-muted animate-bounce">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M10 3v14M3 10l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ─── Social Proof Bar ─── */}
      <section className="py-12 px-6 border-y border-card-border/50 bg-card-bg/30">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-center">
          <div>
            <div className="text-3xl font-bold text-accent">3</div>
            <div className="text-xs text-muted mt-1">AI Agents</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent">17</div>
            <div className="text-xs text-muted mt-1">Tasks Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent">115</div>
            <div className="text-xs text-muted mt-1">Tests Passing</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent">2h</div>
            <div className="text-xs text-muted mt-1">Total Time</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent">0</div>
            <div className="text-xs text-muted mt-1">&ldquo;Continue&rdquo; Commands</div>
          </div>
        </div>
      </section>

      {/* ─── Problem ─── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Sound familiar?
          </h2>
          <p className="text-muted text-center mb-16 max-w-xl mx-auto">
            Running multiple AI agents sounds great until you hit these walls.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="rounded-xl border border-card-border bg-card-bg p-6 hover:border-accent/20 transition-colors">
              <h3 className="text-lg font-semibold mb-4 text-accent">
                The Continue Tax
              </h3>
              <TerminalBlock>
                {`Terminal 1: ✓ Done. Waiting...
Terminal 2: ✓ Done. Waiting...
Terminal 3: ✓ Done. Waiting...

You: *switching tabs again*
     "continue" ↵`}
              </TerminalBlock>
              <p className="mt-4 text-sm text-muted">
                Your AI agents finish work and wait. You become the bottleneck.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-card-border bg-card-bg p-6 hover:border-accent/20 transition-colors">
              <h3 className="text-lg font-semibold mb-4 text-accent">
                File Wars
              </h3>
              <TerminalBlock>
                {`Error: File has been modified
       since read
Error: File has been modified
       since read
Error: File has been modified
       since read`}
              </TerminalBlock>
              <p className="mt-4 text-sm text-muted">
                Multiple agents editing the same file. Changes overwrite each
                other.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-card-border bg-card-bg p-6 hover:border-accent/20 transition-colors">
              <h3 className="text-lg font-semibold mb-4 text-accent">
                The Oops Moment
              </h3>
              <TerminalBlock>
                {`Agent: Moved dashboard, rewrote
  middleware, changed 5 files.
  Done! ✓

You: ...that was supposed to
     stay where it was.`}
              </TerminalBlock>
              <p className="mt-4 text-sm text-muted">
                No guardrails. An agent makes a sweeping change. You clean up
                the mess.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Solution ─── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Stajyer fixes this.
          </h2>
          <p className="text-muted text-center mb-16 max-w-xl mx-auto">
            A lightweight daemon that orchestrates your AI agents with three
            simple primitives.
          </p>

          <div className="space-y-16">
            {/* Feature 1 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-accent font-mono text-sm mb-2">01</div>
                <h3 className="text-2xl font-bold mb-3">Auto-Continue</h3>
                <p className="text-muted leading-relaxed">
                  Agents finish. Daemon dispatches. Zero human intervention. No
                  more switching terminals to type &ldquo;continue&rdquo;.
                </p>
              </div>
              <TerminalBlock title="stajyer up">
                {`[14:30] lead     ▶ Auditing codebase...
[14:32] lead     ✓ Created 5 tasks
[14:32] daemon   → Assigned 001 → frontend
[14:32] daemon   → Assigned 002 → backend
[14:35] frontend ✓ Completed: error-boundaries
[14:35] daemon   → Assigned 003 → frontend
[14:38] backend  ✓ Completed: api-tests
[14:38] daemon   → Assigned 004 → backend`}
              </TerminalBlock>
            </div>

            {/* Feature 2 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="md:order-2">
                <div className="text-accent font-mono text-sm mb-2">02</div>
                <h3 className="text-2xl font-bold mb-3">Ownership Guard</h3>
                <p className="text-muted leading-relaxed">
                  Each agent has a territory. Protected files need lead
                  approval. No more file conflicts.
                </p>
              </div>
              <TerminalBlock title=".stajyer/config.yml" language="yaml">
                {`agents:
  frontend:
    owns: ["src/components/**"]
  backend:
    owns: ["src/app/api/**"]

protected:
  - path: "src/middleware.ts"
    requires: "lead"`}
              </TerminalBlock>
            </div>

            {/* Feature 3 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-accent font-mono text-sm mb-2">03</div>
                <h3 className="text-2xl font-bold mb-3">Markdown State</h3>
                <p className="text-muted leading-relaxed">
                  State lives in markdown. Track progress in git. Read it in
                  your editor. No database required.
                </p>
              </div>
              <TerminalBlock title=".stajyer/tasks/">
                {`.stajyer/tasks/
├── 001-error-boundaries.md   ← git tracked
├── 002-api-tests.md          ← human readable
└── 003-skeleton-states.md    ← agent writable`}
              </TerminalBlock>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-24 px-6 border-y border-card-border/50 bg-card-bg/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Three steps. That&apos;s it.
          </h2>
          <p className="text-muted text-center mb-16 max-w-md mx-auto">
            Get from zero to orchestrated agents in under 5 minutes.
          </p>

          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-mono text-sm font-bold">
                  1
                </span>
                <h3 className="text-xl font-semibold">Init</h3>
              </div>
              <TerminalBlock title="terminal" copyable="npx stajyer init">
                {`$ npx stajyer init
# Creates .stajyer/ with config, task board, agent profiles`}
              </TerminalBlock>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-mono text-sm font-bold">
                  2
                </span>
                <h3 className="text-xl font-semibold">Hire</h3>
              </div>
              <TerminalBlock title="terminal">
                {`$ stajyer hire lead    # The coordinator
$ stajyer hire dev     # The workers (Claude Code, Codex, Cursor)`}
              </TerminalBlock>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-mono text-sm font-bold">
                  3
                </span>
                <h3 className="text-xl font-semibold">Let them work</h3>
              </div>
              <TerminalBlock title="terminal">
                {`$ stajyer up
$ stajyer task "Build the login page" --to frontend
$ stajyer task "Write API tests" --to backend
# Go grab coffee. ☕`}
              </TerminalBlock>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Quote ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-2xl sm:text-3xl font-bold leading-snug">
            &ldquo;3 AI agents. 17 tasks. 115 tests. 2 hours.
            <br />
            <span className="text-accent">
              Zero &lsquo;continue&rsquo; commands.
            </span>
            &rdquo;
          </blockquote>
          <p className="mt-6 text-muted">
            — The experiment that started Stajyer
          </p>
          <a
            href={`https://github.com/${GITHUB_REPO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 text-sm text-accent hover:underline"
          >
            Read the full experiment report &rarr;
          </a>
        </div>
      </section>

      {/* ─── Comparison ─── */}
      <section id="comparison" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            How it compares
          </h2>
          <p className="text-muted text-center mb-6 max-w-2xl mx-auto">
            Most tools are single AI agents. Only a few orchestrate multiple agents simultaneously.
            Stajyer is the lightweight option that doesn&apos;t need a database.
          </p>
          <p className="text-xs text-muted text-center mb-16">
            Data sourced from public documentation, repos, and pricing pages. Last updated March 2026.
          </p>

          {/* Multi-agent orchestrators */}
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-accent">&#9632;</span> Multi-Agent Orchestrators
            <span className="text-xs text-muted font-normal ml-2">— tools that coordinate multiple agents simultaneously</span>
          </h3>
          <div className="overflow-x-auto rounded-xl border border-card-border mb-12">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border bg-card-bg">
                  <th className="text-left p-4 font-mono text-muted font-normal whitespace-nowrap">Feature</th>
                  <th className="text-left p-4 font-mono text-accent font-semibold whitespace-nowrap">Stajyer</th>
                  <th className="text-left p-4 font-mono text-muted font-normal whitespace-nowrap">Paperclip</th>
                  <th className="text-left p-4 font-mono text-muted font-normal whitespace-nowrap">Parallel Code</th>
                  <th className="text-left p-4 font-mono text-muted font-normal whitespace-nowrap">Emdash (YC W26)</th>
                  <th className="text-left p-4 font-mono text-muted font-normal whitespace-nowrap">Composio</th>
                  <th className="text-left p-4 font-mono text-muted font-normal whitespace-nowrap">Stripe Minions</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs sm:text-sm">
                {([
                  ["Open source", "MIT", "MIT", "Yes", "Yes", "Yes", "No (internal)"],
                  ["Setup time", "5 min", "15+ min", "~10 min", "~10 min", "~10 min", "N/A"],
                  ["Auto-continue", "Yes", "Yes (heartbeat)", "No", "No", "No", "Yes"],
                  ["File conflict prevention", "Ownership guard", "DB permissions", "Git worktrees", "Git worktrees", "Git worktrees", "Isolated devboxes"],
                  ["Task lifecycle", "Yes (queue + dispatch)", "Yes (issues + approvals)", "No", "No", "Partial", "Yes"],
                  ["Database required", "No", "Postgres (35+ tables)", "No", "No", "No", "Internal"],
                  ["State format", "Markdown (git)", "Postgres", "None", "None", "None", "Internal DB"],
                  ["Cross-tool agents", "Claude + Codex + Cursor", "Claude + Codex + Cursor", "Claude + Codex + Gemini", "Any provider", "Any agent", "Goose fork only"],
                  ["Available to public", "Yes", "Yes (self-hosted)", "Yes", "Yes", "Yes", "No"],
                ] as const).map(([feature, ...cols], i) => (
                  <tr key={i} className="border-b border-card-border last:border-0">
                    <td className="p-3 sm:p-4 text-foreground whitespace-nowrap">{feature}</td>
                    <td className="p-3 sm:p-4 text-accent whitespace-nowrap">{cols[0]}</td>
                    {cols.slice(1).map((val, j) => (
                      <td key={j} className="p-3 sm:p-4 text-muted whitespace-nowrap">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Single agents with partial multi-agent */}
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-muted">&#9632;</span> Single Agents with Partial Multi-Agent
            <span className="text-xs text-muted font-normal ml-2">— can run multiple instances, but only of themselves</span>
          </h3>
          <div className="overflow-x-auto rounded-xl border border-card-border mb-12">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border bg-card-bg">
                  <th className="text-left p-4 font-mono text-muted font-normal whitespace-nowrap">Agent</th>
                  <th className="text-left p-4 font-mono text-muted font-normal whitespace-nowrap">Multi-Agent</th>
                  <th className="text-left p-4 font-mono text-muted font-normal whitespace-nowrap">Cross-Tool</th>
                  <th className="text-left p-4 font-mono text-muted font-normal whitespace-nowrap">Open Source</th>
                  <th className="text-left p-4 font-mono text-accent font-normal whitespace-nowrap">Stajyer Adapter</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs sm:text-sm">
                {([
                  ["Claude Code", "Agent Teams (subagents within session)", "No — Claude only", "Source-available", "✓ Supported"],
                  ["Codex CLI", "Experimental (Agents SDK)", "No — Codex only", "Open source", "✓ Supported"],
                  ["Cursor", "Automations (cloud agents)", "No — Cursor only", "No", "✓ Supported"],
                  ["GitHub Copilot", "Mission Control (agent fleet)", "No — Copilot only", "No", "Planned"],
                  ["Devin", "Parallel sessions", "No — Devin only", "No", "N/A (cloud)"],
                  ["OpenHands", "Task delegation", "No — OpenHands only", "MIT (65k+ stars)", "Planned"],
                ] as const).map(([agent, multi, cross, oss, adapter], i) => (
                  <tr key={i} className="border-b border-card-border last:border-0">
                    <td className="p-3 sm:p-4 text-foreground whitespace-nowrap">{agent}</td>
                    <td className="p-3 sm:p-4 text-muted whitespace-nowrap">{multi}</td>
                    <td className="p-3 sm:p-4 text-muted whitespace-nowrap">{cross}</td>
                    <td className="p-3 sm:p-4 text-muted whitespace-nowrap">{oss}</td>
                    <td className="p-3 sm:p-4 text-accent whitespace-nowrap">{adapter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Single agents */}
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-muted/50">&#9632;</span> Single AI Coding Agents
            <span className="text-xs text-muted font-normal ml-2">— powerful alone, better orchestrated with Stajyer</span>
          </h3>
          <div className="overflow-x-auto rounded-xl border border-card-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border bg-card-bg">
                  <th className="text-left p-4 font-mono text-muted font-normal whitespace-nowrap">Agent</th>
                  <th className="text-left p-4 font-mono text-muted font-normal whitespace-nowrap">By</th>
                  <th className="text-left p-4 font-mono text-muted font-normal whitespace-nowrap">Type</th>
                  <th className="text-left p-4 font-mono text-muted font-normal whitespace-nowrap">Open Source</th>
                  <th className="text-left p-4 font-mono text-accent font-normal whitespace-nowrap">Stajyer Adapter</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs sm:text-sm">
                {([
                  ["Aider", "Paul Gauthier", "CLI pair programmer", "Apache 2.0", "Planned"],
                  ["Cline", "Community", "VS Code extension", "Apache 2.0 (5M+ devs)", "Planned"],
                  ["Goose", "Block", "CLI agent", "Apache 2.0 (29k+ stars)", "Planned"],
                  ["SWE-agent", "Princeton", "Research agent", "MIT", "Planned"],
                  ["Continue.dev", "Continue", "IDE assistant", "Apache 2.0", "Planned"],
                  ["Sweep", "Sweep AI", "GitHub bot", "MIT", "Planned"],
                ] as const).map(([agent, by, type, oss, adapter], i) => (
                  <tr key={i} className="border-b border-card-border last:border-0">
                    <td className="p-3 sm:p-4 text-foreground whitespace-nowrap">{agent}</td>
                    <td className="p-3 sm:p-4 text-muted whitespace-nowrap">{by}</td>
                    <td className="p-3 sm:p-4 text-muted whitespace-nowrap">{type}</td>
                    <td className="p-3 sm:p-4 text-muted whitespace-nowrap">{oss}</td>
                    <td className="p-3 sm:p-4 text-accent whitespace-nowrap">{adapter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 rounded-xl border border-accent/20 bg-accent/5 p-6 text-center">
            <p className="text-sm text-foreground mb-2">
              <strong>The key difference:</strong> Worktree tools (Parallel Code, Emdash) isolate agents but don&apos;t manage them.
            </p>
            <p className="text-xs text-muted">
              Stajyer adds what they&apos;re missing: auto-continue (no &ldquo;continue&rdquo; bottleneck),
              ownership guards (no file conflicts), and task lifecycle management (queue → dispatch → review).
              All without a database.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="get-started" className="py-24 px-6 border-t border-card-border/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Free &amp; Open Source
          </h2>
          <p className="text-muted text-center mb-16 max-w-md mx-auto">
            MIT licensed. No vendor lock-in. No limits.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="rounded-xl border-2 border-accent/30 bg-card-bg p-8 relative">
              <div className="absolute -top-3 left-6 px-3 py-0.5 bg-accent text-black text-xs font-bold rounded-full">
                RECOMMENDED
              </div>
              <div className="text-accent font-mono text-sm mb-2">CLI</div>
              <h3 className="text-2xl font-bold mb-1">Stajyer CLI</h3>
              <div className="text-3xl font-bold mb-4">
                $0 <span className="text-sm text-muted font-normal">forever</span>
              </div>
              <p className="text-muted mb-6 text-sm">
                Everything you need to orchestrate AI agents.
              </p>
              <div className="mb-6">
                <CopySnippet text="npx stajyer init" />
              </div>
              <ul className="space-y-2.5 text-sm text-muted">
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Unlimited agents
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Auto-continue daemon
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Ownership guards
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Markdown state
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> All adapters (Claude
                  Code, Codex, Cursor)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> MIT licensed
                </li>
              </ul>
            </div>

            {/* Cloud */}
            <div className="rounded-xl border border-card-border bg-card-bg p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-xs font-mono px-2 py-1 rounded bg-accent/10 text-accent">
                coming soon
              </div>
              <div className="text-muted font-mono text-sm mb-2">CLOUD</div>
              <h3 className="text-2xl font-bold mb-1">Stajyer Cloud</h3>
              <div className="text-3xl font-bold mb-4">
                <span className="text-muted text-lg font-normal">TBD</span>
              </div>
              <p className="text-muted mb-6 text-sm">
                Web dashboard, team features, analytics.
              </p>
              <WaitlistForm />
              <ul className="mt-6 space-y-2.5 text-sm text-muted">
                <li className="flex items-center gap-2">
                  <span className="text-muted">○</span> Web dashboard
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-muted">○</span> Team collaboration
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-muted">○</span> Agent analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-muted">○</span> Templates marketplace
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Stop being the bottleneck.
          </h2>
          <p className="text-muted mb-8 max-w-lg mx-auto">
            Your AI agents are waiting for you to type &ldquo;continue&rdquo;.
            Let Stajyer handle it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CopySnippet text="npx stajyer init" />
            <a
              href={`https://github.com/${GITHUB_REPO}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-card-border text-sm text-muted hover:text-foreground hover:border-accent/40 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-card-border py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div className="flex flex-col gap-4">
              <a href="/" className="flex items-center gap-2.5">
                <Image
                  src="/icon-96.png"
                  alt="Stajyer logo"
                  width={24}
                  height={24}
                  className="rounded-md"
                />
                <span className="font-mono font-bold text-lg">stajyer</span>
              </a>
              <p className="text-sm text-muted max-w-xs">
                Built by developers who got tired of typing
                &ldquo;continue&rdquo;.
              </p>
            </div>

            <div className="flex gap-12">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted uppercase tracking-wider mb-1">
                  Product
                </span>
                <a
                  href="#how-it-works"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  How it works
                </a>
                <a
                  href="#comparison"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Compare
                </a>
                <a
                  href="#get-started"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Pricing
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted uppercase tracking-wider mb-1">
                  Community
                </span>
                <a
                  href={`https://github.com/${GITHUB_REPO}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
                <a
                  href={`https://github.com/${GITHUB_REPO}/discussions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Discussions
                </a>
                <a
                  href={`https://github.com/${GITHUB_REPO}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Issues
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-card-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted">
              &copy; {new Date().getFullYear()} Stajyer. MIT License.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={`https://github.com/${GITHUB_REPO}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://x.com/stajyerapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-foreground transition-colors"
                aria-label="X (Twitter)"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
