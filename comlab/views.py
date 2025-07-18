from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from rest_framework import permissions

class APIRoot(APIView):
    """
    ComLab API Root - Points d'accès principaux
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        base_url = request.build_absolute_uri('/api/')
        
        return Response({
            # Users API
            'users': {
                'description': 'Gestion des utilisateurs',
                'endpoints': {
                    'list': f'{base_url}users/',
                    'profile': f'{base_url}users/profile/',
                    'register': f'{base_url}users/register/',
                }
            },
            
            # Organizations API
            'organizations': {
                'description': 'Gestion des organisations et compétitions',
                'endpoints': {
                    'organizations': f'{base_url}organizations/',
                    'competitions': f'{base_url}organizations/competitions/',
                    'submissions': f'{base_url}organizations/submissions/',
                }
            },
            
            # Mentorship API
            'mentorship': {
                'description': 'Programme de mentorat',
                'endpoints': {
                    'programs': f'{base_url}mentorship/programs/',
                    'sessions': f'{base_url}mentorship/sessions/',
                    'matching': f'{base_url}mentorship/matching/',
                }
            },
            
            # Dashboard API
            'dashboard': {
                'description': 'Tableau de bord personnalisé',
                'endpoints': {
                    'overview': {
                        'base': f'{base_url}dashboard/overview/',
                        'widget_data': f'{base_url}dashboard/overview/widget_data/',
                    },
                    'stats': f'{base_url}dashboard/stats/',
                    'activities': f'{base_url}dashboard/activities/',
                    'progress': f'{base_url}dashboard/progress/',
                    'notifications': {
                        'list': f'{base_url}dashboard/notifications/',
                        'mark_all_read': f'{base_url}dashboard/notifications/mark_all_as_read/',
                        'detail': f'{base_url}dashboard/notifications/{{id}}/',
                        'mark_read': f'{base_url}dashboard/notifications/{{id}}/mark_as_read/',
                    },
                    'widgets': {
                        'list': f'{base_url}dashboard/widgets/',
                        'detail': f'{base_url}dashboard/widgets/{{id}}/',
                        'data': f'{base_url}dashboard/widgets/{{id}}/data/',
                    },
                    'quick-actions': {
                        'list': f'{base_url}dashboard/quick-actions/',
                        'detail': f'{base_url}dashboard/quick-actions/{{id}}/',
                    },
                    'preferences': {
                        'list': f'{base_url}dashboard/preferences/',
                        'detail': f'{base_url}dashboard/preferences/{{id}}/',
                        'toggle_widget': f'{base_url}dashboard/preferences/{{id}}/toggle_widget/',
                        'update_layout': f'{base_url}dashboard/preferences/{{id}}/update_layout/',
                    },
                }
            },
            
            # Search API
            'search': {
                'description': 'Recherche globale',
                'endpoints': {
                    'search': f'{base_url}search/',
                    'suggestions': f'{base_url}search/suggestions/',
                    'filters': f'{base_url}search/filters/',
                }
            },
            
            # Authentication API
            'authentication': {
                'description': 'Authentification et gestion des tokens',
                'endpoints': {
                    'login': f'{base_url}token/',
                    'refresh': f'{base_url}token/refresh/',
                }
            },
            
            # Documentation API
            'documentation': {
                'description': 'Documentation de l\'API',
                'endpoints': {
                    'swagger': f'{request.build_absolute_uri("/docs/swagger/")}',
                    'redoc': f'{request.build_absolute_uri("/docs/redoc/")}',
                    'openapi': f'{request.build_absolute_uri("/docs/swagger.json")}',
                }
            }
        })
