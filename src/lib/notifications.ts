// Store para las conexiones SSE
const connections = new Map<string, ReadableStreamDefaultController>()

export interface NotificationData {
  type: string
  title: string
  message: string
  solicitudId?: string
  data?: any
}

export function addConnection(userId: string, controller: ReadableStreamDefaultController) {
  connections.set(userId, controller)
}

export function removeConnection(userId: string) {
  connections.delete(userId)
}

export function sendNotificationToAdmins(notification: NotificationData) {
  const notificationData = `data: ${JSON.stringify({
    ...notification,
    timestamp: new Date().toISOString()
  })}\n\n`

  connections.forEach((controller, userId) => {
    try {
      controller.enqueue(new TextEncoder().encode(notificationData))
    } catch (error) {
      // Conexión cerrada, eliminar de la lista
      connections.delete(userId)
    }
  })
}

export function sendNotificationToUser(userId: string, notification: NotificationData) {
  const controller = connections.get(userId)
  if (controller) {
    try {
      const notificationData = `data: ${JSON.stringify({
        ...notification,
        timestamp: new Date().toISOString()
      })}\n\n`
      
      controller.enqueue(new TextEncoder().encode(notificationData))
    } catch (error) {
      connections.delete(userId)
    }
  }
}