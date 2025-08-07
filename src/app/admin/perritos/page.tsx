'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter } from 'lucide-react'

interface Perrito {
  id: string
  nombre: string
  slug: string
  fotoPrincipal: string
  raza: string
  edad: string
  sexo: string
  tamano: string
  energia: string
  estado: string
  destacado: boolean
  fechaIngreso: string
  vistas: number
  fotos: string[]
  caracter: string[]
}

function PerritoCard({ perrito }: { perrito: Perrito }) {
  const estadoColors = {
    disponible: 'bg-green-100 text-green-800',
    proceso: 'bg-yellow-100 text-yellow-800',
    adoptado: 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={perrito.fotoPrincipal}
          alt={perrito.nombre}
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-slate-900">{perrito.nombre}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            estadoColors[perrito.estado as keyof typeof estadoColors]
          }`}>
            {perrito.estado}
          </span>
        </div>
        
        <p className="text-slate-600 text-sm mb-3">
          {perrito.raza} • {perrito.sexo} • {perrito.edad}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
            {perrito.tamano}
          </span>
          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
            Energía {perrito.energia}
          </span>
          {perrito.destacado && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
              ⭐ Destacado
            </span>
          )}
        </div>
        
        <div className="text-xs text-slate-500 mb-3">
          Ingresó: {new Date(perrito.fechaIngreso).toLocaleDateString()}
          <br />
          Vistas: {perrito.vistas}
        </div>
        
        <div className="flex space-x-2">
          <Link
            href={`/admin/perritos/${perrito.id}`}
            className="flex-1 bg-puebla-700 hover:bg-puebla-800 text-white text-center px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            Editar
          </Link>
          <Link
            href={`/perritos/${perrito.slug}`}
            target="_blank"
            className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 text-center px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            Ver
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AdminPerritos() {
  const [perritos, setPerritos] = useState<Perrito[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('')
  const [tamanoFilter, setTamanoFilter] = useState('')

  useEffect(() => {
    fetchPerritos()
  }, [])

  async function fetchPerritos() {
    try {
      const response = await fetch('/api/admin/perritos')
      if (response.ok) {
        const data = await response.json()
        setPerritos(data.perritos || [])
      }
    } catch (error) {
      console.error('Error fetching perritos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar perritos
  const filteredPerritos = perritos.filter(perrito => {
    const matchesSearch = perrito.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         perrito.raza.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = !estadoFilter || perrito.estado === estadoFilter
    const matchesTamano = !tamanoFilter || perrito.tamano === tamanoFilter
    
    return matchesSearch && matchesEstado && matchesTamano
  })

  const stats = {
    total: perritos.length,
    disponibles: perritos.filter(p => p.estado === 'disponible').length,
    enProceso: perritos.filter(p => p.estado === 'proceso').length,
    adoptados: perritos.filter(p => p.estado === 'adoptado').length
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border">
                <div className="h-48 bg-slate-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestión de Perritos</h1>
            <p className="text-slate-600 mt-1">
              Administra el catálogo de perritos disponibles para adopción
            </p>
          </div>
          <Link
            href="/admin/perritos/nuevo"
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Perrito
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, raza..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select 
            className="input min-w-[120px]"
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="disponible">Disponible</option>
            <option value="proceso">En Proceso</option>
            <option value="adoptado">Adoptado</option>
          </select>
          <select 
            className="input min-w-[120px]"
            value={tamanoFilter}
            onChange={(e) => setTamanoFilter(e.target.value)}
          >
            <option value="">Todos los tamaños</option>
            <option value="chico">Chico</option>
            <option value="mediano">Mediano</option>
            <option value="grande">Grande</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
          <div className="text-sm text-slate-600">Total</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.disponibles}</div>
          <div className="text-sm text-slate-600">Disponibles</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.enProceso}</div>
          <div className="text-sm text-slate-600">En Proceso</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.adoptados}</div>
          <div className="text-sm text-slate-600">Adoptados</div>
        </div>
      </div>

      {/* Grid de Perritos */}
      {filteredPerritos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPerritos.map((perrito) => (
            <PerritoCard key={perrito.id} perrito={perrito} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl">🐕</span>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {perritos.length === 0 ? 'No hay perritos registrados' : 'No se encontraron perritos'}
          </h3>
          <p className="text-slate-600 mb-6">
            {perritos.length === 0 ? 'Comienza agregando el primer perrito al sistema' : 'Intenta con otros filtros'}
          </p>
          {perritos.length === 0 && (
            <Link
              href="/admin/perritos/nuevo"
              className="btn-primary"
            >
              Agregar Primer Perrito
            </Link>
          )}
        </div>
      )}
    </div>
  )
}