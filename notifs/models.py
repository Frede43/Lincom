from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('course', 'Course Related'),
        ('competition', 'Competition Related'),
        ('project', 'Project Related'),
        ('startup', 'Startup Related'),
        ('mentorship', 'Mentorship Related'),
        ('system', 'System Notification'),
    ]
    
    PRIORITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_LEVELS, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
    
    # Pour lier la notification à n'importe quel modèle
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # URL optionnelle pour rediriger l'utilisateur
    action_url = models.URLField(blank=True)

    def __str__(self):
        return f"{self.recipient.username} - {self.title}"

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', '-created_at']),
            models.Index(fields=['notification_type']),
        ]

class NotificationPreference(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notification_preferences')
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    course_updates = models.BooleanField(default=True)
    competition_updates = models.BooleanField(default=True)
    project_updates = models.BooleanField(default=True)
    startup_updates = models.BooleanField(default=True)
    mentorship_updates = models.BooleanField(default=True)
    system_updates = models.BooleanField(default=True)
    forum_activity = models.BooleanField(default=True)
    enrollment_updates = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.username}'s notification preferences"

class NotificationSchedule(models.Model):
    FREQUENCY_CHOICES = [
        ('immediate', 'Immediate'),
        ('daily', 'Daily Digest'),
        ('weekly', 'Weekly Digest'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notification_schedule')
    email_frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='immediate')
    quiet_hours_start = models.TimeField(null=True, blank=True)
    quiet_hours_end = models.TimeField(null=True, blank=True)
    timezone = models.CharField(max_length=50, default='UTC')
    
    def __str__(self):
        return f"Notification schedule for {self.user.username}"
