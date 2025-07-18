from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api, views

router = DefaultRouter()
router.register(r'project-calls', api.ProjectCallViewSet, basename='project-call')
router.register(r'competitions', api.CompetitionViewSet, basename='competition')

app_name = 'organizations'

urlpatterns = [
    path('api/', include(router.urls)),
    
    # Project Call URLs
    path('project-calls/', views.project_call_list, name='project_call_list'),
    path('project-calls/create/', views.project_call_create, name='project_call_create'),
    path('project-calls/<int:pk>/', views.project_call_detail, name='project_call_detail'),
    path('project-calls/<int:pk>/update/', views.project_call_update, name='project_call_update'),
    path('project-calls/<int:project_call_pk>/submit/', views.submit_project, name='submit_project'),
    path('submissions/<int:submission_pk>/review/', views.review_submission, name='review_submission'),
    
    # Competition URLs
    path('competitions/', views.competition_list, name='competition_list'),
    path('competitions/create/', views.competition_create, name='competition_create'),
    path('competitions/<int:pk>/', views.competition_detail, name='competition_detail'),
    path('competitions/<int:competition_pk>/register/', views.register_competition, name='register_competition'),
    
    # Dashboard URL
    path('dashboard/', views.organization_dashboard, name='dashboard'),
]
