from django.db import migrations
from django.conf import settings


def set_email(apps, schema_editor):
    User = apps.get_model(settings.AUTH_USER_MODEL.split('.')[0], settings.AUTH_USER_MODEL.split('.')[1])
    try:
        user = User.objects.get(username='jona')
        if not user.email:
            user.email = 'jon.morales@duocuc.cl'
            user.save(update_fields=['email'])
    except User.DoesNotExist:
        pass


class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0003_password_reset_code'),
    ]

    operations = [
        migrations.RunPython(set_email, migrations.RunPython.noop),
    ]

