'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f8f8',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '48px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#fee',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#af1731" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#0e312d',
          marginBottom: '16px'
        }}>
          ¡Ups! Algo salió mal
        </h2>
        <p style={{
          color: '#666',
          marginBottom: '24px',
          lineHeight: '1.6'
        }}>
          Lo sentimos, hemos encontrado un error inesperado. 
          Nuestro equipo ha sido notificado.
        </p>
        {error.message && (
          <details style={{
            backgroundColor: '#f5f5f5',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            <summary style={{
              cursor: 'pointer',
              color: '#666',
              fontSize: '14px'
            }}>
              Detalles técnicos
            </summary>
            <pre style={{
              marginTop: '8px',
              fontSize: '12px',
              color: '#af1731',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {error.message}
            </pre>
          </details>
        )}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => reset()}
            style={{
              backgroundColor: '#af1731',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            Intentar de nuevo
          </button>
          <a
            href="/"
            style={{
              backgroundColor: '#f5f5f5',
              color: '#666',
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e8e8e8'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </div>
  )
}