from __future__ import annotations

from django.db import models


class Item(models.Model):
    recurso = models.CharField(max_length=200)
    categoria = models.CharField(max_length=100)
    cantidad = models.IntegerField(default=0)
    precio = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # Foto puede ser una URL o un data URL (base64). Para simplificar, se guarda como texto.
    foto = models.TextField(blank=True, default="")
    info = models.CharField(max_length=255, blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-id"]

    def __str__(self) -> str:  # pragma: no cover - representational only
        return f"{self.recurso} ({self.categoria})"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "recurso": self.recurso,
            "categoria": self.categoria,
            "cantidad": self.cantidad,
            # Convertir Decimal a float para JSON simple
            "precio": float(self.precio),
            "foto": self.foto or "",
            "info": self.info or "",
        }

