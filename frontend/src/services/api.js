import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Interceptor: agrega el token a cada petición saliente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: si el token expiró (401), intenta refrescarlo automáticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        })
        localStorage.setItem('access_token', data.access)
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('usuario')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default api
