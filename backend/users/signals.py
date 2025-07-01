from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from api.emails import send_notification_email, send_welcome_email
from django.conf import settings
from .models import CustomUser, LandInformation, GSTInfo

@receiver(post_save, sender=CustomUser)
def send_verification_email(instance, created, **kwargs):
    # Check if it's a new user creation
    if created:
        instance.send_verification_email()
        return

    update_fields = kwargs.get('update_fields')

    if not update_fields:
        return

    if instance.user_type == 'farmer':
        pass
    elif instance.user_type == 'company':
        pass
    elif instance.user_type == 'buyer':
        pass

    if 'is_gov_id_verified' in update_fields and instance.is_gov_id_verified:
        send_notification_email(instance, notification={"title": "Verification Update", "message": "Your government ID has been verified."})
    elif 'is_email_verified' in update_fields and instance.is_email_verified:
        send_notification_email(instance, notification={"title": "Verification Update", "message": "Your email has been verified."})
    elif 'user_verified' in update_fields and instance.user_verified:
        send_welcome_email(instance)

@receiver(pre_save, sender=LandInformation)
def cache_previous_is_verified_state(sender, instance, **kwargs):
    if instance.pk:
        previous_instance = LandInformation.objects.get(pk=instance.pk)
        instance._previous_is_verified = previous_instance.is_verified
    else:
        instance._previous_is_verified = None

@receiver(post_save, sender=LandInformation)
def verify_land_info(instance, **kwargs):
    previous_is_verified = getattr(instance, '_previous_is_verified', None)

    if previous_is_verified is not None and not previous_is_verified and instance.is_verified:
        send_notification_email(instance.user, {"title": "Land Information Verification", "message": "Your land information has been verified."})
    
    instance.user.save()


@receiver(pre_save, sender=GSTInfo)
def cache_previous_is_verified_state(sender, instance, **kwargs):
    if instance.pk:  # Check if the instance exists in the database
        previous_instance = GSTInfo.objects.get(pk=instance.pk)
        instance._previous_is_verified = previous_instance.is_verified
    else:
        instance._previous_is_verified = None

@receiver(post_save, sender=GSTInfo)
def verify_gst_info(instance, **kwargs):
    previous_is_verified = getattr(instance, '_previous_is_verified', None)

    if previous_is_verified is not None and not previous_is_verified and instance.is_verified:
        send_notification_email(instance.user, {"title": "GST Information Verification", "message": "Your GST information has been verified."})
    
    instance.user.save()

