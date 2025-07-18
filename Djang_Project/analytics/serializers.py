from rest_framework import serializers
from .models import UserActivity, CourseAnalytics, TrainingAnalytics, StartupMetrics, PlatformStatistics
from accounts.serializers import UserSerializer
from learning.serializers import CourseSerializer, TrainingSerializer
from startups.serializers import StartupDetailSerializer

class UserActivitySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserActivity
        fields = ['id', 'user', 'activity_type', 'activity_id', 'timestamp', 'details']

class CourseAnalyticsSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    
    class Meta:
        model = CourseAnalytics
        fields = ['id', 'course', 'total_students', 'average_progress',
                 'completion_rate', 'last_updated']
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['average_progress'] = f"{instance.average_progress:.1f}%"
        data['completion_rate'] = f"{instance.completion_rate:.1f}%"
        return data

class TrainingAnalyticsSerializer(serializers.ModelSerializer):
    training = TrainingSerializer(read_only=True)
    
    class Meta:
        model = TrainingAnalytics
        fields = ['id', 'training', 'total_participants', 'attendance_rate',
                 'satisfaction_score', 'last_updated']
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['attendance_rate'] = f"{instance.attendance_rate:.1f}%"
        data['satisfaction_score'] = f"{instance.satisfaction_score:.1f}/5.0"
        return data

class StartupMetricsSerializer(serializers.ModelSerializer):
    startup = StartupDetailSerializer(read_only=True)
    
    class Meta:
        model = StartupMetrics
        fields = ['id', 'startup', 'total_projects', 'active_projects',
                 'team_size', 'last_updated']
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.total_projects > 0:
            data['active_ratio'] = f"{(instance.active_projects / instance.total_projects * 100):.1f}%"
        else:
            data['active_ratio'] = "0.0%"
        return data

class PlatformStatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformStatistics
        fields = ['id', 'date', 'total_users', 'active_users',
                 'total_startups', 'total_projects', 'total_courses',
                 'total_trainings']
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.total_users > 0:
            data['active_users_ratio'] = f"{(instance.active_users / instance.total_users * 100):.1f}%"
        else:
            data['active_users_ratio'] = "0.0%"
        return data
