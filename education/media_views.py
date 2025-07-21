from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .media_models import MediaResource, MediaCollection, MediaCollectionItem
from .media_serializers import (
    MediaResourceSerializer,
    MediaCollectionSerializer,
    MediaCollectionCreateSerializer
)
from .integrations import VideoIntegrationFactory, DocumentIntegration

class MediaResourceViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les ressources multimédias"""

    queryset = MediaResource.objects.all()
    serializer_class = MediaResourceSerializer
    permission_classes = [AllowAny]  # Temporaire pour tests
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtre par type de ressource
        resource_type = self.request.query_params.get('type')
        if resource_type:
            queryset = queryset.filter(resource_type=resource_type)
        
        # Filtre par type de contenu associé
        content_type = self.request.query_params.get('content_type')
        object_id = self.request.query_params.get('object_id')
        if content_type and object_id:
            app_label, model = content_type.split('.')
            try:
                content_type = ContentType.objects.get(
                    app_label=app_label,
                    model=model
                )
                queryset = queryset.filter(
                    content_type=content_type,
                    object_id=object_id
                )
            except ContentType.DoesNotExist:
                pass
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def process(self, request, pk=None):
        """Traite une ressource pour extraire les métadonnées"""
        resource = self.get_object()
        
        if resource.resource_type == 'video' and resource.url:
            video_info = VideoIntegrationFactory.process_video_url(resource.url)
            if video_info:
                resource.video_provider = video_info['provider']
                resource.video_id = video_info['video_id']
                resource.embed_url = video_info['embed_url']
                resource.save()
        
        serializer = self.get_serializer(resource)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def types(self, request):
        """Retourne les types de ressources disponibles"""
        return Response(dict(MediaResource.RESOURCE_TYPES))

class MediaCollectionViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les collections multimédias"""

    queryset = MediaCollection.objects.all()
    permission_classes = [AllowAny]  # Temporaire pour tests
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return MediaCollectionCreateSerializer
        return MediaCollectionSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtre par type de contenu associé
        content_type = self.request.query_params.get('content_type')
        object_id = self.request.query_params.get('object_id')
        if content_type and object_id:
            app_label, model = content_type.split('.')
            try:
                content_type = ContentType.objects.get(
                    app_label=app_label,
                    model=model
                )
                queryset = queryset.filter(
                    content_type=content_type,
                    object_id=object_id
                )
            except ContentType.DoesNotExist:
                pass
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def add_resource(self, request, pk=None):
        """Ajoute une ressource à la collection"""
        collection = self.get_object()
        resource_id = request.data.get('resource_id')
        order = request.data.get('order')
        
        if not resource_id:
            return Response(
                {"error": "resource_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            resource = MediaResource.objects.get(id=resource_id)
        except MediaResource.DoesNotExist:
            return Response(
                {"error": "Resource not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if not order:
            # Place à la fin si l'ordre n'est pas spécifié
            order = collection.mediacollectionitem_set.count()
        
        item, created = MediaCollectionItem.objects.get_or_create(
            collection=collection,
            resource=resource,
            defaults={'order': order}
        )
        
        if not created:
            item.order = order
            item.save()
        
        serializer = self.get_serializer(collection)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def remove_resource(self, request, pk=None):
        """Retire une ressource de la collection"""
        collection = self.get_object()
        resource_id = request.data.get('resource_id')
        
        if not resource_id:
            return Response(
                {"error": "resource_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        item = get_object_or_404(
            MediaCollectionItem,
            collection=collection,
            resource_id=resource_id
        )
        item.delete()
        
        # Réorganise les ordres
        for i, item in enumerate(collection.mediacollectionitem_set.all()):
            item.order = i
            item.save()
        
        serializer = self.get_serializer(collection)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def reorder(self, request, pk=None):
        """Réorganise les ressources dans la collection"""
        collection = self.get_object()
        order_data = request.data.get('order', [])
        
        if not isinstance(order_data, list):
            return Response(
                {"error": "order must be a list of resource IDs"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Vérifie que tous les IDs sont valides
        current_items = set(collection.resources.values_list('id', flat=True))
        if not all(rid in current_items for rid in order_data):
            return Response(
                {"error": "Invalid resource ID in order list"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Met à jour l'ordre
        for order, resource_id in enumerate(order_data):
            MediaCollectionItem.objects.filter(
                collection=collection,
                resource_id=resource_id
            ).update(order=order)
        
        serializer = self.get_serializer(collection)
        return Response(serializer.data)
