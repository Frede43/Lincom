from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from ..models import ProjectCall, ProjectSubmission, Competition, CompetitionRegistration
from startups.models import Startup, Project

User = get_user_model()

class OrganizationsAPITestCase(APITestCase):
    def setUp(self):
        # Créer des utilisateurs de test
        self.org_user = User.objects.create_user(
            username='organization',
            email='org@example.com',
            password='pass123'
        )
        self.startup_user = User.objects.create_user(
            username='startup',
            email='startup@example.com',
            password='pass123'
        )
        
        # Créer une startup
        self.startup = Startup.objects.create(
            name='Test Startup',
            description='Startup Description',
            founder=self.startup_user
        )
        
        # Créer un projet
        self.project = Project.objects.create(
            title='Test Project',
            description='Project Description',
            startup=self.startup,
            project_lead=self.startup_user
        )
        
        # Créer un appel à projets
        self.project_call = ProjectCall.objects.create(
            title='Innovation Call',
            description='Call for innovative projects',
            organization=self.org_user,
            start_date=timezone.now(),
            end_date=timezone.now() + timedelta(days=30),
            budget=50000
        )
        
        # Créer une compétition
        self.competition = Competition.objects.create(
            title='Startup Challenge',
            description='Annual startup competition',
            organization=self.org_user,
            start_date=timezone.now(),
            end_date=timezone.now() + timedelta(days=60),
            prize='$10,000',
            max_participants=50
        )
        
        # Configurer le client API
        self.client = APIClient()

    def test_project_call_list_and_detail(self):
        """Tester la liste et le détail des appels à projets"""
        self.client.force_authenticate(user=self.startup_user)
        
        # Test liste des appels à projets
        url = reverse('organizations:project-call-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Test détail d'un appel à projets
        url = reverse('organizations:project-call-detail', args=[self.project_call.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Innovation Call')

    def test_project_call_creation(self):
        """Tester la création d'un appel à projets"""
        self.client.force_authenticate(user=self.org_user)
        url = reverse('organizations:project-call-list')
        
        data = {
            'title': 'New Call',
            'description': 'New project call',
            'start_date': timezone.now(),
            'end_date': timezone.now() + timedelta(days=30),
            'budget': 75000
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Vérifier que seule une organisation peut créer un appel
        self.client.force_authenticate(user=self.startup_user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_project_submission(self):
        """Tester la soumission d'un projet"""
        self.client.force_authenticate(user=self.startup_user)
        url = reverse('organizations:project-call-submit-project', args=[self.project_call.id])
        
        data = {
            'startup_id': self.startup.id,
            'project_id': self.project.id,
            'proposal': 'Project proposal details',
            'budget_proposal': 45000
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Vérifier qu'on ne peut pas soumettre deux fois
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_competition_list_and_detail(self):
        """Tester la liste et le détail des compétitions"""
        self.client.force_authenticate(user=self.startup_user)
        
        # Test liste des compétitions
        url = reverse('organizations:competition-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Test détail d'une compétition
        url = reverse('organizations:competition-detail', args=[self.competition.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Startup Challenge')

    def test_competition_registration(self):
        """Tester l'inscription à une compétition"""
        self.client.force_authenticate(user=self.startup_user)
        url = reverse('organizations:competition-register-startup', args=[self.competition.id])
        
        data = {'startup_id': self.startup.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Vérifier la limite de participants
        self.competition.max_participants = 1
        self.competition.save()
        
        # Créer une autre startup
        other_startup = Startup.objects.create(
            name='Other Startup',
            description='Other Description',
            founder=User.objects.create_user('other', 'other@example.com', 'pass123')
        )
        
        data = {'startup_id': other_startup.id}
        self.client.force_authenticate(user=other_startup.founder)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_competition_status_update(self):
        """Tester la mise à jour du statut d'une inscription"""
        self.client.force_authenticate(user=self.startup_user)
        
        # D'abord s'inscrire
        url = reverse('organizations:competition-register-startup', args=[self.competition.id])
        data = {'startup_id': self.startup.id}
        response = self.client.post(url, data)
        registration_id = response.data['id']
        
        # Mettre à jour le statut
        self.client.force_authenticate(user=self.org_user)
        url = reverse('organizations:competition-update-registration-status', args=[self.competition.id])
        data = {
            'registration_id': registration_id,
            'status': 'ACCEPTED'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Vérifier que seul l'organisateur peut mettre à jour le statut
        self.client.force_authenticate(user=self.startup_user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_date_validations(self):
        """Tester les validations de dates"""
        self.client.force_authenticate(user=self.org_user)
        
        # Test pour ProjectCall
        url = reverse('organizations:project-call-list')
        data = {
            'title': 'Invalid Call',
            'description': 'Invalid dates',
            'start_date': timezone.now(),
            'end_date': timezone.now() - timedelta(days=1),
            'budget': 50000
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Test pour Competition
        url = reverse('organizations:competition-list')
        data = {
            'title': 'Invalid Competition',
            'description': 'Invalid dates',
            'start_date': timezone.now(),
            'end_date': timezone.now() - timedelta(days=1),
            'prize': '$5,000',
            'max_participants': 30
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthorized_access(self):
        """Tester l'accès non autorisé"""
        urls = [
            reverse('organizations:project-call-list'),
            reverse('organizations:competition-list')
        ]
        
        for url in urls:
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
