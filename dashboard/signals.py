from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.apps import apps
from .models import DashboardPreference, UserActivity

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_dashboard_preferences(sender, instance, created, **kwargs):
    """Crée les préférences de tableau de bord par défaut pour un nouvel utilisateur"""
    if created:
        DashboardPreference.objects.create(user=instance)

@receiver(post_save)
def log_model_changes(sender, instance, created, **kwargs):
    """Enregistre les modifications de modèle dans l'activité utilisateur"""
    # Ignorer les modèles UserActivity pour éviter la récursion
    if sender == UserActivity:
        return

    # Gérer différemment les modèles User
    if isinstance(instance, User):
        action = 'created' if created else 'updated'
        UserActivity.objects.create(
            user=instance,  # L'utilisateur lui-même est l'acteur
            activity_type='user',
            action=action,
            description=f'User account {action}',
            target_object_type='user',
            target_object_id=instance.pk,
            target_user=instance,  # L'utilisateur est aussi la cible
            metadata={
                'model': 'user',
                'app_label': 'users',
                'username': instance.username,
                'email': instance.email
            }
        )
        return

    # Pour les autres modèles
    if hasattr(instance, 'user'):
        action = 'created' if created else 'updated'
        model_name = instance._meta.model_name.capitalize()
        
        UserActivity.objects.create(
            user=instance.user,
            activity_type='other',
            action=action,
            description=f'{model_name} {action}',
            target_object_type=instance._meta.model_name,
            target_object_id=instance.pk,
            metadata={
                'model': instance._meta.model_name,
                'app_label': instance._meta.app_label
            }
        )
