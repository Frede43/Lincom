from rest_framework import serializers
from .models import Notification, NotificationPreference

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'notification_type', 'title', 'message',
                 'priority', 'is_read', 'created_at', 'read_at']
        read_only_fields = ['created_at']

class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = ['id', 'user', 'email_notifications', 'course_updates',
                 'forum_activity', 'enrollment_updates', 'mentorship_updates',
                 'general_notifications']
        read_only_fields = ['user']
