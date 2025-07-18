export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  content: string;
  duration: number;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateLessonDTO {
  courseId: number;
  title: string;
  content: string;
  duration: number;
  order: number;
}

export interface UpdateLessonDTO {
  title?: string;
  content?: string;
  duration?: number;
  order?: number;
}

export interface LessonProgress {
  lessonId: number;
  userId: number;
  completed: boolean;
  completedAt?: string;
  timeSpent: number;
}
