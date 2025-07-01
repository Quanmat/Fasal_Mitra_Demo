from django.db import models
from api.models import Contract
import uuid
import decimal

def random_order_id():
    return f"ORD_{uuid.uuid4().hex}"

def random_receipt_id():
    return f"RCT_{uuid.uuid4().hex}"

class Order(models.Model):
    id = models.CharField(max_length=255, unique=True, default=random_order_id, primary_key=True)
    contract = models.OneToOneField(Contract, related_name="order", on_delete=models.CASCADE, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default="INR")
    receipt = models.CharField(max_length=255, blank=True, null=True, default=random_receipt_id)
    status = models.CharField(max_length=50, default="created")
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.id
    
    def save(self, *args, **kwargs):
        self.amount = self.contract.estimate_total_price
        super().save(*args, **kwargs)


class Payment(models.Model):
    PAYMENT_STAGE = (
        ("advance", "Advance Payment"),
        ("final", "Final Payment"),
    )
    STATUS_CHOICES = (
        ("created", "Created"),
        ("authorized", "Authorized"),
        ("captured", "Captured"),
        ("refunded", "Refunded"),
        ("failed", "Failed"),
    )
    METHOD_CHOICES = (
        ("card", "Card"),
        ("netbanking", "Net Banking"),
        ("wallet", "Wallet"),
        ("emi", "EMI"),
        ("upi", "UPI"),
    )
    payment_id = models.CharField(max_length=255, unique=True)
    stage = models.CharField(max_length=50, choices=PAYMENT_STAGE)
    order = models.ForeignKey(Order, related_name="payments", on_delete=models.CASCADE)
    status = models.CharField(max_length=50, default="created", choices=STATUS_CHOICES)  # created, captured, failed
    method = models.CharField(max_length=50, blank=True, null=True, choices=METHOD_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    email = models.EmailField()
    contact = models.CharField(max_length=15, default="9999999999")
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.payment_id
    
    def save(self, *args, **kwargs):
        if self.stage == "advance":
            self.amount = self.order.amount * decimal.Decimal('0.25')
        elif self.stage == "final":
            self.amount = self.order.amount * 0.75
        self.email = self.order.contract.buyer.email

        super().save(*args, **kwargs)