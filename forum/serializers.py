from rest_framework import serializers
from .models import Category, Topic, Post, Comment, Attachment

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ['id', 'post', 'file', 'filename', 'file_size', 'content_type', 'uploaded_at', 'uploader']
        read_only_fields = ['uploader']

    def create(self, validated_data):
        validated_data['file_size'] = validated_data['file'].size
        validated_data['content_type'] = validated_data['file'].content_type or 'application/octet-stream'
        return super().create(validated_data)

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    is_liked_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'author_name', 'content', 'likes_count',
                 'is_liked_by_user', 'created_at', 'updated_at']
        read_only_fields = ['author']

    def get_is_liked_by_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    replies = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(read_only=True)
    replies_count = serializers.IntegerField(read_only=True)
    is_liked_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'topic', 'author', 'author_name', 'content', 'parent',
                 'is_solution', 'likes_count', 'replies_count', 'is_liked_by_user',
                 'attachments', 'comments', 'replies', 'created_at', 'updated_at']
        read_only_fields = ['author', 'is_solution']

    def get_replies(self, obj):
        if obj.parent is None:  # Only get replies for top-level posts
            replies = obj.replies.all()
            return PostSerializer(replies, many=True, context=self.context).data
        return []

    def get_is_liked_by_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

class TopicSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    posts_count = serializers.SerializerMethodField()
    last_post = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Topic
        fields = ['id', 'title', 'content', 'category', 'category_name', 'author',
                 'author_name', 'course', 'is_pinned', 'is_locked', 'views_count',
                 'posts_count', 'last_post', 'created_at', 'updated_at', 'last_activity']
        read_only_fields = ['author', 'views_count', 'last_activity']

    def get_posts_count(self, obj):
        return obj.posts.count()

    def get_last_post(self, obj):
        last_post = obj.posts.order_by('-created_at').first()
        if last_post:
            return {
                'author_name': last_post.author.get_full_name(),
                'created_at': last_post.created_at
            }
        return None

class CategorySerializer(serializers.ModelSerializer):
    topics_count = serializers.SerializerMethodField()
    last_topic = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'order', 'topics_count',
                 'last_topic', 'created_at', 'updated_at']

    def get_topics_count(self, obj):
        return obj.topics.count()

    def get_last_topic(self, obj):
        last_topic = obj.topics.order_by('-last_activity').first()
        if last_topic:
            return {
                'id': last_topic.id,
                'title': last_topic.title,
                'last_activity': last_topic.last_activity
            }
        return None
