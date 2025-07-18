from django.db.models import Count, Avg, F, ExpressionWrapper, fields
from django.utils import timezone
from datetime import timedelta
from .models import Course, Module, Enrollment, Progress

def get_course_stats():
    """Get course-related statistics."""
    now = timezone.now()
    last_month = now - timedelta(days=30)
    
    total_courses = Course.objects.count()
    active_courses = Course.objects.filter(is_active=True).count()
    category_distribution = Course.objects.values('category').annotate(count=Count('id'))
    level_distribution = Course.objects.values('level').annotate(count=Count('id'))
    avg_students = Course.objects.annotate(
        student_count=Count('students')
    ).aggregate(avg=Avg('student_count'))
    
    return {
        'total_courses': total_courses,
        'active_courses': active_courses,
        'category_distribution': category_distribution,
        'level_distribution': level_distribution,
        'avg_students_per_course': avg_students['avg'] or 0
    }

def get_enrollment_stats():
    """Get enrollment-related statistics."""
    now = timezone.now()
    last_month = now - timedelta(days=30)
    
    total_enrollments = Enrollment.objects.count()
    recent_enrollments = Enrollment.objects.filter(
        enrolled_at__gte=last_month
    ).count()
    completion_rate = Enrollment.objects.filter(
        status='COMPLETED'
    ).count() / total_enrollments if total_enrollments > 0 else 0
    status_distribution = Enrollment.objects.values(
        'status'
    ).annotate(count=Count('id'))
    
    return {
        'total_enrollments': total_enrollments,
        'recent_enrollments': recent_enrollments,
        'completion_rate': completion_rate,
        'status_distribution': status_distribution
    }

def get_progress_stats():
    """Get progress-related statistics."""
    total_progress = Progress.objects.count()
    completed_modules = Progress.objects.filter(status='COMPLETED').count()
    completion_rate = completed_modules / total_progress if total_progress > 0 else 0
    
    avg_completion_time = Progress.objects.filter(
        status='COMPLETED',
        completed_at__isnull=False
    ).annotate(
        duration=ExpressionWrapper(
            F('completed_at') - F('created_at'),
            output_field=fields.DurationField()
        )
    ).aggregate(avg_time=Avg('duration'))
    
    return {
        'total_progress_entries': total_progress,
        'completed_modules': completed_modules,
        'completion_rate': completion_rate,
        'avg_completion_time': avg_completion_time['avg_time']
    }

def get_student_progress(student):
    """Get progress statistics for a specific student."""
    enrollments = Enrollment.objects.filter(student=student)
    total_courses = enrollments.count()
    completed_courses = enrollments.filter(status='COMPLETED').count()
    
    progress = Progress.objects.filter(enrollment__student=student)
    total_modules = progress.count()
    completed_modules = progress.filter(status='COMPLETED').count()
    
    return {
        'total_courses': total_courses,
        'completed_courses': completed_courses,
        'completion_rate': completed_courses / total_courses if total_courses > 0 else 0,
        'total_modules': total_modules,
        'completed_modules': completed_modules,
        'module_completion_rate': completed_modules / total_modules if total_modules > 0 else 0
    }
