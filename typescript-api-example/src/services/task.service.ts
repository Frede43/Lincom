import { ApiService } from './api';

export type TaskStatus = 
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'scheduled';

export type TaskPriority = 'low' | 'normal' | 'high' | 'critical';

export interface TaskOptions {
  priority?: TaskPriority;
  retries?: number;
  timeout?: number;
  schedule?: {
    cron?: string;
    startDate?: Date;
    endDate?: Date;
    timezone?: string;
  };
  dependencies?: string[];
  tags?: string[];
  metadata?: { [key: string]: any };
}

export interface TaskResult {
  id: string;
  type: string;
  status: TaskStatus;
  progress: number;
  result?: any;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
}

export class TaskService {
  private api = ApiService.getInstance().getApi();
  private taskHandlers: Map<string, Set<(result: TaskResult) => void>> = new Map();
  private wsConnection?: WebSocket;

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    const wsUrl = process.env.WS_URL || 'ws://localhost:8000/ws/tasks';
    this.wsConnection = new WebSocket(wsUrl);

    this.wsConnection.onmessage = (message) => {
      const result = JSON.parse(message.data);
      this.handleTaskUpdate(result);
    };

    this.wsConnection.onclose = () => {
      setTimeout(() => this.initializeWebSocket(), 5000);
    };
  }

  private handleTaskUpdate(result: TaskResult) {
    const handlers = this.taskHandlers.get(result.id);
    if (handlers) {
      handlers.forEach(handler => handler(result));
    }
  }

  // Création et gestion des tâches
  async createTask(type: string, data: any, options?: TaskOptions): Promise<string> {
    const response = await this.api.post('/tasks', {
      type,
      data,
      ...options
    });
    return response.data.taskId;
  }

  async scheduleTask(type: string, data: any, schedule: TaskOptions['schedule']): Promise<string> {
    const response = await this.api.post('/tasks/schedule', {
      type,
      data,
      schedule
    });
    return response.data.taskId;
  }

  async cancelTask(taskId: string): Promise<void> {
    await this.api.post(`/tasks/${taskId}/cancel`);
  }

  async retryTask(taskId: string): Promise<void> {
    await this.api.post(`/tasks/${taskId}/retry`);
  }

  async getTaskStatus(taskId: string): Promise<TaskResult> {
    const response = await this.api.get(`/tasks/${taskId}`);
    return response.data;
  }

  async getTaskStatuses(taskIds: string[]): Promise<TaskResult[]> {
    const response = await this.api.get('/tasks/status', {
      params: { ids: taskIds.join(',') }
    });
    return response.data;
  }

  // Surveillance des tâches
  onTaskUpdate(taskId: string, handler: (result: TaskResult) => void): () => void {
    if (!this.taskHandlers.has(taskId)) {
      this.taskHandlers.set(taskId, new Set());
    }
    this.taskHandlers.get(taskId)!.add(handler);

    return () => {
      const handlers = this.taskHandlers.get(taskId);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.taskHandlers.delete(taskId);
        }
      }
    };
  }

  // Gestion des files d'attente
  async getQueueStatus(): Promise<{
    queues: Array<{
      name: string;
      size: number;
      processing: number;
      failed: number;
    }>;
    workers: Array<{
      id: string;
      status: 'idle' | 'busy';
      currentTask?: string;
      lastActive: Date;
    }>;
  }> {
    const response = await this.api.get('/tasks/queues');
    return response.data;
  }

  async clearQueue(queueName: string): Promise<void> {
    await this.api.delete(`/tasks/queues/${queueName}`);
  }

  // Tâches planifiées
  async listScheduledTasks(): Promise<Array<{
    id: string;
    type: string;
    schedule: NonNullable<TaskOptions['schedule']>;
    lastRun?: Date;
    nextRun?: Date;
    status: 'active' | 'paused';
  }>> {
    const response = await this.api.get('/tasks/scheduled');
    return response.data;
  }

  async pauseScheduledTask(taskId: string): Promise<void> {
    await this.api.post(`/tasks/scheduled/${taskId}/pause`);
  }

  async resumeScheduledTask(taskId: string): Promise<void> {
    await this.api.post(`/tasks/scheduled/${taskId}/resume`);
  }

  // Tâches courantes
  async processVideo(videoId: string, options?: {
    format?: string;
    quality?: string;
    thumbnails?: boolean;
  }): Promise<string> {
    return this.createTask('video_processing', {
      videoId,
      ...options
    });
  }

  async generateReport(reportType: string, filters: any, format: string): Promise<string> {
    return this.createTask('report_generation', {
      type: reportType,
      filters,
      format
    }, { priority: 'normal' });
  }

  async importData(source: string, data: any): Promise<string> {
    return this.createTask('data_import', {
      source,
      data
    }, { priority: 'high' });
  }

  async exportData(target: string, filters: any): Promise<string> {
    return this.createTask('data_export', {
      target,
      filters
    });
  }

  async cleanupOldData(options: {
    olderThan: Date;
    types: string[];
  }): Promise<string> {
    return this.createTask('data_cleanup', options, {
      priority: 'low',
      schedule: {
        cron: '0 0 * * *' // Tous les jours à minuit
      }
    });
  }

  // Surveillance et métriques
  async getTaskMetrics(options?: {
    startDate?: Date;
    endDate?: Date;
    types?: string[];
  }): Promise<{
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    averageDuration: number;
    byType: { [key: string]: number };
    byStatus: { [key in TaskStatus]: number };
    timeline: Array<{
      date: string;
      count: number;
      status: TaskStatus;
    }>;
  }> {
    const response = await this.api.get('/tasks/metrics', {
      params: options
    });
    return response.data;
  }

  async getTaskLogs(taskId: string): Promise<Array<{
    timestamp: Date;
    level: 'info' | 'warning' | 'error';
    message: string;
    metadata?: any;
  }>> {
    const response = await this.api.get(`/tasks/${taskId}/logs`);
    return response.data;
  }
}
