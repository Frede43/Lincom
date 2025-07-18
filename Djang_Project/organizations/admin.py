from django.contrib import admin
from .models import (
    Competition, ProjectCall, ProjectSubmission,
    CompetitionRegistration, ProjectSubmissionReview, OrganizationMetrics
)

@admin.register(Competition)
class CompetitionAdmin(admin.ModelAdmin):
    list_display = ('title', 'organization', 'type', 'status', 'start_date', 'end_date')
    list_filter = ('type', 'status')
    search_fields = ('title', 'description', 'organization__username')
    readonly_fields = ('created_at',)
    date_hierarchy = 'start_date'
    ordering = ('-start_date',)
    fieldsets = (
        ('Informations générales', {
            'fields': ('title', 'description', 'organization')
        }),
        ('Détails de la compétition', {
            'fields': ('type', 'status', 'prize', 'max_participants')
        }),
        ('Dates', {
            'fields': ('start_date', 'end_date', 'created_at')
        }),
    )

@admin.register(ProjectCall)
class ProjectCallAdmin(admin.ModelAdmin):
    list_display = ('title', 'organization', 'status', 'start_date', 'end_date', 'budget')
    list_filter = ('status',)
    search_fields = ('title', 'description', 'organization__username')
    readonly_fields = ('created_at',)
    date_hierarchy = 'start_date'
    ordering = ('-start_date',)
    fieldsets = (
        ('Informations générales', {
            'fields': ('title', 'description', 'organization')
        }),
        ('Détails du projet', {
            'fields': ('requirements', 'budget')
        }),
        ('Dates et statut', {
            'fields': ('start_date', 'end_date', 'status', 'created_at')
        }),
    )

class ProjectSubmissionReviewInline(admin.TabularInline):
    model = ProjectSubmissionReview
    extra = 1

@admin.register(ProjectSubmission)
class ProjectSubmissionAdmin(admin.ModelAdmin):
    list_display = ('project_call', 'startup', 'submitted_by', 'status', 'submitted_at')
    list_filter = ('status',)
    search_fields = ('startup__name', 'submitted_by__username', 'proposal')
    readonly_fields = ('submitted_at',)
    inlines = [ProjectSubmissionReviewInline]
    date_hierarchy = 'submitted_at'
    ordering = ('-submitted_at',)
    fieldsets = (
        ('Informations de soumission', {
            'fields': ('project_call', 'startup', 'submitted_by')
        }),
        ('Proposition', {
            'fields': ('proposal', 'budget_proposal')
        }),
        ('Statut', {
            'fields': ('status', 'submitted_at')
        }),
    )

@admin.register(CompetitionRegistration)
class CompetitionRegistrationAdmin(admin.ModelAdmin):
    list_display = ('competition', 'startup', 'registered_by', 'status', 'registered_at')
    list_filter = ('status',)
    search_fields = ('competition__title', 'startup__name', 'registered_by__username')
    readonly_fields = ('registered_at',)
    date_hierarchy = 'registered_at'
    ordering = ('-registered_at',)

@admin.register(OrganizationMetrics)
class OrganizationMetricsAdmin(admin.ModelAdmin):
    list_display = ('organization', 'total_competitions', 'total_project_calls', 
                   'total_participants', 'active_competitions', 'active_project_calls',
                   'total_submissions', 'accepted_submissions', 'last_updated')
    search_fields = ('organization__username',)
    readonly_fields = ('last_updated',)
    ordering = ('-last_updated',)
