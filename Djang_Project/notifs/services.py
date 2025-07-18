from django.contrib.contenttypes.models import ContentType
from django.urls import reverse
from .models import Notification

class NotificationService:
    @staticmethod
    def create_notification(recipient, title, message, related_object, level='info', 
                          action_url='', action_text=''):
        """
        Crée une notification pour un utilisateur.
        """
        content_type = ContentType.objects.get_for_model(related_object)
        
        return Notification.objects.create(
            recipient=recipient,
            title=title,
            message=message,
            level=level,
            content_type=content_type,
            object_id=related_object.id,
            action_url=action_url,
            action_text=action_text
        )

    @staticmethod
    def notify_join_request(join_request):
        """
        Envoie une notification au fondateur pour une nouvelle demande de participation.
        """
        startup = join_request.startup
        user = join_request.user
        
        title = f"Nouvelle demande de participation"
        message = f"{user.get_full_name()} souhaite rejoindre votre startup {startup.name} en tant que {join_request.get_role_display()}"
        action_url = reverse('startups:join-request-detail', args=[join_request.id])
        action_text = "Examiner la demande"
        
        return NotificationService.create_notification(
            recipient=startup.founder,
            title=title,
            message=message,
            related_object=join_request,
            level='info',
            action_url=action_url,
            action_text=action_text
        )

    @staticmethod
    def notify_join_request_decision(join_request):
        """
        Envoie une notification à l'utilisateur de la décision sur sa demande.
        """
        startup = join_request.startup
        is_accepted = join_request.status == 'accepted'
        
        title = "Demande de participation acceptée" if is_accepted else "Demande de participation refusée"
        message = (
            f"Votre demande pour rejoindre {startup.name} a été {'acceptée' if is_accepted else 'refusée'}."
        )
        if join_request.review_notes:
            message += f"\n\nCommentaire : {join_request.review_notes}"
        
        action_url = reverse('startups:startup-detail', args=[startup.slug])
        action_text = "Voir la startup"
        
        return NotificationService.create_notification(
            recipient=join_request.user,
            title=title,
            message=message,
            related_object=join_request,
            level='success' if is_accepted else 'warning',
            action_url=action_url,
            action_text=action_text
        )

    @classmethod
    def notify_mentor_request(cls, mentor_request):
        """Notifie le fondateur d'une nouvelle demande de mentorat."""
        notification = cls.create_notification(
            recipient=mentor_request.startup.founder,
            level='info',
            title="Nouvelle demande de mentorat",
            message=f"{mentor_request.mentor.get_full_name()} souhaite devenir mentor de votre startup.",
            action_url=f"/startups/{mentor_request.startup.slug}/mentor-requests/{mentor_request.id}/",
            related_object=mentor_request
        )
        return notification

    @classmethod
    def notify_mentor_request_accepted(cls, mentor_request):
        """Notifie le mentor que sa demande a été acceptée."""
        notification = cls.create_notification(
            recipient=mentor_request.mentor,
            level='success',
            title="Demande de mentorat acceptée",
            message=f"Votre demande de mentorat pour {mentor_request.startup.name} a été acceptée.",
            action_url=f"/startups/{mentor_request.startup.slug}/",
            related_object=mentor_request
        )
        return notification

    @classmethod
    def notify_mentor_request_rejected(cls, mentor_request):
        """Notifie le mentor que sa demande a été rejetée."""
        notification = cls.create_notification(
            recipient=mentor_request.mentor,
            level='warning',
            title="Demande de mentorat rejetée",
            message=f"Votre demande de mentorat pour {mentor_request.startup.name} n'a pas été retenue.",
            action_url=f"/startups/{mentor_request.startup.slug}/",
            related_object=mentor_request
        )
        return notification

    @staticmethod
    def mark_all_as_read(user):
        """
        Marque toutes les notifications d'un utilisateur comme lues.
        """
        return Notification.objects.filter(
            recipient=user,
            is_read=False
        ).update(is_read=True)
