from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
from django.utils import timezone


def seed_groups_and_users(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    Permission = apps.get_model('auth', 'Permission')
    User = apps.get_model(settings.AUTH_USER_MODEL.split('.')[0], settings.AUTH_USER_MODEL.split('.')[1])
    ContentType = apps.get_model('contenttypes', 'ContentType')

    # Ensure groups
    dev_group, _ = Group.objects.get_or_create(name='developer')
    viewer_group, _ = Group.objects.get_or_create(name='viewer')

    # Grant permissions on Item model
    ct = ContentType.objects.get(app_label='inventory', model='item')
    add_item = Permission.objects.get(codename='add_item', content_type=ct)
    change_item = Permission.objects.get(codename='change_item', content_type=ct)
    delete_item = Permission.objects.get(codename='delete_item', content_type=ct)
    view_item = Permission.objects.get(codename='view_item', content_type=ct)

    dev_perms = {add_item, change_item, delete_item, view_item}
    viewer_perms = {add_item, change_item, view_item}

    dev_group.permissions.set(dev_perms)
    viewer_group.permissions.set(viewer_perms)

    # Ensure users jona and marcos
    from django.contrib.auth.hashers import make_password
    jona, _ = User.objects.get_or_create(username='jona', defaults={'password': make_password('200328'), 'is_active': True})
    marcos, _ = User.objects.get_or_create(username='marcos', defaults={'password': make_password('197154'), 'is_active': True})

    # Assign groups and staff flag
    if dev_group not in jona.groups.all():
        jona.groups.add(dev_group)
    jona.is_staff = True
    jona.save(update_fields=['is_staff'])

    if viewer_group not in marcos.groups.all():
        marcos.groups.add(viewer_group)
    marcos.is_staff = False
    marcos.save(update_fields=['is_staff'])


def unseed_groups_and_users(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    # Do not delete users; just detach groups
    for name in ('developer', 'viewer'):
        try:
            grp = Group.objects.get(name=name)
            grp.user_set.clear()
        except Group.DoesNotExist:
            pass


class Migration(migrations.Migration):
    dependencies = [
        ('inventory', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='PendingChange',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(choices=[('delete', 'delete'), ('update', 'update'), ('create', 'create')], max_length=16)),
                ('status', models.CharField(choices=[('pending', 'pending'), ('approved', 'approved'), ('rejected', 'rejected')], default='pending', max_length=16)),
                ('item_id_snapshot', models.IntegerField(blank=True, null=True)),
                ('item_snapshot', models.JSONField(blank=True, default=dict)),
                ('payload', models.JSONField(blank=True, default=dict)),
                ('created_at', models.DateTimeField(default=timezone.now)),
                ('decided_at', models.DateTimeField(blank=True, null=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('decided_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='approved_changes', to=settings.AUTH_USER_MODEL)),
                ('item', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='inventory.item')),
            ],
            options={'ordering': ['-created_at']},
        ),
        migrations.RunPython(seed_groups_and_users, unseed_groups_and_users),
    ]
