from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import (
    Course, CourseEnrollment, Training, TrainingRegistration,
    Category
)
from .serializers import (
    CourseSerializer, CourseEnrollmentSerializer,
    TrainingSerializer, TrainingRegistrationSerializer,
    CategorySerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'mentor__username']
    ordering_fields = ['created_at', 'updated_at', 'title']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Course.objects.all()
        status = self.request.query_params.get('status', None)
        instructor = self.request.query_params.get('instructor', None)
        category = self.request.query_params.get('category', None)
        
        if status:
            queryset = queryset.filter(status=status)
        if instructor:
            queryset = queryset.filter(instructor_id=instructor)
        if category:
            queryset = queryset.filter(category_id=category)
            
        return queryset

    def perform_create(self, serializer):
        serializer.save(mentor=self.request.user)
    
    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        course = self.get_object()
        user = request.user
        
        if CourseEnrollment.objects.filter(student=user, course=course).exists():
            return Response(
                {'detail': 'Vous êtes déjà inscrit à ce cours.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        enrollment = CourseEnrollment.objects.create(
            student=user,
            course=course
        )
        serializer = CourseEnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def update_progress(self, request, pk=None):
        course = self.get_object()
        try:
            enrollment = CourseEnrollment.objects.get(
                student=request.user,
                course=course
            )
            progress = request.data.get('progress', 0)
            enrollment.progress = progress
            enrollment.save()
            
            serializer = CourseEnrollmentSerializer(enrollment)
            return Response(serializer.data)
        except CourseEnrollment.DoesNotExist:
            return Response(
                {'detail': 'Vous n\'êtes pas inscrit à ce cours.'},
                status=status.HTTP_404_NOT_FOUND
            )

class CourseEnrollmentViewSet(viewsets.ModelViewSet):
    serializer_class = CourseEnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = CourseEnrollment.objects.all()
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['enrolled_at']
    ordering = ['-enrolled_at']

    def get_queryset(self):
        return CourseEnrollment.objects.filter(student=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

class TrainingViewSet(viewsets.ModelViewSet):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'trainer__username']
    ordering_fields = ['start_date', 'end_date', 'title']
    ordering = ['-start_date']
    
    def get_queryset(self):
        queryset = Training.objects.all()
        status = self.request.query_params.get('status', None)
        trainer = self.request.query_params.get('trainer', None)
        category = self.request.query_params.get('category', None)
        
        if status:
            queryset = queryset.filter(status=status)
        if trainer:
            queryset = queryset.filter(trainer_id=trainer)
        if category:
            queryset = queryset.filter(category_id=category)
            
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(trainer=self.request.user)
    
    @action(detail=True, methods=['post'])
    def register(self, request, pk=None):
        training = self.get_object()
        user = request.user
        
        if TrainingRegistration.objects.filter(participant=user, training=training).exists():
            return Response(
                {'detail': 'Vous êtes déjà inscrit à cette formation.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        registration = TrainingRegistration.objects.create(
            participant=user,
            training=training
        )
        serializer = TrainingRegistrationSerializer(registration)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class TrainingRegistrationViewSet(viewsets.ModelViewSet):
    serializer_class = TrainingRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = TrainingRegistration.objects.all()
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['registered_at']
    ordering = ['-registered_at']

    def get_queryset(self):
        return TrainingRegistration.objects.filter(participant=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(participant=self.request.user)
