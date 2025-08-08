'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  Dog,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Eye,
  MessageSquare,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Download,
  Filter,
  ChevronRight,
  Home,
  Heart,
  Star,
  Zap
} from 'lucide-react'

interface EstadisticasData {
  totales: {
    total: number
    aprobadas: number
    rechazadas: number
    enProceso: number
    tasaAprobacion: number
    tiempoPromedio: number
  }
  porMes: Array<{
    mes: string
    total: number
    aprobadas: number
    rechazadas: number
  }>
  porEstado: Array<{
    estado: string
    cantidad: number
    porcentaje: number
  }>
  perritos: Array<{
    id: string
    nombre: string
    fotoPrincipal: string
    solicitudes: number
    estado: string
  }>
  tendencias: {
    solicitudesEsteMes: number
    solicitudesMesAnterior: number
    cambio: number
    tendencia: 'up' | 'down' | 'stable'
  }
}

const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const estadoColores = {
  nueva: { bg: '#3b82f6', label: 'Nueva' },
  revision: { bg: '#f59e0b', label: 'En Revisión' },
  entrevista: { bg: '#8b5cf6', label: 'Entrevista' },
  prueba: { bg: '#f97316', label: 'Prueba' },
  aprobada: { bg: '#10b981', label: 'Aprobada' },
  rechazada: { bg: '#ef4444', label: 'Rechazada' },
  cancelada: { bg: '#6b7280', label: 'Cancelada' }
}

export default function EstadisticasPage() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasData | null>(null)
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState('6meses')
  const [filtroTipo, setFiltroTipo] = useState('todos')

  useEffect(() => {
    fetchEstadisticas()
  }, [periodo])

  async function fetchEstadisticas() {
    try {
      const response = await fetch(`/api/admin/solicitudes/estadisticas?periodo=${periodo}`)
      if (response.ok) {
        const data = await response.json()
        setEstadisticas(data)
      }
    } catch (error) {
      console.error('Error fetching estadísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #af1731',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!estadisticas) {
    return (
      <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '64px' }}>
          <AlertCircle style={{ width: '48px', height: '48px', color: '#ef4444', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a' }}>
            Error al cargar estadísticas
          </h3>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Link
          href="/admin/solicitudes"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#64748b',
            textDecoration: 'none',
            fontSize: '0.875rem',
            marginBottom: '16px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Volver a solicitudes
        </Link>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#0f172a',
              margin: '0 0 8px 0',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Estadísticas de Adopciones
            </h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>
              Analiza el rendimiento y tendencias del proceso de adopción
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.875rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="1mes">Último mes</option>
              <option value="3meses">Últimos 3 meses</option>
              <option value="6meses">Últimos 6 meses</option>
              <option value="1año">Último año</option>
            </select>
            
            <button
              onClick={async () => {
                try {
                  const response = await fetch(`/api/admin/solicitudes/exportar?formato=csv&periodo=${periodo}`)
                  if (response.ok) {
                    const blob = await response.blob()
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `estadisticas_adopcion_${new Date().toISOString().split('T')[0]}.csv`
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
                backgroundColor: '#af1731',
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
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8b1227'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#af1731'}
            >
              <Download style={{ width: '16px', height: '16px' }} />
              Exportar Reporte
            </button>
          </div>
        </div>
      </div>

      {/* KPIs principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Total de solicitudes */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                marginBottom: '8px',
                fontWeight: '600'
              }}>
                Total Solicitudes
              </p>
              <p style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#0f172a',
                margin: 0
              }}>
                {estadisticas.totales.total}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '12px'
              }}>
                {estadisticas.tendencias.tendencia === 'up' ? (
                  <>
                    <TrendingUp style={{ width: '20px', height: '20px', color: '#10b981' }} />
                    <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: '600' }}>
                      +{estadisticas.tendencias.cambio}%
                    </span>
                  </>
                ) : estadisticas.tendencias.tendencia === 'down' ? (
                  <>
                    <TrendingDown style={{ width: '20px', height: '20px', color: '#ef4444' }} />
                    <span style={{ fontSize: '0.875rem', color: '#ef4444', fontWeight: '600' }}>
                      {estadisticas.tendencias.cambio}%
                    </span>
                  </>
                ) : (
                  <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>
                    Sin cambios
                  </span>
                )}
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  vs mes anterior
                </span>
              </div>
            </div>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: '#dbeafe',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText style={{ width: '28px', height: '28px', color: '#3b82f6' }} />
            </div>
          </div>
        </div>

        {/* Tasa de aprobación */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                marginBottom: '8px',
                fontWeight: '600'
              }}>
                Tasa de Aprobación
              </p>
              <p style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#0f172a',
                margin: 0
              }}>
                {estadisticas.totales.tasaAprobacion}%
              </p>
              <div style={{ marginTop: '12px' }}>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${estadisticas.totales.tasaAprobacion}%`,
                    height: '100%',
                    backgroundColor: '#10b981',
                    transition: 'width 1s ease-out'
                  }} />
                </div>
              </div>
            </div>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: '#d1fae5',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target style={{ width: '28px', height: '28px', color: '#10b981' }} />
            </div>
          </div>
        </div>

        {/* Tiempo promedio */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                marginBottom: '8px',
                fontWeight: '600'
              }}>
                Tiempo Promedio
              </p>
              <p style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#0f172a',
                margin: 0
              }}>
                {estadisticas.totales.tiempoPromedio}
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                marginTop: '8px'
              }}>
                días hasta adopción
              </p>
            </div>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: '#e9d5ff',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock style={{ width: '28px', height: '28px', color: '#8b5cf6' }} />
            </div>
          </div>
        </div>

        {/* En proceso */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                marginBottom: '8px',
                fontWeight: '600'
              }}>
                En Proceso
              </p>
              <p style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#0f172a',
                margin: 0
              }}>
                {estadisticas.totales.enProceso}
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                marginTop: '8px'
              }}>
                solicitudes activas
              </p>
            </div>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Activity style={{ width: '28px', height: '28px', color: '#f59e0b' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Gráfico de barras - Solicitudes por mes */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#0f172a',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <BarChart3 style={{ width: '20px', height: '20px', color: '#af1731' }} />
            Solicitudes por Mes
          </h2>
          
          <div style={{ height: '300px', position: 'relative' }}>
            {/* Simplificado - solo barras estáticas */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              height: '260px',
              borderBottom: '2px solid #e2e8f0',
              paddingBottom: '20px'
            }}>
              {estadisticas.porMes.map((mes, index) => {
                const maxValue = Math.max(...estadisticas.porMes.map(m => m.total))
                const height = (mes.total / maxValue) * 100
                
                return (
                  <div key={index} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    flex: 1
                  }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#0f172a'
                    }}>
                      {mes.total}
                    </span>
                    <div style={{
                      width: '40px',
                      height: `${height}%`,
                      backgroundColor: '#af1731',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.5s ease-out'
                    }} />
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginTop: '8px'
                    }}>
                      {mes.mes}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Distribución por estado */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#0f172a',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <PieChart style={{ width: '20px', height: '20px', color: '#af1731' }} />
            Por Estado
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {estadisticas.porEstado.map((item, index) => {
              const config = estadoColores[item.estado as keyof typeof estadoColores]
              return (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: config?.bg || '#6b7280',
                    borderRadius: '50%'
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#0f172a',
                        fontWeight: '500'
                      }}>
                        {config?.label || item.estado}
                      </span>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#0f172a'
                      }}>
                        {item.cantidad}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: '#e2e8f0',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${item.porcentaje}%`,
                        height: '100%',
                        backgroundColor: config?.bg || '#6b7280',
                        transition: 'width 0.5s ease-out'
                      }} />
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    minWidth: '40px',
                    textAlign: 'right'
                  }}>
                    {item.porcentaje}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Perritos más solicitados */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#0f172a',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Star style={{ width: '20px', height: '20px', color: '#af1731' }} />
          Perritos Más Solicitados
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {estadisticas.perritos.slice(0, 6).map((perrito, index) => (
            <div key={perrito.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            >
              <div style={{
                position: 'relative',
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                {index < 3 && (
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '24px',
                    height: '24px',
                    backgroundColor: index === 0 ? '#fbbf24' : index === 1 ? '#cbd5e1' : '#f59e0b',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: index === 0 ? '#78350f' : index === 1 ? '#334155' : '#78350f',
                    zIndex: 1
                  }}>
                    {index + 1}
                  </div>
                )}
                <img
                  src={perrito.fotoPrincipal || '/placeholder-dog.jpg'}
                  alt={perrito.nombre}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {perrito.nombre}
                </p>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#64748b'
                }}>
                  {perrito.solicitudes} solicitudes
                </p>
              </div>
              
              {perrito.estado === 'disponible' ? (
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%'
                }} />
              ) : (
                <div style={{
                  padding: '2px 8px',
                  backgroundColor: '#fee2e2',
                  color: '#ef4444',
                  borderRadius: '4px',
                  fontSize: '0.625rem',
                  fontWeight: '600'
                }}>
                  Adoptado
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resumen rápido */}
      <div style={{
        marginTop: '32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          backgroundColor: '#dbeafe',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #93c5fd'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Zap style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
            <div>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#1e40af',
                marginBottom: '4px'
              }}>
                Solicitudes este mes
              </p>
              <p style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1e3a8a'
              }}>
                {estadisticas.tendencias.solicitudesEsteMes}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#d1fae5',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #86efac'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Award style={{ width: '24px', height: '24px', color: '#10b981' }} />
            <div>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#065f46',
                marginBottom: '4px'
              }}>
                Adopciones exitosas
              </p>
              <p style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#064e3b'
              }}>
                {estadisticas.totales.aprobadas}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#fee2e2',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #fca5a5'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Heart style={{ width: '24px', height: '24px', color: '#ef4444' }} />
            <div>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#991b1b',
                marginBottom: '4px'
              }}>
                Hogares encontrados
              </p>
              <p style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#7f1d1d'
              }}>
                {estadisticas.totales.aprobadas}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}