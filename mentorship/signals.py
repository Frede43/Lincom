from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import MentorshipRequest, MentorshipSession

@receiver(post_save, sender=MentorshipRequest)
def notify_mentor_request(sender, instance, created, **kwargs):
    """Send notification when a new mentorship request is created"""
    if created and hasattr(settings, 'EMAIL_HOST'):
        subject = 'New Mentorship Request'
        message = f'You have received a new mentorship request from {instance.mentee.get_full_name()}'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [instance.mentor.email]
        
        try:
            send_mail(subject, message, from_email, recipient_list)
        except Exception as e:
            print(f"Failed to send email notification: {e}")

@receiver(post_save, sender=MentorshipSession)
def notify_session_scheduled(sender, instance, created, **kwargs):
    """Send notification when a mentorship session is scheduled"""
    if created and hasattr(settings, 'EMAIL_HOST'):
        subject = 'New Mentorship Session Scheduled'
        message = f'A new mentorship session has been scheduled for {instance.start_time}'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [instance.mentor.email, instance.mentee.email]
        
        try:
            send_mail(subject, message, from_email, recipient_list)
        except Exception as e:
            print(f"Failed to send email notification: {e}")

@receiver(pre_delete, sender=MentorshipSession)
def notify_session_cancelled(sender, instance, **kwargs):
    """Send notification when a mentorship session is cancelled"""
    if hasattr(settings, 'EMAIL_HOST'):
        subject = 'Mentorship Session Cancelled'
        message = f'The mentorship session scheduled for {instance.start_time} has been cancelled'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [instance.mentor.email, instance.mentee.email]
        
        try:
            send_mail(subject, message, from_email, recipient_list)
        except Exception as e:
            print(f"Failed to send email notification: {e}")
