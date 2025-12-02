type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, context } = entry;
    let formatted = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

    if (context && Object.keys(context).length > 0) {
      formatted += ` | Context: ${JSON.stringify(context)}`;
    }

    return formatted;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log warnings and errors
    if (!this.isDevelopment) {
      return level === 'warn' || level === 'error';
    }
    return true;
  }

  private sendToExternalService(entry: LogEntry): void {
    // In production, send logs to external logging service
    if (
      !this.isDevelopment &&
      (entry.level === 'error' || entry.level === 'warn')
    ) {
      // TODO: Implement external logging service integration
      // e.g., Sentry, LogRocket, or custom logging endpoint
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('debug', message, context);

    if (this.shouldLog('debug')) {
      // eslint-disable-next-line no-console
      console.debug(this.formatMessage(entry));
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('info', message, context);

    if (this.shouldLog('info')) {
      // eslint-disable-next-line no-console
      console.info(this.formatMessage(entry));
    }

    this.sendToExternalService(entry);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('warn', message, context);

    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage(entry));
    }

    this.sendToExternalService(entry);
  }

  error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): void {
    const entry = this.createLogEntry('error', message, context, error);

    if (this.shouldLog('error')) {
      console.error(this.formatMessage(entry));
      if (error) {
        console.error('Error details:', error);
      }
    }

    this.sendToExternalService(entry);
  }

  // Auth-specific logging methods
  authSuccess(action: string, context?: Record<string, unknown>): void {
    this.info(`Auth success: ${action}`, {
      ...context,
      category: 'authentication',
    });
  }

  authError(
    action: string,
    error?: Error,
    context?: Record<string, unknown>
  ): void {
    this.error(`Auth error: ${action}`, error, {
      ...context,
      category: 'authentication',
    });
  }

  apiRequest(
    method: string,
    endpoint: string,
    context?: Record<string, unknown>
  ): void {
    this.debug(`API request: ${method} ${endpoint}`, {
      ...context,
      category: 'api',
    });
  }

  apiError(
    method: string,
    endpoint: string,
    status: number,
    error?: Error
  ): void {
    this.error(`API error: ${method} ${endpoint} - Status: ${status}`, error, {
      method,
      endpoint,
      status,
      category: 'api',
    });
  }

  // Conversation-specific logging methods
  conversation(action: string, context?: Record<string, unknown>): void {
    this.info(`Conversation: ${action}`, {
      ...context,
      category: 'conversation',
    });
  }

  conversationError(
    action: string,
    error?: Error | unknown,
    context?: Record<string, unknown>
  ): void {
    this.error(
      `Conversation error: ${action}`,
      error instanceof Error ? error : new Error(String(error)),
      {
        ...context,
        category: 'conversation',
      }
    );
  }
}

// Create singleton instance
export const logger = new Logger();

// Export logger instance as default
export default logger;
