'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorMessageProps {
  error: string
  onRetry?: () => void
  retryCount?: number
  isRetrying?: boolean
  showRetryInfo?: boolean
}

export default function ErrorMessage({
  error,
  onRetry,
  retryCount = 0,
  isRetrying = false,
  showRetryInfo = true
}: ErrorMessageProps) {
  return (
    <div style={{
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '16px',
      textAlign: 'center' as const,
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '8px',
        marginBottom: '12px'
      }}>
        <AlertCircle style={{ 
          width: '20px', 
          height: '20px', 
          color: '#dc2626' 
        }} />
        <h3 style={{ 
          margin: 0,
          fontSize: '16px',
          fontWeight: '600',
          color: '#dc2626'
        }}>
          Error al cargar los datos
        </h3>
      </div>
      
      <p style={{
        margin: '0 0 16px 0',
        fontSize: '14px',
        color: '#991b1b'
      }}>
        {error}
      </p>

      {showRetryInfo && retryCount > 0 && (
        <p style={{
          margin: '0 0 16px 0',
          fontSize: '12px',
          color: '#7f1d1d'
        }}>
          Intentos fallidos: {retryCount}
        </p>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            margin: '0 auto',
            padding: '8px 16px',
            backgroundColor: isRetrying ? '#f3f4f6' : '#dc2626',
            color: isRetrying ? '#6b7280' : 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: isRetrying ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          <RefreshCw 
            style={{ 
              width: '14px', 
              height: '14px',
              animation: isRetrying ? 'spin 1s linear infinite' : 'none'
            }} 
          />
          {isRetrying ? 'Reintentando...' : 'Reintentar'}
        </button>
      )}
    </div>
  )
}