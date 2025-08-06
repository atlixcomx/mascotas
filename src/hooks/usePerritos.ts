'use client'

import { useMemo } from 'react'
import { useFetch } from './useFetch'

export interface Perrito {
  id: string
  nombre: string
  slug: string
  fotoPrincipal: string
  edad: string
  tamano: string
  raza: string
  sexo: string
  energia: string
  aptoNinos: boolean
  aptoPerros: boolean
  aptoGatos: boolean
  destacado: boolean
  fechaIngreso: string
  estado: string
  caracter: string[]
  esNuevo: boolean
}

export interface PerritosApiResponse {
  perritos: Perrito[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  filters: any
}

export interface PerritoFilters {
  search?: string
  tamano?: string
  edad?: string
  energia?: string
  aptoNinos?: boolean
  orderBy?: string
  page?: number
  limit?: number
}

export function usePerritos(filters: PerritoFilters = {}) {
  // Construir URL con parámetros
  const url = useMemo(() => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== false && value !== 1) {
        params.set(key, value.toString())
      }
    })

    return `/api/perritos?${params.toString()}`
  }, [filters])

  const {
    data,
    loading,
    error,
    isEmpty,
    success,
    retryCount,
    refetch,
    retry,
    isRetrying
  } = useFetch<PerritosApiResponse>(url, {
    retryAttempts: 3,
    retryDelay: 1000
  })

  // Datos procesados
  const perritos = data?.perritos || []
  const pagination = data?.pagination || {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  }
  const appliedFilters = data?.filters || {}

  return {
    perritos,
    pagination,
    appliedFilters,
    loading,
    error,
    isEmpty,
    success,
    retryCount,
    isRetrying,
    refetch,
    retry
  }
}

export function usePerrito(slug: string | null) {
  const url = slug ? `/api/perritos/${slug}` : null
  
  const {
    data: perrito,
    loading,
    error,
    isEmpty,
    success,
    retryCount,
    refetch,
    retry,
    isRetrying
  } = useFetch<Perrito & { 
    fotos: string[]
    historia: string
    similares: Perrito[]
    vistas: number
    peso?: number
    procedencia?: string
    vacunas: boolean
    esterilizado: boolean
    desparasitado: boolean
    saludNotas?: string
  }>(url, {
    retryAttempts: 3,
    retryDelay: 1000
  })

  return {
    perrito,
    loading,
    error,
    isEmpty,
    success,
    retryCount,
    isRetrying,
    refetch,
    retry,
    notFound: !loading && !perrito && !error
  }
}