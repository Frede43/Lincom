from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OrganizationViewSet, CallForProjectViewSet,
    CompetitionViewSet, SubmissionViewSet
)

router = DefaultRouter()
router.register(r'companies', OrganizationViewSet, basename='company')  
router.register(r'calls', CallForProjectViewSet)
router.register(r'competitions', CompetitionViewSet)
router.register(r'submissions', SubmissionViewSet, basename='submission')

urlpatterns = [
    path('', include(router.urls)),
]
