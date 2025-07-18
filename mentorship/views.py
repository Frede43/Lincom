from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q, Count, Avg
from .models import MentorshipProgram, MentorshipSession, Resource, ActionItem, Feedback
from .serializers import (
    MentorshipProgramSerializer, MentorshipProgramDetailSerializer,
    MentorshipSessionSerializer, MentorshipSessionDetailSerializer,
    ResourceSerializer, ActionItemSerializer, FeedbackSerializer,
    MentorMatchSerializer
)
from .services import MentorMatchingService
from comlab.viewsets import CustomModelViewSet

class MentorshipProgramViewSet(CustomModelViewSet):
    queryset = MentorshipProgram.objects.all()
    serializer_class = MentorshipProgramSerializer
    detail_serializer_class = MentorshipProgramDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(
            Q(mentor__user=user) | Q(mentee=user)
        )

    @action(detail=True, methods=['post'])
    def complete_program(self, request, pk=None):
        program = self.get_object()
        if program.status != 'active':
            return Response(
                {'error': 'Program is not active'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        program.status = 'completed'
        program.save()
        return Response({'status': 'Program completed successfully'})

    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        program = self.get_object()
        sessions = program.sessions.all()
        
        return Response({
            'total_sessions': sessions.count(),
            'completed_sessions': sessions.filter(status='completed').count(),
            'total_duration': sum(
                session.duration.total_seconds() / 3600 
                for session in sessions if session.status == 'completed'
            ),
            'average_rating': program.feedbacks.aggregate(Avg('rating'))['rating__avg'],
            'action_items': {
                'total': ActionItem.objects.filter(session__program=program).count(),
                'completed': ActionItem.objects.filter(
                    session__program=program,
                    status='completed'
                ).count()
            }
        })

class MentorshipSessionViewSet(CustomModelViewSet):
    queryset = MentorshipSession.objects.all()
    serializer_class = MentorshipSessionSerializer
    detail_serializer_class = MentorshipSessionDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(
            Q(program__mentor__user=user) | Q(program__mentee=user)
        )

    @action(detail=True, methods=['post'])
    def complete_session(self, request, pk=None):
        session = self.get_object()
        if session.status != 'scheduled':
            return Response(
                {'error': 'Session is not scheduled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        session.status = 'completed'
        session.save()
        return Response({'status': 'Session completed successfully'})

    @action(detail=True, methods=['post'])
    def reschedule(self, request, pk=None):
        session = self.get_object()
        new_date = request.data.get('new_date')
        if not new_date:
            return Response(
                {'error': 'New date is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        session.date = new_date
        session.status = 'rescheduled'
        session.save()
        return Response({'status': 'Session rescheduled successfully'})

class ResourceViewSet(CustomModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(
            Q(created_by=user) |
            Q(sessions__program__mentor__user=user) |
            Q(sessions__program__mentee=user)
        ).distinct()

class ActionItemViewSet(CustomModelViewSet):
    queryset = ActionItem.objects.all()
    serializer_class = ActionItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(
            Q(assignee=user) |
            Q(session__program__mentor__user=user) |
            Q(session__program__mentee=user)
        ).distinct()

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        action_item = self.get_object()
        if action_item.status == 'completed':
            return Response(
                {'error': 'Action item already completed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        action_item.status = 'completed'
        action_item.completed_at = timezone.now()
        action_item.save()
        return Response({'status': 'Action item completed successfully'})

class FeedbackViewSet(CustomModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        
        visible_feedback = Q(is_anonymous=False)
        user_feedback = (
            Q(from_user=user) |
            Q(to_user=user) |
            Q(program__mentor__user=user) |
            Q(program__mentee=user)
        )
        return self.queryset.filter(visible_feedback & user_feedback).distinct()

    def perform_create(self, serializer):
        serializer.save(from_user=self.request.user)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        user = request.user
        user_feedbacks = self.get_queryset().filter(to_user=user)
        
        return Response({
            'total_feedbacks': user_feedbacks.count(),
            'average_rating': user_feedbacks.aggregate(Avg('rating'))['rating__avg'],
            'rating_distribution': user_feedbacks.values('rating').annotate(
                count=Count('rating')
            ).order_by('rating')
        })

class MentorMatchingViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        """
        Liste les mentors disponibles avec leurs scores de compatibilité.
        Équivalent à find_matches mais accessible via l'endpoint racine.
        """
        startup = request.user.startup if hasattr(request.user, 'startup') else None
        expertise_areas = request.query_params.getlist('expertise_areas', None)
        
        matching_service = MentorMatchingService(request.user, startup)
        matches = matching_service.get_matches()
        
        serializer = MentorMatchSerializer(matches, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def find_matches(self, request):
        """
        Endpoint alternatif pour la compatibilité avec l'ancien API.
        """
        return self.list(request)
