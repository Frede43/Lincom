from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Startup, Project, Milestone, Resource
from users.serializers import EntrepreneurSerializer, MentorSerializer, UserSerializer

class StartupSerializer(serializers.ModelSerializer):
    founder = EntrepreneurSerializer(read_only=True)
    mentors = MentorSerializer(many=True, read_only=True)

    class Meta:
        model = Startup
        fields = (
            'id', 'name', 'description', 'industry', 'founding_date', 
            'website', 'logo', 'pitch_deck', 'team_size', 'funding_stage',
            'total_funding', 'status', 'founder', 'mentors'
        )

class MilestoneSerializer(serializers.ModelSerializer):
    assignee = UserSerializer(read_only=True)

    class Meta:
        model = Milestone
        fields = (
            'id', 'title', 'description', 'project', 'status',
            'priority', 'due_date', 'completion_date', 'assignee'
        )

class ResourceSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Resource
        fields = (
            'id', 'title', 'description', 'startup', 'resource_type',
            'visibility', 'file', 'url', 'owner'
        )

class ProjectSerializer(serializers.ModelSerializer):
    startup = StartupSerializer(read_only=True)
    milestones = MilestoneSerializer(many=True, read_only=True)
    manager = UserSerializer(read_only=True)
    team_members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = (
            'id', 'startup', 'title', 'description', 'status',
            'priority', 'start_date', 'end_date', 'budget',
            'manager', 'team_members', 'milestones'
        )
