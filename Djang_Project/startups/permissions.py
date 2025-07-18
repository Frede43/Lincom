from rest_framework import permissions

class IsFounderOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée pour autoriser uniquement les fondateurs d'une startup
    à éditer cette startup.
    """

    def has_object_permission(self, request, view, obj):
        # Les permissions en lecture sont autorisées pour toute requête
        if request.method in permissions.SAFE_METHODS:
            return True

        # Les permissions d'écriture sont uniquement autorisées pour le fondateur
        return obj.founder == request.user

class IsTeamMemberOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée pour autoriser uniquement les membres de l'équipe
    à éditer les informations liées à la startup.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Vérifie si l'utilisateur est membre de l'équipe ou fondateur
        return (obj.startup.team_members.filter(id=request.user.id).exists() or
                obj.startup.founder == request.user)

class IsMentorOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée pour autoriser uniquement les mentors
    à éditer leurs informations de mentorat.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Vérifie si l'utilisateur est le mentor concerné
        return obj.mentor == request.user

class IsInvestorOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée pour autoriser uniquement les investisseurs
    à éditer leurs informations d'investissement.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Vérifie si l'utilisateur est l'investisseur concerné
        return obj.investor == request.user
