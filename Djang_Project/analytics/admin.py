from django.contrib import admin
from .models import (
    PlatformStatistics, CompetitionMetrics, CourseAnalytics,
    ProjectCallMetrics, StartupMetrics, TrainingAnalytics, UserActivity
)

# Register your models here.

@admin.register(PlatformStatistics)
class PlatformStatisticsAdmin(admin.ModelAdmin):
    list_display = ('date', 'total_users', 'active_users', 'total_startups',
                   'total_projects', 'total_courses', 'total_trainings')
    readonly_fields = ('date',)
    date_hierarchy = 'date'
    ordering = ('-date',)

@admin.register(CompetitionMetrics)
class CompetitionMetricsAdmin(admin.ModelAdmin):
    list_display = ('competition', 'total_registrations', 'confirmed_participants',
                   'participation_rate', 'last_updated')
    search_fields = ('competition__title',)
    readonly_fields = ('last_updated',)
    ordering = ('-last_updated',)

@admin.register(CourseAnalytics)
class CourseAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('course', 'total_students', 'average_progress',
                   'completion_rate', 'last_updated')
    search_fields = ('course__title',)
    readonly_fields = ('last_updated',)
    ordering = ('-last_updated',)

@admin.register(ProjectCallMetrics)
class ProjectCallMetricsAdmin(admin.ModelAdmin):
    list_display = ('project_call', 'total_submissions', 'accepted_submissions',
                   'total_budget_requested', 'last_updated')
    search_fields = ('project_call__title',)
    readonly_fields = ('last_updated',)
    ordering = ('-last_updated',)

@admin.register(StartupMetrics)
class StartupMetricsAdmin(admin.ModelAdmin):
    list_display = ('startup', 'total_projects', 'active_projects',
                   'team_size', 'last_updated')
    search_fields = ('startup__name',)
    readonly_fields = ('last_updated',)
    ordering = ('-last_updated',)

@admin.register(TrainingAnalytics)
class TrainingAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('training', 'total_participants', 'attendance_rate',
                   'satisfaction_score', 'last_updated')
    search_fields = ('training__title',)
    readonly_fields = ('last_updated',)
    ordering = ('-last_updated',)

@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_type', 'activity_id', 'timestamp')
    list_filter = ('activity_type',)
    search_fields = ('user__username', 'activity_type')
    readonly_fields = ('timestamp',)
    date_hierarchy = 'timestamp'
    ordering = ('-timestamp',)
