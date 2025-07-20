from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Notification, NotificationPreference
from .serializers import NotificationSerializer, NotificationPreferenceSerializer

# Create your views here.

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]  # Temporaire pour tests

    def get_queryset(self):
        # Temporaire pour les tests : retourner toutes les notifications
        # En production, filtrer par utilisateur authentifié
        if hasattr(self.request, 'user') and self.request.user.is_authenticated:
            return Notification.objects.filter(recipient=self.request.user)
        else:
            # Pour les tests sans authentification, retourner toutes les notifications
            return Notification.objects.all()

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(status=status.HTTP_200_OK)

class NotificationPreferenceViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return NotificationPreference.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_object(self):
        # Get or create preferences for the current user
        obj, created = NotificationPreference.objects.get_or_create(
            user=self.request.user,
            defaults={
                'email_notifications': True,
                'course_updates': True,
                'forum_activity': True,
                'enrollment_updates': True,
                'mentorship_updates': True,
                'general_notifications': True
            }
        )
        return obj
