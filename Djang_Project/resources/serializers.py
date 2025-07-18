from rest_framework import serializers
from .models import ResourceCategory, Resource, ResourceTag, ResourceBookmark, ResourceComment

class ResourceTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceTag
        fields = ['id', 'name', 'slug']
        read_only_fields = ['slug']

class ResourceCategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = ResourceCategory
        fields = ['id', 'name', 'description', 'slug', 'parent', 'children']
        read_only_fields = ['slug']
    
    def get_children(self, obj):
        if obj.children.exists():
            return ResourceCategorySerializer(obj.children.all(), many=True).data
        return []

class ResourceCommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = ResourceComment
        fields = ['id', 'resource', 'user', 'user_name', 'content', 'created_at', 'updated_at', 'parent', 'replies']
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def get_replies(self, obj):
        if obj.replies.exists():
            return ResourceCommentSerializer(obj.replies.all(), many=True).data
        return []
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class ResourceBookmarkSerializer(serializers.ModelSerializer):
    resource_title = serializers.CharField(source='resource.title', read_only=True)
    
    class Meta:
        model = ResourceBookmark
        fields = ['id', 'resource', 'resource_title', 'user', 'created_at', 'notes']
        read_only_fields = ['user', 'created_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class ResourceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    tags = ResourceTagSerializer(many=True, read_only=True)
    author_name = serializers.CharField(source='author.username', read_only=True)
    is_bookmarked = serializers.SerializerMethodField()
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)
    
    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'description', 'category', 'category_name',
            'resource_type', 'file', 'url', 'author', 'author_name',
            'created_at', 'updated_at', 'is_featured', 'is_public',
            'download_count', 'tags', 'is_bookmarked', 'comments_count'
        ]
        read_only_fields = ['author', 'created_at', 'updated_at', 'download_count']
    
    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.bookmarks.filter(user=request.user).exists()
        return False
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)
