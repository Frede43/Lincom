import { UserService } from '../services/user.service';
import { CourseService } from '../services/course.service';
import { LessonService } from '../services/lesson.service';
import { QuizService } from '../services/quiz.service';

describe('Performance Tests', () => {
  const userService = new UserService();
  const courseService = new CourseService();
  const lessonService = new LessonService();
  const quizService = new QuizService();

  // Test data
  let testCourse: any;
  let testLesson: any;
  let testQuiz: any;

  beforeAll(async () => {
    // Create test data
    testCourse = await courseService.createCourse({
      title: 'Performance Test Course',
      description: 'Course for performance testing',
      duration: 120
    });

    testLesson = await lessonService.createLesson(testCourse.id, {
      courseId: testCourse.id,
      title: 'Performance Test Lesson',
      content: 'Content for performance testing',
      duration: 30,
      order: 1
    });

    testQuiz = await quizService.createQuiz(testLesson.id, {
      lessonId: testLesson.id,
      title: 'Performance Test Quiz',
      description: 'Quiz for performance testing',
      passingScore: 70,
      attempts: 3
    });
  });

  describe('Batch Operations', () => {
    it('should handle multiple user creations efficiently', async () => {
      const startTime = Date.now();
      const userPromises = Array(10).fill(null).map((_, index) => {
        return userService.createUser({
          name: `Test User ${index}`,
          email: `test${index}@example.com`,
          password: 'password123',
          role: 'user'
        });
      });

      const users = await Promise.all(userPromises);
      const endTime = Date.now();

      expect(users.length).toBe(10);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should handle multiple course enrollments efficiently', async () => {
      const startTime = Date.now();
      const enrollmentPromises = Array(10).fill(null).map(() => {
        return courseService.enrollInCourse(testCourse.id);
      });

      await Promise.all(enrollmentPromises);
      const endTime = Date.now();

      const students = await courseService.getEnrolledStudents(testCourse.id);
      expect(students.length).toBeGreaterThanOrEqual(10);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent quiz attempts', async () => {
      const startTime = Date.now();
      const attemptPromises = Array(5).fill(null).map(async () => {
        const attempt = await quizService.startQuiz(testQuiz.id);
        if (attempt) {
          return quizService.submitQuiz(testQuiz.id, attempt.id, {
            answers: []
          });
        }
      });

      const results = await Promise.all(attemptPromises);
      const endTime = Date.now();

      expect(results.filter(Boolean).length).toBe(5);
      expect(endTime - startTime).toBeLessThan(10000); // Should complete within 10 seconds
    });

    it('should handle concurrent lesson completions', async () => {
      const startTime = Date.now();
      const completionPromises = Array(5).fill(null).map(() => {
        return lessonService.markLessonCompleted(testCourse.id, testLesson.id);
      });

      const results = await Promise.all(completionPromises);
      const endTime = Date.now();

      expect(results.filter(Boolean).length).toBe(5);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });

  describe('Response Time Tests', () => {
    it('should retrieve course list quickly', async () => {
      const startTime = Date.now();
      const courses = await courseService.getCourses();
      const endTime = Date.now();

      expect(courses).toBeTruthy();
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should retrieve quiz attempts quickly', async () => {
      const startTime = Date.now();
      const attempts = await quizService.getQuizAttempts(testQuiz.id);
      const endTime = Date.now();

      expect(attempts).toBeTruthy();
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });

  afterAll(async () => {
    // Cleanup test data
    if (testQuiz) {
      await quizService.deleteQuiz(testLesson.id, testQuiz.id);
    }
    if (testLesson) {
      await lessonService.deleteLesson(testCourse.id, testLesson.id);
    }
    if (testCourse) {
      await courseService.deleteCourse(testCourse.id);
    }
  });
});
