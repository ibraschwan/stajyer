import chalk from 'chalk';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_COLORS: Record<LogLevel, (s: string) => string> = {
  debug: chalk.gray,
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.red,
};

const LEVEL_LABELS: Record<LogLevel, string> = {
  debug: 'DBG',
  info: 'INF',
  warn: 'WRN',
  error: 'ERR',
};

let minLevel: LogLevel = 'info';

export function setLogLevel(level: LogLevel): void {
  minLevel = level;
}

const LEVEL_ORDER: LogLevel[] = ['debug', 'info', 'warn', 'error'];

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER.indexOf(level) >= LEVEL_ORDER.indexOf(minLevel);
}

function timestamp(): string {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

export function log(level: LogLevel, source: string, message: string): void {
  if (!shouldLog(level)) return;
  const color = LEVEL_COLORS[level];
  const label = LEVEL_LABELS[level];
  console.error(
    `${chalk.dim(timestamp())} ${color(label)} ${chalk.cyan(source.padEnd(10))} ${message}`
  );
}

export const logger = {
  debug: (source: string, msg: string) => log('debug', source, msg),
  info: (source: string, msg: string) => log('info', source, msg),
  warn: (source: string, msg: string) => log('warn', source, msg),
  error: (source: string, msg: string) => log('error', source, msg),
};
