'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { FileText, Clock, CheckCircle, XCircle, Eye, Phone, Mail } from 'lucide-react'

interface Solicitud {
  id: string
  codigo: string
  nombre: string
  email: string
  telefono: string
  estado: string
  createdAt: string
  perrito: {
    nombre: string
    fotoPrincipal: string
    raza: string
    slug: string
  }
}

function EstadoSolicitud({ estado }: { estado: string }) {
  const config = {
    nueva: { icon: FileText, color: 'bg-blue-100 text-blue-800', label: 'Nueva' },
    revision: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'En Revisión' },
    entrevista: { icon: Clock, color: 'bg-purple-100 text-purple-800', label: 'Entrevista' },
    prueba: { icon: Clock, color: 'bg-orange-100 text-orange-800', label: 'Período Prueba' },
    aprobada: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Aprobada' },
    rechazada: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Rechazada' }
  }

  const { icon: Icon, color, label } = config[estado as keyof typeof config] || config.nueva

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </span>
  )
}

function SolicitudCard({ solicitud }: { solicitud: Solicitud }) {
  const fechaCreacion = new Date(solicitud.createdAt)
  const diasPendiente = Math.floor((Date.now() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={solicitud.perrito.fotoPrincipal}
            alt={solicitud.perrito.nombre}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-slate-900">{solicitud.nombre}</h3>
            <p className="text-sm text-slate-600">
              Quiere adoptar a <strong>{solicitud.perrito.nombre}</strong>
            </p>
          </div>
        </div>
        <EstadoSolicitud estado={solicitud.estado} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-slate-600">
        <div className="flex items-center">
          <Mail className="w-4 h-4 mr-2" />
          {solicitud.email}
        </div>
        <div className="flex items-center">
          <Phone className="w-4 h-4 mr-2" />
          {solicitud.telefono}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          <div>Código: <strong>{solicitud.codigo}</strong></div>
          <div>
            Hace {diasPendiente} día{diasPendiente !== 1 ? 's' : ''}
            {diasPendiente > 2 && (
              <span className="text-red-600 ml-2">⚠️ Requiere atención</span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="flex items-center px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50">
            <Eye className="w-4 h-4 mr-1" />
            Ver
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminSolicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [loading, setLoading] = useState(true)
  const [estadoFilter, setEstadoFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [diasFilter, setDiasFilter] = useState('')

  useEffect(() => {
    fetchSolicitudes()
  }, [])

  async function fetchSolicitudes() {
    try {
      const response = await fetch('/api/admin/solicitudes')
      if (response.ok) {
        const data = await response.json()
        setSolicitudes(data.solicitudes || [])
      }
    } catch (error) {
      console.error('Error fetching solicitudes:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar solicitudes
  const filteredSolicitudes = solicitudes.filter(solicitud => {
    const matchesSearch = solicitud.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solicitud.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = !estadoFilter || solicitud.estado === estadoFilter
    
    let matchesDias = true
    if (diasFilter) {
      const diasDesdeCreacion = Math.floor((Date.now() - new Date(solicitud.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      matchesDias = diasDesdeCreacion <= parseInt(diasFilter)
    }
    
    return matchesSearch && matchesEstado && matchesDias
  })

  const stats = {
    total: solicitudes.length,
    nuevas: solicitudes.filter(s => s.estado === 'nueva').length,
    revision: solicitudes.filter(s => s.estado === 'revision').length,
    pendientes: solicitudes.filter(s => ['nueva', 'revision'].includes(s.estado)).length,
    aprobadas: solicitudes.filter(s => s.estado === 'aprobada').length
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Gestión de Solicitudes</h1>
        <p className="text-slate-600 mt-1">
          Administra las solicitudes de adopción recibidas
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
          <div className="text-sm text-slate-600">Total</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.nuevas}</div>
          <div className="text-sm text-slate-600">Nuevas</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.revision}</div>
          <div className="text-sm text-slate-600">En Revisión</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.pendientes}</div>
          <div className="text-sm text-slate-600">Pendientes</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.aprobadas}</div>
          <div className="text-sm text-slate-600">Aprobadas</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex items-center space-x-4">
          <select 
            className="input min-w-[150px]"
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="nueva">Nuevas</option>
            <option value="revision">En Revisión</option>
            <option value="entrevista">Entrevista</option>
            <option value="prueba">Período Prueba</option>
            <option value="aprobada">Aprobadas</option>
            <option value="rechazada">Rechazadas</option>
          </select>
          
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            className="input flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select 
            className="input min-w-[120px]"
            value={diasFilter}
            onChange={(e) => setDiasFilter(e.target.value)}
          >
            <option value="">Todos los días</option>
            <option value="1">Hoy</option>
            <option value="7">Última semana</option>
            <option value="30">Último mes</option>
          </select>
        </div>
      </div>

      {/* Solicitudes */}
      {filteredSolicitudes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSolicitudes.map((solicitud) => (
              <SolicitudCard key={solicitud.id} solicitud={solicitud} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <FileText className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {solicitudes.length === 0 ? 'No hay solicitudes' : 'No se encontraron solicitudes'}
          </h3>
          <p className="text-slate-600">
            {solicitudes.length === 0 ? 'Las solicitudes de adopción aparecerán aquí cuando lleguen' : 'Intenta con otros filtros'}
          </p>
        </div>
      )}

      {/* Alerta de solicitudes pendientes */}
      {stats.pendientes > 0 && (
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-800">
              <strong>{stats.pendientes} solicitudes</strong> requieren tu atención urgente.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}