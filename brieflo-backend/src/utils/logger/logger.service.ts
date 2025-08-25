import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  service?: string;
  method?: string;
  userId?: string;
  requestId?: string;
  [key: string]: any;
}

@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly isDevelopment: boolean;
  private readonly logLevel: LogLevel;

  constructor(private configService: ConfigService) {
    this.isDevelopment =
      this.configService.get<string>('NODE_ENV') === 'development';
    this.logLevel =
      (this.configService.get<string>('LOG_LEVEL') as LogLevel) || 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDevelopment) return false;

    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };

    return levels[level] >= levels[this.logLevel];
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext,
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${JSON.stringify(context)}]` : '';
    return `[${timestamp}] [${level.toUpperCase()}]${contextStr} ${message}`;
  }

  log(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message, context));
    }
  }

  error(message: string, trace?: string, context?: LogContext): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, context));
      if (trace) {
        console.error('Stack trace:', trace);
      }
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  verbose(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  // Custom methods for specific logging scenarios

  // API request logging
  apiRequest(
    method: string,
    url: string,
    userId?: string,
    requestId?: string,
  ): void {
    if (this.shouldLog('info')) {
      const context: LogContext = { method, url };
      if (userId) context.userId = userId;
      if (requestId) context.requestId = requestId;
      console.log(
        this.formatMessage('info', `API Request: ${method} ${url}`, context),
      );
    }
  }

  // API response logging
  apiResponse(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    userId?: string,
    requestId?: string,
  ): void {
    if (this.shouldLog('info')) {
      const context: LogContext = {
        method,
        url,
        statusCode,
        duration: `${duration}ms`,
      };
      if (userId) context.userId = userId;
      if (requestId) context.requestId = requestId;
      console.log(
        this.formatMessage(
          'info',
          `API Response: ${method} ${url} - ${statusCode}`,
          context,
        ),
      );
    }
  }

  // Authentication logging
  auth(
    event: 'login' | 'logout' | 'register' | 'token_refresh' | 'oauth_success',
    details?: Record<string, any>,
  ): void {
    if (this.shouldLog('info')) {
      const context: LogContext = { event, ...details };
      console.log(this.formatMessage('info', `Auth: ${event}`, context));
    }
  }

  // Database operation logging
  database(
    operation: 'create' | 'read' | 'update' | 'delete',
    collection: string,
    documentId?: string,
    userId?: string,
  ): void {
    if (this.shouldLog('debug')) {
      const context: LogContext = { operation, collection };
      if (documentId) context.documentId = documentId;
      if (userId) context.userId = userId;
      console.debug(
        this.formatMessage(
          'debug',
          `Database: ${operation} ${collection}`,
          context,
        ),
      );
    }
  }

  // User action logging
  userAction(
    action: string,
    userId: string,
    details?: Record<string, any>,
  ): void {
    if (this.shouldLog('info')) {
      const context: LogContext = { action, userId, ...details };
      console.log(
        this.formatMessage('info', `User Action: ${action}`, context),
      );
    }
  }

  // Error logging with full context
  errorWithContext(message: string, error: Error, context?: LogContext): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, context));
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
  }

  // Performance logging
  performance(operation: string, duration: number, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      const perfContext: LogContext = { ...context, duration: `${duration}ms` };
      console.debug(
        this.formatMessage('debug', `Performance: ${operation}`, perfContext),
      );
    }
  }

  // Security event logging
  security(
    event: 'failed_login' | 'suspicious_activity' | 'rate_limit_exceeded',
    details?: Record<string, any>,
  ): void {
    if (this.shouldLog('warn')) {
      const context: LogContext = { event, ...details };
      console.warn(this.formatMessage('warn', `Security: ${event}`, context));
    }
  }
}
