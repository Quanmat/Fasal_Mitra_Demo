from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import ContractTemplate, Contract, Dispute
from .emails import send_notification_email
from django.conf import settings
from django.core.mail import send_mail


@receiver(pre_save, sender=ContractTemplate)
def cache_previous_is_verified_state(sender, instance, **kwargs):
    if instance.pk:
        previous_instance = ContractTemplate.objects.get(pk=instance.pk)
        instance._previous_approved = previous_instance.approved
    else:
        instance._previous_approved = None

@receiver(post_save, sender=ContractTemplate)
def verify_gst_info(instance, **kwargs):
    previous_approved = getattr(instance, '_previous_approved', None)

    if previous_approved is not None and not previous_approved and instance.approved:
        message = f'Your contract template has been approved.'
        send_notification_email(instance.submitted_by.email, {'title': 'Contract Template Approved', 'message': message})

@receiver(pre_save, sender=Dispute)
def cache_previous_status_state(sender, instance, **kwargs):
    if instance.pk:
        previous_instance = Dispute.objects.get(pk=instance.pk)
        instance._previous_status = previous_instance.status
        instance._previous_admin_comment = previous_instance.admin_comment
    else:
        instance._previous_status = None
        instance._previous_admin_comment = None

@receiver(post_save, sender=Dispute)
def notify_dispute_status_change(instance, **kwargs):
    previous_status = getattr(instance, '_previous_status', None)
    previous_admin_comment = getattr(instance, '_previous_admin_comment', None)

    if previous_status is not None and instance.status != previous_status:
        message = f'Your dispute status has been changed to {instance.status}.'
        send_notification_email(instance.raised_by.email, {'title': 'Dispute Status Change', 'message': message})

    if previous_admin_comment is not None and instance.admin_comment != previous_admin_comment:
        send_notification_email(instance.raised_by.email, {'title': 'Admin Comment', 'message': instance.admin_comment})
