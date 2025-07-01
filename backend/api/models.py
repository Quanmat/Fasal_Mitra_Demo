from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import CustomUser, FarmerProfile, CompanyProfile, BuyerProfile


class CropListingTemplate(models.Model):
    
    CROP_TYPES = [
        ("kharif", "Kharif"),
        ("rabi", "Rabi"),
        ("zaid", "Zaid"),
    ]
    name = models.CharField(max_length=255, verbose_name=_("Crop Name"))
    crop_type = models.CharField(max_length=10, choices=CROP_TYPES, verbose_name=_("Crop Type"))
    description = models.TextField(verbose_name=_("Crop Description"))
    image = models.ImageField(upload_to="crop_images/")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    supervised = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.crop_type} - {self.name}"


class ContractTemplate(models.Model):
    submitted_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="contract_templates")
    contract_name = models.CharField(max_length=255, verbose_name=_("Contract Name"))
    contract_description = models.TextField(verbose_name=_("Contract Description"))
    contract_file = models.FileField(upload_to="contract_documents/")
    created_at = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    approved = models.BooleanField(default=True)
    crop = models.ForeignKey(CropListingTemplate, on_delete=models.CASCADE, related_name="contract_templates", null=True, blank=True)
    total_quintal_required = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.contract_name} by {self.submitted_by.email}"
    
class EsignResponse(models.Model):
    USER_TYPES = [
        ("buyer", "Buyer"),
        ("seller", "Seller"),
    ]
    contract = models.ForeignKey("Contract", on_delete=models.CASCADE, related_name="esign_responses")
    type_of = models.CharField(max_length=10, choices=USER_TYPES)
    status = models.CharField(max_length=50)
    verification_id = models.CharField(max_length=50, unique=True)
    reference_id = models.IntegerField()
    document_id = models.IntegerField()
    signing_link = models.URLField()

    def __str__(self):
        return f"E-Sign Response: {self.verification_id}, Status: {self.status}"

class Contract(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]
    contract_template = models.ForeignKey(ContractTemplate, on_delete=models.CASCADE, related_name="contracts")
    buyer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="contracts_as_buyer")
    seller = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="contracts_as_seller")
    created_at = models.DateTimeField(auto_now_add=True)
    approved = models.BooleanField(default=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PENDING")
    signed_contract = models.FileField(upload_to="signed_contracts/", blank=True, null=True)
    estimate_production_in_quintal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    ml_model_estimate_production_in_quintal = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    estimate_total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    ml_model_estimate_total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    seller_signed = models.BooleanField(default=False)
    seller_signed_file = models.FileField(blank=True, null=True)
    buyer_signed = models.BooleanField(default=False)
    buyer_signed_file = models.FileField(blank=True, null=True)

    def __str__(self):
        return f"{self.contract_template.contract_name} between {self.buyer.email} and {self.seller.email}"
    

class Dispute(models.Model):
    DISPUTE_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('resolved', 'Resolved'),
        ('rejected', 'Rejected'),
    ]

    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name="disputes")
    raised_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="raised_disputes")
    description = models.TextField(verbose_name=_("Dispute Description"))
    status = models.CharField(
        max_length=10,
        choices=DISPUTE_STATUS_CHOICES,
        default='pending',
        verbose_name=_("Dispute Status")
    )
    admin_comment = models.TextField(verbose_name=_("Admin Comment"), blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Dispute by {self.raised_by.email} on Contract {self.contract.id}"
    

class Notifications(models.Model):
    NOTIFICATION_TYPES = [
        ("info", "Info"),
        ("warning", "Warning"),
        ("error", "Error"),
        ("success", "Success"),
        ("contract", "Contract"),
        ("dispute", "Dispute"),
        ("payment", "Payment"),
        ("profile", "Profile"),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    type_of = models.CharField(max_length=255, choices=NOTIFICATION_TYPES,default="info")
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} to {self.user.email}"
    

class Message(models.Model):
    SENT_BY_CHOICES = [
        ("user", "User"),
        ("ai", "AI"),
    ]
    sent_by = models.CharField(max_length=10, choices=SENT_BY_CHOICES, default="user")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="messages")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"By {self.user.email} on {self.created_at}"
    

class UploadedDocument(models.Model):
    file = models.FileField(upload_to="documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="pending")
    cashfree_document_id = models.CharField(max_length=100, null=True, blank=True)
    cashfree_response = models.JSONField(null=True, blank=True)
    error_message = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Document ID: {self.id}, Status: {self.status}"

class EsignRequest(models.Model):
    verification_id = models.CharField(max_length=50, unique=True)  # Unique identifier
    document_id = models.IntegerField(null=True)
    status = models.CharField(max_length=50, default="pending")  # E.g., pending, initiated, completed
    signers = models.JSONField()  # Store signer details
    response = models.JSONField(null=True, blank=True)  # Cashfree API response
    redirect_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"E-Sign Request: {self.verification_id}, Status: {self.status}"
    

class TransportationTender(models.Model):
    tender_name = models.CharField(max_length=255)
    tender_description = models.TextField()
    tender_file = models.FileField(upload_to="tender_documents/")
    created_at = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.tender_name
    

class TenderApplication(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]
    tender = models.ForeignKey(TransportationTender, on_delete=models.CASCADE, related_name="applications")
    application_file = models.FileField(upload_to="tender_applications/")
    applicant_name = models.CharField(max_length=255)
    applicant_contact = models.CharField(max_length=15)
    address = models.TextField()
    company_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")

    def __str__(self):
        return f"{self.user.email} applied for {self.tender.tender_name}"
