from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Mantenimiento, Intervencion
from .serializers import MantenimientoListSerializer, MantenimientoDetailSerializer, IntervencionSerializer
from usuarios.permissions import EsSupervisorOAdministrador


class MantenimientoViewSet(viewsets.ModelViewSet):
    queryset = Mantenimiento.objects.select_related('equipo', 'tecnico_asignado', 'creado_por').all()
    filterset_fields = ['tipo', 'estado', 'prioridad', 'equipo', 'tecnico_asignado']
    search_fields = ['titulo', 'descripcion', 'equipo__codigo_interno']

    def get_serializer_class(self):
        if self.action == 'list':
            return MantenimientoListSerializer
        return MantenimientoDetailSerializer

    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [permissions.IsAuthenticated(), EsSupervisorOAdministrador()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

    @action(detail=True, methods=['patch'])
    def iniciar(self, request, pk=None):
        from django.utils import timezone
        mantenimiento = self.get_object()
        mantenimiento.estado = Mantenimiento.Estado.EN_PROCESO
        mantenimiento.fecha_inicio = timezone.now()
        mantenimiento.save()
        return Response(MantenimientoDetailSerializer(mantenimiento).data)

    @action(detail=True, methods=['patch'])
    def finalizar(self, request, pk=None):
        mantenimiento = self.get_object()
        if request.data.get('solucion_aplicada'):
            mantenimiento.solucion_aplicada = request.data['solucion_aplicada']
        if request.data.get('diagnostico'):
            mantenimiento.diagnostico = request.data['diagnostico']
        mantenimiento.finalizar()
        return Response(MantenimientoDetailSerializer(mantenimiento).data)


class IntervencionViewSet(viewsets.ModelViewSet):
    queryset = Intervencion.objects.select_related('tecnico', 'mantenimiento').all()
    serializer_class = IntervencionSerializer
    filterset_fields = ['mantenimiento', 'tecnico']

    def perform_create(self, serializer):
        serializer.save(tecnico=self.request.user)
