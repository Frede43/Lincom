import { UserService } from '../services/user.service';
import { CourseService } from '../services/course.service';
import { LessonService } from '../services/lesson.service';
import { QuizService } from '../services/quiz.service';
import { CreateUserDTO } from '../types/user';
import { CreateCourseDTO } from '../types/course';
import { CreateLessonDTO } from '../types/lesson';
import { CreateQuizDTO, CreateQuestionDTO, SubmitQuizDTO } from '../types/quiz';

describe('API Integration Tests', () => {
  // Services
  const userService = new UserService();
  const courseService = new CourseService();
  const lessonService = new LessonService();
  const quizService = new QuizService();

  // Test Data Storage
  let testUser: any;
  let testCourse: any;
  let testLesson: any;
  let testQuiz: any;
  let testQuestion: any;

  describe('1. User Management', () => {
    it('should create a new user', async () => {
      const userData: CreateUserDTO = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      };

      testUser = await userService.createUser(userData);
      expect(testUser).toBeTruthy();
      expect(testUser.name).toBe(userData.name);
      expect(testUser.email).toBe(userData.email);
    });

    it('should update user information', async () => {
      const updatedName = 'Updated Test User';
      const updated = await userService.updateUser(testUser.id, { name: updatedName });
      expect(updated).toBeTruthy();
      expect(updated?.name).toBe(updatedName);
    });

    it('should get user by ID', async () => {
      const user = await userService.getUserById(testUser.id);
      expect(user).toBeTruthy();
      expect(user?.id).toBe(testUser.id);
    });
  });

  describe('2. Course Management', () => {
    it('should create a new course', async () => {
      const courseData: CreateCourseDTO = {
        title: 'Integration Test Course',
        description: 'Course for integration testing',
        duration: 120
      };

      testCourse = await courseService.createCourse(courseData);
      expect(testCourse).toBeTruthy();
      expect(testCourse.title).toBe(courseData.title);
    });

    it('should enroll user in course', async () => {
      const enrolled = await courseService.enrollInCourse(testCourse.id);
      expect(enrolled).toBe(true);

      const students = await courseService.getEnrolledStudents(testCourse.id);
      expect(students).toContain(testUser.id);
    });
  });

  describe('3. Lesson Management', () => {
    it('should create a new lesson', async () => {
      const lessonData: CreateLessonDTO = {
        courseId: testCourse.id,
        title: 'Integration Test Lesson',
        content: 'Lesson content for integration testing',
        duration: 30,
        order: 1
      };

      testLesson = await lessonService.createLesson(testCourse.id, lessonData);
      expect(testLesson).toBeTruthy();
      expect(testLesson.title).toBe(lessonData.title);
    });

    it('should mark lesson as completed', async () => {
      const progress = await lessonService.markLessonCompleted(testCourse.id, testLesson.id);
      expect(progress).toBeTruthy();
      expect(progress?.completed).toBe(true);
    });
  });

  describe('4. Quiz Management', () => {
    it('should create a new quiz', async () => {
      const quizData: CreateQuizDTO = {
        lessonId: testLesson.id,
        title: 'Integration Test Quiz',
        description: 'Quiz for integration testing',
        passingScore: 70,
        attempts: 3
      };

      testQuiz = await quizService.createQuiz(testLesson.id, quizData);
      expect(testQuiz).toBeTruthy();
      expect(testQuiz.title).toBe(quizData.title);
    });

    it('should create a question', async () => {
      const questionData: CreateQuestionDTO = {
        quizId: testQuiz.id,
        text: 'Integration test question?',
        type: 'multiple_choice',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 'A',
        points: 10,
        order: 1
      };

      testQuestion = await quizService.createQuestion(testQuiz.id, questionData);
      expect(testQuestion).toBeTruthy();
      expect(testQuestion.text).toBe(questionData.text);
    });

    it('should complete a quiz attempt', async () => {
      const attempt = await quizService.startQuiz(testQuiz.id);
      expect(attempt).toBeTruthy();

      if (attempt) {
        const submitData: SubmitQuizDTO = {
          answers: [{
            questionId: testQuestion.id,
            answer: 'A'
          }]
        };

        const result = await quizService.submitQuiz(testQuiz.id, attempt.id, submitData);
        expect(result).toBeTruthy();
        expect(result?.passed).toBe(true);
        expect(result?.score).toBe(10);
      }
    });
  });

  describe('5. Cleanup', () => {
    it('should delete test data', async () => {
      // Delete in reverse order of creation to maintain referential integrity
      if (testQuiz) {
        const quizDeleted = await quizService.deleteQuiz(testLesson.id, testQuiz.id);
        expect(quizDeleted).toBe(true);
      }

      if (testLesson) {
        const lessonDeleted = await lessonService.deleteLesson(testCourse.id, testLesson.id);
        expect(lessonDeleted).toBe(true);
      }

      if (testCourse) {
        const courseDeleted = await courseService.deleteCourse(testCourse.id);
        expect(courseDeleted).toBe(true);
      }

      if (testUser) {
        const userDeleted = await userService.deleteUser(testUser.id);
        expect(userDeleted).toBe(true);
      }
    });
  });
});
