from rest_framework import serializers
from .models import Equipo, CategoriaEquipo


class CategoriaEquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaEquipo
        fields = ['id', 'nombre', 'descripcion']


class EquipoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    proximo_mantenimiento = serializers.DateField(read_only=True)

    class Meta:
        model = Equipo
        fields = ['id', 'codigo_interno', 'nombre', 'categoria', 'categoria_nombre',
                  'marca', 'modelo', 'numero_serie', 'ubicacion', 'estado', 'estado_display',
                  'responsable', 'fecha_adquisicion', 'frecuencia_mantenimiento_dias',
                  'fecha_ultimo_mantenimiento', 'proximo_mantenimiento', 'observaciones']
        read_only_fields = ['id']
