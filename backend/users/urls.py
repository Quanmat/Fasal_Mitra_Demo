from django.urls import path
from .views import VerifyEmailView, LandView, GovernmentIDView, GSTInfoView, FarmerProfileView, CompanyProfileView, BuyerProfileView, CustomUserView, RequestOtpAPIView, VerifyOtpAPIView, OtherUserView

urlpatterns = [
    path('verify-email/<uuid:token>/', VerifyEmailView.as_view(), name='verify-email'),
    path('user/land/', LandView.as_view(), name='land'),
    path('user/government-id/', GovernmentIDView.as_view(), name='government-id'),
    path('user/gst-info/', GSTInfoView.as_view(), name='gst-info'),
    path('user/farmer-profile/', FarmerProfileView.as_view(), name='farmer-profile'),
    path('user/company-profile/', CompanyProfileView.as_view(), name='company-profile'),
    path('user/buyer-profile/', BuyerProfileView.as_view(), name='buyer-profile'),
    path('user/', CustomUserView.as_view(), name='user'),
    path('request-otp/', RequestOtpAPIView.as_view(), name='request-otp'),
    path('verify-otp/', VerifyOtpAPIView.as_view(), name='verify-otp'),
]
