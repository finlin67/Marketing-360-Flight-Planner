/**
 * Logger utility for development and production
 * Replaces console.* calls with environment-aware logging
 */

const isDev = import.meta.env.DEV;

export const logger = {
  error: (...args: unknown[]) => {
    if (isDev) {
      console.error(...args);
    }
    // In production, you could send to error tracking service here
    // e.g., Sentry.captureException(args[0])
  },
  
  log: (...args: unknown[]) => {
    if (isDev) {
      console.log(...args);
    }
  },
  
  warn: (...args: unknown[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  
  info: (...args: unknown[]) => {
    if (isDev) {
      console.info(...args);
    }
  },
};

