from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('usuarios.urls')),
    path('api/', include('equipos.urls')),
    path('api/', include('mantenimientos.urls')),
    path('api/', include('reportes.urls')),
]
