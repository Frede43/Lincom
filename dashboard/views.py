from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q, Count
from .models import DashboardPreference, Widget, Notification, QuickAction, UserActivity
from .serializers import (
    DashboardPreferenceSerializer, WidgetSerializer,
    NotificationSerializer, QuickActionSerializer,
    UserActivitySerializer, DashboardOverviewSerializer,
    WidgetDataSerializer
)
from comlab.viewsets import CustomModelViewSet

class DashboardPreferenceViewSet(CustomModelViewSet):
    queryset = DashboardPreference.objects.all()
    serializer_class = DashboardPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def update_layout(self, request, pk=None):
        preference = self.get_object()
        layout = request.data.get('layout')
        if not layout:
            return Response(
                {'error': 'Layout data is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        preference.layout = layout
        preference.save()
        return Response({'status': 'Layout updated successfully'})

    @action(detail=True, methods=['post'])
    def toggle_widget(self, request, pk=None):
        preference = self.get_object()
        widget_id = request.data.get('widget_id')
        if not widget_id:
            return Response(
                {'error': 'Widget ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        widgets = preference.widgets
        if widget_id in widgets:
            widgets.remove(widget_id)
        else:
            widgets.append(widget_id)
        
        preference.widgets = widgets
        preference.save()
        return Response({'status': 'Widget toggled successfully'})

class WidgetViewSet(CustomModelViewSet):
    queryset = Widget.objects.all()
    serializer_class = WidgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = self.queryset.all()
        
        # Filtrer manuellement car SQLite ne supporte pas contains sur JSONField
        if hasattr(user, 'role'):
            filtered_widgets = []
            for widget in queryset:
                permissions = widget.required_permissions
                if not permissions or user.role in permissions:
                    filtered_widgets.append(widget.id)
            return queryset.filter(id__in=filtered_widgets)
        return queryset.filter(required_permissions=[])

    @action(detail=True, methods=['get'])
    def data(self, request, pk=None):
        widget = self.get_object()
        serializer = WidgetDataSerializer(
            {'widget_type': widget.type},
            context={'request': request}
        )
        return Response(serializer.data)

class NotificationViewSet(CustomModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save()
        return Response({'status': 'Notification marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        self.get_queryset().filter(is_read=False).update(
            is_read=True,
            read_at=timezone.now()
        )
        return Response({'status': 'All notifications marked as read'})

class QuickActionViewSet(viewsets.ModelViewSet):
    queryset = QuickAction.objects.all()
    serializer_class = QuickActionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Retourne les actions rapides disponibles pour l'utilisateur
        en fonction de son rôle et de leur état d'activation
        """
        user = self.request.user
        return self.queryset.filter(
            Q(required_role='') | Q(required_role=getattr(user, 'role', '')),
            is_active=True
        ).order_by('order', 'title')

class UserActivityViewSet(CustomModelViewSet):
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        activities = self.get_queryset()
        return Response({
            'total_activities': activities.count(),
            'activity_types': activities.values('action').annotate(
                count=Count('action')
            ),
            'recent_activities': UserActivitySerializer(
                activities.order_by('-created_at')[:5],
                many=True
            ).data
        })

class DashboardViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        """
        Vue d'ensemble du tableau de bord
        """
        serializer = DashboardOverviewSerializer(
            request.user,
            context={'request': request}
        )
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def widget_data(self, request):
        """
        Récupérer les données d'un widget spécifique
        """
        widget_type = request.query_params.get('type')
        if not widget_type:
            return Response(
                {'error': 'Widget type is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = WidgetDataSerializer(
            {'widget_type': widget_type},
            context={'request': request}
        )
        return Response(serializer.data)

class UserStatsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        """
        Retourne les statistiques de l'utilisateur basées sur ses activités
        """
        user = request.user
        
        # Récupérer les activités par type
        activities = UserActivity.objects.filter(user=user)
        activities_by_type = activities.values('activity_type').annotate(count=Count('id'))
        
        # Convertir en dictionnaire pour un accès facile
        activity_counts = {
            item['activity_type']: item['count'] 
            for item in activities_by_type
        }
        
        return Response({
            'activities': {
                'total': activities.count(),
                'courses': activity_counts.get('course', 0),
                'mentorship': activity_counts.get('mentorship', 0),
                'projects': activity_counts.get('project', 0),
                'other': activity_counts.get('other', 0),
                'last_login': activity_counts.get('login', 0)
            },
            'notifications': {
                'total': user.dashboard_notifications.count(),
                'unread': user.dashboard_notifications.filter(is_read=False).count()
            },
            'quick_actions': {
                'available': QuickAction.objects.filter(
                    is_active=True,
                    required_role__in=['', getattr(user, 'role', '')]
                ).count()
            },
            'widgets': {
                'enabled': DashboardPreference.objects.filter(user=user)
                    .values_list('widgets', flat=True)
                    .first() or []
            }
        })

class ActivityFeedViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        """
        Retourne les 20 dernières activités de l'utilisateur
        """
        activities = UserActivity.objects.filter(
            user=request.user
        ).select_related(
            'user'  # On ne sélectionne que la relation user
        ).order_by('-created_at')[:20]

        return Response({
            'activities': UserActivitySerializer(
                activities,
                many=True,
                context={'request': request}
            ).data
        })

class ProgressViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        """
        Retourne les métriques de progression de l'utilisateur
        """
        user = request.user
        now = timezone.now()
        
        # Récupérer les activités par type
        activities = UserActivity.objects.filter(user=user)
        activities_by_type = activities.values('activity_type').annotate(count=Count('id'))
        activity_counts = {
            item['activity_type']: item['count'] 
            for item in activities_by_type
        }
        
        # Calculer les heures d'apprentissage (1 activité = 30 minutes en moyenne)
        learning_hours = sum(
            count * 0.5 for activity_type, count in activity_counts.items()
            if activity_type in ['course', 'project', 'exercise']
        )
        
        return Response({
            'learning_progress': {
                'courses_completed': activity_counts.get('course', 0),
                'skills_acquired': activity_counts.get('skill', 0),
                'certificates_earned': activity_counts.get('certificate', 0),
                'learning_hours': learning_hours
            },
            'engagement_metrics': {
                'forum_posts': activity_counts.get('forum', 0),
                'project_contributions': activity_counts.get('project', 0),
                'peer_reviews': activity_counts.get('review', 0),
                'collaboration_score': self._calculate_collaboration_score(activity_counts)
            },
            'goals': {
                'completed': activity_counts.get('goal_completed', 0),
                'in_progress': activity_counts.get('goal_in_progress', 0),
                'upcoming': activity_counts.get('goal_upcoming', 0)
            }
        })

    def _calculate_collaboration_score(self, activity_counts):
        """
        Calcule un score de collaboration basé sur les activités de l'utilisateur
        """
        # Poids des différentes métriques
        forum_weight = 0.3
        review_weight = 0.3
        contribution_weight = 0.4
        
        # Calcul des scores individuels (max 1.0 pour chaque)
        forum_score = min(activity_counts.get('forum', 0) / 10, 1.0)
        review_score = min(activity_counts.get('review', 0) / 5, 1.0)
        contribution_score = min(activity_counts.get('project', 0) / 3, 1.0)
        
        # Score final pondéré (0.0 à 1.0)
        return (
            forum_score * forum_weight +
            review_score * review_weight +
            contribution_score * contribution_weight
        )
