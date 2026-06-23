import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RutaProtegida from './components/RutaProtegida'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Equipos from './pages/Equipos'
import Mantenimientos from './pages/Mantenimientos'
import Alertas from './pages/Alertas'
import Reportes from './pages/Reportes'
import Usuarios from './pages/Usuarios'

function Dashboard() {
  return <h1 className="text-2xl font-bold text-gray-800">Bienvenido a TecnoCare</h1>
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <RutaProtegida>
                <MainLayout />
              </RutaProtegida>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/equipos" element={<Equipos />} />
            <Route path="/mantenimientos" element={<Mantenimientos />} />
            <Route path="/alertas" element={<Alertas />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/usuarios" element={
              <RutaProtegida rolesPermitidos={['ADMIN']}>
                <Usuarios />
              </RutaProtegida>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
