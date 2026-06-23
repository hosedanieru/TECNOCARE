import { useEffect, useState } from 'react'
import { usuariosService } from '../services/usuarios'

const ROLES = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
  { value: 'TECNICO', label: 'Técnico' },
]

const formVacio = {
  username: '', first_name: '', last_name: '',
  email: '', rol: 'TECNICO', telefono: '', cargo: '',
  password: '', password2: '',
}

const rolColor = {
  ADMIN: 'bg-red-100 text-red-800',
  SUPERVISOR: 'bg-blue-100 text-blue-800',
  TECNICO: 'bg-green-100 text-green-800',
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(formVacio)

  const cargarUsuarios = async () => {
    setCargando(true)
    const res = await usuariosService.listar()
    setUsuarios(res.data.results || res.data)
    setCargando(false)
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.password2) {
      setError('Las contraseñas no coinciden.')
      return
    }
    try {
      await usuariosService.crear(form)
      setMostrarForm(false)
      setForm(formVacio)
      cargarUsuarios()
    } catch (err) {
      const data = err.response?.data
      if (data) {
        const msgs = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(' | ')
        setError(msgs)
      } else {
        setError('Error al crear el usuario.')
      }
    }
  }

  const handleDesactivar = async (id, username) => {
    if (!confirm(`¿Desactivar al usuario ${username}?`)) return
    await usuariosService.desactivar(id)
    cargarUsuarios()
  }

  if (cargando) return <p>Cargando usuarios...</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Usuarios y Roles</h1>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo Usuario'}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6 grid grid-cols-2 gap-4">
          <h2 className="col-span-2 font-semibold text-gray-700">Nuevo usuario</h2>

          {error && (
            <div className="col-span-2 bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <input placeholder="Username" required value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="border rounded px-3 py-2" />

          <select value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value })}
            className="border rounded px-3 py-2">
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>

          <input placeholder="Nombre" value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            className="border rounded px-3 py-2" />

          <input placeholder="Apellido" value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            className="border rounded px-3 py-2" />

          <input placeholder="Email" type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded px-3 py-2" />

          <input placeholder="Cargo (ej: Técnico de sistemas)" value={form.cargo}
            onChange={(e) => setForm({ ...form, cargo: e.target.value })}
            className="border rounded px-3 py-2" />

          <input placeholder="Teléfono" value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            className="border rounded px-3 py-2" />

          <div />

          <input placeholder="Contraseña" type="password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border rounded px-3 py-2" />

          <input placeholder="Confirmar contraseña" type="password" required value={form.password2}
            onChange={(e) => setForm({ ...form, password2: e.target.value })}
            className="border rounded px-3 py-2" />

          <button type="submit"
            className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Crear Usuario
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Nombre completo</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Cargo</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3 font-medium">{u.username}</td>
                <td className="px-4 py-3">{u.first_name} {u.last_name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${rolColor[u.rol]}`}>
                    {u.rol_display}
                  </span>
                </td>
                <td className="px-4 py-3">{u.cargo || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${u.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {u.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {u.is_active && (
                    <button onClick={() => handleDesactivar(u.id, u.username)}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">
                      Desactivar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
