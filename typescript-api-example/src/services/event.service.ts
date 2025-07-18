import { ApiService } from './api';

export type EventType = 
  | 'course_started'
  | 'course_completed'
  | 'lesson_viewed'
  | 'quiz_attempted'
  | 'quiz_completed'
  | 'certificate_earned'
  | 'comment_posted'
  | 'user_enrolled'
  | 'user_unenrolled'
  | 'resource_downloaded'
  | 'custom';

export interface EventData {
  userId: number;
  type: EventType;
  resourceId?: number;
  resourceType?: string;
  metadata?: { [key: string]: any };
  timestamp?: Date;
}

export interface EventFilter {
  userId?: number;
  types?: EventType[];
  resourceId?: number;
  resourceType?: string;
  startDate?: Date;
  endDate?: Date;
  metadata?: { [key: string]: any };
}

export interface EventSubscription {
  id: number;
  userId: number;
  types: EventType[];
  conditions?: {
    resourceId?: number;
    resourceType?: string;
    metadata?: { [key: string]: any };
  };
  actions: Array<{
    type: 'notification' | 'webhook' | 'email';
    config: any;
  }>;
}

export class EventService {
  private api = ApiService.getInstance().getApi();
  private eventHandlers: Map<string, Set<(event: EventData) => void>> = new Map();
  private wsConnection?: WebSocket;

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    const wsUrl = process.env.WS_URL || 'ws://localhost:8000/ws/events';
    this.wsConnection = new WebSocket(wsUrl);

    this.wsConnection.onmessage = (message) => {
      const event = JSON.parse(message.data);
      this.handleEvent(event);
    };

    this.wsConnection.onclose = () => {
      setTimeout(() => this.initializeWebSocket(), 5000);
    };
  }

  private handleEvent(event: EventData) {
    const handlers = this.eventHandlers.get(event.type);
    if (handlers) {
      handlers.forEach(handler => handler(event));
    }

    // Gestionnaires génériques
    const allHandlers = this.eventHandlers.get('*');
    if (allHandlers) {
      allHandlers.forEach(handler => handler(event));
    }
  }

  // Émission d'événements
  async emit(event: EventData): Promise<void> {
    await this.api.post('/events', event);
  }

  async emitBatch(events: EventData[]): Promise<void> {
    await this.api.post('/events/batch', { events });
  }

  // Abonnement aux événements
  subscribe(type: EventType | '*', handler: (event: EventData) => void): () => void {
    if (!this.eventHandlers.has(type)) {
      this.eventHandlers.set(type, new Set());
    }
    this.eventHandlers.get(type)!.add(handler);

    return () => {
      const handlers = this.eventHandlers.get(type);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.eventHandlers.delete(type);
        }
      }
    };
  }

  // Gestion des abonnements serveur
  async createSubscription(subscription: Omit<EventSubscription, 'id'>): Promise<EventSubscription> {
    const response = await this.api.post('/events/subscriptions', subscription);
    return response.data;
  }

  async updateSubscription(id: number, updates: Partial<EventSubscription>): Promise<EventSubscription> {
    const response = await this.api.patch(`/events/subscriptions/${id}`, updates);
    return response.data;
  }

  async deleteSubscription(id: number): Promise<void> {
    await this.api.delete(`/events/subscriptions/${id}`);
  }

  async listSubscriptions(userId?: number): Promise<EventSubscription[]> {
    const response = await this.api.get('/events/subscriptions', {
      params: { userId }
    });
    return response.data;
  }

  // Recherche et historique d'événements
  async searchEvents(filter: EventFilter, page: number = 1, limit: number = 20): Promise<{
    events: EventData[];
    total: number;
  }> {
    const response = await this.api.get('/events/search', {
      params: {
        ...filter,
        page,
        limit
      }
    });
    return response.data;
  }

  async getEventTimeline(userId: number, options?: {
    startDate?: Date;
    endDate?: Date;
    types?: EventType[];
  }): Promise<Array<{
    date: string;
    events: EventData[];
  }>> {
    const response = await this.api.get(`/events/timeline/${userId}`, {
      params: options
    });
    return response.data;
  }

  // Agrégations et statistiques
  async getEventStats(filter: EventFilter): Promise<{
    total: number;
    byType: { [key in EventType]?: number };
    byResource: { [key: string]: number };
    timeline: Array<{
      date: string;
      count: number;
    }>;
  }> {
    const response = await this.api.get('/events/stats', {
      params: filter
    });
    return response.data;
  }

  // Webhooks
  async createWebhook(config: {
    url: string;
    secret: string;
    events: EventType[];
    metadata?: { [key: string]: any };
  }): Promise<{
    id: string;
    url: string;
    events: EventType[];
  }> {
    const response = await this.api.post('/events/webhooks', config);
    return response.data;
  }

  async listWebhooks(): Promise<Array<{
    id: string;
    url: string;
    events: EventType[];
    status: 'active' | 'disabled';
    lastDelivery?: {
      timestamp: Date;
      success: boolean;
      statusCode?: number;
    };
  }>> {
    const response = await this.api.get('/events/webhooks');
    return response.data;
  }

  async deleteWebhook(id: string): Promise<void> {
    await this.api.delete(`/events/webhooks/${id}`);
  }

  // Utilitaires pour les événements courants
  async trackCourseProgress(userId: number, courseId: number, progress: number): Promise<void> {
    await this.emit({
      userId,
      type: 'course_started',
      resourceId: courseId,
      resourceType: 'course',
      metadata: { progress }
    });
  }

  async trackQuizAttempt(userId: number, quizId: number, score: number): Promise<void> {
    await this.emit({
      userId,
      type: 'quiz_attempted',
      resourceId: quizId,
      resourceType: 'quiz',
      metadata: { score }
    });
  }

  async trackResourceDownload(userId: number, resourceId: number, resourceType: string): Promise<void> {
    await this.emit({
      userId,
      type: 'resource_downloaded',
      resourceId,
      resourceType,
      metadata: { timestamp: new Date() }
    });
  }
}
