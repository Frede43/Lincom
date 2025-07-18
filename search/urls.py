from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SearchViewSet, SearchFilterViewSet

router = DefaultRouter()
router.register(r'', SearchViewSet, basename='search')
router.register(r'filters', SearchFilterViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('query/', SearchViewSet.as_view({'get': 'search'}), name='search-query'),
]
