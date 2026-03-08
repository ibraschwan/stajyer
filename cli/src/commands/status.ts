import { Command } from 'commander';
import chalk from 'chalk';
import { requireProjectRoot } from '../utils/paths.js';
import { isDaemonRunning } from '../utils/pid.js';
import { loadConfig } from '../config/loader.js';
import { listTasks } from '../task/manager.js';

export function registerStatusCommand(program: Command): void {
  program
    .command('status')
    .description('Show agent states and daemon status')
    .action(() => {
      const root = requireProjectRoot();
      const config = loadConfig(root);
      const { running, pid } = isDaemonRunning(root);
      const tasks = listTasks(root);

      console.log('');
      console.log(chalk.bold(`  stajyer — ${config.project.name}`));
      console.log('');

      // Daemon status
      if (running) {
        console.log(`  Daemon: ${chalk.green('● running')} (PID ${pid})`);
      } else {
        console.log(`  Daemon: ${chalk.red('○ stopped')}`);
      }
      console.log('');

      // Agents
      console.log(chalk.bold('  Agents:'));
      for (const [name, agent] of Object.entries(config.agents)) {
        const agentTasks = tasks.filter(
          t => t.frontmatter.assigned_to === name && t.frontmatter.status === 'in_progress'
        );
        const currentTask = agentTasks[0];

        const status = running
          ? (currentTask ? chalk.yellow('▶ working') : chalk.dim('○ idle'))
          : chalk.dim('○ offline');

        const taskInfo = currentTask
          ? chalk.dim(` — ${currentTask.frontmatter.id}: ${currentTask.frontmatter.title}`)
          : '';

        console.log(`    ${name.padEnd(12)} ${status}${taskInfo}  ${chalk.dim(`(${agent.adapter})`)}`);
      }

      // Task summary
      console.log('');
      const done = tasks.filter(t => t.frontmatter.status === 'done').length;
      const inProgress = tasks.filter(t => t.frontmatter.status === 'in_progress').length;
      const pending = tasks.filter(t => ['pending', 'assigned'].includes(t.frontmatter.status)).length;
      const failed = tasks.filter(t => t.frontmatter.status === 'failed').length;

      console.log(chalk.bold('  Tasks:'));
      console.log(`    ${pending} pending | ${inProgress} in progress | ${done} done | ${failed} failed`);
      console.log('');

      if (!running) {
        console.log(chalk.dim('  Run `stajyer up` to start the daemon.'));
        console.log('');
      }
    });
}
