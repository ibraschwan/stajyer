import { Command } from 'commander';
import { fork } from 'node:child_process';
import path from 'node:path';
import chalk from 'chalk';
import { requireProjectRoot } from '../utils/paths.js';
import { isDaemonRunning } from '../utils/pid.js';
import { startDaemon } from '../daemon/index.js';

export function registerUpCommand(program: Command): void {
  program
    .command('up')
    .description('Start daemon and all agents')
    .option('--foreground', 'Run in foreground (don\'t daemonize)')
    .option('--dry-run', 'Show what would start without starting')
    .action(async (opts) => {
      const root = requireProjectRoot();
      const { running, pid } = isDaemonRunning(root);

      if (running) {
        console.log(chalk.yellow(`\n  Daemon already running (PID ${pid}).\n`));
        return;
      }

      if (opts.foreground || opts.dryRun) {
        // Run in foreground
        await startDaemon({ root, foreground: true, dryRun: opts.dryRun });
      } else {
        // Fork as detached background process
        const daemonScript = path.join(import.meta.dirname ?? __dirname, '../daemon/index.js');

        // Use the CLI entry point with a special flag
        const child = fork(
          path.join(import.meta.dirname ?? __dirname, '../../bin/stajyer.js'),
          ['_daemon', '--root', root],
          {
            detached: true,
            stdio: 'ignore',
            cwd: root,
          }
        );

        child.unref();

        // Wait briefly for daemon to write PID
        await new Promise(resolve => setTimeout(resolve, 1000));

        const check = isDaemonRunning(root);
        if (check.running) {
          console.log(chalk.green(`\n  Daemon started (PID ${check.pid}).\n`));
          console.log(chalk.dim('  Use `stajyer watch` for live dashboard.'));
          console.log(chalk.dim('  Use `stajyer down` to stop.\n'));
        } else {
          // Fallback: run in foreground if fork fails
          console.log(chalk.yellow('\n  Running in foreground mode...\n'));
          await startDaemon({ root, foreground: true });
        }
      }
    });

  // Hidden internal command for daemonized process
  program
    .command('_daemon', { hidden: true })
    .option('--root <path>', 'Project root')
    .action(async (opts) => {
      const root = opts.root ?? process.cwd();
      await startDaemon({ root, foreground: true });
    });
}
