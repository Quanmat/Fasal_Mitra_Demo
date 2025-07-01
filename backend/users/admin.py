from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser, GovernmentIDVerification, EmailVerificationToken, LandInformation, GSTInfo, FarmerProfile, BuyerProfile, CompanyProfile, AadharVerification


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ("email", "user_type", "is_active", "user_verified", "is_email_verified", "is_gov_id_verified")
    list_filter = ("is_staff", "is_active", "user_verified", "is_email_verified", "is_gov_id_verified", "user_type")
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "groups", "user_permissions")}),
        ("Verification", {"fields": ("is_email_verified", "is_gov_id_verified", "user_verified")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email", "password1", "password2", "is_staff",
                "is_active", "groups", "user_permissions"
            )}
        ),
    )
    search_fields = ("email",)
    ordering = ("email",)


class GovernmentIDVerificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_verified', 'submitted_at')
    actions = ['verify_gov_id']

    def verify_gov_id(self, request, queryset):
        queryset.update(is_verified=True)
        for obj in queryset:
            obj.user.is_gov_id_verified = True
            obj.user.save()
        self.message_user(request, "Selected IDs verified successfully.")


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(GovernmentIDVerification, GovernmentIDVerificationAdmin)
admin.site.register(EmailVerificationToken)
admin.site.register(GSTInfo)
admin.site.register(FarmerProfile)
admin.site.register(BuyerProfile)
admin.site.register(CompanyProfile)



@admin.register(AadharVerification)
class AadharVerificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'status')
    search_fields = ( 'user__username', 'ref_id')
    list_filter = ('status',)

@admin.register(LandInformation)
class LandInformationAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_verified')
    search_fields = ('user__username',)
    list_filter = ('is_verified',)
    