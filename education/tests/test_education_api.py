from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from ..models import Course, Module, Lesson, Quiz, Question, UserProgress
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

class EducationAPITests(TestCase):
    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass'
        )
        self.regular_user = User.objects.create_user(
            username='user',
            email='user@example.com',
            password='userpass'
        )
        
        # Create course
        self.course = Course.objects.create(
            title='Test Course',
            description='Test Description',
            syllabus='Test Syllabus',
            objectives='Test Objectives',
            instructor=self.user
        )
        
        # Create module
        self.module = Module.objects.create(
            title='Test Module',
            course=self.course,
            content='Test Content',
            order=1
        )
        
        # Create quiz
        self.quiz = Quiz.objects.create(
            title='Test Quiz',
            module=self.module,
            order=1
        )
        
        # Create question
        self.question = Question.objects.create(
            quiz=self.quiz,
            text='Test Question',
            question_type='multiple_choice',
            correct_answer='Test Answer',
            points=5,
            order=1
        )

    def test_course_crud(self):
        """Test course CRUD operations"""
        self.client.force_authenticate(user=self.user)
        
        # Create course
        response = self.client.post(reverse('course-list'), {
            'title': 'New Course',
            'description': 'New Course Description',
            'level': 'beginner',
            'syllabus': 'Course syllabus content',
            'objectives': 'Course learning objectives',
            'duration_weeks': 4
        })
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create course: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Read course
        course_id = response.data['id']
        response = self.client.get(reverse('course-detail', args=[course_id]))
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to read course: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'New Course')
        
        # Update course
        response = self.client.patch(reverse('course-detail', args=[course_id]), {
            'title': 'Updated Course'
        })
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to update course: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Course')
        
        # Delete course
        response = self.client.delete(reverse('course-detail', args=[course_id]))
        if response.status_code != status.HTTP_204_NO_CONTENT:
            logger.error(f"Failed to delete course: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_module_management(self):
        """Test module management"""
        self.client.force_authenticate(user=self.user)
        
        # Create module
        response = self.client.post(reverse('module-list'), {
            'title': 'New Module',
            'description': 'New Module Description',
            'course': self.course.id,
            'order': 2,
            'duration_hours': 1.5,
            'content': 'Module content goes here'
        })
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create module: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Reorder module
        module_id = response.data['id']
        response = self.client.post(
            reverse('module-reorder', args=[module_id]),
            {'order': 3}
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to reorder module: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Get course modules
        response = self.client.get(
            reverse('course-modules', args=[self.course.id])
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to get course modules: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_lesson_management(self):
        """Test lesson management"""
        self.client.force_authenticate(user=self.user)
        
        # Create lesson
        response = self.client.post(reverse('lesson-list'), {
            'title': 'New Lesson',
            'content': 'New Lesson Content',
            'module': self.module.id,
            'order': 2,
            'duration_minutes': 45
        })
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create lesson: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Update lesson content
        lesson_id = response.data['id']
        response = self.client.patch(
            reverse('lesson-detail', args=[lesson_id]),
            {'content': 'Updated Content'}
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to update lesson: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Mark lesson as completed
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.post(
            reverse('lesson-mark-completed', args=[lesson_id])
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to mark lesson as completed: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check progress
        response = self.client.get(
            reverse('user-progress', args=[self.course.id])
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to get user progress: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['completed_lessons'])

    def test_quiz_management(self):
        """Test quiz management"""
        self.client.force_authenticate(user=self.user)
        
        # Create quiz
        response = self.client.post(reverse('quiz-list'), {
            'title': 'New Quiz',
            'module': self.module.id
        })
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create quiz: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        quiz_id = response.data['id']
        
        # Add question
        response = self.client.post(reverse('question-list'), {
            'quiz': quiz_id,
            'text': 'New Question',
            'question_type': 'multiple_choice',
            'correct_answer': 'New Answer',
            'points': 5,
            'order': 2
        })
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create question: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        question_id = response.data['id']
        
        # Submit quiz
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.post(
            reverse('quiz-submit', args=[quiz_id]),
            {'answers': [{'question': question_id, 'answer': 'New Answer'}]}
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to submit quiz: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['score'], 5)

    def test_permissions(self):
        """Test permission restrictions"""
        # Try to create course as regular user
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.post(reverse('course-list'), {
            'title': 'Unauthorized Course',
            'description': 'This should fail'
        })
        if response.status_code != status.HTTP_403_FORBIDDEN:
            logger.error(f"Expected 403 when creating course as regular user, got: {response.status_code}")
            logger.error(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Try to update someone else's course
        other_instructor = User.objects.create_user(
            username='other_instructor',
            email='other@example.com',
            password='otherpass123',
            is_staff=True
        )
        other_course = Course.objects.create(
            title='Other Course',
            description='Other Course Description',
            instructor=other_instructor
        )
        
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            reverse('course-detail', args=[other_course.id]),
            {'title': 'Hacked Course'}
        )
        if response.status_code != status.HTTP_403_FORBIDDEN:
            logger.error(f"Expected 403 when updating other's course, got: {response.status_code}")
            logger.error(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Try to delete someone else's course
        response = self.client.delete(
            reverse('course-detail', args=[other_course.id])
        )
        if response.status_code != status.HTTP_403_FORBIDDEN:
            logger.error(f"Expected 403 when deleting other's course, got: {response.status_code}")
            logger.error(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
