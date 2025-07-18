from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views.generic import CreateView, UpdateView
from django.contrib.auth.views import LoginView
from django.urls import reverse_lazy
from .forms import UserRegistrationForm, UserProfileForm, UserUpdateForm, CustomAuthenticationForm
from .models import Profile
from django.contrib.auth import get_user_model
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Responsefrom .serializers import UserSerializer, ProfileSerializer
from .permissions import IsOwnerOrReadOnly

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        queryset = User.objects.all()
        role = self.request.query_params.get('role', None)
        expertise = self.request.query_params.get('expertise', None)
        organization = self.request.query_params.get('organization', None)

        if role:
            queryset = queryset.filter(role=role)
        if expertise:
            queryset = queryset.filter(expertise__icontains=expertise)
        if organization:
            queryset = queryset.filter(profile__organization__icontains=organization)
        
        return queryset

    @action(detail=True, methods=['post'])
    def change_password(self, request, pk=None):
        user = self.get_object()
        if user != request.user:
            return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
            
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not user.check_password(old_password):
            return Response({'detail': 'Wrong password'}, status=status.HTTP_400_BAD_REQUEST)
            
        user.set_password(new_password)
        user.save()
        return Response({'detail': 'Password updated successfully'})

class CustomLoginView(LoginView):
    form_class = CustomAuthenticationForm
    template_name = 'accounts/login.html'
    redirect_authenticated_user = True
    
    def get_success_url(self):
        next_url = self.request.GET.get('next')
        if next_url:
            return next_url
        return reverse_lazy('accounts:dashboard')
    
    def form_invalid(self, form):
        messages.error(self.request, "Nom d'utilisateur ou mot de passe incorrect.")
        return super().form_invalid(form)

class SignUpView(CreateView):
    form_class = UserRegistrationForm
    template_name = 'accounts/signup.html'
    success_url = reverse_lazy('accounts:dashboard')
    
    def form_valid(self, form):
        response = super().form_valid(form)
        user = form.save()
        
        # Création du profil utilisateur
        profile = Profile.objects.create(
            user=user,
            user_type=form.cleaned_data.get('user_type')
        )
        
        # Connexion automatique après l'inscription
        raw_password = form.cleaned_data.get('password1')
        user = authenticate(username=user.username, password=raw_password)
        login(self.request, user)
        
        messages.success(self.request, "Votre compte a été créé avec succès !")
        return response
    
    def form_invalid(self, form):
        messages.error(self.request, "Il y a eu une erreur lors de l'inscription. Veuillez corriger les erreurs ci-dessous.")
        return super().form_invalid(form)

@login_required
def profile(request):
    if request.method == 'POST':
        user_form = UserUpdateForm(request.POST, request.FILES, instance=request.user)
        profile_form = UserProfileForm(request.POST, instance=request.user.profile)
        
        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            messages.success(request, "Votre profil a été mis à jour avec succès !")
            return redirect('accounts:profile')
    else:
        user_form = UserUpdateForm(instance=request.user)
        profile_form = UserProfileForm(instance=request.user.profile)
    
    context = {
        'user_form': user_form,
        'profile_form': profile_form
    }
    return render(request, 'accounts/profile.html', context)

@login_required
def dashboard(request):
    user = request.user
    context = {
        'enrolled_courses': user.courses_enrolled.all()[:5],
        'registered_trainings': user.trainings.all()[:5]
    }
    if user.profile.user_type == 'mentor':
        context.update({
            'courses_taught': user.courses_taught.all()[:5],
            'trainings_conducted': user.trainings_conducted.all()[:5]
        })
    return render(request, 'accounts/dashboard.html', context)

@login_required
def user_list(request):
    role = request.GET.get('role')
    expertise = request.GET.get('expertise')
    organization = request.GET.get('organization')
    
    users = User.objects.all()
    
    if role:
        users = users.filter(role=role)
    if expertise:
        users = users.filter(expertise__icontains=expertise)
    if organization:
        users = users.filter(profile__organization__icontains=organization)
        
    return render(request, 'accounts/user_list.html', {
        'users': users,
        'current_role': role,
        'current_expertise': expertise,
        'current_organization': organization
    })

@login_required
def user_detail(request, username):
    user = get_object_or_404(User, username=username)
    return render(request, 'accounts/user_detail.html', {'profile_user': user})

@login_required
def settings(request):
    if request.method == 'POST':
        form = UserUpdateForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Vos paramètres ont été mis à jour avec succès.')
            return redirect('accounts:settings')
    else:
        form = UserUpdateForm(instance=request.user)
    
    return render(request, 'accounts/settings.html', {
        'form': form
    })
