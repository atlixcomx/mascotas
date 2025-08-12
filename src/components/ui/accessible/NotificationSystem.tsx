'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'

type NotificationType = 'success' | 'error' | 'warning' | 'info'
type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  persistent?: boolean
  timestamp: Date
}

interface NotificationContextType {
  notifications: Notification[]
  notify: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  dismiss: (id: string) => void
  dismissAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ 
  children,
  position = 'top-right',
  maxNotifications = 5
}: { 
  children: React.ReactNode
  position?: NotificationPosition
  maxNotifications?: number
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const notify = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      duration: notification.duration ?? 5000
    }

    setNotifications(prev => {
      const updated = [newNotification, ...prev]
      // Limitar el número de notificaciones
      if (updated.length > maxNotifications) {
        return updated.slice(0, maxNotifications)
      }
      return updated
    })

    // Auto-dismiss si no es persistente
    if (!notification.persistent && newNotification.duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, newNotification.duration)
    }
  }, [maxNotifications])

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setNotifications([])
  }, [])

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  }

  return (
    <NotificationContext.Provider value={{ notifications, notify, dismiss, dismissAll }}>
      {children}
      {mounted && createPortal(
        <div
          className={`fixed z-50 ${positionClasses[position]} space-y-2 pointer-events-none`}
          aria-live="polite"
          aria-relevant="additions removals"
        >
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDismiss={() => dismiss(notification.id)}
            />
          ))}
        </div>,
        document.body
      )}
    </NotificationContext.Provider>
  )
}

function NotificationItem({ 
  notification, 
  onDismiss 
}: { 
  notification: Notification
  onDismiss: () => void
}) {
  const [isExiting, setIsExiting] = useState(false)

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(onDismiss, 300)
  }

  const typeStyles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: '✓',
      iconBg: 'bg-green-100 text-green-600',
      text: 'text-green-800'
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: '✕',
      iconBg: 'bg-red-100 text-red-600',
      text: 'text-red-800'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: '!',
      iconBg: 'bg-yellow-100 text-yellow-600',
      text: 'text-yellow-800'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: 'i',
      iconBg: 'bg-blue-100 text-blue-600',
      text: 'text-blue-800'
    }
  }

  const style = typeStyles[notification.type]

  return (
    <div
      role="alert"
      className={`
        pointer-events-auto
        max-w-sm w-full
        ${style.bg} ${style.text}
        border rounded-lg shadow-lg
        p-4 pr-12
        transform transition-all duration-300
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`
          flex-shrink-0 w-8 h-8 
          ${style.iconBg} 
          rounded-full flex items-center justify-center
          font-bold text-sm
        `}>
          {style.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">
            {notification.title}
          </h3>
          
          {notification.message && (
            <p className="mt-1 text-sm opacity-90">
              {notification.message}
            </p>
          )}
          
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-puebla-primary rounded"
            >
              {notification.action.label}
            </button>
          )}
        </div>
      </div>
      
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-puebla-primary rounded"
        aria-label="Cerrar notificación"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

// Hook para usar el sistema de notificaciones
export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationProvider')
  }
  return context
}

// Componente de ejemplo con todas las variantes
export function NotificationExamples() {
  const { notify } = useNotifications()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Ejemplos de Notificaciones Accesibles</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => notify({
            type: 'success',
            title: 'Solicitud enviada',
            message: 'Tu solicitud de adopción ha sido enviada exitosamente.',
            action: {
              label: 'Ver solicitud',
              onClick: () => console.log('Ver solicitud')
            }
          })}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Notificación de Éxito
        </button>

        <button
          onClick={() => notify({
            type: 'error',
            title: 'Error al guardar',
            message: 'No se pudo guardar los cambios. Por favor intenta de nuevo.',
            persistent: true
          })}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Notificación de Error
        </button>

        <button
          onClick={() => notify({
            type: 'warning',
            title: 'Sesión por expirar',
            message: 'Tu sesión expirará en 5 minutos.',
            duration: 10000
          })}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Notificación de Advertencia
        </button>

        <button
          onClick={() => notify({
            type: 'info',
            title: 'Nuevo perrito disponible',
            message: 'Max, un cachorro de 3 meses, está buscando hogar.'
          })}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Notificación Informativa
        </button>
      </div>
    </div>
  )
}

// Hook para notificaciones de formulario
export function useFormNotifications() {
  const { notify } = useNotifications()

  const notifySuccess = useCallback((message: string) => {
    notify({
      type: 'success',
      title: 'Éxito',
      message
    })
  }, [notify])

  const notifyError = useCallback((message: string) => {
    notify({
      type: 'error',
      title: 'Error',
      message,
      persistent: true
    })
  }, [notify])

  const notifyValidation = useCallback((errors: string[]) => {
    notify({
      type: 'warning',
      title: 'Errores de validación',
      message: `${errors.length} campo${errors.length > 1 ? 's' : ''} requiere${errors.length > 1 ? 'n' : ''} atención`,
      action: {
        label: 'Ver errores',
        onClick: () => {
          const firstError = document.querySelector('[aria-invalid="true"]')
          if (firstError) {
            (firstError as HTMLElement).focus()
          }
        }
      }
    })
  }, [notify])

  return { notifySuccess, notifyError, notifyValidation }
}