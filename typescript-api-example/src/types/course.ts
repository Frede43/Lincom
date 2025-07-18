export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: number; // User ID
  duration: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCourseDTO {
  title: string;
  description: string;
  duration: number;
}

export interface UpdateCourseDTO {
  title?: string;
  description?: string;
  duration?: number;
}
