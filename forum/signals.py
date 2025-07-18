from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Post, Topic

@receiver(post_save, sender=Post)
def update_topic_last_activity(sender, instance, created, **kwargs):
    """Mettre à jour la date de dernière activité du sujet."""
    if created:
        instance.topic.last_activity = timezone.now()
        instance.topic.save()
