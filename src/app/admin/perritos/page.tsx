'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Dog, 
  Plus, 
  Search, 
  Filter,
  Edit2,
  Eye,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Heart,
  ShieldCheck,
  AlertCircle
} from 'lucide-react'

interface Perrito {
  id: string
  codigo: string
  nombre: string
  raza: string
  edad: string
  sexo: string
  tamano: string
  estado: 'disponible' | 'proceso' | 'adoptado' | 'tratamiento'
  tipoIngreso: string
  fechaIngreso: string
  fotoPrincipal: string
}

interface Metrics {
  total: number
  disponibles: number
  enProceso: number
  adoptados: number
  enTratamiento: number
  porTipoIngreso: {
    entregaVoluntaria: number
    rescate: number
    decomiso: number
  }
}

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue'
}: { 
  title: string
  value: number
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

export default function PerritosAdmin() {
  const router = useRouter()
  const [perritos, setPerritos] = useState<Perrito[]>([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchPerritos()
  }, [currentPage, filterTipo, filterEstado])

  async function fetchPerritos() {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (filterTipo) params.append('tipo_ingreso', filterTipo)
      if (filterEstado) params.append('estado', filterEstado)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/admin/perritos?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setPerritos(data.perritos || [])
        setTotalPages(data.totalPages || 1)
        
        // Calculate metrics
        const metricsData: Metrics = {
          total: data.total || 0,
          disponibles: data.summary?.disponible || 0,
          enProceso: data.summary?.proceso || 0,
          adoptados: data.summary?.adoptado || 0,
          enTratamiento: data.summary?.tratamiento || 0,
          porTipoIngreso: {
            entregaVoluntaria: 0,
            rescate: 0,
            decomiso: 0
          }
        }
        setMetrics(metricsData)
      }
    } catch (error) {
      console.error('Error fetching perritos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta mascota?')) {
      try {
        const response = await fetch(`/api/admin/perritos/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          fetchPerritos()
        }
      } catch (error) {
        console.error('Error deleting perrito:', error)
      }
    }
  }

  const getEstadoStyle = (estado: string) => {
    const styles = {
      disponible: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
      proceso: { bg: '#fefce8', color: '#a16207', border: '#fde68a' },
      adoptado: { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' },
      tratamiento: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' }
    }
    return styles[estado as keyof typeof styles] || styles.disponible
  }

  return (
    <div style={{
      padding: '16px',
      width: '100%',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#0f172a',
          margin: '0 0 4px 0',
          fontFamily: 'Albert Sans, sans-serif'
        }}>Gestión de Mascotas</h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#64748b',
          margin: 0,
          fontFamily: 'Poppins, sans-serif'
        }}>Administra el catálogo completo de mascotas del centro</p>
      </div>

      {/* Metrics */}
      {metrics && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <MetricCard title="Total Mascotas" value={metrics.total} icon={Dog} color="blue" />
          <MetricCard title="Disponibles" value={metrics.disponibles} icon={Heart} color="green" />
          <MetricCard title="En Proceso" value={metrics.enProceso} icon={ShieldCheck} color="yellow" />
          <MetricCard title="En Tratamiento" value={metrics.enTratamiento} icon={AlertCircle} color="red" />
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
              minWidth: '250px'
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
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchPerritos()}
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
              <option value="entrega_voluntaria">Entrega Voluntaria</option>
              <option value="rescate">Rescate</option>
              <option value="decomiso">Decomiso</option>
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
              <option value="disponible">Disponible</option>
              <option value="proceso">En Proceso</option>
              <option value="adoptado">Adoptado</option>
              <option value="tratamiento">En Tratamiento</option>
            </select>
          </div>

          {/* Actions */}
          <button
            onClick={() => router.push('/admin/perritos/nuevo')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: '#af1731',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              fontFamily: 'Albert Sans, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7d2447'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#af1731'}
          >
            <Plus style={{ width: '18px', height: '18px' }} />
            Registrar Mascota
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #af1731',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#64748b', fontFamily: 'Poppins, sans-serif' }}>
              Cargando mascotas...
            </p>
          </div>
        ) : perritos.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <Dog style={{ width: '48px', height: '48px', color: '#cbd5e1', margin: '0 auto 16px' }} />
            <p style={{ color: '#64748b', fontFamily: 'Poppins, sans-serif' }}>
              No se encontraron mascotas
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>CÓDIGO</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>MASCOTA</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>RAZA</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>ESTADO</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>TIPO INGRESO</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>FECHA</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {perritos.map((perrito) => {
                const estadoStyle = getEstadoStyle(perrito.estado)
                return (
                  <tr key={perrito.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px', fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                      {perrito.codigo}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Image
                          src={perrito.fotoPrincipal || '/placeholder-dog.jpg'}
                          alt={perrito.nombre}
                          width={48}
                          height={48}
                          style={{
                            borderRadius: '8px',
                            objectFit: 'cover',
                            border: '2px solid #f1f5f9'
                          }}
                        />
                        <div>
                          <p style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#0f172a',
                            margin: '0 0 2px 0',
                            fontFamily: 'Albert Sans, sans-serif'
                          }}>{perrito.nombre}</p>
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            margin: 0,
                            fontFamily: 'Poppins, sans-serif'
                          }}>{perrito.sexo} • {perrito.edad} • {perrito.tamano}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.875rem', color: '#475569', fontFamily: 'Poppins, sans-serif' }}>
                      {perrito.raza}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: estadoStyle.bg,
                        color: estadoStyle.color,
                        border: `1px solid ${estadoStyle.border}`,
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        {perrito.estado}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.875rem', color: '#475569', fontFamily: 'Poppins, sans-serif' }}>
                      {perrito.tipoIngreso.replace('_', ' ')}
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.875rem', color: '#475569', fontFamily: 'Poppins, sans-serif' }}>
                      {new Date(perrito.fechaIngreso).toLocaleDateString('es-MX')}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => router.push(`/admin/perritos/${perrito.id}`)}
                          style={{
                            padding: '6px',
                            backgroundColor: '#f1f5f9',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                          title="Ver detalles"
                        >
                          <Eye style={{ width: '16px', height: '16px', color: '#64748b' }} />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/perritos/${perrito.id}/editar`)}
                          style={{
                            padding: '6px',
                            backgroundColor: '#f1f5f9',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                          title="Editar"
                        >
                          <Edit2 style={{ width: '16px', height: '16px', color: '#64748b' }} />
                        </button>
                        <button
                          onClick={() => handleDelete(perrito.id)}
                          style={{
                            padding: '6px',
                            backgroundColor: '#fef2f2',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                          title="Eliminar"
                        >
                          <Trash2 style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            padding: '16px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
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
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}