from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.db import migrations


def create_default_user(apps, schema_editor):
    User = apps.get_model(settings.AUTH_USER_MODEL.split('.')[0], settings.AUTH_USER_MODEL.split('.')[1])
    username = 'jona'
    password = '200328'

    # Try create with defaults (hash the password explicitly; historical models lack set_password)
    user, created = User.objects.get_or_create(
        username=username,
        defaults={
            'password': make_password(password),
            'first_name': '',
            'last_name': '',
            'email': '',
            'is_active': True,
        },
    )
    if not created:
        # Update the password hash and ensure the user is active
        User.objects.filter(pk=user.pk).update(
            password=make_password(password), is_active=True
        )


def remove_default_user(apps, schema_editor):
    User = apps.get_model(settings.AUTH_USER_MODEL.split('.')[0], settings.AUTH_USER_MODEL.split('.')[1])
    User.objects.filter(username='jona').delete()


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RunPython(create_default_user, remove_default_user),
    ]
