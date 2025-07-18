from rest_framework import serializers
from .models import SearchIndex, SearchFilter

class SearchResultSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les résultats de recherche"""
    object_type = serializers.CharField(source='content_type.model')
    object_url = serializers.URLField(source='url')
    
    class Meta:
        model = SearchIndex
        fields = [
            'id', 'title', 'summary', 'content', 'keywords',
            'category', 'object_type', 'object_url',
            'created_at', 'updated_at'
        ]

class SearchFilterSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les filtres de recherche"""
    
    class Meta:
        model = SearchFilter
        fields = [
            'id', 'category', 'name', 'field',
            'filter_type', 'choices', 'order'
        ]
