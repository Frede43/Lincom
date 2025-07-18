from rest_framework import permissions

class IsStartupOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission permettant uniquement à l'entrepreneur propriétaire de la startup
    de la modifier.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.entrepreneur.user == request.user or request.user.is_staff

class IsProjectOwnerOrMentor(permissions.BasePermission):
    """
    Permission permettant uniquement au propriétaire du projet ou aux mentors
    associés d'accéder au projet.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_staff:
            return True
        if user.role == 'MENTOR':
            return obj.startup.mentors.filter(user=user).exists()
        return obj.startup.entrepreneur.user == user

class IsMilestoneOwnerOrMentor(permissions.BasePermission):
    """
    Permission permettant uniquement au propriétaire du projet ou aux mentors
    associés de gérer les jalons.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_staff:
            return True
        if user.role == 'MENTOR':
            return obj.project.startup.mentors.filter(user=user).exists()
        return obj.project.startup.entrepreneur.user == user

class IsResourceOwnerOrMentor(permissions.BasePermission):
    """
    Permission permettant uniquement au propriétaire du projet ou aux mentors
    associés de gérer les ressources.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_staff:
            return True
        if user.role == 'MENTOR':
            return obj.project.startup.mentors.filter(user=user).exists()
        return obj.project.startup.entrepreneur.user == user
