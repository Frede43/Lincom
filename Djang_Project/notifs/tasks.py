from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

@shared_task
def send_notification_email(recipient_email, subject, template_name, context):
    """
    Envoie un email de notification de manière asynchrone
    """
    html_message = render_to_string(template_name, context)
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[recipient_email],
        html_message=html_message
    )

@shared_task
def send_mentor_request_notification(mentor_request_id):
    """
    Envoie une notification pour une nouvelle demande de mentorat
    """
    from .models import MentorRequest
    
    try:
        mentor_request = MentorRequest.objects.select_related('startup', 'mentor').get(id=mentor_request_id)
        
        context = {
            'mentor_name': mentor_request.mentor.get_full_name(),
            'startup_name': mentor_request.startup.name,
            'message': mentor_request.message,
            'expertise_areas': mentor_request.expertise_areas,
        }
        
        send_notification_email.delay(
            recipient_email=mentor_request.startup.founder.email,
            subject="Nouvelle demande de mentorat",
            template_name='notifs/email/mentor_request.html',
            context=context
        )
    except MentorRequest.DoesNotExist:
        pass

@shared_task
def send_mentor_request_status_notification(mentor_request_id):
    """
    Envoie une notification de changement de statut d'une demande de mentorat
    """
    from .models import MentorRequest
    
    try:
        mentor_request = MentorRequest.objects.select_related('startup', 'mentor').get(id=mentor_request_id)
        
        context = {
            'mentor_name': mentor_request.mentor.get_full_name(),
            'startup_name': mentor_request.startup.name,
            'status': mentor_request.get_status_display(),
        }
        
        template_name = (
            'notifs/email/mentor_request_accepted.html'
            if mentor_request.status == 'accepted'
            else 'notifs/email/mentor_request_rejected.html'
        )
        
        subject = (
            "Votre demande de mentorat a été acceptée"
            if mentor_request.status == 'accepted'
            else "Votre demande de mentorat a été rejetée"
        )
        
        send_notification_email.delay(
            recipient_email=mentor_request.mentor.email,
            subject=subject,
            template_name=template_name,
            context=context
        )
    except MentorRequest.DoesNotExist:
        pass
