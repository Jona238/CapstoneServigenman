# Create your models here.
from django.db import models

class Material(models.Model):
    # id (Django ya lo agrega automáticamente, pero aquí lo ponemos explícito)
    id = models.AutoField(primary_key=True)

    name = models.CharField(max_length=120)                 # nombre
    category = models.CharField(max_length=80, blank=True)  # categoría (opcional)
    quantity = models.PositiveIntegerField(default=0)       # cantidad ≥ 0
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)  # costo ≥ 0
    entry_date = models.DateField(null=True, blank=True)    # fecha de entrada
    location = models.CharField(max_length=120, blank=True) # ubicación (opcional)

    # nuevos campos
    photo = models.ImageField(upload_to="materials/", null=True, blank=True)  
    info = models.TextField(blank=True)   # comentarios o información adicional

    def __str__(self):
        return f"{self.name} ({self.id})"
