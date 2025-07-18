from django.contrib import admin
from .models import (
    Industry, Stage, Startup, TeamMember, StartupMentor,
    Milestone, Investment, Project, ProjectUpdate, JoinRequest, MentorRequest
)

@admin.register(Industry)
class IndustryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name', 'description')
    ordering = ('name',)

@admin.register(Stage)
class StageAdmin(admin.ModelAdmin):
    list_display = ('name', 'order')
    search_fields = ('name', 'description')
    ordering = ('order',)

class TeamMemberInline(admin.TabularInline):
    model = TeamMember
    extra = 1

class StartupMentorInline(admin.TabularInline):
    model = StartupMentor
    extra = 1

class MilestoneInline(admin.TabularInline):
    model = Milestone
    extra = 1

class InvestmentInline(admin.TabularInline):
    model = Investment
    extra = 1

@admin.register(Startup)
class StartupAdmin(admin.ModelAdmin):
    list_display = ('name', 'founder', 'industry', 'stage', 'status', 'city', 'country', 'created_at')
    list_filter = ('status', 'industry', 'stage', 'city', 'country', 'featured')
    search_fields = ('name', 'description', 'founder__username', 'founder__email')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [TeamMemberInline, StartupMentorInline, MilestoneInline, InvestmentInline]
    prepopulated_fields = {'slug': ('name',)}
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    fieldsets = (
        ('Informations de base', {
            'fields': ('name', 'slug', 'logo', 'tagline', 'description', 'pitch_video')
        }),
        ('Classification', {
            'fields': ('industry', 'stage', 'business_model')
        }),
        ('Équipe', {
            'fields': ('founder',)
        }),
        ('Détails business', {
            'fields': ('founding_date', 'market_opportunity', 'competitive_advantage',
                      'revenue_model', 'customer_segment', 'revenue', 'funding_stage',
                      'funding_raised')
        }),
        ('Contact et présence en ligne', {
            'fields': ('website', 'email', 'phone', 'social_facebook',
                      'social_twitter', 'social_linkedin')
        }),
        ('Localisation', {
            'fields': ('address', 'city', 'country')
        }),
        ('Gestion et suivi', {
            'fields': ('status', 'featured', 'created_at', 'updated_at')
        }),
    )

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'startup', 'project_lead', 'status', 'start_date', 'end_date')
    list_filter = ('status', 'startup')
    search_fields = ('title', 'description', 'project_lead__username')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'start_date'
    ordering = ('-start_date',)

@admin.register(ProjectUpdate)
class ProjectUpdateAdmin(admin.ModelAdmin):
    list_display = ('project', 'author', 'created_at')
    list_filter = ('project', 'author')
    search_fields = ('content', 'author__username')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

@admin.register(JoinRequest)
class JoinRequestAdmin(admin.ModelAdmin):
    list_display = ('startup', 'user', 'role', 'status', 'created_at')
    list_filter = ('status', 'role')
    search_fields = ('startup__name', 'user__username', 'motivation')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)

@admin.register(MentorRequest)
class MentorRequestAdmin(admin.ModelAdmin):
    list_display = ('startup', 'mentor', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('startup__name', 'mentor__username', 'message', 'expertise_areas')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
