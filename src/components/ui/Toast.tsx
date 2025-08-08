'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, X, Info, AlertTriangle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a',
    iconColor: '#16a34a',
    textColor: '#166534'
  },
  error: {
    icon: AlertCircle,
    backgroundColor: '#fef2f2',
    borderColor: '#dc2626',
    iconColor: '#dc2626',
    textColor: '#991b1b'
  },
  warning: {
    icon: AlertTriangle,
    backgroundColor: '#fef3c7',
    borderColor: '#d97706',
    iconColor: '#d97706',
    textColor: '#92400e'
  },
  info: {
    icon: Info,
    backgroundColor: '#dbeafe',
    borderColor: '#2563eb',
    iconColor: '#2563eb',
    textColor: '#1e40af'
  }
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  
  const config = toastConfig[type]
  const Icon = config.icon

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setIsVisible(true), 50)
    
    // Auto-cierre
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(id)
    }, 300)
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        maxWidth: '400px',
        backgroundColor: config.backgroundColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        padding: '16px',
        zIndex: 1000,
        transform: isVisible && !isLeaving ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible && !isLeaving ? 1 : 0,
        transition: 'all 0.3s ease-in-out',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}
    >
      <Icon 
        style={{
          width: '20px',
          height: '20px',
          color: config.iconColor,
          flexShrink: 0,
          marginTop: '2px'
        }}
      />
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: config.textColor,
          margin: '0 0 4px 0'
        }}>
          {title}
        </h4>
        {message && (
          <p style={{
            fontSize: '0.8125rem',
            color: config.textColor,
            margin: 0,
            opacity: 0.9,
            lineHeight: '1.4'
          }}>
            {message}
          </p>
        )}
      </div>
      
      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          color: config.iconColor,
          opacity: 0.7,
          transition: 'opacity 0.2s',
          flexShrink: 0
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
      >
        <X style={{ width: '16px', height: '16px' }} />
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, onClose }: {
  toasts: ToastProps[]
  onClose: (id: string) => void
}) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '20px',
      pointerEvents: 'none'
    }}>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            pointerEvents: 'auto',
            transform: `translateY(${index * 8}px)`,
            transition: 'transform 0.3s ease-in-out'
          }}
        >
          <Toast {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  )
}