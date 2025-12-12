from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("inventory", "0004_inventorymovement"),
    ]

    operations = [
        migrations.AddField(
            model_name="item",
            name="distribuidor",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
        migrations.AddField(
            model_name="item",
            name="ubicacion_foto",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="item",
            name="ubicacion_texto",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
    ]
