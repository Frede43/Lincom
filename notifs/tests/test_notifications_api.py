from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from ..models import Notification, NotificationPreference
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

class NotificationsAPITests(TestCase):
    def setUp(self):
        # Configure logging
        logging.basicConfig(level=logging.DEBUG)
        
        # Create users
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpass123'
        )
        
        # Setup API client
        self.client = APIClient()
        
        # Create notification preferences
        self.preferences = NotificationPreference.objects.create(
            user=self.user,
            email_notifications=True,
            push_notifications=True
        )
        
        # Create test notification
        self.notification = Notification.objects.create(
            recipient=self.user,
            title='Test Notification',
            message='Test Message',
            notification_type='info'
        )

    def test_notification_crud(self):
        """Test notification CRUD operations"""
        self.client.force_authenticate(user=self.user)
        
        # Create notification
        response = self.client.post(reverse('notification-list'), {
            'recipient': self.other_user.id,
            'title': 'New Notification',
            'message': 'New Message',
            'notification_type': 'info'
        })
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create notification: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Read notification
        notification_id = response.data['id']
        response = self.client.get(reverse('notification-detail', args=[notification_id]))
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to read notification: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'New Notification')
        
        # Mark as read
        response = self.client.post(
            reverse('mark-notification-read', args=[notification_id])
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to mark notification as read: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['read'])
        
        # Delete notification
        response = self.client.delete(reverse('notification-detail', args=[notification_id]))
        if response.status_code != status.HTTP_204_NO_CONTENT:
            logger.error(f"Failed to delete notification: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_notification_preferences(self):
        """Test notification preferences management"""
        self.client.force_authenticate(user=self.user)
        
        # Update preferences
        response = self.client.patch(
            reverse('notification-preferences-detail', args=[self.preferences.id]),
            {'email_notifications': False}
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to update notification preferences: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['email_notifications'])
        
        # Get preferences
        response = self.client.get(reverse('my-notification-preferences'))
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to get notification preferences: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['email_notifications'])

    def test_notification_listing(self):
        """Test notification listing and filtering"""
        self.client.force_authenticate(user=self.user)
        
        # Get all notifications
        response = self.client.get(reverse('notification-list'))
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to list notifications: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)
        
        # Get unread notifications
        response = self.client.get(
            reverse('notification-list'),
            {'read': False}
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to list unread notifications: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Get notifications by type
        response = self.client.get(
            reverse('notification-list'),
            {'notification_type': 'info'}
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to list notifications by type: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

    def test_bulk_actions(self):
        """Test bulk notification actions"""
        self.client.force_authenticate(user=self.user)
        
        # Create multiple notifications
        notifications = []
        for i in range(3):
            notification = Notification.objects.create(
                recipient=self.user,
                title=f'Notification {i}',
                message=f'Message {i}',
                notification_type='info'
            )
            notifications.append(notification.id)
        
        # Mark all as read
        response = self.client.post(
            reverse('mark-all-read'),
            {'notification_ids': notifications}
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to mark all notifications as read: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Delete all read notifications
        response = self.client.post(reverse('delete-read-notifications'))
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to delete read notifications: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_permissions(self):
        """Test permission restrictions"""
        # Try to read someone else's notification
        self.client.force_authenticate(user=self.other_user)
        response = self.client.get(
            reverse('notification-detail', args=[self.notification.id])
        )
        if response.status_code != status.HTTP_403_FORBIDDEN:
            logger.error(f"Expected 403 when reading other's notification, got: {response.status_code}")
            logger.error(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Try to update someone else's preferences
        response = self.client.patch(
            reverse('notification-preferences-detail', args=[self.preferences.id]),
            {'email_notifications': False}
        )
        if response.status_code != status.HTTP_403_FORBIDDEN:
            logger.error(f"Expected 403 when updating other's preferences, got: {response.status_code}")
            logger.error(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Try to delete someone else's notification
        response = self.client.delete(
            reverse('notification-detail', args=[self.notification.id])
        )
        if response.status_code != status.HTTP_403_FORBIDDEN:
            logger.error(f"Expected 403 when deleting other's notification, got: {response.status_code}")
            logger.error(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
