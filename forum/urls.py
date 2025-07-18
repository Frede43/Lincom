from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'topics', views.TopicViewSet)
router.register(r'posts', views.PostViewSet)
router.register(r'attachments', views.AttachmentViewSet)

urlpatterns = router.urls + [
    # Topics
    path('topics/<int:pk>/toggle_lock/', views.TopicViewSet.as_view({'post': 'toggle_lock'}), name='toggle-topic-lock'),
    path('topics/<int:pk>/toggle_pin/', views.TopicViewSet.as_view({'post': 'toggle_pin'}), name='toggle-topic-pin'),
    path('topics/<int:pk>/increment_view/', views.TopicViewSet.as_view({'post': 'increment_view'}), name='increment-topic-view'),
    
    # Posts within topics
    path('topics/<int:topic_id>/posts/', views.PostViewSet.as_view({'get': 'list', 'post': 'create'}), name='topic-posts'),
    path('topics/<int:topic_id>/posts/<int:pk>/', views.PostViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='topic-post-detail'),
    path('topics/<int:topic_id>/posts/<int:pk>/mark_as_solution/', views.PostViewSet.as_view({'post': 'mark_as_solution'}), name='mark-post-as-solution'),
    path('posts/<int:pk>/toggle_like/', views.PostViewSet.as_view({'post': 'toggle_like'}), name='toggle-post-like'),
    path('posts/<int:pk>/reply/', views.PostViewSet.as_view({'post': 'reply'}), name='reply-to-post'),
    
    # Comments on posts
    path('posts/<int:post_id>/comments/', views.CommentViewSet.as_view({'get': 'list', 'post': 'create'}), name='post-comments'),
    path('posts/<int:post_id>/comments/<int:pk>/', views.CommentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='post-comment-detail'),
    path('posts/<int:post_id>/comments/<int:pk>/toggle_like/', views.CommentViewSet.as_view({'post': 'toggle_like'}), name='toggle-comment-like'),
]
