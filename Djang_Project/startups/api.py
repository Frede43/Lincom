from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import (
    Startup, Project, ProjectUpdate, Industry, Stage,
    TeamMember, StartupMentor, Milestone, Investment,
    JoinRequest, MentorRequest
)
from .serializers import (
    StartupListSerializer, StartupDetailSerializer, StartupCreateUpdateSerializer,
    ProjectSerializer, ProjectUpdateSerializer, IndustrySerializer,
    StageSerializer, TeamMemberSerializer, StartupMentorSerializer,
    MilestoneSerializer, InvestmentSerializer,
    JoinRequestCreateSerializer, JoinRequestDetailSerializer,
    JoinRequestListSerializer, JoinRequestReviewSerializer,
    MentorRequestCreateSerializer, MentorRequestDetailSerializer,
    MentorRequestListSerializer, MentorRequestReviewSerializer
)
from .permissions import IsFounderOrReadOnly, IsTeamMemberOrReadOnly
from django.contrib.auth import get_user_model

User = get_user_model()

class IndustryViewSet(viewsets.ModelViewSet):
    queryset = Industry.objects.all()
    serializer_class = IndustrySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']
    
    @action(detail=True)
    def startups(self, request, pk=None):
        industry = self.get_object()
        startups = industry.startup_set.all()
        serializer = StartupListSerializer(startups, many=True)
        return Response(serializer.data)

class StageViewSet(viewsets.ModelViewSet):
    queryset = Stage.objects.all()
    serializer_class = StageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']
    
    @action(detail=True)
    def startups(self, request, pk=None):
        stage = self.get_object()
        startups = stage.startup_set.all()
        serializer = StartupListSerializer(startups, many=True)
        return Response(serializer.data)

class TeamMemberViewSet(viewsets.ModelViewSet):
    serializer_class = TeamMemberSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = TeamMember.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__username', 'role', 'startup__name']
    
    def get_queryset(self):
        return TeamMember.objects.filter(
            Q(startup__teammember__user=self.request.user) |
            Q(user=self.request.user)
        ).distinct()

class StartupMentorViewSet(viewsets.ModelViewSet):
    serializer_class = StartupMentorSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = StartupMentor.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['mentor__username', 'startup__name']
    
    def get_queryset(self):
        return StartupMentor.objects.filter(
            Q(startup__teammember__user=self.request.user) |
            Q(mentor=self.request.user)
        ).distinct()

class MilestoneViewSet(viewsets.ModelViewSet):
    serializer_class = MilestoneSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamMemberOrReadOnly]
    queryset = Milestone.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['due_date', 'status']
    ordering = ['due_date']

    def get_queryset(self):
        return Milestone.objects.filter(
            Q(startup__team_members__user=self.request.user)
        ).distinct()

    def perform_create(self, serializer):
        startup = serializer.validated_data.get('startup')
        if not TeamMember.objects.filter(startup=startup, user=self.request.user).exists():
            raise permissions.PermissionDenied("You must be a team member to create milestones.")
        serializer.save()

class InvestmentViewSet(viewsets.ModelViewSet):
    serializer_class = InvestmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamMemberOrReadOnly]
    queryset = Investment.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['investor_name', 'type']
    ordering_fields = ['date', 'amount']
    ordering = ['-date']

    def get_queryset(self):
        return Investment.objects.filter(
            Q(startup__team_members__user=self.request.user)
        ).distinct()

class JoinRequestViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = JoinRequest.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['startup__name', 'user__username']
    ordering_fields = ['created_at', 'status']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return JoinRequestCreateSerializer
        elif self.action == 'retrieve':
            return JoinRequestDetailSerializer
        elif self.action in ['update', 'partial_update']:
            return JoinRequestReviewSerializer
        return JoinRequestListSerializer
    
    def get_queryset(self):
        return JoinRequest.objects.filter(
            Q(user=self.request.user) | 
            Q(startup__team_members__user=self.request.user)
        )

class MentorRequestViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = MentorRequest.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['startup__name', 'mentor__username']
    ordering_fields = ['created_at', 'status']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return MentorRequestCreateSerializer
        elif self.action == 'retrieve':
            return MentorRequestDetailSerializer
        elif self.action in ['update', 'partial_update']:
            return MentorRequestReviewSerializer
        return MentorRequestListSerializer
    
    def get_queryset(self):
        return MentorRequest.objects.filter(
            Q(mentor=self.request.user) | 
            Q(startup__team_members__user=self.request.user)
        )

class StartupViewSet(viewsets.ModelViewSet):
    queryset = Startup.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsFounderOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'tagline', 'description']
    ordering_fields = ['name', 'created_at', 'team_size', 'total_funding']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return StartupListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return StartupCreateUpdateSerializer
        return StartupDetailSerializer

    def perform_create(self, serializer):
        startup = serializer.save()
        TeamMember.objects.create(
            startup=startup,
            user=self.request.user,
            role='FOUNDER',
            is_active=True
        )

    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.query_params.get('status')
        industry = self.request.query_params.get('industry')
        stage = self.request.query_params.get('stage')

        if status:
            queryset = queryset.filter(status=status)
        if industry:
            queryset = queryset.filter(industry_id=industry)
        if stage:
            queryset = queryset.filter(stage_id=stage)

        return queryset

    @action(detail=True, methods=['post'])
    def join_request(self, request, pk=None):
        startup = self.get_object()
        serializer = JoinRequestCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(
                startup=startup,
                user=request.user,
                status='pending'
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def mentor_request(self, request, pk=None):
        startup = self.get_object()
        serializer = MentorRequestCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(
                startup=startup,
                mentor=request.user,
                status='pending'
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamMemberOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['start_date', 'end_date', 'priority', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        return Project.objects.filter(
            Q(startup__teammember__user=self.request.user) |
            Q(project_lead=self.request.user)
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(project_lead=self.request.user)

    @action(detail=True, methods=['post'])
    def add_update(self, request, pk=None):
        project = self.get_object()
        serializer = ProjectUpdateSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(
                project=project,
                author=request.user
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectUpdateViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamMemberOrReadOnly]
    queryset = ProjectUpdate.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return ProjectUpdate.objects.filter(
            Q(project__startup__teammember__user=self.request.user) |
            Q(author=self.request.user)
        ).distinct()
