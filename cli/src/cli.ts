import { Command } from 'commander';
import { registerInitCommand } from './commands/init.js';
import { registerTaskCommand } from './commands/task.js';
import { registerTasksCommand } from './commands/tasks.js';
import { registerStatusCommand } from './commands/status.js';
import { registerUpCommand } from './commands/up.js';
import { registerDownCommand } from './commands/down.js';
import { registerLogsCommand } from './commands/logs.js';
import { registerWatchCommand } from './commands/watch.js';

export const cli = new Command()
  .name('stajyer')
  .description('AI agent orchestration — let your stajyer take over your job')
  .version('0.1.0');

registerInitCommand(cli);
registerTaskCommand(cli);
registerTasksCommand(cli);
registerStatusCommand(cli);
registerUpCommand(cli);
registerDownCommand(cli);
registerLogsCommand(cli);
registerWatchCommand(cli);
