from rest_framework import serializers
from .models import DashboardPreference, Widget, Notification, QuickAction, UserActivity

class WidgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Widget
        fields = '__all__'

class DashboardPreferenceSerializer(serializers.ModelSerializer):
    available_widgets = WidgetSerializer(many=True, read_only=True)
    enabled_widgets = serializers.SerializerMethodField()

    class Meta:
        model = DashboardPreference
        fields = '__all__'

    def get_enabled_widgets(self, obj):
        user_role = obj.user.role
        return Widget.objects.filter(
            id__in=obj.widgets,
            required_permissions__contains=[user_role]
        )

class NotificationSerializer(serializers.ModelSerializer):
    age = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = '__all__'

    def get_age(self, obj):
        from django.utils import timezone
        from datetime import timedelta
        
        delta = timezone.now() - obj.created_at
        
        if delta < timedelta(minutes=1):
            return "Just now"
        elif delta < timedelta(hours=1):
            minutes = int(delta.total_seconds() / 60)
            return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
        elif delta < timedelta(days=1):
            hours = int(delta.total_seconds() / 3600)
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        elif delta < timedelta(days=7):
            days = delta.days
            return f"{days} day{'s' if days != 1 else ''} ago"
        else:
            return obj.created_at.strftime("%Y-%m-%d")

class QuickActionSerializer(serializers.ModelSerializer):
    is_available = serializers.SerializerMethodField()

    class Meta:
        model = QuickAction
        fields = '__all__'

    def get_is_available(self, obj):
        user = self.context['request'].user
        return not obj.required_role or user.role == obj.required_role

class UserActivitySerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    formatted_time = serializers.SerializerMethodField()
    formatted_type = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()

    class Meta:
        model = UserActivity
        fields = [
            'id', 'user', 'user_name', 'activity_type', 'formatted_type',
            'description', 'metadata', 'created_at', 'formatted_time', 'age'
        ]

    def get_formatted_time(self, obj):
        return obj.created_at.strftime("%Y-%m-%d %H:%M:%S")

    def get_formatted_type(self, obj):
        return dict(UserActivity.ACTIVITY_TYPES).get(obj.activity_type, obj.activity_type)

    def get_age(self, obj):
        from django.utils import timezone
        from datetime import timedelta
        
        delta = timezone.now() - obj.created_at
        
        if delta < timedelta(minutes=1):
            return "À l'instant"
        elif delta < timedelta(hours=1):
            minutes = int(delta.total_seconds() / 60)
            return f"Il y a {minutes} minute{'s' if minutes != 1 else ''}"
        elif delta < timedelta(days=1):
            hours = int(delta.total_seconds() / 3600)
            return f"Il y a {hours} heure{'s' if hours != 1 else ''}"
        elif delta < timedelta(days=7):
            days = delta.days
            return f"Il y a {days} jour{'s' if days != 1 else ''}"
        else:
            return obj.created_at.strftime("%d/%m/%Y")

class DashboardOverviewSerializer(serializers.Serializer):
    """Serializer pour la vue d'ensemble du tableau de bord"""
    user_stats = serializers.SerializerMethodField()
    recent_activities = serializers.SerializerMethodField()
    upcoming_events = serializers.SerializerMethodField()
    notifications = serializers.SerializerMethodField()
    quick_actions = serializers.SerializerMethodField()

    def get_user_stats(self, obj):
        """Retourne les statistiques de base de l'utilisateur"""
        return {
            'total_activities': UserActivity.objects.filter(user=obj).count(),
            'unread_notifications': Notification.objects.filter(user=obj, is_read=False).count(),
            'available_actions': QuickAction.objects.filter(is_active=True).count()
        }

    def get_recent_activities(self, obj):
        """Retourne les 5 dernières activités de l'utilisateur"""
        activities = UserActivity.objects.filter(user=obj).order_by('-created_at')[:5]
        return UserActivitySerializer(activities, many=True).data

    def get_upcoming_events(self, obj):
        """Retourne les événements à venir (vide pour l'instant)"""
        return []

    def get_notifications(self, obj):
        """Retourne les 5 dernières notifications non lues"""
        notifications = obj.dashboard_notifications.filter(
            is_read=False
        ).order_by('-created_at')[:5]
        return NotificationSerializer(notifications, many=True).data

    def get_quick_actions(self, obj):
        """Retourne les actions rapides disponibles"""
        actions = QuickAction.objects.filter(
            is_active=True,
            required_role__in=['', getattr(obj, 'role', '')]
        ).order_by('order')
        return QuickActionSerializer(
            actions, 
            many=True,
            context={'request': self.context.get('request')}
        ).data

class WidgetDataSerializer(serializers.Serializer):
    """Serializer pour les données spécifiques aux widgets"""
    widget_type = serializers.CharField()
    data = serializers.SerializerMethodField()

    def get_data(self, obj):
        widget_type = obj['widget_type']
        user = self.context['request'].user

        if widget_type == 'calendar':
            return self._get_calendar_data(user)
        elif widget_type == 'tasks':
            return self._get_tasks_data(user)
        elif widget_type == 'stats':
            return self._get_stats_data(user)
        elif widget_type == 'notifications':
            return self._get_notifications_data(user)
        elif widget_type == 'recent_activity':
            return self._get_activity_data(user)
        elif widget_type == 'quick_actions':
            return self._get_quick_actions_data(user)
        return {}

    def _get_calendar_data(self, user):
        from django.utils import timezone
        events = []
        
        # Ajouter les sessions de formation
        for enrollment in user.course_enrollments.all():
            events.append({
                'type': 'training',
                'title': enrollment.training.course.title,
                'start': enrollment.training.start_date,
                'end': enrollment.training.end_date
            })
        
        # Ajouter les sessions de mentorat
        if hasattr(user, 'mentorship_sessions'):
            for session in user.mentorship_sessions.all():
                events.append({
                    'type': 'mentorship',
                    'title': f"Mentorship Session",
                    'start': session.date,
                    'end': session.date + session.duration
                })
        
        return {'events': events}

    def _get_tasks_data(self, user):
        from django.utils import timezone
        tasks = []
        
        # Ajouter les actions à faire
        if hasattr(user, 'assigned_actions'):
            for action in user.assigned_actions.filter(status='pending'):
                tasks.append({
                    'type': 'action_item',
                    'title': action.title,
                    'due_date': action.due_date,
                    'priority': action.priority
                })
        
        return {'tasks': tasks}

    def _get_stats_data(self, user):
        return {
            'courses': {
                'total': user.course_enrollments.count(),
                'completed': user.course_enrollments.filter(status='completed').count()
            },
            'mentorship': {
                'sessions': getattr(user, 'mentorship_sessions', []).count(),
                'completed_actions': getattr(user, 'assigned_actions', []).filter(
                    status='completed'
                ).count()
            }
        }

    def _get_notifications_data(self, user):
        return {
            'unread': user.notifications.filter(is_read=False).count(),
            'recent': NotificationSerializer(
                user.notifications.all()[:5],
                many=True
            ).data
        }

    def _get_activity_data(self, user):
        return {
            'recent': UserActivitySerializer(
                user.activities.all()[:10],
                many=True
            ).data
        }

    def _get_quick_actions_data(self, user):
        actions = QuickAction.objects.filter(
            is_enabled=True,
            required_role__in=['', user.role]
        )
        return {
            'actions': QuickActionSerializer(
                actions,
                many=True,
                context={'request': self.context['request']}
            ).data
        }
