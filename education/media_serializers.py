from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .media_models import MediaResource, MediaCollection, MediaCollectionItem

class MediaResourceSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les ressources multimédias"""
    
    content_type_str = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    preview_available = serializers.SerializerMethodField()
    
    class Meta:
        model = MediaResource
        fields = [
            'id', 'title', 'description', 'resource_type',
            'file', 'file_url', 'url', 'thumbnail',
            'video_provider', 'video_id', 'embed_url',
            'mime_type', 'preview_url', 'preview_available',
            'content_type', 'content_type_str', 'object_id',
            'created_at', 'updated_at', 'created_by'
        ]
        read_only_fields = [
            'video_provider', 'video_id', 'embed_url',
            'mime_type', 'preview_url', 'file_url',
            'preview_available'
        ]
    
    def get_content_type_str(self, obj):
        """Retourne une représentation lisible du type de contenu"""
        return f"{obj.content_type.app_label}.{obj.content_type.model}"
    
    def get_file_url(self, obj):
        """Retourne l'URL du fichier si disponible"""
        return obj.file.url if obj.file else None
    
    def get_preview_available(self, obj):
        """Vérifie si une prévisualisation est disponible"""
        return bool(obj.preview_url)
    
    def validate(self, data):
        """Validation personnalisée pour les ressources"""
        if not data.get('file') and not data.get('url'):
            raise serializers.ValidationError(
                "Either file or URL must be provided"
            )
            
        if data.get('resource_type') == 'video' and not data.get('url'):
            raise serializers.ValidationError(
                "URL is required for video resources"
            )
            
        return data

class MediaCollectionItemSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les éléments d'une collection"""
    
    resource = MediaResourceSerializer()
    
    class Meta:
        model = MediaCollectionItem
        fields = ['id', 'resource', 'order']

class MediaCollectionSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les collections multimédias"""
    
    items = MediaCollectionItemSerializer(
        source='mediacollectionitem_set',
        many=True,
        read_only=True
    )
    content_type_str = serializers.SerializerMethodField()
    resource_count = serializers.SerializerMethodField()
    
    class Meta:
        model = MediaCollection
        fields = [
            'id', 'title', 'description', 'items',
            'content_type', 'content_type_str', 'object_id',
            'created_at', 'updated_at', 'created_by',
            'resource_count'
        ]
    
    def get_content_type_str(self, obj):
        """Retourne une représentation lisible du type de contenu"""
        if obj.content_type:
            return f"{obj.content_type.app_label}.{obj.content_type.model}"
        return None
    
    def get_resource_count(self, obj):
        """Retourne le nombre de ressources dans la collection"""
        return obj.resources.count()

class MediaCollectionCreateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la création de collections"""
    
    resource_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = MediaCollection
        fields = [
            'title', 'description', 'content_type',
            'object_id', 'resource_ids'
        ]
    
    def create(self, validated_data):
        resource_ids = validated_data.pop('resource_ids', [])
        collection = super().create(validated_data)
        
        # Ajoute les ressources à la collection
        for order, resource_id in enumerate(resource_ids):
            try:
                resource = MediaResource.objects.get(id=resource_id)
                MediaCollectionItem.objects.create(
                    collection=collection,
                    resource=resource,
                    order=order
                )
            except MediaResource.DoesNotExist:
                continue
        
        return collection
