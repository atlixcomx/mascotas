'use client'

import { useState, useEffect, useCallback } from 'react'

export interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
  isEmpty: boolean
  success: boolean
}

interface UseFetchOptions {
  retryAttempts?: number
  retryDelay?: number
  autoFetch?: boolean
}

export function useFetch<T>(
  url: string | null,
  options: UseFetchOptions = {}
) {
  const {
    retryAttempts = 3,
    retryDelay = 1000,
    autoFetch = true
  } = options

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: autoFetch && !!url,
    error: null,
    isEmpty: false,
    success: false
  })

  const [retryCount, setRetryCount] = useState(0)

  const fetchData = useCallback(async (fetchUrl: string, attempt = 0): Promise<void> => {
    if (!fetchUrl) return

    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }))

    try {
      const response = await fetch(fetchUrl)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      // Determinar si está vacío basado en el tipo de datos
      const isEmpty = determineIfEmpty(result)
      
      setState({
        data: result,
        loading: false,
        error: null,
        isEmpty,
        success: true
      })
      
      setRetryCount(0)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      
      // Intentar retry si no hemos alcanzado el límite
      if (attempt < retryAttempts) {
        setTimeout(() => {
          setRetryCount(attempt + 1)
          fetchData(fetchUrl, attempt + 1)
        }, retryDelay * Math.pow(2, attempt)) // Exponential backoff
      } else {
        setState({
          data: null,
          loading: false,
          error: errorMessage,
          isEmpty: false,
          success: false
        })
        setRetryCount(0)
      }
    }
  }, [retryAttempts, retryDelay])

  // Auto-fetch cuando cambia la URL
  useEffect(() => {
    if (autoFetch && url) {
      fetchData(url)
    }
  }, [url, autoFetch, fetchData])

  // Función manual para refetch
  const refetch = useCallback(() => {
    if (url) {
      fetchData(url)
    }
  }, [url, fetchData])

  // Función para reintentar
  const retry = useCallback(() => {
    if (url) {
      setRetryCount(0)
      fetchData(url)
    }
  }, [url, fetchData])

  return {
    ...state,
    retryCount,
    refetch,
    retry,
    isRetrying: retryCount > 0
  }
}

// Helper para determinar si los datos están vacíos
function determineIfEmpty(data: any): boolean {
  if (!data) return true
  
  // Si es un array
  if (Array.isArray(data)) {
    return data.length === 0
  }
  
  // Si es un objeto con propiedad de datos (como respuesta paginada)
  if (data.perritos && Array.isArray(data.perritos)) {
    return data.perritos.length === 0
  }
  
  // Si es un objeto con propiedad data
  if (data.data && Array.isArray(data.data)) {
    return data.data.length === 0
  }
  
  // Para objetos simples, considerar vacío si no hay propiedades importantes
  if (typeof data === 'object' && data !== null) {
    const keys = Object.keys(data)
    return keys.length === 0
  }
  
  return false
}