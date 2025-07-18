from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from ..models import MentorRequest, StartupMentor

class MentorStatisticsService:
    @staticmethod
    def get_mentor_statistics(startup=None, mentor=None, period_days=30):
        """
        Récupère les statistiques de mentorat pour une startup ou un mentor
        """
        end_date = timezone.now()
        start_date = end_date - timedelta(days=period_days)
        
        # Base queryset
        requests_qs = MentorRequest.objects.filter(
            created_at__range=(start_date, end_date)
        )
        
        if startup:
            requests_qs = requests_qs.filter(startup=startup)
        if mentor:
            requests_qs = requests_qs.filter(mentor=mentor)
        
        # Statistiques des demandes
        request_stats = requests_qs.aggregate(
            total_requests=Count('id'),
            accepted_requests=Count('id', filter=Q(status='accepted')),
            rejected_requests=Count('id', filter=Q(status='rejected')),
            pending_requests=Count('id', filter=Q(status='pending'))
        )
        
        # Taux d'acceptation
        total = request_stats['total_requests']
        accepted = request_stats['accepted_requests']
        acceptance_rate = (accepted / total * 100) if total > 0 else 0
        
        # Temps moyen de réponse
        avg_response_time = requests_qs.exclude(
            reviewed_at__isnull=True
        ).annotate(
            response_time=timezone.ExpressionWrapper(
                timezone.F('reviewed_at') - timezone.F('created_at'),
                output_field=timezone.DurationField()
            )
        ).aggregate(avg=timezone.Avg('response_time'))
        
        return {
            'period_days': period_days,
            'total_requests': request_stats['total_requests'],
            'accepted_requests': request_stats['accepted_requests'],
            'rejected_requests': request_stats['rejected_requests'],
            'pending_requests': request_stats['pending_requests'],
            'acceptance_rate': round(acceptance_rate, 2),
            'avg_response_time': avg_response_time['avg'],
        }
    
    @staticmethod
    def get_mentor_activity(mentor, period_days=30):
        """
        Récupère les statistiques d'activité d'un mentor
        """
        end_date = timezone.now()
        start_date = end_date - timedelta(days=period_days)
        
        # Nombre de startups actuellement mentorées
        current_startups = StartupMentor.objects.filter(
            mentor=mentor,
            status='active'
        ).count()
        
        # Historique des demandes
        requests_history = MentorRequest.objects.filter(
            mentor=mentor,
            created_at__range=(start_date, end_date)
        ).values('status').annotate(
            count=Count('id')
        )
        
        return {
            'current_startups': current_startups,
            'requests_history': requests_history,
            'period_days': period_days
        }
    
    @staticmethod
    def get_startup_mentor_statistics(startup, period_days=30):
        """
        Récupère les statistiques de mentorat pour une startup
        """
        end_date = timezone.now()
        start_date = end_date - timedelta(days=period_days)
        
        # Nombre de mentors actifs
        active_mentors = StartupMentor.objects.filter(
            startup=startup,
            status='active'
        ).count()
        
        # Historique des demandes reçues
        received_requests = MentorRequest.objects.filter(
            startup=startup,
            created_at__range=(start_date, end_date)
        ).values('status').annotate(
            count=Count('id')
        )
        
        return {
            'active_mentors': active_mentors,
            'received_requests': received_requests,
            'period_days': period_days
        }
