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
        setData(result)
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
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">Cargando...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar de Filtros */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
            
            {/* Búsqueda */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Nombre o raza..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Tamaño */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tamaño
              </label>
              <select
                value={filters.tamano}
                onChange={(e) => handleFilterChange('tamano', e.target.value)}
                className="input"
              >
                <option value="">Todos</option>
                <option value="chico">Chico</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
              </select>
            </div>

            {/* Energía */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nivel de Energía
              </label>
              <select
                value={filters.energia}
                onChange={(e) => handleFilterChange('energia', e.target.value)}
                className="input"
              >
                <option value="">Todos</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            {/* Apto para niños */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.aptoNinos}
                  onChange={(e) => handleFilterChange('aptoNinos', e.target.checked)}
                  className="rounded border-slate-300 text-atlixco-500 focus:ring-atlixco-500"
                />
                <span className="ml-2 text-sm text-slate-700">Apto para niños</span>
              </label>
            </div>

            {/* Ordenar */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ordenar por
              </label>
              <select
                value={filters.orderBy}
                onChange={(e) => handleFilterChange('orderBy', e.target.value)}
                className="input"
              >
                <option value="createdAt">Más recientes</option>
                <option value="nombre">Nombre</option>
                <option value="edad">Edad</option>
                <option value="fechaIngreso">Fecha de ingreso</option>
              </select>
            </div>

            {/* Stats */}
            {data && (
              <div className="text-sm text-slate-600">
                Mostrando {data.perritos.length} de {data.pagination.total} perritos
              </div>
            )}
          </div>
        </div>

        {/* Grid de Perritos */}
        <div className="lg:col-span-3">
          {data && data.perritos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {data.perritos.map((perrito) => (
                  <div key={perrito.id} className="card overflow-hidden group">
                    <div className="relative">
                      <Image
                        src={perrito.fotoPrincipal}
                        alt={perrito.nombre}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {perrito.esNuevo && (
                          <span className="bg-atlixco-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Nuevo
                          </span>
                        )}
                        {perrito.destacado && (
                          <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            ⭐ Destacado
                          </span>
                        )}
                      </div>

                      {/* Botón favorito */}
                      <button
                        onClick={() => toggleFavorite(perrito.id)}
                        className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            favorites.includes(perrito.id)
                              ? 'text-red-500 fill-current'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-slate-900">
                          {perrito.nombre}
                        </h3>
                        <span className={`badge-${perrito.estado}`}>
                          {perrito.estado}
                        </span>
                      </div>

                      <p className="text-slate-600 text-sm mb-3">
                        {perrito.raza} • {perrito.sexo} • {perrito.edad}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                          {perrito.tamano}
                        </span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                          Energía {perrito.energia}
                        </span>
                        {perrito.aptoNinos && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            ✓ Niños
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/perritos/${perrito.slug}`}
                        className="block w-full text-center btn-primary text-sm py-2"
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginación */}
              {data.pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(data.pagination.page - 1)}
                    disabled={!data.pagination.hasPrev}
                    className="px-3 py-2 border border-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Anterior
                  </button>
                  
                  <span className="px-4 py-2 text-sm text-slate-600">
                    Página {data.pagination.page} de {data.pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(data.pagination.page + 1)}
                    disabled={!data.pagination.hasNext}
                    className="px-3 py-2 border border-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">
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
                className="mt-4 btn-secondary"
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