from rest_framework import serializers
from .models import ContractTemplate, Contract, CropListingTemplate, Dispute, Notifications, UploadedDocument, EsignResponse, TenderApplication, TransportationTender
from users.serializers import OtherUserSerializer
from payments.serializers import OrderSerializer

class CropListingTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropListingTemplate
        fields = ['id', 'name', 'description', 'image', 'is_active', 'created_at', 'crop_type']
        read_only_fields = ['id', 'created_at']


class ConractTemplateSerializer(serializers.ModelSerializer):
    submitted_by = OtherUserSerializer(read_only=True)
    class Meta:
        model = ContractTemplate
        fields = ['id', 'submitted_by', 'contract_name', 'contract_description', 'contract_file', 'created_at', 'approved', 'price', 'crop', 'total_quintal_required']
        read_only_fields = ['id', 'submitted_by', 'created_at', 'approved']


class ContractSerializer(serializers.ModelSerializer):
    seller = OtherUserSerializer(read_only=True)
    buyer = OtherUserSerializer(read_only=True)
    class Meta:
        model = Contract
        fields = ['id', 'contract_template', 'buyer', 'seller', 'created_at', 'approved', 'status', 'signed_contract', 'estimate_production_in_quintal', 'estimate_total_price', 'buyer_signed', 'seller_signed']
        read_only_fields = ['id', 'created_at', 'approved', 'buyer', 'seller', 'status', 'signed_contract', 'buyer_signed', 'seller_signed']

class ESignSerializer(serializers.ModelSerializer):
    class Meta:
        model = EsignResponse
        fields = ["contract", "type_of", "status", "verification_id", "reference_id", "document_id", "signing_link"]

class GetContractSerializer(serializers.ModelSerializer):
    seller = OtherUserSerializer(read_only=True)
    buyer = OtherUserSerializer(read_only=True)
    esign_responses = ESignSerializer(many=True)
    order = OrderSerializer(read_only=True)
    class Meta:
        model = Contract
        fields = ['id', 'contract_template', 'buyer', 'seller', 'created_at', 'approved', 'status', 'signed_contract', 'estimate_production_in_quintal', 'estimate_total_price', 'buyer_signed', 'seller_signed', 'esign_responses', 'order']
        read_only_fields = ['id', 'created_at', 'approved', 'buyer', 'seller', 'status', 'signed_contract', 'buyer_signed', 'seller_signed']


class DisputeSerializer(serializers.ModelSerializer):
    contract = ContractSerializer()
    class Meta:
        model = Dispute
        fields = ['id', 'contract', 'raised_by', 'description', 'status', 'admin_comment', 'created_at']
        read_only_fields = ['id', 'status', 'admin_comment', 'created_at', 'raised_by']

class AdminDisputeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dispute
        fields = ['id', 'status', 'admin_comment']
        read_only_fields = ['id']

class NotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = '__all__'

class DocumentUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedDocument
        fields = ['file']

    def validate_file(self, value):
        # Ensure the uploaded file is a PDF and <= 10MB
        if not value.name.endswith('.pdf'):
            raise serializers.ValidationError("Only PDF files are allowed.")
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("File size must be <= 10MB.")
        return value

class SignerSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=15)
    sequence = serializers.IntegerField()
    aadhaar_last_four_digit = serializers.CharField(max_length=4, required=False)
    sign_positions = serializers.ListField(
        child=serializers.DictField(), required=True  # List of dictionaries for sign positions
    )

class EsignStatusQuerySerializer(serializers.Serializer):
    verification_id = serializers.CharField(required=False, max_length=50)
    reference_id = serializers.CharField(required=False, max_length=50)

    def validate(self, data):
        if not data.get('verification_id') and not data.get('reference_id'):
            raise serializers.ValidationError(
                "Either 'verification_id' or 'reference_id' must be provided."
            )
        return data
    
class TenderApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenderApplication
        fields = ['id', 'tender', 'applicant_name', 'applicant_contact', 'status', 'created_at', 'application_file', 'address', 'company_name']
        read_only_fields = ['id', 'created_at', 'status']

class TransportationTenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportationTender
        fields = '__all__'
