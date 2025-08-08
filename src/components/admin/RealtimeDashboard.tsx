'use client'

import React from 'react'
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

export function RealtimeDashboard() {
  const { metrics, activityEvents, isConnected, lastUpdate } = useRealtimeMetrics()

  const formatTime = (date: Date | null) => {
    if (!date) return 'Nunca'
    return date.toLocaleTimeString('es-MX')
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp style={{ width: '16px', height: '16px', color: '#10b981' }} />
      case 'down': return <TrendingDown style={{ width: '16px', height: '16px', color: '#ef4444' }} />
      default: return <Minus style={{ width: '16px', height: '16px', color: '#6b7280' }} />
    }
  }

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
      {/* Header con estado de conexión */}
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

      {/* Grid de métricas principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {/* Tarjeta de Perritos */}
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
                backgroundColor: '#fef3c7',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Dog style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Perritos
              </h3>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1f2937' }}>
                {metrics.perritos.total}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Total</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#10b981' }}>
                {metrics.perritos.disponibles}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Disponibles</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#f59e0b' }}>
                {metrics.perritos.enProceso}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>En proceso</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#3b82f6' }}>
                {metrics.perritos.cambiosHoy}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Cambios hoy</div>
            </div>
          </div>
        </div>

        {/* Tarjeta de Solicitudes */}
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
                backgroundColor: '#e0e7ff',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText style={{ width: '20px', height: '20px', color: '#4f46e5' }} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Solicitudes
              </h3>
            </div>
            {getTrendIcon(metrics.tendencias.solicitudesTendencia)}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1f2937' }}>
                {metrics.solicitudes.nuevasHoy}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Nuevas hoy</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#8b5cf6' }}>
                {metrics.solicitudes.enRevision}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>En revisión</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#10b981' }}>
                {metrics.solicitudes.tasaAprobacion}%
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Aprobación</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#64748b' }}>
                {metrics.solicitudes.tiempoPromedioRespuesta}h
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>T. respuesta</div>
            </div>
          </div>
        </div>

        {/* Tarjeta de Actividad */}
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
                backgroundColor: '#dcfce7',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Activity style={{ width: '20px', height: '20px', color: '#10b981' }} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Actividad
              </h3>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1f2937' }}>
                {metrics.actividad.accionesUltimaHora}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Últ. hora</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#3b82f6' }}>
                {metrics.actividad.solicitudesUltimaHora}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Solicitudes/h</div>
            </div>
          </div>
          
          {/* Mini gráfico de actividad */}
          <div style={{ marginTop: '16px', height: '60px', position: 'relative' }}>
            <div style={{ 
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '2px'
            }}>
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${Math.random() * 100}%`,
                    backgroundColor: '#10b981',
                    opacity: 0.3 + (i / 20) * 0.7,
                    borderRadius: '2px 2px 0 0',
                    transition: 'height 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feed de actividad en tiempo real */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc'
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
            <Timer style={{ width: '20px', height: '20px', color: '#6b7280' }} />
            Actividad en Tiempo Real
          </h3>
        </div>
        
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {activityEvents.length === 0 ? (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#6b7280' 
            }}>
              <Activity style={{ 
                width: '32px', 
                height: '32px', 
                margin: '0 auto 12px',
                opacity: 0.5
              }} />
              <p style={{ margin: 0 }}>Esperando eventos de actividad...</p>
            </div>
          ) : (
            activityEvents.map((event, index) => {
              const eventTime = new Date(event.timestamp)
              const timeAgo = Math.floor((Date.now() - eventTime.getTime()) / 60000)
              
              return (
                <div
                  key={event.id}
                  style={{
                    padding: '12px 20px',
                    borderBottom: index < activityEvents.length - 1 ? '1px solid #f1f5f9' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    opacity: 1 - (index * 0.05),
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: `${getActivityColor(event.tipo)}15`,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {React.cloneElement(getActivityIcon(event.tipo), {
                      style: { ...getActivityIcon(event.tipo).props.style, color: getActivityColor(event.tipo) }
                    })}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: '#1f2937',
                      margin: '0 0 2px 0',
                      fontWeight: '500'
                    }}>
                      {event.descripcion}
                    </p>
                    {event.usuario && (
                      <p style={{ 
                        fontSize: '0.75rem', 
                        color: '#6b7280',
                        margin: 0
                      }}>
                        Por {event.usuario}
                      </p>
                    )}
                  </div>
                  
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    flexShrink: 0
                  }}>
                    {timeAgo === 0 ? 'Ahora' : `${timeAgo}m`}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}