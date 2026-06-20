from datetime import date, timedelta

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Equipo, CategoriaEquipo
from .serializers import EquipoSerializer, CategoriaEquipoSerializer
from usuarios.permissions import SoloLecturaOEsAdministrador


class CategoriaEquipoViewSet(viewsets.ModelViewSet):
    queryset = CategoriaEquipo.objects.all()
    serializer_class = CategoriaEquipoSerializer
    permission_classes = [SoloLecturaOEsAdministrador]


class EquipoViewSet(viewsets.ModelViewSet):
    queryset = Equipo.objects.select_related('categoria', 'responsable').all()
    serializer_class = EquipoSerializer
    permission_classes = [SoloLecturaOEsAdministrador]
    filterset_fields = ['estado', 'categoria', 'responsable']
    search_fields = ['codigo_interno', 'nombre', 'numero_serie']

    @action(detail=False, methods=['get'])
    def alertas_proximas(self, request):
        dias = int(request.query_params.get('dias', 7))
        hoy = date.today()
        limite = hoy + timedelta(days=dias)
        equipos = self.get_queryset()
        proximos = [e for e in equipos if e.proximo_mantenimiento and hoy <= e.proximo_mantenimiento <= limite]
        serializer = self.get_serializer(proximos, many=True)
        return Response({'total': len(proximos), 'equipos': serializer.data})
