import { QuizService } from '../services/quiz.service';
import { LessonService } from '../services/lesson.service';
import { CourseService } from '../services/course.service';
import {
  CreateQuizDTO,
  UpdateQuizDTO,
  CreateQuestionDTO,
  UpdateQuestionDTO,
  SubmitQuizDTO
} from '../types/quiz';

describe('QuizService', () => {
  let quizService: QuizService;
  let lessonService: LessonService;
  let courseService: CourseService;
  let courseId: number;
  let lessonId: number;

  beforeAll(async () => {
    quizService = new QuizService();
    lessonService = new LessonService();
    courseService = new CourseService();

    // Create test course and lesson
    const course = await courseService.createCourse({
      title: 'Test Course for Quizzes',
      description: 'Course for testing quizzes',
      duration: 120
    });

    if (course) {
      courseId = course.id;
      const lesson = await lessonService.createLesson(courseId, {
        courseId,
        title: 'Test Lesson for Quizzes',
        content: 'Lesson content',
        duration: 30,
        order: 1
      });

      if (lesson) {
        lessonId = lesson.id;
      }
    }
  });

  describe('Quiz Management', () => {
    it('should create a new quiz', async () => {
      const quizData: CreateQuizDTO = {
        lessonId,
        title: 'Test Quiz',
        description: 'Test quiz description',
        passingScore: 70,
        attempts: 3
      };

      const quiz = await quizService.createQuiz(lessonId, quizData);
      expect(quiz).toBeTruthy();
      expect(quiz?.title).toBe(quizData.title);
      expect(quiz?.passingScore).toBe(quizData.passingScore);
    });

    it('should update an existing quiz', async () => {
      const quiz = await quizService.createQuiz(lessonId, {
        lessonId,
        title: 'Quiz to Update',
        description: 'Will be updated',
        passingScore: 70,
        attempts: 3
      });

      expect(quiz).toBeTruthy();

      if (quiz) {
        const updateData: UpdateQuizDTO = {
          title: 'Updated Quiz Title',
          passingScore: 80
        };

        const updated = await quizService.updateQuiz(lessonId, quiz.id, updateData);
        expect(updated).toBeTruthy();
        expect(updated?.title).toBe(updateData.title);
        expect(updated?.passingScore).toBe(updateData.passingScore);
      }
    });
  });

  describe('Question Management', () => {
    let quizId: number;

    beforeAll(async () => {
      const quiz = await quizService.createQuiz(lessonId, {
        lessonId,
        title: 'Quiz for Questions',
        description: 'Testing questions',
        passingScore: 70,
        attempts: 3
      });

      if (quiz) {
        quizId = quiz.id;
      }
    });

    it('should create a new question', async () => {
      const questionData: CreateQuestionDTO = {
        quizId,
        text: 'What is TypeScript?',
        type: 'multiple_choice',
        options: ['A programming language', 'A database', 'A framework', 'An IDE'],
        correctAnswer: 'A programming language',
        points: 10,
        order: 1
      };

      const question = await quizService.createQuestion(quizId, questionData);
      expect(question).toBeTruthy();
      expect(question?.text).toBe(questionData.text);
      expect(question?.type).toBe(questionData.type);
    });

    it('should update a question', async () => {
      const question = await quizService.createQuestion(quizId, {
        quizId,
        text: 'Original question',
        type: 'multiple_choice',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 'A',
        points: 10,
        order: 2
      });

      expect(question).toBeTruthy();

      if (question) {
        const updateData: UpdateQuestionDTO = {
          text: 'Updated question text',
          points: 15
        };

        const updated = await quizService.updateQuestion(quizId, question.id, updateData);
        expect(updated).toBeTruthy();
        expect(updated?.text).toBe(updateData.text);
        expect(updated?.points).toBe(updateData.points);
      }
    });

    it('should reorder questions', async () => {
      const question1 = await quizService.createQuestion(quizId, {
        quizId,
        text: 'Question 1',
        type: 'multiple_choice',
        options: ['A', 'B', 'C'],
        correctAnswer: 'A',
        points: 10,
        order: 1
      });

      const question2 = await quizService.createQuestion(quizId, {
        quizId,
        text: 'Question 2',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        points: 10,
        order: 2
      });

      if (question1 && question2) {
        const newOrder = [
          { id: question1.id, order: 2 },
          { id: question2.id, order: 1 }
        ];

        const reordered = await quizService.reorderQuestions(quizId, newOrder);
        expect(reordered).toBe(true);

        const questions = await quizService.getQuestions(quizId);
        const reorderedQ1 = questions.find(q => q.id === question1.id);
        const reorderedQ2 = questions.find(q => q.id === question2.id);

        expect(reorderedQ1?.order).toBe(2);
        expect(reorderedQ2?.order).toBe(1);
      }
    });
  });

  describe('Quiz Attempts', () => {
    let quizId: number;
    let questionId: number;

    beforeAll(async () => {
      // Create quiz with question
      const quiz = await quizService.createQuiz(lessonId, {
        lessonId,
        title: 'Quiz for Attempts',
        description: 'Testing attempts',
        passingScore: 70,
        attempts: 3
      });

      if (quiz) {
        quizId = quiz.id;
        const question = await quizService.createQuestion(quizId, {
          quizId,
          text: 'Test question',
          type: 'multiple_choice',
          options: ['A', 'B', 'C', 'D'],
          correctAnswer: 'A',
          points: 10,
          order: 1
        });

        if (question) {
          questionId = question.id;
        }
      }
    });

    it('should start and submit a quiz attempt', async () => {
      const attempt = await quizService.startQuiz(quizId);
      expect(attempt).toBeTruthy();

      if (attempt) {
        const submitData: SubmitQuizDTO = {
          answers: [{
            questionId,
            answer: 'A'
          }]
        };

        const submitted = await quizService.submitQuiz(quizId, attempt.id, submitData);
        expect(submitted).toBeTruthy();
        expect(submitted?.endTime).toBeTruthy();
        expect(submitted?.score).toBe(10); // Correct answer
        expect(submitted?.passed).toBe(true);
      }
    });

    it('should get quiz attempts', async () => {
      const attempts = await quizService.getQuizAttempts(quizId);
      expect(Array.isArray(attempts)).toBe(true);
      expect(attempts.length).toBeGreaterThan(0);
    });
  });

  afterAll(async () => {
    // Clean up
    if (courseId) {
      await courseService.deleteCourse(courseId);
    }
  });
});
