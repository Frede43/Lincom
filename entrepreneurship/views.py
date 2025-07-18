from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.utils import timezone
from .models import Startup, Project, Milestone, Resource
from .serializers import (
    StartupSerializer, ProjectSerializer,
    MilestoneSerializer, ResourceSerializer
)
from .permissions import (
    IsStartupOwnerOrReadOnly, IsProjectOwnerOrMentor,
    IsMilestoneOwnerOrMentor, IsResourceOwnerOrMentor
)
from .filters import (
    StartupFilter, ProjectFilter,
    MilestoneFilter, ResourceFilter
)
from .utils import (
    get_startup_stats, get_project_stats,
    get_milestone_stats, get_resource_stats,
    get_startup_performance
)

class StartupViewSet(viewsets.ModelViewSet):
    queryset = Startup.objects.select_related('founder')
    serializer_class = StartupSerializer
    permission_classes = [permissions.IsAuthenticated, IsStartupOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = StartupFilter
    search_fields = ['name', 'description', 'industry']
    ordering_fields = ['name', 'founding_date', 'total_funding']
    ordering = ['-founding_date']

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == 'list':
            return queryset.prefetch_related('mentors', 'projects')
        return queryset

    def perform_create(self, serializer):
        serializer.save(founder=self.request.user.entrepreneur)

    @action(detail=True, methods=['post'])
    def add_mentor(self, request, pk=None):
        startup = self.get_object()
        mentor_id = request.data.get('mentor_id')
        if mentor_id and not startup.mentors.filter(id=mentor_id).exists():
            startup.mentors.add(mentor_id)
        serializer = self.get_serializer(startup)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get startup statistics."""
        if not request.user.is_staff and not hasattr(request.user, 'mentor'):
            return Response(
                {'error': 'Only staff members and mentors can access statistics'},
                status=status.HTTP_403_FORBIDDEN
            )
        stats = get_startup_stats()
        return Response(stats)

    @action(detail=True, methods=['get'])
    def performance(self, request, pk=None):
        """Get performance statistics for this startup."""
        startup = self.get_object()
        if not request.user.is_staff and not hasattr(request.user, 'mentor'):
            if not hasattr(request.user, 'entrepreneur') or request.user.entrepreneur.startup != startup:
                return Response(
                    {'error': 'Only staff members, mentors, or the startup owner can access these statistics'},
                    status=status.HTTP_403_FORBIDDEN
                )
        stats = get_startup_performance(startup)
        return Response(stats)

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.select_related('startup', 'startup__founder')
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsProjectOwnerOrMentor]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProjectFilter
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'start_date', 'end_date', 'status']
    ordering = ['-start_date']

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == 'list':
            return queryset.prefetch_related('milestones')
        return queryset

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get project statistics."""
        if not request.user.is_staff and not hasattr(request.user, 'mentor'):
            return Response(
                {'error': 'Only staff members and mentors can access statistics'},
                status=status.HTTP_403_FORBIDDEN
            )
        stats = get_project_stats()
        return Response(stats)

class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = Milestone.objects.select_related('project', 'project__startup')
    serializer_class = MilestoneSerializer
    permission_classes = [permissions.IsAuthenticated, IsMilestoneOwnerOrMentor]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = MilestoneFilter
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'due_date', 'completion_date', 'status']
    ordering = ['due_date']

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == 'list':
            return queryset.select_related('assignee')
        return queryset

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        milestone = self.get_object()
        milestone.completed = True
        milestone.completed_at = timezone.now()
        milestone.save()
        serializer = self.get_serializer(milestone)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get milestone statistics."""
        if not request.user.is_staff and not hasattr(request.user, 'mentor'):
            return Response(
                {'error': 'Only staff members and mentors can access statistics'},
                status=status.HTTP_403_FORBIDDEN
            )
        stats = get_milestone_stats()
        return Response(stats)

class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.select_related('startup', 'owner')
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated, IsResourceOwnerOrMentor]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ResourceFilter
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'resource_type', 'visibility']
    ordering = ['title']

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == 'list':
            return queryset.select_related('startup')
        return queryset

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get resource statistics."""
        if not request.user.is_staff and not hasattr(request.user, 'mentor'):
            return Response(
                {'error': 'Only staff members and mentors can access statistics'},
                status=status.HTTP_403_FORBIDDEN
            )
        stats = get_resource_stats()
        return Response(stats)
