from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .api import (
    ResourceCategoryViewSet, ResourceViewSet, ResourceTagViewSet,
    ResourceBookmarkViewSet, ResourceCommentViewSet
)

app_name = 'resources'

router = DefaultRouter()
router.register(r'categories', ResourceCategoryViewSet, basename='category')
router.register(r'resources', ResourceViewSet, basename='resource')
router.register(r'tags', ResourceTagViewSet, basename='tag')
router.register(r'bookmarks', ResourceBookmarkViewSet, basename='bookmark')

# Nested router for resource comments
resource_router = routers.NestedDefaultRouter(router, r'resources', lookup='resource')
resource_router.register(r'comments', ResourceCommentViewSet, basename='resource-comment')

urlpatterns = []

urlpatterns += router.urls + resource_router.urls
