from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import ProjectCall, ProjectSubmission, Competition, CompetitionRegistration
from .serializers import (
    ProjectCallSerializer, ProjectSubmissionSerializer,
    CompetitionSerializer, CompetitionRegistrationSerializer
)
from startups.models import Startup

class ProjectCallViewSet(viewsets.ModelViewSet):
    queryset = ProjectCall.objects.all()
    serializer_class = ProjectCallSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(organization=self.request.user)
    
    def get_queryset(self):
        queryset = ProjectCall.objects.all()
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        return queryset
    
    @action(detail=True, methods=['post'])
    def submit_project(self, request, pk=None):
        project_call = self.get_object()
        startup_id = request.data.get('startup_id')
        project_id = request.data.get('project_id')
        proposal = request.data.get('proposal')
        budget_proposal = request.data.get('budget_proposal')
        
        if not all([startup_id, proposal, budget_proposal]):
            return Response(
                {'detail': 'Startup, proposition et budget requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        startup = get_object_or_404(Startup, id=startup_id)
        if startup.founder != request.user:
            return Response(
                {'detail': 'Vous devez être le fondateur de la startup pour soumettre un projet'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        submission = ProjectSubmission.objects.create(
            project_call=project_call,
            startup=startup,
            project_id=project_id,
            submitted_by=request.user,
            proposal=proposal,
            budget_proposal=budget_proposal
        )
        
        serializer = ProjectSubmissionSerializer(submission)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CompetitionViewSet(viewsets.ModelViewSet):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(organization=self.request.user)
    
    def get_queryset(self):
        queryset = Competition.objects.all()
        status = self.request.query_params.get('status', None)
        type = self.request.query_params.get('type', None)
        
        if status:
            queryset = queryset.filter(status=status)
        if type:
            queryset = queryset.filter(type=type)
        return queryset
    
    @action(detail=True, methods=['post'])
    def register_startup(self, request, pk=None):
        competition = self.get_object()
        startup_id = request.data.get('startup_id')
        
        if not startup_id:
            return Response(
                {'detail': 'ID de la startup requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        startup = get_object_or_404(Startup, id=startup_id)
        if startup.founder != request.user:
            return Response(
                {'detail': 'Vous devez être le fondateur de la startup pour l\'inscrire'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if competition.registrations.count() >= competition.max_participants:
            return Response(
                {'detail': 'La compétition a atteint sa capacité maximale'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        registration = CompetitionRegistration.objects.create(
            competition=competition,
            startup=startup,
            registered_by=request.user
        )
        
        serializer = CompetitionRegistrationSerializer(registration)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def update_registration_status(self, request, pk=None):
        competition = self.get_object()
        registration_id = request.data.get('registration_id')
        new_status = request.data.get('status')
        
        if not all([registration_id, new_status]):
            return Response(
                {'detail': 'ID de l\'inscription et nouveau statut requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        registration = get_object_or_404(CompetitionRegistration, id=registration_id)
        registration.status = new_status
        registration.save()
        
        serializer = CompetitionRegistrationSerializer(registration)
        return Response(serializer.data)
