from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
from django.utils import timezone


def seed_groups_and_users(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    Permission = apps.get_model('auth', 'Permission')
    User = apps.get_model(
        settings.AUTH_USER_MODEL.split('.')[0],
        settings.AUTH_USER_MODEL.split('.')[1],
    )
    ContentType = apps.get_model('contenttypes', 'ContentType')
    Item = apps.get_model('inventory', 'Item')

    # Crear o recuperar los grupos
    dev_group, _ = Group.objects.get_or_create(name='developer')
    viewer_group, _ = Group.objects.get_or_create(name='viewer')

    # Obtener el ContentType del modelo Item de forma segura
    try:
        ct = ContentType.objects.get_for_model(Item)
    except Exception:
        # Si por cualquier motivo no existe el ContentType aún, salimos sin romper la migración
        return

    # Códigos de permisos que queremos asignar
    needed_codenames = ['add_item', 'change_item', 'delete_item', 'view_item']

    # Buscar todos los permisos de ese content_type
    perms_qs = Permission.objects.filter(
        content_type=ct,
        codename__in=needed_codenames,
    )

    # Si aún no existen todos los permisos, no hacemos nada para no romper la migración
    if perms_qs.count() < len(needed_codenames):
        return

    perms = {p.codename: p for p in perms_qs}
    add_item = perms['add_item']
    change_item = perms['change_item']
    delete_item = perms['delete_item']
    view_item = perms['view_item']

    dev_perms = {add_item, change_item, delete_item, view_item}
    viewer_perms = {add_item, change_item, view_item}

    dev_group.permissions.set(dev_perms)
    viewer_group.permissions.set(viewer_perms)

    # Crear usuarios base
    from django.contrib.auth.hashers import make_password

    jona, _ = User.objects.get_or_create(
        username='jona',
        defaults={
            'password': make_password('200328'),
            'is_active': True,
        },
    )
    marcos, _ = User.objects.get_or_create(
        username='marcos',
        defaults={
            'password': make_password('197154'),
            'is_active': True,
        },
    )

    # Asignar grupos y flags
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
                (
                    'id',
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID',
                    ),
                ),
                (
                    'action',
                    models.CharField(
                        choices=[
                            ('delete', 'delete'),
                            ('update', 'update'),
                            ('create', 'create'),
                        ],
                        max_length=16,
                    ),
                ),
                (
                    'status',
                    models.CharField(
                        choices=[
                            ('pending', 'pending'),
                            ('approved', 'approved'),
                            ('rejected', 'rejected'),
                        ],
                        default='pending',
                        max_length=16,
                    ),
                ),
                ('item_id_snapshot', models.IntegerField(blank=True, null=True)),
                ('item_snapshot', models.JSONField(blank=True, default=dict)),
                ('payload', models.JSONField(blank=True, default=dict)),
                ('created_at', models.DateTimeField(default=timezone.now)),
                ('decided_at', models.DateTimeField(blank=True, null=True)),
                (
                    'created_by',
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    'decided_by',
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name='approved_changes',
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    'item',
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to='inventory.item',
                    ),
                ),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.RunPython(seed_groups_and_users, unseed_groups_and_users),
    ]

