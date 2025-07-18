from rest_framework import serializers
from .models import (
    Course, Module, Content, Enrollment,
    Progress, Assignment, Submission
)

class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = ['id', 'title', 'content_type', 'text_content', 
                 'video_url', 'file', 'order']

class ModuleSerializer(serializers.ModelSerializer):
    contents = ContentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Module
        fields = ['id', 'title', 'description', 'order', 'contents']

class CourseListSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.get_full_name', read_only=True)
    enrolled_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'instructor_name', 'overview',
                 'level', 'image', 'enrolled_count', 'is_featured']
    
    def get_enrolled_count(self, obj):
        return obj.enrollments.count()

class CourseDetailSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    instructor_name = serializers.CharField(source='instructor.get_full_name', read_only=True)
    enrolled_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'instructor_name', 'overview',
                 'description', 'learning_objectives', 'prerequisites',
                 'level', 'status', 'image', 'created', 'updated',
                 'start_date', 'end_date', 'is_featured', 'language',
                 'modules', 'enrolled_count']
    
    def get_enrolled_count(self, obj):
        return obj.enrollments.count()

class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    progress_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'student_name', 'course', 'course_title',
                 'enrolled_at', 'status', 'completion_date', 'progress_percentage']
        read_only_fields = ['enrolled_at', 'completion_date']
    
    def get_progress_percentage(self, obj):
        total_contents = Content.objects.filter(module__course=obj.course).count()
        if total_contents == 0:
            return 0
        completed_contents = obj.progress.filter(completed=True).count()
        return int((completed_contents / total_contents) * 100)

class ProgressSerializer(serializers.ModelSerializer):
    content_title = serializers.CharField(source='content.title', read_only=True)
    
    class Meta:
        model = Progress
        fields = ['id', 'enrollment', 'content', 'content_title',
                 'completed', 'completed_at']
        read_only_fields = ['completed_at']

class AssignmentSerializer(serializers.ModelSerializer):
    content_title = serializers.CharField(source='content.title', read_only=True)
    
    class Meta:
        model = Assignment
        fields = ['id', 'content', 'content_title', 'description',
                 'due_date', 'max_score']

class SubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    assignment_title = serializers.CharField(source='assignment.content.title', read_only=True)
    graded_by_name = serializers.CharField(source='graded_by.get_full_name', read_only=True)
    
    class Meta:
        model = Submission
        fields = ['id', 'assignment', 'assignment_title', 'student',
                 'student_name', 'submitted_at', 'file', 'comments',
                 'score', 'status', 'graded_by', 'graded_by_name',
                 'graded_at']
        read_only_fields = ['submitted_at', 'graded_by', 'graded_at']
