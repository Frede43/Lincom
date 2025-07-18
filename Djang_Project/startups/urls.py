from django.urls import path
from rest_framework.routers import DefaultRouter
from .api import (
    StartupViewSet, ProjectViewSet, IndustryViewSet, StageViewSet,
    TeamMemberViewSet, StartupMentorViewSet, MilestoneViewSet,
    InvestmentViewSet, JoinRequestViewSet, MentorRequestViewSet,
    ProjectUpdateViewSet
)

app_name = 'startups'

router = DefaultRouter()
router.register(r'startups', StartupViewSet, basename='startup')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'industries', IndustryViewSet, basename='industry')
router.register(r'stages', StageViewSet, basename='stage')
router.register(r'team-members', TeamMemberViewSet, basename='team-member')
router.register(r'startup-mentors', StartupMentorViewSet, basename='startup-mentor')
router.register(r'milestones', MilestoneViewSet, basename='milestone')
router.register(r'investments', InvestmentViewSet, basename='investment')
router.register(r'join-requests', JoinRequestViewSet, basename='join-request')
router.register(r'mentor-requests', MentorRequestViewSet, basename='mentor-request')
router.register(r'project-updates', ProjectUpdateViewSet, basename='project-update')

urlpatterns = router.urls
