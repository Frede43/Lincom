from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Conversation, Message, WorkGroup
from .serializers import (
    ConversationSerializer, MessageSerializer, WorkGroupSerializer
)

class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        conversation = self.get_object()
        content = request.data.get('content')
        
        if not content:
            return Response({'detail': 'Content is required'}, status=400)
            
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=content
        )
        
        serializer = MessageSerializer(message)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        conversation = self.get_object()
        Message.objects.filter(
            conversation=conversation
        ).exclude(
            sender=request.user
        ).update(read=True)
        return Response({'detail': 'Messages marked as read'})

class WorkGroupViewSet(viewsets.ModelViewSet):
    queryset = WorkGroup.objects.all()
    serializer_class = WorkGroupSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return WorkGroup.objects.filter(members=self.request.user)

    def perform_create(self, serializer):
        workgroup = serializer.save(creator=self.request.user)
        workgroup.members.add(self.request.user)

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        workgroup = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response({'detail': 'User ID is required'}, status=400)
            
        try:
            user = User.objects.get(id=user_id)
            workgroup.members.add(user)
            return Response({'detail': 'Member added successfully'})
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=404)

    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        workgroup = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response({'detail': 'User ID is required'}, status=400)
            
        try:
            user = User.objects.get(id=user_id)
            if user == workgroup.creator:
                return Response({'detail': 'Cannot remove creator'}, status=400)
            workgroup.members.remove(user)
            return Response({'detail': 'Member removed successfully'})
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=404)
