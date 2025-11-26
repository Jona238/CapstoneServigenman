from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("invoices", "0004_purchase_payment_fields"),
    ]

    operations = [
        migrations.AddField(
            model_name="facturacompra",
            name="due_date",
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="facturacompra",
            name="payment_method",
            field=models.CharField(
                blank=True,
                choices=[("contado", "Contado"), ("transferencia", "Transferencia"), ("cheque", "Cheque")],
                default="contado",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="facturacompra",
            name="payment_notes",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="facturacompra",
            name="payment_status",
            field=models.CharField(
                blank=True,
                choices=[("pendiente", "Pendiente"), ("pagado", "Pagado"), ("parcial", "Parcial")],
                default="pendiente",
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name="calendarentry",
            name="type",
            field=models.CharField(
                choices=[
                    ("factura_venta", "Factura de venta"),
                    ("nota", "Nota"),
                    ("inicio_trabajo", "Inicio de trabajo"),
                    ("termino_trabajo", "Término de trabajo"),
                    ("factura_compra", "Factura de compra"),
                    ("pago_pendiente", "Pago pendiente"),
                    ("pago_compra", "Pago de compra"),
                ],
                db_index=True,
                max_length=32,
            ),
        ),
    ]

