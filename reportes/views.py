from django.http import FileResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from equipos.models import Equipo
from mantenimientos.models import Mantenimiento
from .pdf_generator import generar_pdf_historial_equipo, generar_pdf_reporte_general


class ReporteHistorialEquipoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, equipo_id):
        equipo = get_object_or_404(Equipo, pk=equipo_id)
        mantenimientos = equipo.mantenimientos.select_related('tecnico_asignado').all()
        buffer = generar_pdf_historial_equipo(equipo, mantenimientos)
        return FileResponse(buffer, as_attachment=True,
                             filename=f'historial_{equipo.codigo_interno}.pdf')


class ReporteGeneralView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Mantenimiento.objects.select_related('equipo', 'tecnico_asignado').all()
        filtros_aplicados = {}
        for campo in ['tipo', 'estado', 'prioridad', 'equipo', 'tecnico_asignado']:
            valor = request.query_params.get(campo)
            if valor:
                qs = qs.filter(**{campo: valor})
                filtros_aplicados[campo] = valor

        buffer = generar_pdf_reporte_general(qs, filtros=filtros_aplicados or None)
        return FileResponse(buffer, as_attachment=True, filename='reporte_general.pdf')
