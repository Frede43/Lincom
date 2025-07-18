from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from .models import (
    ResourceCategory, Resource, ResourceTag,
    ResourceBookmark, ResourceComment
)
from .serializers import (
    ResourceCategorySerializer, ResourceSerializer, ResourceTagSerializer,
    ResourceBookmarkSerializer, ResourceCommentSerializer
)

class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user

class ResourceCategoryViewSet(viewsets.ModelViewSet):
    queryset = ResourceCategory.objects.filter(parent=None)
    serializer_class = ResourceCategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()

class ResourceViewSet(viewsets.ModelViewSet):
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'tags__name']
    ordering_fields = ['created_at', 'download_count']
    
    def get_queryset(self):
        queryset = Resource.objects.select_related('category', 'author').prefetch_related('tags')
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_public=True)
        
        category = self.request.query_params.get('category', None)
        resource_type = self.request.query_params.get('type', None)
        tag = self.request.query_params.get('tag', None)
        
        if category:
            queryset = queryset.filter(category__slug=category)
        if resource_type:
            queryset = queryset.filter(resource_type=resource_type)
        if tag:
            queryset = queryset.filter(tags__slug=tag)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def download(self, request, pk=None):
        resource = self.get_object()
        resource.download_count = F('download_count') + 1
        resource.save()
        return Response({'status': 'download counted'})
    
    @action(detail=True, methods=['post'])
    def bookmark(self, request, pk=None):
        resource = self.get_object()
        bookmark, created = ResourceBookmark.objects.get_or_create(
            resource=resource,
            user=request.user
        )
        if not created:
            bookmark.delete()
            return Response({'status': 'bookmark removed'})
        return Response({'status': 'bookmark added'})

class ResourceTagViewSet(viewsets.ModelViewSet):
    queryset = ResourceTag.objects.all()
    serializer_class = ResourceTagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()

class ResourceBookmarkViewSet(viewsets.ModelViewSet):
    serializer_class = ResourceBookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ResourceBookmark.objects.filter(user=self.request.user)

class ResourceCommentViewSet(viewsets.ModelViewSet):
    serializer_class = ResourceCommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        return ResourceComment.objects.filter(
            resource_id=self.kwargs['resource_pk'],
            parent=None
        ).prefetch_related('replies')
    
    def perform_create(self, serializer):
        serializer.save(
            resource_id=self.kwargs['resource_pk'],
            user=self.request.user
        )
