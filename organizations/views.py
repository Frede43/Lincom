from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Organization, CallForProject, Competition, Submission
from .serializers import (
    OrganizationSerializer, CallForProjectSerializer,
    CompetitionSerializer, SubmissionSerializer
)

class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['get'])
    def calls(self, request, pk=None):
        organization = self.get_object()
        calls = organization.callforproject_set.all()
        serializer = CallForProjectSerializer(calls, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def competitions(self, request, pk=None):
        organization = self.get_object()
        competitions = organization.competition_set.all()
        serializer = CompetitionSerializer(competitions, many=True)
        return Response(serializer.data)

class CallForProjectViewSet(viewsets.ModelViewSet):
    queryset = CallForProject.objects.all()
    serializer_class = CallForProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['get'])
    def submissions(self, request, pk=None):
        call = self.get_object()
        submissions = call.submission_set.all()
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)

class CompetitionViewSet(viewsets.ModelViewSet):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['get'])
    def submissions(self, request, pk=None):
        competition = self.get_object()
        submissions = competition.submission_set.all()
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)

class SubmissionViewSet(viewsets.ModelViewSet):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Submission.objects.filter(submitter=self.request.user)

    def perform_create(self, serializer):
        serializer.save(submitter=self.request.user)

    def get_object(self):
        obj = super().get_object()
        if obj.submitter != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied()
        return obj