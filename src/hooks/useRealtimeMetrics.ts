import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export interface RealtimeMetrics {
  timestamp: string
  perritos: {
    total: number
    disponibles: number
    enProceso: number
    adoptados: number
    cambiosHoy: number
  }
  solicitudes: {
    total: number
    nuevasHoy: number
    enRevision: number
    aprobadas: number
    rechazadas: number
    tasaAprobacion: number
    tiempoPromedioRespuesta: number
  }
  actividad: {
    usuariosActivos: number
    accionesUltimaHora: number
    solicitudesUltimaHora: number
    visitasHoy: number
  }
  tendencias: {
    solicitudesTendencia: 'up' | 'down' | 'stable'
    adopcionesTendencia: 'up' | 'down' | 'stable'
    tiempoRespuestaTendencia: 'up' | 'down' | 'stable'
  }
}

export interface ActivityEvent {
  id: string
  tipo: 'solicitud_nueva' | 'estado_cambiado' | 'comentario' | 'adopcion_completada' | 'perrito_agregado'
  descripcion: string
  timestamp: string
  usuario?: string
  metadata?: any
}

export function useRealtimeMetrics() {
  const { data: session } = useSession()
  const [metrics, setMetrics] = useState<RealtimeMetrics | null>(null)
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const addActivityEvent = useCallback((event: ActivityEvent) => {
    setActivityEvents(prev => [event, ...prev.slice(0, 49)]) // Mantener solo 50 eventos
  }, [])

  useEffect(() => {
    if (!session?.user || session.user.role !== 'admin') {
      return
    }

    let eventSource: EventSource | null = null
    let reconnectTimeout: NodeJS.Timeout | null = null

    const connect = () => {
      if (eventSource) {
        eventSource.close()
      }

      eventSource = new EventSource('/api/admin/metrics/sse')
      
      eventSource.onopen = () => {
        console.log('Connected to metrics stream')
        setIsConnected(true)
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout)
          reconnectTimeout = null
        }
      }

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'keepalive') {
            return
          }

          if (data.type === 'initial_metrics' || data.type === 'metrics_update') {
            setMetrics(data.metrics)
            setLastUpdate(new Date())
          }

          if (data.type === 'activity_event') {
            addActivityEvent(data.event)
          }
        } catch (error) {
          console.error('Error parsing metrics data:', error)
        }
      }

      eventSource.onerror = (error) => {
        console.error('SSE metrics connection error:', error)
        setIsConnected(false)
        
        if (eventSource) {
          eventSource.close()
        }

        // Reconectar después de 5 segundos
        if (!reconnectTimeout) {
          reconnectTimeout = setTimeout(() => {
            console.log('Attempting to reconnect to metrics...')
            connect()
          }, 5000)
        }
      }
    }

    connect()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
    }
  }, [session, addActivityEvent])

  return {
    metrics,
    activityEvents,
    isConnected,
    lastUpdate
  }
}