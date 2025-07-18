import { ApiService } from './api';

export interface Quiz {
  id: number;
  lessonId: number;
  title: string;
  description: string;
  timeLimit?: number;
  passingScore: number;
  attempts: number;
  shuffleQuestions: boolean;
  showAnswers: boolean;
  questions: Question[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: number;
  quizId: number;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'matching';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  order: number;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
  };
}

export interface CreateQuizDTO {
  lessonId: number;
  title: string;
  description: string;
  timeLimit?: number;
  passingScore: number;
  attempts: number;
  shuffleQuestions?: boolean;
  showAnswers?: boolean;
}

export interface UpdateQuizDTO {
  title?: string;
  description?: string;
  timeLimit?: number;
  passingScore?: number;
  attempts?: number;
  shuffleQuestions?: boolean;
  showAnswers?: boolean;
  isPublished?: boolean;
}

export interface CreateQuestionDTO {
  quizId: number;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'matching';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  order: number;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
  };
}

export interface UpdateQuestionDTO {
  text?: string;
  type?: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'matching';
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  points?: number;
  order?: number;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
  };
}

export interface QuizAttempt {
  id: number;
  quizId: number;
  userId: number;
  startTime: Date;
  endTime?: Date;
  timeSpent?: number;
  score?: number;
  passed?: boolean;
  answers: QuizAnswer[];
  status: 'in_progress' | 'completed' | 'timed_out';
}

export interface QuizAnswer {
  questionId: number;
  answer: string | string[];
  isCorrect?: boolean;
  points?: number;
  feedback?: string;
}

export interface SubmitQuizDTO {
  answers: {
    questionId: number;
    answer: string | string[];
  }[];
}

export class QuizService {
  private api = ApiService.getInstance().getApi();

  async getQuizzes(lessonId: number, page: number = 1, limit: number = 10): Promise<{
    quizzes: Quiz[];
    total: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    const response = await this.api.get(`/lessons/${lessonId}/quizzes?${params.toString()}`);
    return response.data;
  }

  async getQuizById(lessonId: number, quizId: number): Promise<Quiz | null> {
    const response = await this.api.get(`/lessons/${lessonId}/quizzes/${quizId}`);
    return response.data;
  }

  async createQuiz(lessonId: number, data: CreateQuizDTO): Promise<Quiz> {
    const response = await this.api.post(`/lessons/${lessonId}/quizzes`, data);
    return response.data;
  }

  async updateQuiz(lessonId: number, quizId: number, data: UpdateQuizDTO): Promise<Quiz | null> {
    const response = await this.api.put(`/lessons/${lessonId}/quizzes/${quizId}`, data);
    return response.data;
  }

  async deleteQuiz(lessonId: number, quizId: number): Promise<boolean> {
    await this.api.delete(`/lessons/${lessonId}/quizzes/${quizId}`);
    return true;
  }

  async createQuestion(quizId: number, data: CreateQuestionDTO): Promise<Question> {
    const response = await this.api.post(`/quizzes/${quizId}/questions`, data);
    return response.data;
  }

  async updateQuestion(quizId: number, questionId: number, data: UpdateQuestionDTO): Promise<Question | null> {
    const response = await this.api.put(`/quizzes/${quizId}/questions/${questionId}`, data);
    return response.data;
  }

  async deleteQuestion(quizId: number, questionId: number): Promise<boolean> {
    await this.api.delete(`/quizzes/${quizId}/questions/${questionId}`);
    return true;
  }

  async publishQuiz(lessonId: number, quizId: number): Promise<Quiz> {
    const response = await this.api.post(`/lessons/${lessonId}/quizzes/${quizId}/publish`);
    return response.data;
  }

  async unpublishQuiz(lessonId: number, quizId: number): Promise<Quiz> {
    const response = await this.api.post(`/lessons/${lessonId}/quizzes/${quizId}/unpublish`);
    return response.data;
  }

  async startQuiz(quizId: number): Promise<QuizAttempt> {
    const response = await this.api.post(`/quizzes/${quizId}/start`);
    return response.data;
  }

  async submitQuiz(quizId: number, attemptId: number, data: SubmitQuizDTO): Promise<QuizAttempt> {
    const response = await this.api.post(`/quizzes/${quizId}/attempts/${attemptId}/submit`, data);
    return response.data;
  }

  async getQuizAttempts(quizId: number, page: number = 1, limit: number = 10): Promise<{
    attempts: QuizAttempt[];
    total: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    const response = await this.api.get(`/quizzes/${quizId}/attempts?${params.toString()}`);
    return response.data;
  }

  async getQuizAttempt(quizId: number, attemptId: number): Promise<QuizAttempt> {
    const response = await this.api.get(`/quizzes/${quizId}/attempts/${attemptId}`);
    return response.data;
  }

  async reorderQuestions(quizId: number, questionOrders: { questionId: number; order: number }[]): Promise<Question[]> {
    const response = await this.api.post(`/quizzes/${quizId}/questions/reorder`, { questionOrders });
    return response.data;
  }

  async addQuestionMedia(quizId: number, questionId: number, media: {
    type: 'image' | 'video' | 'audio';
    file: File;
  }): Promise<{
    type: 'image' | 'video' | 'audio';
    url: string;
  }> {
    const formData = new FormData();
    formData.append('type', media.type);
    formData.append('file', media.file);

    const response = await this.api.post(
      `/quizzes/${quizId}/questions/${questionId}/media`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  }

  async removeQuestionMedia(quizId: number, questionId: number): Promise<boolean> {
    const response = await this.api.delete(`/quizzes/${quizId}/questions/${questionId}/media`);
    return response.data.success;
  }

  async exportQuizResults(quizId: number, format: 'csv' | 'pdf' | 'excel'): Promise<string> {
    const response = await this.api.get(`/quizzes/${quizId}/export?format=${format}`);
    return response.data.exportUrl;
  }

  async duplicateQuiz(lessonId: number, quizId: number, newTitle?: string): Promise<Quiz> {
    const response = await this.api.post(
      `/lessons/${lessonId}/quizzes/${quizId}/duplicate`,
      { newTitle }
    );
    return response.data;
  }

  async getQuizStatistics(quizId: number): Promise<{
    totalAttempts: number;
    averageScore: number;
    passRate: number;
    averageTimeSpent: number;
    questionStats: Array<{
      questionId: number;
      correctRate: number;
      averagePoints: number;
    }>;
  }> {
    const response = await this.api.get(`/quizzes/${quizId}/statistics`);
    return response.data;
  }

  async gradeEssayQuestion(quizId: number, attemptId: number, questionId: number, data: {
    points: number;
    feedback: string;
  }): Promise<QuizAnswer> {
    const response = await this.api.post(
      `/quizzes/${quizId}/attempts/${attemptId}/questions/${questionId}/grade`,
      data
    );
    return response.data;
  }
}
