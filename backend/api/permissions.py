from rest_framework import permissions

class IsFarmer(permissions.BasePermission):
    """
    Custom permission to only allow farmers to access the view.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role == 'farmer'

class IsBuyer(permissions.BasePermission):
    """
    Custom permission to only allow buyers to access the view.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role == 'buyer'

class IsCompany(permissions.BasePermission):
    """
    Custom permission to only allow companies to access the view.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role == 'company'