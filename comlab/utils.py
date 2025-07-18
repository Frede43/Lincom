from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from rest_framework.exceptions import (
    AuthenticationFailed,
    NotAuthenticated,
    PermissionDenied,
    ValidationError,
)

def custom_exception_handler(exc, context):
    """
    Gestionnaire d'exceptions personnalisé pour l'API
    """
    response = exception_handler(exc, context)

    if response is None:
        if isinstance(exc, Http404):
            response = Response(
                {
                    'status': 'error',
                    'message': 'Resource not found',
                    'details': str(exc)
                },
                status=status.HTTP_404_NOT_FOUND
            )
        else:
            response = Response(
                {
                    'status': 'error',
                    'message': 'Internal server error',
                    'details': str(exc)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    else:
        error_payload = {
            'status': 'error',
            'message': str(exc),
        }

        if isinstance(exc, AuthenticationFailed):
            error_payload['message'] = 'Authentication failed'
        elif isinstance(exc, NotAuthenticated):
            error_payload['message'] = 'Authentication required'
        elif isinstance(exc, PermissionDenied):
            error_payload['message'] = 'Permission denied'
        elif isinstance(exc, ValidationError):
            error_payload['message'] = 'Validation error'
            error_payload['details'] = exc.detail

        response.data = error_payload

    return response
