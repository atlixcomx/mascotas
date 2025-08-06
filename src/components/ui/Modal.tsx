'use client'

import { 
  ReactNode, 
  useEffect, 
  useRef, 
  MouseEvent, 
  KeyboardEvent,
  useState 
} from 'react'
import { createPortal } from 'react-dom'
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react'
import Button from './Button'

// Props base del Modal
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  preventScroll?: boolean
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

// Props para modales de confirmación
export interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title?: string
  message: string | ReactNode
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'success' | 'info'
  isLoading?: boolean
}

// Props para modales de alerta
export interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string | ReactNode
  type?: 'success' | 'error' | 'warning' | 'info'
  actionText?: string
}

// Modal base
export default function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  preventScroll = true,
  children,
  className,
  style
}: ModalProps) {
  const [mounted, setMounted] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedElement = useRef<HTMLElement | null>(null)

  // Controlar el montaje del componente
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Manejar el scroll del body
  useEffect(() => {
    if (!mounted) return

    if (isOpen && preventScroll) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, preventScroll, mounted])

  // Manejar focus trap
  useEffect(() => {
    if (!isOpen || !mounted) return

    const modal = modalRef.current
    if (!modal) return

    // Enfocar el modal cuando se abra
    modal.focus()

    const handleTabKey = (e: KeyboardEvent) => {
      const focusableElements = modal.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement?.focus()
        e.preventDefault()
      }

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement?.focus()
        e.preventDefault()
      }
    }

    const handleKeyDown = (e: any) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose()
      }
      if (e.key === 'Tab') {
        handleTabKey(e)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Restaurar el focus anterior
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus()
      }
    }
  }, [isOpen, closeOnEscape, onClose, mounted])

  // Manejar click en overlay
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose()
    }
  }

  // Obtener estilos según el tamaño
  const getSizeStyles = () => {
    const sizes = {
      sm: {
        maxWidth: '400px',
        width: '90vw'
      },
      md: {
        maxWidth: '500px',
        width: '90vw'
      },
      lg: {
        maxWidth: '800px',
        width: '90vw'
      },
      xl: {
        maxWidth: '1200px',
        width: '95vw'
      },
      full: {
        width: '100vw',
        height: '100vh',
        maxWidth: 'none',
        borderRadius: '0'
      }
    }

    return sizes[size]
  }

  if (!mounted || !isOpen) return null

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: size === 'full' ? 'stretch' : 'center',
        justifyContent: 'center',
        padding: size === 'full' ? '0' : '16px',
        zIndex: 1000,
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={className}
        style={{
          backgroundColor: 'white',
          borderRadius: size === 'full' ? '0' : '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          outline: 'none',
          animation: 'slideUp 0.3s ease-out',
          maxHeight: size === 'full' ? '100vh' : '90vh',
          overflow: 'auto',
          ...getSizeStyles(),
          ...style
        }}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 24px 0 24px',
            borderBottom: title ? '1px solid #e5e7eb' : 'none',
            paddingBottom: title ? '16px' : '0',
            marginBottom: title ? '24px' : '0'
          }}>
            {title && (
              <h2
                id="modal-title"
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0
                }}
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  color: '#6b7280',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 'auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
                  e.currentTarget.style.color = '#374151'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#6b7280'
                }}
                aria-label="Cerrar modal"
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div style={{
          padding: (title || showCloseButton) ? '0 24px 24px 24px' : '24px'
        }}>
          {children}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

// Modal de confirmación
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false
}: ConfirmModalProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error('Error en confirmación:', error)
    }
  }

  const getVariantStyles = () => {
    const variants = {
      danger: {
        icon: <AlertTriangle style={{ width: '48px', height: '48px', color: '#ef4444' }} />,
        iconBg: 'rgba(239, 68, 68, 0.1)',
        buttonVariant: 'danger' as const
      },
      warning: {
        icon: <AlertCircle style={{ width: '48px', height: '48px', color: '#f59e0b' }} />,
        iconBg: 'rgba(245, 158, 11, 0.1)',
        buttonVariant: 'primary' as const
      },
      success: {
        icon: <CheckCircle style={{ width: '48px', height: '48px', color: '#10b981' }} />,
        iconBg: 'rgba(16, 185, 129, 0.1)',
        buttonVariant: 'primary' as const
      },
      info: {
        icon: <Info style={{ width: '48px', height: '48px', color: '#3b82f6' }} />,
        iconBg: 'rgba(59, 130, 246, 0.1)',
        buttonVariant: 'primary' as const
      }
    }

    return variants[variant]
  }

  const variantStyles = getVariantStyles()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      closeOnOverlayClick={!isLoading}
      closeOnEscape={!isLoading}
      showCloseButton={!isLoading}
    >
      <div style={{
        textAlign: 'center',
        padding: '20px 0'
      }}>
        {/* Icono */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: variantStyles.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto'
        }}>
          {variantStyles.icon}
        </div>

        {/* Mensaje */}
        <div style={{
          marginBottom: '32px',
          fontSize: '16px',
          lineHeight: '1.5',
          color: '#374151'
        }}>
          {typeof message === 'string' ? <p style={{ margin: 0 }}>{message}</p> : message}
        </div>

        {/* Botones */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center'
        }}>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            style={{ minWidth: '100px' }}
          >
            {cancelText}
          </Button>
          <Button
            variant={variantStyles.buttonVariant}
            onClick={handleConfirm}
            isLoading={isLoading}
            style={{ minWidth: '100px' }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// Modal de alerta
export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  actionText = 'Entendido'
}: AlertModalProps) {
  const getTypeStyles = () => {
    const types = {
      success: {
        icon: <CheckCircle style={{ width: '48px', height: '48px', color: '#10b981' }} />,
        iconBg: 'rgba(16, 185, 129, 0.1)',
        defaultTitle: 'Éxito'
      },
      error: {
        icon: <AlertCircle style={{ width: '48px', height: '48px', color: '#ef4444' }} />,
        iconBg: 'rgba(239, 68, 68, 0.1)',
        defaultTitle: 'Error'
      },
      warning: {
        icon: <AlertTriangle style={{ width: '48px', height: '48px', color: '#f59e0b' }} />,
        iconBg: 'rgba(245, 158, 11, 0.1)',
        defaultTitle: 'Advertencia'
      },
      info: {
        icon: <Info style={{ width: '48px', height: '48px', color: '#3b82f6' }} />,
        iconBg: 'rgba(59, 130, 246, 0.1)',
        defaultTitle: 'Información'
      }
    }

    return types[type]
  }

  const typeStyles = getTypeStyles()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || typeStyles.defaultTitle}
      size="sm"
    >
      <div style={{
        textAlign: 'center',
        padding: '20px 0'
      }}>
        {/* Icono */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: typeStyles.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto'
        }}>
          {typeStyles.icon}
        </div>

        {/* Mensaje */}
        <div style={{
          marginBottom: '32px',
          fontSize: '16px',
          lineHeight: '1.5',
          color: '#374151'
        }}>
          {typeof message === 'string' ? <p style={{ margin: 0 }}>{message}</p> : message}
        </div>

        {/* Botón */}
        <Button
          variant="primary"
          onClick={onClose}
          style={{ minWidth: '120px' }}
        >
          {actionText}
        </Button>
      </div>
    </Modal>
  )
}

// Añadir estilos de animación
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { 
        opacity: 0; 
        transform: translateY(20px) scale(0.95); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0) scale(1); 
      }
    }
  `
  if (!document.head.querySelector('style[data-modal-animations]')) {
    styleSheet.setAttribute('data-modal-animations', 'true')
    document.head.appendChild(styleSheet)
  }
}