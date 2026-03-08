# Stripe Minions — Key Takeaways

Source: stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents (Feb 2026)
Author: Alistair Gray, Leverage team at Stripe

---

## What It Is

Stripe's internal, fully unattended coding agents. 1000+ PRs merged per week. Human-reviewed but zero human-written code.

"A typical minion run starts in a Slack message and ends in a pull request which passes CI and is ready for human review, with no interaction in between."

## Why They Built It Themselves

- Stripe's codebase: hundreds of millions of lines of code
- Ruby (not Rails) with Sorbet typing — uncommon stack, natively unfamiliar to LLMs
- Vast homegrown libraries unique to Stripe
- Moves $1T+ per year — stakes are high
- Deep investment in developer productivity foundations (source control, environments, code generation, CI)

Key quote: "If it's good for humans, it's good for LLMs, too."

## Architecture

### Entry points
1. **Slack** — Most common. Tag the Slack app in a thread, minion accesses entire thread + links as context
2. **CLI** — Command line interface
3. **Web UI** — Web interface for initiating and monitoring
4. **Internal apps** — Docs platform, feature flag platform, ticketing UI all integrate with minions
5. **Automated tickets** — CI detects flaky tests → creates ticket → "Fix with a minion" button

### Execution flow
1. **Isolated devbox** — Pre-warmed, spins up in 10 seconds. Stripe code + services pre-loaded. Isolated from production and internet. Not git worktrees ("wouldn't scale at Stripe").
2. **Agent loop** — Fork of Block's "goose" coding agent. Customized orchestration interleaving agent loops with deterministic code.
3. **Context** — MCP connected to 400+ tools via "Toolshed" internal MCP server. "We deterministically run relevant MCP tools over likely-looking links before a minion run even starts."
4. **Agent rules** — Same rule files as Cursor and Claude Code. "Almost all agent rules at Stripe are conditionally applied based on subdirectories."
5. **Local testing** — Automated local executable, heuristic-based lint selection, < 5 seconds per push.
6. **CI** — Selectively runs tests from 3+ million test battery. Many tests have autofixes.
7. **Max 2 CI rounds** — Push → CI. If fail → fix → push again. If still fail → done (human takes over).
8. **PR creation** — Branch, push to CI, prepare PR following Stripe's template.

### Key engineering decisions

**Deterministic interleaving:**
"We've customized the orchestration flow in an opinionated way to interleave agent loops and deterministic code—for git operations, linters, testing, and so on—so that minion runs mix the creativity of an agent with the assurance that they'll always complete Stripe-required steps like linters."

**Shift feedback left:**
"It's best for humans and agents if any lint step that would fail in CI is enforced in the IDE or on a git push, and presented to the engineer immediately."

**Diminishing returns awareness:**
"There's a balancing act between speed and completeness here, and there are diminishing marginal returns for an LLM to run many rounds of a full CI loop. We feel this guidance of 'often one, at most two, CI runs—and only after we've fixed everything we can locally' strikes a good balance."

**Conditional rules:**
"It would be impractical for Stripe to have many unconditional rules, so almost all agent rules at Stripe are conditionally applied based on subdirectories."

**Pre-hydrating context:**
"We deterministically run relevant MCP tools over likely-looking links before a minion run even starts, to better hydrate the context."

---

## What Stajyer Takes From Minions

1. **Max 2 CI rounds** — Default rule in config
2. **Shift left** — Local lint on save, before any CI
3. **Conditional rules** — `.stajyer/rules/` directory-based rule files
4. **Pre-hydration** — Lead agent's phantom task audit (scan codebase before creating tasks)
5. **Deterministic checkpoints** — Build/test gates between agent work phases
6. **One-shot philosophy** — Workers should aim to complete tasks without back-and-forth

## What Stajyer Does Differently

1. **Agent coordination** — Minions are isolated. Stajyer agents coordinate via lead.
2. **Shared codebase** — Minions get isolated devboxes. Stajyer uses ownership guard on shared repo.
3. **Open source** — Minions are internal. Stajyer is public.
4. **No infrastructure** — Minions need devbox infra. Stajyer needs `npx`.

## Part 2 (not yet published)

The blog mentions Part 2 will dive into implementation details. Worth monitoring for additional technical insights.
