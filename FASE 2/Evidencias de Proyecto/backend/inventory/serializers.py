from __future__ import annotations

from django.db import transaction
from rest_framework import serializers

from .models import Item, InventoryMovement


class InventoryMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryMovement
        fields = ["id", "item", "movement_type", "quantity", "comment", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate(self, attrs):
        movement_type = attrs.get("movement_type")
        item = attrs.get("item")
        quantity = attrs.get("quantity") or 0

        if movement_type == InventoryMovement.TYPE_OUT and item and quantity > item.cantidad:
            raise serializers.ValidationError(
                {"quantity": f"No hay stock suficiente. Stock actual: {item.cantidad}"}
            )
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        item: Item = validated_data["item"]
        movement_type = validated_data["movement_type"]
        quantity = validated_data["quantity"]

        if movement_type == InventoryMovement.TYPE_IN:
            item.cantidad = (item.cantidad or 0) + quantity
        else:
            # TYPE_OUT: ya validado el stock en validate
            item.cantidad = (item.cantidad or 0) - quantity
        item.save(update_fields=["cantidad"])

        movement = InventoryMovement.objects.create(**validated_data)
        return movement
