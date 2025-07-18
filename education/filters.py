import django_filters
from django.db.models import Q
from django.utils import timezone
from .models import Course, Module, Training, Enrollment, Progress, Lesson, Quiz, Question

class CourseFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains')
    description = django_filters.CharFilter(lookup_expr='icontains')
    level = django_filters.ChoiceFilter(choices=Course.LEVEL_CHOICES)
    duration_weeks = django_filters.NumberFilter()
    duration_range = django_filters.RangeFilter(field_name='duration_weeks')
    instructor = django_filters.CharFilter(field_name='instructor__username', lookup_expr='icontains')
    has_available_training = django_filters.BooleanFilter(method='filter_has_available_training')

    def filter_has_available_training(self, queryset, name, value):
        if value:
            return queryset.filter(
                trainings__start_date__gt=timezone.now(),
                trainings__is_active=True,
                trainings__current_participants__lt=F('trainings__max_participants')
            ).distinct()
        return queryset

    class Meta:
        model = Course
        fields = ['title', 'description', 'level', 'duration_weeks', 'instructor']

class ModuleFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains')
    description = django_filters.CharFilter(lookup_expr='icontains')
    course = django_filters.NumberFilter(field_name='course__id')
    duration_hours = django_filters.NumberFilter()
    duration_range = django_filters.RangeFilter(field_name='duration_hours')
    has_resources = django_filters.BooleanFilter(field_name='resources', lookup_expr='isnull', exclude=True)

    class Meta:
        model = Module
        fields = ['title', 'description', 'course', 'duration_hours', 'order']

class TrainingFilter(django_filters.FilterSet):
    course = django_filters.NumberFilter(field_name='course__id')
    start_date = django_filters.DateTimeFilter(lookup_expr='gte')
    end_date = django_filters.DateTimeFilter(lookup_expr='lte')
    is_active = django_filters.BooleanFilter()
    is_online = django_filters.BooleanFilter()
    has_available_seats = django_filters.BooleanFilter(method='filter_has_available_seats')
    location = django_filters.CharFilter(lookup_expr='icontains')

    def filter_has_available_seats(self, queryset, name, value):
        if value:
            return queryset.filter(current_participants__lt=F('max_participants'))
        return queryset

    class Meta:
        model = Training
        fields = ['course', 'start_date', 'end_date', 'is_active', 'is_online', 'location']

class EnrollmentFilter(django_filters.FilterSet):
    student = django_filters.CharFilter(field_name='student__username', lookup_expr='icontains')
    training = django_filters.NumberFilter(field_name='training__id')
    course = django_filters.NumberFilter(field_name='training__course__id')
    status = django_filters.ChoiceFilter(choices=Enrollment.STATUS_CHOICES)
    enrollment_date = django_filters.DateTimeFilter()
    completion_date = django_filters.DateTimeFilter()
    date_range = django_filters.DateTimeFromToRangeFilter(field_name='enrollment_date')

    class Meta:
        model = Enrollment
        fields = ['student', 'training', 'course', 'status', 'enrollment_date', 'completion_date']

class ProgressFilter(django_filters.FilterSet):
    module = django_filters.NumberFilter(field_name='module__id')
    enrollment = django_filters.NumberFilter(field_name='enrollment__id')
    status = django_filters.ChoiceFilter(choices=Progress.STATUS_CHOICES)
    score = django_filters.NumberFilter()
    score_range = django_filters.RangeFilter(field_name='score')
    completion_date = django_filters.DateTimeFilter()
    date_range = django_filters.DateTimeFromToRangeFilter(field_name='completion_date')

    class Meta:
        model = Progress
        fields = ['module', 'enrollment', 'status', 'score', 'completion_date']

class LessonFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains')
    module = django_filters.NumberFilter()
    created_at = django_filters.DateTimeFromToRangeFilter()

    class Meta:
        model = Lesson
        fields = ['title', 'module', 'created_at']

class QuizFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains')
    module = django_filters.NumberFilter()
    passing_score = django_filters.NumberFilter()
    created_at = django_filters.DateTimeFromToRangeFilter()

    class Meta:
        model = Quiz
        fields = ['title', 'module', 'passing_score', 'created_at']

class QuestionFilter(django_filters.FilterSet):
    quiz = django_filters.NumberFilter()
    question_type = django_filters.ChoiceFilter(choices=Question.QUESTION_TYPE_CHOICES)
    points = django_filters.NumberFilter()

    class Meta:
        model = Question
        fields = ['quiz', 'question_type', 'points']
