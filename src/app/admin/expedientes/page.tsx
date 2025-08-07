'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Syringe,
  Plus,
  Search,
  Calendar,
  Dog,
  FileText,
  AlertCircle,
  Pill,
  Activity,
  DollarSign,
  Filter,
  ChevronRight,
  Clock,
  Building2,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'

interface Perrito {
  id: string
  nombre: string
  codigo: string
  fotoPrincipal: string
}

interface Veterinaria {
  id: string
  nombre: string
  direccion: string
  telefono: string
}

interface ExpedienteMedico {
  id: string
  perritoId: string
  tipo: string
  fecha: string
  descripcion: string
  tratamiento?: string
  medicamentos?: string
  veterinarioId?: string
  veterinariaId?: string
  proximaCita?: string
  observaciones?: string
  costo?: number
  perrito: Perrito
  veterinaria?: Veterinaria
}

export default function ExpedientesPage() {
  const [expedientes, setExpedientes] = useState<ExpedienteMedico[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterPerrito, setFilterPerrito] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perritos, setPerritos] = useState<Perrito[]>([])

  useEffect(() => {
    fetchExpedientes()
    fetchPerritos()
  }, [page, filterTipo, filterPerrito])

  async function fetchExpedientes() {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      })
      
      if (filterTipo) params.append('tipo', filterTipo)
      if (filterPerrito) params.append('perritoId', filterPerrito)

      const response = await fetch(`/api/admin/expedientes?${params}`)
      if (response.ok) {
        const data = await response.json()
        setExpedientes(data.expedientes)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching expedientes:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchPerritos() {
    try {
      const response = await fetch('/api/admin/perritos?limit=100')
      if (response.ok) {
        const data = await response.json()
        setPerritos(data.perritos)
      }
    } catch (error) {
      console.error('Error fetching perritos:', error)
    }
  }

  const tipoExpedienteInfo = {
    consulta: { icon: FileText, color: 'blue', label: 'Consulta General' },
    vacunacion: { icon: Syringe, color: 'green', label: 'Vacunación' },
    desparasitacion: { icon: Pill, color: 'purple', label: 'Desparasitación' },
    esterilizacion: { icon: Activity, color: 'orange', label: 'Esterilización' },
    emergencia: { icon: AlertTriangle, color: 'red', label: 'Emergencia' },
    seguimiento: { icon: Clock, color: 'yellow', label: 'Seguimiento' }
  }

  const filteredExpedientes = expedientes.filter(exp => {
    const matchesSearch = exp.perrito.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Expedientes Médicos</h1>
            <p className="text-slate-600 mt-1">
              Historial médico y control de salud de las mascotas
            </p>
          </div>
          <Link
            href="/admin/expedientes/nuevo"
            className="flex items-center px-4 py-2 bg-atlixco-600 text-white rounded-lg hover:bg-atlixco-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Registro
          </Link>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-atlixco-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-atlixco-500 focus:border-transparent"
          >
            <option value="">Todos los tipos</option>
            <option value="consulta">Consulta General</option>
            <option value="vacunacion">Vacunación</option>
            <option value="desparasitacion">Desparasitación</option>
            <option value="esterilizacion">Esterilización</option>
            <option value="emergencia">Emergencia</option>
            <option value="seguimiento">Seguimiento</option>
          </select>

          <select
            value={filterPerrito}
            onChange={(e) => setFilterPerrito(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-atlixco-500 focus:border-transparent"
          >
            <option value="">Todas las mascotas</option>
            {perritos.map(perrito => (
              <option key={perrito.id} value={perrito.id}>
                {perrito.nombre} ({perrito.codigo})
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setFilterTipo('')
              setFilterPerrito('')
              setSearchTerm('')
            }}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Registros</p>
              <p className="text-2xl font-bold text-slate-900">{expedientes.length}</p>
            </div>
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Vacunaciones</p>
              <p className="text-2xl font-bold text-green-600">
                {expedientes.filter(e => e.tipo === 'vacunacion').length}
              </p>
            </div>
            <Syringe className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Esterilizaciones</p>
              <p className="text-2xl font-bold text-orange-600">
                {expedientes.filter(e => e.tipo === 'esterilizacion').length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Próximas Citas</p>
              <p className="text-2xl font-bold text-purple-600">
                {expedientes.filter(e => e.proximaCita && new Date(e.proximaCita) > new Date()).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Lista de expedientes */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredExpedientes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12">
          <div className="text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No se encontraron expedientes
            </h3>
            <p className="text-slate-600">
              {searchTerm || filterTipo || filterPerrito
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando el primer registro médico'}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-200">
            {filteredExpedientes.map((expediente) => {
              const tipoInfo = tipoExpedienteInfo[expediente.tipo] || tipoExpedienteInfo.consulta
              const IconComponent = tipoInfo.icon
              
              return (
                <div key={expediente.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* Foto del perrito */}
                    <img
                      src={expediente.perrito.fotoPrincipal || '/placeholder-dog.jpg'}
                      alt={expediente.perrito.nombre}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    
                    {/* Información principal */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {expediente.perrito.nombre}
                            </h3>
                            <span className="text-sm text-slate-500">
                              {expediente.perrito.codigo}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${tipoInfo.color}-100 text-${tipoInfo.color}-800`}>
                              <IconComponent className="w-3 h-3 mr-1" />
                              {tipoInfo.label}
                            </span>
                          </div>
                          
                          <p className="text-slate-700 mb-2">{expediente.descripcion}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(expediente.fecha).toLocaleDateString('es-MX')}
                            </span>
                            
                            {expediente.veterinaria && (
                              <span className="flex items-center">
                                <Building2 className="w-4 h-4 mr-1" />
                                {expediente.veterinaria.nombre}
                              </span>
                            )}
                            
                            {expediente.costo && (
                              <span className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                ${expediente.costo.toLocaleString('es-MX')}
                              </span>
                            )}
                            
                            {expediente.proximaCita && (
                              <span className="flex items-center text-purple-600">
                                <Clock className="w-4 h-4 mr-1" />
                                Próxima cita: {new Date(expediente.proximaCita).toLocaleDateString('es-MX')}
                              </span>
                            )}
                          </div>
                          
                          {expediente.tratamiento && (
                            <div className="mt-2 p-3 bg-slate-50 rounded-lg">
                              <p className="text-sm font-medium text-slate-700 mb-1">Tratamiento:</p>
                              <p className="text-sm text-slate-600">{expediente.tratamiento}</p>
                              {expediente.medicamentos && (
                                <p className="text-sm text-slate-600 mt-1">
                                  <span className="font-medium">Medicamentos:</span> {expediente.medicamentos}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <Link
                          href={`/admin/expedientes/${expediente.id}`}
                          className="ml-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <div className="flex items-center px-4 py-2">
              <span className="text-slate-700">
                Página {page} de {totalPages}
              </span>
            </div>
            
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}