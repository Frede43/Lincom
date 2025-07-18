import { ApiService } from './api';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: any;
  tags?: string[];
  userId?: string;
  sessionId?: string;
  requestId?: string;
  source?: string;
  stack?: string;
}

export interface LogFilter {
  level?: LogLevel;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  userId?: string;
  sessionId?: string;
  requestId?: string;
  source?: string;
  search?: string;
}

export interface LoggerOptions {
  minLevel?: LogLevel;
  tags?: string[];
  context?: any;
  remote?: boolean;
  console?: boolean;
  file?: boolean;
}

export class LoggerService {
  private api = ApiService.getInstance().getApi();
  private static instance: LoggerService;
  private options: LoggerOptions;
  private context: Map<string, any> = new Map();
  private buffer: LogEntry[] = [];
  private readonly BUFFER_SIZE = 100;
  private readonly FLUSH_INTERVAL = 5000;

  private constructor(options: LoggerOptions = {}) {
    this.options = {
      minLevel: 'info',
      remote: true,
      console: true,
      file: true,
      ...options
    };

    // Flush périodique du buffer
    setInterval(() => this.flush(), this.FLUSH_INTERVAL);

    // Flush avant la fermeture de l'application
    window.addEventListener('beforeunload', () => this.flush());
  }

  static getInstance(options?: LoggerOptions): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService(options);
    }
    return LoggerService.instance;
  }

  // Méthodes de logging de base
  async debug(message: string, context?: any): Promise<void> {
    this.log('debug', message, context);
  }

  async info(message: string, context?: any): Promise<void> {
    this.log('info', message, context);
  }

  async warn(message: string, context?: any): Promise<void> {
    this.log('warn', message, context);
  }

  async error(message: string, error?: Error, context?: any): Promise<void> {
    this.log('error', message, {
      ...context,
      error: error?.message,
      stack: error?.stack
    });
  }

  async fatal(message: string, error?: Error, context?: any): Promise<void> {
    this.log('fatal', message, {
      ...context,
      error: error?.message,
      stack: error?.stack
    });
  }

  private async log(level: LogLevel, message: string, context?: any): Promise<void> {
    if (this.shouldLog(level)) {
      const entry: LogEntry = {
        timestamp: new Date(),
        level,
        message,
        context: {
          ...this.getMergedContext(),
          ...context
        },
        tags: this.options.tags,
        source: 'frontend'
      };

      // Logging console
      if (this.options.console) {
        this.logToConsole(entry);
      }

      // Buffer pour le logging distant
      if (this.options.remote) {
        this.buffer.push(entry);
        if (this.buffer.length >= this.BUFFER_SIZE) {
          await this.flush();
        }
      }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: { [key in LogLevel]: number } = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
      fatal: 4
    };

    return levels[level] >= levels[this.options.minLevel!];
  }

  // Gestion du contexte
  setContext(key: string, value: any): void {
    this.context.set(key, value);
  }

  clearContext(key?: string): void {
    if (key) {
      this.context.delete(key);
    } else {
      this.context.clear();
    }
  }

  private getMergedContext(): any {
    const mergedContext: any = {};
    for (const [key, value] of this.context.entries()) {
      mergedContext[key] = value;
    }
    return mergedContext;
  }

  // Gestion du buffer et envoi distant
  private async flush(): Promise<void> {
    if (this.buffer.length > 0) {
      try {
        await this.api.post('/logs/batch', {
          entries: this.buffer
        });
        this.buffer = [];
      } catch (error) {
        console.error('Erreur lors du flush des logs:', error);
      }
    }
  }

  // Logging console avec couleurs
  private logToConsole(entry: LogEntry): void {
    const styles: { [key in LogLevel]: string[] } = {
      debug: ['color: gray'],
      info: ['color: green'],
      warn: ['color: orange'],
      error: ['color: red'],
      fatal: ['color: red', 'font-weight: bold']
    };

    const timestamp = entry.timestamp.toISOString();
    const style = styles[entry.level].join(';');
    
    console.groupCollapsed(
      `%c${timestamp} [${entry.level.toUpperCase()}] ${entry.message}`,
      style
    );
    
    if (entry.context) {
      console.log('Context:', entry.context);
    }
    if (entry.stack) {
      console.log('Stack:', entry.stack);
    }
    console.groupEnd();
  }

  // Recherche et analyse des logs
  async search(filter: LogFilter): Promise<LogEntry[]> {
    const response = await this.api.get('/logs/search', {
      params: filter
    });
    return response.data.entries;
  }

  async getStats(filter: LogFilter): Promise<{
    totalEntries: number;
    byLevel: { [key in LogLevel]: number };
    byTag: { [key: string]: number };
    timeline: Array<{
      timestamp: Date;
      count: number;
      level: LogLevel;
    }>;
  }> {
    const response = await this.api.get('/logs/stats', {
      params: filter
    });
    return response.data;
  }

  // Utilitaires
  async measureTime(label: string, fn: () => Promise<any>): Promise<any> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.info(`${label} completed in ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.error(`${label} failed after ${duration.toFixed(2)}ms`, error as Error);
      throw error;
    }
  }

  async withContext<T>(context: any, fn: () => Promise<T>): Promise<T> {
    const previousContext = new Map(this.context);
    Object.entries(context).forEach(([key, value]) => {
      this.setContext(key, value);
    });

    try {
      return await fn();
    } finally {
      this.context = previousContext;
    }
  }
}
