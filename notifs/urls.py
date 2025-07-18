from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.NotificationViewSet, basename='notification')

urlpatterns = router.urls + [
    path('mark_all_as_read/', views.NotificationViewSet.as_view({'post': 'mark_all_as_read'}), name='mark-all-as-read'),
    path('<int:pk>/mark_as_read/', views.NotificationViewSet.as_view({'post': 'mark_as_read'}), name='mark-as-read'),
    path('preferences/', views.NotificationPreferenceViewSet.as_view({'get': 'retrieve', 'put': 'update'}), name='notification-preferences'),
]
