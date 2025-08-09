import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { addConnection, removeConnection } from '../../../../lib/notifications'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return new Response('Unauthorized', { status: 401 })
    }

    const userId = session.user.id

    const stream = new ReadableStream({
      start(controller) {
        // Almacenar la conexión
        addConnection(userId, controller)
        
        // Enviar mensaje inicial
        const data = `data: ${JSON.stringify({
          type: 'connected',
          message: 'Conectado al sistema de notificaciones',
          timestamp: new Date().toISOString()
        })}\n\n`
        
        controller.enqueue(new TextEncoder().encode(data))
        
        // Enviar keep-alive cada 30 segundos
        const keepAlive = setInterval(() => {
          try {
            const keepAliveData = `data: ${JSON.stringify({
              type: 'keepalive',
              timestamp: new Date().toISOString()
            })}\n\n`
            controller.enqueue(new TextEncoder().encode(keepAliveData))
          } catch (error) {
            clearInterval(keepAlive)
            removeConnection(userId)
          }
        }, 30000)
      },
      
      cancel() {
        removeConnection(userId)
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
    console.error('Error in SSE endpoint:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

