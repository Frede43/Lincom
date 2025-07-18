"""
URL configuration for comlab project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import APIRoot
from .api_settings import schema_view, swagger_view, redoc_view

# API URLs
api_urlpatterns = [
    path('users/', include('users.urls')),
    path('education/', include('education.urls')),
    path('entrepreneurship/', include('entrepreneurship.urls')),
    path('organizations/', include('organizations.urls')),
    path('mentorship/', include('mentorship.urls')),
    path('notifications/', include('notifs.urls')),
    path('forum/', include('forum.urls')),
    path('dashboard/', include('dashboard.urls', namespace='dashboard')),  
    path('search/', include('search.urls')),
    path('lab-equipment/', include('lab_equipment.urls')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/', include('rest_framework.urls')),
    path('', APIRoot.as_view(), name='api-root'),
]

# Documentation API URLs
api_doc_urlpatterns = [
    path('schema/', schema_view, name='schema'),
    path('swagger/', swagger_view, name='swagger-ui'),
    path('redoc/', redoc_view, name='redoc'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api_urlpatterns)),
    path('docs/', include(api_doc_urlpatterns)),
    path('', TemplateView.as_view(template_name='index.html'), name='index'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
