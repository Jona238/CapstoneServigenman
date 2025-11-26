from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("invoices", "0003_facturacompra_materialcompra"),
    ]

    operations = [
        migrations.AddField(
            model_name="facturacompra",
            name="cheque_bank",
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name="facturacompra",
            name="cheque_due_date",
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="facturacompra",
            name="cheque_number",
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name="facturacompra",
            name="is_paid",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="facturacompra",
            name="payment_type",
            field=models.CharField(
                blank=True,
                choices=[("contado", "Contado"), ("transferencia", "Transferencia"), ("cheque", "Cheque")],
                default="contado",
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name="facturacompra",
            name="rut",
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name="calendarentry",
            name="invoice_purchase",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="calendar_entries",
                to="invoices.facturacompra",
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
                ],
                db_index=True,
                max_length=32,
            ),
        ),
    ]

