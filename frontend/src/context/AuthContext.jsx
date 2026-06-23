import { createContext, useContext, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario')
    return guardado ? JSON.parse(guardado) : null
  })

  const login = async (username, password) => {
    const { data } = await api.post('/auth/login/', { username, password })
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    localStorage.setItem('usuario', JSON.stringify(data.usuario))
    setUsuario(data.usuario)
    return data.usuario
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  const value = {
    usuario,
    login,
    logout,
    isAuthenticated: !!usuario,
    esAdministrador: usuario?.rol === 'ADMIN',
    esSupervisor: usuario?.rol === 'SUPERVISOR',
    esTecnico: usuario?.rol === 'TECNICO',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
