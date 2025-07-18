from rest_framework import serializers
from .models import (
    Course, CourseEnrollment, Training, TrainingRegistration,
    Category
)
from accounts.serializers import UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class CategorySerializer(serializers.ModelSerializer):
    courses_count = serializers.SerializerMethodField()
    trainings_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'courses_count', 'trainings_count']
    
    def get_courses_count(self, obj):
        return obj.course_set.count()
    
    def get_trainings_count(self, obj):
        return obj.training_set.count()

class CourseEnrollmentSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    
    class Meta:
        model = CourseEnrollment
        fields = ['id', 'student', 'progress', 'enrolled_at']

class CourseSerializer(serializers.ModelSerializer):
    mentor = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    enrollments = CourseEnrollmentSerializer(source='courseenrollment_set', many=True, read_only=True)
    enrolled_students_count = serializers.SerializerMethodField()
    mentor_details = serializers.SerializerMethodField()
    level_display = serializers.CharField(source='get_level_display', read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'mentor', 'mentor_details',
                 'level', 'level_display', 'image', 'category', 'enrollments',
                 'enrolled_students_count', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_enrolled_students_count(self, obj):
        return obj.students.count()

    def get_mentor_details(self, obj):
        return {
            'id': obj.mentor.id,
            'full_name': f"{obj.mentor.first_name} {obj.mentor.last_name}",
            'email': obj.mentor.email
        }

class TrainingRegistrationSerializer(serializers.ModelSerializer):
    participant = UserSerializer(read_only=True)
    
    class Meta:
        model = TrainingRegistration
        fields = ['id', 'participant', 'status', 'registered_at']

class TrainingSerializer(serializers.ModelSerializer):
    trainer = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    registrations = TrainingRegistrationSerializer(source='trainingregistration_set', many=True, read_only=True)
    participants_count = serializers.SerializerMethodField()
    trainer_details = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Training
        fields = ['id', 'title', 'description', 'trainer', 'trainer_details',
                 'category', 'start_date', 'end_date', 'location', 'max_participants',
                 'status', 'status_display', 'registrations', 'participants_count',
                 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_participants_count(self, obj):
        return obj.participants.count()

    def get_trainer_details(self, obj):
        return {
            'id': obj.trainer.id,
            'full_name': f"{obj.trainer.first_name} {obj.trainer.last_name}",
            'email': obj.trainer.email
        }
