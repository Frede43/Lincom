from django.contrib import admin
from .models import Category, Course, CourseEnrollment, Training, TrainingRegistration

# Register your models here.

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'mentor', 'category', 'level', 'created_at')
    list_filter = ('level', 'category', 'created_at')
    search_fields = ('title', 'description', 'mentor__username')
    date_hierarchy = 'created_at'

@admin.register(CourseEnrollment)
class CourseEnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'progress', 'enrolled_at')
    list_filter = ('enrolled_at',)
    search_fields = ('student__username', 'course__title')

@admin.register(Training)
class TrainingAdmin(admin.ModelAdmin):
    list_display = ('title', 'mentor', 'category', 'start_date', 'end_date', 'max_participants')
    list_filter = ('category', 'start_date')
    search_fields = ('title', 'description', 'mentor__username')
    date_hierarchy = 'start_date'

@admin.register(TrainingRegistration)
class TrainingRegistrationAdmin(admin.ModelAdmin):
    list_display = ('participant', 'training', 'status', 'registered_at')
    list_filter = ('status', 'registered_at')
    search_fields = ('participant__username', 'training__title')
