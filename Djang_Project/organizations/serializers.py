from rest_framework import serializers
from .models import ProjectCall, ProjectSubmission, Competition, CompetitionRegistration
from accounts.serializers import UserSerializer
from startups.serializers import ProjectSerializer, StartupDetailSerializer

class ProjectSubmissionSerializer(serializers.ModelSerializer):
    startup = StartupDetailSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    submitted_by = UserSerializer(read_only=True)
    
    class Meta:
        model = ProjectSubmission
        fields = ['id', 'project_call', 'startup', 'project', 'submitted_by',
                 'proposal', 'budget_proposal', 'submitted_at', 'status']

class ProjectCallSerializer(serializers.ModelSerializer):
    organization = UserSerializer(read_only=True)
    submissions = ProjectSubmissionSerializer(many=True, read_only=True)
    submission_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ProjectCall
        fields = ['id', 'title', 'description', 'organization', 'start_date',
                 'end_date', 'budget', 'requirements', 'created_at', 'status',
                 'submissions', 'submission_count']
    
    def get_submission_count(self, obj):
        return obj.submissions.count()
    
    def validate(self, data):
        if data.get('start_date') and data.get('end_date'):
            if data['start_date'] > data['end_date']:
                raise serializers.ValidationError(
                    "La date de fin doit être postérieure à la date de début."
                )
        return data

class CompetitionRegistrationSerializer(serializers.ModelSerializer):
    startup = StartupDetailSerializer(read_only=True)
    registered_by = UserSerializer(read_only=True)
    
    class Meta:
        model = CompetitionRegistration
        fields = ['id', 'competition', 'startup', 'registered_by',
                 'registered_at', 'status']

class CompetitionSerializer(serializers.ModelSerializer):
    organization = UserSerializer(read_only=True)
    registrations = CompetitionRegistrationSerializer(many=True, read_only=True)
    registration_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Competition
        fields = ['id', 'title', 'description', 'organization', 'start_date',
                 'end_date', 'max_participants', 'requirements', 'prizes',
                 'created_at', 'status', 'registrations', 'registration_count']
    
    def get_registration_count(self, obj):
        return obj.registrations.count()
    
    def validate(self, data):
        if data.get('start_date') and data.get('end_date'):
            if data['start_date'] > data['end_date']:
                raise serializers.ValidationError(
                    "La date de fin doit être postérieure à la date de début."
                )
        return data