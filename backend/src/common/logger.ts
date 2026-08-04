type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const LEVEL_ORDER: Record<LogLevel, number> = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };

const configuredLevel = (process.env.LOG_LEVEL?.toUpperCase() ?? 'INFO') as LogLevel;

// The Lambda runtime injects _X_AMZN_TRACE_ID on every invocation, with or
// without X-Ray "Active": format "Root=1-xxxx-xxxx;Parent=xxxx;Sampled=0|1".
// Extracted here (not passed manually per handler) so every log line comes
// out automatically correlatable with the X-Ray trace.
function getTraceId(): string | undefined {
  const raw = process.env._X_AMZN_TRACE_ID;
  if (!raw) return undefined;
  return raw.match(/Root=([^;]+)/)?.[1];
}

function emit(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[configuredLevel]) return;

  const traceId = getTraceId();
  const entry: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(traceId && { traceId }),
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
