from rest_framework import serializers
from .models import MentorshipProgram, MentorshipSession, Resource, ActionItem, Feedback
from users.serializers import UserSerializer, MentorSerializer

class ResourceSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = Resource
        fields = '__all__'

class ActionItemSerializer(serializers.ModelSerializer):
    assignee_name = serializers.CharField(source='assignee.get_full_name', read_only=True)
    days_until_due = serializers.SerializerMethodField()

    class Meta:
        model = ActionItem
        fields = '__all__'

    def get_days_until_due(self, obj):
        from django.utils import timezone
        if obj.due_date:
            delta = obj.due_date - timezone.now().date()
            return delta.days
        return None

class FeedbackSerializer(serializers.ModelSerializer):
    from_user_name = serializers.CharField(source='from_user.get_full_name', read_only=True)
    to_user_name = serializers.CharField(source='to_user.get_full_name', read_only=True)

    class Meta:
        model = Feedback
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.is_anonymous:
            representation['from_user_name'] = 'Anonymous'
        return representation

class MentorshipSessionSerializer(serializers.ModelSerializer):
    materials = ResourceSerializer(many=True, read_only=True)
    action_items = ActionItemSerializer(many=True, read_only=True)
    feedbacks = FeedbackSerializer(many=True, read_only=True)
    time_until_session = serializers.SerializerMethodField()

    class Meta:
        model = MentorshipSession
        fields = (
            'id', 'program', 'date', 'duration', 'meeting_type', 'status', 'location',
            'meeting_link', 'agenda', 'materials', 'action_items', 'feedbacks', 'time_until_session'
        )

    def get_time_until_session(self, obj):
        from django.utils import timezone
        if obj.date and obj.date > timezone.now():
            delta = obj.date - timezone.now()
            return {
                'days': delta.days,
                'hours': delta.seconds // 3600,
                'minutes': (delta.seconds % 3600) // 60
            }
        return None

class MentorshipProgramSerializer(serializers.ModelSerializer):
    mentor_details = MentorSerializer(source='mentor', read_only=True)
    mentee_details = UserSerializer(source='mentee', read_only=True)
    sessions = MentorshipSessionSerializer(many=True, read_only=True)
    progress = serializers.SerializerMethodField()
    upcoming_session = serializers.SerializerMethodField()

    class Meta:
        model = MentorshipProgram
        fields = (
            'id', 'objectives', 'status', 'start_date', 'end_date',
            'mentor', 'mentee', 'startup', 'mentor_details',
            'mentee_details', 'sessions', 'progress', 'upcoming_session',
            'created_at', 'updated_at'
        )

    def get_progress(self, obj):
        total_sessions = obj.sessions.count()
        completed_sessions = obj.sessions.filter(status='completed').count()
        if total_sessions == 0:
            return 0
        return (completed_sessions / total_sessions) * 100

    def get_upcoming_session(self, obj):
        from django.utils import timezone
        upcoming = obj.sessions.filter(
            date__gt=timezone.now(),
            status='scheduled'
        ).order_by('date').first()
        
        if upcoming:
            return MentorshipSessionSerializer(upcoming).data
        return None

class MentorshipProgramDetailSerializer(MentorshipProgramSerializer):
    """Serializer détaillé pour un programme de mentorat spécifique"""
    all_feedbacks = serializers.SerializerMethodField()
    program_metrics = serializers.SerializerMethodField()

    class Meta(MentorshipProgramSerializer.Meta):
        fields = MentorshipProgramSerializer.Meta.fields + (
            'all_feedbacks',
            'program_metrics'
        )

    def get_all_feedbacks(self, obj):
        feedbacks = obj.feedbacks.all()
        return FeedbackSerializer(feedbacks, many=True).data

    def get_program_metrics(self, obj):
        from django.db.models import Avg, Count
        from django.utils import timezone

        sessions = obj.sessions.all()
        completed_sessions = sessions.filter(status='completed')
        action_items = ActionItem.objects.filter(session__program=obj)

        return {
            'session_stats': {
                'total': sessions.count(),
                'completed': completed_sessions.count(),
                'cancelled': sessions.filter(status='cancelled').count(),
                'upcoming': sessions.filter(
                    date__gt=timezone.now(),
                    status='scheduled'
                ).count()
            },
            'duration_stats': {
                'total_hours': sum(
                    session.duration.total_seconds() / 3600 
                    for session in completed_sessions if session.duration
                ),
                'avg_session_duration': completed_sessions.aggregate(
                    Avg('duration')
                )['duration__avg']
            },
            'action_items_stats': {
                'total': action_items.count(),
                'completed': action_items.filter(status='completed').count(),
                'overdue': action_items.filter(
                    status='pending',
                    due_date__lt=timezone.now().date()
                ).count()
            },
            'feedback_stats': {
                'total_feedbacks': obj.feedbacks.count(),
                'avg_rating': obj.feedbacks.aggregate(
                    Avg('rating')
                )['rating__avg']
            }
        }

class MentorMatchSerializer(serializers.Serializer):
    mentor = MentorSerializer()
    compatibility = serializers.FloatField()
    active_programs = serializers.IntegerField()

class MentorshipSessionDetailSerializer(MentorshipSessionSerializer):
    """Serializer détaillé pour une session de mentorat spécifique"""
    program_context = serializers.SerializerMethodField()
    previous_session_summary = serializers.SerializerMethodField()

    class Meta(MentorshipSessionSerializer.Meta):
        fields = MentorshipSessionSerializer.Meta.fields + (
            'program_context',
            'previous_session_summary'
        )

    def get_program_context(self, obj):
        """Récupère le contexte du programme pour cette session"""
        program = obj.program
        completed_sessions = program.sessions.filter(
            status='completed',
            date__lt=obj.date
        ).count()
        
        return {
            'program_title': program.title,
            'program_status': program.status,
            'completed_sessions': completed_sessions,
            'total_sessions': program.sessions.count(),
            'program_goals': program.goals,
            'current_focus_areas': program.focus_areas
        }

    def get_previous_session_summary(self, obj):
        """Récupère un résumé de la session précédente"""
        previous_session = obj.program.sessions.filter(
            date__lt=obj.date,
            status='completed'
        ).order_by('-date').first()

        if not previous_session:
            return None

        return {
            'date': previous_session.date,
            'key_points': previous_session.key_points,
            'action_items': ActionItemSerializer(
                previous_session.action_items.all(),
                many=True
            ).data,
            'feedback_summary': {
                'rating': previous_session.feedbacks.aggregate(
                    avg_rating=models.Avg('rating')
                )['avg_rating'],
                'key_takeaways': [
                    feedback.key_takeaways
                    for feedback in previous_session.feedbacks.all()
                    if feedback.key_takeaways
                ]
            }
        }
