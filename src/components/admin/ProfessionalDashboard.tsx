'use client'

import React, { memo } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRealtimeMetrics } from '../../hooks/useRealtimeMetrics'
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Dog,
  FileText,
  Clock,
  Users,
  Wifi,
  WifiOff,
  RefreshCw,
  Calendar,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Plus,
  Syringe,
  Heart,
  ClipboardList,
  Bell,
  Eye
} from 'lucide-react'

// Header Gubernamental Profesional
const GovHeader = memo(({
  userName,
  lastUpdate,
  isConnected
}: {
  userName: string
  lastUpdate: Date | null
  isConnected: boolean
}) => {
  const today = new Date()
  const dateStr = today.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const getGreeting = () => {
    const hour = today.getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #7d2447 0%, #5a1a33 100%)',
      borderRadius: '16px',
      padding: '24px 28px',
      color: 'white',
      marginBottom: '24px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <p style={{
            fontSize: '0.875rem',
            opacity: 0.9,
            margin: '0 0 4px 0',
            textTransform: 'capitalize'
          }}>
            {dateStr}
          </p>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            margin: '0 0 4px 0'
          }}>
            {getGreeting()}, {userName || 'Administrador'}
          </h1>
          <p style={{
            fontSize: '0.9rem',
            opacity: 0.85,
            margin: 0
          }}>
            Centro Municipal de Adopcion y Bienestar Animal - Atlixco
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: '8px',
          backgroundColor: isConnected ? 'rgba(255,255,255,0.15)' : 'rgba(239,68,68,0.3)',
          fontSize: '0.8rem'
        }}>
          {isConnected ? (
            <Wifi style={{ width: '14px', height: '14px' }} />
          ) : (
            <WifiOff style={{ width: '14px', height: '14px' }} />
          )}
          <span>{isConnected ? 'En linea' : 'Sin conexion'}</span>
        </div>
      </div>
    </div>
  )
})
GovHeader.displayName = 'GovHeader'

// KPI Card Grande
const KPICard = memo(({
  value,
  label,
  icon: Icon,
  color,
  trend,
  trendValue
}: {
  value: number | string
  label: string
  icon: any
  color: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
}) => {
  const bgColor = `${color}15`

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        backgroundColor: bgColor,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon style={{ width: '28px', height: '28px', color }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#0f172a',
          lineHeight: 1
        }}>
          {value}
        </div>
        <div style={{
          fontSize: '0.875rem',
          color: '#64748b',
          marginTop: '2px'
        }}>
          {label}
        </div>
      </div>
      {trend && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          borderRadius: '6px',
          backgroundColor: trend === 'up' ? '#dcfce7' : trend === 'down' ? '#fee2e2' : '#f3f4f6',
          fontSize: '0.75rem',
          fontWeight: '600',
          color: trend === 'up' ? '#166534' : trend === 'down' ? '#991b1b' : '#64748b'
        }}>
          {trend === 'up' && <TrendingUp style={{ width: '12px', height: '12px' }} />}
          {trend === 'down' && <TrendingDown style={{ width: '12px', height: '12px' }} />}
          {trendValue}
        </div>
      )}
    </div>
  )
})
KPICard.displayName = 'KPICard'

// Alerta/Pendiente Item
const AlertItem = memo(({
  title,
  count,
  type,
  href
}: {
  title: string
  count: number
  type: 'warning' | 'info' | 'success'
  href: string
}) => {
  const colors = {
    warning: { bg: '#fef3c7', border: '#fcd34d', text: '#92400e', icon: AlertTriangle },
    info: { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af', icon: Clock },
    success: { bg: '#dcfce7', border: '#86efac', text: '#166534', icon: CheckCircle }
  }
  const config = colors[type]
  const Icon = config.icon

  if (count === 0) return null

  return (
    <Link href={href} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      backgroundColor: config.bg,
      borderLeft: `4px solid ${config.border}`,
      borderRadius: '0 8px 8px 0',
      textDecoration: 'none',
      transition: 'all 0.2s'
    }}>
      <Icon style={{ width: '18px', height: '18px', color: config.text, flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: '0.875rem', color: config.text, fontWeight: '500' }}>
        {title}
      </span>
      <span style={{
        backgroundColor: 'white',
        color: config.text,
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: '700'
      }}>
        {count}
      </span>
      <ArrowRight style={{ width: '16px', height: '16px', color: config.text }} />
    </Link>
  )
})
AlertItem.displayName = 'AlertItem'

// Accion Rapida Button
const QuickAction = memo(({
  title,
  icon: Icon,
  href,
  color
}: {
  title: string
  icon: any
  href: string
  color: string
}) => {
  return (
    <Link href={href} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      padding: '16px 12px',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      textDecoration: 'none',
      transition: 'all 0.2s',
      textAlign: 'center'
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        backgroundColor: `${color}15`,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon style={{ width: '22px', height: '22px', color }} />
      </div>
      <span style={{
        fontSize: '0.8rem',
        color: '#374151',
        fontWeight: '500',
        lineHeight: 1.3
      }}>
        {title}
      </span>
    </Link>
  )
})
QuickAction.displayName = 'QuickAction'

// Stat Bar Visual
const StatBar = memo(({
  label,
  value,
  total,
  color
}: {
  label: string
  value: number
  total: number
  color: string
}) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '4px',
        fontSize: '0.8rem'
      }}>
        <span style={{ color: '#64748b' }}>{label}</span>
        <span style={{ color: '#0f172a', fontWeight: '600' }}>{value} ({percentage}%)</span>
      </div>
      <div style={{
        height: '8px',
        backgroundColor: '#f1f5f9',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: '4px',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  )
})
StatBar.displayName = 'StatBar'

// Main Dashboard Component
export function ProfessionalDashboard() {
  const { data: session } = useSession()
  const { metrics, activityEvents, isConnected, lastUpdate } = useRealtimeMetrics()

  if (!metrics) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '60px'
      }}>
        <RefreshCw style={{
          width: '48px',
          height: '48px',
          color: '#7d2447',
          marginBottom: '20px',
          animation: 'spin 1.5s linear infinite'
        }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', margin: '0 0 8px 0' }}>
          Cargando dashboard...
        </h3>
        <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
          Obteniendo metricas del sistema
        </p>
      </div>
    )
  }

  // Calcular pendientes
  const solicitudesPendientes = metrics.solicitudes.enRevision || 0
  const vacunasPendientes = metrics.perritos.total - (metrics.perritos.disponibles + metrics.perritos.enProceso) || 0

  return (
    <div>
      {/* Header Gubernamental */}
      <GovHeader
        userName={session?.user?.name?.split(' ')[0] || ''}
        lastUpdate={lastUpdate}
        isConnected={isConnected}
      />

      {/* KPIs Principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <KPICard
          value={metrics.perritos.total}
          label="Mascotas en el sistema"
          icon={Dog}
          color="#f59e0b"
        />
        <KPICard
          value={metrics.perritos.disponibles}
          label="Disponibles para adopcion"
          icon={Heart}
          color="#10b981"
        />
        <KPICard
          value={metrics.solicitudes.nuevasHoy}
          label="Solicitudes hoy"
          icon={FileText}
          color="#7d2447"
          trend={metrics.tendencias?.solicitudesTendencia}
          trendValue={metrics.tendencias?.solicitudesTendencia === 'up' ? '+12%' : '-5%'}
        />
        <KPICard
          value={metrics.actividad.visitasHoy}
          label="Visitas al sitio"
          icon={Users}
          color="#3b82f6"
        />
      </div>

      {/* Grid de contenido */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '24px'
      }}>
        {/* Columna Principal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Alertas y Pendientes */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Bell style={{ width: '18px', height: '18px', color: '#7d2447' }} />
              Requieren Atencion
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <AlertItem
                title="Solicitudes pendientes de revision"
                count={solicitudesPendientes}
                type="warning"
                href="/admin/solicitudes?estado=nueva"
              />
              <AlertItem
                title="Mascotas en proceso de adopcion"
                count={metrics.perritos.enProceso}
                type="info"
                href="/admin/perritos?estado=en_proceso"
              />
              <AlertItem
                title="Adopciones completadas hoy"
                count={metrics.solicitudes.nuevasHoy > 0 ? 1 : 0}
                type="success"
                href="/admin/solicitudes?estado=aprobada"
              />
            </div>
            {solicitudesPendientes === 0 && metrics.perritos.enProceso === 0 && (
              <p style={{
                textAlign: 'center',
                color: '#10b981',
                padding: '20px',
                fontSize: '0.9rem'
              }}>
                <CheckCircle style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }} />
                Todo al dia - No hay pendientes urgentes
              </p>
            )}
          </div>

          {/* Distribucion de Mascotas */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Dog style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
              Distribucion de Mascotas
            </h3>
            <StatBar
              label="Disponibles"
              value={metrics.perritos.disponibles}
              total={metrics.perritos.total}
              color="#10b981"
            />
            <StatBar
              label="En proceso"
              value={metrics.perritos.enProceso}
              total={metrics.perritos.total}
              color="#f59e0b"
            />
            <StatBar
              label="Adoptados"
              value={metrics.perritos.total - metrics.perritos.disponibles - metrics.perritos.enProceso}
              total={metrics.perritos.total}
              color="#7d2447"
            />
          </div>

          {/* Actividad Reciente */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#0f172a',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Activity style={{ width: '18px', height: '18px', color: '#3b82f6' }} />
                Actividad Reciente
              </h3>
              <span style={{
                fontSize: '0.75rem',
                color: '#64748b',
                backgroundColor: '#f1f5f9',
                padding: '4px 10px',
                borderRadius: '10px'
              }}>
                Ultimas 24h
              </span>
            </div>

            <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {activityEvents.length === 0 ? (
                <p style={{
                  padding: '30px',
                  textAlign: 'center',
                  color: '#9ca3af',
                  fontSize: '0.875rem'
                }}>
                  No hay actividad reciente
                </p>
              ) : (
                activityEvents.slice(0, 8).map((event, index) => (
                  <div
                    key={event.id}
                    style={{
                      padding: '12px 20px',
                      borderBottom: index < activityEvents.length - 1 ? '1px solid #f3f4f6' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: event.tipo === 'adopcion_completada' ? '#10b981' :
                                      event.tipo === 'solicitud_nueva' ? '#3b82f6' : '#f59e0b',
                      flexShrink: 0
                    }} />
                    <span style={{ flex: 1, fontSize: '0.875rem', color: '#374151' }}>
                      {event.descripcion}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      {new Date(event.timestamp).toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Columna Lateral - Acciones Rapidas */}
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            position: 'sticky',
            top: '24px'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 16px 0'
            }}>
              Acciones Rapidas
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <QuickAction
                title="Nuevo Ingreso"
                icon={Plus}
                href="/admin/veterinario/nuevo-ingreso"
                color="#7d2447"
              />
              <QuickAction
                title="Nueva Consulta"
                icon={ClipboardList}
                href="/admin/veterinario/nueva-consulta"
                color="#3b82f6"
              />
              <QuickAction
                title="Ver Solicitudes"
                icon={FileText}
                href="/admin/solicitudes"
                color="#f59e0b"
              />
              <QuickAction
                title="Calendario"
                icon={Calendar}
                href="/admin/veterinario/calendario"
                color="#10b981"
              />
              <QuickAction
                title="Vacunacion"
                icon={Syringe}
                href="/admin/veterinario/vacunacion"
                color="#8b5cf6"
              />
              <QuickAction
                title="Expedientes"
                icon={Eye}
                href="/admin/veterinario/expedientes"
                color="#ec4899"
              />
            </div>

            {/* Metricas Rapidas */}
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', margin: '0 0 12px 0' }}>
                Rendimiento Hoy
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: '#64748b' }}>Tasa de aprobacion</span>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>{metrics.solicitudes.tasaAprobacion}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: '#64748b' }}>T. respuesta prom.</span>
                  <span style={{ color: '#0f172a', fontWeight: '600' }}>{metrics.solicitudes.tiempoPromedioRespuesta}h</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: '#64748b' }}>Usuarios activos</span>
                  <span style={{ color: '#3b82f6', fontWeight: '600' }}>{metrics.actividad.usuariosActivos}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
