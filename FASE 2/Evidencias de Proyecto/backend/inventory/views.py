# Create your views here.
from rest_framework import viewsets, permissions
from .models import Material
from .serializers import MaterialSerializer

class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all().order_by("id")
    serializer_class = MaterialSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # filtro básico por ubicación: /api/materials/?location=...
    def get_queryset(self):
        qs = super().get_queryset()
        loc = self.request.query_params.get("location")
        if loc:
            qs = qs.filter(location__icontains=loc)
        return qs
