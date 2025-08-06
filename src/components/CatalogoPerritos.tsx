'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Eye } from 'lucide-react'
import { usePerritos } from '../hooks/usePerritos'
import { SearchBar, FilterPanel, FilterOptions } from './search'
import LoadingSpinner from './ui/LoadingSpinner'
import ErrorMessage from './ui/ErrorMessage'
import EmptyState from './ui/EmptyState'

export default function CatalogoPerritos() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])

  // Estados de filtros
  const [filters, setFilters] = useState<FilterOptions>({
    search: searchParams.get('search') || '',
    tamano: searchParams.get('tamano') || '',
    edad: searchParams.get('edad') || '',
    genero: searchParams.get('genero') || '',
    energia: searchParams.get('energia') || '',
    aptoNinos: searchParams.get('aptoNinos') === 'true',
    orderBy: searchParams.get('orderBy') || 'createdAt'
  })

  // Estado de paginación separado
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'))

  // Usar el hook personalizado
  const {
    perritos,
    pagination,
    loading,
    error,
    isEmpty,
    retryCount,
    isRetrying,
    retry
  } = usePerritos({ ...filters, page })

  // Cargar favoritos del localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites-perritos')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Función para actualizar URL con filtros
  const updateURL = useCallback((newFilters: FilterOptions, newPage: number = 1) => {
    const params = new URLSearchParams()
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '' && value !== false) {
        params.set(key, value.toString())
      }
    })

    if (newPage > 1) {
      params.set('page', newPage.toString())
    }

    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname])


  // Manejar cambios en filtros
  const handleFilterChange = useCallback((key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    setPage(1) // Reset página cuando cambian los filtros
    updateURL(newFilters, 1)
  }, [filters, updateURL])

  // Manejar cambios en búsqueda (con debounce ya integrado en SearchBar)
  const handleSearch = useCallback((query: string) => {
    handleFilterChange('search', query)
  }, [handleFilterChange])

  // Limpiar todos los filtros
  const handleClearFilters = useCallback(() => {
    const clearedFilters: FilterOptions = {
      search: '',
      tamano: '',
      edad: '',
      genero: '',
      energia: '',
      aptoNinos: false,
      orderBy: 'createdAt'
    }
    setFilters(clearedFilters)
    setPage(1)
    updateURL(clearedFilters, 1)
  }, [updateURL])

  // Manejar favoritos
  const toggleFavorite = (perritoId: string) => {
    const newFavorites = favorites.includes(perritoId)
      ? favorites.filter(id => id !== perritoId)
      : [...favorites, perritoId]
    
    setFavorites(newFavorites)
    localStorage.setItem('favorites-perritos', JSON.stringify(newFavorites))
  }

  // Manejar paginación
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
    updateURL(filters, newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [filters, updateURL])

  // Estados de carga y error
  if (loading) {
    return (
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '32px 20px',
        textAlign: 'center'
      }}>
        <LoadingSpinner size="lg" text="Cargando perritos..." />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '32px 20px'
      }}>
        <ErrorMessage 
          error={error}
          onRetry={retry}
          retryCount={retryCount}
          isRetrying={isRetrying}
        />
      </div>
    )
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '32px 20px'
    }}>
      {/* Búsqueda y filtros */}
      <div style={{ marginBottom: '32px' }}>
        <SearchBar 
          value={filters.search}
          onSearch={handleSearch}
          placeholder="Buscar perritos por nombre o raza..."
          style={{ marginBottom: '24px' }}
        />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '32px',
        alignItems: 'start'
      }}>
        
        {/* Sidebar de Filtros */}
        <div style={{ position: 'sticky', top: '16px' }}>
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            resultCount={perritos.length}
            totalCount={pagination.total}
            showHeader={true}
          />
        </div>

        {/* Grid de Perritos */}
        <div style={{ gridColumn: 'span 2' }}>
          {!isEmpty ? (
            <>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '24px', 
                marginBottom: '32px'
              }}>
                {perritos.map((perrito) => (
                  <div key={perrito.id} style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}>
                    <div style={{ position: 'relative' }}>
                      <Image
                        src={perrito.fotoPrincipal}
                        alt={perrito.nombre}
                        width={400}
                        height={300}
                        style={{
                          width: '100%',
                          height: '192px',
                          objectFit: 'cover',
                          transition: 'transform 0.3s'
                        }}
                      />
                      
                      {/* Badges */}
                      <div style={{ 
                        position: 'absolute', 
                        top: '8px', 
                        left: '8px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '4px'
                      }}>
                        {perrito.esNuevo && (
                          <span style={{
                            backgroundColor: '#af1731',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            Nuevo
                          </span>
                        )}
                        {perrito.destacado && (
                          <span style={{
                            backgroundColor: '#eab308',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            ⭐ Destacado
                          </span>
                        )}
                      </div>

                      {/* Botón favorito */}
                      <button
                        onClick={() => toggleFavorite(perrito.id)}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          padding: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <Heart
                          style={{
                            width: '16px',
                            height: '16px',
                            color: favorites.includes(perrito.id) ? '#ef4444' : '#666',
                            fill: favorites.includes(perrito.id) ? '#ef4444' : 'none'
                          }}
                        />
                      </button>
                    </div>

                    <div style={{ padding: '16px' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start', 
                        marginBottom: '8px'
                      }}>
                        <h3 style={{ 
                          fontWeight: '600', 
                          fontSize: '18px', 
                          color: '#1a1a1a',
                          margin: 0
                        }}>
                          {perrito.nombre}
                        </h3>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: perrito.estado === 'disponible' ? 'rgba(61, 155, 132, 0.1)' : 
                                           perrito.estado === 'proceso' ? 'rgba(199, 155, 102, 0.1)' : 
                                           'rgba(178, 178, 177, 0.1)',
                          color: perrito.estado === 'disponible' ? '#246257' : 
                                 perrito.estado === 'proceso' ? '#8b6638' : 
                                 '#4a4a4a',
                          border: `1px solid ${perrito.estado === 'disponible' ? 'rgba(61, 155, 132, 0.3)' : 
                                                perrito.estado === 'proceso' ? 'rgba(199, 155, 102, 0.3)' : 
                                                'rgba(178, 178, 177, 0.3)'}`
                        }}>
                          {perrito.estado}
                        </span>
                      </div>

                      <p style={{ 
                        color: '#666', 
                        fontSize: '14px', 
                        marginBottom: '12px',
                        margin: '0 0 12px 0'
                      }}>
                        {perrito.raza} • {perrito.sexo} • {perrito.edad}
                      </p>

                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '4px', 
                        marginBottom: '12px'
                      }}>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: '#f1f1f1',
                          color: '#4a4a4a',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {perrito.tamano}
                        </span>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: '#f1f1f1',
                          color: '#4a4a4a',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          Energía {perrito.energia}
                        </span>
                        {perrito.aptoNinos && (
                          <span style={{
                            padding: '4px 8px',
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            color: '#15803d',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}>
                            ✓ Niños
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/perritos/${perrito.slug}`}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'center',
                          backgroundColor: '#af1731',
                          color: 'white',
                          fontWeight: '600',
                          padding: '12px 16px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          transition: 'background-color 0.2s',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginación */}
              {pagination.totalPages > 1 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '8px'
                }}>
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      color: '#4a4a4a',
                      cursor: pagination.hasPrev ? 'pointer' : 'not-allowed',
                      opacity: pagination.hasPrev ? 1 : 0.5,
                      transition: 'background-color 0.2s'
                    }}
                  >
                    Anterior
                  </button>
                  
                  <span style={{ 
                    padding: '8px 16px', 
                    fontSize: '14px', 
                    color: '#666'
                  }}>
                    Página {pagination.page} de {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      color: '#4a4a4a',
                      cursor: pagination.hasNext ? 'pointer' : 'not-allowed',
                      opacity: pagination.hasNext ? 1 : 0.5,
                      transition: 'background-color 0.2s'
                    }}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="No se encontraron perritos"
              message="No hay perritos que coincidan con los filtros seleccionados. Intenta ajustar tus criterios de búsqueda."
              actionText="Limpiar Filtros"
              onAction={handleClearFilters}
            />
          )}
        </div>
      </div>
    </div>
  )
}