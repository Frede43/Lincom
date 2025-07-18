from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from ..models import Project, Milestone, Resource, Team, TeamMember
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

class EntrepreneurshipAPITests(TestCase):
    def setUp(self):
        # Configure logging
        logging.basicConfig(level=logging.DEBUG)
        
        # Create users
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.mentor = User.objects.create_user(
            username='mentor',
            email='mentor@example.com',
            password='mentorpass123',
            is_staff=True
        )
        
        # Setup API client
        self.client = APIClient()
        
        # Create test project
        self.project = Project.objects.create(
            title='Test Project',
            description='Test Project Description',
            owner=self.user
        )
        
        # Create test team
        self.team = Team.objects.create(
            name='Test Team',
            project=self.project
        )
        
        # Add team member
        self.team_member = TeamMember.objects.create(
            team=self.team,
            user=self.user,
            role='leader'
        )
        
        # Create test milestone
        self.milestone = Milestone.objects.create(
            title='Test Milestone',
            description='Test Description',
            project=self.project,
            due_date='2025-12-31'
        )
        
        # Create test resource
        self.resource = Resource.objects.create(
            title='Test Resource',
            description='Test Resource Description',
            project=self.project,
            type='document'
        )

    def test_project_crud(self):
        """Test project CRUD operations"""
        self.client.force_authenticate(user=self.user)
        
        # Create project
        response = self.client.post(reverse('project-list'), {
            'title': 'New Project',
            'description': 'New Project Description'
        })
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create project: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Read project
        project_id = response.data['id']
        response = self.client.get(reverse('project-detail', args=[project_id]))
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to read project: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'New Project')
        
        # Update project
        response = self.client.patch(reverse('project-detail', args=[project_id]), {
            'title': 'Updated Project'
        })
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to update project: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Project')
        
        # Delete project
        response = self.client.delete(reverse('project-detail', args=[project_id]))
        if response.status_code != status.HTTP_204_NO_CONTENT:
            logger.error(f"Failed to delete project: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_team_management(self):
        """Test team management"""
        self.client.force_authenticate(user=self.user)
        
        # Create team
        response = self.client.post(reverse('team-list'), {
            'name': 'New Team',
            'project': self.project.id
        })
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create team: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        team_id = response.data['id']
        
        # Add team member
        new_member = User.objects.create_user(
            username='newmember',
            email='newmember@example.com',
            password='memberpass123'
        )
        
        response = self.client.post(
            reverse('add-team-member', args=[team_id]),
            {'user': new_member.id, 'role': 'member'}
        )
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to add team member: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Remove team member
        response = self.client.delete(
            reverse('remove-team-member', args=[team_id, new_member.id])
        )
        if response.status_code != status.HTTP_204_NO_CONTENT:
            logger.error(f"Failed to remove team member: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_milestone_management(self):
        """Test milestone management"""
        self.client.force_authenticate(user=self.user)
        
        # Create milestone
        response = self.client.post(reverse('milestone-list'), {
            'title': 'New Milestone',
            'description': 'New Milestone Description',
            'project': self.project.id,
            'due_date': '2025-12-31'
        })
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create milestone: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        milestone_id = response.data['id']
        
        # Mark milestone as completed
        response = self.client.post(
            reverse('complete-milestone', args=[milestone_id])
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to complete milestone: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['completed'])
        
        # Get project milestones
        response = self.client.get(
            reverse('project-milestones', args=[self.project.id])
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to get project milestones: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Including the test milestone

    def test_resource_management(self):
        """Test resource management"""
        self.client.force_authenticate(user=self.user)
        
        # Create resource
        response = self.client.post(reverse('resource-list'), {
            'title': 'New Resource',
            'description': 'New Resource Description',
            'project': self.project.id,
            'type': 'link',
            'url': 'https://example.com'
        })
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create resource: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        resource_id = response.data['id']
        
        # Update resource
        response = self.client.patch(
            reverse('resource-detail', args=[resource_id]),
            {'description': 'Updated Description'}
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to update resource: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Get project resources
        response = self.client.get(
            reverse('project-resources', args=[self.project.id])
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to get project resources: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Including the test resource

    def test_permissions(self):
        """Test permission restrictions"""
        other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpass123'
        )
        
        # Try to update someone else's project
        self.client.force_authenticate(user=other_user)
        response = self.client.patch(
            reverse('project-detail', args=[self.project.id]),
            {'title': 'Hacked Project'}
        )
        if response.status_code != status.HTTP_403_FORBIDDEN:
            logger.error(f"Expected 403 when updating other's project, got: {response.status_code}")
            logger.error(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Try to delete someone else's project
        response = self.client.delete(
            reverse('project-detail', args=[self.project.id])
        )
        if response.status_code != status.HTTP_403_FORBIDDEN:
            logger.error(f"Expected 403 when deleting other's project, got: {response.status_code}")
            logger.error(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Try to add unauthorized member to team
        response = self.client.post(
            reverse('add-team-member', args=[self.team.id]),
            {'user': other_user.id, 'role': 'member'}
        )
        if response.status_code != status.HTTP_403_FORBIDDEN:
            logger.error(f"Expected 403 when adding unauthorized member, got: {response.status_code}")
            logger.error(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
