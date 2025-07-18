from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    EquipmentCategory, Equipment, EquipmentReservation,
    EquipmentTraining, UserEquipmentCertification,
    MaintenanceLog, EquipmentUsageLog
)

User = get_user_model()

class EquipmentCategorySerializer(serializers.ModelSerializer):
    equipment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = EquipmentCategory
        fields = '__all__'
    
    def get_equipment_count(self, obj):
        return obj.equipment.filter(status__in=['available', 'in_use', 'reserved']).count()

class EquipmentListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)
    is_available = serializers.BooleanField(read_only=True)
    needs_maintenance = serializers.BooleanField(read_only=True)
    current_reservation = serializers.SerializerMethodField()
    
    class Meta:
        model = Equipment
        fields = [
            'id', 'name', 'category', 'category_name', 'category_color',
            'brand', 'model', 'status', 'condition', 'location',
            'image', 'is_available', 'needs_maintenance', 'current_reservation',
            'total_usage_hours', 'total_reservations'
        ]
    
    def get_current_reservation(self, obj):
        from django.utils import timezone
        now = timezone.now()
        current = obj.reservations.filter(
            status='active',
            start_time__lte=now,
            end_time__gte=now
        ).first()
        if current:
            return {
                'user': current.user.username,
                'end_time': current.end_time,
                'purpose': current.purpose[:50] + '...' if len(current.purpose) > 50 else current.purpose
            }
        return None

class EquipmentDetailSerializer(serializers.ModelSerializer):
    category = EquipmentCategorySerializer(read_only=True)
    responsible_person_name = serializers.CharField(source='responsible_person.username', read_only=True)
    recent_reservations = serializers.SerializerMethodField()
    maintenance_history = serializers.SerializerMethodField()
    usage_stats = serializers.SerializerMethodField()
    
    class Meta:
        model = Equipment
        fields = '__all__'
    
    def get_recent_reservations(self, obj):
        recent = obj.reservations.filter(status__in=['completed', 'active']).order_by('-start_time')[:5]
        return EquipmentReservationListSerializer(recent, many=True).data
    
    def get_maintenance_history(self, obj):
        recent = obj.maintenance_logs.filter(status='completed').order_by('-actual_end_time')[:3]
        return MaintenanceLogListSerializer(recent, many=True).data
    
    def get_usage_stats(self, obj):
        from django.utils import timezone
        from datetime import timedelta
        
        now = timezone.now()
        last_30_days = now - timedelta(days=30)
        
        recent_usage = obj.usage_logs.filter(start_time__gte=last_30_days)
        total_hours_30d = sum(log.duration_hours or 0 for log in recent_usage)
        
        return {
            'total_hours_lifetime': float(obj.total_usage_hours),
            'total_hours_30d': float(total_hours_30d),
            'total_reservations': obj.total_reservations,
            'average_session_hours': float(obj.total_usage_hours / max(obj.total_reservations, 1))
        }

class EquipmentReservationListSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    project_name = serializers.CharField(source='project.title', read_only=True)
    duration_display = serializers.SerializerMethodField()
    
    class Meta:
        model = EquipmentReservation
        fields = [
            'id', 'equipment', 'equipment_name', 'user', 'user_name',
            'project', 'project_name', 'start_time', 'end_time',
            'duration_hours', 'duration_display', 'purpose', 'status',
            'priority', 'created_at'
        ]
    
    def get_duration_display(self, obj):
        hours = int(obj.duration_hours)
        minutes = int((obj.duration_hours - hours) * 60)
        return f"{hours}h{minutes:02d}m"

class EquipmentReservationDetailSerializer(serializers.ModelSerializer):
    equipment = EquipmentListSerializer(read_only=True)
    user = serializers.StringRelatedField(read_only=True)
    approved_by = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = EquipmentReservation
        fields = '__all__'

class EquipmentReservationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentReservation
        fields = [
            'equipment', 'start_time', 'end_time', 'purpose',
            'materials_needed', 'expected_output', 'priority', 'project'
        ]
    
    def validate(self, data):
        # Vérifier que l'équipement est disponible
        equipment = data['equipment']
        start_time = data['start_time']
        end_time = data['end_time']
        
        if start_time >= end_time:
            raise serializers.ValidationError("L'heure de fin doit être après l'heure de début")
        
        # Vérifier les conflits de réservation
        conflicts = EquipmentReservation.objects.filter(
            equipment=equipment,
            status__in=['approved', 'active'],
            start_time__lt=end_time,
            end_time__gt=start_time
        )
        
        if self.instance:
            conflicts = conflicts.exclude(id=self.instance.id)
        
        if conflicts.exists():
            raise serializers.ValidationError("L'équipement est déjà réservé pour cette période")
        
        return data

class UserEquipmentCertificationSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    certified_by_name = serializers.CharField(source='certified_by.username', read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = UserEquipmentCertification
        fields = '__all__'

class MaintenanceLogListSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    performed_by_name = serializers.CharField(source='performed_by.username', read_only=True)
    
    class Meta:
        model = MaintenanceLog
        fields = [
            'id', 'equipment', 'equipment_name', 'maintenance_type',
            'title', 'scheduled_date', 'status', 'priority',
            'performed_by', 'performed_by_name', 'total_cost'
        ]

class MaintenanceLogDetailSerializer(serializers.ModelSerializer):
    equipment = EquipmentListSerializer(read_only=True)
    performed_by = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = MaintenanceLog
        fields = '__all__'

class EquipmentUsageLogSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = EquipmentUsageLog
        fields = '__all__'

class EquipmentStatsSerializer(serializers.Serializer):
    """Serializer pour les statistiques d'équipements"""
    total_equipment = serializers.IntegerField()
    available_equipment = serializers.IntegerField()
    in_use_equipment = serializers.IntegerField()
    maintenance_equipment = serializers.IntegerField()
    total_reservations_today = serializers.IntegerField()
    total_usage_hours_month = serializers.DecimalField(max_digits=10, decimal_places=2)
    most_used_equipment = serializers.DictField()
    maintenance_due_soon = serializers.IntegerField()
    
class EquipmentCalendarSerializer(serializers.Serializer):
    """Serializer pour le calendrier des réservations"""
    date = serializers.DateField()
    reservations = EquipmentReservationListSerializer(many=True)
    maintenance_scheduled = MaintenanceLogListSerializer(many=True)
