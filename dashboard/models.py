from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class DashboardPreference(models.Model):
    """Préférences du tableau de bord pour un utilisateur"""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='dashboard_preferences'
    )
    layout = models.JSONField(default=dict)
    widgets = models.JSONField(default=list)
    theme = models.CharField(max_length=20, default='light')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Préférences de {self.user.username}"

    class Meta:
        ordering = ['-updated_at']

class Widget(models.Model):
    """Widget configurable du tableau de bord"""
    WIDGET_TYPES = [
        ('calendar', 'Calendrier'),
        ('tasks', 'Tâches'),
        ('stats', 'Statistiques'),
        ('notifications', 'Notifications'),
        ('activity', 'Activité'),
        ('quick_actions', 'Actions Rapides'),
    ]

    title = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=WIDGET_TYPES)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50)
    required_permissions = models.JSONField(default=list)
    settings = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['title']

class Notification(models.Model):
    """Notification pour un utilisateur"""
    NOTIFICATION_TYPES = [
        ('info', 'Information'),
        ('success', 'Succès'),
        ('warning', 'Avertissement'),
        ('error', 'Erreur'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='dashboard_notifications'
    )
    title = models.CharField(max_length=200)
    message = models.TextField()
    type = models.CharField(max_length=10, choices=NOTIFICATION_TYPES, default='info')
    action_url = models.URLField(blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class QuickAction(models.Model):
    """Action rapide disponible dans le tableau de bord"""
    ACTION_TYPES = [
        ('link', 'Lien'),
        ('modal', 'Modal'),
        ('function', 'Fonction'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    action_type = models.CharField(max_length=10, choices=ACTION_TYPES)
    icon = models.CharField(max_length=50)
    url = models.CharField(max_length=200, blank=True)
    function_name = models.CharField(max_length=100, blank=True)
    required_role = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order', 'title']

class UserActivity(models.Model):
    """Activité d'un utilisateur"""
    ACTIVITY_TYPES = [
        ('login', 'Connexion'),
        ('course', 'Formation'),
        ('mentorship', 'Mentorat'),
        ('project', 'Projet'),
        ('other', 'Autre'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='user_activities'
    )
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    description = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)
    action = models.CharField(max_length=50, null=True, blank=True)
    target_object_type = models.CharField(max_length=50, null=True, blank=True)
    target_object_id = models.PositiveIntegerField(null=True, blank=True)
    target_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='targeted_by_activities'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        user_str = self.user.username if self.user else "System"
        return f"{user_str} - {self.activity_type} - {self.action}"

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'User activities'
        db_table = 'dashboard_useractivity'
