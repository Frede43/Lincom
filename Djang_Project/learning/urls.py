from django.urls import path
from rest_framework.routers import DefaultRouter
from .api import (
    CourseViewSet, TrainingViewSet, CategoryViewSet,
    CourseEnrollmentViewSet, TrainingRegistrationViewSet
)

app_name = 'learning'

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'trainings', TrainingViewSet, basename='training')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'enrollments', CourseEnrollmentViewSet, basename='enrollment')
router.register(r'training-registrations', TrainingRegistrationViewSet, basename='training-registration')

urlpatterns = []

urlpatterns += router.urls
