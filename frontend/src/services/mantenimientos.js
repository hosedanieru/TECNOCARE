import api from './api'

export const mantenimientosService = {
  listar: (params) => api.get('/mantenimientos/', { params }),
  obtener: (id) => api.get(`/mantenimientos/${id}/`),
  crear: (datos) => api.post('/mantenimientos/', datos),
  iniciar: (id) => api.patch(`/mantenimientos/${id}/iniciar/`),
  finalizar: (id, datos) => api.patch(`/mantenimientos/${id}/finalizar/`, datos),
  calificar: (id, calificacion) =>
    api.patch(`/mantenimientos/${id}/calificar/`, { calificacion_resultado: calificacion }),
  sugerenciaIA: (datos) => api.post('/mantenimientos-sugerencia-ia/', datos),
}
