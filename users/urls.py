from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, MentorViewSet,
    EntrepreneurViewSet, StakeholderViewSet,
    RegisterView, UserProfileView
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'mentors', MentorViewSet)
router.register(r'entrepreneurs', EntrepreneurViewSet)
router.register(r'stakeholders', StakeholderViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('', include(router.urls)),
]
