from django.contrib import admin
from .models import ContractTemplate, Contract, CropListingTemplate, Dispute, Notifications, EsignResponse, TenderApplication, TransportationTender

@admin.register(ContractTemplate)
class ContractTemplateAdmin(admin.ModelAdmin):
    list_display = ('contract_name', 'created_at')
    search_fields = ('contract_name',)

@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ('contract_template', 'created_at', 'buyer', 'seller')
    search_fields = ('contract_template__contract_name',)
    
@admin.register(CropListingTemplate)
class CropListingTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)
    list_filter = ('crop_type',)

@admin.register(Dispute)
class DisputeAdmin(admin.ModelAdmin):
    list_display = ('raised_by', 'status', 'created_at')
    search_fields = ('raised_by__email',)
    list_filter = ('status',)
    raw_id_fields = ('contract',)

@admin.register(Notifications)
class NotificationsAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'created_at')
    search_fields = ('user__email',)
    list_filter = ('type_of', 'is_read')

@admin.register(EsignResponse)
class EsignResponseAdmin(admin.ModelAdmin):
    list_display = ('contract', 'status')
    search_fields = ('contract__contract_template__contract_name',)

@admin.register(TenderApplication)
class TenderApplicationAdmin(admin.ModelAdmin):
    list_display = ('tender', 'created_at')
    search_fields = ('company_name',)

@admin.register(TransportationTender)
class TransportationTenderAdmin(admin.ModelAdmin):
    list_display = ('tender_name', 'created_at')
    search_fields = ('tender_name',)
