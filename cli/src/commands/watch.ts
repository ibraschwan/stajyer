import { Command } from 'commander';
import chalk from 'chalk';
import { requireProjectRoot } from '../utils/paths.js';
import { isDaemonRunning } from '../utils/pid.js';
import { loadConfig } from '../config/loader.js';
import { listTasks } from '../task/manager.js';
import type { TaskStatus } from '../task/parser.js';

const STATUS_DISPLAY: Record<string, { icon: string; color: (s: string) => string }> = {
  idle: { icon: '●', color: chalk.dim },
  working: { icon: '▶', color: chalk.yellow },
  starting: { icon: '◐', color: chalk.cyan },
  crashed: { icon: '✗', color: chalk.red },
  stopped: { icon: '○', color: chalk.dim },
};

export function registerWatchCommand(program: Command): void {
  program
    .command('watch')
    .description('Real-time terminal dashboard')
    .action(() => {
      const root = requireProjectRoot();
      const { running } = isDaemonRunning(root);

      if (!running) {
        console.log(chalk.dim('\n  Daemon is not running. Start with `stajyer up`.\n'));
        return;
      }

      // Simple polling-based dashboard (ink-based dashboard is Phase 8 enhancement)
      const render = () => {
        const config = loadConfig(root);
        const tasks = listTasks(root);

        // Clear screen
        process.stdout.write('\x1B[2J\x1B[H');

        const agentNames = Object.keys(config.agents);
        const tasksByStatus = (s: TaskStatus) => tasks.filter(t => t.frontmatter.status === s);

        console.log('');
        console.log(chalk.bold(`  stajyer v0.1.0 — ${config.project.name} — ${agentNames.length} agents`));
        console.log(chalk.dim('  ─'.repeat(32)));
        console.log('');

        // Agent table
        console.log(chalk.bold('  Agent'.padEnd(16) + 'Status'.padEnd(14) + 'Current Task'.padEnd(30) + 'Tokens'));
        console.log(chalk.dim('  ' + '─'.repeat(70)));

        for (const name of agentNames) {
          const agentTasks = tasks.filter(
            t => t.frontmatter.assigned_to === name && t.frontmatter.status === 'in_progress'
          );
          const current = agentTasks[0];
          const isWorking = !!current;
          const statusInfo = isWorking
            ? STATUS_DISPLAY.working
            : STATUS_DISPLAY.idle;

          const taskDisplay = current
            ? `${current.frontmatter.id}-${current.frontmatter.title}`.slice(0, 28)
            : '—';

          const tokens = tasks
            .filter(t => t.frontmatter.assigned_to === name && t.frontmatter.tokens_used)
            .reduce((sum, t) => sum + (t.frontmatter.tokens_used ?? 0), 0);

          console.log(
            `  ${name.padEnd(14)} ${statusInfo.color(`${statusInfo.icon} ${isWorking ? 'work' : 'idle'}`.padEnd(12))} ${taskDisplay.padEnd(28)} ${tokens > 0 ? tokens.toLocaleString() : '—'}`
          );
        }

        // Queue summary
        console.log('');
        const pending = tasksByStatus('pending').length + tasksByStatus('assigned').length;
        const inProgress = tasksByStatus('in_progress').length;
        const done = tasksByStatus('done').length;
        const failed = tasksByStatus('failed').length;

        console.log(chalk.dim(`  Queue: ${pending} pending | ${inProgress} in progress | ${done} done | ${failed} failed`));

        // Recent activity (last 5 completed)
        const recentDone = tasksByStatus('done').slice(-5).reverse();
        if (recentDone.length > 0) {
          console.log('');
          console.log(chalk.bold('  Recent:'));
          for (const task of recentDone) {
            const agent = task.frontmatter.assigned_to ?? '?';
            console.log(chalk.dim(`    ${chalk.green('✓')} ${agent.padEnd(10)} ${task.frontmatter.title}`));
          }
        }

        console.log('');
        console.log(chalk.dim('  Press Ctrl+C to exit. Refreshing every 2s...'));
      };

      render();
      const interval = setInterval(render, 2000);

      process.on('SIGINT', () => {
        clearInterval(interval);
        console.log('');
        process.exit(0);
      });
    });
}
