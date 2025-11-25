from django.urls import path

from . import views

app_name = "invoices"

urlpatterns = [
    path("facturas/extract/", views.extract_invoice_data, name="invoice-extract"),
    path("invoices/", views.invoices_collection, name="invoice-list"),
    path("invoices/<str:invoice_id>/", views.invoice_detail, name="invoice-detail"),
    path("calendar/", views.calendar_collection, name="calendar-list"),
    path("calendar/<str:entry_id>/", views.calendar_detail, name="calendar-detail"),
]
