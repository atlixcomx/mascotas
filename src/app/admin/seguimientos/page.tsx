'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Heart,
  Plus,
  Search,
  Filter,
  Eye,
  Calendar,
  Phone,
  MapPin,
  User,
  Dog,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageSquare,
  Camera
} from 'lucide-react'

interface Seguimiento {
  id: string
  folio: string
  fechaSeguimiento: string
  tipoSeguimiento: 'inicial' | 'mensual' | 'semestral' | 'anual' | 'problema'
  adopcion: {
    id: string
    folio: string
    fechaAdopcion: string
  }
  adoptante: {
    nombre: string
    telefono: string
    email: string
    direccion: string
  }
  mascota: {
    id: string
    nombre: string
    codigo: string
    foto: string
    raza: string
  }
  estado: 'pendiente' | 'completado' | 'problema_detectado' | 'requiere_atencion'
  estadoMascota: 'excelente' | 'bueno' | 'regular' | 'preocupante'
  satisfaccionAdoptante: number // 1-5
  observaciones: string
  problemas: string[]
  proximoSeguimiento: string
  responsable: string
}

interface Metrics {
  totalSeguimientos: number
  seguimientosPendientes: number
  seguimientosCompletados: number
  problemasDetectados: number
  satisfaccionPromedio: number
  porTipo: {
    inicial: number
    mensual: number
    semestral: number
    anual: number
    problema: number
  }
}

const tipoSeguimientoConfig = {
  inicial: { label: 'Inicial (7 días)', color: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' }, icon: Heart },
  mensual: { label: 'Mensual', color: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' }, icon: Calendar },
  semestral: { label: 'Semestral', color: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' }, icon: Clock },
  anual: { label: 'Anual', color: { bg: '#e0e7ff', text: '#3730a3', border: '#a5b4fc' }, icon: Star },
  problema: { label: 'Por Problema', color: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' }, icon: AlertTriangle }
}

const estadoConfig = {
  pendiente: { label: 'Pendiente', color: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' } },
  completado: { label: 'Completado', color: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' } },
  problema_detectado: { label: 'Problema Detectado', color: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' } },
  requiere_atencion: { label: 'Requiere Atención', color: { bg: '#fef2f2', text: '#7f1d1d', border: '#fca5a5' } }
}

const estadoMascotaConfig = {
  excelente: { label: 'Excelente', color: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' } },
  bueno: { label: 'Bueno', color: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' } },
  regular: { label: 'Regular', color: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' } },
  preocupante: { label: 'Preocupante', color: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' } }
}

function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue'
}: { 
  title: string
  value: number | string
  icon: any
  color?: string
}) {
  const colorStyles = {
    blue: { bg: '#eff6ff', color: '#2563eb' },
    green: { bg: '#f0fdf4', color: '#16a34a' },
    yellow: { bg: '#fefce8', color: '#ca8a04' },
    red: { bg: '#fef2f2', color: '#dc2626' },
    purple: { bg: '#faf5ff', color: '#9333ea' }
  }

  const style = colorStyles[color as keyof typeof colorStyles] || colorStyles.blue

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            margin: '0 0 4px 0',
            fontFamily: 'Poppins, sans-serif'
          }}>{title}</p>
          <p style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#0f172a',
            margin: 0,
            fontFamily: 'Albert Sans, sans-serif'
          }}>{value}</p>
        </div>
        <div style={{
          padding: '10px',
          borderRadius: '8px',
          backgroundColor: style.bg,
          color: style.color
        }}>
          <Icon style={{ width: '20px', height: '20px' }} />
        </div>
      </div>
    </div>
  )
}

export default function SeguimientosAdmin() {
  const router = useRouter()
  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchSeguimientos()
  }, [currentPage, filterTipo, filterEstado])

  async function fetchSeguimientos() {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (filterTipo) params.append('tipo', filterTipo)
      if (filterEstado) params.append('estado', filterEstado)
      if (searchTerm) params.append('search', searchTerm)

      // Mock data - replace with actual API call
      const mockData = {
        seguimientos: [
          {
            id: '1',
            folio: 'SEG-2024-001',
            fechaSeguimiento: '2024-01-15',
            tipoSeguimiento: 'inicial',
            adopcion: {
              id: 'adop1',
              folio: 'ADOP-2024-001',
              fechaAdopcion: '2024-01-08'
            },
            adoptante: {
              nombre: 'María González',
              telefono: '222-123-4567',
              email: 'maria.gonzalez@email.com',
              direccion: 'Av. Reforma 123, Col. Centro'
            },
            mascota: {
              id: 'perro1',
              nombre: 'Luna',
              codigo: 'PER-001',
              foto: '/placeholder-dog.jpg',
              raza: 'Mestizo'
            },
            estado: 'completado',
            estadoMascota: 'excelente',
            satisfaccionAdoptante: 5,
            observaciones: 'Adaptación excelente, mascota muy feliz',
            problemas: [],
            proximoSeguimiento: '2024-02-15',
            responsable: 'Dr. Carlos Méndez'
          },
          {
            id: '2',
            folio: 'SEG-2024-002',
            fechaSeguimiento: '2024-01-20',
            tipoSeguimiento: 'mensual',
            adopcion: {
              id: 'adop2',
              folio: 'ADOP-2023-045',
              fechaAdopcion: '2023-12-20'
            },
            adoptante: {
              nombre: 'José Ramírez',
              telefono: '222-987-6543',
              email: 'jose.ramirez@email.com',
              direccion: 'Calle 5 de Mayo 456, Col. San Miguel'
            },
            mascota: {
              id: 'perro2',
              nombre: 'Max',
              codigo: 'PER-015',
              foto: '/placeholder-dog.jpg',
              raza: 'Labrador Mix'
            },
            estado: 'problema_detectado',
            estadoMascota: 'regular',
            satisfaccionAdoptante: 3,
            observaciones: 'Problemas de comportamiento menores',
            problemas: ['Ansiedad por separación', 'Ladridos excesivos'],
            proximoSeguimiento: '2024-02-05',
            responsable: 'Dra. Ana Torres'
          }
        ] as Seguimiento[],
        total: 25,
        totalPages: 3,
        metrics: {
          totalSeguimientos: 25,
          seguimientosPendientes: 8,
          seguimientosCompletados: 15,
          problemasDetectados: 2,
          satisfaccionPromedio: 4.2,
          porTipo: {
            inicial: 12,
            mensual: 8,
            semestral: 3,
            anual: 1,
            problema: 1
          }
        } as Metrics
      }

      setSeguimientos(mockData.seguimientos)
      setTotalPages(mockData.totalPages)
      setMetrics(mockData.metrics)
    } catch (error) {
      console.error('Error fetching seguimientos:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        style={{
          width: '14px',
          height: '14px',
          color: i < rating ? '#fbbf24' : '#e5e7eb',
          fill: i < rating ? '#fbbf24' : 'transparent'
        }}
      />
    ))
  }

  return (
    <div style={{
      padding: '16px',
      width: '100%',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#0f172a',
          margin: '0 0 4px 0',
          fontFamily: 'Albert Sans, sans-serif'
        }}>Seguimientos Post-Adopción</h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#64748b',
          margin: 0,
          fontFamily: 'Poppins, sans-serif'
        }}>Monitorea el bienestar de las mascotas adoptadas y la satisfacción de los adoptantes</p>
      </div>

      {/* Metrics */}
      {metrics && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <MetricCard title="Total Seguimientos" value={metrics.totalSeguimientos} icon={MessageSquare} color="blue" />
          <MetricCard title="Pendientes" value={metrics.seguimientosPendientes} icon={Clock} color="yellow" />
          <MetricCard title="Completados" value={metrics.seguimientosCompletados} icon={CheckCircle} color="green" />
          <MetricCard title="Problemas Detectados" value={metrics.problemasDetectados} icon={AlertTriangle} color="red" />
          <MetricCard title="Satisfacción Promedio" value={`${metrics.satisfaccionPromedio}/5`} icon={Star} color="purple" />
        </div>
      )}

      {/* Filters and Actions */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
            {/* Search */}
            <div style={{
              position: 'relative',
              minWidth: '300px'
            }}>
              <Search style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: '#94a3b8'
              }} />
              <input
                type="text"
                placeholder="Buscar por folio, adoptante o mascota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchSeguimientos()}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 40px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.875rem',
                  fontFamily: 'Poppins, sans-serif',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#bfb591'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Filter Tipo */}
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '0.875rem',
                fontFamily: 'Poppins, sans-serif',
                outline: 'none',
                cursor: 'pointer',
                minWidth: '150px'
              }}
            >
              <option value="">Todos los tipos</option>
              <option value="inicial">Inicial (7 días)</option>
              <option value="mensual">Mensual</option>
              <option value="semestral">Semestral</option>
              <option value="anual">Anual</option>
              <option value="problema">Por Problema</option>
            </select>

            {/* Filter Estado */}
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '0.875rem',
                fontFamily: 'Poppins, sans-serif',
                outline: 'none',
                cursor: 'pointer',
                minWidth: '150px'
              }}
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="completado">Completado</option>
              <option value="problema_detectado">Problema Detectado</option>
              <option value="requiere_atencion">Requiere Atención</option>
            </select>
          </div>

          {/* Actions */}
          <button
            onClick={() => router.push('/admin/seguimientos/nuevo')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: '#7d2447',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              fontFamily: 'Albert Sans, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a1a33'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7d2447'}
          >
            <Plus style={{ width: '18px', height: '18px' }} />
            Nuevo Seguimiento
          </button>
        </div>
      </div>

      {/* Seguimientos List */}
      <div style={{
        display: 'grid',
        gap: '16px'
      }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #7d2447',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#64748b', fontFamily: 'Poppins, sans-serif' }}>
              Cargando seguimientos...
            </p>
          </div>
        ) : seguimientos.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <MessageSquare style={{ width: '48px', height: '48px', color: '#cbd5e1', margin: '0 auto 16px' }} />
            <p style={{ color: '#64748b', fontFamily: 'Poppins, sans-serif' }}>
              No se encontraron seguimientos
            </p>
          </div>
        ) : (
          seguimientos.map((seguimiento) => {
            const tipoConfig = tipoSeguimientoConfig[seguimiento.tipoSeguimiento]
            const estadoStyle = estadoConfig[seguimiento.estado]
            const estadoMascotaStyle = estadoMascotaConfig[seguimiento.estadoMascota]

            return (
              <div
                key={seguimiento.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onClick={() => router.push(`/admin/seguimientos/${seguimiento.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  {/* Pet Photo */}
                  <div style={{
                    position: 'relative',
                    flexShrink: 0
                  }}>
                    <Image
                      src={seguimiento.mascota.foto || '/placeholder-dog.jpg'}
                      alt={seguimiento.mascota.nombre}
                      width={80}
                      height={80}
                      style={{
                        borderRadius: '12px',
                        objectFit: 'cover',
                        border: '2px solid #f1f5f9'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      padding: '4px 8px',
                      backgroundColor: tipoConfig.color.bg,
                      color: tipoConfig.color.text,
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      border: `1px solid ${tipoConfig.color.border}`,
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      {tipoConfig.label}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    {/* Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      <div>
                        <h3 style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          color: '#0f172a',
                          margin: '0 0 4px 0',
                          fontFamily: 'Albert Sans, sans-serif'
                        }}>
                          {seguimiento.folio}
                        </h3>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            backgroundColor: estadoStyle.color.bg,
                            color: estadoStyle.color.text,
                            border: `1px solid ${estadoStyle.color.border}`,
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            {estadoStyle.label}
                          </span>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            backgroundColor: estadoMascotaStyle.color.bg,
                            color: estadoMascotaStyle.color.text,
                            border: `1px solid ${estadoMascotaStyle.color.border}`,
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            Estado: {estadoMascotaStyle.label}
                          </span>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {renderStars(seguimiento.satisfaccionAdoptante)}
                      </div>
                    </div>

                    {/* Pet and Adopter Info */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginBottom: '12px'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <Dog style={{ width: '16px', height: '16px', color: '#7d2447' }} />
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#0f172a',
                            fontFamily: 'Albert Sans, sans-serif'
                          }}>
                            {seguimiento.mascota.nombre}
                          </span>
                        </div>
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          margin: 0,
                          fontFamily: 'Poppins, sans-serif'
                        }}>
                          {seguimiento.mascota.codigo} • {seguimiento.mascota.raza}
                        </p>
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <User style={{ width: '16px', height: '16px', color: '#7d2447' }} />
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#0f172a',
                            fontFamily: 'Albert Sans, sans-serif'
                          }}>
                            {seguimiento.adoptante.nombre}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginBottom: '2px'
                        }}>
                          <Phone style={{ width: '12px', height: '12px', color: '#64748b' }} />
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            {seguimiento.adoptante.telefono}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Problems */}
                    {seguimiento.problemas.length > 0 && (
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '4px'
                        }}>
                          {seguimiento.problemas.map((problema, index) => (
                            <span
                              key={index}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '2px 8px',
                                backgroundColor: '#fee2e2',
                                color: '#991b1b',
                                borderRadius: '10px',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                fontFamily: 'Poppins, sans-serif'
                              }}
                            >
                              <AlertTriangle style={{ width: '12px', height: '12px' }} />
                              {problema}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                      color: '#64748b',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar style={{ width: '12px', height: '12px' }} />
                        Seguimiento: {new Date(seguimiento.fechaSeguimiento).toLocaleDateString('es-MX')}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock style={{ width: '12px', height: '12px' }} />
                        Próximo: {new Date(seguimiento.proximoSeguimiento).toLocaleDateString('es-MX')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: 'white',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Página {currentPage} de {totalPages}
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '8px',
                backgroundColor: currentPage === 1 ? '#f3f4f6' : 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: currentPage === 1 ? 0.5 : 1
              }}
            >
              <ChevronLeft style={{ width: '16px', height: '16px', color: '#64748b' }} />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px',
                backgroundColor: currentPage === totalPages ? '#f3f4f6' : 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
            >
              <ChevronRight style={{ width: '16px', height: '16px', color: '#64748b' }} />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}