import uuid

from django.db import models


class FacturaVenta(models.Model):
  _invoice_types = (("compra", "Compra"), ("venta", "Venta"))

  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  invoice_type = models.CharField(max_length=10, choices=_invoice_types, db_index=True)
  invoice_number = models.CharField(max_length=120, blank=True)
  issue_date = models.DateField(null=True, blank=True)
  supplier = models.CharField(max_length=255, blank=True)
  rut = models.CharField(max_length=32, blank=True)
  address = models.CharField(max_length=255, blank=True)
  contact = models.CharField(max_length=255, blank=True)
  description = models.TextField(blank=True)
  total_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
  net_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
  vat_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
  quantity = models.IntegerField(null=True, blank=True)
  unit_price = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
  materials = models.JSONField(null=True, blank=True)
  attachment = models.FileField(upload_to="invoices/", null=True, blank=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    ordering = ["-created_at"]
    verbose_name = "Factura"
    verbose_name_plural = "Facturas"

  def __str__(self) -> str:  # pragma: no cover - presentation
    return f"{self.invoice_type.upper()} {self.invoice_number or self.id}"


class CalendarEntry(models.Model):
  ENTRY_TYPES = (
      ("factura_venta", "Factura de venta"),
      ("nota", "Nota"),
      ("inicio_trabajo", "Inicio de trabajo"),
      ("termino_trabajo", "Término de trabajo"),
      ("factura_compra", "Factura de compra"),
      ("pago_pendiente", "Pago pendiente"),
      ("pago_compra", "Pago de compra"),
  )

  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  date = models.DateField()
  title = models.CharField(max_length=255)
  description = models.TextField(blank=True)
  type = models.CharField(max_length=32, choices=ENTRY_TYPES, db_index=True)
  invoice_sale = models.ForeignKey(
      FacturaVenta,
      on_delete=models.CASCADE,
      related_name="calendar_entries",
      null=True,
      blank=True,
  )
  invoice_purchase = models.ForeignKey(
      "FacturaCompra",
      null=True,
      blank=True,
      on_delete=models.SET_NULL,
      related_name="calendar_entries",
  )
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    ordering = ["-date", "-created_at"]

  def __str__(self) -> str:  # pragma: no cover - presentation
    return f"{self.date} - {self.title}"


class FacturaCompra(models.Model):
  PAYMENT_TYPES = [
      ("contado", "Contado"),
      ("transferencia", "Transferencia"),
      ("cheque", "Cheque"),
  ]
  PAYMENT_STATUS = [
      ("pendiente", "Pendiente"),
      ("pagado", "Pagado"),
      ("parcial", "Parcial"),
  ]

  supplier = models.CharField(max_length=255)
  issue_date = models.DateField()
  rut = models.CharField(max_length=50, blank=True)
  net_amount = models.DecimalField(max_digits=12, decimal_places=2)
  tax_amount = models.DecimalField(max_digits=12, decimal_places=2)
  total_amount = models.DecimalField(max_digits=12, decimal_places=2)
  payment_method = models.CharField(
      max_length=20,
      choices=PAYMENT_TYPES,
      blank=True,
      default="contado",
  )
  payment_status = models.CharField(
      max_length=20,
      choices=PAYMENT_STATUS,
      blank=True,
      default="pendiente",
  )
  due_date = models.DateField(null=True, blank=True)
  payment_notes = models.TextField(blank=True)
  payment_type = models.CharField(
      max_length=20,
      choices=PAYMENT_TYPES,
      blank=True,
      default="contado",
  )
  cheque_bank = models.CharField(max_length=100, blank=True)
  cheque_number = models.CharField(max_length=50, blank=True)
  cheque_due_date = models.DateField(null=True, blank=True)
  is_paid = models.BooleanField(default=False)
  attachment = models.FileField(upload_to="purchase_invoices/", null=True, blank=True)
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    db_table = "invoices_facturacompra"
    ordering = ["-issue_date", "-created_at"]

  def __str__(self) -> str:  # pragma: no cover
    return f"Compra {self.supplier} {self.issue_date}"


class MaterialCompra(models.Model):
  factura = models.ForeignKey(
      FacturaCompra,
      related_name="materials",
      on_delete=models.CASCADE,
  )
  description = models.CharField(max_length=255)
  quantity = models.PositiveIntegerField(default=1)
  unit_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

  def __str__(self) -> str:  # pragma: no cover
    return f"{self.description} ({self.quantity})"
