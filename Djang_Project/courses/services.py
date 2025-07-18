from django.db.models import Q, Count, Avg
from django.utils import timezone
from django.core.exceptions import ValidationError
from .models import Course, Module, Content, Enrollment, Progress, Assignment, Submission

class CourseService:
    @staticmethod
    def get_available_courses(user=None):
        """
        Récupère les cours disponibles avec filtrage optionnel par utilisateur
        """
        courses = Course.objects.filter(status='published')
        
        if user and user.is_authenticated:
            # Exclure les cours où l'utilisateur est déjà inscrit
            enrolled_courses = user.courses_enrolled.all()
            courses = courses.exclude(id__in=[c.id for c in enrolled_courses])
            
        return courses.select_related('instructor')

    @staticmethod
    def get_course_progress(user, course):
        """
        Calcule la progression d'un utilisateur dans un cours
        """
        try:
            enrollment = Enrollment.objects.get(student=user, course=course)
            total_contents = Content.objects.filter(module__course=course).count()
            completed_contents = Progress.objects.filter(
                enrollment=enrollment,
                completed=True
            ).count()
            
            if total_contents == 0:
                return 0
            return (completed_contents / total_contents) * 100
        except Enrollment.DoesNotExist:
            return 0

    @staticmethod
    def enroll_student(user, course):
        """
        Inscrit un étudiant à un cours
        """
        if Enrollment.objects.filter(student=user, course=course).exists():
            raise ValidationError("L'étudiant est déjà inscrit à ce cours")
            
        return Enrollment.objects.create(student=user, course=course)

    @staticmethod
    def mark_content_complete(user, content):
        """
        Marque un contenu comme terminé pour un utilisateur
        """
        enrollment = Enrollment.objects.get(
            student=user,
            course=content.module.course
        )
        
        progress, created = Progress.objects.get_or_create(
            enrollment=enrollment,
            content=content,
            defaults={'completed': True, 'completed_at': timezone.now()}
        )
        
        if not created and not progress.completed:
            progress.completed = True
            progress.completed_at = timezone.now()
            progress.save()
            
        return progress

class AssignmentService:
    @staticmethod
    def submit_assignment(user, assignment, file, comments=''):
        """
        Soumet un devoir
        """
        if not Enrollment.objects.filter(
            student=user,
            course=assignment.content.module.course,
            status='enrolled'
        ).exists():
            raise ValidationError("L'étudiant n'est pas inscrit à ce cours")
            
        if Submission.objects.filter(
            student=user,
            assignment=assignment,
            status__in=['submitted', 'graded']
        ).exists():
            raise ValidationError("Un devoir a déjà été soumis")
            
        return Submission.objects.create(
            assignment=assignment,
            student=user,
            file=file,
            comments=comments
        )

    @staticmethod
    def grade_submission(submission, grader, score, comments=''):
        """
        Note une soumission de devoir
        """
        if submission.status == 'graded':
            raise ValidationError("Cette soumission a déjà été notée")
            
        if score > submission.assignment.max_score:
            raise ValidationError(f"Le score ne peut pas dépasser {submission.assignment.max_score}")
            
        submission.score = score
        submission.comments = comments
        submission.status = 'graded'
        submission.graded_by = grader
        submission.graded_at = timezone.now()
        submission.save()
        
        return submission

class CourseAnalyticsService:
    @staticmethod
    def get_course_statistics(course):
        """
        Récupère les statistiques d'un cours
        """
        total_students = course.enrollments.count()
        active_students = course.enrollments.filter(status='enrolled').count()
        completion_rate = course.enrollments.filter(status='completed').count() / total_students if total_students > 0 else 0
        
        # Moyenne des scores des devoirs
        assignments = Assignment.objects.filter(content__module__course=course)
        avg_scores = Submission.objects.filter(
            assignment__in=assignments,
            status='graded'
        ).aggregate(avg_score=Avg('score'))
        
        return {
            'total_students': total_students,
            'active_students': active_students,
            'completion_rate': completion_rate * 100,
            'average_score': avg_scores['avg_score'] or 0
        }

    @staticmethod
    def get_student_performance(user, course):
        """
        Récupère les performances d'un étudiant dans un cours
        """
        try:
            enrollment = Enrollment.objects.get(student=user, course=course)
            
            # Progression globale
            progress = CourseService.get_course_progress(user, course)
            
            # Moyenne des devoirs
            submissions = Submission.objects.filter(
                student=user,
                assignment__content__module__course=course,
                status='graded'
            )
            avg_score = submissions.aggregate(avg_score=Avg('score'))['avg_score'] or 0
            
            return {
                'enrollment_status': enrollment.status,
                'progress': progress,
                'average_score': avg_score,
                'completed_contents': Progress.objects.filter(
                    enrollment=enrollment,
                    completed=True
                ).count()
            }
        except Enrollment.DoesNotExist:
            return None
