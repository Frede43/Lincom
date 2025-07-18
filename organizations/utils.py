from django.db.models import Count, Avg, Sum, F, ExpressionWrapper, fields
from django.utils import timezone
from datetime import timedelta
from .models import Organization, CallForProject, Competition, Submission

def get_organization_stats():
    """Get organization-related statistics."""
    now = timezone.now()
    last_month = now - timedelta(days=30)
    
    total_organizations = Organization.objects.count()
    new_organizations = Organization.objects.filter(
        created_at__gte=last_month
    ).count()
    sector_distribution = Organization.objects.values(
        'sector'
    ).annotate(count=Count('id'))
    avg_stakeholders = Organization.objects.annotate(
        stakeholder_count=Count('stakeholders')
    ).aggregate(avg=Avg('stakeholder_count'))
    
    return {
        'total_organizations': total_organizations,
        'new_organizations': new_organizations,
        'sector_distribution': sector_distribution,
        'avg_stakeholders_per_org': avg_stakeholders['avg'] or 0
    }

def get_call_for_project_stats():
    """Get call for project statistics."""
    total_calls = CallForProject.objects.count()
    active_calls = CallForProject.objects.filter(status='OPEN').count()
    status_distribution = CallForProject.objects.values(
        'status'
    ).annotate(count=Count('id'))
    avg_submissions = CallForProject.objects.annotate(
        submission_count=Count('submissions')
    ).aggregate(avg=Avg('submission_count'))
    total_budget = CallForProject.objects.aggregate(
        total=Sum('budget_range_max')
    )
    
    return {
        'total_calls': total_calls,
        'active_calls': active_calls,
        'status_distribution': status_distribution,
        'avg_submissions_per_call': avg_submissions['avg'] or 0,
        'total_budget': total_budget['total'] or 0
    }

def get_competition_stats():
    """Get competition-related statistics."""
    total_competitions = Competition.objects.count()
    active_competitions = Competition.objects.filter(status='ONGOING').count()
    status_distribution = Competition.objects.values(
        'status'
    ).annotate(count=Count('id'))
    avg_submissions = Competition.objects.annotate(
        submission_count=Count('submissions')
    ).aggregate(avg=Avg('submission_count'))
    
    return {
        'total_competitions': total_competitions,
        'active_competitions': active_competitions,
        'status_distribution': status_distribution,
        'avg_submissions_per_competition': avg_submissions['avg'] or 0
    }

def get_submission_stats():
    """Get submission-related statistics."""
    total_submissions = Submission.objects.count()
    status_distribution = Submission.objects.values(
        'status'
    ).annotate(count=Count('id'))
    avg_evaluation_time = Submission.objects.filter(
        status='EVALUATED',
        evaluated_at__isnull=False
    ).annotate(
        duration=ExpressionWrapper(
            F('evaluated_at') - F('submitted_at'),
            output_field=fields.DurationField()
        )
    ).aggregate(avg_time=Avg('duration'))
    
    return {
        'total_submissions': total_submissions,
        'status_distribution': status_distribution,
        'avg_evaluation_time': avg_evaluation_time['avg_time']
    }

def get_organization_performance(organization):
    """Get performance statistics for a specific organization."""
    calls = CallForProject.objects.filter(organization=organization)
    total_calls = calls.count()
    active_calls = calls.filter(status='OPEN').count()
    
    competitions = Competition.objects.filter(organization=organization)
    total_competitions = competitions.count()
    active_competitions = competitions.filter(status='ONGOING').count()
    
    submissions = Submission.objects.filter(
        models.Q(call_for_project__organization=organization) |
        models.Q(competition__organization=organization)
    )
    total_submissions = submissions.count()
    successful_submissions = submissions.filter(status='ACCEPTED').count()
    
    return {
        'total_calls': total_calls,
        'active_calls': active_calls,
        'total_competitions': total_competitions,
        'active_competitions': active_competitions,
        'total_submissions': total_submissions,
        'successful_submissions': successful_submissions,
        'submission_success_rate': successful_submissions / total_submissions if total_submissions > 0 else 0,
        'total_budget': calls.aggregate(total=Sum('budget_range_max'))['total'] or 0
    }
