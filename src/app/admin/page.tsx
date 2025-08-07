'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Dog, 
  FileText, 
  TrendingUp,
  Users,
  Calendar,
  Heart,
  AlertCircle,
  Package,
  Activity,
  Phone,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  Building2,
  Syringe,
  CalendarDays,
  Megaphone,
  AlertTriangle
} from 'lucide-react'
import styles from './dashboard.module.css'

interface DashboardMetrics {
  perritos: {
    total: number
    disponibles: number
    enProceso: number
    adoptados: number
    nuevosEsteMes: number
    tendencia: number
    // Nuevos campos
    porTipoIngreso: {
      entregaVoluntaria: number
      rescate: number
      decomiso: number
    }
  }
  solicitudes: {
    total: number
    pendientes: number
    aprobadas: number
    rechazadas: number
    tasaAprobacion: number
    tendencia: number
    recientes: any[]
  }
  adopciones: {
    esteMes: number
    mesAnterior: number
    totalAnio: number
    tiempoPromedio: number
    tendencia: number
  }
  seguimientos: {
    pendientes: number
    realizados: number
    proximaSemana: number
    tasaExito: number
    vencidos: number
  }
  eventos: {
    proximos: number
    esteMes: number
    asistentesTotal: number
  }
  insumos: {
    alertasBajoStock: number
    gastosEsteMes: number
    categorias: {
      alimento: number
      medicamento: number
      limpieza: number
    }
  }
  salud: {
    vacunacionesPendientes: number
    esterilizacionesPendientes: number
    consultasEsteMes: number
  }
}

interface ProximoEvento {
  id: string
  nombre: string
  fecha: string
  tipo: string
  lugar: string
}

interface AlertaImportante {
  id: string
  tipo: string
  mensaje: string
  prioridad: string
  link?: string
}

function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'blue',
  subtitle,
  onClick
}: { 
  title: string
  value: string | number
  change?: number
  icon: any
  color?: string
  subtitle?: string
  onClick?: () => void
}) {
  const colorStyles = {
    blue: {
      backgroundColor: '#eff6ff',
      color: '#2563eb',
      borderColor: '#bfdbfe'
    },
    green: {
      backgroundColor: '#f0fdf4',
      color: '#16a34a',
      borderColor: '#bbf7d0'
    },
    yellow: {
      backgroundColor: '#fefce8',
      color: '#ca8a04',
      borderColor: '#fef08a'
    },
    red: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      borderColor: '#fecaca'
    },
    purple: {
      backgroundColor: '#faf5ff',
      color: '#9333ea',
      borderColor: '#e9d5ff'
    },
    orange: {
      backgroundColor: '#fff7ed',
      color: '#ea580c',
      borderColor: '#fed7aa'
    }
  }

  const [isHovered, setIsHovered] = useState(false)
  const iconStyle = colorStyles[color as keyof typeof colorStyles] || colorStyles.blue

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: isHovered 
          ? '0 8px 24px rgba(125, 36, 71, 0.12)' 
          : '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: `1px solid ${isHovered ? '#bfb591' : 'rgba(0, 0, 0, 0.05)'}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top gradient line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(135deg, #7d2447 0%, #af1731 100%)',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }} />
      
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <p style={{ 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: '#4b5563',
            margin: '0 0 8px 0',
            fontFamily: 'Poppins, sans-serif'
          }}>
            {title}
          </p>
          <p style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: '#0f172a',
            margin: '0 0 4px 0',
            fontFamily: 'Albert Sans, sans-serif',
            letterSpacing: '-0.02em'
          }}>
            {value}
          </p>
          {subtitle && (
            <p style={{ 
              fontSize: '0.75rem', 
              color: '#6b7280',
              margin: '4px 0 0 0',
              fontFamily: 'Poppins, sans-serif'
            }}>
              {subtitle}
            </p>
          )}
          {change !== undefined && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginTop: '12px' 
            }}>
              {change > 0 ? (
                <ArrowUp style={{ width: '16px', height: '16px', color: '#22c55e', marginRight: '4px' }} />
              ) : change < 0 ? (
                <ArrowDown style={{ width: '16px', height: '16px', color: '#ef4444', marginRight: '4px' }} />
              ) : null}
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: change > 0 ? '#16a34a' : change < 0 ? '#dc2626' : '#4b5563',
                fontFamily: 'Poppins, sans-serif'
              }}>
                {change > 0 && '+'}{change}% vs mes anterior
              </span>
            </div>
          )}
        </div>
        <div style={{
          padding: '12px',
          borderRadius: '12px',
          backgroundColor: iconStyle.backgroundColor,
          color: iconStyle.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon style={{ width: '24px', height: '24px' }} />
        </div>
      </div>
    </div>
  )
}

function QuickActionCard({ 
  title, 
  description, 
  href, 
  icon: Icon, 
  color = 'blue',
  badge
}: { 
  title: string
  description: string
  href: string
  icon: any
  color?: string
  badge?: number
}) {
  const colorStyles = {
    blue: {
      color: '#2563eb',
      backgroundColor: '#eff6ff'
    },
    green: {
      color: '#16a34a',
      backgroundColor: '#f0fdf4'
    },
    purple: {
      color: '#9333ea',
      backgroundColor: '#faf5ff'
    },
    orange: {
      color: '#ea580c',
      backgroundColor: '#fff7ed'
    },
    red: {
      color: '#dc2626',
      backgroundColor: '#fef2f2'
    }
  }

  const [isHovered, setIsHovered] = useState(false)
  const iconStyle = colorStyles[color as keyof typeof colorStyles] || colorStyles.blue

  return (
    <Link 
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'block',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        border: `2px solid ${isHovered ? '#bfb591' : 'transparent'}`,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        textDecoration: 'none',
        boxShadow: isHovered ? '0 8px 24px rgba(125, 36, 71, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
        transform: isHovered ? 'translateY(-2px)' : 'none'
      }}
    >
      {/* Decorative gradient overlay */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '200%',
        height: '200%',
        background: 'linear-gradient(135deg, #bfb591 0%, #d4c9a8 100%)',
        opacity: isHovered ? 0.08 : 0.03,
        transform: 'rotate(45deg)',
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none'
      }} />
      
      {badge !== undefined && badge > 0 && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          backgroundColor: '#dc2626',
          color: 'white',
          fontSize: '0.75rem',
          fontWeight: '700',
          padding: '4px 8px',
          borderRadius: '9999px',
          minWidth: '24px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }}>
          {badge}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div style={{
          padding: '8px',
          borderRadius: '12px',
          backgroundColor: iconStyle.backgroundColor,
          color: iconStyle.color,
          marginRight: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon style={{ width: '20px', height: '20px' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            fontWeight: '600', 
            color: '#0f172a',
            margin: '0 0 4px 0',
            fontSize: '1rem',
            fontFamily: 'Albert Sans, sans-serif'
          }}>
            {title}
          </h3>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#64748b',
            margin: 0,
            fontFamily: 'Poppins, sans-serif'
          }}>
            {description}
          </p>
        </div>
        <ChevronRight style={{ 
          width: '20px', 
          height: '20px', 
          color: '#94a3b8',
          transition: 'transform 0.3s ease',
          transform: isHovered ? 'translateX(4px)' : 'none'
        }} />
      </div>
    </Link>
  )
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [proximosEventos, setProximosEventos] = useState<ProximoEvento[]>([])
  const [alertas, setAlertas] = useState<AlertaImportante[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const data = await response.json()
        setMetrics(data.metrics || mockMetrics)
        setProximosEventos(data.proximosEventos || [])
        
        // Generar alertas basadas en métricas
        const alertasGeneradas: AlertaImportante[] = []
        
        if (data.metrics?.seguimientos?.vencidos > 0) {
          alertasGeneradas.push({
            id: '1',
            tipo: 'seguimiento',
            mensaje: `${data.metrics.seguimientos.vencidos} seguimientos vencidos requieren atención inmediata`,
            prioridad: 'alta',
            link: '/admin/seguimientos'
          })
        }
        
        if (data.metrics?.insumos?.alertasBajoStock > 0) {
          alertasGeneradas.push({
            id: '2',
            tipo: 'insumos',
            mensaje: `${data.metrics.insumos.alertasBajoStock} insumos con stock bajo`,
            prioridad: 'media',
            link: '/admin/insumos'
          })
        }
        
        if (data.metrics?.salud?.vacunacionesPendientes > 0) {
          alertasGeneradas.push({
            id: '3',
            tipo: 'salud',
            mensaje: `${data.metrics.salud.vacunacionesPendientes} mascotas necesitan vacunación`,
            prioridad: 'media',
            link: '/admin/expedientes'
          })
        }
        
        setAlertas(alertasGeneradas)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Usar datos de ejemplo si hay error
      setMetrics(mockMetrics)
    } finally {
      setLoading(false)
    }
  }

  // Datos de ejemplo mejorados
  const mockMetrics: DashboardMetrics = {
    perritos: {
      total: 42,
      disponibles: 18,
      enProceso: 6,
      adoptados: 18,
      nuevosEsteMes: 5,
      tendencia: 15,
      porTipoIngreso: {
        entregaVoluntaria: 22,
        rescate: 15,
        decomiso: 5
      }
    },
    solicitudes: {
      total: 127,
      pendientes: 8,
      aprobadas: 94,
      rechazadas: 25,
      tasaAprobacion: 79,
      tendencia: -5,
      recientes: []
    },
    adopciones: {
      esteMes: 12,
      mesAnterior: 10,
      totalAnio: 85,
      tiempoPromedio: 15,
      tendencia: 20
    },
    seguimientos: {
      pendientes: 6,
      realizados: 24,
      proximaSemana: 3,
      tasaExito: 92,
      vencidos: 2
    },
    eventos: {
      proximos: 2,
      esteMes: 3,
      asistentesTotal: 450
    },
    insumos: {
      alertasBajoStock: 3,
      gastosEsteMes: 12500,
      categorias: {
        alimento: 7500,
        medicamento: 3200,
        limpieza: 1800
      }
    },
    salud: {
      vacunacionesPendientes: 4,
      esterilizacionesPendientes: 7,
      consultasEsteMes: 15
    }
  }

  const data = metrics || mockMetrics

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Centro de Control</h1>
        <p className="text-gray-600">
          Sistema de Adopción Municipal de Atlixco - {new Date().toLocaleDateString('es-MX', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Alertas Importantes */}
      {alertas.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          {alertas.map((alerta) => (
            <div key={alerta.id} style={{
              padding: '16px',
              borderRadius: '12px',
              border: `1px solid ${alerta.prioridad === 'alta' ? '#fecaca' : '#fef08a'}`,
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '12px',
              backgroundColor: alerta.prioridad === 'alta' ? '#fef2f2' : '#fefce8',
              color: alerta.prioridad === 'alta' ? '#991b1b' : '#854d0e',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
              <AlertCircle style={{ 
                width: '20px', 
                height: '20px', 
                marginRight: '12px', 
                flexShrink: 0, 
                marginTop: '2px' 
              }} />
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ 
                  fontWeight: '500', 
                  margin: 0,
                  fontFamily: 'Poppins, sans-serif' 
                }}>{alerta.mensaje}</p>
                {alerta.link && (
                  <Link 
                    href={alerta.link}
                    style={{
                      marginLeft: '16px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      textDecoration: 'none',
                      color: alerta.prioridad === 'alta' ? '#991b1b' : '#854d0e',
                      fontFamily: 'Albert Sans, sans-serif'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Resolver →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Métricas Principales - Primera Fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Perritos Disponibles"
          value={data.perritos.disponibles}
          change={data.perritos.tendencia}
          icon={Dog}
          color="blue"
          subtitle={`De ${data.perritos.total} totales`}
        />
        <MetricCard
          title="Adopciones Este Mes"
          value={data.adopciones.esteMes}
          change={data.adopciones.tendencia}
          icon={Heart}
          color="green"
          subtitle={`${data.adopciones.totalAnio} en el año`}
        />
        <MetricCard
          title="Solicitudes Pendientes"
          value={data.solicitudes.pendientes}
          icon={FileText}
          color="yellow"
          subtitle={`${data.solicitudes.tasaAprobacion}% aprobación`}
        />
        <MetricCard
          title="Seguimientos Pendientes"
          value={data.seguimientos.pendientes}
          icon={Phone}
          color="purple"
          subtitle={`${data.seguimientos.vencidos} vencidos`}
        />
      </div>

      {/* Métricas Secundarias - Segunda Fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Vacunaciones Pendientes"
          value={data.salud.vacunacionesPendientes}
          icon={Syringe}
          color="orange"
          subtitle="Requieren atención"
        />
        <MetricCard
          title="Próximos Eventos"
          value={data.eventos.proximos}
          icon={Megaphone}
          color="blue"
          subtitle={`${data.eventos.asistentesTotal} asistentes totales`}
        />
        <MetricCard
          title="Alertas de Stock"
          value={data.insumos.alertasBajoStock}
          icon={Package}
          color="red"
          subtitle={`$${data.insumos.gastosEsteMes.toLocaleString()} gastados`}
        />
        <MetricCard
          title="Nuevos Este Mes"
          value={data.perritos.nuevosEsteMes}
          icon={TrendingUp}
          color="green"
          subtitle="Ingresos al refugio"
        />
      </div>

      {/* Gráficas y estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Estadísticas de Adopción */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          padding: '24px',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: '#0f172a',
              margin: 0,
              fontFamily: 'Albert Sans, sans-serif'
            }}>Estadísticas de Adopción</h2>
            <BarChart3 style={{ width: '20px', height: '20px', color: '#94a3b8' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.875rem', color: '#4b5563', fontFamily: 'Poppins, sans-serif' }}>Tiempo promedio de adopción</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', fontFamily: 'Albert Sans, sans-serif' }}>{data.adopciones.tiempoPromedio} días</span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px' }}>
                <div style={{ 
                  backgroundColor: '#2563eb', 
                  height: '8px', 
                  borderRadius: '9999px', 
                  width: '65%',
                  transition: 'width 0.5s ease'
                }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.875rem', color: '#4b5563', fontFamily: 'Poppins, sans-serif' }}>Tasa de éxito en seguimientos</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', fontFamily: 'Albert Sans, sans-serif' }}>{data.seguimientos.tasaExito}%</span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px' }}>
                <div style={{ 
                  backgroundColor: '#16a34a', 
                  height: '8px', 
                  borderRadius: '9999px', 
                  width: `${data.seguimientos.tasaExito}%`,
                  transition: 'width 0.5s ease'
                }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.875rem', color: '#4b5563', fontFamily: 'Poppins, sans-serif' }}>Ocupación del refugio</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', fontFamily: 'Albert Sans, sans-serif' }}>
                  {Math.round((data.perritos.disponibles / data.perritos.total) * 100)}%
                </span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px' }}>
                <div style={{ 
                  backgroundColor: '#ca8a04', 
                  height: '8px', 
                  borderRadius: '9999px', 
                  width: `${Math.round((data.perritos.disponibles / data.perritos.total) * 100)}%`,
                  transition: 'width 0.5s ease'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Origen de Mascotas */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          padding: '24px',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: '#0f172a',
              margin: 0,
              fontFamily: 'Albert Sans, sans-serif'
            }}>Origen de Mascotas</h2>
            <PieChart style={{ width: '20px', height: '20px', color: '#94a3b8' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: '#eff6ff',
              borderRadius: '12px',
              border: '1px solid #dbeafe'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  marginRight: '12px'
                }}></div>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Poppins, sans-serif'
                }}>Entrega Voluntaria</span>
              </div>
              <span style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#0f172a',
                fontFamily: 'Albert Sans, sans-serif'
              }}>{data.perritos.porTipoIngreso.entregaVoluntaria}</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: '#f0fdf4',
              borderRadius: '12px',
              border: '1px solid #d1fae5'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#22c55e',
                  borderRadius: '50%',
                  marginRight: '12px'
                }}></div>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Poppins, sans-serif'
                }}>Rescate</span>
              </div>
              <span style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#0f172a',
                fontFamily: 'Albert Sans, sans-serif'
              }}>{data.perritos.porTipoIngreso.rescate}</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: '#fff7ed',
              borderRadius: '12px',
              border: '1px solid #fed7aa'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#f97316',
                  borderRadius: '50%',
                  marginRight: '12px'
                }}></div>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Poppins, sans-serif'
                }}>Decomiso</span>
              </div>
              <span style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#0f172a',
                fontFamily: 'Albert Sans, sans-serif'
              }}>{data.perritos.porTipoIngreso.decomiso}</span>
            </div>
          </div>
        </div>

        {/* Gastos por Categoría */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          padding: '24px',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: '#0f172a',
              margin: 0,
              fontFamily: 'Albert Sans, sans-serif'
            }}>Gastos del Mes</h2>
            <BarChart3 style={{ width: '20px', height: '20px', color: '#94a3b8' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: '#faf5ff',
              borderRadius: '12px',
              border: '1px solid #e9d5ff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Package style={{ width: '16px', height: '16px', color: '#9333ea', marginRight: '12px' }} />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Poppins, sans-serif'
                }}>Alimento</span>
              </div>
              <span style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#0f172a',
                fontFamily: 'Albert Sans, sans-serif'
              }}>${data.insumos.categorias.alimento.toLocaleString()}</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: '#fef2f2',
              borderRadius: '12px',
              border: '1px solid #fecaca'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Syringe style={{ width: '16px', height: '16px', color: '#dc2626', marginRight: '12px' }} />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Poppins, sans-serif'
                }}>Medicamentos</span>
              </div>
              <span style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#0f172a',
                fontFamily: 'Albert Sans, sans-serif'
              }}>${data.insumos.categorias.medicamento.toLocaleString()}</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: '#eff6ff',
              borderRadius: '12px',
              border: '1px solid #dbeafe'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Activity style={{ width: '16px', height: '16px', color: '#2563eb', marginRight: '12px' }} />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Poppins, sans-serif'
                }}>Limpieza</span>
              </div>
              <span style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#0f172a',
                fontFamily: 'Albert Sans, sans-serif'
              }}>${data.insumos.categorias.limpieza.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="Registrar Mascota"
            description="Añadir nuevo perrito al sistema"
            href="/admin/perritos/nuevo"
            icon={Dog}
            color="blue"
          />
          <QuickActionCard
            title="Ver Solicitudes"
            description={`${data.solicitudes.pendientes} pendientes de revisar`}
            href="/admin/solicitudes"
            icon={FileText}
            color="green"
            badge={data.solicitudes.pendientes}
          />
          <QuickActionCard
            title="Expedientes Médicos"
            description="Gestionar salud de mascotas"
            href="/admin/expedientes"
            icon={Syringe}
            color="red"
            badge={data.salud.vacunacionesPendientes}
          />
          <QuickActionCard
            title="Programar Seguimiento"
            description="Llamadas de monitoreo"
            href="/admin/seguimientos"
            icon={Phone}
            color="purple"
            badge={data.seguimientos.vencidos}
          />
        </div>
      </div>

      {/* Sección inferior con múltiples widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Solicitudes Recientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Solicitudes Recientes</h2>
            <Link href="/admin/solicitudes" className="text-sm text-blue-600 hover:text-blue-700">
              Ver todas →
            </Link>
          </div>
          {data.solicitudes.recientes.length > 0 ? (
            <div className="space-y-3">
              {data.solicitudes.recientes.slice(0, 5).map((solicitud) => (
                <div key={solicitud.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <img
                      src={solicitud.perrito?.fotoPrincipal || '/placeholder-dog.jpg'}
                      alt={solicitud.perrito?.nombre || 'Perrito'}
                      className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-white shadow-sm"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{solicitud.nombre}</p>
                      <p className="text-sm text-gray-600">Para {solicitud.perrito?.nombre || 'Sin asignar'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                    solicitud.estado === 'nueva' 
                      ? 'bg-blue-100 text-blue-700'
                      : solicitud.estado === 'revision'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {solicitud.estado}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay solicitudes recientes</p>
            </div>
          )}
        </div>

        {/* Próximos Eventos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Próximos Eventos</h2>
            <Link href="/admin/eventos" className="text-sm text-blue-600 hover:text-blue-700">
              Ver todos →
            </Link>
          </div>
          {proximosEventos.length > 0 ? (
            <div className="space-y-3">
              {proximosEventos.map((evento) => (
                <div key={evento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{evento.nombre}</p>
                      <p className="text-sm text-gray-600">{evento.lugar}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(evento.fecha).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">{evento.tipo}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay eventos programados</p>
              <Link 
                href="/admin/eventos/nuevo"
                className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
              >
                Programar evento
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}