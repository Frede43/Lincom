from django.contrib import admin
from .models import Organization, CallForProject, Competition, Submission

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'sector', 'location', 'is_active', 'contact_email')
    list_filter = ('type', 'sector', 'is_active')
    search_fields = ('name', 'description', 'sector', 'location')

@admin.register(CallForProject)
class CallForProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'organization', 'status', 'start_date', 'end_date', 'budget_min', 'budget_max')
    list_filter = ('status', 'organization', 'start_date', 'end_date')
    search_fields = ('title', 'description', 'organization__name')
    date_hierarchy = 'start_date'

@admin.register(Competition)
class CompetitionAdmin(admin.ModelAdmin):
    list_display = ('title', 'organization', 'status', 'start_date', 'end_date', 'max_participants')
    list_filter = ('status', 'organization', 'start_date', 'end_date')
    search_fields = ('title', 'description', 'organization__name')
    date_hierarchy = 'start_date'

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('title', 'competition', 'submitter', 'status', 'score', 'submitted_at')
    list_filter = ('status', 'competition', 'submitted_at')
    search_fields = ('title', 'description', 'competition__title', 'submitter__username')
    date_hierarchy = 'submitted_at'
