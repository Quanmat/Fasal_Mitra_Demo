from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string

def send_notification_email(user, notification):
    subject = f"{notification['title']} - Fasal Mitra"
    from_email = settings.DEFAULT_FROM_EMAIL
    
    # Handle both user objects and email strings
    to_email = [user.email if hasattr(user, 'email') else user]

    context = {
        'user': user,
        'notification': notification
    }

    message = render_to_string('notification_email.html', context)
    send_mail(subject, message, from_email, to_email, html_message=message)

def send_welcome_email(user):
    subject = "Welcome to Fasal Mitra"
    from_email = settings.DEFAULT_FROM_EMAIL
    to_email = [user.email]

    context = {
        'user': user
    }

    message = render_to_string('welcome_email.html', context)
    send_mail(subject, message, from_email, to_email, html_message=message)

