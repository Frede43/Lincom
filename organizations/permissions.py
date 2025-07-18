from rest_framework import permissions

class IsOrganizationAdminOrReadOnly(permissions.BasePermission):
    """
    Permission permettant uniquement aux administrateurs de l'organisation
    de la modifier.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff

class IsCallForProjectAdminOrReadOnly(permissions.BasePermission):
    """
    Permission permettant uniquement aux administrateurs de l'organisation
    de modifier l'appel à projets.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff

class IsCompetitionAdminOrReadOnly(permissions.BasePermission):
    """
    Permission permettant uniquement aux administrateurs de l'organisation
    de modifier la compétition.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff

class IsSubmissionOwnerOrAdmin(permissions.BasePermission):
    """
    Permission permettant uniquement au propriétaire de la soumission ou
    aux administrateurs d'y accéder.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.submitter == request.user
