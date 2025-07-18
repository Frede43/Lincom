from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from dashboard.models import UserActivity, DashboardPreference

User = get_user_model()

class UserActivityModelTests(TestCase):
    def setUp(self):
        # Créer un utilisateur pour les tests
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )

    def test_create_activity(self):
        """Test la création d'une activité utilisateur"""
        activity = UserActivity.objects.create(
            user=self.user,
            activity_type='other',
            action='created',
            description='Test activity',
            target_object_type='User',
            target_object_id=self.user.id,
            target_user=self.user
        )
        
        self.assertEqual(activity.user, self.user)
        self.assertEqual(activity.activity_type, 'other')
        self.assertEqual(activity.action, 'created')
        self.assertEqual(activity.description, 'Test activity')
        self.assertEqual(activity.target_object_type, 'User')
        self.assertEqual(activity.target_object_id, self.user.id)
        self.assertEqual(activity.target_user, self.user)

    def test_activity_str_representation(self):
        """Test la représentation string d'une activité"""
        activity = UserActivity.objects.create(
            user=self.user,
            activity_type='other',
            action='created',
            description='Test activity'
        )
        expected_str = f"{self.user.username} - other - created"
        self.assertEqual(str(activity), expected_str)

    def test_activity_ordering(self):
        """Test que les activités sont bien ordonnées par date de création (plus récent en premier)"""
        # Créer plusieurs activités
        activity1 = UserActivity.objects.create(
            user=self.user,
            activity_type='other',
            action='action1',
            description='First activity'
        )
        activity2 = UserActivity.objects.create(
            user=self.user,
            activity_type='other',
            action='action2',
            description='Second activity'
        )
        
        activities = UserActivity.objects.all()
        self.assertEqual(activities[0], activity2)  # Le plus récent en premier
        self.assertEqual(activities[1], activity1)

    def test_activity_with_metadata(self):
        """Test la création d'une activité avec des métadonnées"""
        metadata = {'key': 'value', 'number': 42}
        activity = UserActivity.objects.create(
            user=self.user,
            activity_type='other',
            action='created',
            description='Test with metadata',
            metadata=metadata
        )
        
        self.assertEqual(activity.metadata, metadata)

    def test_activity_without_user(self):
        """Test la création d'une activité système (sans utilisateur)"""
        activity = UserActivity.objects.create(
            activity_type='other',
            action='system',
            description='System activity'
        )
        
        self.assertIsNone(activity.user)
        self.assertEqual(str(activity), "System - other - system")
