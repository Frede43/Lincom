from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DashboardViewSet,
    UserStatsViewSet,
    ActivityFeedViewSet,
    NotificationViewSet,
    ProgressViewSet,
    WidgetViewSet,
    QuickActionViewSet,
    DashboardPreferenceViewSet
)

app_name = 'dashboard'

# Créer un routeur pour les vues du tableau de bord
router = DefaultRouter()

# Vue d'ensemble et widgets
router.register(r'overview', DashboardViewSet, basename='dashboard-overview')
router.register(r'widgets', WidgetViewSet, basename='dashboard-widgets')

# Données utilisateur
router.register(r'stats', UserStatsViewSet, basename='dashboard-stats')
router.register(r'activities', ActivityFeedViewSet, basename='dashboard-activities')
router.register(r'progress', ProgressViewSet, basename='dashboard-progress')

# Notifications et actions rapides
router.register(r'notifications', NotificationViewSet, basename='dashboard-notifications')
router.register(r'quick-actions', QuickActionViewSet, basename='dashboard-quick-actions')

# Préférences
router.register(r'preferences', DashboardPreferenceViewSet, basename='dashboard-preferences')

urlpatterns = [
    path('', include(router.urls)),
]
