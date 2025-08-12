'use client'

import React, { memo } from 'react'
import { useRealtimeMetrics } from '../../hooks/useRealtimeMetrics'
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Dog,
  FileText,
  Clock,
  Users,
  Wifi,
  WifiOff,
  RefreshCw,
  BarChart3,
  PieChart,
  Timer,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

// Memoized header component
const DashboardHeader = memo(({ 
  lastUpdate, 
  isConnected 
}: { 
  lastUpdate: Date | null
  isConnected: boolean 
}) => {
  const formatTime = (date: Date | null) => {
    if (!date) return 'Nunca'
    return date.toLocaleTimeString('es-MX')
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '700', 
          color: '#1f2937',
          margin: '0 0 4px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <BarChart3 style={{ width: '28px', height: '28px', color: '#4f46e5' }} />
          Métricas en Tiempo Real
        </h2>
        <p style={{ 
          color: '#6b7280', 
          margin: 0,
          fontSize: '0.875rem'
        }}>
          Última actualización: {formatTime(lastUpdate)}
        </p>
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '8px',
        backgroundColor: isConnected ? '#f0fdf4' : '#fef2f2',
        border: `1px solid ${isConnected ? '#bbf7d0' : '#fecaca'}`
      }}>
        {isConnected ? (
          <Wifi style={{ width: '16px', height: '16px', color: '#10b981' }} />
        ) : (
          <WifiOff style={{ width: '16px', height: '16px', color: '#ef4444' }} />
        )}
        <span style={{ 
          fontSize: '0.875rem', 
          fontWeight: '500',
          color: isConnected ? '#166534' : '#991b1b'
        }}>
          {isConnected ? 'Conectado' : 'Desconectado'}
        </span>
      </div>
    </div>
  )
})
DashboardHeader.displayName = 'DashboardHeader'

// Memoized metric card component
const MetricCard = memo(({ 
  title, 
  icon: Icon, 
  iconColor, 
  iconBgColor, 
  metrics,
  trend
}: {
  title: string
  icon: any
  iconColor: string
  iconBgColor: string
  metrics: Array<{ value: string | number, label: string, color: string }>
  trend?: React.ReactNode
}) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: iconBgColor,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon style={{ width: '20px', height: '20px', color: iconColor }} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            {title}
          </h3>
        </div>
        {trend}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {metrics.map((metric, index) => (
          <div key={index}>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: metric.color }}>
              {metric.value}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
})
MetricCard.displayName = 'MetricCard'

// Memoized activity item component
const ActivityItem = memo(({ 
  tipo, 
  descripcion, 
  timestamp 
}: {
  tipo: string
  descripcion: string
  timestamp: Date
}) => {
  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case 'solicitud_nueva': return <FileText style={{ width: '14px', height: '14px' }} />
      case 'estado_cambiado': return <Activity style={{ width: '14px', height: '14px' }} />
      case 'comentario': return <AlertCircle style={{ width: '14px', height: '14px' }} />
      case 'adopcion_completada': return <CheckCircle style={{ width: '14px', height: '14px' }} />
      case 'perrito_agregado': return <Dog style={{ width: '14px', height: '14px' }} />
      default: return <Activity style={{ width: '14px', height: '14px' }} />
    }
  }

  const getActivityColor = (tipo: string) => {
    switch (tipo) {
      case 'solicitud_nueva': return '#3b82f6'
      case 'estado_cambiado': return '#8b5cf6'
      case 'comentario': return '#f59e0b'
      case 'adopcion_completada': return '#10b981'
      case 'perrito_agregado': return '#ec4899'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      padding: '12px 0',
      borderBottom: '1px solid #f3f4f6',
      alignItems: 'flex-start'
    }}>
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '8px',
        backgroundColor: `${getActivityColor(tipo)}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: getActivityColor(tipo)
      }}>
        {getActivityIcon(tipo)}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ 
          fontSize: '0.875rem', 
          color: '#374151', 
          margin: '0 0 4px 0',
          lineHeight: 1.5
        }}>
          {descripcion || 'Sin descripción'}
        </p>
        <p style={{ 
          fontSize: '0.75rem', 
          color: '#9ca3af', 
          margin: 0 
        }}>
          {timestamp.toLocaleTimeString('es-MX')}
        </p>
      </div>
    </div>
  )
})
ActivityItem.displayName = 'ActivityItem'

// Memoized trend icon component
const TrendIcon = memo(({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
  switch (trend) {
    case 'up': return <TrendingUp style={{ width: '16px', height: '16px', color: '#10b981' }} />
    case 'down': return <TrendingDown style={{ width: '16px', height: '16px', color: '#ef4444' }} />
    default: return <Minus style={{ width: '16px', height: '16px', color: '#6b7280' }} />
  }
})
TrendIcon.displayName = 'TrendIcon'

// Main component with optimized re-renders
export function RealtimeDashboardOptimized() {
  const { metrics, activityEvents, isConnected, lastUpdate } = useRealtimeMetrics()

  if (!metrics) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        padding: '40px'
      }}>
        <RefreshCw style={{ 
          width: '48px', 
          height: '48px', 
          color: '#6b7280',
          marginBottom: '16px',
          animation: 'spin 2s linear infinite'
        }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
          Cargando métricas en tiempo real...
        </h3>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Conectando con el servidor de métricas
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <DashboardHeader lastUpdate={lastUpdate} isConnected={isConnected} />

      {/* Grid de métricas principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        <MetricCard
          title="Perritos"
          icon={Dog}
          iconColor="#f59e0b"
          iconBgColor="#fef3c7"
          metrics={[
            { value: metrics.perritos.total, label: 'Total', color: '#1f2937' },
            { value: metrics.perritos.disponibles, label: 'Disponibles', color: '#10b981' },
            { value: metrics.perritos.enProceso, label: 'En proceso', color: '#f59e0b' },
            { value: metrics.perritos.cambiosHoy, label: 'Cambios hoy', color: '#3b82f6' }
          ]}
        />

        <MetricCard
          title="Solicitudes"
          icon={FileText}
          iconColor="#4f46e5"
          iconBgColor="#e0e7ff"
          trend={<TrendIcon trend={metrics.tendencias.solicitudesTendencia} />}
          metrics={[
            { value: metrics.solicitudes.nuevasHoy, label: 'Nuevas hoy', color: '#1f2937' },
            { value: metrics.solicitudes.enRevision, label: 'En revisión', color: '#8b5cf6' },
            { value: `${metrics.solicitudes.tasaAprobacion}%`, label: 'Aprobación', color: '#10b981' },
            { value: `${metrics.solicitudes.tiempoPromedioRespuesta}h`, label: 'T. respuesta', color: '#64748b' }
          ]}
        />

        <MetricCard
          title="Actividad"
          icon={Activity}
          iconColor="#10b981"
          iconBgColor="#dcfce7"
          metrics={[
            { value: metrics.actividad.accionesUltimaHora, label: 'Últ. hora', color: '#1f2937' },
            { value: metrics.actividad.usuariosActivos, label: 'Usuarios activos', color: '#3b82f6' },
            { value: metrics.actividad.solicitudesUltimaHora, label: 'Solicitudes últ. hora', color: '#8b5cf6' },
            { value: metrics.actividad.visitasHoy, label: 'Visitas hoy', color: '#f59e0b' }
          ]}
        />
      </div>

      {/* Actividad reciente */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#1f2937',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Clock style={{ width: '20px', height: '20px', color: '#6b7280' }} />
            Actividad Reciente
          </h3>
          <span style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            backgroundColor: '#f3f4f6',
            padding: '4px 12px',
            borderRadius: '12px'
          }}>
            {activityEvents.length} eventos
          </span>
        </div>
        
        <div style={{ 
          padding: '0 20px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {activityEvents.length === 0 ? (
            <p style={{ 
              padding: '40px 0', 
              textAlign: 'center', 
              color: '#9ca3af',
              fontSize: '0.875rem'
            }}>
              No hay actividad reciente
            </p>
          ) : (
            activityEvents.map((event, index) => (
              <ActivityItem
                key={event.id}
                tipo={event.tipo}
                descripcion={event.descripcion}
                timestamp={new Date(event.timestamp)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}