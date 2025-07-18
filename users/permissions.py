from rest_framework import permissions

class IsSelfOrAdmin(permissions.BasePermission):
    """
    Permission permettant uniquement à l'utilisateur lui-même ou à un admin
    de modifier ses données.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj == request.user or request.user.is_staff

class IsMentorOrAdmin(permissions.BasePermission):
    """
    Permission permettant uniquement aux mentors ou aux admins d'accéder
    à certaines fonctionnalités.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.role == 'mentor' or request.user.is_staff
        )

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return hasattr(request.user, 'mentor_profile') or request.user.is_staff

class IsEntrepreneurOrAdmin(permissions.BasePermission):
    """
    Permission permettant uniquement aux entrepreneurs ou aux admins d'accéder
    à certaines fonctionnalités.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.role == 'entrepreneur' or request.user.is_staff
        )

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return hasattr(request.user, 'entrepreneur_profile') or request.user.is_staff

class IsStakeholderOrAdmin(permissions.BasePermission):
    """
    Permission permettant uniquement aux parties prenantes ou aux admins d'accéder
    à certaines fonctionnalités.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.role == 'stakeholder' or request.user.is_staff
        )

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return hasattr(request.user, 'stakeholder_profile') or request.user.is_staff

class IsAdminUser(permissions.BasePermission):
    """
    Permission permettant uniquement aux administrateurs d'accéder
    à certaines fonctionnalités.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.role == 'admin' or request.user.is_staff
        )
