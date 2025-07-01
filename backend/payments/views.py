import razorpay
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status
from .models import Order, Payment
from api.models import Contract
from .serializers import OrderSerializer, PaymentSerializer

class GetOrderPayment(APIView):

    def get(self, request, contract_id):
        contract = Contract.objects.get(id = contract_id)
        if contract.buyer != request.user:
            return Response({"error": "You are not authorized to view this order"}, status=status.HTTP_403_FORBIDDEN)
        order, _ = Order.objects.get_or_create(contract=contract)
        resp_data = OrderSerializer(order)
        return Response(resp_data.data, status=status.HTTP_200_OK)
    

class CreatePaymentView(APIView):

    def get(self, request, contract_id, stage):
        try:
            order = Contract.objects.get(id=contract_id).order
            if order.contract.buyer != request.user:
                return Response({"error": "You are not authorized to make payments for this order"}, status=status.HTTP_403_FORBIDDEN)
            if stage not in ["advance", "final"]:
                return Response({"error": "invalid stage"}, status=400)

            if stage == "advance":
                if order.payments.filter(stage="advance", status="captured").exists():
                    return Response({"error": "Advance payment already made"}, status=status.HTTP_400_BAD_REQUEST)
            elif stage == "final":
                if order.payments.filter(stage="final", status="captured").exists():
                    return Response({"error": "Final payment already made"}, status=status.HTTP_400_BAD_REQUEST)

            payment = Payment.objects.create(
                order=order,
                stage=stage,
            )
            
            response = client.order.create({
                "amount": int(payment.amount * 100),  # Convert from INR to paisa
                "currency": order.currency,
                "receipt": order.receipt,
                "notes": {
                    "email": payment.email,
                    "contact": payment.contact,
                },
            })

            if response.get("error"):
                payment.delete()
                return Response({"error": "some error occured"}, status=status.HTTP_400_BAD_REQUEST)

            payment.payment_id = response["id"] 
            print(payment.payment_id)
            payment.save()
            return Response(response, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)



class OrderView(ListAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(contract__buyer=self.request.user)


class PaymentStatusView(APIView):
    def get(self, request, payment_id):
        try:
            if not payment_id.lower().startswith("order_"):
                return Response({"error": "Invalid payment id"}, status=status.HTTP_400_BAD_REQUEST)
            if not Payment.objects.filter(payment_id=payment_id).exists():
                return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)
            payment_obj = Payment.objects.get(payment_id=payment_id)
            if payment_obj.order.contract.buyer != request.user:
                return Response({"error": "You are not authorized to view this payment"}, status=status.HTTP_403_FORBIDDEN)
            
            try:
                razorpay_payments = client.order.payments(payment_id)
            except razorpay.errors.ServerError as e:
                print(f"Razorpay Server Error: {e}")
                return Response({"error": "Payment retrieval failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            payments_data = razorpay_payments.get("items", [])

            if not payments_data:
                return Response({"error": "No Payment Found"}, status=status.HTTP_404_NOT_FOUND)

            print(payments_data)

            payment_obj.status = payments_data[0]["status"]
            payment_obj.method = payments_data[0].get("method", "")
            payment_obj.amount = payments_data[0]["amount"] / 100  # Convert from paisa to INR
            payment_obj.email = payments_data[0]["email"]
            payment_obj.contact = payments_data[0]["contact"]
            payment_obj.method = payments_data[0]["method"]
            payment_obj.save()

            # Serialize payments
            serializer = PaymentSerializer(payment_obj)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
        