from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from ..models import Organization, Department, Role, Member, Event
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

class OrganizationsAPITests(TestCase):
    def setUp(self):
        # Configure logging
        logging.basicConfig(level=logging.DEBUG)
        
        # Create users
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.admin = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpass123',
            is_staff=True
        )
        
        # Setup API client
        self.client = APIClient()
        
        # Create test organization
        self.organization = Organization.objects.create(
            name='Test Organization',
            description='Test Description',
            owner=self.admin
        )
        
        # Create test department
        self.department = Department.objects.create(
            name='Test Department',
            organization=self.organization
        )
        
        # Create test role
        self.role = Role.objects.create(
            name='Test Role',
            organization=self.organization,
            permissions=['view_members', 'add_members']
        )
        
        # Create test member
        self.member = Member.objects.create(
            user=self.user,
            organization=self.organization,
            role=self.role,
            department=self.department
        )
        
        # Create test event
        self.event = Event.objects.create(
            title='Test Event',
            description='Test Event Description',
            organization=self.organization,
            organizer=self.admin,
            start_date='2025-12-31T10:00:00Z',
            end_date='2025-12-31T12:00:00Z'
        )

    def test_organization_crud(self):
        """Test organization CRUD operations"""
        self.client.force_authenticate(user=self.admin)
        
        # Create organization
        response = self.client.post(reverse('organization-list'), {
            'name': 'New Organization',
            'description': 'New Description'
        })
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create organization: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Read organization
        org_id = response.data['id']
        response = self.client.get(reverse('organization-detail', args=[org_id]))
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to read organization: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'New Organization')
        
        # Update organization
        response = self.client.patch(
            reverse('organization-detail', args=[org_id]),
            {'description': 'Updated Description'}
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to update organization: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Delete organization
        response = self.client.delete(reverse('organization-detail', args=[org_id]))
        if response.status_code != status.HTTP_204_NO_CONTENT:
            logger.error(f"Failed to delete organization: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_department_management(self):
        """Test department management"""
        self.client.force_authenticate(user=self.admin)
        
        # Create department
        response = self.client.post(reverse('department-list'), {
            'name': 'New Department',
            'organization': self.organization.id
        })
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create department: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        department_id = response.data['id']
        
        # Update department
        response = self.client.patch(
            reverse('department-detail', args=[department_id]),
            {'name': 'Updated Department'}
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to update department: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Get organization departments
        response = self.client.get(
            reverse('organization-departments', args=[self.organization.id])
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to get organization departments: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

    def test_role_management(self):
        """Test role management"""
        self.client.force_authenticate(user=self.admin)
        
        # Create role
        response = self.client.post(reverse('role-list'), {
            'name': 'New Role',
            'organization': self.organization.id,
            'permissions': ['view_members']
        })
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create role: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        role_id = response.data['id']
        
        # Update role permissions
        response = self.client.patch(
            reverse('role-detail', args=[role_id]),
            {'permissions': ['view_members', 'edit_members']}
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to update role: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Get organization roles
        response = self.client.get(
            reverse('organization-roles', args=[self.organization.id])
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to get organization roles: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

    def test_member_management(self):
        """Test member management"""
        self.client.force_authenticate(user=self.admin)
        
        new_user = User.objects.create_user(
            username='newuser',
            email='new@example.com',
            password='newpass123'
        )
        
        # Add member
        response = self.client.post(reverse('member-list'), {
            'user': new_user.id,
            'organization': self.organization.id,
            'role': self.role.id,
            'department': self.department.id
        })
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to add member: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        member_id = response.data['id']
        
        # Update member role
        response = self.client.patch(
            reverse('member-detail', args=[member_id]),
            {'role': self.role.id}
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to update member: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Remove member
        response = self.client.delete(reverse('member-detail', args=[member_id]))
        if response.status_code != status.HTTP_204_NO_CONTENT:
            logger.error(f"Failed to remove member: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_event_management(self):
        """Test event management"""
        self.client.force_authenticate(user=self.admin)
        
        # Create event
        response = self.client.post(reverse('event-list'), {
            'title': 'New Event',
            'description': 'New Event Description',
            'organization': self.organization.id,
            'start_date': '2025-12-31T14:00:00Z',
            'end_date': '2025-12-31T16:00:00Z'
        })
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create event: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        event_id = response.data['id']
        
        # Update event
        response = self.client.patch(
            reverse('event-detail', args=[event_id]),
            {'description': 'Updated Description'}
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to update event: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Get organization events
        response = self.client.get(
            reverse('organization-events', args=[self.organization.id])
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to get organization events: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

    def test_permissions(self):
        """Test permission restrictions"""
        regular_user = User.objects.create_user(
            username='regular',
            email='regular@example.com',
            password='regularpass123'
        )
        
        # Try to create organization as regular user
        self.client.force_authenticate(user=regular_user)
        response = self.client.post(reverse('organization-list'), {
            'name': 'Unauthorized Org',
            'description': 'This should fail'
        })
        if response.status_code != status.HTTP_403_FORBIDDEN:
            logger.error(f"Expected 403 when creating org as regular user, got: {response.status_code}")
            logger.error(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Try to modify organization as non-owner
        response = self.client.patch(
            reverse('organization-detail', args=[self.organization.id]),
            {'name': 'Hacked Org'}
        )
        if response.status_code != status.HTTP_403_FORBIDDEN:
            logger.error(f"Expected 403 when modifying org as non-owner, got: {response.status_code}")
            logger.error(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Try to add member without permission
        response = self.client.post(reverse('member-list'), {
            'user': regular_user.id,
            'organization': self.organization.id,
            'role': self.role.id
        })
        if response.status_code != status.HTTP_403_FORBIDDEN:
            logger.error(f"Expected 403 when adding member without permission, got: {response.status_code}")
            logger.error(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
