from django.shortcuts import render, get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView, TemplateView
from django.urls import reverse_lazy
from django.db.models import Q, Count, Sum
from django.http import JsonResponse
from django.utils import timezone

from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from .models import (
    Industry, Stage, Startup, TeamMember, StartupMentor,
    Milestone, Investment, Project, JoinRequest, MentorRequest
)
from .serializers import (
    IndustrySerializer, StageSerializer, StartupListSerializer,
    StartupDetailSerializer, StartupCreateUpdateSerializer,
    TeamMemberSerializer, StartupMentorSerializer,
    MilestoneSerializer, InvestmentSerializer, ProjectSerializer,
    JoinRequestCreateSerializer, JoinRequestReviewSerializer,
    JoinRequestDetailSerializer, JoinRequestListSerializer,
    MentorRequestCreateSerializer, MentorRequestReviewSerializer,
    MentorRequestDetailSerializer, MentorRequestListSerializer
)
from .permissions import (
    IsFounderOrReadOnly, IsTeamMemberOrReadOnly,
    IsMentorOrReadOnly, IsInvestorOrReadOnly
)
from .forms import StartupForm
from notifs.services import NotificationService

# API Views
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class IndustryViewSet(viewsets.ModelViewSet):
    queryset = Industry.objects.all()
    serializer_class = IndustrySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

class StageViewSet(viewsets.ModelViewSet):
    queryset = Stage.objects.all().order_by('order')
    serializer_class = StageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

class StartupViewSet(viewsets.ModelViewSet):
    queryset = Startup.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsFounderOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'tagline', 'description']
    ordering_fields = ['created_at', 'name', 'team_size', 'funding_raised']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Startup.objects.annotate(
            team_size=Count('team_members'),
            total_investment=Sum('investments__amount')
        )

        # Filtres
        industry = self.request.query_params.get('industry', None)
        stage = self.request.query_params.get('stage', None)
        funding_stage = self.request.query_params.get('funding_stage', None)
        city = self.request.query_params.get('city', None)

        if industry:
            queryset = queryset.filter(industry_id=industry)
        if stage:
            queryset = queryset.filter(stage_id=stage)
        if funding_stage:
            queryset = queryset.filter(funding_stage=funding_stage)
        if city:
            queryset = queryset.filter(city__iexact=city)

        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return StartupListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return StartupCreateUpdateSerializer
        return StartupDetailSerializer

    def perform_create(self, serializer):
        serializer.save(founder=self.request.user)

    @action(detail=True, methods=['post'])
    def join_request(self, request, pk=None):
        startup = self.get_object()
        user = request.user
        
        if startup.team_members.filter(id=user.id).exists():
            return Response(
                {"detail": "Vous êtes déjà membre de cette startup."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        existing_request = JoinRequest.objects.filter(
            startup=startup,
            user=user,
            status='pending'
        ).first()
        
        if existing_request:
            return Response(
                {"detail": "Vous avez déjà une demande en attente pour cette startup."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = JoinRequestCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        join_request = serializer.save(
            startup=startup,
            user=user
        )
        
        # Envoyer une notification au fondateur
        NotificationService.notify_join_request(join_request)
        
        return Response({
            "detail": "Votre demande de participation a été envoyée avec succès.",
            "request_id": join_request.id
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def mentor_request(self, request, pk=None):
        startup = self.get_object()
        user = request.user
        
        if not user.profile.is_mentor:
            return Response(
                {"detail": "Vous devez être mentor pour faire cette demande."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if startup.mentors.filter(id=user.id).exists():
            return Response(
                {"detail": "Vous êtes déjà mentor de cette startup."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        existing_request = MentorRequest.objects.filter(
            startup=startup,
            mentor=user,
            status='pending'
        ).first()
        
        if existing_request:
            return Response(
                {"detail": "Vous avez déjà une demande de mentorat en attente pour cette startup."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = MentorRequestCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        mentor_request = serializer.save(
            startup=startup,
            mentor=user
        )
        
        # Envoyer une notification au fondateur
        NotificationService.notify_mentor_request(mentor_request)
        
        return Response({
            "detail": "Votre demande de mentorat a été envoyée avec succès.",
            "request_id": mentor_request.id
        }, status=status.HTTP_201_CREATED)

class TeamMemberViewSet(viewsets.ModelViewSet):
    serializer_class = TeamMemberSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamMemberOrReadOnly]

    def get_queryset(self):
        return TeamMember.objects.filter(startup_id=self.kwargs['startup_pk'])

    def perform_create(self, serializer):
        startup = get_object_or_404(Startup, pk=self.kwargs['startup_pk'])
        serializer.save(startup=startup)

class StartupMentorViewSet(viewsets.ModelViewSet):
    serializer_class = StartupMentorSerializer
    permission_classes = [permissions.IsAuthenticated, IsMentorOrReadOnly]

    def get_queryset(self):
        return StartupMentor.objects.filter(startup_id=self.kwargs['startup_pk'])

    def perform_create(self, serializer):
        startup = get_object_or_404(Startup, pk=self.kwargs['startup_pk'])
        serializer.save(startup=startup, mentor=self.request.user)

class MilestoneViewSet(viewsets.ModelViewSet):
    serializer_class = MilestoneSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamMemberOrReadOnly]

    def get_queryset(self):
        return Milestone.objects.filter(startup_id=self.kwargs['startup_pk'])

    def perform_create(self, serializer):
        startup = get_object_or_404(Startup, pk=self.kwargs['startup_pk'])
        serializer.save(startup=startup)

class InvestmentViewSet(viewsets.ModelViewSet):
    serializer_class = InvestmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsInvestorOrReadOnly]

    def get_queryset(self):
        return Investment.objects.filter(startup_id=self.kwargs['startup_pk'])

    def perform_create(self, serializer):
        startup = get_object_or_404(Startup, pk=self.kwargs['startup_pk'])
        serializer.save(startup=startup, investor=self.request.user)

class JoinRequestViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        user = self.request.user
        # Les fondateurs voient les demandes pour leurs startups
        founder_startups = Startup.objects.filter(founder=user)
        if founder_startups.exists():
            return JoinRequest.objects.filter(startup__in=founder_startups)
        # Les autres utilisateurs ne voient que leurs propres demandes
        return JoinRequest.objects.filter(user=user)

    def get_serializer_class(self):
        if self.action == 'create':
            return JoinRequestCreateSerializer
        elif self.action == 'review':
            return JoinRequestReviewSerializer
        elif self.action == 'retrieve':
            return JoinRequestDetailSerializer
        return JoinRequestListSerializer

    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        join_request = self.get_object()
        
        if request.user != join_request.startup.founder:
            return Response(
                {"detail": "Seul le fondateur peut examiner les demandes."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if join_request.status != 'pending':
            return Response(
                {"detail": "Cette demande a déjà été examinée."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = JoinRequestReviewSerializer(data=request.data)
        if serializer.is_valid():
            join_request.status = serializer.validated_data['status']
            join_request.review_notes = serializer.validated_data.get('review_notes', '')
            join_request.reviewed_by = request.user
            join_request.review_date = timezone.now()
            join_request.save()
            
            if join_request.status == 'accepted':
                TeamMember.objects.create(
                    startup=join_request.startup,
                    user=join_request.user,
                    role=join_request.role
                )
            
            # Envoyer une notification à l'utilisateur
            NotificationService.notify_join_request_decision(join_request)
            
            return Response({
                "detail": "Demande examinée avec succès.",
                "status": join_request.get_status_display()
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MentorRequestViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        user = self.request.user
        if user.profile.is_mentor:
            # Les mentors voient leurs propres demandes
            return MentorRequest.objects.filter(mentor=user)
        else:
            # Les fondateurs voient les demandes pour leurs startups
            return MentorRequest.objects.filter(startup__founder=user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return MentorRequestCreateSerializer
        elif self.action == 'review':
            return MentorRequestReviewSerializer
        elif self.action == 'retrieve':
            return MentorRequestDetailSerializer
        return MentorRequestListSerializer
    
    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        mentor_request = self.get_object()
        
        # Vérifier que l'utilisateur est le fondateur de la startup
        if request.user != mentor_request.startup.founder:
            return Response(
                {"detail": "Seul le fondateur peut examiner les demandes de mentorat."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = MentorRequestReviewSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        status_value = serializer.validated_data['status']
        mentor_request.status = status_value
        mentor_request.reviewed_by = request.user
        mentor_request.reviewed_at = timezone.now()
        mentor_request.save()
        
        if status_value == 'accepted':
            # Créer la relation mentor-startup
            StartupMentor.objects.create(
                startup=mentor_request.startup,
                mentor=mentor_request.mentor
            )
            
            # Envoyer une notification d'acceptation
            NotificationService.notify_mentor_request_accepted(mentor_request)
        else:
            # Envoyer une notification de rejet
            NotificationService.notify_mentor_request_rejected(mentor_request)
        
        return Response({
            "detail": f"La demande de mentorat a été {status_value}.",
            "status": status_value
        })

# Traditional Views
class StartupListView(ListView):
    model = Startup
    template_name = 'startups/startup_list.html'
    context_object_name = 'startups'
    paginate_by = 12

    def get_queryset(self):
        queryset = Startup.objects.annotate(
            team_size=Count('team_members'),
            total_investment=Sum('investments__amount')
        ).order_by('-created_at')

        # Filters
        industry = self.request.GET.get('industry')
        stage = self.request.GET.get('stage')
        city = self.request.GET.get('city')

        if industry:
            queryset = queryset.filter(industry_id=industry)
        if stage:
            queryset = queryset.filter(stage_id=stage)
        if city:
            queryset = queryset.filter(city__iexact=city)

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['industries'] = Industry.objects.all()
        context['stages'] = Stage.objects.all()
        context['cities'] = Startup.objects.values_list('city', flat=True).distinct()
        context['selected_industry'] = self.request.GET.get('industry')
        context['selected_stage'] = self.request.GET.get('stage')
        context['selected_city'] = self.request.GET.get('city')
        return context

class StartupDetailView(DetailView):
    model = Startup
    template_name = 'startups/startup_detail.html'
    context_object_name = 'startup'
    slug_url_kwarg = 'slug'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        startup = self.get_object()
        context['team_size'] = startup.team_members.count()
        context['total_investment'] = startup.investments.aggregate(Sum('amount'))['amount__sum'] or 0
        context['milestones'] = startup.milestones.order_by('-date')
        context['team_members'] = startup.team_members.select_related('user')
        context['mentors'] = startup.mentors.select_related('user')
        context['investments'] = startup.investments.select_related('investor').order_by('-date')
        return context

class StartupCreateView(LoginRequiredMixin, CreateView):
    model = Startup
    template_name = 'startups/startup_form.html'
    form_class = StartupForm
    success_url = reverse_lazy('startups:startup_list')

    def form_valid(self, form):
        form.instance.founder = self.request.user
        return super().form_valid(form)

class StartupUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Startup
    template_name = 'startups/startup_form.html'
    form_class = StartupForm

    def test_func(self):
        startup = self.get_object()
        return self.request.user == startup.founder

    def get_success_url(self):
        return reverse_lazy('startups:startup_detail', kwargs={'slug': self.object.slug})

class StartupDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Startup
    template_name = 'startups/startup_confirm_delete.html'
    success_url = reverse_lazy('startups:startup_list')

    def test_func(self):
        startup = self.get_object()
        return self.request.user == startup.founder

class MentorRequestListView(LoginRequiredMixin, ListView):
    model = MentorRequest
    template_name = 'startups/mentor_request_list.html'
    context_object_name = 'mentor_requests'
    paginate_by = 10

    def get_queryset(self):
        queryset = MentorRequest.objects.all()
        
        # Filtrer selon le rôle de l'utilisateur
        if self.request.user.profile.is_mentor:
            queryset = queryset.filter(mentor=self.request.user)
        else:
            queryset = queryset.filter(startup__founder=self.request.user)
        
        # Appliquer les filtres
        status = self.request.GET.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset.select_related('startup', 'mentor', 'reviewed_by')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['status_choices'] = MentorRequest.STATUS_CHOICES
        return context

class MentorRequestCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = MentorRequest
    template_name = 'startups/mentor_request_form.html'
    fields = ['message', 'expertise_areas', 'availability']
    
    def test_func(self):
        return self.request.user.profile.is_mentor
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['startup'] = get_object_or_404(Startup, pk=self.kwargs['startup_pk'])
        return context
    
    def form_valid(self, form):
        form.instance.mentor = self.request.user
        form.instance.startup = get_object_or_404(Startup, pk=self.kwargs['startup_pk'])
        response = super().form_valid(form)
        
        # Envoyer une notification au fondateur
        NotificationService.notify_mentor_request(form.instance)
        
        return response
    
    def get_success_url(self):
        return reverse_lazy('mentor_request_list')

class MentorStatisticsView(LoginRequiredMixin, TemplateView):
    template_name = 'startups/mentor_statistics.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        period = int(self.request.GET.get('period', 30))
        
        # Service des statistiques
        stats_service = MentorStatisticsService()
        
        if user.profile.is_mentor:
            # Statistiques pour un mentor
            context['stats'] = stats_service.get_mentor_statistics(mentor=user, period_days=period)
            context['mentor_stats'] = stats_service.get_mentor_activity(user, period_days=period)
            context['active_startups'] = Startup.objects.filter(
                mentors__mentor=user,
                mentors__status='active'
            )
        else:
            # Statistiques pour une startup
            startup = get_object_or_404(Startup, founder=user)
            context['stats'] = stats_service.get_mentor_statistics(startup=startup, period_days=period)
            context['startup_stats'] = stats_service.get_startup_mentor_statistics(startup, period_days=period)
            context['active_mentors'] = User.objects.filter(
                startupmentor__startup=startup,
                startupmentor__status='active'
            )
        
        return context
