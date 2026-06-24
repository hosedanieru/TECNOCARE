from django.urls import path
from .views import ReporteHistorialEquipoView, ReporteGeneralView

urlpatterns = [
    path('reportes/equipo/<int:equipo_id>/pdf/', ReporteHistorialEquipoView.as_view(), name='reporte-historial-equipo'),
    path('reportes/general/pdf/', ReporteGeneralView.as_view(), name='reporte-general'),
]