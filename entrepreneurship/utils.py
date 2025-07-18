from django.db.models import Count, Avg, Sum, F, ExpressionWrapper, fields
from django.utils import timezone
from datetime import timedelta
from .models import Startup, Project, Milestone, Resource

def get_startup_stats():
    """Get startup-related statistics."""
    now = timezone.now()
    last_month = now - timedelta(days=30)
    
    total_startups = Startup.objects.count()
    new_startups = Startup.objects.filter(created_at__gte=last_month).count()
    industry_distribution = Startup.objects.values('industry').annotate(count=Count('id'))
    avg_mentors = Startup.objects.annotate(
        mentor_count=Count('mentors')
    ).aggregate(avg=Avg('mentor_count'))
    
    return {
        'total_startups': total_startups,
        'new_startups': new_startups,
        'industry_distribution': industry_distribution,
        'avg_mentors_per_startup': avg_mentors['avg'] or 0
    }

def get_project_stats():
    """Get project-related statistics."""
    now = timezone.now()
    
    total_projects = Project.objects.count()
    active_projects = Project.objects.filter(status='ONGOING').count()
    status_distribution = Project.objects.values('status').annotate(count=Count('id'))
    total_budget = Project.objects.aggregate(total=Sum('budget'))
    avg_duration = Project.objects.annotate(
        duration=ExpressionWrapper(
            F('end_date') - F('start_date'),
            output_field=fields.DurationField()
        )
    ).aggregate(avg_time=Avg('duration'))
    
    return {
        'total_projects': total_projects,
        'active_projects': active_projects,
        'status_distribution': status_distribution,
        'total_budget': total_budget['total'] or 0,
        'avg_project_duration': avg_duration['avg_time']
    }

def get_milestone_stats():
    """Get milestone-related statistics."""
    total_milestones = Milestone.objects.count()
    completed_milestones = Milestone.objects.filter(completed=True).count()
    completion_rate = completed_milestones / total_milestones if total_milestones > 0 else 0
    
    avg_completion_time = Milestone.objects.filter(
        completed=True,
        completed_at__isnull=False
    ).annotate(
        duration=ExpressionWrapper(
            F('completed_at') - F('created_at'),
            output_field=fields.DurationField()
        )
    ).aggregate(avg_time=Avg('duration'))
    
    return {
        'total_milestones': total_milestones,
        'completed_milestones': completed_milestones,
        'completion_rate': completion_rate,
        'avg_completion_time': avg_completion_time['avg_time']
    }

def get_resource_stats():
    """Get resource-related statistics."""
    total_resources = Resource.objects.count()
    type_distribution = Resource.objects.values('resource_type').annotate(count=Count('id'))
    resources_per_project = Resource.objects.values('project').annotate(
        count=Count('id')
    ).aggregate(avg=Avg('count'))
    
    return {
        'total_resources': total_resources,
        'type_distribution': type_distribution,
        'avg_resources_per_project': resources_per_project['avg'] or 0
    }

def get_startup_performance(startup):
    """Get performance statistics for a specific startup."""
    projects = Project.objects.filter(startup=startup)
    total_projects = projects.count()
    completed_projects = projects.filter(status='COMPLETED').count()
    
    milestones = Milestone.objects.filter(project__startup=startup)
    total_milestones = milestones.count()
    completed_milestones = milestones.filter(completed=True).count()
    
    return {
        'total_projects': total_projects,
        'completed_projects': completed_projects,
        'project_completion_rate': completed_projects / total_projects if total_projects > 0 else 0,
        'total_milestones': total_milestones,
        'completed_milestones': completed_milestones,
        'milestone_completion_rate': completed_milestones / total_milestones if total_milestones > 0 else 0,
        'total_budget': projects.aggregate(total=Sum('budget'))['total'] or 0
    }
