import { ApiService } from './api';

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  content: string;
  duration: number;
  order: number;
  type: 'video' | 'text' | 'interactive' | 'assignment';
  media?: {
    type: 'video' | 'image' | 'document' | 'audio';
    url: string;
    duration?: number;
    thumbnail?: string;
  }[];
  resources?: {
    title: string;
    type: string;
    url: string;
    size?: number;
  }[];
  objectives: string[];
  prerequisites?: number[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLessonDTO {
  courseId: number;
  title: string;
  content: string;
  duration: number;
  order: number;
  type: 'video' | 'text' | 'interactive' | 'assignment';
  media?: {
    type: 'video' | 'image' | 'document' | 'audio';
    url: string;
    duration?: number;
    thumbnail?: string;
  }[];
  resources?: {
    title: string;
    type: string;
    url: string;
    size?: number;
  }[];
  objectives: string[];
  prerequisites?: number[];
}

export interface UpdateLessonDTO {
  title?: string;
  content?: string;
  duration?: number;
  order?: number;
  type?: 'video' | 'text' | 'interactive' | 'assignment';
  media?: {
    type: 'video' | 'image' | 'document' | 'audio';
    url: string;
    duration?: number;
    thumbnail?: string;
  }[];
  resources?: {
    title: string;
    type: string;
    url: string;
    size?: number;
  }[];
  objectives?: string[];
  prerequisites?: number[];
  isPublished?: boolean;
}

export interface LessonProgress {
  userId: number;
  lessonId: number;
  status: 'not_started' | 'in_progress' | 'completed';
  timeSpent: number;
  lastPosition?: number;
  completedAt?: Date;
  notes?: string[];
}

export class LessonService {
  private api = ApiService.getInstance().getApi();

  async getLessons(courseId: number, page: number = 1, limit: number = 10): Promise<{
    lessons: Lesson[];
    total: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    const response = await this.api.get(`/courses/${courseId}/lessons?${params.toString()}`);
    return response.data;
  }

  async getLessonById(courseId: number, lessonId: number): Promise<Lesson | null> {
    const response = await this.api.get(`/courses/${courseId}/lessons/${lessonId}`);
    return response.data;
  }

  async createLesson(courseId: number, data: CreateLessonDTO): Promise<Lesson> {
    const response = await this.api.post(`/courses/${courseId}/lessons`, data);
    return response.data;
  }

  async updateLesson(courseId: number, lessonId: number, data: UpdateLessonDTO): Promise<Lesson | null> {
    const response = await this.api.put(`/courses/${courseId}/lessons/${lessonId}`, data);
    return response.data;
  }

  async deleteLesson(courseId: number, lessonId: number): Promise<boolean> {
    await this.api.delete(`/courses/${courseId}/lessons/${lessonId}`);
    return true;
  }

  async publishLesson(courseId: number, lessonId: number): Promise<Lesson> {
    const response = await this.api.post(`/courses/${courseId}/lessons/${lessonId}/publish`);
    return response.data;
  }

  async unpublishLesson(courseId: number, lessonId: number): Promise<Lesson> {
    const response = await this.api.post(`/courses/${courseId}/lessons/${lessonId}/unpublish`);
    return response.data;
  }

  async getLessonProgress(courseId: number, lessonId: number, userId: number): Promise<LessonProgress> {
    const response = await this.api.get(`/courses/${courseId}/lessons/${lessonId}/progress/${userId}`);
    return response.data;
  }

  async updateLessonProgress(courseId: number, lessonId: number, data: {
    status?: 'not_started' | 'in_progress' | 'completed';
    timeSpent?: number;
    lastPosition?: number;
    notes?: string[];
  }): Promise<LessonProgress> {
    const response = await this.api.post(`/courses/${courseId}/lessons/${lessonId}/progress`, data);
    return response.data;
  }

  async markLessonCompleted(courseId: number, lessonId: number): Promise<LessonProgress> {
    const response = await this.api.post(`/courses/${courseId}/lessons/${lessonId}/complete`);
    return response.data;
  }

  async reorderLessons(courseId: number, lessonOrders: { lessonId: number; order: number }[]): Promise<Lesson[]> {
    const response = await this.api.post(`/courses/${courseId}/lessons/reorder`, { lessonOrders });
    return response.data;
  }

  async addLessonResource(courseId: number, lessonId: number, resource: {
    title: string;
    type: string;
    file: File;
  }): Promise<{
    title: string;
    type: string;
    url: string;
    size: number;
  }> {
    const formData = new FormData();
    formData.append('title', resource.title);
    formData.append('type', resource.type);
    formData.append('file', resource.file);

    const response = await this.api.post(
      `/courses/${courseId}/lessons/${lessonId}/resources`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  }

  async removeLessonResource(courseId: number, lessonId: number, resourceUrl: string): Promise<boolean> {
    const response = await this.api.delete(
      `/courses/${courseId}/lessons/${lessonId}/resources`,
      { data: { url: resourceUrl } }
    );
    return response.data.success;
  }

  async addLessonNote(courseId: number, lessonId: number, note: string): Promise<string[]> {
    const response = await this.api.post(`/courses/${courseId}/lessons/${lessonId}/notes`, { note });
    return response.data.notes;
  }

  async getLessonNotes(courseId: number, lessonId: number): Promise<string[]> {
    const response = await this.api.get(`/courses/${courseId}/lessons/${lessonId}/notes`);
    return response.data.notes;
  }

  async searchLessons(courseId: number, query: string, page: number = 1, limit: number = 10): Promise<{
    lessons: Lesson[];
    total: number;
  }> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString()
    });
    const response = await this.api.get(`/courses/${courseId}/lessons/search?${params.toString()}`);
    return response.data;
  }

  async exportLesson(courseId: number, lessonId: number, format: 'pdf' | 'markdown'): Promise<string> {
    const response = await this.api.get(
      `/courses/${courseId}/lessons/${lessonId}/export?format=${format}`
    );
    return response.data.exportUrl;
  }

  async duplicateLesson(courseId: number, lessonId: number, newTitle?: string): Promise<Lesson> {
    const response = await this.api.post(
      `/courses/${courseId}/lessons/${lessonId}/duplicate`,
      { newTitle }
    );
    return response.data;
  }
}
