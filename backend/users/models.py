from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.core.mail import send_mail
from config import settings as SE
from django.utils.timezone import now
from datetime import timedelta
import uuid
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from .managers import CustomUserManager
from django.template.loader import render_to_string


class CustomUser(AbstractUser, PermissionsMixin):
    USER_TYPES = (
        ('farmer', 'Farmer'),
        ('buyer', 'Buyer'),
        ('company', 'Company'),
        ('admin', 'Admin'),
    )

    username = None
    email = models.EmailField(_("email address"), unique=True)
    user_type = models.CharField(max_length=50, choices=USER_TYPES, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    user_verified = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False, verbose_name=_("Email Verified"))
    is_gov_id_verified = models.BooleanField(default=False, verbose_name=_("Government ID Verified"))

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = CustomUserManager()

    def get_username(self):
        return self.email

    def username(self):
        return self.email

    def send_verification_email(self):
        """Send email verification with the token."""
        subject = "Fasal Mitra Email Verification"
        token, _ = EmailVerificationToken.objects.get_or_create(user=self)
        context = {
            'first_name': self.first_name,
            'token': token.token,
        }
        html_message = render_to_string('verification_email.html', context)
        send_mail(subject, "", SE.DEFAULT_FROM_EMAIL, [self.email], html_message=html_message)

    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):

        if not self.pk:
            super().save(*args, **kwargs)
        elif self.user_type == "admin":
            super().save(*args, **kwargs)
            return
        elif self.user_verified:
            super().save(*args, **kwargs)
            return

        if self.user_type == "farmer":
            if not hasattr(self, "farmer_profile"):
                self.farmer_profile = FarmerProfile.objects.create(user=self)
            farmer_profile = self.farmer_profile
            if self.is_gov_id_verified and hasattr(self, "land_info") and self.is_email_verified:
                if self.land_info.is_verified:
                    self.user_verified = True

        elif self.user_type == "buyer":
            if not hasattr(self, "buyer_profile"):
                self.buyer_profile = BuyerProfile.objects.create(user=self)
            buyer_profile = self.buyer_profile
            if self.is_email_verified and self.is_gov_id_verified:
                self.user_verified = True

        elif self.user_type == "company":
            if not hasattr(self, "company_profile"):
                self.company_profile = CompanyProfile.objects.create(user=self)
            company_profile = self.company_profile
            if self.is_email_verified and self.is_gov_id_verified and hasattr(self, "gst_info"):
                if self.gst_info.is_verified:
                    self.user_verified = True

        super().save(*args, **kwargs)
    

class EmailVerificationToken(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="email_verification_token")
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Token for {self.user.email}"

    def is_valid(self):
        # Token is valid for 1 hour
        return now() < self.created_at + timedelta(hours=1)
    

class GovernmentIDVerification(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="gov_id_info")
    gov_id = models.CharField(max_length=255, verbose_name=_("Government ID"))
    type_of_id = models.CharField(max_length=255, verbose_name=_("Type of ID"), default="Aadhar Card")
    is_verified = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Government ID of {self.user.email}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.user.is_gov_id_verified = self.is_verified
        self.user.save(update_fields=["is_gov_id_verified"])


class LandInformation(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="land_info")
    land_area = models.FloatField(verbose_name=_("Land Area (in acres)"))
    land_location = models.CharField(max_length=255, verbose_name=_("Land Location"))
    document_image = models.ImageField(upload_to="land_documents/")
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.land_area} acres at {self.land_location}"

class Address(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="address")
    address_line_1 = models.CharField(max_length=255, verbose_name=_("Address Line 1"))
    address_line_2 = models.CharField(max_length=255, verbose_name=_("Address Line 2"))
    city = models.CharField(max_length=255, verbose_name=_("City"))
    state = models.CharField(max_length=255, verbose_name=_("State"))
    pincode = models.CharField(max_length=255, verbose_name=_("Pincode"))

    def __str__(self):
        return f"{self.address_line_1}, {self.city}, {self.state} - {self.pincode}"


class GSTInfo(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="gst_info")
    gst_number = models.CharField(max_length=255, verbose_name=_("GST Number"))
    gst_certificate = models.ImageField(upload_to="gst_certificates/")
    is_verified = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"GST Number: {self.gst_number}"
    

class FarmerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="farmer_profile")
    bio = models.TextField(verbose_name=_("Bio"))
    profile_image = models.ImageField(upload_to="farmer_profiles/")
    created_at = models.DateTimeField(auto_now_add=True)
    crops = models.ManyToManyField("api.CropListingTemplate", related_name="farmers")

    def __str__(self):
        return f"Profile of {self.user.email}"
    

class BuyerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="buyer_profile")
    bio = models.TextField(verbose_name=_("Bio"))
    profile_image = models.ImageField(upload_to="seller_profiles/")
    created_at = models.DateTimeField(auto_now_add=True)
    listings = models.ManyToManyField("api.CropListingTemplate", related_name="buyers")

    def __str__(self):
        return f"Profile of {self.user.email}"
    

class CompanyProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="company_profile")
    company_name = models.CharField(max_length=255, verbose_name=_("Company Name"))
    company_description = models.TextField(verbose_name=_("Company Description"))
    company_logo = models.ImageField(upload_to="company_logos/")
    created_at = models.DateTimeField(auto_now_add=True)
    iso = models.CharField(max_length=255, verbose_name=_("ISO Certification"))

    def __str__(self):
        return f"Profile of {self.user.email}"
    
class AadharVerification(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    ref_id = models.CharField(max_length=50, unique=True)
    status = models.BooleanField(default=False)
    message = models.CharField(max_length=100)
    care_of = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    dob = models.CharField(max_length=10, blank=True, null=True)  # for date like "DD-MM-YYYY"
    email = models.EmailField(blank=True, null=True)
    gender = models.CharField(max_length=1, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    house = models.CharField(max_length=255, blank=True, null=True)
    landmark = models.CharField(max_length=255, blank=True, null=True)
    pincode = models.CharField(max_length=6, blank=True, null=True)
    po = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    street = models.CharField(max_length=255, blank=True, null=True)
    subdistrict = models.CharField(max_length=100, blank=True, null=True)
    vtc = models.CharField(max_length=100, blank=True, null=True)
    year_of_birth = models.CharField(max_length=4, blank=True, null=True)
    mobile_hash = models.CharField(max_length=255, blank=True, null=True)
    photo_link = models.URLField(blank=True, null=True)
    share_code = models.CharField(max_length=10, blank=True, null=True)
    xml_file = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.ref_id}"