from __future__ import annotations

import json

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.validators import MinValueValidator


class Item(models.Model):
    recurso = models.CharField(max_length=200)
    categoria = models.CharField(max_length=100)
    cantidad = models.IntegerField(default=0)
    precio = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # Foto puede ser una URL o un data URL (base64). Para simplificar, se guarda como texto.
    foto = models.TextField(blank=True, default="")
    info = models.CharField(max_length=255, blank=True, default="")
    distribuidor = models.CharField(max_length=255, blank=True, default="")
    ubicacion_texto = models.CharField(max_length=255, blank=True, default="")
    ubicacion_foto = models.TextField(blank=True, null=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-id"]

    def __str__(self) -> str:  # pragma: no cover - representational only
        return f"{self.recurso} ({self.categoria})"

    def get_ubicacion_fotos(self) -> list[str]:
        raw = self.ubicacion_foto or ""
        try:
            data = json.loads(raw)
            if isinstance(data, list):
                return [str(x) for x in data]
        except Exception:
            if raw:
                return [str(raw)]
        return []

    def set_ubicacion_fotos(self, fotos: list[str] | None) -> None:
        if not fotos:
            self.ubicacion_foto = ""
        else:
            self.ubicacion_foto = json.dumps(list(fotos))

    def to_dict(self) -> dict:
        ubicacion_fotos = self.get_ubicacion_fotos()
        return {
            "id": self.id,
            "recurso": self.recurso,
            "categoria": self.categoria,
            "cantidad": self.cantidad,
            # Convertir Decimal a float para JSON simple
            "precio": float(self.precio),
            "foto": self.foto or "",
            "info": self.info or "",
            "distribuidor": self.distribuidor or "",
            "ubicacion_texto": self.ubicacion_texto or "",
            "ubicacion_foto": self.ubicacion_foto or "",
            "ubicacion_fotos": ubicacion_fotos,
            "ubicacion_fotos_count": len(ubicacion_fotos),
        }


class PendingChange(models.Model):
    ACTION_DELETE = "delete"
    ACTION_UPDATE = "update"
    ACTION_CREATE = "create"

    ACTIONS = [
        (ACTION_DELETE, "delete"),
        (ACTION_UPDATE, "update"),
        (ACTION_CREATE, "create"),
    ]

    STATUS_PENDING = "pending"
    STATUS_APPROVED = "approved"
    STATUS_REJECTED = "rejected"

    STATUSES = [
        (STATUS_PENDING, "pending"),
        (STATUS_APPROVED, "approved"),
        (STATUS_REJECTED, "rejected"),
    ]

    action = models.CharField(max_length=16, choices=ACTIONS)
    status = models.CharField(max_length=16, choices=STATUSES, default=STATUS_PENDING)

    # Target item and snapshot
    item = models.ForeignKey(Item, null=True, blank=True, on_delete=models.SET_NULL)
    item_id_snapshot = models.IntegerField(null=True, blank=True)
    item_snapshot = models.JSONField(default=dict, blank=True)

    payload = models.JSONField(default=dict, blank=True)

    created_by = models.ForeignKey(get_user_model(), null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(default=timezone.now)
    decided_by = models.ForeignKey(
        get_user_model(), related_name="approved_changes", null=True, blank=True, on_delete=models.SET_NULL
    )
    decided_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "action": self.action,
            "status": self.status,
            "item_id": self.item_id if self.item_id else self.item_id_snapshot,
            "item_snapshot": self.item_snapshot,
            "payload": self.payload,
            "created_by": getattr(self.created_by, "username", None),
            "created_at": self.created_at.isoformat(),
            "decided_by": getattr(self.decided_by, "username", None),
            "decided_at": self.decided_at.isoformat() if self.decided_at else None,
        }


class InventoryMovement(models.Model):
    TYPE_IN = "IN"
    TYPE_OUT = "OUT"
    MOVEMENT_TYPES = [
        (TYPE_IN, "Entrada"),
        (TYPE_OUT, "Salida"),
    ]

    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="movements")
    movement_type = models.CharField(max_length=3, choices=MOVEMENT_TYPES)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    comment = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "-id"]

    def __str__(self) -> str:  # pragma: no cover - representational only
        return f"{self.get_movement_type_display()} {self.quantity} de {self.item_id}"

