// backend/src/common/logger.ts
type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const LEVEL_ORDER: Record<LogLevel, number> = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };

const configuredLevel = (process.env.LOG_LEVEL?.toUpperCase() ?? 'INFO') as LogLevel;

function emit(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[configuredLevel]) return;

  const entry: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  const output = JSON.stringify(entry);
  if (level === 'ERROR' || level === 'WARN') {
    console.error(output);
  } else {
    console.log(output);
  }
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => emit('DEBUG', message, context),
  info:  (message: string, context?: Record<string, unknown>) => emit('INFO',  message, context),
  warn:  (message: string, context?: Record<string, unknown>) => emit('WARN',  message, context),
  error: (message: string, context?: Record<string, unknown>) => emit('ERROR', message, context),
};
