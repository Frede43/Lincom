from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.db.models import Avg, Count
from .models import (
    UserActivity, CourseAnalytics, TrainingAnalytics,
    StartupMetrics, PlatformStatistics
)
from .serializers import (
    UserActivitySerializer, CourseAnalyticsSerializer,
    TrainingAnalyticsSerializer, StartupMetricsSerializer,
    PlatformStatisticsSerializer
)

class AnalyticsPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.is_staff or request.user.is_superuser

class UserActivityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserActivitySerializer
    permission_classes = [AnalyticsPermission]
    
    def get_queryset(self):
        queryset = UserActivity.objects.all().order_by('-timestamp')
        days = self.request.query_params.get('days', None)
        user_id = self.request.query_params.get('user_id', None)
        activity_type = self.request.query_params.get('activity_type', None)
        
        if days:
            start_date = timezone.now() - timedelta(days=int(days))
            queryset = queryset.filter(timestamp__gte=start_date)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if activity_type:
            queryset = queryset.filter(activity_type=activity_type)
            
        return queryset
    
    @action(detail=False, methods=['get'])
    def activity_summary(self, request):
        days = int(request.query_params.get('days', 7))
        start_date = timezone.now() - timedelta(days=days)
        
        activities = UserActivity.objects.filter(timestamp__gte=start_date)
        summary = activities.values('activity_type').annotate(
            count=Count('id'),
            avg_per_day=Count('id') / days
        )
        
        return Response(summary)

class CourseAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CourseAnalyticsSerializer
    permission_classes = [AnalyticsPermission]
    queryset = CourseAnalytics.objects.all()
    
    @action(detail=False, methods=['get'])
    def top_courses(self, request):
        limit = int(request.query_params.get('limit', 5))
        top_courses = self.get_queryset().order_by('-total_students')[:limit]
        serializer = self.get_serializer(top_courses, many=True)
        return Response(serializer.data)

class TrainingAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TrainingAnalyticsSerializer
    permission_classes = [AnalyticsPermission]
    queryset = TrainingAnalytics.objects.all()
    
    @action(detail=False, methods=['get'])
    def performance_overview(self, request):
        overview = self.get_queryset().aggregate(
            avg_attendance=Avg('attendance_rate'),
            avg_satisfaction=Avg('satisfaction_score')
        )
        return Response(overview)

class StartupMetricsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StartupMetricsSerializer
    permission_classes = [AnalyticsPermission]
    queryset = StartupMetrics.objects.all()
    
    @action(detail=False, methods=['get'])
    def top_performers(self, request):
        limit = int(request.query_params.get('limit', 5))
        top_startups = self.get_queryset().order_by('-active_projects')[:limit]
        serializer = self.get_serializer(top_startups, many=True)
        return Response(serializer.data)

class PlatformStatisticsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PlatformStatisticsSerializer
    permission_classes = [AnalyticsPermission]
    queryset = PlatformStatistics.objects.all()
    
    @action(detail=False, methods=['get'])
    def latest_stats(self, request):
        latest = self.get_queryset().order_by('-date').first()
        if latest:
            serializer = self.get_serializer(latest)
            return Response(serializer.data)
        return Response({}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def growth_trends(self, request):
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now().date() - timedelta(days=days)
        
        stats = self.get_queryset().filter(
            date__gte=start_date
        ).order_by('date')
        
        trends = {
            'dates': [],
            'users': [],
            'startups': [],
            'projects': [],
            'courses': [],
            'trainings': []
        }
        
        for stat in stats:
            trends['dates'].append(stat.date.strftime('%Y-%m-%d'))
            trends['users'].append(stat.total_users)
            trends['startups'].append(stat.total_startups)
            trends['projects'].append(stat.total_projects)
            trends['courses'].append(stat.total_courses)
            trends['trainings'].append(stat.total_trainings)
        
        return Response(trends)
