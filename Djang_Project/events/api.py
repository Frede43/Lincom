from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Count, Avg
from .models import Event, EventRegistration, EventSpeaker, EventFeedback
from .serializers import (
    EventSerializer, EventRegistrationSerializer,
    EventSpeakerSerializer, EventFeedbackSerializer
)

class IsOrganizerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.organizer == request.user

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOrganizerOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['start_date', 'created_at', 'registrations_count']
    
    def get_queryset(self):
        queryset = Event.objects.annotate(
            registrations_count=Count('registrations')
        ).select_related('organizer')
        
        category = self.request.query_params.get('category', None)
        is_virtual = self.request.query_params.get('is_virtual', None)
        is_past = self.request.query_params.get('is_past', None)
        
        if category:
            queryset = queryset.filter(category=category)
        if is_virtual is not None:
            queryset = queryset.filter(is_virtual=is_virtual.lower() == 'true')
        if is_past is not None:
            now = timezone.now()
            if is_past.lower() == 'true':
                queryset = queryset.filter(end_date__lt=now)
            else:
                queryset = queryset.filter(end_date__gte=now)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def register(self, request, pk=None):
        event = self.get_object()
        if event.registrations.filter(participant=request.user).exists():
            return Response({'detail': 'Vous êtes déjà inscrit à cet événement.'}, status=400)
        
        if event.registrations.count() >= event.max_participants:
            return Response({'detail': 'L\'événement est complet.'}, status=400)
        
        registration = EventRegistration.objects.create(
            event=event,
            participant=request.user,
            status='pending'
        )
        serializer = EventRegistrationSerializer(registration)
        return Response(serializer.data)

class EventRegistrationViewSet(viewsets.ModelViewSet):
    serializer_class = EventRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return EventRegistration.objects.filter(participant=self.request.user)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        registration = self.get_object()
        registration.status = 'cancelled'
        registration.save()
        return Response({'status': 'cancelled'})

class EventSpeakerViewSet(viewsets.ModelViewSet):
    queryset = EventSpeaker.objects.all()
    serializer_class = EventSpeakerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()

class EventFeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = EventFeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return EventFeedback.objects.filter(event_id=self.kwargs['event_pk'])
    
    def perform_create(self, serializer):
        serializer.save(
            event_id=self.kwargs['event_pk'],
            participant=self.request.user
        )
