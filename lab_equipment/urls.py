from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EquipmentCategoryViewSet, EquipmentViewSet, EquipmentReservationViewSet,
    MaintenanceLogViewSet, UserEquipmentCertificationViewSet, EquipmentUsageLogViewSet
)

router = DefaultRouter()
router.register(r'categories', EquipmentCategoryViewSet, basename='equipment-category')
router.register(r'equipment', EquipmentViewSet, basename='equipment')
router.register(r'reservations', EquipmentReservationViewSet, basename='equipment-reservation')
router.register(r'maintenance', MaintenanceLogViewSet, basename='equipment-maintenance')
router.register(r'certifications', UserEquipmentCertificationViewSet, basename='equipment-certification')
router.register(r'usage-logs', EquipmentUsageLogViewSet, basename='equipment-usage')

urlpatterns = [
    path('', include(router.urls)),
]
