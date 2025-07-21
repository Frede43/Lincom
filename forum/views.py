from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from django.db.models import F
from .models import Category, Topic, Post, Comment, Attachment
from .serializers import (
    CategorySerializer, TopicSerializer,
    PostSerializer, CommentSerializer, AttachmentSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]  # Temporaire pour tests

class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [AllowAny]  # Temporaire pour tests

    def get_queryset(self):
        queryset = Topic.objects.all()
        category = self.request.query_params.get('category', None)
        if category is not None:
            queryset = queryset.filter(category_id=category)
        return queryset.order_by('-is_pinned', '-last_activity')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'])
    def increment_view(self, request, pk=None):
        topic = self.get_object()
        topic.views_count = F('views_count') + 1
        topic.save()
        return Response({'status': 'view count incremented'})

    @action(detail=True, methods=['post'])
    def toggle_lock(self, request, pk=None):
        topic = self.get_object()
        if request.user != topic.author and not request.user.is_staff:
            return Response(
                {'error': 'Only the topic author or staff can lock/unlock topics'},
                status=status.HTTP_403_FORBIDDEN
            )
        topic.is_locked = not topic.is_locked
        topic.save()
        return Response({'status': 'topic lock toggled', 'is_locked': topic.is_locked})

    @action(detail=True, methods=['post'])
    def toggle_pin(self, request, pk=None):
        if not request.user.is_staff:
            return Response(
                {'error': 'Only staff members can pin/unpin topics'},
                status=status.HTTP_403_FORBIDDEN
            )
        topic = self.get_object()
        topic.is_pinned = not topic.is_pinned
        topic.save()
        return Response({'status': 'topic pin toggled', 'is_pinned': topic.is_pinned})

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [AllowAny]  # Temporaire pour tests

    def get_queryset(self):
        queryset = Post.objects.filter(parent=None)  # Only get top-level posts
        topic_id = self.kwargs.get('topic_id')
        if topic_id is not None:
            queryset = queryset.filter(topic_id=topic_id)
        return queryset.order_by('created_at')

    def perform_create(self, serializer):
        topic_id = self.kwargs.get('topic_id')
        if topic_id:
            topic = Topic.objects.get(id=topic_id)
            if topic.is_locked:
                raise PermissionDenied('This topic is locked')
            serializer.save(author=self.request.user, topic_id=topic_id)
            topic.last_activity = timezone.now()
            topic.save()
        else:
            serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_as_solution(self, request, pk=None, topic_id=None):
        post = self.get_object()
        if request.user != post.topic.author:
            return Response(
                {'error': 'Only the topic author can mark a post as solution'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Remove solution mark from other posts in this topic
        Post.objects.filter(topic=post.topic, is_solution=True).update(is_solution=False)
        
        post.is_solution = True
        post.save()
        return Response({'status': 'post marked as solution'})

    @action(detail=True, methods=['post'])
    def toggle_like(self, request, pk=None, topic_id=None):
        post = self.get_object()
        if request.user in post.likes.all():
            post.likes.remove(request.user)
        else:
            post.likes.add(request.user)
        return Response({
            'status': 'like toggled',
            'likes_count': post.likes.count()
        })

    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None, topic_id=None):
        parent_post = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                author=request.user,
                topic=parent_post.topic,
                parent=parent_post
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        if post_id is not None:
            return Comment.objects.filter(post_id=post_id).order_by('created_at')
        return Comment.objects.none()

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_id')
        if post_id:
            serializer.save(author=self.request.user, post_id=post_id)

    @action(detail=True, methods=['post'])
    def toggle_like(self, request, pk=None, post_id=None):
        comment = self.get_object()
        if request.user in comment.likes.all():
            comment.likes.remove(request.user)
        else:
            comment.likes.add(request.user)
        return Response({
            'status': 'like toggled',
            'likes_count': comment.likes.count()
        })

class AttachmentViewSet(viewsets.ModelViewSet):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        file_obj = self.request.FILES.get('file')
        if not file_obj:
            raise serializers.ValidationError('No file was submitted')

        serializer.save(
            uploader=self.request.user,
            file_size=file_obj.size,
            content_type=file_obj.content_type or 'application/octet-stream'
        )
