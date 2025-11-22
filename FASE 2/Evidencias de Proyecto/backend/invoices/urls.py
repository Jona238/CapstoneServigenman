from django.urls import path

from . import views

app_name = "invoices"

urlpatterns = [
    path("facturas/extract/", views.extract_invoice_data, name="invoice-extract"),
]
