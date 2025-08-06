'use client'

import { useState } from 'react'

export interface SolicitudData {
  nombre: string
  edad: number
  telefono: string
  email: string
  direccion: string
  ciudad: string
  codigoPostal: string
  tipoVivienda: 'casa' | 'departamento'
  tienePatio: boolean
  experiencia: string
  otrasMascotas?: string
  motivoAdopcion: string
}

export interface SolicitudResponse {
  solicitud: {
    id: string
    codigo: string
  }
}

export function useSolicitudAdopcion() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<SolicitudResponse | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const submitSolicitud = async (
    data: SolicitudData, 
    perritoId: string,
    attempt = 0
  ): Promise<void> => {
    setLoading(true)
    
    if (attempt === 0) {
      setError(null)
      setRetryCount(0)
    }

    try {
      const response = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          perritoId,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar solicitud')
      }

      setSuccess(result)
      setError(null)
      setRetryCount(0)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar la solicitud'
      
      // Auto-retry para errores de red
      if (attempt < 2 && isNetworkError(errorMessage)) {
        setRetryCount(attempt + 1)
        setTimeout(() => {
          submitSolicitud(data, perritoId, attempt + 1)
        }, 1000 * (attempt + 1))
      } else {
        setError(errorMessage)
        setRetryCount(attempt)
      }
    } finally {
      setLoading(false)
    }
  }

  const retry = (data: SolicitudData, perritoId: string) => {
    submitSolicitud(data, perritoId, 0)
  }

  const reset = () => {
    setLoading(false)
    setError(null)
    setSuccess(null)
    setRetryCount(0)
  }

  return {
    loading,
    error,
    success,
    retryCount,
    submitSolicitud,
    retry,
    reset,
    isRetrying: retryCount > 0 && loading
  }
}

function isNetworkError(message: string): boolean {
  const networkErrors = [
    'fetch',
    'network',
    'connection',
    'timeout',
    'refused',
    'unreachable'
  ]
  
  return networkErrors.some(error => 
    message.toLowerCase().includes(error)
  )
}