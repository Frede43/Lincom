from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from ..models import Category, Topic, Post, Comment, Attachment
from django.core.files.uploadedfile import SimpleUploadedFile
import os
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

class ForumAPITests(TestCase):
    def setUp(self):
        # Configure logging
        logging.basicConfig(level=logging.DEBUG)
        
        # Create users
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.staff_user = User.objects.create_user(
            username='staffuser',
            email='staff@example.com',
            password='staffpass123',
            is_staff=True
        )
        
        # Setup API client
        self.client = APIClient()
        
        # Create basic test data
        self.category = Category.objects.create(
            name='Test Category',
            description='Test Description'
        )
        
        self.topic = Topic.objects.create(
            title='Test Topic',
            content='Test Content',
            category=self.category,
            author=self.user
        )
        
        self.post = Post.objects.create(
            topic=self.topic,
            content='Test Post Content',
            author=self.user
        )

    def test_topic_crud(self):
        """Test topic CRUD operations"""
        self.client.force_authenticate(user=self.user)
        
        # Create topic
        response = self.client.post(reverse('topic-list'), {
            'title': 'New Topic',
            'content': 'New Content',
            'category': self.category.id
        })
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create topic: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Read topic
        topic_id = response.data['id']
        response = self.client.get(reverse('topic-detail', args=[topic_id]))
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to read topic: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'New Topic')
        
        # Update topic
        response = self.client.patch(reverse('topic-detail', args=[topic_id]), {
            'title': 'Updated Topic'
        })
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to update topic: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Topic')
        
        # Delete topic
        response = self.client.delete(reverse('topic-detail', args=[topic_id]))
        if response.status_code != status.HTTP_204_NO_CONTENT:
            logger.error(f"Failed to delete topic: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_post_replies(self):
        """Test post reply functionality"""
        self.client.force_authenticate(user=self.user)
        
        # Create a reply
        response = self.client.post(
            reverse('reply-to-post', args=[self.post.id]),
            {'content': 'Test Reply', 'topic': self.topic.id}
        )
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create reply: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['parent'], self.post.id)
        
        # Verify reply appears in parent post
        response = self.client.get(reverse('topic-post-detail', args=[self.topic.id, self.post.id]))
        if len(response.data['replies']) != 1:
            logger.error(f"Expected 1 reply, got: {len(response.data['replies'])}")
            logger.error(f"Replies data: {response.data['replies']}")
        self.assertEqual(len(response.data['replies']), 1)

    def test_post_likes(self):
        """Test post like functionality"""
        self.client.force_authenticate(user=self.user)
        
        # Toggle like on
        response = self.client.post(reverse('toggle-post-like', args=[self.post.id]))
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to toggle like on: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['likes_count'], 1)
        
        # Toggle like off
        response = self.client.post(reverse('toggle-post-like', args=[self.post.id]))
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to toggle like off: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['likes_count'], 0)

    def test_comments(self):
        """Test comment functionality"""
        self.client.force_authenticate(user=self.user)
        
        # Create comment
        response = self.client.post(
            reverse('post-comments', args=[self.post.id]),
            {'content': 'Test Comment', 'post': self.post.id}
        )
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to create comment: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        comment_id = response.data['id']
        
        # Get comments
        response = self.client.get(reverse('post-comments', args=[self.post.id]))
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to get comments: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)  # Using paginated results
        
        # Toggle comment like
        response = self.client.post(
            reverse('toggle-comment-like', args=[self.post.id, comment_id])
        )
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to toggle comment like: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['likes_count'], 1)

    def test_topic_management(self):
        """Test topic management features"""
        # Test pin topic (staff only)
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.post(reverse('toggle-topic-pin', args=[self.topic.id]))
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to pin topic: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_pinned'])
        
        # Test lock topic (author)
        self.client.force_authenticate(user=self.user)
        response = self.client.post(reverse('toggle-topic-lock', args=[self.topic.id]))
        if response.status_code != status.HTTP_200_OK:
            logger.error(f"Failed to lock topic: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_locked'])
        
        # Test posting in locked topic
        response = self.client.post(
            reverse('topic-posts', args=[self.topic.id]),
            {'content': 'New Post in Locked Topic', 'topic': self.topic.id}
        )
        if response.status_code != status.HTTP_403_FORBIDDEN:
            logger.error(f"Expected 403 when posting to locked topic, got: {response.status_code}")
            logger.error(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_attachments(self):
        """Test attachment functionality"""
        self.client.force_authenticate(user=self.user)
        
        # Create a test file
        file_content = b"Test file content"
        test_file = SimpleUploadedFile(
            name="test.txt",
            content=file_content,
            content_type="text/plain"
        )
        
        # Upload attachment
        data = {
            'post': self.post.id,
            'file': test_file,
            'filename': 'test.txt',
            'file_size': len(file_content),
            'content_type': 'text/plain'
        }
        response = self.client.post(
            reverse('attachment-list'),
            data,
            format='multipart'
        )
        
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Failed to upload attachment: {response.data}")
            logger.error(f"Request data: {data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        attachment_id = response.data['id']
        
        # Verify attachment in post
        response = self.client.get(reverse('topic-post-detail', args=[self.topic.id, self.post.id]))
        if len(response.data['attachments']) != 1:
            logger.error(f"Expected 1 attachment, got: {len(response.data['attachments'])}")
            logger.error(f"Attachments data: {response.data['attachments']}")
        self.assertEqual(len(response.data['attachments']), 1)
        
        # Delete attachment
        response = self.client.delete(reverse('attachment-detail', args=[attachment_id]))
        if response.status_code != status.HTTP_204_NO_CONTENT:
            logger.error(f"Failed to delete attachment: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_permissions(self):
        """Test various permission scenarios"""
        other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpass123'
        )
        self.client.force_authenticate(user=other_user)
        
        # Try to lock someone else's topic
        response = self.client.post(reverse('toggle-topic-lock', args=[self.topic.id]))
        if response.status_code != status.HTTP_403_FORBIDDEN:
            logger.error(f"Expected 403 when locking other's topic, got: {response.status_code}")
            logger.error(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Try to pin topic as non-staff
        response = self.client.post(reverse('toggle-topic-pin', args=[self.topic.id]))
        if response.status_code != status.HTTP_403_FORBIDDEN:
            logger.error(f"Expected 403 when pinning as non-staff, got: {response.status_code}")
            logger.error(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Try to mark post as solution (only topic author can do this)
        response = self.client.post(
            reverse('mark-post-as-solution', args=[self.topic.id, self.post.id])
        )
        if response.status_code != status.HTTP_403_FORBIDDEN:
            logger.error(f"Expected 403 when marking solution as non-author, got: {response.status_code}")
            logger.error(f"Response data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
