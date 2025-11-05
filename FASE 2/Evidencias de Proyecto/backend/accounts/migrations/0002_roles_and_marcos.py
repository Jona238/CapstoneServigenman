from django.conf import settings
from django.db import migrations


def seed_roles_and_users(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    User = apps.get_model(settings.AUTH_USER_MODEL.split('.')[0], settings.AUTH_USER_MODEL.split('.')[1])
    from django.contrib.auth.hashers import make_password

    developer, _ = Group.objects.get_or_create(name='developer')
    viewer, _ = Group.objects.get_or_create(name='viewer')

    # Ensure jona exists and is developer
    jona, _ = User.objects.get_or_create(
        username='jona', defaults={'password': make_password('200328'), 'is_active': True}
    )
    if developer not in jona.groups.all():
        jona.groups.add(developer)
    if not jona.is_staff:
        jona.is_staff = True
        jona.save(update_fields=['is_staff'])

    # Ensure marcos exists and is viewer
    marcos, _ = User.objects.get_or_create(
        username='marcos', defaults={'password': make_password('197154'), 'is_active': True}
    )
    if viewer not in marcos.groups.all():
        marcos.groups.add(viewer)
    if marcos.is_staff:
        marcos.is_staff = False
        marcos.save(update_fields=['is_staff'])


def unseed_roles_and_users(apps, schema_editor):
    # No-op: keep users; optionally detach from groups
    Group = apps.get_model('auth', 'Group')
    for name in ('developer', 'viewer'):
        try:
            grp = Group.objects.get(name=name)
            # Do not delete users; only clear relations
            grp.user_set.clear()
        except Group.DoesNotExist:
            pass


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('accounts', '0001_create_default_user'),
    ]

    operations = [
        migrations.RunPython(seed_roles_and_users, unseed_roles_and_users),
    ]

