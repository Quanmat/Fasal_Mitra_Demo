from rest_framework import serializers
from .models import EmailVerificationToken, LandInformation, GovernmentIDVerification, CustomUser, GSTInfo, FarmerProfile, CompanyProfile, BuyerProfile

class EmailVerificationTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailVerificationToken
        fields = ['token', 'user', 'created_at']


class LandInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandInformation
        fields = ['land_area', 'land_location', 'document_image', 'submitted_at', 'is_verified']
        read_only_fields = ['submitted_at', 'is_verified']


class GovernmentIDVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GovernmentIDVerification
        fields = ['gov_id', 'type_of_id', 'is_verified', 'submitted_at']
        read_only_fields = ['submitted_at', 'is_verified']

class GSTInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GSTInfo
        fields = ['gst_number', 'is_verified', 'submitted_at', 'gst_certificate']
        read_only_fields = ['submitted_at', 'is_verified']

class FarmerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmerProfile
        fields = ['user', 'profile_image', 'bio']
        read_only_fields = ['user']

class BuyerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerProfile
        fields = ['user', 'bio', 'profile_image', 'created_at', 'listings']
        read_only_fields = ['user', 'created_at']

class CompanyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = ['user', 'company_name', 'company_description', 'company_logo', 'created_at']
        read_only_fields = ['user', 'created_at']

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'user_type', 'is_active', 'is_staff', 'is_email_verified', 'is_gov_id_verified', 'user_verified']
        read_only_fields = ['is_email_verified', 'is_gov_id_verified', 'user_verified', 'is_active', 'is_staff']


class AadhaarOtpRequestSerializer(serializers.Serializer):
    aadhaar_number = serializers.CharField(max_length=12)

    def validate_aadhaar_number(self, value):
        if not value.isdigit() or len(value) != 12:
            raise serializers.ValidationError("Invalid Aadhaar number.")
        return value
    
class VerifyOtpRequestSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6)
    ref_id = serializers.CharField()

    def validate_otp(self, value):
        if not value.isdigit() or len(value) != 6:
            raise serializers.ValidationError("Invalid OTP.")
        return value
    
class OtherUserSerializer(serializers.ModelSerializer):
    farmer_profile = FarmerProfileSerializer()
    company_profile = CompanyProfileSerializer()
    buyer_profile = BuyerProfileSerializer()
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'user_type', 'user_verified', 'farmer_profile', 'company_profile', 'buyer_profile']

