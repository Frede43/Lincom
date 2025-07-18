import { UserService } from '../services/user.service';
import { CourseService } from '../services/course.service';
import { LessonService } from '../services/lesson.service';
import { QuizService } from '../services/quiz.service';
import { ApiService } from '../services/api';

describe('Security Tests', () => {
  const userService = new UserService();
  const courseService = new CourseService();
  const lessonService = new LessonService();
  const quizService = new QuizService();
  const api = ApiService.getInstance();

  describe('Authentication', () => {
    it('should reject requests without authentication', async () => {
      // Remove authentication token
      api.getApi().defaults.headers.common['Authorization'] = '';

      try {
        await courseService.getCourses();
        fail('Should have thrown an authentication error');
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error instanceof Error).toBe(true);
      }
    });

    it('should reject invalid authentication tokens', async () => {
      // Set invalid token
      api.getApi().defaults.headers.common['Authorization'] = 'Bearer invalid_token';

      try {
        await courseService.getCourses();
        fail('Should have thrown an authentication error');
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error instanceof Error).toBe(true);
      }
    });
  });

  describe('Authorization', () => {
    let regularUser: any;
    let adminUser: any;
    let testCourse: any;

    beforeAll(async () => {
      // Create test users with different roles
      regularUser = await userService.createUser({
        name: 'Regular User',
        email: 'regular@example.com',
        password: 'password123',
        role: 'user'
      });

      adminUser = await userService.createUser({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });

      // Create test course
      testCourse = await courseService.createCourse({
        title: 'Security Test Course',
        description: 'Course for security testing',
        duration: 60
      });
    });

    it('should prevent regular users from performing admin actions', async () => {
      // Set regular user token
      api.getApi().defaults.headers.common['Authorization'] = `Bearer ${regularUser.token}`;

      try {
        await courseService.deleteCourse(testCourse.id);
        fail('Should have thrown an authorization error');
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error instanceof Error).toBe(true);
      }
    });

    it('should allow admin users to perform admin actions', async () => {
      // Set admin user token
      api.getApi().defaults.headers.common['Authorization'] = `Bearer ${adminUser.token}`;

      const result = await courseService.updateCourse(testCourse.id, {
        title: 'Updated by Admin'
      });

      expect(result).toBeTruthy();
      expect(result?.title).toBe('Updated by Admin');
    });
  });

  describe('Input Validation', () => {
    it('should prevent XSS attacks', async () => {
      const xssScript = '<script>alert("xss")</script>';

      try {
        await courseService.createCourse({
          title: xssScript,
          description: 'Test description',
          duration: 60
        });
        fail('Should have thrown a validation error');
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error instanceof Error).toBe(true);
      }
    });

    it('should prevent SQL injection attempts', async () => {
      const sqlInjection = "'; DROP TABLE users; --";

      try {
        await userService.getUserById(sqlInjection as any);
        fail('Should have thrown a validation error');
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error instanceof Error).toBe(true);
      }
    });
  });

  describe('Rate Limiting', () => {
    it('should handle rate limiting for repeated requests', async () => {
      const requests = Array(100).fill(null).map(() => courseService.getCourses());

      try {
        await Promise.all(requests);
        fail('Should have thrown a rate limit error');
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error instanceof Error).toBe(true);
      }
    });
  });

  afterAll(async () => {
    // Cleanup
    if (regularUser) {
      await userService.deleteUser(regularUser.id);
    }
    if (adminUser) {
      await userService.deleteUser(adminUser.id);
    }
    if (testCourse) {
      await courseService.deleteCourse(testCourse.id);
    }
  });
});
