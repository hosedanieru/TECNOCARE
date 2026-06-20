from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Usuario
from .serializers import UsuarioSerializer, UsuarioCreateSerializer, CustomTokenObtainPairSerializer
from .permissions import EsAdministrador


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    filterset_fields = ['rol', 'is_active']
    search_fields = ['username', 'first_name', 'last_name', 'email']

    def get_serializer_class(self):
        if self.action == 'create':
            return UsuarioCreateSerializer
        return UsuarioSerializer

    def get_permissions(self):
        if self.action in ['create', 'destroy', 'update', 'partial_update']:
            return [permissions.IsAuthenticated(), EsAdministrador()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get'])
    def perfil(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)
