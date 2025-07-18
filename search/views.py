from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import SearchIndex, SearchFilter
from .services import SearchService
from .serializers import SearchResultSerializer, SearchFilterSerializer

class SearchViewSet(viewsets.ViewSet):
    """ViewSet pour la recherche globale"""
    
    def list(self, request):
        """Effectue une recherche globale"""
        query = request.query_params.get('q', '')
        category = request.query_params.get('category')
        filters = request.query_params.dict()
        
        # Retire les paramètres spéciaux des filtres
        filters.pop('q', None)
        filters.pop('category', None)
        filters.pop('page', None)
        
        # Effectue la recherche
        results = SearchService.search(
            query=query,
            category=category,
            filters=filters,
            user=request.user if request.user.is_authenticated else None,
            ip_address=request.META.get('REMOTE_ADDR')
        )
        
        # Sérialise les résultats
        serializer = SearchResultSerializer(results, many=True)
        return Response(serializer.data)
    
    def search(self, request):
        """Point d'entrée dédié pour la recherche"""
        query = request.query_params.get('q', '')
        if not query:
            return Response(
                {"error": "Search query is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Récupère les paramètres de recherche
        category = request.query_params.get('category')
        filters = request.query_params.dict()
        filters.pop('q', None)
        filters.pop('category', None)
        filters.pop('page', None)
        
        # Effectue la recherche
        results = SearchService.search(
            query=query,
            category=category,
            filters=filters,
            user=request.user if request.user.is_authenticated else None,
            ip_address=request.META.get('REMOTE_ADDR')
        )
        
        # Sérialise et retourne les résultats
        serializer = SearchResultSerializer(results, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def filters(self, request):
        """Récupère les filtres disponibles pour une catégorie"""
        category = request.query_params.get('category')
        if not category:
            return Response(
                {"error": "Category parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        filters = SearchService.get_filters(category)
        serializer = SearchFilterSerializer(filters, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def suggestions(self, request):
        """Retourne des suggestions de recherche basées sur la saisie partielle"""
        query = request.query_params.get('q', '')
        category = request.query_params.get('category')
        
        if not query or len(query) < 2:
            return Response([])
            
        # Récupère les suggestions
        suggestions = SearchService.get_suggestions(
            query=query,
            category=category,
            limit=10
        )
        
        return Response(suggestions)

    @action(detail=False, methods=['get'])
    def trending(self, request):
        """Retourne les recherches tendance"""
        days = int(request.query_params.get('days', 7))
        limit = int(request.query_params.get('limit', 10))
        
        trending = SearchService.get_trending_searches(
            days=days,
            limit=limit
        )
        
        return Response(trending)

    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Récupère les catégories disponibles avec leur compte"""
        from django.db.models import Count
        
        categories = SearchIndex.objects.values('category').annotate(
            count=Count('id')
        ).order_by('category')
        
        return Response(categories)
    
class SearchFilterViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les filtres de recherche"""
    queryset = SearchFilter.objects.all()
    serializer_class = SearchFilterSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filtre les résultats en fonction de la catégorie"""
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset
