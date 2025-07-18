from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
from django.db import transaction
from .models import User, Mentor, Entrepreneur, Stakeholder
from dashboard.models import UserActivity

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'date_joined', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'bio', 'avatar')}),
        ('Contact info', {'fields': ('phone_number', 'address')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role'),
        }),
    )

    def save_model(self, request, obj, form, change):
        creating = not obj.pk
        with transaction.atomic():
            super().save_model(request, obj, form, change)
            if creating:
                UserActivity.objects.create(
                    user=request.user,
                    activity_type='other',
                    action='created',
                    description=f'Utilisateur {obj.username} créé',
                    target_object_type='User',
                    target_object_id=obj.pk,
                    target_user=obj
                )
            else:
                UserActivity.objects.create(
                    user=request.user,
                    activity_type='other',
                    action='updated',
                    description=f'Utilisateur {obj.username} modifié',
                    target_object_type='User',
                    target_object_id=obj.pk,
                    target_user=obj
                )

    def delete_model(self, request, obj):
        with transaction.atomic():
            # Créer l'activité avant de supprimer l'utilisateur
            UserActivity.objects.create(
                user=request.user,
                activity_type='other',
                action='deleted',
                description=f'Utilisateur {obj.username} supprimé',
                target_object_type='User',
                target_object_id=obj.pk
            )
            super().delete_model(request, obj)

    def delete_queryset(self, request, queryset):
        with transaction.atomic():
            for obj in queryset:
                UserActivity.objects.create(
                    user=request.user,
                    activity_type='other',
                    action='deleted',
                    description=f'Utilisateur {obj.username} supprimé',
                    target_object_type='User',
                    target_object_id=obj.pk
                )
            super().delete_queryset(request, queryset)

@admin.register(Mentor)
class MentorAdmin(admin.ModelAdmin):
    list_display = ('user', 'expertise', 'experience_years', 'rating')
    list_filter = ('expertise', 'experience_years')
    search_fields = ('user__username', 'user__email', 'expertise')
    raw_id_fields = ('user',)

@admin.register(Entrepreneur)
class EntrepreneurAdmin(admin.ModelAdmin):
    list_display = ('user', 'company_name', 'industry', 'company_stage')
    list_filter = ('industry', 'company_stage')
    search_fields = ('user__username', 'user__email', 'company_name', 'industry')
    raw_id_fields = ('user',)

@admin.register(Stakeholder)
class StakeholderAdmin(admin.ModelAdmin):
    list_display = ('user', 'organization', 'position', 'department')
    list_filter = ('position', 'department')
    search_fields = ('user__username', 'user__email', 'organization__name', 'department')
    raw_id_fields = ('user', 'organization')
