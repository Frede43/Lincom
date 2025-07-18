from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from education.models import Enrollment, Training
from forum.models import Post, Topic
from .models import Notification, NotificationPreference

User = get_user_model()

@receiver(post_save, sender=User)
def create_notification_preferences(sender, instance, created, **kwargs):
    """Créer les préférences de notification par défaut pour un nouvel utilisateur."""
    if created:
        NotificationPreference.objects.create(user=instance)

@receiver(post_save, sender=Enrollment)
def notify_enrollment_status(sender, instance, created, **kwargs):
    """Envoyer une notification lors de la création ou mise à jour d'une inscription."""
    if created:
        # Notification pour l'étudiant
        Notification.objects.create(
            recipient=instance.student,
            notification_type='enrollment',
            title='Nouvelle inscription',
            message=f'Vous vous êtes inscrit(e) à la formation {instance.training.course.title}',
        )
        
        # Notification pour l'instructeur
        Notification.objects.create(
            recipient=instance.training.course.instructor,
            notification_type='enrollment',
            title='Nouvel étudiant inscrit',
            message=f'{instance.student.get_full_name()} s\'est inscrit(e) à votre formation {instance.training.course.title}',
        )
    else:
        # Notification de changement de statut
        Notification.objects.create(
            recipient=instance.student,
            notification_type='enrollment',
            title='Statut d\'inscription mis à jour',
            message=f'Le statut de votre inscription à {instance.training.course.title} a été mis à jour : {instance.get_status_display()}',
        )

@receiver(post_save, sender=Training)
def notify_training_update(sender, instance, created, **kwargs):
    """Envoyer une notification lors de la création ou mise à jour d'une formation."""
    if created:
        # Notifier l'instructeur
        Notification.objects.create(
            recipient=instance.course.instructor,
            notification_type='course',
            title='Nouvelle session de formation créée',
            message=f'Une nouvelle session de formation a été créée pour {instance.course.title}',
        )
    else:
        # Notifier les étudiants inscrits
        for enrollment in instance.enrollments.all():
            Notification.objects.create(
                recipient=enrollment.student,
                notification_type='course',
                title='Mise à jour de la formation',
                message=f'La formation {instance.course.title} a été mise à jour',
            )

@receiver(post_save, sender=Post)
def notify_forum_activity(sender, instance, created, **kwargs):
    """Envoyer une notification lors de la création d'un nouveau message dans le forum."""
    if created:
        # Notifier l'auteur du sujet
        if instance.author != instance.topic.author:
            Notification.objects.create(
                recipient=instance.topic.author,
                notification_type='forum',
                title='Nouvelle réponse à votre sujet',
                message=f'{instance.author.get_full_name()} a répondu à votre sujet : {instance.topic.title}',
            )
        
        # Notifier les autres participants à la discussion
        participants = Post.objects.filter(topic=instance.topic).values_list('author', flat=True).distinct()
        for user_id in participants:
            if user_id not in [instance.author.id, instance.topic.author.id]:
                Notification.objects.create(
                    recipient_id=user_id,
                    notification_type='forum',
                    title='Nouvelle réponse dans une discussion',
                    message=f'Nouvelle réponse de {instance.author.get_full_name()} dans : {instance.topic.title}',
                )
