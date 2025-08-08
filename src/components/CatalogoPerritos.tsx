'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { usePerritos } from '../hooks/usePerritos'
import { SearchBar, FilterPanel, FilterOptions } from './search'
import LoadingSpinner from './ui/LoadingSpinner'
import ErrorMessage from './ui/ErrorMessage'
import EmptyState from './ui/EmptyState'
import { 
  HeartIcon, LocationIcon, DogIcon, SearchIcon,
  CheckCircleIcon, ArrowRightIcon, ClockIcon
} from './icons/Icons'

// URL de imagen estándar para todos los perritos
const defaultDogImage = 'https://somosmaka.com/cdn/shop/articles/perro_mestizo.jpg?v=1697855331'

export default function CatalogoPerritos() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

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
        padding: '48px 20px',
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
        padding: '48px 20px'
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
      padding: '48px 20px'
    }}>
      {/* Búsqueda con filtros integrados */}
      <div style={{ 
        marginBottom: '48px',
        background: 'white',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <SearchIcon size={24} color="#6b3838" />
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#0e312d',
            margin: 0
          }}>Buscar tu compañero ideal</h2>
        </div>
        
        <SearchBar 
          value={filters.search}
          onSearch={handleSearch}
          placeholder="Buscar por nombre, raza o características..."
          style={{ marginBottom: '20px' }}
        />
        
        {/* Filtros rápidos */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {['Cachorro', 'Pequeño', 'Mediano', 'Grande', 'Tranquilo', 'Apto niños'].map((filter) => (
            <button
              key={filter}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '2px solid #e9ecef',
                background: 'white',
                color: '#4a4a4a',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#6b3838'
                e.currentTarget.style.color = '#6b3838'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e9ecef'
                e.currentTarget.style.color = '#4a4a4a'
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Perritos */}
      {!isEmpty ? (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '28px',
            marginBottom: '48px'
          }}>
            {perritos.map((perrito, index) => (
              <div 
                key={perrito.id} 
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: hoveredCard === perrito.id ? '0 12px 40px rgba(0,0,0,0.1)' : '0 4px 20px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === perrito.id ? 'translateY(-8px)' : 'translateY(0)',
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setHoveredCard(perrito.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{
                  position: 'relative',
                  height: '280px',
                  overflow: 'hidden'
                }}>
                  <Image
                    src={perrito.fotoPrincipal || defaultDogImage}
                    alt={perrito.nombre}
                    width={400}
                    height={280}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                      transform: hoveredCard === perrito.id ? 'scale(1.1)' : 'scale(1)'
                    }}
                  />
                  
                  {/* Gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '120px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)'
                  }} />
                  
                  {/* Badge estado */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px'
                  }}>
                    {perrito.estado === 'disponible' && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        background: 'rgba(255,255,255,0.95)',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#15803d',
                        backdropFilter: 'blur(8px)'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#22c55e'
                        }} />
                        Disponible
                      </span>
                    )}
                  </div>

                  {/* Botón favorito */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(perrito.id)
                    }}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.95)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <HeartIcon 
                      size={20} 
                      color={favorites.includes(perrito.id) ? '#ef4444' : '#666'}
                    />
                  </button>

                  {/* Info básica en overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    color: 'white'
                  }}>
                    <h3 style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      marginBottom: '4px'
                    }}>{perrito.nombre}</h3>
                    <p style={{
                      fontSize: '14px',
                      opacity: 0.9
                    }}>{perrito.raza} • {perrito.edad}</p>
                  </div>
                </div>

                <div style={{ padding: '24px' }}>
                  {/* Características */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '20px'
                  }}>
                    <span style={{
                      padding: '6px 12px',
                      background: '#f3f4f6',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#4a4a4a'
                    }}>
                      {perrito.tamano}
                    </span>
                    <span style={{
                      padding: '6px 12px',
                      background: '#f3f4f6',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#4a4a4a'
                    }}>
                      {perrito.sexo}
                    </span>
                    {perrito.aptoNinos && (
                      <span style={{
                        padding: '6px 12px',
                        background: '#dcfce7',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#15803d',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <CheckCircleIcon size={14} color="#15803d" />
                        Apto niños
                      </span>
                    )}
                  </div>

                  {/* Descripción corta */}
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: '1.5',
                    marginBottom: '20px',
                    height: '42px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {perrito.descripcion || 'Un compañero leal esperando encontrar su hogar perfecto.'}
                  </p>

                  {/* CTA */}
                  <Link
                    href={`/catalogo/${perrito.slug}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '14px',
                      background: '#6b3838',
                      color: 'white',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      fontSize: '15px',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#7d4040'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#6b3838'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    Conocer más
                    <ArrowRightIcon size={16} color="white" />
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
              gap: '16px'
            }}>
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                style={{
                  padding: '12px 24px',
                  background: pagination.hasPrev ? 'white' : '#f3f4f6',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  color: pagination.hasPrev ? '#4a4a4a' : '#9ca3af',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: pagination.hasPrev ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
              >
                ← Anterior
              </button>
              
              <span style={{ 
                padding: '12px 24px',
                background: '#f3f4f6',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#0e312d'
              }}>
                Página {pagination.page} de {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                style={{
                  padding: '12px 24px',
                  background: pagination.hasNext ? 'white' : '#f3f4f6',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  color: pagination.hasNext ? '#4a4a4a' : '#9ca3af',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: pagination.hasNext ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
              >
                Siguiente →
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

      {/* Estilos responsivos */}
      <style jsx>{`
        @media (max-width: 768px) {
          .catalog-container {
            padding: 24px 16px !important;
          }
        }
        
        @media (max-width: 1024px) {
          div[style*="gridColumn: 'span 2'"] {
            grid-column: span 1 !important;
          }
        }
      `}</style>
      
    </div>
  )
}