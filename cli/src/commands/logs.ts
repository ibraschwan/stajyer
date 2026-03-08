import { Command } from 'commander';
import net from 'node:net';
import chalk from 'chalk';
import { requireProjectRoot, socketPath } from '../utils/paths.js';
import { isDaemonRunning } from '../utils/pid.js';

export function registerLogsCommand(program: Command): void {
  program
    .command('logs')
    .argument('[agent]', 'Filter logs by agent name')
    .description('Stream daemon logs')
    .action((agentFilter) => {
      const root = requireProjectRoot();
      const { running } = isDaemonRunning(root);

      if (!running) {
        console.log(chalk.dim('\n  Daemon is not running. Start with `stajyer up`.\n'));
        return;
      }

      const sockPath = socketPath(root);
      const socket = net.createConnection(sockPath);

      socket.on('connect', () => {
        // Subscribe to logs
        socket.write(JSON.stringify({ method: 'subscribe:logs' }) + '\n');
        console.log(chalk.dim('\n  Streaming logs... (Ctrl+C to stop)\n'));
      });

      let buffer = '';
      socket.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const msg = JSON.parse(line);

            // Skip non-log messages (like the initial OK response)
            if (msg.type !== 'log') continue;

            // Apply filter
            if (agentFilter && msg.source !== agentFilter) continue;

            const time = new Date(msg.ts).toLocaleTimeString('en-US', { hour12: false });
            console.log(`  ${chalk.dim(time)} ${chalk.cyan(msg.source.padEnd(10))} ${msg.message}`);
          } catch {}
        }
      });

      socket.on('error', (err) => {
        console.log(chalk.red(`\n  Connection error: ${err.message}\n`));
        process.exit(1);
      });

      socket.on('close', () => {
        console.log(chalk.dim('\n  Connection closed.\n'));
        process.exit(0);
      });

      // Handle Ctrl+C
      process.on('SIGINT', () => {
        socket.end();
        process.exit(0);
      });
    });
}
