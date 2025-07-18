from rest_framework import serializers
from .models import Notification
from django.contrib.auth import get_user_model

User = get_user_model()

class NotificationSerializer(serializers.ModelSerializer):
    sender_details = serializers.SerializerMethodField()
    recipient_details = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'sender', 'sender_details', 'recipient', 
                 'recipient_details', 'title', 'message', 'notification_type',
                 'read', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_sender_details(self, obj):
        if obj.sender:
            return {
                'id': obj.sender.id,
                'full_name': f"{obj.sender.first_name} {obj.sender.last_name}",
                'email': obj.sender.email
            }
        return None

    def get_recipient_details(self, obj):
        return {
            'id': obj.recipient.id,
            'full_name': f"{obj.recipient.first_name} {obj.recipient.last_name}",
            'email': obj.recipient.email
        }
