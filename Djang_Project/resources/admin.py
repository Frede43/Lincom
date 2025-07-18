from django.contrib import admin
from django.utils.html import format_html
from .models import ResourceCategory, Resource, ResourceTag, ResourceBookmark, ResourceComment

@admin.register(ResourceCategory)
class ResourceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent', 'slug', 'get_children_count')
    list_filter = ('parent',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    
    def get_children_count(self, obj):
        return obj.children.count()
    get_children_count.short_description = 'Sub-categories'

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'resource_type', 'is_featured', 'is_public', 'created_at')
    list_filter = ('category', 'resource_type', 'is_featured', 'is_public', 'created_at')
    search_fields = ('title', 'description', 'author__username')
    readonly_fields = ('created_at', 'updated_at', 'download_count')
    filter_horizontal = ('tags',)
    
    def get_file_link(self, obj):
        if obj.file:
            return format_html('<a href="{}" target="_blank">Download</a>', obj.file.url)
        elif obj.url:
            return format_html('<a href="{}" target="_blank">Visit</a>', obj.url)
        return "-"
    get_file_link.short_description = 'Resource Link'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.filter(author=request.user)
        return qs

@admin.register(ResourceTag)
class ResourceTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'get_resources_count')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    
    def get_resources_count(self, obj):
        return obj.resources.count()
    get_resources_count.short_description = 'Resources Count'

@admin.register(ResourceBookmark)
class ResourceBookmarkAdmin(admin.ModelAdmin):
    list_display = ('resource', 'user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('resource__title', 'user__username', 'notes')
    readonly_fields = ('created_at',)
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.filter(user=request.user)
        return qs

@admin.register(ResourceComment)
class ResourceCommentAdmin(admin.ModelAdmin):
    list_display = ('resource', 'user', 'parent', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('resource__title', 'user__username', 'content')
    readonly_fields = ('created_at', 'updated_at')
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.filter(user=request.user)
        return qs
