from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet, ModuleViewSet, LessonViewSet, QuizViewSet
)
from .media_views import MediaResourceViewSet, MediaCollectionViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'modules', ModuleViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'quizzes', QuizViewSet)
router.register(r'media', MediaResourceViewSet)
router.register(r'collections', MediaCollectionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
