import { CourseService } from '../services/course.service';
import { CreateCourseDTO, UpdateCourseDTO } from '../types/course';

describe('CourseService', () => {
  let courseService: CourseService;

  beforeEach(() => {
    courseService = new CourseService();
  });

  describe('getCourses', () => {
    it('should return an array of courses', async () => {
      const courses = await courseService.getCourses();
      expect(Array.isArray(courses)).toBe(true);
    });
  });

  describe('createCourse', () => {
    it('should create a new course', async () => {
      const courseData: CreateCourseDTO = {
        title: 'Test Course',
        description: 'Test Description',
        duration: 60
      };

      const course = await courseService.createCourse(courseData);
      expect(course).toBeTruthy();
      expect(course?.title).toBe(courseData.title);
    });
  });

  describe('updateCourse', () => {
    it('should update an existing course', async () => {
      // First create a course
      const createData: CreateCourseDTO = {
        title: 'Original Title',
        description: 'Original Description',
        duration: 60
      };
      const created = await courseService.createCourse(createData);
      expect(created).toBeTruthy();

      if (created) {
        // Then update it
        const updateData: UpdateCourseDTO = {
          title: 'Updated Title'
        };
        const updated = await courseService.updateCourse(created.id, updateData);
        expect(updated).toBeTruthy();
        expect(updated?.title).toBe(updateData.title);
      }
    });
  });

  describe('deleteCourse', () => {
    it('should delete an existing course', async () => {
      // First create a course
      const courseData: CreateCourseDTO = {
        title: 'Course to Delete',
        description: 'Will be deleted',
        duration: 30
      };
      const created = await courseService.createCourse(courseData);
      expect(created).toBeTruthy();

      if (created) {
        // Then delete it
        const deleted = await courseService.deleteCourse(created.id);
        expect(deleted).toBe(true);

        // Verify it's deleted
        const course = await courseService.getCourseById(created.id);
        expect(course).toBeNull();
      }
    });
  });

  describe('enrollInCourse', () => {
    it('should enroll current user in a course', async () => {
      // First create a course
      const courseData: CreateCourseDTO = {
        title: 'Enrollment Test Course',
        description: 'Test enrollment',
        duration: 45
      };
      const created = await courseService.createCourse(courseData);
      expect(created).toBeTruthy();

      if (created) {
        // Try to enroll
        const enrolled = await courseService.enrollInCourse(created.id);
        expect(enrolled).toBe(true);

        // Verify enrollment
        const students = await courseService.getEnrolledStudents(created.id);
        expect(Array.isArray(students)).toBe(true);
        expect(students.length).toBeGreaterThan(0);
      }
    });
  });
});
