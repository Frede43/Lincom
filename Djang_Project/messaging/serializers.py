from rest_framework import serializers
from .models import Conversation, Message, WorkGroup
from django.contrib.auth import get_user_model

User = get_user_model()

class MessageSerializer(serializers.ModelSerializer):
    sender_details = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'sender_details', 'content',
                 'created_at', 'read']
        read_only_fields = ['created_at']

    def get_sender_details(self, obj):
        return {
            'id': obj.sender.id,
            'full_name': f"{obj.sender.first_name} {obj.sender.last_name}",
            'email': obj.sender.email
        }

class ConversationSerializer(serializers.ModelSerializer):
    participants_details = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'participants_details', 'created_at',
                 'updated_at', 'last_message', 'unread_count']
        read_only_fields = ['created_at', 'updated_at']

    def get_participants_details(self, obj):
        return [{
            'id': user.id,
            'full_name': f"{user.first_name} {user.last_name}",
            'email': user.email
        } for user in obj.participants.all()]

    def get_last_message(self, obj):
        last_msg = obj.messages.order_by('-created_at').first()
        if last_msg:
            return MessageSerializer(last_msg).data
        return None

    def get_unread_count(self, obj):
        user = self.context['request'].user
        return obj.messages.filter(read=False).exclude(sender=user).count()

class WorkGroupSerializer(serializers.ModelSerializer):
    members_details = serializers.SerializerMethodField()
    creator_details = serializers.SerializerMethodField()

    class Meta:
        model = WorkGroup
        fields = ['id', 'name', 'description', 'creator', 'creator_details',
                 'members', 'members_details', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_members_details(self, obj):
        return [{
            'id': user.id,
            'full_name': f"{user.first_name} {user.last_name}",
            'email': user.email
        } for user in obj.members.all()]

    def get_creator_details(self, obj):
        return {
            'id': obj.creator.id,
            'full_name': f"{obj.creator.first_name} {obj.creator.last_name}",
            'email': obj.creator.email
        }
