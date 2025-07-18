from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .api import (
    EventViewSet, EventRegistrationViewSet,
    EventSpeakerViewSet, EventFeedbackViewSet
)

app_name = 'events'

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
router.register(r'registrations', EventRegistrationViewSet, basename='registration')
router.register(r'speakers', EventSpeakerViewSet, basename='speaker')

# Nested router for event feedback
event_router = routers.NestedDefaultRouter(router, r'events', lookup='event')
event_router.register(r'feedback', EventFeedbackViewSet, basename='event-feedback')

urlpatterns = []

urlpatterns += router.urls + event_router.urls
