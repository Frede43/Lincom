from django.utils import timezone
from django.db.models import Avg, Count
from django.contrib.auth import get_user_model
from .models import (
    UserActivity, CourseAnalytics, TrainingAnalytics,
    StartupMetrics, ProjectCallMetrics, CompetitionMetrics,
    PlatformStatistics
)
from learning.models import Course, Training, CourseEnrollment
from startups.models import Startup, Project
from organizations.models import ProjectCall, Competition, CompetitionRegistration

User = get_user_model()

class AnalyticsService:
    @staticmethod
    def track_user_activity(user, activity_type, activity_id, details=None):
        """Enregistre une activité utilisateur"""
        UserActivity.objects.create(
            user=user,
            activity_type=activity_type,
            activity_id=activity_id,
            details=details or {}
        )

    @staticmethod
    def update_course_analytics(course):
        """Met à jour les analytiques d'un cours"""
        analytics, _ = CourseAnalytics.objects.get_or_create(course=course)
        enrollments = CourseEnrollment.objects.filter(course=course)
        
        analytics.total_students = enrollments.count()
        analytics.average_progress = enrollments.aggregate(Avg('progress'))['progress__avg'] or 0
        analytics.completion_rate = (
            enrollments.filter(completed=True).count() / analytics.total_students * 100
            if analytics.total_students > 0 else 0
        )
        analytics.save()

    @staticmethod
    def update_training_analytics(training):
        """Met à jour les analytiques d'une formation"""
        analytics, _ = TrainingAnalytics.objects.get_or_create(training=training)
        sessions = training.sessions.all()
        
        total_expected = sessions.aggregate(
            total=Count('participants')
        )['total']
        
        total_attended = sessions.aggregate(
            total=Count('attendance')
        )['total']
        
        analytics.total_participants = training.participants.count()
        analytics.attendance_rate = (
            total_attended / total_expected * 100
            if total_expected > 0 else 0
        )
        analytics.satisfaction_score = (
            training.feedback_set.aggregate(Avg('satisfaction_score'))['satisfaction_score__avg'] or 0
        )
        analytics.save()

    @staticmethod
    def update_startup_metrics(startup):
        """Met à jour les métriques d'une startup"""
        metrics, _ = StartupMetrics.objects.get_or_create(startup=startup)
        
        metrics.total_projects = startup.projects.count()
        metrics.active_projects = startup.projects.filter(status='active').count()
        metrics.team_size = startup.teammember_set.filter(is_active=True).count()
        metrics.save()

    @staticmethod
    def update_project_call_metrics(project_call):
        """Met à jour les métriques d'un appel à projets"""
        metrics, _ = ProjectCallMetrics.objects.get_or_create(project_call=project_call)
        
        submissions = project_call.submissions.all()
        metrics.total_submissions = submissions.count()
        metrics.accepted_submissions = submissions.filter(status='accepted').count()
        metrics.average_budget = (
            submissions.aggregate(Avg('budget_proposal'))['budget_proposal__avg'] or 0
        )
        metrics.save()

    @staticmethod
    def update_competition_metrics(competition):
        """Met à jour les métriques d'une compétition"""
        metrics, _ = CompetitionMetrics.objects.get_or_create(competition=competition)
        
        registrations = CompetitionRegistration.objects.filter(competition=competition)
        metrics.total_registrations = registrations.count()
        metrics.confirmed_participants = registrations.filter(status='confirmed').count()
        metrics.participation_rate = (
            metrics.confirmed_participants / competition.max_participants * 100
            if competition.max_participants > 0 else 0
        )
        metrics.save()

    @staticmethod
    def update_platform_statistics():
        """Met à jour les statistiques globales de la plateforme"""
        today = timezone.now().date()
        stats, _ = PlatformStatistics.objects.get_or_create(date=today)
        
        # Calculer les utilisateurs actifs (actifs dans les 30 derniers jours)
        thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
        active_users = UserActivity.objects.filter(
            timestamp__gte=thirty_days_ago
        ).values('user').distinct().count()
        
        stats.total_users = User.objects.count()
        stats.active_users = active_users
        stats.total_startups = Startup.objects.count()
        stats.total_projects = Project.objects.count()
        stats.total_courses = Course.objects.count()
        stats.total_trainings = Training.objects.count()
        stats.save()

    @classmethod
    def update_all_metrics(cls):
        """Met à jour toutes les métriques de la plateforme"""
        # Mettre à jour les analytiques des cours
        for course in Course.objects.all():
            cls.update_course_analytics(course)
        
        # Mettre à jour les analytiques des formations
        for training in Training.objects.all():
            cls.update_training_analytics(training)
        
        # Mettre à jour les métriques des startups
        for startup in Startup.objects.all():
            cls.update_startup_metrics(startup)
        
        # Mettre à jour les métriques des appels à projets
        for project_call in ProjectCall.objects.all():
            cls.update_project_call_metrics(project_call)
        
        # Mettre à jour les métriques des compétitions
        for competition in Competition.objects.all():
            cls.update_competition_metrics(competition)
        
        # Mettre à jour les statistiques de la plateforme
        cls.update_platform_statistics()
