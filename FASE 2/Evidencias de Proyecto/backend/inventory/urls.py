from django.urls import path

from . import views


urlpatterns = [
    path("items/", views.items_list_create, name="inventory-items"),
    path("items/<int:item_id>/", views.item_detail_update_delete, name="inventory-item-detail"),
]

