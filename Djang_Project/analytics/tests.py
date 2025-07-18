from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from .models import (
    UserActivity, CourseAnalytics, TrainingMetrics,
    StartupPerformance, PlatformStatistics
)
from learning.models import Course, Training
from startups.models import Startup

User = get_user_model()

class AnalyticsAPITestCase(APITestCase):
    def setUp(self):
        # Créer un utilisateur admin et un utilisateur normal
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123'
        )
        self.normal_user = User.objects.create_user(
            username='user',
            email='user@example.com',
            password='userpass123'
        )
        
        # Créer des données de test
        self.course = Course.objects.create(
            title='Test Course',
            description='Test Description',
            mentor=self.admin_user
        )
        
        self.training = Training.objects.create(
            title='Test Training',
            description='Test Description',
            mentor=self.admin_user,
            start_date=timezone.now(),
            end_date=timezone.now() + timedelta(days=7)
        )
        
        self.startup = Startup.objects.create(
            name='Test Startup',
            description='Test Description',
            founder=self.normal_user
        )
        
        # Créer des données analytics
        self.user_activity = UserActivity.objects.create(
            user=self.normal_user,
            activity_type='LOGIN',
            description='User logged in'
        )
        
        self.course_analytics = CourseAnalytics.objects.create(
            course=self.course,
            total_enrollments=10,
            active_students=8,
            completion_rate=75.0,
            average_progress=60.0
        )
        
        self.training_metrics = TrainingMetrics.objects.create(
            training=self.training,
            total_registrations=15,
            attendance_rate=80.0,
            satisfaction_score=4.5,
            completion_rate=85.0
        )
        
        self.startup_performance = StartupPerformance.objects.create(
            startup=self.startup,
            project_count=3,
            team_size=5,
            success_rate=70.0,
            activity_score=8.5
        )
        
        self.platform_stats = PlatformStatistics.objects.create(
            total_users=100,
            active_users=80,
            total_courses=10,
            total_trainings=5,
            total_startups=8,
            total_projects=15,
            user_growth_rate=5.0,
            platform_engagement_rate=75.0
        )
        
        # Configurer le client API
        self.client = APIClient()

    def test_unauthorized_access(self):
        """Tester l'accès non autorisé aux endpoints analytics"""
        urls = [
            reverse('analytics:user-activity-list'),
            reverse('analytics:course-analytics-list'),
            reverse('analytics:training-metrics-list'),
            reverse('analytics:startup-performance-list'),
            reverse('analytics:platform-statistics-list')
        ]
        
        for url in urls:
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
            
            self.client.force_authenticate(user=self.normal_user)
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_access(self):
        """Tester l'accès administrateur aux endpoints analytics"""
        self.client.force_authenticate(user=self.admin_user)
        
        urls = [
            reverse('analytics:user-activity-list'),
            reverse('analytics:course-analytics-list'),
            reverse('analytics:training-metrics-list'),
            reverse('analytics:startup-performance-list'),
            reverse('analytics:platform-statistics-list')
        ]
        
        for url in urls:
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_activity_filters(self):
        """Tester les filtres de l'endpoint user-activity"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('analytics:user-activity-list')
        
        # Test filtre par utilisateur
        response = self.client.get(f"{url}?user_id={self.normal_user.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Test filtre par type d'activité
        response = self.client.get(f"{url}?activity_type=LOGIN")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Test filtre par date
        response = self.client.get(f"{url}?days=1")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_course_analytics_top_courses(self):
        """Tester l'endpoint top-courses des analytics de cours"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('analytics:course-analytics-top-courses')
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)
        
        # Test avec différentes métriques
        metrics = ['completion_rate', 'total_enrollments', 'average_progress']
        for metric in metrics:
            response = self.client.get(f"{url}?metric={metric}")
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_platform_statistics_latest(self):
        """Tester l'endpoint latest-stats des statistiques de la plateforme"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('analytics:platform-statistics-latest-stats')
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_users'], 100)
        self.assertEqual(response.data['total_courses'], 10)
        
    def test_startup_performance_top_performers(self):
        """Tester l'endpoint top-performers des performances de startups"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('analytics:startup-performance-top-performers')
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)
        
        # Test avec différentes métriques
        metrics = ['activity_score', 'success_rate', 'project_count']
        for metric in metrics:
            response = self.client.get(f"{url}?metric={metric}")
            self.assertEqual(response.status_code, status.HTTP_200_OK)
