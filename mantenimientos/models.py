from django.conf import settings
from django.db import models

from equipos.models import Equipo


class Mantenimiento(models.Model):
    class Tipo(models.TextChoices):
        PREVENTIVO = 'PREVENTIVO', 'Preventivo'
        CORRECTIVO = 'CORRECTIVO', 'Correctivo'
        PREDICTIVO = 'PREDICTIVO', 'Predictivo'

    class Estado(models.TextChoices):
        PROGRAMADO = 'PROGRAMADO', 'Programado'
        EN_PROCESO = 'EN_PROCESO', 'En proceso'
        FINALIZADO = 'FINALIZADO', 'Finalizado'
        CANCELADO = 'CANCELADO', 'Cancelado'

    class Prioridad(models.TextChoices):
        BAJA = 'BAJA', 'Baja'
        MEDIA = 'MEDIA', 'Media'
        ALTA = 'ALTA', 'Alta'
        CRITICA = 'CRITICA', 'Crítica'

    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE, related_name='mantenimientos')
    tipo = models.CharField(max_length=20, choices=Tipo.choices)
    prioridad = models.CharField(max_length=10, choices=Prioridad.choices, default=Prioridad.MEDIA)
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.PROGRAMADO)
    tecnico_asignado = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='mantenimientos_asignados'
    )
    creado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='mantenimientos_creados'
    )
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    diagnostico = models.TextField(blank=True)
    solucion_aplicada = models.TextField(blank=True)
    fecha_programada = models.DateField()
    fecha_inicio = models.DateTimeField(null=True, blank=True)
    fecha_finalizacion = models.DateTimeField(null=True, blank=True)
    costo_repuestos = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    costo_mano_obra = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    calificacion_resultado = models.PositiveSmallIntegerField(null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-fecha_programada']

    def __str__(self):
        return f'[{self.get_tipo_display()}] {self.titulo} - {self.equipo.codigo_interno}'

    @property
    def costo_total(self):
        return self.costo_repuestos + self.costo_mano_obra

    def finalizar(self):
        from django.utils import timezone
        self.estado = self.Estado.FINALIZADO
        self.fecha_finalizacion = timezone.now()
        self.save()
        if self.tipo == self.Tipo.PREVENTIVO:
            self.equipo.fecha_ultimo_mantenimiento = timezone.now().date()
            self.equipo.estado = Equipo.Estado.OPERATIVO
            self.equipo.save()


class Intervencion(models.Model):
    mantenimiento = models.ForeignKey(Mantenimiento, on_delete=models.CASCADE, related_name='intervenciones')
    tecnico = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    fecha = models.DateTimeField(auto_now_add=True)
    descripcion = models.TextField()
    horas_invertidas = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    class Meta:
        ordering = ['-fecha']

    def __str__(self):
        return f'Intervención de {self.tecnico} en {self.mantenimiento} ({self.fecha:%Y-%m-%d})'
