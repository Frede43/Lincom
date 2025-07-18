import { ApiService } from './api';

export type NotificationType = 
  | 'course_update'
  | 'quiz_due'
  | 'grade_posted'
  | 'assignment_due'
  | 'course_announcement'
  | 'new_comment'
  | 'mention'
  | 'system';

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface CreateNotificationDTO {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
}

export class NotificationService {
  private api = ApiService.getInstance().getApi();
  private wsConnection?: WebSocket;

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    const wsUrl = process.env.WS_URL || 'ws://localhost:8000/ws/notifications';
    this.wsConnection = new WebSocket(wsUrl);

    this.wsConnection.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      this.handleNotification(notification);
    };

    this.wsConnection.onclose = () => {
      setTimeout(() => this.initializeWebSocket(), 5000);
    };
  }

  private handleNotification(notification: Notification) {
    // Émettre un événement pour l'interface utilisateur
    const event = new CustomEvent('notification', { detail: notification });
    window.dispatchEvent(event);

    // Afficher une notification système si supporté
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/notification-icon.png'
      });
    }
  }

  async getNotifications(page: number = 1, limit: number = 20): Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    const response = await this.api.get(`/notifications?${params.toString()}`);
    return response.data;
  }

  async getUnreadCount(): Promise<number> {
    const response = await this.api.get('/notifications/unread/count');
    return response.data.count;
  }

  async markAsRead(notificationId: number): Promise<Notification> {
    const response = await this.api.post(`/notifications/${notificationId}/read`);
    return response.data;
  }

  async markAllAsRead(): Promise<void> {
    await this.api.post('/notifications/read-all');
  }

  async markAsUnread(notificationId: number): Promise<Notification> {
    const response = await this.api.post(`/notifications/${notificationId}/unread`);
    return response.data;
  }

  async archiveNotification(notificationId: number): Promise<Notification> {
    const response = await this.api.post(`/notifications/${notificationId}/archive`);
    return response.data;
  }

  async deleteNotification(notificationId: number): Promise<boolean> {
    await this.api.delete(`/notifications/${notificationId}`);
    return true;
  }

  async createNotification(data: CreateNotificationDTO): Promise<Notification> {
    const response = await this.api.post('/notifications', data);
    return response.data;
  }

  async getNotificationPreferences(): Promise<{
    email: boolean;
    push: boolean;
    inApp: boolean;
    types: { [key in NotificationType]: boolean };
  }> {
    const response = await this.api.get('/notifications/preferences');
    return response.data;
  }

  async updateNotificationPreferences(preferences: {
    email?: boolean;
    push?: boolean;
    inApp?: boolean;
    types?: { [key in NotificationType]?: boolean };
  }): Promise<void> {
    await this.api.put('/notifications/preferences', preferences);
  }

  async subscribeToWebPush(): Promise<void> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.VAPID_PUBLIC_KEY
        });

        await this.api.post('/notifications/web-push/subscribe', subscription);
      } catch (error) {
        console.error('Error subscribing to push notifications:', error);
        throw error;
      }
    }
  }

  async unsubscribeFromWebPush(): Promise<void> {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      await this.api.post('/notifications/web-push/unsubscribe', subscription);
    }
  }

  // Méthodes utilitaires pour créer des notifications spécifiques
  async notifyCourseUpdate(courseId: number, updateType: string, message: string): Promise<void> {
    await this.createNotification({
      userId: 0, // Sera remplacé par le backend
      type: 'course_update',
      title: 'Course Update',
      message,
      data: { courseId, updateType }
    });
  }

  async notifyQuizDue(quizId: number, dueDate: Date): Promise<void> {
    await this.createNotification({
      userId: 0,
      type: 'quiz_due',
      title: 'Quiz Due Soon',
      message: `You have a quiz due on ${dueDate.toLocaleDateString()}`,
      data: { quizId, dueDate }
    });
  }

  async notifyGradePosted(courseId: number, quizId: number, grade: number): Promise<void> {
    await this.createNotification({
      userId: 0,
      type: 'grade_posted',
      title: 'New Grade Posted',
      message: `Your grade has been posted: ${grade}%`,
      data: { courseId, quizId, grade }
    });
  }
}
