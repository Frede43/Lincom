from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Mentor, Entrepreneur, Stakeholder

User = get_user_model()

class UserModelTest(TestCase):
    """Tests pour le modèle User"""

    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'role': 'student'
        }

    def test_create_user(self):
        """Test de création d'un utilisateur"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.role, 'student')
        self.assertTrue(user.check_password('testpass123'))

    def test_create_superuser(self):
        """Test de création d'un superutilisateur"""
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123',
            role='admin'
        )
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.is_staff)
        self.assertEqual(admin.role, 'admin')

class MentorModelTest(TestCase):
    """Tests pour le modèle Mentor"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='mentor1',
            email='mentor@example.com',
            password='mentorpass123',
            role='mentor'
        )

    def test_create_mentor_profile(self):
        """Test de création d'un profil mentor"""
        mentor = Mentor.objects.create(
            user=self.user,
            expertise='technology',
            experience_years=5,
            linkedin_profile='https://linkedin.com/in/mentor1'
        )
        self.assertEqual(mentor.user, self.user)
        self.assertEqual(mentor.expertise, 'technology')
        self.assertEqual(mentor.experience_years, 5)

class UserAPITest(APITestCase):
    """Tests pour l'API Users"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            role='student'
        )
        self.admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123',
            role='admin'
        )

    def get_jwt_token(self, user):
        """Obtenir un token JWT pour un utilisateur"""
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def test_user_registration(self):
        """Test d'inscription d'un utilisateur"""
        url = reverse('register')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpass123',
            'role': 'student'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_user_profile_access(self):
        """Test d'accès au profil utilisateur"""
        token = self.get_jwt_token(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        url = reverse('user-profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_user_list_requires_authentication(self):
        """Test que la liste des utilisateurs nécessite une authentification"""
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
