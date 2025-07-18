from django.contrib import admin
from django.utils.html import format_html
from .models import (
    EquipmentCategory, Equipment, EquipmentReservation,
    EquipmentTraining, UserEquipmentCertification,
    MaintenanceLog, EquipmentUsageLog
)

@admin.register(EquipmentCategory)
class EquipmentCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'category_type', 'requires_training', 'safety_level', 'equipment_count']
    list_filter = ['category_type', 'requires_training', 'safety_level']
    search_fields = ['name', 'description']
    ordering = ['name']

    def equipment_count(self, obj):
        return obj.equipment.count()
    equipment_count.short_description = 'Équipements'

@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'category', 'brand', 'model', 'status_badge',
        'condition', 'location', 'total_usage_hours', 'needs_maintenance_badge'
    ]
    list_filter = ['category', 'status', 'condition', 'location']
    search_fields = ['name', 'brand', 'model', 'serial_number']
    readonly_fields = ['total_usage_hours', 'total_reservations', 'created_at', 'updated_at']
    fieldsets = (
        ('Informations de base', {
            'fields': ('name', 'category', 'description', 'image')
        }),
        ('Spécifications', {
            'fields': ('brand', 'model', 'serial_number', 'specifications')
        }),
        ('État et localisation', {
            'fields': ('status', 'condition', 'location', 'qr_code')
        }),
        ('Achat et garantie', {
            'fields': ('purchase_date', 'purchase_price', 'warranty_expiry')
        }),
        ('Maintenance', {
            'fields': ('last_maintenance', 'next_maintenance', 'maintenance_interval_days')
        }),
        ('Documentation', {
            'fields': ('manual_url', 'training_materials', 'safety_instructions')
        }),
        ('Gestion', {
            'fields': ('responsible_person',)
        }),
        ('Statistiques', {
            'fields': ('total_usage_hours', 'total_reservations', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

    def status_badge(self, obj):
        colors = {
            'available': 'green',
            'in_use': 'orange',
            'reserved': 'blue',
            'maintenance': 'red',
            'broken': 'darkred',
            'retired': 'gray'
        }
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            colors.get(obj.status, 'black'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Statut'

    def needs_maintenance_badge(self, obj):
        if obj.needs_maintenance:
            return format_html('<span style="color: red;">⚠️ Oui</span>')
        return format_html('<span style="color: green;">✅ Non</span>')
    needs_maintenance_badge.short_description = 'Maintenance due'

@admin.register(EquipmentReservation)
class EquipmentReservationAdmin(admin.ModelAdmin):
    list_display = [
        'equipment', 'user', 'start_time', 'end_time',
        'duration_hours', 'status_badge', 'priority'
    ]
    list_filter = ['status', 'priority', 'equipment__category', 'start_time']
    search_fields = ['equipment__name', 'user__username', 'purpose']
    readonly_fields = ['duration_hours', 'actual_duration_hours', 'created_at', 'updated_at']
    date_hierarchy = 'start_time'

    def status_badge(self, obj):
        colors = {
            'pending': 'orange',
            'approved': 'blue',
            'active': 'green',
            'completed': 'gray',
            'cancelled': 'red',
            'no_show': 'darkred'
        }
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            colors.get(obj.status, 'black'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Statut'

@admin.register(MaintenanceLog)
class MaintenanceLogAdmin(admin.ModelAdmin):
    list_display = [
        'equipment', 'maintenance_type', 'title', 'scheduled_date',
        'status_badge', 'priority', 'total_cost', 'performed_by'
    ]
    list_filter = ['maintenance_type', 'status', 'priority', 'scheduled_date']
    search_fields = ['equipment__name', 'title', 'description']
    readonly_fields = ['actual_duration_hours', 'total_cost', 'created_at', 'updated_at']
    date_hierarchy = 'scheduled_date'

    def status_badge(self, obj):
        colors = {
            'scheduled': 'blue',
            'in_progress': 'orange',
            'completed': 'green',
            'cancelled': 'red',
            'failed': 'darkred'
        }
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            colors.get(obj.status, 'black'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Statut'

@admin.register(UserEquipmentCertification)
class UserEquipmentCertificationAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'equipment', 'level', 'certification_date',
        'expiry_date', 'is_active', 'is_expired_badge'
    ]
    list_filter = ['level', 'is_active', 'certification_date', 'equipment__category']
    search_fields = ['user__username', 'equipment__name']
    readonly_fields = ['is_expired']

    def is_expired_badge(self, obj):
        if obj.is_expired:
            return format_html('<span style="color: red;">⚠️ Expiré</span>')
        return format_html('<span style="color: green;">✅ Valide</span>')
    is_expired_badge.short_description = 'Validité'

@admin.register(EquipmentUsageLog)
class EquipmentUsageLogAdmin(admin.ModelAdmin):
    list_display = [
        'equipment', 'user', 'start_time', 'end_time',
        'duration_hours', 'equipment_condition_after'
    ]
    list_filter = ['equipment__category', 'equipment_condition_after', 'start_time']
    search_fields = ['equipment__name', 'user__username', 'purpose']
    readonly_fields = ['duration_hours', 'created_at']
    date_hierarchy = 'start_time'
