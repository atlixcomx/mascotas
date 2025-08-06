'use client'

import { Search } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  message?: string
  actionText?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export default function EmptyState({
  title = "No se encontraron resultados",
  message = "No hay perritos que coincidan con los filtros seleccionados.",
  actionText = "Limpiar filtros",
  onAction,
  icon
}: EmptyStateProps) {
  const defaultIcon = (
    <Search style={{ 
      width: '48px', 
      height: '48px', 
      color: '#9ca3af' 
    }} />
  )

  return (
    <div style={{
      textAlign: 'center' as const,
      padding: '48px 24px',
      backgroundColor: '#fafafa',
      borderRadius: '12px',
      border: '2px dashed #e5e7eb'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '16px' 
      }}>
        {icon || defaultIcon}
      </div>
      
      <h3 style={{
        margin: '0 0 8px 0',
        fontSize: '18px',
        fontWeight: '600',
        color: '#374151'
      }}>
        {title}
      </h3>
      
      <p style={{
        margin: '0 0 24px 0',
        fontSize: '14px',
        color: '#6b7280',
        lineHeight: '1.5'
      }}>
        {message}
      </p>

      {onAction && actionText && (
        <button
          onClick={onAction}
          style={{
            padding: '12px 24px',
            backgroundColor: 'transparent',
            color: '#af1731',
            border: '2px solid #c79b66',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  )
}