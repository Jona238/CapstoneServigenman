from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"movements", views.InventoryMovementViewSet, basename="inventory-movement")

urlpatterns = [
    path("", include(router.urls)),
    path("items/", views.items_list_create, name="inventory-items"),
    path("items/<int:item_id>/", views.item_detail_update_delete, name="inventory-item-detail"),
    path("categories/summary/", views.CategorySummaryAPIView.as_view(), name="inventory-category-summary"),
    path("pending/", views.pending_list, name="inventory-pending-list"),
    path("pending/<int:change_id>/approve/", views.pending_approve, name="inventory-pending-approve"),
    path("pending/<int:change_id>/reject/", views.pending_reject, name="inventory-pending-reject"),
    path("pending/count/", views.pending_count, name="inventory-pending-count"),
]

