from django.urls import path, include
from rest_framework_nested import routers
from . import views

app_name = 'courses'

# Configuration des routeurs pour l'API
router = routers.DefaultRouter()
router.register(r'courses', views.CourseViewSet, basename='course')
router.register(r'enrollments', views.EnrollmentViewSet, basename='enrollment')

# Routeur imbriqué pour les modules (nested sous les cours)
courses_router = routers.NestedDefaultRouter(router, r'courses', lookup='course')
courses_router.register(r'modules', views.ModuleViewSet, basename='course-module')
courses_router.register(r'assignments', views.AssignmentViewSet, basename='course-assignment')

# Routeur imbriqué pour les contenus (nested sous les modules)
modules_router = routers.NestedDefaultRouter(courses_router, r'modules', lookup='module')
modules_router.register(r'contents', views.ContentViewSet, basename='module-content')

urlpatterns = [
    # URLs API
    path('api/', include(router.urls)),
    path('api/', include(courses_router.urls)),
    path('api/', include(modules_router.urls)),
    
    # URLs interface utilisateur - Cours
    path('', views.CourseListView.as_view(), name='course_list'),
    path('create/', views.CourseCreateView.as_view(), name='course_create'),
    path('<slug:slug>/', views.CourseDetailView.as_view(), name='course_detail'),
    path('<slug:slug>/enroll/', views.enroll_course, name='course_enroll'),
    path('<slug:slug>/learn/', views.course_learn, name='course_learn'),
    
    # URLs interface utilisateur - Modules et Contenus
    path('<slug:slug>/modules/create/', views.ModuleCreateView.as_view(), name='module_create'),
    path('modules/<int:pk>/update/', views.ModuleUpdateView.as_view(), name='module_update'),
    path('modules/<int:pk>/delete/', views.ModuleDeleteView.as_view(), name='module_delete'),
    path('modules/<int:module_id>/content/create/', views.ContentCreateView.as_view(), name='content_create'),
    path('content/<int:pk>/update/', views.ContentUpdateView.as_view(), name='content_update'),
    path('content/<int:pk>/delete/', views.ContentDeleteView.as_view(), name='content_delete'),
    
    # URLs interface utilisateur - Devoirs et Soumissions
    path('content/<int:content_id>/submit/', views.submit_assignment, name='submit_assignment'),
    path('submissions/<int:submission_id>/grade/', views.grade_submission, name='grade_submission'),
    path('<slug:course_slug>/submissions/', views.SubmissionListView.as_view(), name='submission_list'),
    
    # URLs interface utilisateur - Progression et Statistiques
    path('<slug:slug>/progress/', views.CourseProgressView.as_view(), name='course_progress'),
    path('<slug:slug>/analytics/', views.CourseAnalyticsView.as_view(), name='course_analytics'),
]
