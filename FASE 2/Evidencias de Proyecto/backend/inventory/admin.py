from django.contrib import admin

from .models import Item


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("id", "recurso", "categoria", "cantidad", "precio")
    list_filter = ("categoria",)
    search_fields = ("recurso", "categoria", "info")

