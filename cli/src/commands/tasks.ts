import { Command } from 'commander';
import chalk from 'chalk';
import { requireProjectRoot } from '../utils/paths.js';
import { listTasks } from '../task/manager.js';
import type { TaskStatus } from '../task/parser.js';

const STATUS_COLORS: Record<TaskStatus, (s: string) => string> = {
  pending: chalk.gray,
  assigned: chalk.cyan,
  in_progress: chalk.yellow,
  done: chalk.green,
  failed: chalk.red,
  needs_human: chalk.magenta,
};

const STATUS_ICONS: Record<TaskStatus, string> = {
  pending: '○',
  assigned: '◐',
  in_progress: '▶',
  done: '●',
  failed: '✗',
  needs_human: '?',
};

export function registerTasksCommand(program: Command): void {
  program
    .command('tasks')
    .description('List all tasks')
    .option('--status <status>', 'Filter by status')
    .action((opts) => {
      const root = requireProjectRoot();
      const tasks = listTasks(root, opts.status ? { status: opts.status as TaskStatus } : undefined);

      if (tasks.length === 0) {
        console.log(chalk.dim('\n  No tasks found.\n'));
        return;
      }

      console.log('');
      for (const task of tasks) {
        const fm = task.frontmatter;
        const colorFn = STATUS_COLORS[fm.status] ?? chalk.white;
        const icon = STATUS_ICONS[fm.status] ?? ' ';
        const agent = fm.assigned_to ? chalk.dim(` → ${fm.assigned_to}`) : '';

        console.log(
          `  ${colorFn(icon)} ${chalk.bold(fm.id)} ${fm.title}${agent} ${colorFn(`[${fm.status}]`)}`
        );
      }
      console.log('');

      // Summary
      const done = tasks.filter(t => t.frontmatter.status === 'done').length;
      const inProgress = tasks.filter(t => t.frontmatter.status === 'in_progress').length;
      const pending = tasks.filter(t => ['pending', 'assigned'].includes(t.frontmatter.status)).length;
      console.log(chalk.dim(`  ${tasks.length} total | ${pending} pending | ${inProgress} in progress | ${done} done`));
      console.log('');
    });
}
