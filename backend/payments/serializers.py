from rest_framework import serializers
from .models import Order, Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"

class OrderSerializer(serializers.ModelSerializer):
    payments = PaymentSerializer(many=True)
    class Meta:
        model = Order
        fields = ['id', 'contract', 'amount', 'currency', 'receipt', 'status', 'created_at', 'payments']