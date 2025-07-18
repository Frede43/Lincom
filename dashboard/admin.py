from django.contrib import admin
from .models import DashboardPreference, Widget, Notification, QuickAction, UserActivity

@admin.register(DashboardPreference)
class DashboardPreferenceAdmin(admin.ModelAdmin):
    list_display = ('user', 'theme', 'created_at', 'updated_at')
    list_filter = ('theme', 'created_at')
    search_fields = ('user__username', 'user__email')
    raw_id_fields = ('user',)

@admin.register(Widget)
class WidgetAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'is_active', 'created_at')
    list_filter = ('type', 'is_active', 'created_at')
    search_fields = ('title', 'description')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'type', 'is_read', 'created_at')
    list_filter = ('type', 'is_read', 'created_at')
    search_fields = ('user__username', 'user__email', 'title', 'message')
    raw_id_fields = ('user',)

@admin.register(QuickAction)
class QuickActionAdmin(admin.ModelAdmin):
    list_display = ('title', 'action_type', 'is_active', 'order')
    list_filter = ('action_type', 'is_active', 'created_at')
    search_fields = ('title', 'description')
    ordering = ('order', 'title')

@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ('get_user', 'activity_type', 'action', 'get_target_user', 'created_at')
    list_filter = ('activity_type', 'action', 'created_at')
    search_fields = ('user__username', 'user__email', 'description', 'target_user__username')
    raw_id_fields = ('user', 'target_user')
    
    def get_user(self, obj):
        return obj.user.username if obj.user else 'System'
    get_user.short_description = 'User'
    
    def get_target_user(self, obj):
        return obj.target_user.username if obj.target_user else '-'
    get_target_user.short_description = 'Target User'
