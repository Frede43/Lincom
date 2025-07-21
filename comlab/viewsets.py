from rest_framework import viewsets, permissions
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework import status

class CustomModelViewSet(viewsets.ModelViewSet):
    """
    ViewSet personnalisé avec une gestion avancée des méthodes HTTP
    """
    def get_permissions(self):
        """
        Permissions différentes selon la méthode HTTP
        TEMPORAIRE : AllowAny pour les tests de développement
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [AllowAny]  # Temporaire pour tests
        elif self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]  # Temporaire pour tests
        else:
            permission_classes = [AllowAny]  # Temporaire pour tests
        return [permission() for permission in permission_classes]

    def get_throttles(self):
        """
        Limitation de taux différente selon la méthode HTTP
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            throttle_classes = [UserRateThrottle]
        else:
            throttle_classes = [AnonRateThrottle]
        return [throttle() for throttle in throttle_classes]

    def create(self, request, *args, **kwargs):
        """
        Surcharge de la méthode create avec validation supplémentaire
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                'status': 'success',
                'message': 'Resource created successfully',
                'data': serializer.data
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    def update(self, request, *args, **kwargs):
        """
        Surcharge de la méthode update avec validation supplémentaire
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            {
                'status': 'success',
                'message': 'Resource updated successfully',
                'data': serializer.data
            }
        )

    def destroy(self, request, *args, **kwargs):
        """
        Surcharge de la méthode destroy avec validation supplémentaire
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {
                'status': 'success',
                'message': 'Resource deleted successfully'
            },
            status=status.HTTP_204_NO_CONTENT
        )

    def list(self, request, *args, **kwargs):
        """
        Surcharge de la méthode list avec pagination et filtres
        """
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(
            {
                'status': 'success',
                'count': queryset.count(),
                'data': serializer.data
            }
        )
