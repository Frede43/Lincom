from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée pour permettre uniquement aux propriétaires d'un objet de le modifier.
    """

    def has_object_permission(self, request, view, obj):
        # Les permissions en lecture sont autorisées pour toute requête,
        # donc nous autoriserons toujours les requêtes GET, HEAD ou OPTIONS
        if request.method in permissions.SAFE_METHODS:
            return True

        # Les permissions d'écriture ne sont accordées qu'au propriétaire de l'objet
        return obj == request.user

class IsMentor(permissions.BasePermission):
    """
    Permission pour vérifier si l'utilisateur est un mentor.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'mentor'

class IsEntrepreneur(permissions.BasePermission):
    """
    Permission pour vérifier si l'utilisateur est un entrepreneur.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'entrepreneur'

class IsStakeholder(permissions.BasePermission):
    """
    Permission pour vérifier si l'utilisateur est un stakeholder.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'stakeholder'

class IsProfileOwner(permissions.BasePermission):
    """
    Permission pour vérifier si l'utilisateur est le propriétaire du profil.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user

class IsProfileComplete(permissions.BasePermission):
    """
    Permission pour vérifier si le profil de l'utilisateur est complet.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
            
        profile = request.user.profile
        required_fields = ['phone_number', 'organization']
        return all(getattr(profile, field) for field in required_fields)
