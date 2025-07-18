from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.utils import timezone
from django.db.models import Count, Avg, F, Q
from .models import (
    Course, Module, Training, Enrollment, Progress,
    Lesson, Quiz, Question, UserProgress, QuizAttempt, QuestionResponse
)
from .serializers import (
    CourseSerializer, CourseDetailSerializer,
    ModuleSerializer, TrainingSerializer,
    EnrollmentSerializer, EnrollmentDetailSerializer,
    ProgressSerializer,
    LessonSerializer, QuizSerializer, QuestionSerializer
)
from .permissions import (
    IsCourseOwnerOrReadOnly, IsEnrolledOrInstructor,
    IsEnrollmentOwner
)
from .filters import (
    CourseFilter, ModuleFilter, TrainingFilter,
    EnrollmentFilter, ProgressFilter,
    LessonFilter, QuizFilter, QuestionFilter
)

class CourseViewSet(viewsets.ModelViewSet):
    """API endpoint for managing courses."""
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = CourseFilter
    search_fields = ['title', 'description']

    def get_permissions(self):
        """Return custom permissions based on action."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseSerializer

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

    def perform_update(self, serializer):
        # Only allow staff or the instructor to update
        course = self.get_object()
        if not (self.request.user.is_staff or course.instructor == self.request.user):
            raise PermissionDenied("You don't have permission to update this course")
        serializer.save()

    def perform_destroy(self, instance):
        # Only allow staff or the instructor to delete
        if not (self.request.user.is_staff or instance.instructor == self.request.user):
            raise PermissionDenied("You don't have permission to delete this course")
        instance.delete()

    def get_queryset(self):
        return self.queryset.prefetch_related(
            'modules',
            'trainings'
        ).select_related('instructor')

    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        course = self.get_object()
        return Response({
            'total_students': course.trainings.aggregate(
                total=Count('enrollments__student', distinct=True)
            )['total'],
            'active_trainings': course.trainings.filter(
                start_date__lte=timezone.now(),
                end_date__gte=timezone.now(),
                is_active=True
            ).count(),
            'upcoming_trainings': course.trainings.filter(
                start_date__gt=timezone.now(),
                is_active=True
            ).count(),
            'average_rating': course.trainings.aggregate(
                avg=Avg('enrollments__rating')
            )['avg'] or 0
        })

    @action(detail=True, methods=['get'])
    def modules(self, request, pk=None):
        """Get all modules for a course."""
        course = self.get_object()
        modules = course.modules.all()
        serializer = ModuleSerializer(modules, many=True)
        return Response(serializer.data)

class ModuleViewSet(viewsets.ModelViewSet):
    """API endpoint pour gérer les modules de cours."""
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated, IsEnrolledOrInstructor]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ModuleFilter
    search_fields = ['title', 'description']
    ordering_fields = ['order', 'duration_hours']
    ordering = ['order']

    def get_queryset(self):
        return self.queryset.select_related('course').prefetch_related('resources')

    @action(detail=True, methods=['get'])
    def progress_stats(self, request, pk=None):
        module = self.get_object()
        return Response({
            'total_students': module.progress_records.count(),
            'completed': module.progress_records.filter(status='completed').count(),
            'in_progress': module.progress_records.filter(status='in_progress').count(),
            'average_score': module.progress_records.filter(
                score__isnull=False
            ).aggregate(avg=Avg('score'))['avg'] or 0
        })

    @action(detail=True, methods=['post'])
    def reorder(self, request, pk=None):
        """Reorder a module within its course."""
        module = self.get_object()
        new_order = request.data.get('order')
        
        if new_order is None:
            return Response(
                {'error': 'New order is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            new_order = int(new_order)
        except (TypeError, ValueError):
            return Response(
                {'error': 'Order must be a valid integer'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get all modules for the course
        modules = Module.objects.filter(course=module.course).exclude(pk=module.pk)
        
        # If moving down, shift up all modules between old and new position
        if new_order > module.order:
            modules.filter(order__gt=module.order, order__lte=new_order).update(
                order=F('order') - 1
            )
        # If moving up, shift down all modules between new and old position
        elif new_order < module.order:
            modules.filter(order__gte=new_order, order__lt=module.order).update(
                order=F('order') + 1
            )
        
        # Set the new order for the target module
        module.order = new_order
        module.save()

        return Response(ModuleSerializer(module).data)

class TrainingViewSet(viewsets.ModelViewSet):
    """API endpoint pour gérer les sessions de formation."""
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = TrainingFilter
    search_fields = ['course__title', 'description', 'location']
    ordering_fields = ['start_date', 'end_date', 'registration_deadline']
    ordering = ['start_date']

    def get_queryset(self):
        return self.queryset.select_related('course').prefetch_related('enrollments')

    @action(detail=True, methods=['post'])
    def register(self, request, pk=None):
        training = self.get_object()
        
        if training.current_participants >= training.max_participants:
            return Response(
                {'error': 'Training session is full'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if timezone.now() > training.registration_deadline:
            return Response(
                {'error': 'Registration deadline has passed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not training.is_active:
            return Response(
                {'error': 'Training session is not active'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Vérifier si l'utilisateur est déjà inscrit
        if Enrollment.objects.filter(
            student=request.user,
            training=training
        ).exists():
            return Response(
                {'error': 'Already registered for this training'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Créer l'inscription
        enrollment = Enrollment.objects.create(
            student=request.user,
            training=training,
            status='pending'
        )
        
        # Mettre à jour le nombre de participants
        training.current_participants = F('current_participants') + 1
        training.save()
        
        return Response(
            EnrollmentSerializer(enrollment).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        training = self.get_object()
        return Response({
            'total_enrollments': training.enrollments.count(),
            'completed': training.enrollments.filter(status='completed').count(),
            'pending': training.enrollments.filter(status='pending').count(),
            'available_seats': max(0, training.max_participants - training.current_participants),
            'average_rating': training.enrollments.filter(
                rating__isnull=False
            ).aggregate(avg=Avg('rating'))['avg'] or 0
        })

class EnrollmentViewSet(viewsets.ModelViewSet):
    """API endpoint pour gérer les inscriptions aux formations."""
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsEnrollmentOwner]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = EnrollmentFilter
    search_fields = ['training__course__title', 'student__username']
    ordering_fields = ['enrollment_date', 'completion_date']
    ordering = ['-enrollment_date']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Enrollment.objects.all()
        return Enrollment.objects.filter(
            Q(student=user) | Q(training__course__instructor=user)
        )

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EnrollmentDetailSerializer
        return self.serializer_class

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        enrollment = self.get_object()
        if enrollment.status != 'approved':
            return Response(
                {'error': 'Enrollment must be approved before completion'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        enrollment.status = 'completed'
        enrollment.completion_date = timezone.now()
        enrollment.save()
        return Response({'status': 'Enrollment completed successfully'})

    @action(detail=False, methods=['get'])
    def stats(self, request):
        user = request.user
        enrollments = self.get_queryset().filter(student=user)
        
        return Response({
            'total_enrollments': enrollments.count(),
            'completed_courses': enrollments.filter(status='completed').count(),
            'in_progress': enrollments.filter(status='approved').count(),
            'average_rating': enrollments.filter(
                rating__isnull=False
            ).aggregate(avg=Avg('rating'))['avg'] or 0
        })

class ProgressViewSet(viewsets.ModelViewSet):
    """API endpoint pour gérer la progression des étudiants dans les modules."""
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated, IsEnrollmentOwner]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProgressFilter
    search_fields = ['enrollment__training__course__title', 'module__title']
    ordering_fields = ['start_date', 'completion_date']
    ordering = ['module__order']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Progress.objects.all()
        return Progress.objects.filter(
            Q(enrollment__student=user) |
            Q(enrollment__training__course__instructor=user)
        )

    @action(detail=True, methods=['post'])
    def complete_module(self, request, pk=None):
        progress = self.get_object()
        if progress.status == 'completed':
            return Response(
                {'error': 'Module already completed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        progress.status = 'completed'
        progress.completion_date = timezone.now()
        progress.save()
        return Response({'status': 'Module completed successfully'})

    @action(detail=False, methods=['get'])
    def stats(self, request):
        user = request.user
        progress_records = self.get_queryset().filter(
            enrollment__student=user
        )
        
        return Response({
            'total_modules': progress_records.count(),
            'completed_modules': progress_records.filter(status='completed').count(),
            'in_progress': progress_records.filter(status='in_progress').count(),
            'average_score': progress_records.filter(
                score__isnull=False
            ).aggregate(avg=Avg('score'))['avg'] or 0
        })

class LessonViewSet(viewsets.ModelViewSet):
    """API endpoint for managing lessons."""
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated, IsEnrolledOrInstructor]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = LessonFilter
    search_fields = ['title', 'content']
    ordering_fields = ['order', 'created_at']
    ordering = ['order']

    def get_queryset(self):
        return self.queryset.select_related('module')

    @action(detail=True, methods=['post'])
    def mark_completed(self, request, pk=None):
        """Mark a lesson as completed for the current user."""
        lesson = self.get_object()
        user = request.user
        
        # Get or create user progress for the course
        user_progress, created = UserProgress.objects.get_or_create(
            user=user,
            course=lesson.module.course
        )
        
        # Mark lesson as completed
        user_progress.completed_lessons.add(lesson)
        
        # Check if all lessons in module are completed
        module = lesson.module
        total_lessons = module.lessons.count()
        completed_lessons = user_progress.completed_lessons.filter(module=module).count()
        
        if total_lessons == completed_lessons:
            user_progress.completed_modules.add(module)
        
        # Update progress percentage
        total_course_lessons = sum(m.lessons.count() for m in lesson.module.course.modules.all())
        total_completed = user_progress.completed_lessons.count()
        user_progress.progress_percentage = (total_completed / total_course_lessons) * 100
        user_progress.save()
        
        return Response({'status': 'success'})

class QuizViewSet(viewsets.ModelViewSet):
    """API endpoint for managing quizzes."""
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated, IsEnrolledOrInstructor]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = QuizFilter
    search_fields = ['title', 'description']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return self.queryset.select_related('module')

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit answers for a quiz."""
        quiz = self.get_object()
        user = request.user
        answers = request.data.get('answers', [])
        
        # Create quiz attempt
        attempt = QuizAttempt.objects.create(
            user=user,
            quiz=quiz,
            score=0,
            passed=False
        )
        
        total_points = 0
        earned_points = 0
        
        # Process each answer
        for answer in answers:
            question_id = answer.get('question')
            answer_text = answer.get('answer')
            
            try:
                question = Question.objects.get(id=question_id, quiz=quiz)
            except Question.DoesNotExist:
                continue
                
            # Check if answer is correct
            is_correct = answer_text == question.correct_answer
            points = question.points if is_correct else 0
            
            # Create response
            QuestionResponse.objects.create(
                attempt=attempt,
                question=question,
                answer=answer_text,
                is_correct=is_correct,
                points_earned=points
            )
            
            total_points += question.points
            earned_points += points
        
        # Calculate final score and update attempt
        if total_points > 0:
            final_score = (earned_points / total_points) * 100
            attempt.score = final_score
            attempt.passed = final_score >= quiz.passing_score
            attempt.end_time = timezone.now()
            attempt.save()
            
            # If passed, update user progress
            if attempt.passed:
                user_progress, created = UserProgress.objects.get_or_create(
                    user=user,
                    course=quiz.module.course
                )
                user_progress.completed_quizzes.add(quiz)
                
                # Check if all quizzes in module are completed
                module = quiz.module
                total_quizzes = module.quizzes.count()
                completed_quizzes = user_progress.completed_quizzes.filter(module=module).count()
                
                if total_quizzes == completed_quizzes:
                    user_progress.completed_modules.add(module)
                
                user_progress.save()
        
        return Response({
            'score': attempt.score,
            'passed': attempt.passed,
            'total_points': total_points,
            'earned_points': earned_points
        })

class QuestionViewSet(viewsets.ModelViewSet):
    """API endpoint for managing quiz questions."""
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsEnrolledOrInstructor]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = QuestionFilter
    search_fields = ['text']
    ordering_fields = ['order']
    ordering = ['order']

    def get_queryset(self):
        return self.queryset.select_related('quiz')
