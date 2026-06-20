from rest_framework import serializers
from .models import Mantenimiento, Intervencion


class IntervencionSerializer(serializers.ModelSerializer):
    tecnico_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Intervencion
        fields = ['id', 'mantenimiento', 'tecnico', 'tecnico_nombre', 'fecha',
                  'descripcion', 'horas_invertidas']
        read_only_fields = ['id', 'fecha']

    def get_tecnico_nombre(self, obj):
        return obj.tecnico.get_full_name() if obj.tecnico else None


class MantenimientoListSerializer(serializers.ModelSerializer):
    equipo_codigo = serializers.CharField(source='equipo.codigo_interno', read_only=True)
    tecnico_nombre = serializers.SerializerMethodField()
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)

    class Meta:
        model = Mantenimiento
        fields = ['id', 'equipo', 'equipo_codigo', 'tipo', 'tipo_display', 'prioridad',
                  'estado', 'estado_display', 'tecnico_asignado', 'tecnico_nombre',
                  'titulo', 'fecha_programada', 'costo_total']

    def get_tecnico_nombre(self, obj):
        return obj.tecnico_asignado.get_full_name() if obj.tecnico_asignado else 'Sin asignar'


class MantenimientoDetailSerializer(serializers.ModelSerializer):
    equipo_codigo = serializers.CharField(source='equipo.codigo_interno', read_only=True)
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    costo_total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    intervenciones = IntervencionSerializer(many=True, read_only=True)

    class Meta:
        model = Mantenimiento
        fields = ['id', 'equipo', 'equipo_codigo', 'tipo', 'tipo_display', 'prioridad',
                  'estado', 'estado_display', 'tecnico_asignado', 'creado_por', 'titulo',
                  'descripcion', 'diagnostico', 'solucion_aplicada', 'fecha_programada',
                  'fecha_inicio', 'fecha_finalizacion', 'costo_repuestos', 'costo_mano_obra',
                  'costo_total', 'calificacion_resultado', 'intervenciones']
        read_only_fields = ['id', 'creado_por']
