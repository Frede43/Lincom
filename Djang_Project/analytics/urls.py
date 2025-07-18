from django.urls import path
from rest_framework.routers import DefaultRouter
from .api import (
    UserActivityViewSet, CourseAnalyticsViewSet,
    TrainingAnalyticsViewSet, StartupMetricsViewSet,
    PlatformStatisticsViewSet
)

app_name = 'analytics'

router = DefaultRouter()
router.register(r'user-activities', UserActivityViewSet, basename='user-activity')
router.register(r'course-analytics', CourseAnalyticsViewSet, basename='course-analytics')
router.register(r'training-analytics', TrainingAnalyticsViewSet, basename='training-analytics')
router.register(r'startup-metrics', StartupMetricsViewSet, basename='startup-metrics')
router.register(r'platform-statistics', PlatformStatisticsViewSet, basename='platform-statistics')

urlpatterns = []

urlpatterns += router.urls
