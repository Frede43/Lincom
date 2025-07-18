from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.utils import timezone
from django.db.models import Count, Sum, Q, Avg
from datetime import datetime, timedelta

from .models import (
    EquipmentCategory, Equipment, EquipmentReservation,
    EquipmentTraining, UserEquipmentCertification,
    MaintenanceLog, EquipmentUsageLog
)
from .serializers import (
    EquipmentCategorySerializer, EquipmentListSerializer, EquipmentDetailSerializer,
    EquipmentReservationListSerializer, EquipmentReservationDetailSerializer,
    EquipmentReservationCreateSerializer, UserEquipmentCertificationSerializer,
    MaintenanceLogListSerializer, MaintenanceLogDetailSerializer,
    EquipmentUsageLogSerializer, EquipmentStatsSerializer, EquipmentCalendarSerializer
)

class EquipmentCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet pour les catégories d'équipements"""
    queryset = EquipmentCategory.objects.all()
    serializer_class = EquipmentCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

class EquipmentViewSet(viewsets.ModelViewSet):
    """ViewSet pour les équipements"""
    queryset = Equipment.objects.select_related('category', 'responsible_person')
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status', 'condition', 'location']
    search_fields = ['name', 'brand', 'model', 'description']
    ordering_fields = ['name', 'created_at', 'total_usage_hours']
    ordering = ['name']

    def get_serializer_class(self):
        if self.action == 'list':
            return EquipmentListSerializer
        return EquipmentDetailSerializer

    @action(detail=False, methods=['get'])
    def available(self, request):
        """Équipements disponibles maintenant"""
        available = self.get_queryset().filter(status='available')
        serializer = EquipmentListSerializer(available, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Statistiques des équipements"""
        queryset = self.get_queryset()
        now = timezone.now()
        today = now.date()
        month_start = today.replace(day=1)

        # Statistiques de base
        total_equipment = queryset.count()
        available_equipment = queryset.filter(status='available').count()
        in_use_equipment = queryset.filter(status='in_use').count()
        maintenance_equipment = queryset.filter(status='maintenance').count()

        # Réservations aujourd'hui
        total_reservations_today = EquipmentReservation.objects.filter(
            start_time__date=today
        ).count()

        # Heures d'utilisation ce mois
        usage_logs_month = EquipmentUsageLog.objects.filter(
            start_time__date__gte=month_start
        )
        total_usage_hours_month = usage_logs_month.aggregate(
            total=Sum('duration_hours')
        )['total'] or 0

        # Équipement le plus utilisé
        most_used = queryset.annotate(
            usage_count=Count('reservations')
        ).order_by('-usage_count').first()

        most_used_equipment = {}
        if most_used:
            most_used_equipment = {
                'name': most_used.name,
                'usage_hours': float(most_used.total_usage_hours),
                'reservations': most_used.total_reservations
            }

        # Maintenance due bientôt (dans les 7 prochains jours)
        week_from_now = today + timedelta(days=7)
        maintenance_due_soon = queryset.filter(
            next_maintenance__lte=week_from_now,
            next_maintenance__gte=today
        ).count()

        stats_data = {
            'total_equipment': total_equipment,
            'available_equipment': available_equipment,
            'in_use_equipment': in_use_equipment,
            'maintenance_equipment': maintenance_equipment,
            'total_reservations_today': total_reservations_today,
            'total_usage_hours_month': total_usage_hours_month,
            'most_used_equipment': most_used_equipment,
            'maintenance_due_soon': maintenance_due_soon
        }

        serializer = EquipmentStatsSerializer(stats_data)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reserve(self, request, pk=None):
        """Créer une réservation pour cet équipement"""
        equipment = self.get_object()
        data = request.data.copy()
        data['equipment'] = equipment.id

        serializer = EquipmentReservationCreateSerializer(data=data)
        if serializer.is_valid():
            reservation = serializer.save(user=request.user)
            return Response(
                EquipmentReservationDetailSerializer(reservation).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        """Vérifier la disponibilité d'un équipement"""
        equipment = self.get_object()
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not start_date or not end_date:
            return Response(
                {'error': 'start_date et end_date sont requis'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            start_date = datetime.fromisoformat(start_date).date()
            end_date = datetime.fromisoformat(end_date).date()
        except ValueError:
            return Response(
                {'error': 'Format de date invalide (YYYY-MM-DD)'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Récupérer les réservations dans la période
        reservations = equipment.reservations.filter(
            status__in=['approved', 'active'],
            start_time__date__lte=end_date,
            end_time__date__gte=start_date
        ).order_by('start_time')

        # Récupérer les maintenances programmées
        maintenance = equipment.maintenance_logs.filter(
            status__in=['scheduled', 'in_progress'],
            scheduled_date__date__lte=end_date,
            scheduled_date__date__gte=start_date
        ).order_by('scheduled_date')

        availability_data = []
        current_date = start_date

        while current_date <= end_date:
            day_reservations = reservations.filter(
                start_time__date__lte=current_date,
                end_time__date__gte=current_date
            )
            day_maintenance = maintenance.filter(
                scheduled_date__date=current_date
            )

            availability_data.append({
                'date': current_date,
                'reservations': EquipmentReservationListSerializer(day_reservations, many=True).data,
                'maintenance_scheduled': MaintenanceLogListSerializer(day_maintenance, many=True).data
            })

            current_date += timedelta(days=1)

        serializer = EquipmentCalendarSerializer(availability_data, many=True)
        return Response(serializer.data)

class EquipmentReservationViewSet(viewsets.ModelViewSet):
    """ViewSet pour les réservations d'équipements"""
    queryset = EquipmentReservation.objects.select_related('equipment', 'user', 'project', 'approved_by')
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['equipment', 'status', 'priority', 'user']
    search_fields = ['purpose', 'equipment__name', 'user__username']
    ordering_fields = ['start_time', 'created_at', 'priority']
    ordering = ['-start_time']

    def get_serializer_class(self):
        if self.action == 'create':
            return EquipmentReservationCreateSerializer
        elif self.action == 'list':
            return EquipmentReservationListSerializer
        return EquipmentReservationDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtrer par utilisateur si pas admin
        if not self.request.user.is_staff:
            queryset = queryset.filter(
                Q(user=self.request.user) |
                Q(equipment__responsible_person=self.request.user)
            )

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approuver une réservation"""
        reservation = self.get_object()

        if reservation.status != 'pending':
            return Response(
                {'error': 'Seules les réservations en attente peuvent être approuvées'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reservation.status = 'approved'
        reservation.approved_by = request.user
        reservation.approved_at = timezone.now()
        reservation.approval_notes = request.data.get('notes', '')
        reservation.save()

        return Response({'status': 'Réservation approuvée'})

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Démarrer une session d'utilisation"""
        reservation = self.get_object()

        if reservation.status != 'approved':
            return Response(
                {'error': 'La réservation doit être approuvée'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reservation.status = 'active'
        reservation.actual_start_time = timezone.now()
        reservation.save()

        # Mettre à jour le statut de l'équipement
        reservation.equipment.status = 'in_use'
        reservation.equipment.save()

        return Response({'status': 'Session démarrée'})

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Terminer une session d'utilisation"""
        reservation = self.get_object()

        if reservation.status != 'active':
            return Response(
                {'error': 'La réservation doit être active'},
                status=status.HTTP_400_BAD_REQUEST
            )

        now = timezone.now()
        reservation.status = 'completed'
        reservation.actual_end_time = now
        reservation.user_feedback = request.data.get('feedback', '')
        reservation.user_rating = request.data.get('rating')
        reservation.issues_reported = request.data.get('issues', '')
        reservation.save()

        # Créer un log d'utilisation
        EquipmentUsageLog.objects.create(
            equipment=reservation.equipment,
            user=reservation.user,
            reservation=reservation,
            start_time=reservation.actual_start_time or reservation.start_time,
            end_time=now,
            purpose=reservation.purpose,
            materials_used=request.data.get('materials_used', ''),
            output_produced=request.data.get('output_produced', ''),
            equipment_condition_after=request.data.get('condition_after', 'good'),
            issues_reported=reservation.issues_reported,
            maintenance_needed=request.data.get('maintenance_needed', False)
        )

        # Mettre à jour le statut de l'équipement
        reservation.equipment.status = 'available'
        reservation.equipment.total_reservations += 1

        # Vérifier si maintenance nécessaire
        if request.data.get('maintenance_needed'):
            reservation.equipment.status = 'maintenance'

        reservation.equipment.save()

        return Response({'status': 'Session terminée'})

    @action(detail=False, methods=['get'])
    def my_reservations(self, request):
        """Mes réservations"""
        reservations = self.get_queryset().filter(user=request.user)
        serializer = EquipmentReservationListSerializer(reservations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending_approval(self, request):
        """Réservations en attente d'approbation"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Permission refusée'},
                status=status.HTTP_403_FORBIDDEN
            )

        pending = self.get_queryset().filter(status='pending')
        serializer = EquipmentReservationListSerializer(pending, many=True)
        return Response(serializer.data)

class MaintenanceLogViewSet(viewsets.ModelViewSet):
    """ViewSet pour les logs de maintenance"""
    queryset = MaintenanceLog.objects.select_related('equipment', 'performed_by')
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['equipment', 'maintenance_type', 'status', 'priority']
    search_fields = ['title', 'description', 'equipment__name']
    ordering_fields = ['scheduled_date', 'created_at', 'priority']
    ordering = ['-scheduled_date']

    def get_serializer_class(self):
        if self.action == 'list':
            return MaintenanceLogListSerializer
        return MaintenanceLogDetailSerializer

    @action(detail=False, methods=['get'])
    def due_soon(self, request):
        """Maintenances dues bientôt"""
        days = int(request.query_params.get('days', 7))
        due_date = timezone.now().date() + timedelta(days=days)

        due_soon = self.get_queryset().filter(
            status='scheduled',
            scheduled_date__date__lte=due_date
        )

        serializer = MaintenanceLogListSerializer(due_soon, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def start_maintenance(self, request, pk=None):
        """Démarrer une maintenance"""
        maintenance = self.get_object()

        if maintenance.status != 'scheduled':
            return Response(
                {'error': 'La maintenance doit être programmée'},
                status=status.HTTP_400_BAD_REQUEST
            )

        maintenance.status = 'in_progress'
        maintenance.actual_start_time = timezone.now()
        maintenance.performed_by = request.user
        maintenance.save()

        # Mettre l'équipement en maintenance
        maintenance.equipment.status = 'maintenance'
        maintenance.equipment.save()

        return Response({'status': 'Maintenance démarrée'})

    @action(detail=True, methods=['post'])
    def complete_maintenance(self, request, pk=None):
        """Terminer une maintenance"""
        maintenance = self.get_object()

        if maintenance.status != 'in_progress':
            return Response(
                {'error': 'La maintenance doit être en cours'},
                status=status.HTTP_400_BAD_REQUEST
            )

        now = timezone.now()
        maintenance.status = 'completed'
        maintenance.actual_end_time = now
        maintenance.work_performed = request.data.get('work_performed', '')
        maintenance.parts_replaced = request.data.get('parts_replaced', '')
        maintenance.issues_found = request.data.get('issues_found', '')
        maintenance.recommendations = request.data.get('recommendations', '')
        maintenance.parts_cost = request.data.get('parts_cost')
        maintenance.labor_cost = request.data.get('labor_cost')

        # Programmer la prochaine maintenance
        if request.data.get('next_maintenance_days'):
            days = int(request.data['next_maintenance_days'])
            maintenance.next_maintenance_due = now.date() + timedelta(days=days)

        maintenance.save()

        # Remettre l'équipement disponible
        maintenance.equipment.status = 'available'
        maintenance.equipment.condition = request.data.get('equipment_condition', 'good')
        maintenance.equipment.save()

        return Response({'status': 'Maintenance terminée'})

class UserEquipmentCertificationViewSet(viewsets.ModelViewSet):
    """ViewSet pour les certifications d'équipements"""
    queryset = UserEquipmentCertification.objects.select_related('user', 'equipment', 'certified_by')
    serializer_class = UserEquipmentCertificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['equipment', 'level', 'is_active']
    search_fields = ['user__username', 'equipment__name']
    ordering_fields = ['certification_date', 'expiry_date']
    ordering = ['-certification_date']

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtrer par utilisateur si pas admin
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)

        return queryset

    @action(detail=False, methods=['get'])
    def my_certifications(self, request):
        """Mes certifications"""
        certifications = self.get_queryset().filter(
            user=request.user,
            is_active=True
        )
        serializer = UserEquipmentCertificationSerializer(certifications, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def expiring_soon(self, request):
        """Certifications expirant bientôt"""
        days = int(request.query_params.get('days', 30))
        expiry_date = timezone.now().date() + timedelta(days=days)

        expiring = self.get_queryset().filter(
            expiry_date__lte=expiry_date,
            expiry_date__gte=timezone.now().date(),
            is_active=True
        )

        serializer = UserEquipmentCertificationSerializer(expiring, many=True)
        return Response(serializer.data)

class EquipmentUsageLogViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les logs d'utilisation (lecture seule)"""
    queryset = EquipmentUsageLog.objects.select_related('equipment', 'user', 'reservation')
    serializer_class = EquipmentUsageLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['equipment', 'user']
    search_fields = ['purpose', 'equipment__name', 'user__username']
    ordering_fields = ['start_time', 'duration_hours']
    ordering = ['-start_time']

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtrer par utilisateur si pas admin
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)

        return queryset

    @action(detail=False, methods=['get'])
    def my_usage(self, request):
        """Mon historique d'utilisation"""
        usage = self.get_queryset().filter(user=request.user)
        serializer = EquipmentUsageLogSerializer(usage, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def equipment_usage(self, request):
        """Utilisation par équipement"""
        equipment_id = request.query_params.get('equipment_id')
        if not equipment_id:
            return Response(
                {'error': 'equipment_id requis'},
                status=status.HTTP_400_BAD_REQUEST
            )

        usage = self.get_queryset().filter(equipment_id=equipment_id)
        serializer = EquipmentUsageLogSerializer(usage, many=True)
        return Response(serializer.data)
