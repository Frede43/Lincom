export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export interface Question {
  id: number;
  quizId: number;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  points: number;
  order: number;
  explanation?: string;
}

export interface Quiz {
  id: number;
  lessonId: number;
  title: string;
  description: string;
  timeLimit?: number;
  passingScore: number;
  attempts: number;
  questions: Question[];
  created_at: string;
  updated_at: string;
}

export interface CreateQuizDTO {
  lessonId: number;
  title: string;
  description: string;
  timeLimit?: number;
  passingScore: number;
  attempts: number;
}

export interface UpdateQuizDTO {
  title?: string;
  description?: string;
  timeLimit?: number;
  passingScore?: number;
  attempts?: number;
}

export interface CreateQuestionDTO {
  quizId: number;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  points: number;
  order: number;
  explanation?: string;
}

export interface UpdateQuestionDTO {
  text?: string;
  type?: QuestionType;
  options?: string[];
  correctAnswer?: string;
  points?: number;
  order?: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: number;
  quizId: number;
  userId: number;
  startTime: string;
  endTime?: string;
  score: number;
  passed: boolean;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: number;
  answer: string;
  correct: boolean;
  points: number;
}

export interface SubmitQuizDTO {
  answers: {
    questionId: number;
    answer: string;
  }[];
}
