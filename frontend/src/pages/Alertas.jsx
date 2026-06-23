import { useEffect, useState } from 'react'
import { equiposService } from '../services/equipos'

export default function Alertas() {
  const [proximos, setProximos] = useState([])
  const [dias, setDias] = useState(7)
  const [cargando, setCargando] = useState(true)

  const cargarAlertas = async () => {
    setCargando(true)
    const res = await equiposService.alertasProximas(dias)
    setProximos(res.data.equipos)
    setCargando(false)
  }

  useEffect(() => {
    cargarAlertas()
  }, [dias])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Alertas de Mantenimiento</h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Próximos</span>
          <select
            value={dias}
            onChange={(e) => setDias(Number(e.target.value))}
            className="border rounded px-3 py-1"
          >
            <option value={7}>7 días</option>
            <option value={15}>15 días</option>
            <option value={30}>30 días</option>
          </select>
        </div>
      </div>

      {cargando ? (
        <p>Cargando alertas...</p>
      ) : proximos.length === 0 ? (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          No hay equipos con mantenimiento próximo a vencer en este rango. 🎉
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proximos.map((eq) => (
            <div key={eq.id} className="bg-white border-l-4 border-yellow-500 rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-gray-800">{eq.codigo_interno}</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  {eq.dias_para_proximo_mantenimiento} días
                </span>
              </div>
              <p className="text-gray-700 mb-1">{eq.nombre}</p>
              <p className="text-sm text-gray-500 mb-1">{eq.ubicacion}</p>
              <p className="text-sm text-gray-500">
                Próximo: <span className="font-medium">{eq.proximo_mantenimiento}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
