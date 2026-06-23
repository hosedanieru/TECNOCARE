import api from './api'

export const equiposService = {
  listar: (params) => api.get('/equipos/', { params }),
  obtener: (id) => api.get(`/equipos/${id}/`),
  crear: (datos) => api.post('/equipos/', datos),
  actualizar: (id, datos) => api.patch(`/equipos/${id}/`, datos),
  eliminar: (id) => api.delete(`/equipos/${id}/`),
  alertasProximas: (dias = 7) => api.get('/equipos/alertas_proximas/', { params: { dias } }),
  categorias: () => api.get('/categorias-equipo/'),
  crearCategoria: (datos) => api.post('/categorias-equipo/', datos),
}
