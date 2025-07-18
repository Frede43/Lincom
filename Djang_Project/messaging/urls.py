from django.urls import path
from rest_framework.routers import DefaultRouter
from .api import ConversationViewSet, WorkGroupViewSet

app_name = 'messaging'

router = DefaultRouter()
router.register(r'conversations', ConversationViewSet, basename='conversation')
router.register(r'workgroups', WorkGroupViewSet, basename='workgroup')

urlpatterns = []

urlpatterns += router.urls
