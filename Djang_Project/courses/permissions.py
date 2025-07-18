from rest_framework import permissions

class IsInstructorOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée pour permettre uniquement aux instructeurs de modifier les cours.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and (
            request.user.is_staff or 
            hasattr(request.user, 'instructor_profile')
        )

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.instructor == request.user or request.user.is_staff

class IsEnrolledOrInstructor(permissions.BasePermission):
    """
    Permission personnalisée pour permettre l'accès uniquement aux étudiants inscrits 
    ou à l'instructeur du cours.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        if hasattr(obj, 'course'):
            course = obj.course
        elif hasattr(obj, 'module'):
            course = obj.module.course
        else:
            course = obj
            
        return (
            user.is_staff or
            course.instructor == user or
            course.enrollments.filter(student=user).exists()
        )
