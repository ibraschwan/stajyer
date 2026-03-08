import { Command } from 'commander';
import chalk from 'chalk';
import { requireProjectRoot } from '../utils/paths.js';
import { createTask } from '../task/manager.js';

export function registerTaskCommand(program: Command): void {
  program
    .command('task')
    .argument('<description>', 'Task description')
    .option('--to <agent>', 'Assign to specific agent')
    .description('Create a new task')
    .action((description, opts) => {
      const root = requireProjectRoot();

      const task = createTask(root, description, description, {
        assigned_to: opts.to,
        created_by: 'user',
      });

      const fm = task.frontmatter;
      console.log('');
      console.log(chalk.green(`  + Task ${fm.id} created: ${fm.title}`));
      if (fm.assigned_to) {
        console.log(chalk.dim(`    Assigned to: ${fm.assigned_to}`));
      }
      console.log(chalk.dim(`    File: ${task.filePath}`));
      console.log('');
    });
}
