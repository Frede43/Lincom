from django.contrib import admin
from .models import Category, Topic, Post, Attachment

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'order', 'created_at', 'updated_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'description')
    ordering = ('order', 'name')

@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'course', 'is_pinned',
                   'is_locked', 'views_count', 'created_at', 'last_activity')
    list_filter = ('category', 'is_pinned', 'is_locked', 'created_at')
    search_fields = ('title', 'content', 'author__username')
    ordering = ('-is_pinned', '-last_activity')
    raw_id_fields = ('author', 'course')

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('topic', 'author', 'is_solution', 'created_at', 'updated_at')
    list_filter = ('is_solution', 'created_at')
    search_fields = ('content', 'author__username', 'topic__title')
    ordering = ('topic', 'created_at')
    raw_id_fields = ('author', 'topic')

@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = ('filename', 'post', 'file_size', 'uploaded_at')
    list_filter = ('uploaded_at',)
    search_fields = ('filename', 'post__content')
    ordering = ('-uploaded_at',)
    raw_id_fields = ('post',)
