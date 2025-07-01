from rest_framework.permissions import BasePermission

class IsVerifiedUser(BasePermission):
    """
    Allows access only to verified users.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.user_verified