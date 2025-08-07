'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  FileText,
  Search,
  Filter,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Users,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  ChevronRight,
  Dog,
  MessageSquare,
  Star,
  Heart
} from 'lucide-react'
import styles from '../dashboard.module.css'

interface Perrito {
  nombre: string
  fotoPrincipal: string
  raza: string
  slug: string
}

interface Solicitud {
  id: string
  codigo: string
  nombre: string
  email: string
  telefono: string
  direccion: string
  tipoVivienda: string
  experiencia: string
  otrosMascotas: string
  motivoAdopcion: string
  compromisos: string
  estado: string
  perritoId: string
  perrito: Perrito
  createdAt: string
  fechaRevision?: string
  fechaEntrevista?: string
  fechaAdopcion?: string
  notas?: string
}

const estadoColores = {
  nueva: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Nueva' },
  revision: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En Revisión' },
  entrevista: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Entrevista' },
  prueba: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Prueba' },
  aprobada: { bg: 'bg-green-100', text: 'text-green-700', label: 'Aprobada' },
  rechazada: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rechazada' },
  cancelada: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Cancelada' }
}

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterDias, setFilterDias] = useState('')
  const [showDetalle, setShowDetalle] = useState<string | null>(null)

  useEffect(() => {
    fetchSolicitudes()
  }, [filterEstado, filterDias])

  async function fetchSolicitudes() {
    try {
      const params = new URLSearchParams()
      if (filterEstado) params.append('estado', filterEstado)
      if (filterDias) params.append('dias', filterDias)

      const response = await fetch(`/api/admin/solicitudes?${params}`)
      if (response.ok) {
        const data = await response.json()
        setSolicitudes(data.solicitudes)
      }
    } catch (error) {
      console.error('Error fetching solicitudes:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSolicitudes = solicitudes.filter(solicitud => {
    const matchesSearch = 
      solicitud.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.perrito?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const diffInMs = now.getTime() - then.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Hoy'
    if (diffInDays === 1) return 'Ayer'
    if (diffInDays < 7) return `Hace ${diffInDays} días`
    if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`
    return `Hace ${Math.floor(diffInDays / 30)} meses`
  }

  const solicitudesPorEstado = {
    nueva: solicitudes.filter(s => s.estado === 'nueva').length,
    revision: solicitudes.filter(s => s.estado === 'revision').length,
    entrevista: solicitudes.filter(s => s.estado === 'entrevista').length,
    prueba: solicitudes.filter(s => s.estado === 'prueba').length,
    aprobada: solicitudes.filter(s => s.estado === 'aprobada').length,
    rechazada: solicitudes.filter(s => s.estado === 'rechazada').length
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Solicitudes de Adopción</h1>
            <p className="text-slate-600 mt-1">
              Gestiona las solicitudes de adopción de las mascotas
            </p>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Nuevas</p>
              <p className="text-2xl font-bold text-blue-700">{solicitudesPorEstado.nueva}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">En Revisión</p>
              <p className="text-2xl font-bold text-yellow-700">{solicitudesPorEstado.revision}</p>
            </div>
            <Eye className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Entrevista</p>
              <p className="text-2xl font-bold text-purple-700">{solicitudesPorEstado.entrevista}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Prueba</p>
              <p className="text-2xl font-bold text-orange-700">{solicitudesPorEstado.prueba}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Aprobadas</p>
              <p className="text-2xl font-bold text-green-700">{solicitudesPorEstado.aprobada}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Rechazadas</p>
              <p className="text-2xl font-bold text-red-700">{solicitudesPorEstado.rechazada}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o mascota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-atlixco-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-atlixco-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="nueva">Nueva</option>
            <option value="revision">En Revisión</option>
            <option value="entrevista">Entrevista</option>
            <option value="prueba">Prueba</option>
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
            <option value="cancelada">Cancelada</option>
          </select>

          <select
            value={filterDias}
            onChange={(e) => setFilterDias(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-atlixco-500 focus:border-transparent"
          >
            <option value="">Todas las fechas</option>
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
          </select>

          <button
            onClick={() => {
              setFilterEstado('')
              setFilterDias('')
              setSearchTerm('')
            }}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Lista de solicitudes */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b border-slate-200 pb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredSolicitudes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12">
          <div className="text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No se encontraron solicitudes
            </h3>
            <p className="text-slate-600">
              {searchTerm || filterEstado || filterDias
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Aún no hay solicitudes de adopción'}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-200">
            {filteredSolicitudes.map((solicitud) => {
              const estado = estadoColores[solicitud.estado as keyof typeof estadoColores] || estadoColores.nueva
              const isExpanded = showDetalle === solicitud.id
              
              return (
                <div key={solicitud.id} className="hover:bg-slate-50 transition-colors">
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => setShowDetalle(isExpanded ? null : solicitud.id)}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Foto del perrito */}
                      <img
                        src={solicitud.perrito?.fotoPrincipal || '/placeholder-dog.jpg'}
                        alt={solicitud.perrito?.nombre}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      
                      {/* Información principal */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="text-lg font-semibold text-slate-900">
                                {solicitud.nombre}
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estado.bg} ${estado.text}`}>
                                {estado.label}
                              </span>
                            </div>
                            
                            <p className="text-sm text-slate-600 mb-2">
                              Solicita adoptar a <span className="font-semibold">{solicitud.perrito?.nombre}</span> - {solicitud.perrito?.raza}
                            </p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                              <span className="flex items-center">
                                <Mail className="w-4 h-4 mr-1" />
                                {solicitud.email}
                              </span>
                              <span className="flex items-center">
                                <Phone className="w-4 h-4 mr-1" />
                                {solicitud.telefono}
                              </span>
                              <span className="flex items-center">
                                <Home className="w-4 h-4 mr-1" />
                                {solicitud.tipoVivienda}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {getTimeAgo(solicitud.createdAt)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/admin/solicitudes/${solicitud.id}`}
                              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Eye className="w-5 h-5" />
                            </Link>
                            <ChevronRight className={`w-5 h-5 text-slate-400 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Detalles expandibles */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-slate-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Información del Solicitante</h4>
                          <div className="space-y-2 text-sm">
                            <p><span className="text-slate-600">Dirección:</span> <span className="text-slate-900">{solicitud.direccion}</span></p>
                            <p><span className="text-slate-600">Experiencia:</span> <span className="text-slate-900">{solicitud.experiencia}</span></p>
                            <p><span className="text-slate-600">Otras mascotas:</span> <span className="text-slate-900">{solicitud.otrosMascotas}</span></p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Motivación y Compromisos</h4>
                          <div className="space-y-2 text-sm">
                            <p className="text-slate-700">
                              <span className="text-slate-600">Motivo:</span> {solicitud.motivoAdopcion}
                            </p>
                            <p className="text-slate-700">
                              <span className="text-slate-600">Compromisos:</span> {solicitud.compromisos}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {solicitud.notas && (
                        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Notas:</span> {solicitud.notas}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex justify-end space-x-3 mt-4">
                        <Link
                          href={`/admin/solicitudes/${solicitud.id}`}
                          className="px-4 py-2 bg-atlixco-600 text-white rounded-lg hover:bg-atlixco-700 transition-colors text-sm font-medium"
                        >
                          Gestionar Solicitud
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}