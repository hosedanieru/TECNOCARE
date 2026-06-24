from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):
    class Rol(models.TextChoices):
        ADMINISTRADOR = 'ADMIN', 'Administrador'
        TECNICO = 'TECNICO', 'Técnico'
        SUPERVISOR = 'SUPERVISOR', 'Supervisor'

    rol = models.CharField(
        max_length=20,
        choices=Rol.choices,
        default=Rol.TECNICO,
    )
    telefono = models.CharField(max_length=20, blank=True, null=True)
    cargo = models.CharField(max_length=100, blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    @property
    def es_administrador(self):
        return self.rol == self.Rol.ADMINISTRADOR

    @property
    def es_tecnico(self):
        return self.rol == self.Rol.TECNICO

    @property
    def es_supervisor(self):
        return self.rol == self.Rol.SUPERVISOR

    def __str__(self):
        return f'{self.get_full_name() or self.username} ({self.get_rol_display()})'
