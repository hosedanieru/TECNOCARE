from django.conf import settings
from django.db import models


class CategoriaEquipo(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre


class Equipo(models.Model):
    class Estado(models.TextChoices):
        OPERATIVO = 'OPERATIVO', 'Operativo'
        EN_MANTENIMIENTO = 'EN_MANTENIMIENTO', 'En mantenimiento'
        FUERA_DE_SERVICIO = 'FUERA_DE_SERVICIO', 'Fuera de servicio'
        DADO_DE_BAJA = 'DADO_DE_BAJA', 'Dado de baja'

    codigo_interno = models.CharField(max_length=30, unique=True)
    nombre = models.CharField(max_length=150)
    categoria = models.ForeignKey(CategoriaEquipo, on_delete=models.PROTECT, related_name='equipos')
    marca = models.CharField(max_length=100, blank=True)
    modelo = models.CharField(max_length=100, blank=True)
    numero_serie = models.CharField(max_length=100, blank=True)
    ubicacion = models.CharField(max_length=150)
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.OPERATIVO)
    responsable = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='equipos_a_cargo'
    )
    fecha_adquisicion = models.DateField(null=True, blank=True)
    frecuencia_mantenimiento_dias = models.PositiveIntegerField(default=90)
    fecha_ultimo_mantenimiento = models.DateField(null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    observaciones = models.TextField(blank=True)

    def __str__(self):
        return f'{self.codigo_interno} - {self.nombre}'

    @property
    def proximo_mantenimiento(self):
        from datetime import timedelta
        base = self.fecha_ultimo_mantenimiento or self.fecha_adquisicion
        if not base:
            return None
        return base + timedelta(days=self.frecuencia_mantenimiento_dias)