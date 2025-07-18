import { ApiService } from './api';

export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  tags: string[];
  category: string;
  instructor: number;
  price?: number;
  rating?: number;
  enrollmentCount: number;
  isPublished: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseDTO {
  title: string;
  description: string;
  thumbnail?: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  tags: string[];
  category: string;
  price?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateCourseDTO {
  title?: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  tags?: string[];
  category?: string;
  price?: number;
  isPublished?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface CourseProgress {
  userId: number;
  courseId: number;
  completedLessons: number[];
  completedQuizzes: number[];
  totalProgress: number;
  lastAccessedAt: Date;
  certificateEarned: boolean;
}

export class CourseService {
  private api = ApiService.getInstance().getApi();

  async getCourses(page: number = 1, limit: number = 10, filters?: {
    category?: string;
    level?: string;
    price?: 'free' | 'paid';
    tag?: string;
  }): Promise<{ courses: Course[]; total: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    const response = await this.api.get(`/courses?${params.toString()}`);
    return response.data;
  }

  async getCourseById(id: number): Promise<Course | null> {
    const response = await this.api.get(`/courses/${id}`);
    return response.data;
  }

  async createCourse(data: CreateCourseDTO): Promise<Course> {
    const response = await this.api.post('/courses', data);
    return response.data;
  }

  async updateCourse(id: number, data: UpdateCourseDTO): Promise<Course | null> {
    const response = await this.api.put(`/courses/${id}`, data);
    return response.data;
  }

  async deleteCourse(id: number): Promise<boolean> {
    await this.api.delete(`/courses/${id}`);
    return true;
  }

  async publishCourse(id: number): Promise<Course> {
    const response = await this.api.post(`/courses/${id}/publish`);
    return response.data;
  }

  async unpublishCourse(id: number): Promise<Course> {
    const response = await this.api.post(`/courses/${id}/unpublish`);
    return response.data;
  }

  async enrollInCourse(courseId: number): Promise<boolean> {
    const response = await this.api.post(`/courses/${courseId}/enroll`);
    return response.data.success;
  }

  async unenrollFromCourse(courseId: number): Promise<boolean> {
    const response = await this.api.post(`/courses/${courseId}/unenroll`);
    return response.data.success;
  }

  async getEnrolledStudents(courseId: number, page: number = 1, limit: number = 10): Promise<{ 
    students: number[]; 
    total: number 
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    const response = await this.api.get(`/courses/${courseId}/students?${params.toString()}`);
    return response.data;
  }

  async getCourseProgress(courseId: number, userId: number): Promise<CourseProgress> {
    const response = await this.api.get(`/courses/${courseId}/progress/${userId}`);
    return response.data;
  }

  async updateCourseProgress(courseId: number, data: {
    completedLessons?: number[];
    completedQuizzes?: number[];
  }): Promise<CourseProgress> {
    const response = await this.api.post(`/courses/${courseId}/progress`, data);
    return response.data;
  }

  async generateCertificate(courseId: number, userId: number): Promise<string> {
    const response = await this.api.post(`/courses/${courseId}/certificate/${userId}`);
    return response.data.certificateUrl;
  }

  async rateCourse(courseId: number, rating: number, review?: string): Promise<{
    rating: number;
    review?: string;
  }> {
    const response = await this.api.post(`/courses/${courseId}/rate`, { rating, review });
    return response.data;
  }

  async getCourseRatings(courseId: number, page: number = 1, limit: number = 10): Promise<{
    ratings: Array<{
      userId: number;
      rating: number;
      review?: string;
      createdAt: Date;
    }>;
    total: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    const response = await this.api.get(`/courses/${courseId}/ratings?${params.toString()}`);
    return response.data;
  }

  async searchCourses(query: string, filters?: {
    category?: string;
    level?: string;
    price?: 'free' | 'paid';
    tag?: string;
  }, page: number = 1, limit: number = 10): Promise<{
    courses: Course[];
    total: number;
  }> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    const response = await this.api.get(`/courses/search?${params.toString()}`);
    return response.data;
  }

  async duplicateCourse(courseId: number, newTitle?: string): Promise<Course> {
    const response = await this.api.post(`/courses/${courseId}/duplicate`, { newTitle });
    return response.data;
  }

  async exportCourse(courseId: number, format: 'pdf' | 'json'): Promise<string> {
    const response = await this.api.get(`/courses/${courseId}/export?format=${format}`);
    return response.data.exportUrl;
  }
}
