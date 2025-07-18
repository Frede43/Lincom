from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StartupViewSet, ProjectViewSet, MilestoneViewSet, ResourceViewSet

router = DefaultRouter()
router.register(r'startups', StartupViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'milestones', MilestoneViewSet)
router.register(r'resources', ResourceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
