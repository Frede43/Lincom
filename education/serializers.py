from rest_framework import serializers
from .models import Course, Module, Resource, Training, Enrollment, Progress, Lesson, Quiz, Question
from django.db.models import Count

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class ModuleSerializer(serializers.ModelSerializer):
    resources = ResourceSerializer(many=True, read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class TrainingSerializer(serializers.ModelSerializer):
    course_details = CourseSerializer(source='course', read_only=True)
    available_seats = serializers.SerializerMethodField()
    is_registration_open = serializers.SerializerMethodField()

    class Meta:
        model = Training
        fields = ('id', 'course', 'course_details', 'start_date', 'end_date', 
                 'max_participants', 'current_participants', 'location', 
                 'is_online', 'meeting_link', 'registration_deadline', 
                 'is_active', 'available_seats', 'is_registration_open')

    def get_available_seats(self, obj):
        return max(0, obj.max_participants - obj.current_participants)

    def get_is_registration_open(self, obj):
        from django.utils import timezone
        return obj.is_active and obj.registration_deadline > timezone.now()

class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    training_details = TrainingSerializer(source='training', read_only=True)
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = ('id', 'student', 'student_name', 'training', 'training_details',
                 'status', 'enrollment_date', 'completion_date', 'rating',
                 'feedback', 'progress_percentage')

    def get_progress_percentage(self, obj):
        total_modules = obj.training.course.modules.count()
        completed_modules = obj.progress_records.filter(status='completed').count()
        return (completed_modules / total_modules * 100) if total_modules > 0 else 0

class ProgressSerializer(serializers.ModelSerializer):
    module_title = serializers.CharField(source='module.title', read_only=True)
    module_order = serializers.IntegerField(source='module.order', read_only=True)

    class Meta:
        model = Progress
        fields = ('id', 'enrollment', 'module', 'module_title', 'module_order',
                 'status', 'score', 'start_date', 'completion_date', 'notes')

class CourseDetailSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    total_students = serializers.SerializerMethodField()
    total_modules = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def get_total_students(self, obj):
        return obj.trainings.aggregate(
            total=Count('enrollments__student', distinct=True)
        )['total'] or 0

    def get_total_modules(self, obj):
        return obj.modules.count()

class EnrollmentDetailSerializer(EnrollmentSerializer):
    """Serializer détaillé pour une inscription spécifique"""
    progress_records = ProgressSerializer(many=True, read_only=True)
    course_syllabus = serializers.CharField(source='training.course.syllabus', read_only=True)
    next_session = serializers.SerializerMethodField()

    class Meta(EnrollmentSerializer.Meta):
        fields = EnrollmentSerializer.Meta.fields + (
            'progress_records',
            'course_syllabus',
            'next_session'
        )

    def get_next_session(self, obj):
        from django.utils import timezone
        if obj.training.is_online:
            return None
        return {
            'date': obj.training.start_date,
            'location': obj.training.location,
            'meeting_link': obj.training.meeting_link if obj.training.is_online else None
        }
