from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Course, Module, Lesson, Training, Enrollment

User = get_user_model()

class CourseModelTest(TestCase):
    """Tests pour le modèle Course"""

    def setUp(self):
        self.instructor = User.objects.create_user(
            username='instructor',
            email='instructor@example.com',
            password='instructorpass123',
            role='mentor'
        )

    def test_create_course(self):
        """Test de création d'un cours"""
        course = Course.objects.create(
            title='Python Basics',
            description='Learn Python programming',
            level='beginner',
            instructor=self.instructor,
            syllabus='Week 1: Variables, Week 2: Functions',
            objectives='Learn basic Python concepts',
            duration_weeks=4
        )
        self.assertEqual(course.title, 'Python Basics')
        self.assertEqual(course.level, 'beginner')
        self.assertEqual(course.instructor, self.instructor)
        self.assertEqual(course.duration_weeks, 4)

class ModuleModelTest(TestCase):
    """Tests pour le modèle Module"""

    def setUp(self):
        self.instructor = User.objects.create_user(
            username='instructor',
            email='instructor@example.com',
            password='instructorpass123',
            role='mentor'
        )
        self.course = Course.objects.create(
            title='Python Basics',
            description='Learn Python programming',
            level='beginner',
            instructor=self.instructor,
            syllabus='Week 1: Variables',
            objectives='Learn basic Python concepts',
            duration_weeks=4
        )

    def test_create_module(self):
        """Test de création d'un module"""
        module = Module.objects.create(
            course=self.course,
            title='Variables and Data Types',
            description='Learn about Python variables',
            content='Variables are containers for storing data values.',
            order=1,
            duration_hours=2.5
        )
        self.assertEqual(module.course, self.course)
        self.assertEqual(module.title, 'Variables and Data Types')
        self.assertEqual(module.order, 1)
        self.assertEqual(float(module.duration_hours), 2.5)

class CourseAPITest(APITestCase):
    """Tests pour l'API Courses"""

    def setUp(self):
        self.instructor = User.objects.create_user(
            username='instructor',
            email='instructor@example.com',
            password='instructorpass123',
            role='mentor'
        )
        self.student = User.objects.create_user(
            username='student',
            email='student@example.com',
            password='studentpass123',
            role='student'
        )
        self.course = Course.objects.create(
            title='Python Basics',
            description='Learn Python programming',
            level='beginner',
            instructor=self.instructor,
            syllabus='Week 1: Variables',
            objectives='Learn basic Python concepts',
            duration_weeks=4
        )

    def get_jwt_token(self, user):
        """Obtenir un token JWT pour un utilisateur"""
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def test_course_list_public_access(self):
        """Test que la liste des cours est accessible publiquement"""
        url = reverse('course-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_course_detail_access(self):
        """Test d'accès aux détails d'un cours"""
        token = self.get_jwt_token(self.student)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = reverse('course-detail', kwargs={'pk': self.course.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Python Basics')
