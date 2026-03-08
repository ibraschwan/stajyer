import { Command } from 'commander';
import chalk from 'chalk';
import { requireProjectRoot } from '../utils/paths.js';
import { isDaemonRunning, removePid } from '../utils/pid.js';

export function registerDownCommand(program: Command): void {
  program
    .command('down')
    .description('Gracefully stop daemon and all agents')
    .action(async () => {
      const root = requireProjectRoot();
      const { running, pid } = isDaemonRunning(root);

      if (!running || !pid) {
        console.log(chalk.dim('\n  Daemon is not running.\n'));
        return;
      }

      console.log(chalk.dim(`\n  Stopping daemon (PID ${pid})...`));

      try {
        process.kill(pid, 'SIGTERM');
      } catch {
        // Process already gone
        removePid(root);
        console.log(chalk.green('  Daemon stopped.\n'));
        return;
      }

      // Wait for exit (up to 10 seconds)
      const start = Date.now();
      while (Date.now() - start < 10000) {
        const check = isDaemonRunning(root);
        if (!check.running) {
          console.log(chalk.green('  Daemon stopped.\n'));
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Force kill
      try {
        process.kill(pid, 'SIGKILL');
        removePid(root);
        console.log(chalk.yellow('  Daemon force-killed.\n'));
      } catch {
        removePid(root);
        console.log(chalk.green('  Daemon stopped.\n'));
      }
    });
}
