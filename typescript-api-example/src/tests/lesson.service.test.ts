import { LessonService } from '../services/lesson.service';
import { CourseService } from '../services/course.service';
import { CreateLessonDTO, UpdateLessonDTO } from '../types/lesson';
import { CreateCourseDTO } from '../types/course';

describe('LessonService', () => {
  let lessonService: LessonService;
  let courseService: CourseService;
  let courseId: number;

  beforeAll(async () => {
    lessonService = new LessonService();
    courseService = new CourseService();

    // Create a test course to use for lesson tests
    const courseData: CreateCourseDTO = {
      title: 'Test Course for Lessons',
      description: 'Course for testing lessons',
      duration: 120
    };
    const course = await courseService.createCourse(courseData);
    if (course) {
      courseId = course.id;
    }
  });

  describe('getLessons', () => {
    it('should return an array of lessons for a course', async () => {
      const lessons = await lessonService.getLessons(courseId);
      expect(Array.isArray(lessons)).toBe(true);
    });
  });

  describe('createLesson', () => {
    it('should create a new lesson', async () => {
      const lessonData: CreateLessonDTO = {
        courseId,
        title: 'Test Lesson',
        content: 'Test Content',
        duration: 30,
        order: 1
      };

      const lesson = await lessonService.createLesson(courseId, lessonData);
      expect(lesson).toBeTruthy();
      expect(lesson?.title).toBe(lessonData.title);
    });
  });

  describe('updateLesson', () => {
    it('should update an existing lesson', async () => {
      // First create a lesson
      const createData: CreateLessonDTO = {
        courseId,
        title: 'Original Lesson',
        content: 'Original Content',
        duration: 30,
        order: 1
      };
      const created = await lessonService.createLesson(courseId, createData);
      expect(created).toBeTruthy();

      if (created) {
        // Then update it
        const updateData: UpdateLessonDTO = {
          title: 'Updated Lesson Title'
        };
        const updated = await lessonService.updateLesson(courseId, created.id, updateData);
        expect(updated).toBeTruthy();
        expect(updated?.title).toBe(updateData.title);
      }
    });
  });

  describe('markLessonCompleted', () => {
    it('should mark a lesson as completed', async () => {
      // First create a lesson
      const lessonData: CreateLessonDTO = {
        courseId,
        title: 'Completion Test Lesson',
        content: 'Test completion',
        duration: 15,
        order: 1
      };
      const created = await lessonService.createLesson(courseId, lessonData);
      expect(created).toBeTruthy();

      if (created) {
        // Mark as completed
        const progress = await lessonService.markLessonCompleted(courseId, created.id);
        expect(progress).toBeTruthy();
        expect(progress?.completed).toBe(true);

        // Verify progress
        const currentProgress = await lessonService.getLessonProgress(courseId, created.id);
        expect(currentProgress?.completed).toBe(true);
      }
    });
  });

  describe('reorderLessons', () => {
    it('should reorder lessons in a course', async () => {
      // Create multiple lessons
      const lesson1 = await lessonService.createLesson(courseId, {
        courseId,
        title: 'Lesson 1',
        content: 'Content 1',
        duration: 15,
        order: 1
      });

      const lesson2 = await lessonService.createLesson(courseId, {
        courseId,
        title: 'Lesson 2',
        content: 'Content 2',
        duration: 15,
        order: 2
      });

      if (lesson1 && lesson2) {
        // Reorder lessons
        const newOrder = [
          { id: lesson1.id, order: 2 },
          { id: lesson2.id, order: 1 }
        ];

        const reordered = await lessonService.reorderLessons(courseId, newOrder);
        expect(reordered).toBe(true);

        // Verify new order
        const lessons = await lessonService.getLessons(courseId);
        const reorderedLesson1 = lessons.find(l => l.id === lesson1.id);
        const reorderedLesson2 = lessons.find(l => l.id === lesson2.id);

        expect(reorderedLesson1?.order).toBe(2);
        expect(reorderedLesson2?.order).toBe(1);
      }
    });
  });

  afterAll(async () => {
    // Clean up - delete the test course
    if (courseId) {
      await courseService.deleteCourse(courseId);
    }
  });
});
