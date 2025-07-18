from django.contrib import admin
from django.utils.html import format_html
from .models import Event, EventRegistration, EventSpeaker, EventFeedback

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'start_date', 'end_date', 'location', 'is_virtual', 'organizer', 'is_featured')
    list_filter = ('category', 'is_virtual', 'is_featured', 'start_date')
    search_fields = ('title', 'description', 'location', 'organizer__username')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'start_date'
    
    def get_meeting_link(self, obj):
        if obj.meeting_link and obj.is_virtual:
            return format_html('<a href="{}" target="_blank">Join Meeting</a>', obj.meeting_link)
        return "-"
    get_meeting_link.short_description = 'Meeting Link'

@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ('event', 'participant', 'status', 'registration_date')
    list_filter = ('status', 'registration_date')
    search_fields = ('event__title', 'participant__username', 'notes')
    readonly_fields = ('registration_date',)
    date_hierarchy = 'registration_date'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.filter(event__organizer=request.user)
        return qs

@admin.register(EventSpeaker)
class EventSpeakerAdmin(admin.ModelAdmin):
    list_display = ('event', 'name', 'get_linkedin', 'get_twitter')
    list_filter = ('event__start_date',)
    search_fields = ('name', 'bio', 'event__title')
    
    def get_linkedin(self, obj):
        if obj.linkedin_profile:
            return format_html('<a href="{}" target="_blank">LinkedIn</a>', obj.linkedin_profile)
        return "-"
    get_linkedin.short_description = 'LinkedIn'
    
    def get_twitter(self, obj):
        if obj.twitter_profile:
            return format_html('<a href="{}" target="_blank">Twitter</a>', obj.twitter_profile)
        return "-"
    get_twitter.short_description = 'Twitter'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.filter(event__organizer=request.user)
        return qs

@admin.register(EventFeedback)
class EventFeedbackAdmin(admin.ModelAdmin):
    list_display = ('event', 'participant', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('event__title', 'participant__username', 'comment')
    readonly_fields = ('created_at',)
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.filter(event__organizer=request.user)
        return qs
