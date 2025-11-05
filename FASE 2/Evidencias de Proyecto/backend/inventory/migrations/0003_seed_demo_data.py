from django.conf import settings
from django.db import migrations


def seed_demo(apps, schema_editor):
    Item = apps.get_model('inventory', 'Item')
    PendingChange = apps.get_model('inventory', 'PendingChange')
    User = apps.get_model(settings.AUTH_USER_MODEL.split('.')[0], settings.AUTH_USER_MODEL.split('.')[1])

    # Ensure a few items exist
    demo_items = [
        {"recurso": "Bombas sumergibles 1HP", "categoria": "Bombas de agua", "cantidad": 5, "precio": 120.00, "foto": "", "info": "Equipo básico"},
        {"recurso": "Taladro percutor", "categoria": "Herramientas", "cantidad": 12, "precio": 65.50, "foto": "", "info": "Uso general"},
        {"recurso": "Cable 2x1.5mm", "categoria": "Materiales eléctricos", "cantidad": 200, "precio": 0.95, "foto": "", "info": "Rollos de 100m"},
    ]

    existing = set(Item.objects.values_list('recurso', flat=True))
    for data in demo_items:
        if data["recurso"] not in existing:
            Item.objects.create(**data)

    # Create a few pending changes as examples (if none exist)
    if not PendingChange.objects.exists():
        marcos = None
        jona = None
        try:
            marcos = User.objects.filter(username='marcos').first()
            jona = User.objects.filter(username='jona').first()
        except Exception:
            pass

        items = list(Item.objects.all().order_by('id')[:3])
        if items:
            # Pending delete by marcos
            PendingChange.objects.create(
                action='delete', status='pending', item=items[0], item_id_snapshot=items[0].id,
                item_snapshot={
                    "id": items[0].id, "recurso": items[0].recurso, "categoria": items[0].categoria,
                    "cantidad": items[0].cantidad, "precio": float(items[0].precio),
                    "foto": items[0].foto, "info": items[0].info,
                },
                payload={}, created_by=marcos
            )
        if len(items) > 1:
            # Pending update by marcos
            PendingChange.objects.create(
                action='update', status='pending', item=items[1], item_id_snapshot=items[1].id,
                item_snapshot={
                    "id": items[1].id, "recurso": items[1].recurso, "categoria": items[1].categoria,
                    "cantidad": items[1].cantidad, "precio": float(items[1].precio),
                    "foto": items[1].foto, "info": items[1].info,
                },
                payload={"precio": 99.99, "cantidad": items[1].cantidad + 3}, created_by=marcos
            )

        # Pending create by marcos
        PendingChange.objects.create(
            action='create', status='pending', item=None, item_id_snapshot=None, item_snapshot={},
            payload={
                "recurso": "Llave inglesa 10\"", "categoria": "Herramientas", "cantidad": 8, "precio": 12.5,
                "foto": "", "info": "Acero forjado"
            },
            created_by=marcos
        )


def unseed_demo(apps, schema_editor):
    # Keep demo data; no-op on reverse
    pass


class Migration(migrations.Migration):
    dependencies = [
        ('inventory', '0002_pending_changes_and_roles'),
    ]

    operations = [
        migrations.RunPython(seed_demo, unseed_demo),
    ]

