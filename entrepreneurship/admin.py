from django.contrib import admin
from .models import Startup, Project, Milestone, Resource

@admin.register(Startup)
class StartupAdmin(admin.ModelAdmin):
    list_display = ('name', 'industry', 'status', 'funding_stage', 'team_size', 'total_funding', 'founder')
    list_filter = ('status', 'industry', 'funding_stage')
    search_fields = ('name', 'description', 'industry', 'founder__username')
    date_hierarchy = 'founding_date'

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'startup', 'status', 'priority', 'start_date', 'end_date', 'budget', 'manager')
    list_filter = ('status', 'priority', 'startup')
    search_fields = ('title', 'description', 'startup__name', 'manager__username')
    date_hierarchy = 'start_date'

@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'status', 'priority', 'due_date', 'completion_date', 'assignee')
    list_filter = ('status', 'priority', 'project')
    search_fields = ('title', 'description', 'project__title', 'assignee__username')
    date_hierarchy = 'due_date'

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'startup', 'resource_type', 'visibility', 'owner')
    list_filter = ('resource_type', 'visibility', 'startup')
    search_fields = ('title', 'description', 'startup__name', 'owner__username')
