import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../../lib/auth'
import { addMetricsConnection, removeMetricsConnection, getRealtimeMetrics } from '../../../../../lib/metrics'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return new Response('Unauthorized', { status: 401 })
    }

    const userId = session.user.id

    const stream = new ReadableStream({
      async start(controller) {
        // Almacenar la conexión
        addMetricsConnection(userId, controller)
        
        // Enviar métricas iniciales
        const initialMetrics = await getRealtimeMetrics()
        const data = `data: ${JSON.stringify({
          type: 'initial_metrics',
          metrics: initialMetrics,
          timestamp: new Date().toISOString()
        })}\n\n`
        
        controller.enqueue(new TextEncoder().encode(data))
        
        // Enviar actualizaciones cada 30 segundos
        const metricsInterval = setInterval(async () => {
          try {
            const metrics = await getRealtimeMetrics()
            const updateData = `data: ${JSON.stringify({
              type: 'metrics_update',
              metrics,
              timestamp: new Date().toISOString()
            })}\n\n`
            controller.enqueue(new TextEncoder().encode(updateData))
          } catch (error) {
            clearInterval(metricsInterval)
            clearInterval(keepAlive)
            removeMetricsConnection(userId)
          }
        }, 30000)
        
        // Keep-alive cada 15 segundos
        const keepAlive = setInterval(() => {
          try {
            const keepAliveData = `data: ${JSON.stringify({
              type: 'keepalive',
              timestamp: new Date().toISOString()
            })}\n\n`
            controller.enqueue(new TextEncoder().encode(keepAliveData))
          } catch (error) {
            clearInterval(metricsInterval)
            clearInterval(keepAlive)
            removeMetricsConnection(userId)
          }
        }, 15000)
      },
      
      cancel() {
        removeMetricsConnection(userId)
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Error in metrics SSE endpoint:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}