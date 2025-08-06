'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Filter, Heart, Eye, Calendar } from 'lucide-react'

interface Perrito {
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

interface ApiResponse {
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

export default function CatalogoPerritos() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])

  // Estados de filtros
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    tamano: searchParams.get('tamano') || '',
    edad: searchParams.get('edad') || '',
    energia: searchParams.get('energia') || '',
    aptoNinos: searchParams.get('aptoNinos') === 'true',
    orderBy: searchParams.get('orderBy') || 'createdAt',
    page: parseInt(searchParams.get('page') || '1')
  })

  // Cargar favoritos del localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites-perritos')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Función para actualizar URL con filtros
  const updateURL = (newFilters: typeof filters) => {
    const params = new URLSearchParams()
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '' && value !== false && value !== 1) {
        params.set(key, value.toString())
      }
    })

    router.push(`${pathname}?${params.toString()}`)
  }

  // Fetch data cuando cambien los filtros
  useEffect(() => {
    const fetchPerritos = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== '' && value !== false) {
            params.set(key, value.toString())
          }
        })

        const response = await fetch(`/api/perritos?${params.toString()}`)
        const result = await response.json()
        // Asegurar que siempre haya un array de perritos
        setData({
          perritos: result.perritos || [],
          pagination: result.pagination || {
            page: 1,
            limit: 12,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
          },
          filters: result.filters || {}
        })
      } catch (error) {
        console.error('Error fetching perritos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPerritos()
  }, [filters])

  // Manejar cambios en filtros
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 }
    setFilters(newFilters)
    updateURL(newFilters)
  }

  // Manejar favoritos
  const toggleFavorite = (perritoId: string) => {
    const newFavorites = favorites.includes(perritoId)
      ? favorites.filter(id => id !== perritoId)
      : [...favorites, perritoId]
    
    setFavorites(newFavorites)
    localStorage.setItem('favorites-perritos', JSON.stringify(newFavorites))
  }

  // Manejar paginación
  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage }
    setFilters(newFilters)
    updateURL(newFilters)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '32px 20px',
        textAlign: 'center',
        fontSize: '18px',
        color: '#666'
      }}>
        Cargando...
      </div>
    )
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '32px 20px'
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '32px'
      }}>
        
        {/* Sidebar de Filtros */}
        <div>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '24px', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
            position: 'sticky', 
            top: '16px'
          }}>
            
            {/* Búsqueda */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#4a4a4a', 
                marginBottom: '8px'
              }}>
                Buscar
              </label>
              <div style={{ position: 'relative' }}>
                <Search style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  width: '16px', 
                  height: '16px', 
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  placeholder="Nombre o raza..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px',
                    backgroundColor: '#fafafa',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Tamaño */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#4a4a4a', 
                marginBottom: '8px'
              }}>
                Tamaño
              </label>
              <select
                value={filters.tamano}
                onChange={(e) => handleFilterChange('tamano', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  backgroundColor: '#fafafa',
                  outline: 'none'
                }}
              >
                <option value="">Todos</option>
                <option value="chico">Chico</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
              </select>
            </div>

            {/* Energía */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#4a4a4a', 
                marginBottom: '8px'
              }}>
                Nivel de Energía
              </label>
              <select
                value={filters.energia}
                onChange={(e) => handleFilterChange('energia', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  backgroundColor: '#fafafa',
                  outline: 'none'
                }}
              >
                <option value="">Todos</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            {/* Apto para niños */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={filters.aptoNinos}
                  onChange={(e) => handleFilterChange('aptoNinos', e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    marginRight: '8px',
                    accentColor: '#af1731'
                  }}
                />
                <span style={{ fontSize: '14px', color: '#4a4a4a' }}>Apto para niños</span>
              </label>
            </div>

            {/* Ordenar */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#4a4a4a', 
                marginBottom: '8px'
              }}>
                Ordenar por
              </label>
              <select
                value={filters.orderBy}
                onChange={(e) => handleFilterChange('orderBy', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  backgroundColor: '#fafafa',
                  outline: 'none'
                }}
              >
                <option value="createdAt">Más recientes</option>
                <option value="nombre">Nombre</option>
                <option value="edad">Edad</option>
                <option value="fechaIngreso">Fecha de ingreso</option>
              </select>
            </div>

            {/* Stats */}
            {data && data.perritos && (
              <div style={{ 
                fontSize: '14px', 
                color: '#666',
                textAlign: 'center',
                padding: '16px 0'
              }}>
                Mostrando {data.perritos.length} de {data.pagination.total} perritos
              </div>
            )}
          </div>
        </div>

        {/* Grid de Perritos */}
        <div style={{ gridColumn: 'span 2' }}>
          {data && data.perritos && data.perritos.length > 0 ? (
            <>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '24px', 
                marginBottom: '32px'
              }}>
                {data.perritos.map((perrito) => (
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
              {data.pagination.totalPages > 1 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '8px'
                }}>
                  <button
                    onClick={() => handlePageChange(data.pagination.page - 1)}
                    disabled={!data.pagination.hasPrev}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      color: '#4a4a4a',
                      cursor: data.pagination.hasPrev ? 'pointer' : 'not-allowed',
                      opacity: data.pagination.hasPrev ? 1 : 0.5,
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
                    Página {data.pagination.page} de {data.pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(data.pagination.page + 1)}
                    disabled={!data.pagination.hasNext}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      color: '#4a4a4a',
                      cursor: data.pagination.hasNext ? 'pointer' : 'not-allowed',
                      opacity: data.pagination.hasNext ? 1 : 0.5,
                      transition: 'background-color 0.2s'
                    }}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '48px 0'
            }}>
              <p style={{ 
                color: '#666', 
                fontSize: '18px', 
                marginBottom: '16px',
                margin: '0 0 16px 0'
              }}>
                No se encontraron perritos con los filtros seleccionados.
              </p>
              <button
                onClick={() => {
                  setFilters({
                    search: '',
                    tamano: '',
                    edad: '',
                    energia: '',
                    aptoNinos: false,
                    orderBy: 'createdAt',
                    page: 1
                  })
                  router.push('/perritos')
                }}
                style={{
                  border: '2px solid #c79b66',
                  color: '#840f31',
                  backgroundColor: 'transparent',
                  fontWeight: '600',
                  padding: '12px 26px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Limpiar Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}