from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.db.models import Count
from django.db.models.functions import TruncDate
from .models import (
    UserActivity, CourseAnalytics, TrainingAnalytics,
    StartupMetrics, ProjectCallMetrics, CompetitionMetrics,
    PlatformStatistics
)
from .services import AnalyticsService

@login_required
def dashboard(request):
    """Vue du tableau de bord principal des analytiques"""
    # Obtenir les statistiques de la plateforme
    today = timezone.now().date()
    platform_stats = PlatformStatistics.objects.filter(date=today).first()
    if not platform_stats:
        AnalyticsService.update_platform_statistics()
        platform_stats = PlatformStatistics.objects.filter(date=today).first()
    
    # Obtenir l'activité des utilisateurs sur les 30 derniers jours
    thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
    daily_activity = UserActivity.objects.filter(
        timestamp__gte=thirty_days_ago
    ).annotate(
        date=TruncDate('timestamp')
    ).values('date').annotate(
        count=Count('id')
    ).order_by('date')
    
    # Préparer les données pour le graphique d'activité
    dates = [entry['date'].strftime('%Y-%m-%d') for entry in daily_activity]
    counts = [entry['count'] for entry in daily_activity]
    
    context = {
        'platform_stats': platform_stats,
        'activity_dates': dates,
        'activity_counts': counts,
    }
    return render(request, 'analytics/dashboard.html', context)

@login_required
def course_analytics(request):
    """Vue des analytiques des cours"""
    analytics = CourseAnalytics.objects.select_related('course').all()
    return render(request, 'analytics/course_analytics.html', {
        'analytics': analytics
    })

@login_required
def training_analytics(request):
    """Vue des analytiques des formations"""
    analytics = TrainingAnalytics.objects.select_related('training').all()
    return render(request, 'analytics/training_analytics.html', {
        'analytics': analytics
    })

@login_required
def startup_analytics(request):
    """Vue des analytiques des startups"""
    metrics = StartupMetrics.objects.select_related('startup').all()
    return render(request, 'analytics/startup_analytics.html', {
        'metrics': metrics
    })

@login_required
def project_call_analytics(request):
    """Vue des analytiques des appels à projets"""
    metrics = ProjectCallMetrics.objects.select_related('project_call').all()
    return render(request, 'analytics/project_call_analytics.html', {
        'metrics': metrics
    })

@login_required
def competition_analytics(request):
    """Vue des analytiques des compétitions"""
    metrics = CompetitionMetrics.objects.select_related('competition').all()
    return render(request, 'analytics/competition_analytics.html', {
        'metrics': metrics
    })
