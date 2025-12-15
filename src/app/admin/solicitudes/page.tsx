'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  Heart,
  Download,
  TrendingUp,
  TrendingDown,
  Activity,
  ChevronDown,
  MoreVertical,
  Trash2,
  Edit,
  Shield
} from 'lucide-react'

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
  nueva: { 
    bg: '#3b82f6', 
    bgLight: '#dbeafe', 
    text: '#1e40af', 
    label: 'Nueva',
    icon: FileText 
  },
  revision: { 
    bg: '#f59e0b', 
    bgLight: '#fef3c7', 
    text: '#92400e', 
    label: 'En Revisión',
    icon: Eye 
  },
  entrevista: { 
    bg: '#8b5cf6', 
    bgLight: '#e9d5ff', 
    text: '#5b21b6', 
    label: 'Entrevista',
    icon: MessageSquare 
  },
  prueba: { 
    bg: '#f97316', 
    bgLight: '#fed7aa', 
    text: '#9a3412', 
    label: 'Prueba',
    icon: Clock 
  },
  aprobada: { 
    bg: '#10b981', 
    bgLight: '#d1fae5', 
    text: '#065f46', 
    label: 'Aprobada',
    icon: CheckCircle 
  },
  rechazada: { 
    bg: '#ef4444', 
    bgLight: '#fee2e2', 
    text: '#991b1b', 
    label: 'Rechazada',
    icon: XCircle 
  },
  cancelada: { 
    bg: '#6b7280', 
    bgLight: '#f3f4f6', 
    text: '#374151', 
    label: 'Cancelada',
    icon: AlertCircle 
  }
}

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'general' | 'codigo'>('general')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterDias, setFilterDias] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [sortBy, setSortBy] = useState('fecha_desc')
  const [selectedSolicitudes, setSelectedSolicitudes] = useState<string[]>([])
  const [showActions, setShowActions] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchSolicitudes()
  }, [filterEstado, filterDias, fechaInicio, fechaFin, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, searchType, filterEstado, filterDias, fechaInicio, fechaFin])

  const fetchSolicitudes = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filterEstado) params.append('estado', filterEstado)
      if (filterDias) params.append('dias', filterDias)
      if (fechaInicio) params.append('fechaInicio', fechaInicio)
      if (fechaFin) params.append('fechaFin', fechaFin)
      params.append('page', currentPage.toString())
      params.append('limit', itemsPerPage.toString())

      const response = await fetch(`/api/admin/solicitudes?${params}`)
      if (response.ok) {
        const data = await response.json()
        setSolicitudes(data.solicitudes)
        setTotalItems(data.total || data.solicitudes.length)
      }
    } catch (error) {
      console.error('Error fetching solicitudes:', error)
    } finally {
      setLoading(false)
    }
  }, [filterEstado, filterDias, fechaInicio, fechaFin, currentPage, itemsPerPage])

  const filteredSolicitudes = useMemo(() => {
    return solicitudes.filter(solicitud => {
      if (!debouncedSearchTerm) return true
      
      const searchLower = debouncedSearchTerm.toLowerCase()
      
      if (searchType === 'codigo') {
        return solicitud.codigo.toLowerCase().includes(searchLower)
      } else {
        return (
          solicitud.nombre.toLowerCase().includes(searchLower) ||
          solicitud.codigo.toLowerCase().includes(searchLower) ||
          solicitud.email.toLowerCase().includes(searchLower) ||
          solicitud.perrito?.nombre.toLowerCase().includes(searchLower)
        )
      }
    })
  }, [solicitudes, debouncedSearchTerm, searchType])

  // Ordenar solicitudes
  const sortedSolicitudes = useMemo(() => {
    return [...filteredSolicitudes].sort((a, b) => {
      switch (sortBy) {
        case 'fecha_desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'fecha_asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'nombre_asc':
          return a.nombre.localeCompare(b.nombre)
        case 'nombre_desc':
          return b.nombre.localeCompare(a.nombre)
        default:
          return 0
      }
    })
  }, [filteredSolicitudes, sortBy])

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

  const handleSelectAll = () => {
    if (selectedSolicitudes.length === sortedSolicitudes.length) {
      setSelectedSolicitudes([])
    } else {
      setSelectedSolicitudes(sortedSolicitudes.map(s => s.id))
    }
  }

  const handleSelect = (id: string) => {
    if (selectedSolicitudes.includes(id)) {
      setSelectedSolicitudes(selectedSolicitudes.filter(s => s !== id))
    } else {
      setSelectedSolicitudes([...selectedSolicitudes, id])
    }
  }

  // Cálculos de paginación
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#0f172a',
              margin: '0 0 8px 0',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Solicitudes de Adopción
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>
              Gestiona y da seguimiento a las solicitudes de adopción
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              href="/admin/solicitudes/estadisticas"
              style={{
                padding: '10px 20px',
                backgroundColor: 'white',
                color: '#7d2447',
                border: '1px solid #7d2447',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fef2f2'
                e.currentTarget.style.borderColor = '#8b1227'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.borderColor = '#7d2447'
              }}
            >
              <Activity style={{ width: '16px', height: '16px' }} />
              Ver Estadísticas
            </Link>
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/admin/solicitudes/exportar?formato=csv')
                  if (response.ok) {
                    const blob = await response.blob()
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `solicitudes_adopcion_${new Date().toISOString().split('T')[0]}.csv`
                    document.body.appendChild(a)
                    a.click()
                    window.URL.revokeObjectURL(url)
                    document.body.removeChild(a)
                  }
                } catch (error) {
                  console.error('Error al exportar:', error)
                }
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#7d2447',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a1a33'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7d2447'}
            >
              <Download style={{ width: '16px', height: '16px' }} />
              Exportar Reporte
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        {Object.entries(solicitudesPorEstado).map(([estado, count]) => {
          const config = estadoColores[estado as keyof typeof estadoColores]
          const Icon = config.icon
          return (
            <div
              key={estado}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
                cursor: filterEstado === estado ? 'default' : 'pointer',
                transition: 'all 0.2s',
                transform: filterEstado === estado ? 'scale(0.98)' : 'scale(1)'
              }}
              onClick={() => setFilterEstado(filterEstado === estado ? '' : estado)}
              onMouseEnter={(e) => {
                if (filterEstado !== estado) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (filterEstado !== estado) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: config.text,
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    {config.label}
                  </p>
                  <p style={{ 
                    fontSize: '2rem', 
                    fontWeight: '700', 
                    color: '#0f172a',
                    margin: 0
                  }}>
                    {count}
                  </p>
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: config.bgLight,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon style={{ width: '24px', height: '24px', color: config.bg }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filtros y búsqueda */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        {/* Primera fila de filtros */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px',
          alignItems: 'center',
          marginBottom: showAdvancedFilters ? '20px' : 0
        }}>
          <div style={{ position: 'relative', display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                color: '#94a3b8'
              }} />
              <input
                type="text"
                placeholder={searchType === 'codigo' ? 'Buscar por código...' : 'Buscar por nombre, email o mascota...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 44px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#7d2447'
                  e.target.style.boxShadow = '0 0 0 3px rgba(175, 23, 49, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value as 'general' | 'codigo')
                setSearchTerm('')
              }}
              style={{
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.875rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none',
                minWidth: '120px'
              }}
            >
              <option value="general">General</option>
              <option value="codigo">Por Código</option>
            </select>
          </div>

          <select
            value={filterDias}
            onChange={(e) => setFilterDias(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="">Todas las fechas</option>
            <option value="1">Hoy</option>
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="fecha_desc">Más recientes</option>
            <option value="fecha_asc">Más antiguas</option>
            <option value="nombre_asc">Nombre A-Z</option>
            <option value="nombre_desc">Nombre Z-A</option>
          </select>

          <button
            onClick={() => {
              setFilterEstado('')
              setFilterDias('')
              setFechaInicio('')
              setFechaFin('')
              setSearchTerm('')
              setSearchType('general')
              setSortBy('fecha_desc')
              setCurrentPage(1)
            }}
            style={{
              padding: '10px 20px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc'
              e.currentTarget.style.borderColor = '#cbd5e1'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white'
              e.currentTarget.style.borderColor = '#e2e8f0'
            }}
          >
            Limpiar filtros
          </button>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            style={{
              padding: '10px 20px',
              border: `1px solid ${showAdvancedFilters ? '#7d2447' : '#e2e8f0'}`,
              backgroundColor: showAdvancedFilters ? '#fef2f2' : 'white',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: showAdvancedFilters ? '#7d2447' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!showAdvancedFilters) {
                e.currentTarget.style.backgroundColor = '#f8fafc'
                e.currentTarget.style.borderColor = '#cbd5e1'
              }
            }}
            onMouseLeave={(e) => {
              if (!showAdvancedFilters) {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.borderColor = '#e2e8f0'
              }
            }}
          >
            <Filter style={{ width: '16px', height: '16px' }} />
            Filtros Avanzados
          </button>
        </div>

        {/* Segunda fila - Filtros avanzados */}
        {showAdvancedFilters && (
          <div style={{
            paddingTop: '20px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px',
              alignItems: 'center'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.75rem', 
                  fontWeight: '600', 
                  color: '#64748b',
                  marginBottom: '6px'
                }}>
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#7d2447'
                    e.target.style.boxShadow = '0 0 0 3px rgba(175, 23, 49, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.75rem', 
                  fontWeight: '600', 
                  color: '#64748b',
                  marginBottom: '6px'
                }}>
                  Fecha de fin
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#7d2447'
                    e.target.style.boxShadow = '0 0 0 3px rgba(175, 23, 49, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.75rem', 
                  fontWeight: '600', 
                  color: '#64748b',
                  marginBottom: '6px'
                }}>
                  Estado específico
                </label>
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="">Todos los estados</option>
                  {Object.entries(estadoColores).map(([estado, config]) => (
                    <option key={estado} value={estado}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'end' }}>
                <button
                  onClick={() => {
                    if (fechaInicio && fechaFin) {
                      setFechaInicio('')
                      setFechaFin('')
                      setFilterDias('')
                    } else {
                      const today = new Date()
                      const lastWeek = new Date(today)
                      lastWeek.setDate(today.getDate() - 7)
                      setFechaInicio(lastWeek.toISOString().split('T')[0])
                      setFechaFin(today.toISOString().split('T')[0])
                      setFilterDias('')
                    }
                  }}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#f8fafc',
                    color: '#475569',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e2e8f0'
                    e.currentTarget.style.borderColor = '#cbd5e1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc'
                    e.currentTarget.style.borderColor = '#e2e8f0'
                  }}
                >
                  {fechaInicio && fechaFin ? 'Limpiar fechas' : 'Última semana'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabla de solicitudes */}
      {loading ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '48px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #7d2447',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#64748b' }}>Cargando solicitudes...</p>
        </div>
      ) : sortedSolicitudes.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '64px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <FileText style={{ 
            width: '48px', 
            height: '48px', 
            color: '#cbd5e1',
            margin: '0 auto 16px'
          }} />
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            No se encontraron solicitudes
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            {searchTerm || filterEstado || filterDias
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Aún no hay solicitudes de adopción'}
          </p>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          {/* Header de tabla */}
          <div style={{
            padding: '16px 24px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="checkbox"
                checked={selectedSolicitudes.length === sortedSolicitudes.length && sortedSolicitudes.length > 0}
                onChange={handleSelectAll}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span style={{ 
                fontSize: '0.875rem', 
                color: '#64748b',
                fontWeight: '500'
              }}>
                {selectedSolicitudes.length > 0 
                  ? `${selectedSolicitudes.length} seleccionadas`
                  : `${sortedSolicitudes.length} solicitudes`}
              </span>
            </div>
            {selectedSolicitudes.length > 0 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 style={{ width: '14px', height: '14px' }} />
                  Eliminar
                </button>
              </div>
            )}
          </div>

          {/* Lista de solicitudes */}
          <div>
            {sortedSolicitudes.map((solicitud, index) => {
              const estado = estadoColores[solicitud.estado as keyof typeof estadoColores] || estadoColores.nueva
              const isSelected = selectedSolicitudes.includes(solicitud.id)
              
              return (
                <div 
                  key={solicitud.id}
                  style={{
                    padding: '20px 24px',
                    borderBottom: index < sortedSolicitudes.length - 1 ? '1px solid #e2e8f0' : 'none',
                    transition: 'all 0.2s',
                    backgroundColor: isSelected ? '#f8fafc' : 'white'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#fafbfc'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'white'
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelect(solicitud.id)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    <Image
                      src={solicitud.perrito?.fotoPrincipal || '/placeholder-dog.jpg'}
                      alt={solicitud.perrito?.nombre}
                      width={64}
                      height={64}
                      style={{
                        borderRadius: '12px',
                        objectFit: 'cover'
                      }}
                    />
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <h3 style={{ 
                          fontSize: '1rem', 
                          fontWeight: '600', 
                          color: '#0f172a',
                          margin: 0
                        }}>
                          {solicitud.nombre}
                        </h3>
                        <div style={{
                          padding: '2px 10px',
                          backgroundColor: estado.bgLight,
                          color: estado.text,
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {estado.label}
                        </div>
                      </div>
                      
                      <p style={{ 
                        fontSize: '0.875rem', 
                        color: '#64748b',
                        margin: '0 0 8px 0'
                      }}>
                        Solicita adoptar a <span style={{ fontWeight: '600', color: '#475569' }}>
                          {solicitud.perrito?.nombre}
                        </span> • {solicitud.perrito?.raza}
                      </p>
                      
                      <div style={{ 
                        display: 'flex', 
                        gap: '20px',
                        flexWrap: 'wrap',
                        fontSize: '0.8125rem',
                        color: '#64748b'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail style={{ width: '14px', height: '14px' }} />
                          {solicitud.email}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone style={{ width: '14px', height: '14px' }} />
                          {solicitud.telefono}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Home style={{ width: '14px', height: '14px' }} />
                          {solicitud.tipoVivienda}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar style={{ width: '14px', height: '14px' }} />
                          {getTimeAgo(solicitud.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Link
                        href={`/admin/solicitudes/${solicitud.id}`}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#7d2447',
                          color: 'white',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a1a33'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7d2447'}
                      >
                        <Eye style={{ width: '16px', height: '16px' }} />
                        Ver Detalles
                      </Link>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowActions(showActions === solicitud.id ? null : solicitud.id)
                        }}
                        style={{
                          padding: '8px',
                          backgroundColor: 'transparent',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8fafc'
                          e.currentTarget.style.borderColor = '#cbd5e1'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.borderColor = '#e2e8f0'
                        }}
                      >
                        <MoreVertical style={{ width: '16px', height: '16px', color: '#64748b' }} />
                        
                        {showActions === solicitud.id && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '4px',
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            minWidth: '180px',
                            zIndex: 10
                          }}>
                            <Link
                              href={`/admin/solicitudes/${solicitud.id}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                color: '#475569',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8fafc'
                                e.currentTarget.style.color = '#0f172a'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent'
                                e.currentTarget.style.color = '#475569'
                              }}
                            >
                              <Edit style={{ width: '16px', height: '16px' }} />
                              Editar
                            </Link>
                            <button
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                color: '#ef4444',
                                backgroundColor: 'transparent',
                                border: 'none',
                                width: '100%',
                                textAlign: 'left',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#fef2f2'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent'
                              }}
                            >
                              <Trash2 style={{ width: '16px', height: '16px' }} />
                              Eliminar
                            </button>
                          </div>
                        )}
                      </button>
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
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ 
            fontSize: '0.875rem', 
            color: '#64748b' 
          }}>
            Mostrando {startIndex} a {endIndex} de {totalItems} solicitudes
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '8px 12px',
                backgroundColor: currentPage === 1 ? '#f8fafc' : 'white',
                color: currentPage === 1 ? '#cbd5e1' : '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.875rem',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.backgroundColor = '#f8fafc'
                  e.currentTarget.style.borderColor = '#cbd5e1'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.borderColor = '#e2e8f0'
                }
              }}
            >
              Anterior
            </button>
            
            {/* Números de página */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      width: '36px',
                      height: '36px',
                      backgroundColor: pageNum === currentPage ? '#7d2447' : 'white',
                      color: pageNum === currentPage ? 'white' : '#64748b',
                      border: `1px solid ${pageNum === currentPage ? '#7d2447' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: pageNum === currentPage ? '600' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (pageNum !== currentPage) {
                        e.currentTarget.style.backgroundColor = '#fef2f2'
                        e.currentTarget.style.borderColor = '#7d2447'
                        e.currentTarget.style.color = '#7d2447'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (pageNum !== currentPage) {
                        e.currentTarget.style.backgroundColor = 'white'
                        e.currentTarget.style.borderColor = '#e2e8f0'
                        e.currentTarget.style.color = '#64748b'
                      }
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 12px',
                backgroundColor: currentPage === totalPages ? '#f8fafc' : 'white',
                color: currentPage === totalPages ? '#cbd5e1' : '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.875rem',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) {
                  e.currentTarget.style.backgroundColor = '#f8fafc'
                  e.currentTarget.style.borderColor = '#cbd5e1'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== totalPages) {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.borderColor = '#e2e8f0'
                }
              }}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}