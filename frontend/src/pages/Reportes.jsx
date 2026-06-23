import { useEffect, useState } from 'react'
import { equiposService } from '../services/equipos'
import api from '../services/api'

export default function Reportes() {
  const [equipos, setEquipos] = useState([])
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('')
  const [descargando, setDescargando] = useState(null)

  const [filtros, setFiltros] = useState({
    tipo: '', estado: '', fecha_desde: '', fecha_hasta: '',
  })

  useEffect(() => {
    equiposService.listar().then((res) => {
      setEquipos(res.data.results || res.data)
    })
  }, [])

  const descargarPDF = async (url, nombreArchivo) => {
    setDescargando(nombreArchivo)
    try {
      const res = await api.get(url, { responseType: 'blob' })
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = nombreArchivo
      link.click()
      URL.revokeObjectURL(link.href)
    } catch (err) {
      alert('Error al generar el reporte. Intenta de nuevo.')
    } finally {
      setDescargando(null)
    }
  }

  const descargarHistorialEquipo = () => {
    if (!equipoSeleccionado) return alert('Selecciona un equipo primero.')
    descargarPDF(
      `/reportes/equipo/${equipoSeleccionado}/pdf/`,
      `historial_equipo_${equipoSeleccionado}.pdf`
    )
  }

  const descargarReporteGeneral = () => {
    const params = new URLSearchParams()
    if (filtros.tipo) params.append('tipo', filtros.tipo)
    if (filtros.estado) params.append('estado', filtros.estado)
    if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde)
    if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta)
    const query = params.toString()
    descargarPDF(
      `/reportes/general/pdf/${query ? '?' + query : ''}`,
      'reporte_general_mantenimientos.pdf'
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reportes PDF</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Reporte por equipo */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Historial por Equipo</h2>
          <p className="text-sm text-gray-500 mb-4">
            Genera un PDF con la ficha del equipo y todo su historial de mantenimientos.
          </p>
          <select
            value={equipoSeleccionado}
            onChange={(e) => setEquipoSeleccionado(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
          >
            <option value="">Selecciona un equipo</option>
            {equipos.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.codigo_interno} — {eq.nombre}
              </option>
            ))}
          </select>
          <button
            onClick={descargarHistorialEquipo}
            disabled={descargando === `historial_equipo_${equipoSeleccionado}.pdf`}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {descargando ? 'Generando PDF...' : '⬇ Descargar PDF'}
          </button>
        </div>

        {/* Reporte general */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Reporte General</h2>
          <p className="text-sm text-gray-500 mb-4">
            Genera un PDF con todos los mantenimientos, aplicando filtros opcionales.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <select value={filtros.tipo}
              onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
              className="border rounded px-3 py-2 text-sm">
              <option value="">Todos los tipos</option>
              <option value="PREVENTIVO">Preventivo</option>
              <option value="CORRECTIVO">Correctivo</option>
              <option value="PREDICTIVO">Predictivo</option>
            </select>

            <select value={filtros.estado}
              onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
              className="border rounded px-3 py-2 text-sm">
              <option value="">Todos los estados</option>
              <option value="PROGRAMADO">Programado</option>
              <option value="EN_PROCESO">En proceso</option>
              <option value="FINALIZADO">Finalizado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>

            <label className="text-xs text-gray-500 flex flex-col gap-1">
              Desde
              <input type="date" value={filtros.fecha_desde}
                onChange={(e) => setFiltros({ ...filtros, fecha_desde: e.target.value })}
                className="border rounded px-3 py-2" />
            </label>

            <label className="text-xs text-gray-500 flex flex-col gap-1">
              Hasta
              <input type="date" value={filtros.fecha_hasta}
                onChange={(e) => setFiltros({ ...filtros, fecha_hasta: e.target.value })}
                className="border rounded px-3 py-2" />
            </label>
          </div>

          <button
            onClick={descargarReporteGeneral}
            disabled={!!descargando}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {descargando ? 'Generando PDF...' : '⬇ Descargar Reporte General'}
          </button>
        </div>
      </div>
    </div>
  )
}
