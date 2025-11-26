from django.contrib import admin

from .models import FacturaVenta, CalendarEntry, FacturaCompra, MaterialCompra


@admin.register(FacturaVenta)
class FacturaVentaAdmin(admin.ModelAdmin):
  list_display = (
      "invoice_number",
      "invoice_type",
      "supplier",
      "issue_date",
      "total_amount",
      "net_amount",
      "vat_amount",
  )
  list_filter = ("invoice_type", "issue_date", "supplier")
  search_fields = ("invoice_number", "supplier", "rut", "description")


@admin.register(CalendarEntry)
class CalendarEntryAdmin(admin.ModelAdmin):
  list_display = ("title", "date", "type", "invoice_sale", "invoice_purchase")
  list_filter = ("type", "date")
  search_fields = ("title", "description")


@admin.register(FacturaCompra)
class FacturaCompraAdmin(admin.ModelAdmin):
  list_display = (
      "supplier",
      "issue_date",
      "payment_method",
      "payment_status",
      "payment_type",
      "cheque_bank",
      "cheque_due_date",
      "is_paid",
      "due_date",
      "net_amount",
      "tax_amount",
      "total_amount",
  )
  search_fields = ("supplier", "rut", "cheque_number", "cheque_bank")
  list_filter = ("issue_date", "payment_method", "payment_status", "payment_type", "is_paid")


@admin.register(MaterialCompra)
class MaterialCompraAdmin(admin.ModelAdmin):
  list_display = ("description", "quantity", "unit_price", "factura")
  search_fields = ("description",)
