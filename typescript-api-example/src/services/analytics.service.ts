import { ApiService } from './api';

export interface UserAnalytics {
  totalTimeSpent: number;
  coursesEnrolled: number;
  coursesCompleted: number;
  averageQuizScore: number;
  totalQuizAttempts: number;
  lastActive: Date;
  learningStreak: number;
  certificatesEarned: number;
  engagementScore: number;
}

export interface CourseAnalytics {
  totalEnrollments: number;
  activeStudents: number;
  completionRate: number;
  averageTimeToComplete: number;
  averageQuizScore: number;
  studentEngagement: {
    high: number;
    medium: number;
    low: number;
  };
  popularLessons: Array<{
    lessonId: number;
    views: number;
    averageTimeSpent: number;
  }>;
  quizPerformance: Array<{
    quizId: number;
    attempts: number;
    averageScore: number;
    passRate: number;
  }>;
}

export interface SystemAnalytics {
  totalUsers: number;
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  totalCourses: number;
  totalLessons: number;
  totalQuizzes: number;
  totalCertificates: number;
  platformEngagement: {
    date: string;
    users: number;
    sessions: number;
    averageSessionDuration: number;
  }[];
}

export class AnalyticsService {
  private api = ApiService.getInstance().getApi();

  // Analyses utilisateur
  async getUserAnalytics(userId: number): Promise<UserAnalytics> {
    const response = await this.api.get(`/analytics/users/${userId}`);
    return response.data;
  }

  async getUserLearningPath(userId: number): Promise<{
    completedCourses: number[];
    recommendedCourses: number[];
    skillsGained: string[];
    nextMilestones: Array<{
      type: string;
      description: string;
      progress: number;
    }>;
  }> {
    const response = await this.api.get(`/analytics/users/${userId}/learning-path`);
    return response.data;
  }

  async trackUserActivity(data: {
    userId: number;
    activityType: string;
    resourceId: number;
    timeSpent: number;
    progress?: number;
  }): Promise<void> {
    await this.api.post('/analytics/track/activity', data);
  }

  // Analyses de cours
  async getCourseAnalytics(courseId: number): Promise<CourseAnalytics> {
    const response = await this.api.get(`/analytics/courses/${courseId}`);
    return response.data;
  }

  async getCourseTrends(courseId: number, period: 'week' | 'month' | 'year'): Promise<{
    enrollments: Array<{ date: string; count: number }>;
    completions: Array<{ date: string; count: number }>;
    engagement: Array<{ date: string; score: number }>;
  }> {
    const response = await this.api.get(`/analytics/courses/${courseId}/trends?period=${period}`);
    return response.data;
  }

  async getCourseHeatmap(courseId: number): Promise<Array<{
    lessonId: number;
    difficulty: 'easy' | 'medium' | 'hard';
    studentStruggleScore: number;
    timeToComplete: number;
  }>> {
    const response = await this.api.get(`/analytics/courses/${courseId}/heatmap`);
    return response.data;
  }

  // Analyses système
  async getSystemAnalytics(): Promise<SystemAnalytics> {
    const response = await this.api.get('/analytics/system');
    return response.data;
  }

  async getSystemHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    services: Array<{
      name: string;
      status: 'up' | 'down';
      latency: number;
    }>;
    metrics: {
      cpu: number;
      memory: number;
      storage: number;
      activeConnections: number;
    };
  }> {
    const response = await this.api.get('/analytics/system/health');
    return response.data;
  }

  // Rapports
  async generateReport(options: {
    type: 'user' | 'course' | 'system';
    id?: number;
    startDate?: Date;
    endDate?: Date;
    metrics: string[];
    format: 'pdf' | 'csv' | 'excel';
  }): Promise<string> {
    const response = await this.api.post('/analytics/reports/generate', options);
    return response.data.reportUrl;
  }

  async scheduleReport(options: {
    type: 'user' | 'course' | 'system';
    id?: number;
    frequency: 'daily' | 'weekly' | 'monthly';
    metrics: string[];
    format: 'pdf' | 'csv' | 'excel';
    recipients: string[];
  }): Promise<{
    scheduleId: number;
    nextRunDate: Date;
  }> {
    const response = await this.api.post('/analytics/reports/schedule', options);
    return response.data;
  }

  // Prédictions et recommandations
  async predictCourseCompletion(userId: number, courseId: number): Promise<{
    likelihood: number;
    estimatedCompletionDate: Date;
    riskFactors: string[];
    recommendations: string[];
  }> {
    const response = await this.api.get(
      `/analytics/predictions/completion?userId=${userId}&courseId=${courseId}`
    );
    return response.data;
  }

  async getPersonalizedRecommendations(userId: number): Promise<Array<{
    courseId: number;
    matchScore: number;
    reasons: string[];
  }>> {
    const response = await this.api.get(`/analytics/recommendations/${userId}`);
    return response.data;
  }

  async getContentGaps(courseId: number): Promise<{
    missingTopics: string[];
    suggestedImprovements: Array<{
      section: string;
      suggestion: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    competitorComparison: Array<{
      topic: string;
      coverageScore: number;
    }>;
  }> {
    const response = await this.api.get(`/analytics/courses/${courseId}/gaps`);
    return response.data;
  }
}
