from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MentorshipProgramViewSet, MentorshipSessionViewSet,
    ResourceViewSet, ActionItemViewSet, FeedbackViewSet,
    MentorMatchingViewSet
)

router = DefaultRouter()
router.register(r'programs', MentorshipProgramViewSet)
router.register(r'sessions', MentorshipSessionViewSet)
router.register(r'resources', ResourceViewSet)
router.register(r'action-items', ActionItemViewSet)
router.register(r'feedback', FeedbackViewSet)
router.register(r'matching', MentorMatchingViewSet, basename='mentor-matching')

urlpatterns = [
    path('', include(router.urls)),
]
