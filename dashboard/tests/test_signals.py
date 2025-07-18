from django.test import TestCase
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from dashboard.models import UserActivity, DashboardPreference
from dashboard.signals import log_model_changes, create_user_dashboard_preferences

User = get_user_model()

class UserActivitySignalsTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_user_creation_activity(self):
        """Test qu'une activité est créée lors de la création d'un utilisateur"""
        new_user = User.objects.create_user(
            username='newuser',
            email='new@example.com',
            password='newpass123'
        )
        
        # Vérifier qu'une activité a été créée
        activity = UserActivity.objects.filter(
            target_object_type='user',
            target_object_id=new_user.id
        ).first()
        
        self.assertIsNotNone(activity)
        self.assertEqual(activity.action, 'created')

    def test_dashboard_preference_creation(self):
        """Test que les préférences de tableau de bord sont créées pour un nouvel utilisateur"""
        # Les préférences devraient déjà être créées par le signal dans setUp
        preference = DashboardPreference.objects.filter(user=self.user).first()
        self.assertIsNotNone(preference)

    def test_user_update_activity(self):
        """Test qu'une activité est créée lors de la mise à jour d'un utilisateur"""
        self.user.email = 'updated@example.com'
        self.user.save()
        
        # Vérifier qu'une activité de mise à jour a été créée
        activity = UserActivity.objects.filter(
            target_object_type='user',
            target_object_id=self.user.id,
            action='updated'
        ).first()
        
        self.assertIsNotNone(activity)

    def test_no_recursive_activity_creation(self):
        """Test qu'il n'y a pas de récursion infinie lors de la création d'activités"""
        initial_count = UserActivity.objects.count()
        
        # Créer une activité
        UserActivity.objects.create(
            user=self.user,
            activity_type='test',
            action='test',
            description='Test activity'
        )
        
        # Vérifier qu'une seule activité a été créée
        final_count = UserActivity.objects.count()
        self.assertEqual(final_count, initial_count + 1)

    def test_activity_metadata(self):
        """Test que les métadonnées sont correctement enregistrées dans l'activité"""
        new_user = User.objects.create_user(
            username='metadatauser',
            email='metadata@example.com',
            password='pass123'
        )
        
        activity = UserActivity.objects.filter(
            target_object_type='user',
            target_object_id=new_user.id
        ).first()
        
        self.assertIsNotNone(activity)
        self.assertIn('model', activity.metadata)
        self.assertIn('app_label', activity.metadata)
        self.assertEqual(activity.metadata['model'], 'user')
