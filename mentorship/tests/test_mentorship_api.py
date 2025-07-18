from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from ..models import MentorProfile, MentorshipRequest, MentorshipSession
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

class MentorshipAPITests(TestCase):
    def setUp(self):
        # Configure logging
        logging.basicConfig(level=logging.DEBUG)
        
        # Create users
        self.mentee = User.objects.create_user(
            username='mentee',
            email='mentee@example.com',
            password='menteepass123'
        )
        self.mentor = User.objects.create_user(
            username='mentor',
            email='mentor@example.com',
            password='mentorpass123'
        )
        
        # Setup API client
        self.client = APIClient()
        
        # Create mentor profile
        self.mentor_profile = MentorProfile.objects.create(
            user=self.mentor,
            expertise='Python, Django',
            bio='Experienced developer',
            availability='Weekends'
        )
        
        # Create mentorship request
        self.request = MentorshipRequest.objects.create(
            mentee=self.mentee,
            mentor=self.mentor,
            message='Need help with Django',
            status='pending'
        )
        
        # Create mentorship session
        self.session = MentorshipSession.objects.create(
            mentee=self.mentee,
            mentor=self.mentor,
            topic='Django REST Framework',
            scheduled_at='2025-12-31T10:00:00Z',
            duration=60
        )

    def test_mentor_profile_crud(self):
        """Test mentor profile CRUD operations"""
        self.client.force_authenticate(user=self.mentor)
        
        # Create profile
        response = self.client.post(reverse('mentor-profile-list'), {
            'expertise': 'JavaScript, React',
            'bio': 'Frontend developer',
            'availability': 'Evenings'
        })
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create mentor profile: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Read profile
        profile_id = response.data['id']
        response = self.client.get(reverse('mentor-profile-detail', args=[profile_id]))
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to read mentor profile: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['expertise'], 'JavaScript, React')
        
        # Update profile
        response = self.client.patch(
            reverse('mentor-profile-detail', args=[profile_id]),
            {'availability': 'Weekends only'}
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to update mentor profile: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['availability'], 'Weekends only')

    def test_mentorship_request_flow(self):
        """Test mentorship request flow"""
        # Create request as mentee
        self.client.force_authenticate(user=self.mentee)
        response = self.client.post(reverse('mentorship-request-list'), {
            'mentor': self.mentor.id,
            'message': 'Need help with React'
        })
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create mentorship request: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        request_id = response.data['id']
        
        # Accept request as mentor
        self.client.force_authenticate(user=self.mentor)
        response = self.client.post(
            reverse('accept-mentorship-request', args=[request_id])
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to accept mentorship request: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'accepted')
        
        # Get mentee's requests
        self.client.force_authenticate(user=self.mentee)
        response = self.client.get(reverse('my-mentorship-requests'))
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to get mentee's requests: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

    def test_session_management(self):
        """Test mentorship session management"""
        self.client.force_authenticate(user=self.mentor)
        
        # Create session
        response = self.client.post(reverse('mentorship-session-list'), {
            'mentee': self.mentee.id,
            'topic': 'React Hooks',
            'scheduled_at': '2025-12-31T14:00:00Z',
            'duration': 45
        })
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create mentorship session: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        session_id = response.data['id']
        
        # Reschedule session
        response = self.client.patch(
            reverse('mentorship-session-detail', args=[session_id]),
            {'scheduled_at': '2025-12-31T15:00:00Z'}
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to reschedule session: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Complete session
        response = self.client.post(
            reverse('complete-session', args=[session_id]),
            {'notes': 'Great session!', 'rating': 5}
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to complete session: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['completed'])

    def test_mentor_search(self):
        """Test mentor search functionality"""
        self.client.force_authenticate(user=self.mentee)
        
        # Search by expertise
        response = self.client.get(
            reverse('search-mentors'),
            {'expertise': 'Python'}
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to search mentors: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)
        
        # Search by availability
        response = self.client.get(
            reverse('search-mentors'),
            {'availability': 'Weekends'}
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to search mentors by availability: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

    def test_permissions(self):
        """Test permission restrictions"""
        other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpass123'
        )
        
        # Try to update someone else's mentor profile
        self.client.force_authenticate(user=other_user)
        response = self.client.patch(
            reverse('mentor-profile-detail', args=[self.mentor_profile.id]),
            {'bio': 'Hacked bio'}
        )
        if response.status_code != status.HTTP_403_FORBIDDEN:
            logger.error(f"Expected 403 when updating other's profile, got: {response.status_code}")
            logger.error(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Try to accept someone else's mentorship request
        response = self.client.post(
            reverse('accept-mentorship-request', args=[self.request.id])
        )
        if response.status_code != status.HTTP_403_FORBIDDEN:
            logger.error(f"Expected 403 when accepting other's request, got: {response.status_code}")
            logger.error(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Try to modify someone else's session
        response = self.client.patch(
            reverse('mentorship-session-detail', args=[self.session.id]),
            {'duration': 30}
        )
        if response.status_code != status.HTTP_403_FORBIDDEN:
            logger.error(f"Expected 403 when modifying other's session, got: {response.status_code}")
            logger.error(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
