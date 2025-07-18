from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.urls import reverse
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib import messages
from django.utils import timezone
from django.db.models import Count, Q
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Course, Module, Content, Enrollment, Progress, Assignment, Submission
from .serializers import (
    CourseListSerializer, CourseDetailSerializer, ModuleSerializer,
    ContentSerializer, EnrollmentSerializer, ProgressSerializer,
    AssignmentSerializer, SubmissionSerializer
)
from .permissions import IsInstructorOrReadOnly, IsEnrolledOrInstructor
from courses.services import *
# API Views
class CourseViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsInstructorOrReadOnly]
    
    def get_queryset(self):
        
        queryset = Course.objects.annotate(
            enrolled_count=Count('enrollments'),
            module_count=Count('modules')
        )
        
        level = self.request.query_params.get('level', None)
        language = self.request.query_params.get('language', None)
        instructor = self.request.query_params.get('instructor', None)
        search = self.request.query_params.get('search', None)
        
        if level:
            queryset = queryset.filter(level=level)
        if language:
            queryset = queryset.filter(language=language)
        if instructor:
            queryset = queryset.filter(instructor__username=instructor)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(overview__icontains=search) |
                Q(description__icontains=search)
            )
            
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        return CourseDetailSerializer
    
    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def enroll(self, request, pk=None):
        course = self.get_object()
        user = request.user
        
        if Enrollment.objects.filter(course=course, student=user).exists():
            return Response(
                {'detail': 'Already enrolled'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        enrollment = Enrollment.objects.create(course=course, student=user)
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ModuleViewSet(viewsets.ModelViewSet):
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructorOrReadOnly]
    
    def get_queryset(self):
        return Module.objects.filter(course_id=self.kwargs['course_pk'])
    
    def perform_create(self, serializer):
        course = get_object_or_404(Course, pk=self.kwargs['course_pk'])
        serializer.save(course=course)

class ContentViewSet(viewsets.ModelViewSet):
    serializer_class = ContentSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructorOrReadOnly]
    
    def get_queryset(self):
        return Content.objects.filter(module_id=self.kwargs['module_pk'])
    
    def perform_create(self, serializer):
        module = get_object_or_404(Module, pk=self.kwargs['module_pk'])
        serializer.save(module=module)

class EnrollmentViewSet(viewsets.ModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Enrollment.objects.all()
        return Enrollment.objects.filter(Q(student=user) | Q(course__instructor=user))

class ProgressViewSet(viewsets.ModelViewSet):
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Progress.objects.filter(
            enrollment__student=self.request.user
        )

class AssignmentViewSet(viewsets.ModelViewSet):
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructorOrReadOnly]
    
    def get_queryset(self):
        return Assignment.objects.filter(
            content__module__course_id=self.kwargs['course_pk']
        )

class SubmissionViewSet(viewsets.ModelViewSet):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Submission.objects.all()
        return Submission.objects.filter(
            Q(student=user) | Q(assignment__content__module__course__instructor=user)
        )
    
    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

# Traditional Views
class CourseListView(ListView):
    model = Course
    template_name = 'courses/course_list.html'
    context_object_name = 'courses'
    paginate_by = 12
    
    def get_queryset(self):
        queryset = Course.objects.filter(status='published')
        
        # Filtrage
        level = self.request.GET.get('level')
        language = self.request.GET.get('language')
        search = self.request.GET.get('search')
        
        if level:
            queryset = queryset.filter(level=level)
        if language:
            queryset = queryset.filter(language=language)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(overview__icontains=search) |
                Q(description__icontains=search)
            )
            
        return queryset.annotate(
            enrolled_count=Count('enrollments'),
            module_count=Count('modules')
        )
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['levels'] = Course.LEVEL_CHOICES
        context['languages'] = Course.objects.values_list('language', flat=True).distinct()
        return context

class CourseDetailView(DetailView):
    model = Course
    template_name = 'courses/course_detail.html'
    context_object_name = 'course'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        course = self.get_object()
        user = self.request.user
        
        if user.is_authenticated:
            # Vérifier si l'utilisateur est inscrit
            context['is_enrolled'] = Enrollment.objects.filter(
                course=course,
                student=user
            ).exists()
            
            if context['is_enrolled']:
                # Obtenir les statistiques de progression
                context['progress'] = CourseService.get_course_progress(user, course)
                context['performance'] = CourseAnalyticsService.get_student_performance(user, course)
        
        # Statistiques du cours
        context['stats'] = CourseAnalyticsService.get_course_statistics(course)
        return context

class CourseCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Course
    template_name = 'courses/course_form.html'
    fields = ['title', 'overview', 'description', 'learning_objectives',
              'prerequisites', 'level', 'image', 'start_date', 'end_date',
              'language']
    
    def form_valid(self, form):
        form.instance.instructor = self.request.user
        return super().form_valid(form)
    
    def test_func(self):
        return self.request.user.role == 'mentor'

@login_required
def enroll_course(request, slug):
    course = get_object_or_404(Course, slug=slug)
    
    try:
        CourseService.enroll_student(request.user, course)
        messages.success(request, "Vous êtes maintenant inscrit à ce cours!")
    except ValidationError as e:
        messages.error(request, str(e))
    
    return redirect('courses:course_detail', slug=slug)

@login_required
def course_learn(request, slug):
    course = get_object_or_404(Course, slug=slug)
    enrollment = get_object_or_404(Enrollment, course=course, student=request.user)
    
    # Obtenir le contenu actuel ou le premier contenu du cours
    content_id = request.GET.get('content')
    if content_id:
        current_content = get_object_or_404(Content, id=content_id, module__course=course)
    else:
        first_module = course.modules.first()
        if first_module:
            current_content = first_module.contents.first()
        else:
            current_content = None
    
    # Marquer le contenu comme terminé si demandé
    if request.method == 'POST' and current_content:
        CourseService.mark_content_complete(request.user, current_content)
        messages.success(request, "Progression enregistrée!")
        
        # Rediriger vers le prochain contenu s'il existe
        next_content = Content.objects.filter(
            module__course=course,
            module__order__gte=current_content.module.order,
            order__gt=current_content.order
        ).first()
        
        if next_content:
            return redirect('courses:course_learn', slug=slug, content=next_content.id)
    
    context = {
        'course': course,
        'enrollment': enrollment,
        'current_content': current_content,
        'progress': CourseService.get_course_progress(request.user, course)
    }
    return render(request, 'courses/course_learn.html', context)

@login_required
def submit_assignment(request, content_id):
    content = get_object_or_404(Content, id=content_id)
    assignment = get_object_or_404(Assignment, content=content)
    
    if request.method == 'POST':
        try:
            submission = AssignmentService.submit_assignment(
                user=request.user,
                assignment=assignment,
                file=request.FILES['submission_file'],
                comments=request.POST.get('comments', '')
            )
            messages.success(request, "Devoir soumis avec succès!")
            return redirect('courses:course_learn', slug=content.module.course.slug)
        except ValidationError as e:
            messages.error(request, str(e))
    
    context = {
        'assignment': assignment,
        'previous_submissions': Submission.objects.filter(
            student=request.user,
            assignment=assignment
        )
    }
    return render(request, 'courses/assignment_submit.html', context)

@login_required
def grade_submission(request, submission_id):
    submission = get_object_or_404(Submission, id=submission_id)
    course = submission.assignment.content.module.course
    
    # Vérifier si l'utilisateur est l'instructeur du cours
    if request.user != course.instructor:
        messages.error(request, "Vous n'êtes pas autorisé à noter ce devoir.")
        return redirect('courses:course_detail', slug=course.slug)
    
    if request.method == 'POST':
        try:
            AssignmentService.grade_submission(
                submission=submission,
                grader=request.user,
                score=int(request.POST['score']),
                comments=request.POST.get('feedback', '')
            )
            messages.success(request, "Note attribuée avec succès!")
            return redirect('courses:submission_list', course_slug=course.slug)
        except ValidationError as e:
            messages.error(request, str(e))
    
    context = {
        'submission': submission,
        'max_score': submission.assignment.max_score
    }
    return render(request, 'courses/grade_submission.html', context)

class SubmissionListView(LoginRequiredMixin, UserPassesTestMixin, ListView):
    model = Submission
    template_name = 'courses/submission_list.html'
    context_object_name = 'submissions'
    paginate_by = 20
    
    def get_queryset(self):
        self.course = get_object_or_404(Course, slug=self.kwargs['course_slug'])
        return Submission.objects.filter(
            assignment__content__module__course=self.course
        ).select_related('student', 'assignment')
    
    def test_func(self):
        return self.request.user == self.course.instructor
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['course'] = self.course
        return context

# Vues pour les modules
class ModuleCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Module
    template_name = 'courses/module_form.html'
    fields = ['title', 'description', 'order']
    
    def form_valid(self, form):
        course = get_object_or_404(Course, slug=self.kwargs['slug'])
        form.instance.course = course
        return super().form_valid(form)
    
    def test_func(self):
        course = get_object_or_404(Course, slug=self.kwargs['slug'])
        return self.request.user == course.instructor
    
    def get_success_url(self):
        return reverse('courses:course_detail', kwargs={'slug': self.kwargs['slug']})

class ModuleUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Module
    template_name = 'courses/module_form.html'
    fields = ['title', 'description', 'order']
    
    def test_func(self):
        module = self.get_object()
        return self.request.user == module.course.instructor
    
    def get_success_url(self):
        return reverse('courses:course_detail', kwargs={'slug': self.object.course.slug})

class ModuleDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Module
    template_name = 'courses/module_confirm_delete.html'
    
    def test_func(self):
        module = self.get_object()
        return self.request.user == module.course.instructor
    
    def get_success_url(self):
        return reverse('courses:course_detail', kwargs={'slug': self.object.course.slug})

# Vues pour les contenus
class ContentCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Content
    template_name = 'courses/content_form.html'
    fields = ['title', 'content_type', 'text', 'video_url', 'file', 'order']
    
    def form_valid(self, form):
        module = get_object_or_404(Module, id=self.kwargs['module_id'])
        form.instance.module = module
        return super().form_valid(form)
    
    def test_func(self):
        module = get_object_or_404(Module, id=self.kwargs['module_id'])
        return self.request.user == module.course.instructor
    
    def get_success_url(self):
        return reverse('courses:course_detail', kwargs={'slug': self.object.module.course.slug})

class ContentUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Content
    template_name = 'courses/content_form.html'
    fields = ['title', 'content_type', 'text', 'video_url', 'file', 'order']
    
    def test_func(self):
        content = self.get_object()
        return self.request.user == content.module.course.instructor
    
    def get_success_url(self):
        return reverse('courses:course_detail', kwargs={'slug': self.object.module.course.slug})

class ContentDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Content
    template_name = 'courses/content_confirm_delete.html'
    
    def test_func(self):
        content = self.get_object()
        return self.request.user == content.module.course.instructor
    
    def get_success_url(self):
        return reverse('courses:course_detail', kwargs={'slug': self.object.module.course.slug})

# Vues pour les statistiques et la progression
class CourseProgressView(LoginRequiredMixin, DetailView):
    model = Course
    template_name = 'courses/course_progress.html'
    context_object_name = 'course'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        course = self.get_object()
        user = self.request.user
        
        try:
            enrollment = Enrollment.objects.get(student=user, course=course)
            context['enrollment'] = enrollment
            context['progress'] = CourseService.get_course_progress(user, course)
            context['performance'] = CourseAnalyticsService.get_student_performance(user, course)
            
            # Progression par module
            modules_progress = {}
            for module in course.modules.all():
                total_contents = module.contents.count()
                completed_contents = Progress.objects.filter(
                    enrollment=enrollment,
                    content__module=module,
                    completed=True
                ).count()
                
                if total_contents > 0:
                    progress_percent = (completed_contents / total_contents) * 100
                else:
                    progress_percent = 0
                    
                modules_progress[module] = {
                    'total': total_contents,
                    'completed': completed_contents,
                    'percent': progress_percent
                }
                
            context['modules_progress'] = modules_progress
            
        except Enrollment.DoesNotExist:
            messages.error(self.request, "Vous n'êtes pas inscrit à ce cours.")
            return redirect('courses:course_detail', slug=course.slug)
            
        return context

class CourseAnalyticsView(LoginRequiredMixin, UserPassesTestMixin, DetailView):
    model = Course
    template_name = 'courses/course_analytics.html'
    context_object_name = 'course'
    
    def test_func(self):
        course = self.get_object()
        return self.request.user == course.instructor
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        course = self.get_object()
        
        # Statistiques générales du cours
        context['stats'] = CourseAnalyticsService.get_course_statistics(course)
        
        # Progression des étudiants
        student_progress = []
        for enrollment in course.enrollments.filter(status='enrolled'):
            progress = CourseService.get_course_progress(enrollment.student, course)
            performance = CourseAnalyticsService.get_student_performance(enrollment.student, course)
            
            student_progress.append({
                'student': enrollment.student,
                'progress': progress,
                'performance': performance
            })
            
        context['student_progress'] = student_progress
        
        # Statistiques des devoirs
        assignments = Assignment.objects.filter(content__module__course=course)
        assignment_stats = []
        
        for assignment in assignments:
            submissions = Submission.objects.filter(assignment=assignment)
            stats = {
                'assignment': assignment,
                'total_submissions': submissions.count(),
                'graded_submissions': submissions.filter(status='graded').count(),
                'average_score': submissions.filter(status='graded').aggregate(Avg('score'))['score__avg'] or 0
            }
            assignment_stats.append(stats)
            
        context['assignment_stats'] = assignment_stats
        
        return context
