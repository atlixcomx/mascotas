import { prisma } from './db'

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

// Store para eventos de actividad en tiempo real
const activityEvents: ActivityEvent[] = []
const MAX_EVENTS = 100

export function addActivityEvent(event: Omit<ActivityEvent, 'id' | 'timestamp'>) {
  const newEvent: ActivityEvent = {
    ...event,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString()
  }
  
  activityEvents.unshift(newEvent)
  if (activityEvents.length > MAX_EVENTS) {
    activityEvents.pop()
  }
  
  // Enviar evento a través del sistema de notificaciones
  broadcastMetricsUpdate()
}

export function getRecentActivity(limit: number = 20): ActivityEvent[] {
  return activityEvents.slice(0, limit)
}

export async function getRealtimeMetrics(): Promise<RealtimeMetrics> {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  const yesterday = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000)
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Obtener métricas de perritos
  const [
    perritosTotal,
    perritosDisponibles,
    perritosEnProceso,
    perritosAdoptados,
    perritosCambiosHoy
  ] = await Promise.all([
    prisma.perrito.count(),
    prisma.perrito.count({ where: { estado: 'disponible' } }),
    prisma.perrito.count({ where: { estado: 'proceso' } }),
    prisma.perrito.count({ where: { estado: 'adoptado' } }),
    prisma.perrito.count({
      where: {
        updatedAt: {
          gte: todayStart
        }
      }
    })
  ])

  // Obtener métricas de solicitudes
  const [
    solicitudesTotal,
    solicitudesNuevasHoy,
    solicitudesEnRevision,
    solicitudesAprobadas,
    solicitudesRechazadas,
    solicitudesUltimaHora
  ] = await Promise.all([
    prisma.solicitud.count(),
    prisma.solicitud.count({
      where: {
        createdAt: {
          gte: todayStart
        }
      }
    }),
    prisma.solicitud.count({
      where: {
        estado: {
          in: ['nueva', 'revision', 'entrevista']
        }
      }
    }),
    prisma.solicitud.count({ where: { estado: 'aprobada' } }),
    prisma.solicitud.count({ where: { estado: 'rechazada' } }),
    prisma.solicitud.count({
      where: {
        createdAt: {
          gte: oneHourAgo
        }
      }
    })
  ])

  // Calcular tasa de aprobación
  const solicitudesFinalizadas = solicitudesAprobadas + solicitudesRechazadas
  const tasaAprobacion = solicitudesFinalizadas > 0 
    ? Math.round((solicitudesAprobadas / solicitudesFinalizadas) * 100)
    : 0

  // Calcular tiempo promedio de respuesta (en horas)
  const solicitudesRespondidas = await prisma.solicitud.findMany({
    where: {
      estado: {
        notIn: ['nueva']
      },
      updatedAt: {
        gte: lastWeek
      }
    },
    select: {
      createdAt: true,
      updatedAt: true
    }
  })

  let tiempoPromedioRespuesta = 0
  if (solicitudesRespondidas.length > 0) {
    const tiempoTotal = solicitudesRespondidas.reduce((sum, s) => {
      const diff = s.updatedAt.getTime() - s.createdAt.getTime()
      return sum + diff
    }, 0)
    tiempoPromedioRespuesta = Math.round(tiempoTotal / solicitudesRespondidas.length / (1000 * 60 * 60))
  }

  // Obtener tendencias comparando con ayer
  const [
    solicitudesAyer,
    adopcionesHoy,
    adopcionesAyer
  ] = await Promise.all([
    prisma.solicitud.count({
      where: {
        createdAt: {
          gte: yesterday,
          lt: todayStart
        }
      }
    }),
    prisma.solicitud.count({
      where: {
        estado: 'aprobada',
        fechaAdopcion: {
          gte: todayStart
        }
      }
    }),
    prisma.solicitud.count({
      where: {
        estado: 'aprobada',
        fechaAdopcion: {
          gte: yesterday,
          lt: todayStart
        }
      }
    })
  ])

  // Calcular tendencias
  const solicitudesTendencia = solicitudesNuevasHoy > solicitudesAyer ? 'up' : 
                               solicitudesNuevasHoy < solicitudesAyer ? 'down' : 'stable'
  const adopcionesTendencia = adopcionesHoy > adopcionesAyer ? 'up' :
                             adopcionesHoy < adopcionesAyer ? 'down' : 'stable'

  // Métricas de actividad
  const accionesUltimaHora = activityEvents.filter(e => {
    const eventTime = new Date(e.timestamp)
    return eventTime >= oneHourAgo
  }).length

  return {
    timestamp: now.toISOString(),
    perritos: {
      total: perritosTotal,
      disponibles: perritosDisponibles,
      enProceso: perritosEnProceso,
      adoptados: perritosAdoptados,
      cambiosHoy: perritosCambiosHoy
    },
    solicitudes: {
      total: solicitudesTotal,
      nuevasHoy: solicitudesNuevasHoy,
      enRevision: solicitudesEnRevision,
      aprobadas: solicitudesAprobadas,
      rechazadas: solicitudesRechazadas,
      tasaAprobacion,
      tiempoPromedioRespuesta
    },
    actividad: {
      usuariosActivos: 0, // Por implementar con sistema de sesiones
      accionesUltimaHora,
      solicitudesUltimaHora,
      visitasHoy: 0 // Por implementar con analytics
    },
    tendencias: {
      solicitudesTendencia,
      adopcionesTendencia,
      tiempoRespuestaTendencia: 'stable' // Por implementar comparación histórica
    }
  }
}

// Conexiones SSE para métricas en tiempo real
const metricsConnections = new Map<string, ReadableStreamDefaultController>()

export function addMetricsConnection(userId: string, controller: ReadableStreamDefaultController) {
  metricsConnections.set(userId, controller)
}

export function removeMetricsConnection(userId: string) {
  metricsConnections.delete(userId)
}

export async function broadcastMetricsUpdate() {
  const metrics = await getRealtimeMetrics()
  const data = `data: ${JSON.stringify({
    type: 'metrics_update',
    metrics,
    timestamp: new Date().toISOString()
  })}\n\n`

  metricsConnections.forEach((controller, userId) => {
    try {
      controller.enqueue(new TextEncoder().encode(data))
    } catch (error) {
      // Conexión cerrada, eliminar
      metricsConnections.delete(userId)
    }
  })
}

// Función para enviar eventos de actividad
export function broadcastActivityEvent(event: ActivityEvent) {
  const data = `data: ${JSON.stringify({
    type: 'activity_event',
    event,
    timestamp: new Date().toISOString()
  })}\n\n`

  metricsConnections.forEach((controller, userId) => {
    try {
      controller.enqueue(new TextEncoder().encode(data))
    } catch (error) {
      metricsConnections.delete(userId)
    }
  })
}