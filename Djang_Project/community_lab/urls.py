from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from rest_framework.routers import DefaultRouter
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.reverse import reverse

class APIRoot(APIView):
    def get(self, request, format=None):
        return Response({
            'accounts': reverse('accounts:api-root', request=request),
            'messaging': reverse('messaging:api-root', request=request),
            'learning': reverse('learning:api-root', request=request),
            'startups': reverse('startups:api-root', request=request),
            'notifs': reverse('notifs:api-root', request=request),
            'analytics': reverse('analytics:api-root', request=request),
            'events': reverse('events:api-root', request=request),
            'resources': reverse('resources:api-root', request=request),
        })

# Define URL patterns
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include([
        path('', APIRoot.as_view(), name='api-root'),
        path('accounts/', include('accounts.urls')),
        path('messaging/', include('messaging.urls')),
        path('learning/', include('learning.urls')),
        path('startups/', include('startups.urls')),
        path('notifs/', include('notifs.urls')),
        path('analytics/', include('analytics.urls')),
        path('events/', include('events.urls')),
        path('resources/', include('resources.urls')),
    ])),
    path('', RedirectView.as_view(url='/api/v1/')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
