from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from ..models import Course, CourseEnrollment, Training, TrainingRegistration

User = get_user_model()

class LearningAPITestCase(APITestCase):
    def setUp(self):
        # Créer des utilisateurs de test
        self.mentor = User.objects.create_user(
            username='mentor',
            email='mentor@example.com',
            password='pass123'
        )
        self.student1 = User.objects.create_user(
            username='student1',
            email='student1@example.com',
            password='pass123'
        )
        self.student2 = User.objects.create_user(
            username='student2',
            email='student2@example.com',
            password='pass123'
        )
        
        # Créer un cours
        self.course = Course.objects.create(
            title='Python Programming',
            description='Learn Python from scratch',
            mentor=self.mentor
        )
        
        # Créer une formation
        self.training = Training.objects.create(
            title='Web Development Workshop',
            description='Hands-on web development training',
            mentor=self.mentor,
            start_date=timezone.now() + timedelta(days=7),
            end_date=timezone.now() + timedelta(days=14),
            max_participants=20
        )
        
        # Créer une inscription au cours
        self.course_enrollment = CourseEnrollment.objects.create(
            course=self.course,
            student=self.student1,
            progress=50
        )
        
        # Créer une inscription à la formation
        self.training_registration = TrainingRegistration.objects.create(
            training=self.training,
            participant=self.student1,
            status='REGISTERED'
        )
        
        # Configurer le client API
        self.client = APIClient()

    def test_course_list_and_detail(self):
        """Tester la liste et le détail des cours"""
        self.client.force_authenticate(user=self.student1)
        
        # Test liste des cours
        url = reverse('learning:course-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Test détail d'un cours
        url = reverse('learning:course-detail', args=[self.course.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Python Programming')

    def test_course_creation(self):
        """Tester la création d'un cours"""
        self.client.force_authenticate(user=self.mentor)
        url = reverse('learning:course-list')
        
        data = {
            'title': 'New Course',
            'description': 'Course Description'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Vérifier que seul un mentor peut créer un cours
        self.client.force_authenticate(user=self.student1)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_course_enrollment(self):
        """Tester l'inscription à un cours"""
        self.client.force_authenticate(user=self.student2)
        url = reverse('learning:course-enroll', args=[self.course.id])
        
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Vérifier que l'étudiant ne peut pas s'inscrire deux fois
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_course_progress(self):
        """Tester la mise à jour du progrès d'un cours"""
        self.client.force_authenticate(user=self.student1)
        url = reverse('learning:course-update-progress', args=[self.course.id])
        
        data = {'progress': 75}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Vérifier que le progrès a été mis à jour
        enrollment = CourseEnrollment.objects.get(
            student=self.student1,
            course=self.course
        )
        self.assertEqual(enrollment.progress, 75)

    def test_training_list_and_detail(self):
        """Tester la liste et le détail des formations"""
        self.client.force_authenticate(user=self.student1)
        
        # Test liste des formations
        url = reverse('learning:training-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Test détail d'une formation
        url = reverse('learning:training-detail', args=[self.training.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Web Development Workshop')

    def test_training_creation(self):
        """Tester la création d'une formation"""
        self.client.force_authenticate(user=self.mentor)
        url = reverse('learning:training-list')
        
        data = {
            'title': 'New Training',
            'description': 'Training Description',
            'start_date': timezone.now() + timedelta(days=1),
            'end_date': timezone.now() + timedelta(days=2),
            'max_participants': 15
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Vérifier la validation des dates
        data['end_date'] = timezone.now()
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_training_registration(self):
        """Tester l'inscription à une formation"""
        self.client.force_authenticate(user=self.student2)
        url = reverse('learning:training-register', args=[self.training.id])
        
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Vérifier la limite de participants
        self.training.max_participants = 1
        self.training.save()
        
        self.client.force_authenticate(user=self.student1)
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthorized_access(self):
        """Tester l'accès non autorisé"""
        urls = [
            reverse('learning:course-list'),
            reverse('learning:training-list')
        ]
        
        for url in urls:
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_course_search_and_filter(self):
        """Tester la recherche et le filtrage des cours"""
        self.client.force_authenticate(user=self.student1)
        url = reverse('learning:course-list')
        
        # Test recherche par titre
        response = self.client.get(f"{url}?search=Python")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Test filtre par mentor
        response = self.client.get(f"{url}?mentor={self.mentor.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Test recherche sans résultat
        response = self.client.get(f"{url}?search=Java")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_training_date_validation(self):
        """Tester la validation des dates de formation"""
        self.client.force_authenticate(user=self.mentor)
        url = reverse('learning:training-list')
        
        # Test avec date de fin antérieure à la date de début
        data = {
            'title': 'Invalid Training',
            'description': 'Training Description',
            'start_date': timezone.now() + timedelta(days=2),
            'end_date': timezone.now() + timedelta(days=1),
            'max_participants': 15
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Test avec date de début dans le passé
        data['start_date'] = timezone.now() - timedelta(days=1)
        data['end_date'] = timezone.now() + timedelta(days=1)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
