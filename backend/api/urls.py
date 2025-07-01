from django.urls import path
from .views import Home, ConractTemplateListCreateView, ContractView, DisputeListCreateView, AdminDisputeResolveView, CropListingTemplateView, GetContractView, EsignatureWebhookView, TenderApplicationView, TransportationTenderView, EsignBuyerView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from users.views import OtherUserView


urlpatterns = [
    path('', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('ping/', Home.as_view()),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('business/contract-templates/', ConractTemplateListCreateView.as_view()),
    path('contracts/', ContractView.as_view()),
    path('disputes/', DisputeListCreateView.as_view(), name='dispute-list-create'),
    path('disputes/<int:pk>/resolve/', AdminDisputeResolveView.as_view(), name='admin-dispute-resolve'),
    path('crop-listings/', CropListingTemplateView.as_view()),
    path('search-users/', OtherUserView.as_view()),
    path('contracts/<int:pk>/', GetContractView.as_view()),
    path('esign-webhook/', EsignatureWebhookView.as_view()),
    path('tender-application/', TenderApplicationView.as_view()),
    path('transportation-tenders/', TransportationTenderView.as_view()),
    path('esign-buyer/<int:pk>/', EsignBuyerView.as_view()),
]
