from django.contrib import admin
from .models import Course, Module, Training, Enrollment, Progress, Resource

class ModuleInline(admin.TabularInline):
    model = Module
    extra = 1

class ResourceInline(admin.TabularInline):
    model = Module.resources.through
    extra = 1

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'level', 'duration_weeks', 'is_active')
    list_filter = ('level', 'is_active')
    search_fields = ('title', 'description', 'instructor__username', 'objectives', 'prerequisites')
    inlines = [ModuleInline]

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'duration_hours')
    list_filter = ('course',)
    search_fields = ('title', 'description', 'content')
    ordering = ('course', 'order')
    inlines = [ResourceInline]
    exclude = ('resources',)

@admin.register(Training)
class TrainingAdmin(admin.ModelAdmin):
    list_display = ('course', 'start_date', 'end_date', 'is_active', 'is_online', 'current_participants', 'max_participants')
    list_filter = ('is_active', 'is_online')
    search_fields = ('course__title', 'description', 'location')
    date_hierarchy = 'start_date'

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'created_at', 'updated_at')
    list_filter = ('type',)
    search_fields = ('title', 'description')
    date_hierarchy = 'created_at'

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'training', 'status', 'enrollment_date', 'completion_date')
    list_filter = ('status',)
    search_fields = ('student__username', 'training__course__title')
    date_hierarchy = 'enrollment_date'

@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ('enrollment', 'module', 'status', 'score', 'completed_at')
    list_filter = ('status',)
    search_fields = ('enrollment__student__username', 'module__title')
    date_hierarchy = 'started_at'
