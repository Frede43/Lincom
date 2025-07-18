from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.db import transaction
from .models import Mentor, Entrepreneur, Stakeholder
from dashboard.models import UserActivity

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal pour créer automatiquement le profil approprié lors de la création d'un utilisateur
    en fonction de son rôle.
    """
    if created:
        if instance.role == 'mentor':
            Mentor.objects.create(user=instance)
            UserActivity.objects.create(
                user=instance,
                activity_type='other',
                action='created',
                description='Profil mentor créé',
                target_object_type='User',
                target_object_id=instance.id
            )
        elif instance.role == 'entrepreneur':
            Entrepreneur.objects.create(user=instance)
            UserActivity.objects.create(
                user=instance,
                activity_type='other',
                action='created',
                description='Profil entrepreneur créé',
                target_object_type='User',
                target_object_id=instance.id
            )
        elif instance.role == 'stakeholder':
            Stakeholder.objects.create(user=instance)
            UserActivity.objects.create(
                user=instance,
                activity_type='other',
                action='created',
                description='Profil partie prenante créé',
                target_object_type='User',
                target_object_id=instance.id
            )

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Signal pour sauvegarder automatiquement le profil de l'utilisateur
    lors de la mise à jour de l'utilisateur.
    """
    if instance.role == 'mentor' and hasattr(instance, 'mentor_profile'):
        instance.mentor_profile.save()
    elif instance.role == 'entrepreneur' and hasattr(instance, 'entrepreneur_profile'):
        instance.entrepreneur_profile.save()
    elif instance.role == 'stakeholder' and hasattr(instance, 'stakeholder_profile'):
        instance.stakeholder_profile.save()

@receiver(pre_delete, sender=User)
def log_user_deletion(sender, instance, **kwargs):
    """
    Signal pour enregistrer la suppression d'un utilisateur
    """
    # Créer l'activité avec un autre utilisateur (admin) si disponible
    admin_user = User.objects.filter(is_superuser=True).exclude(id=instance.id).first()
    
    UserActivity.objects.create(
        user=admin_user,  # Peut être None, ce qui est maintenant autorisé
        activity_type='other',
        action='deleted',
        description=f'Utilisateur {instance.username} supprimé',
        target_object_type='User',
        target_object_id=instance.id,
        target_user=instance
    )
