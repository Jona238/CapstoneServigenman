from django.contrib import admin

from .models import FacturaVenta, CalendarEntry


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
  list_display = ("title", "date", "type", "invoice_sale")
  list_filter = ("type", "date")
  search_fields = ("title", "description")
