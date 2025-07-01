from django.urls import path
from .views import OrderView, PaymentStatusView, GetOrderPayment, PaymentStatusView, CreatePaymentView

urlpatterns = [
    # path("orders/", OrderView.as_view(), name="create_order"),
    path("payment-status/<str:payment_id>/", PaymentStatusView.as_view(), name="payment_status"),
    path("contract/<int:contract_id>/", GetOrderPayment.as_view(), name="get_contract_order"),
    path('create/<str:contract_id>/<str:stage>/', CreatePaymentView.as_view(), name='create_payment'),
]
