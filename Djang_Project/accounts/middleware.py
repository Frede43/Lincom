from django.utils.deprecation import MiddlewareMixin
from django.shortcuts import redirect
from django.urls import reverse
from django.contrib import messages

class ProfileCompletionMiddleware(MiddlewareMixin):
    """
    Middleware pour s'assurer que les utilisateurs ont complété leur profil
    """
    def process_request(self, request):
        if request.user.is_authenticated:
            # Liste des URLs exemptées
            exempt_urls = [
                reverse('accounts:profile'),
                reverse('accounts:logout'),
                '/admin/',
                '/static/',
                '/media/',
            ]
            
            # Vérifier si l'URL actuelle est exemptée
            current_path = request.path
            if any(url in current_path for url in exempt_urls):
                return None
                
            # Vérifier si le profil est complet
            profile = request.user.profile
            required_fields = ['phone_number', 'organization']
            
            # Si un champ requis est vide
            if any(not getattr(profile, field) for field in required_fields):
                messages.warning(
                    request,
                    'Veuillez compléter votre profil pour accéder à toutes les fonctionnalités.'
                )
                return redirect('accounts:profile')
