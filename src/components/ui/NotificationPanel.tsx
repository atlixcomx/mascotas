'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck, 
  Trash2,
  FileText,
  MessageSquare,
  UserCheck,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react'
import { useNotifications, Notification } from '../../hooks/useNotifications'

const notificationIcons: { [key: string]: any } = {
  'solicitud_nueva': FileText,
  'estado_cambiado': UserCheck,
  'comentario_nuevo': MessageSquare,
  'recordatorio': AlertCircle,
  'sistema': AlertCircle
}

const notificationColors: { [key: string]: string } = {
  'solicitud_nueva': '#3b82f6',
  'estado_cambiado': '#10b981',
  'comentario_nuevo': '#8b5cf6',
  'recordatorio': '#f59e0b',
  'sistema': '#64748b'
}

export function NotificationPanel() {
  const { 
    notifications, 
    unreadCount, 
    isConnected,
    markAsRead, 
    markAllAsRead, 
    clearNotifications 
  } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const then = new Date(timestamp)
    const diffInMs = now.getTime() - then.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)
    
    if (diffInMinutes < 1) return 'Ahora'
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInHours < 24) return `${diffInHours}h`
    return `${diffInDays}d`
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Botón de notificaciones */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          padding: '8px',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <Bell style={{ 
          width: '20px', 
          height: '20px', 
          color: unreadCount > 0 ? '#af1731' : '#64748b' 
        }} />
        
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '16px',
            height: '16px',
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            fontSize: '0.625rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel de notificaciones */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 40
            }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            width: '400px',
            maxHeight: '500px',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            zIndex: 50,
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: 0
                }}>
                  Notificaciones
                </h3>
                {isConnected ? (
                  <Wifi style={{ width: '16px', height: '16px', color: '#10b981' }} />
                ) : (
                  <WifiOff style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '4px' }}>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      padding: '4px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      color: '#64748b'
                    }}
                    title="Marcar todas como leídas"
                  >
                    <CheckCheck style={{ width: '16px', height: '16px' }} />
                  </button>
                )}
                <button
                  onClick={clearNotifications}
                  style={{
                    padding: '4px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                  title="Limpiar todas"
                >
                  <Trash2 style={{ width: '16px', height: '16px' }} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '4px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  <X style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>

            {/* Lista de notificaciones */}
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {notifications.length === 0 ? (
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#64748b'
                }}>
                  <Bell style={{ 
                    width: '32px', 
                    height: '32px', 
                    margin: '0 auto 12px',
                    opacity: 0.5 
                  }} />
                  <p style={{ fontSize: '0.875rem', margin: 0 }}>
                    No hay notificaciones
                  </p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = notificationIcons[notification.type] || AlertCircle
                  const color = notificationColors[notification.type] || '#64748b'
                  
                  return (
                    <div
                      key={notification.id}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: notification.read ? 'transparent' : '#fafbfc',
                        position: 'relative',
                        cursor: notification.solicitudId ? 'pointer' : 'default'
                      }}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id)
                        }
                        if (notification.solicitudId) {
                          window.location.href = `/admin/solicitudes/${notification.solicitudId}`
                          setIsOpen(false)
                        }
                      }}
                    >
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: `${color}15`,
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Icon style={{ 
                            width: '16px', 
                            height: '16px', 
                            color: color 
                          }} />
                        </div>
                        
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '4px'
                          }}>
                            <h4 style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: '#0f172a',
                              margin: 0
                            }}>
                              {notification.title}
                            </h4>
                            <span style={{
                              fontSize: '0.75rem',
                              color: '#64748b'
                            }}>
                              {getTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                          <p style={{
                            fontSize: '0.8125rem',
                            color: '#64748b',
                            margin: 0,
                            lineHeight: '1.4'
                          }}>
                            {notification.message}
                          </p>
                        </div>
                        
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification.id)
                            }}
                            style={{
                              padding: '4px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#10b981',
                              flexShrink: 0
                            }}
                            title="Marcar como leída"
                          >
                            <Check style={{ width: '14px', height: '14px' }} />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}