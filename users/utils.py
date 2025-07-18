from django.db.models import Count, Avg
from django.utils import timezone
from datetime import timedelta
from .models import User, Mentor, Entrepreneur, Stakeholder

def get_user_stats():
    """Get general user statistics."""
    now = timezone.now()
    last_month = now - timedelta(days=30)
    
    total_users = User.objects.count()
    active_users = User.objects.filter(last_login__gte=last_month).count()
    role_distribution = User.objects.values('role').annotate(count=Count('id'))
    new_users = User.objects.filter(date_joined__gte=last_month).count()
    
    return {
        'total_users': total_users,
        'active_users': active_users,
        'role_distribution': role_distribution,
        'new_users': new_users
    }

def get_mentor_stats():
    """Get mentor-specific statistics."""
    avg_experience = Mentor.objects.aggregate(avg_years=Avg('years_experience'))
    expertise_distribution = Mentor.objects.values(
        'expertise__name'
    ).annotate(count=Count('id'))
    availability_distribution = Mentor.objects.values(
        'availability'
    ).annotate(count=Count('id'))
    
    return {
        'avg_experience': avg_experience['avg_years'] or 0,
        'expertise_distribution': expertise_distribution,
        'availability_distribution': availability_distribution
    }

def get_entrepreneur_stats():
    """Get entrepreneur-specific statistics."""
    industry_distribution = Entrepreneur.objects.values(
        'industry'
    ).annotate(count=Count('id'))
    experience_distribution = Entrepreneur.objects.values(
        'experience_level'
    ).annotate(count=Count('id'))
    
    return {
        'industry_distribution': industry_distribution,
        'experience_distribution': experience_distribution
    }

def get_stakeholder_stats():
    """Get stakeholder-specific statistics."""
    sector_distribution = Stakeholder.objects.values(
        'sector'
    ).annotate(count=Count('id'))
    role_distribution = Stakeholder.objects.values(
        'role'
    ).annotate(count=Count('id'))
    
    return {
        'sector_distribution': sector_distribution,
        'role_distribution': role_distribution
    }
