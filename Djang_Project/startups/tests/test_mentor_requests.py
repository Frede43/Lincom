from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from ..models import Startup, MentorRequest, StartupMentor
from ..serializers import MentorRequestDetailSerializer

User = get_user_model()

class MentorRequestTests(APITestCase):
    def setUp(self):
        # Créer un fondateur
        self.founder = User.objects.create_user(
            username='founder',
            email='founder@test.com',
            password='testpass123'
        )
        self.founder.profile.is_founder = True
        self.founder.profile.save()

        # Créer un mentor
        self.mentor = User.objects.create_user(
            username='mentor',
            email='mentor@test.com',
            password='testpass123'
        )
        self.mentor.profile.is_mentor = True
        self.mentor.profile.save()

        # Créer une startup
        self.startup = Startup.objects.create(
            name='Test Startup',
            founder=self.founder,
            description='Test Description',
            stage_id=1
        )

        # Créer une demande de mentorat
        self.mentor_request = MentorRequest.objects.create(
            startup=self.startup,
            mentor=self.mentor,
            message="Je souhaite devenir mentor",
            expertise_areas="Tech, Business",
            availability="2 heures par semaine"
        )

    def test_create_mentor_request(self):
        """Test la création d'une demande de mentorat"""
        self.client.force_authenticate(user=self.mentor)
        url = reverse('mentor-request-create', kwargs={'startup_pk': self.startup.pk})
        data = {
            'message': 'Je souhaite devenir mentor',
            'expertise_areas': 'Tech, Marketing',
            'availability': '3 heures par semaine'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(MentorRequest.objects.count(), 2)

    def test_list_mentor_requests(self):
        """Test la liste des demandes de mentorat"""
        # Test pour le fondateur
        self.client.force_authenticate(user=self.founder)
        url = reverse('mentor-request-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

        # Test pour le mentor
        self.client.force_authenticate(user=self.mentor)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_review_mentor_request(self):
        """Test la revue d'une demande de mentorat"""
        self.client.force_authenticate(user=self.founder)
        url = reverse('mentor-request-review', kwargs={'pk': self.mentor_request.pk})
        
        # Test acceptation
        data = {'status': 'accepted'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.mentor_request.refresh_from_db()
        self.assertEqual(self.mentor_request.status, 'accepted')
        self.assertTrue(StartupMentor.objects.filter(
            startup=self.startup,
            mentor=self.mentor
        ).exists())

        # Test rejet
        another_request = MentorRequest.objects.create(
            startup=self.startup,
            mentor=User.objects.create_user(
                username='another_mentor',
                email='another@test.com',
                password='testpass123'
            ),
            message="Autre demande",
            expertise_areas="Marketing",
            availability="1 heure par semaine"
        )
        data = {'status': 'rejected'}
        url = reverse('mentor-request-review', kwargs={'pk': another_request.pk})
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        another_request.refresh_from_db()
        self.assertEqual(another_request.status, 'rejected')

    def test_mentor_request_permissions(self):
        """Test les permissions des demandes de mentorat"""
        # Un utilisateur non mentor ne peut pas faire de demande
        regular_user = User.objects.create_user(
            username='regular',
            email='regular@test.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=regular_user)
        url = reverse('mentor-request-create', kwargs={'startup_pk': self.startup.pk})
        data = {
            'message': 'Test message',
            'expertise_areas': 'Test',
            'availability': 'Test'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Un utilisateur non fondateur ne peut pas revoir les demandes
        self.client.force_authenticate(user=self.mentor)
        url = reverse('mentor-request-review', kwargs={'pk': self.mentor_request.pk})
        data = {'status': 'accepted'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_duplicate_mentor_request(self):
        """Test la création de demandes en double"""
        self.client.force_authenticate(user=self.mentor)
        url = reverse('mentor-request-create', kwargs={'startup_pk': self.startup.pk})
        data = {
            'message': 'Demande en double',
            'expertise_areas': 'Test',
            'availability': 'Test'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('already exists', str(response.data['detail']))

    def test_mentor_request_notification(self):
        """Test les notifications des demandes de mentorat"""
        self.client.force_authenticate(user=self.mentor)
        url = reverse('mentor-request-create', kwargs={'startup_pk': self.startup.pk})
        data = {
            'message': 'Test notification',
            'expertise_areas': 'Test',
            'availability': 'Test'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Vérifier que le fondateur a reçu une notification
        self.assertTrue(self.founder.notifications.filter(
            title="Nouvelle demande de mentorat"
        ).exists())

        # Test notification d'acceptation
        self.client.force_authenticate(user=self.founder)
        url = reverse('mentor-request-review', kwargs={'pk': self.mentor_request.pk})
        data = {'status': 'accepted'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Vérifier que le mentor a reçu une notification d'acceptation
        self.assertTrue(self.mentor.notifications.filter(
            title="Demande de mentorat acceptée"
        ).exists())
