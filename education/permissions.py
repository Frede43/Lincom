from rest_framework import permissions

class IsCourseOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission permettant uniquement à l'instructeur propriétaire du cours
    de le modifier.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.instructor == request.user or request.user.is_staff

class IsEnrolledOrInstructor(permissions.BasePermission):
    """
    Permission permettant uniquement aux étudiants inscrits ou à l'instructeur
    du cours d'accéder au contenu.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_staff:
            return True
        if hasattr(obj, 'course'):
            return obj.course.instructor == user
        return obj.instructor == user or obj.enrollments.filter(student=user).exists()

class IsEnrollmentOwner(permissions.BasePermission):
    """
    Permission permettant uniquement à l'étudiant inscrit ou à l'instructeur
    du cours d'accéder à l'inscription.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_staff:
            return True
        return obj.course.instructor == user or obj.student == user
