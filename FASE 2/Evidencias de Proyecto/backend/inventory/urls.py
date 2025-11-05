from django.urls import path

from . import views


urlpatterns = [
    path("items/", views.items_list_create, name="inventory-items"),
    path("items/<int:item_id>/", views.item_detail_update_delete, name="inventory-item-detail"),
    path("pending/", views.pending_list, name="inventory-pending-list"),
    path("pending/<int:change_id>/approve/", views.pending_approve, name="inventory-pending-approve"),
    path("pending/<int:change_id>/reject/", views.pending_reject, name="inventory-pending-reject"),
    path("pending/count/", views.pending_count, name="inventory-pending-count"),
]

