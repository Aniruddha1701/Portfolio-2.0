/**
 * Structured Logger with Request ID tracking.
 * Replaces raw console.log/error for production-grade observability.
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.info('Portfolio cache HIT', { key: 'portfolio:data' });
 *   logger.error('DB connection failed', { error: err.message });
 *
 * With request context:
 *   const log = logger.withRequestId(requestId);
 *   log.info('Processing request');
 */

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  requestId?: string;
  message: string;
  data?: Record<string, any>;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// In production, suppress DEBUG logs
const MIN_LEVEL: LogLevel = process.env.NODE_ENV === 'production' ? 'INFO' : 'DEBUG';

function formatLog(entry: LogEntry): string {
  const parts = [
    `[${entry.timestamp}]`,
    `[${entry.level}]`,
  ];

  if (entry.requestId) {
    parts.push(`[${entry.requestId}]`);
  }

  parts.push(entry.message);

  if (entry.data && Object.keys(entry.data).length > 0) {
    parts.push(JSON.stringify(entry.data));
  }

  return parts.join(' ');
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL];
}

function createLogEntry(
  level: LogLevel,
  message: string,
  data?: Record<string, any>,
  requestId?: string
): void {
  if (!shouldLog(level)) return;

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    requestId,
    message,
    data,
  };

  const formatted = formatLog(entry);

  switch (level) {
    case 'ERROR':
      console.error(formatted);
      break;
    case 'WARN':
      console.warn(formatted);
      break;
    default:
      console.log(formatted);
  }
}

// Generate a short unique request ID
export function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `req-${timestamp}-${random}`;
}

/**
 * Request-scoped logger — carries a request ID through the entire request lifecycle.
 */
class RequestLogger {
  constructor(private requestId: string) {}

  debug(message: string, data?: Record<string, any>) {
    createLogEntry('DEBUG', message, data, this.requestId);
  }

  info(message: string, data?: Record<string, any>) {
    createLogEntry('INFO', message, data, this.requestId);
  }

  warn(message: string, data?: Record<string, any>) {
    createLogEntry('WARN', message, data, this.requestId);
  }

  error(message: string, data?: Record<string, any>) {
    createLogEntry('ERROR', message, data, this.requestId);
  }
}

/**
 * Global logger — use when no request context is available (startup, background tasks).
 */
export const logger = {
  debug: (message: string, data?: Record<string, any>) =>
    createLogEntry('DEBUG', message, data),

  info: (message: string, data?: Record<string, any>) =>
    createLogEntry('INFO', message, data),

  warn: (message: string, data?: Record<string, any>) =>
    createLogEntry('WARN', message, data),

  error: (message: string, data?: Record<string, any>) =>
    createLogEntry('ERROR', message, data),

  /**
   * Create a request-scoped logger that includes the request ID in every log line.
   */
  withRequestId: (requestId: string) => new RequestLogger(requestId),
};
