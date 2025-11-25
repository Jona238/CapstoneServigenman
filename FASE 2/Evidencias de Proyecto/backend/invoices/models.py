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
  ENTRY_TYPES = (("factura_venta", "Factura de venta"), ("nota", "Nota"))

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
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    ordering = ["-date", "-created_at"]

  def __str__(self) -> str:  # pragma: no cover - presentation
    return f"{self.date} - {self.title}"
