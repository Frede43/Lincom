from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import NotificationViewSet

app_name = 'notifs'

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = []

urlpatterns += router.urls
