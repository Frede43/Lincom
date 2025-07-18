from django.contrib import admin
from .models import Notification, NotificationPreference

# Register your models here.

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('recipient', 'notification_type', 'title', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('recipient__username', 'title', 'message')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)

@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ('user', 'email_notifications', 'course_updates', 'mentorship_updates')
    list_filter = ('email_notifications', 'course_updates', 'mentorship_updates')
    search_fields = ('user__username',)
    ordering = ('user__username',)
