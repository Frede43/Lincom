from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.contrib.auth import get_user_model
from django.db.models import Count, Avg, Q
from django.utils import timezone
from .models import Mentor, Entrepreneur, Stakeholder, User
from .serializers import (
    UserSerializer, MentorSerializer,
    EntrepreneurSerializer, StakeholderSerializer,
    PasswordChangeSerializer, AvatarUploadSerializer,
    UserRegistrationSerializer
)
from .permissions import (
    IsSelfOrAdmin, IsMentorOrAdmin,
    IsEntrepreneurOrAdmin, IsStakeholderOrAdmin
)
from .filters import (
    UserFilter, MentorFilter,
    EntrepreneurFilter, StakeholderFilter
)
from comlab.viewsets import CustomModelViewSet

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """
    Endpoint pour l'inscription des utilisateurs.
    Ne nécessite pas d'authentification.
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Vue pour gérer le profil de l'utilisateur connecté.
    GET : Obtenir le profil
    PUT/PATCH : Mettre à jour le profil
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserViewSet(CustomModelViewSet):
    """
    API endpoint pour gérer les utilisateurs.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'role']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['username', 'date_joined', 'last_login']
    ordering = ['username']

    def get_permissions(self):
        """
        Instantiate and return the list of permissions that this view requires.
        """
        if self.action == 'register':
            return [permissions.AllowAny()]
        return [permission() for permission in self.permission_classes]

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        """
        Register a new user with their role and profile.
        """
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                UserSerializer(user).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False)
    def me(self, request):
        """Get the current user's profile."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def change_password(self, request, pk=None):
        """Endpoint spécifique pour le changement de mot de passe"""
        user = self.get_object()
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response(
                {
                    'status': 'success',
                    'message': 'Password changed successfully'
                }
            )
        return Response(
            {
                'status': 'error',
                'message': 'Invalid data',
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=['post'])
    def upload_avatar(self, request, pk=None):
        """Endpoint spécifique pour l'upload d'avatar"""
        user = self.get_object()
        serializer = AvatarUploadSerializer(data=request.data)
        if serializer.is_valid():
            user.avatar = serializer.validated_data['avatar']
            user.save()
            return Response(
                {
                    'status': 'success',
                    'message': 'Avatar uploaded successfully',
                    'data': UserSerializer(user).data
                }
            )
        return Response(
            {
                'status': 'error',
                'message': 'Invalid data',
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Obtenir les statistiques des utilisateurs."""
        if not request.user.is_staff:
            return Response(
                {
                    'status': 'error',
                    'message': 'Permission denied'
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        stats = {
            'total_users': User.objects.count(),
            'active_users': User.objects.filter(is_active=True).count(),
            'mentors': User.objects.filter(role='mentor').count(),
            'entrepreneurs': User.objects.filter(role='entrepreneur').count(),
            'stakeholders': User.objects.filter(role='stakeholder').count(),
            'students': User.objects.filter(role='student').count(),
        }
        
        return Response(
            {
                'status': 'success',
                'data': stats
            }
        )

class MentorViewSet(CustomModelViewSet):
    """
    API endpoint pour gérer les mentors.
    """
    queryset = Mentor.objects.select_related('user')
    serializer_class = MentorSerializer
    permission_classes = [permissions.IsAuthenticated, IsMentorOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = MentorFilter
    search_fields = ['user__username', 'user__email', 'expertise__name', 'bio']
    ordering_fields = ['user__username', 'years_experience', 'availability']
    ordering = ['user__username']

    def get_queryset(self):
        """Filtrer les mentors selon les permissions"""
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            if self.request.user.role == 'mentor':
                return queryset.filter(user=self.request.user)
            return queryset.filter(is_available=True)
        return queryset

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Obtenir les statistiques des mentors."""
        if not request.user.is_staff and request.user.role != 'mentor':
            return Response(
                {
                    'status': 'error',
                    'message': 'Permission denied'
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        stats = {
            'total_mentors': Mentor.objects.count(),
            'available_mentors': Mentor.objects.filter(is_available=True).count(),
            'avg_experience': Mentor.objects.aggregate(Avg('years_experience'))['years_experience__avg'],
            'expertise_distribution': dict(Mentor.objects.values_list('expertise').annotate(count=Count('id')))
        }
        
        return Response(
            {
                'status': 'success',
                'data': stats
            }
        )

class EntrepreneurViewSet(CustomModelViewSet):
    """
    API endpoint pour gérer les entrepreneurs.
    """
    queryset = Entrepreneur.objects.select_related('user')
    serializer_class = EntrepreneurSerializer
    permission_classes = [permissions.IsAuthenticated, IsEntrepreneurOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = EntrepreneurFilter
    search_fields = ['user__username', 'user__email', 'company_name', 'industry']
    ordering_fields = ['user__username', 'company_stage']
    ordering = ['user__username']

    def get_queryset(self):
        """Filtrer les entrepreneurs selon les permissions"""
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            if self.request.user.role == 'entrepreneur':
                return queryset.filter(user=self.request.user)
        return queryset

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Obtenir les statistiques des entrepreneurs."""
        if not request.user.is_staff and request.user.role != 'entrepreneur':
            return Response(
                {
                    'status': 'error',
                    'message': 'Permission denied'
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        stats = {
            'total_entrepreneurs': Entrepreneur.objects.count(),
            'company_stages': dict(Entrepreneur.objects.values_list('company_stage').annotate(count=Count('id'))),
            'industries': dict(Entrepreneur.objects.values_list('industry').annotate(count=Count('id'))),
            'avg_team_size': Entrepreneur.objects.aggregate(Avg('team_size'))['team_size__avg']
        }
        
        return Response(
            {
                'status': 'success',
                'data': stats
            }
        )

class StakeholderViewSet(CustomModelViewSet):
    """
    API endpoint pour gérer les parties prenantes.
    """
    queryset = Stakeholder.objects.select_related('user', 'organization')
    serializer_class = StakeholderSerializer
    permission_classes = [permissions.IsAuthenticated, IsStakeholderOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = StakeholderFilter
    search_fields = ['user__username', 'user__email', 'organization__name', 'position']
    ordering_fields = ['user__username', 'organization__name', 'position']
    ordering = ['user__username']

    def get_queryset(self):
        """Filtrer les stakeholders selon les permissions"""
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            if self.request.user.role == 'stakeholder':
                return queryset.filter(user=self.request.user)
        return queryset

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Obtenir les statistiques des parties prenantes."""
        if not request.user.is_staff and request.user.role != 'stakeholder':
            return Response(
                {
                    'status': 'error',
                    'message': 'Permission denied'
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        stats = {
            'total_stakeholders': Stakeholder.objects.count(),
            'organizations_count': Stakeholder.objects.values('organization').distinct().count(),
            'positions': dict(Stakeholder.objects.values_list('position').annotate(count=Count('id'))),
            'departments': dict(Stakeholder.objects.values_list('department').annotate(count=Count('id')))
        }
        
        return Response(
            {
                'status': 'success',
                'data': stats
            }
        )
