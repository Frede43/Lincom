from rest_framework import serializers
from .models import (
    Startup, Industry, Stage, TeamMember, StartupMentor,
    Milestone, Investment, Project, ProjectUpdate, JoinRequest,
    MentorRequest
)
from django.contrib.auth import get_user_model

User = get_user_model()

class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = ['id', 'name', 'description', 'icon']

class StageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stage
        fields = ['id', 'name', 'description', 'order']

class TeamMemberSerializer(serializers.ModelSerializer):
    user_details = serializers.SerializerMethodField()

    class Meta:
        model = TeamMember
        fields = ['id', 'user', 'user_details', 'role', 'joined_date', 
                 'equity_percentage', 'responsibilities', 'is_active']
    
    def get_user_details(self, obj):
        return {
            'id': obj.user.id,
            'full_name': f"{obj.user.first_name} {obj.user.last_name}",
            'email': obj.user.email
        }

class StartupListSerializer(serializers.ModelSerializer):
    industry = IndustrySerializer(read_only=True)
    stage = StageSerializer(read_only=True)
    team_size = serializers.IntegerField(read_only=True)

    class Meta:
        model = Startup
        fields = ['id', 'name', 'slug', 'logo', 'tagline', 'industry', 
                 'stage', 'team_size', 'status', 'created_at']
        read_only_fields = ['created_at', 'slug']

class StartupDetailSerializer(serializers.ModelSerializer):
    industry = IndustrySerializer(read_only=True)
    stage = StageSerializer(read_only=True)
    team_members = TeamMemberSerializer(source='teammember_set', many=True, read_only=True)
    mentors = serializers.SerializerMethodField()
    milestones = serializers.SerializerMethodField()
    investments = serializers.SerializerMethodField()
    projects = serializers.SerializerMethodField()

    class Meta:
        model = Startup
        fields = ['id', 'name', 'slug', 'logo', 'tagline', 'description',
                 'pitch_video', 'address', 'industry', 'stage', 'team_members',
                 'mentors', 'website', 'founded_date', 'status', 'team_size',
                 'funding_stage', 'total_funding', 'monthly_revenue',
                 'pitch_deck', 'business_plan', 'milestones', 'investments',
                 'projects', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'slug']

    def get_mentors(self, obj):
        return StartupMentorSerializer(obj.startupmentor_set.all(), many=True).data

    def get_milestones(self, obj):
        return MilestoneSerializer(obj.milestone_set.all(), many=True).data

    def get_investments(self, obj):
        return InvestmentSerializer(obj.investment_set.all(), many=True).data

    def get_projects(self, obj):
        return ProjectSerializer(obj.project_set.all(), many=True).data

class StartupCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Startup
        fields = ['name', 'logo', 'tagline', 'description', 'pitch_video',
                 'address', 'industry', 'stage', 'website', 'founded_date',
                 'status', 'funding_stage', 'total_funding', 'monthly_revenue',
                 'pitch_deck', 'business_plan']

class StartupMentorSerializer(serializers.ModelSerializer):
    mentor_details = serializers.SerializerMethodField()

    class Meta:
        model = StartupMentor
        fields = ['id', 'startup', 'mentor', 'mentor_details', 'expertise',
                 'start_date', 'end_date', 'is_active']

    def get_mentor_details(self, obj):
        return {
            'id': obj.mentor.id,
            'full_name': f"{obj.mentor.first_name} {obj.mentor.last_name}",
            'email': obj.mentor.email
        }

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['id', 'startup', 'title', 'description', 'target_date',
                 'achieved_date', 'is_achieved', 'proof', 'notes', 'created_at']
        read_only_fields = ['created_at']

class InvestmentSerializer(serializers.ModelSerializer):
    investor_details = serializers.SerializerMethodField()

    class Meta:
        model = Investment
        fields = ['id', 'startup', 'investor', 'investor_details', 'amount',
                 'investment_date', 'investment_type', 'equity_percentage',
                 'valuation', 'terms', 'documents']

    def get_investor_details(self, obj):
        if obj.investor:
            return {
                'id': obj.investor.id,
                'full_name': f"{obj.investor.first_name} {obj.investor.last_name}",
                'email': obj.investor.email
            }
        return None

class ProjectSerializer(serializers.ModelSerializer):
    project_lead_details = serializers.SerializerMethodField()
    updates = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['id', 'startup', 'name', 'description', 'project_lead',
                 'project_lead_details', 'start_date', 'end_date', 'status',
                 'priority', 'updates', 'created_at']
        read_only_fields = ['created_at']

    def get_project_lead_details(self, obj):
        return {
            'id': obj.project_lead.id,
            'full_name': f"{obj.project_lead.first_name} {obj.project_lead.last_name}",
            'email': obj.project_lead.email
        }

    def get_updates(self, obj):
        return ProjectUpdateSerializer(obj.projectupdate_set.all(), many=True).data

class ProjectUpdateSerializer(serializers.ModelSerializer):
    author_details = serializers.SerializerMethodField()

    class Meta:
        model = ProjectUpdate
        fields = ['id', 'project', 'author', 'author_details', 'content',
                 'created_at']
        read_only_fields = ['created_at']

    def get_author_details(self, obj):
        return {
            'id': obj.author.id,
            'full_name': f"{obj.author.first_name} {obj.author.last_name}",
            'email': obj.author.email
        }

class JoinRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JoinRequest
        fields = ['startup', 'role', 'motivation']

class JoinRequestDetailSerializer(serializers.ModelSerializer):
    applicant_details = serializers.SerializerMethodField()
    startup_details = serializers.SerializerMethodField()

    class Meta:
        model = JoinRequest
        fields = ['id', 'startup', 'startup_details', 'user',
                 'applicant_details', 'role', 'motivation', 'status',
                 'review_notes', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_applicant_details(self, obj):
        return {
            'id': obj.user.id,
            'full_name': f"{obj.user.first_name} {obj.user.last_name}",
            'email': obj.user.email
        }

    def get_startup_details(self, obj):
        return {
            'id': obj.startup.id,
            'name': obj.startup.name,
            'logo': obj.startup.logo.url if obj.startup.logo else None
        }

class JoinRequestListSerializer(serializers.ModelSerializer):
    startup_name = serializers.CharField(source='startup.name')
    applicant_name = serializers.SerializerMethodField()

    class Meta:
        model = JoinRequest
        fields = ['id', 'startup', 'startup_name', 'applicant_name', 'role',
                 'status', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_applicant_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()

class JoinRequestReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = JoinRequest
        fields = ['status', 'review_notes']

class MentorRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentorRequest
        fields = ['startup', 'message', 'expertise_areas', 'availability']

class MentorRequestDetailSerializer(serializers.ModelSerializer):
    mentor_details = serializers.SerializerMethodField()
    startup_details = serializers.SerializerMethodField()

    class Meta:
        model = MentorRequest
        fields = ['id', 'startup', 'startup_details', 'mentor',
                 'mentor_details', 'message', 'expertise_areas',
                 'availability', 'status', 'reviewed_at', 'reviewed_by',
                 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'reviewed_at', 'reviewed_by']

    def get_mentor_details(self, obj):
        return {
            'id': obj.mentor.id,
            'full_name': f"{obj.mentor.first_name} {obj.mentor.last_name}",
            'email': obj.mentor.email
        }

    def get_startup_details(self, obj):
        return {
            'id': obj.startup.id,
            'name': obj.startup.name,
            'logo': obj.startup.logo.url if obj.startup.logo else None
        }

class MentorRequestListSerializer(serializers.ModelSerializer):
    startup_name = serializers.CharField(source='startup.name')
    mentor_name = serializers.SerializerMethodField()

    class Meta:
        model = MentorRequest
        fields = ['id', 'startup', 'startup_name', 'mentor_name',
                 'expertise_areas', 'status', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_mentor_name(self, obj):
        return f"{obj.mentor.first_name} {obj.mentor.last_name}".strip()

class MentorRequestReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentorRequest
        fields = ['status']
