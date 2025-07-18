from django.db.models import Q
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from .models import UserProfile

User = get_user_model()

class UserService:
    @staticmethod
    def search_users(query=None, role=None, expertise=None, organization=None):
        """
        Recherche des utilisateurs selon différents critères
        """
        users = User.objects.all()
        
        if query:
            users = users.filter(
                Q(username__icontains=query) |
                Q(email__icontains=query) |
                Q(first_name__icontains=query) |
                Q(last_name__icontains=query)
            )
        
        if role:
            users = users.filter(role=role)
            
        if expertise:
            users = users.filter(expertise__icontains=expertise)
            
        if organization:
            users = users.filter(profile__organization__icontains=organization)
            
        return users.distinct()

    @staticmethod
    def get_mentors():
        """
        Récupère tous les mentors actifs
        """
        return User.objects.filter(role='mentor')

    @staticmethod
    def get_entrepreneurs():
        """
        Récupère tous les entrepreneurs
        """
        return User.objects.filter(role='entrepreneur')

    @staticmethod
    def validate_profile_completion(user):
        """
        Vérifie si le profil d'un utilisateur est complet
        """
        profile = user.profile
        required_fields = ['phone_number', 'organization']
        missing_fields = []
        
        for field in required_fields:
            if not getattr(profile, field):
                missing_fields.append(field)
                
        if missing_fields:
            raise ValidationError({
                'incomplete_profile': f'Les champs suivants sont requis : {", ".join(missing_fields)}'
            })
        
        return True

class ProfileService:
    @staticmethod
    def update_profile(user, profile_data, profile_picture=None):
        """
        Met à jour le profil d'un utilisateur
        """
        profile = user.profile
        
        # Mise à jour des champs du profil
        for field, value in profile_data.items():
            if hasattr(profile, field):
                setattr(profile, field, value)
        
        # Gestion de la photo de profil
        if profile_picture:
            profile.profile_picture = profile_picture
            
        profile.save()
        return profile

    @staticmethod
    def get_profile_completion_percentage(user):
        """
        Calcule le pourcentage de complétion du profil
        """
        profile = user.profile
        fields = [
            user.first_name,
            user.last_name,
            user.email,
            profile.phone_number,
            profile.address,
            profile.organization,
            profile.linkedin_profile,
            user.bio,
            user.expertise
        ]
        
        completed = sum(1 for field in fields if field)
        total = len(fields)
        
        return (completed / total) * 100
