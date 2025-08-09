'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface Comercio {
  id: string
  codigo: string
  nombre: string
  slug: string
  categoria: string
  logo?: string
  descripcion: string
  direccion: string
  telefono: string
  email?: string
  website?: string
  horarios: string
  servicios: string
  restricciones?: string
  certificado: boolean
  fechaCert?: string
  latitud?: number
  longitud?: number
  qrEscaneos: number
  conversiones: number
  activo: boolean
  createdAt: string
  updatedAt: string
}

export default function ComerciosPage() {
  const [comercios, setComercios] = useState<Comercio[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState('todos')
  const [selectedEstado, setSelectedEstado] = useState('todos')

  useEffect(() => {
    fetchComercios()
  }, [])

  async function fetchComercios() {
    try {
      const response = await fetch('/api/admin/comercios')
      if (response.ok) {
        const data = await response.json()
        setComercios(data)
      }
    } catch (error) {
      console.error('Error fetching comercios:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleEstado(id: string, activo: boolean) {
    try {
      const response = await fetch(`/api/admin/comercios/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !activo })
      })

      if (response.ok) {
        await fetchComercios()
      }
    } catch (error) {
      console.error('Error updating comercio:', error)
    }
  }

  async function deleteComercio(id: string) {
    if (!confirm('¿Estás seguro de eliminar este comercio?')) return

    try {
      const response = await fetch(`/api/admin/comercios/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchComercios()
      }
    } catch (error) {
      console.error('Error deleting comercio:', error)
    }
  }

  const categoriaIcons: { [key: string]: string } = {
    veterinaria: '🏥',
    petshop: '🛍️',
    hotel: '🏨',
    restaurante: '🍽️',
    cafe: '☕',
    parque: '🌳',
    otro: '📍'
  }

  const comerciosFiltrados = comercios.filter(comercio => {
    const matchSearch = comercio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       comercio.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategoria = selectedCategoria === 'todos' || comercio.categoria === selectedCategoria
    const matchEstado = selectedEstado === 'todos' || 
                       (selectedEstado === 'activos' && comercio.activo) ||
                       (selectedEstado === 'inactivos' && !comercio.activo) ||
                       (selectedEstado === 'certificados' && comercio.certificado)
    
    return matchSearch && matchCategoria && matchEstado
  })

  const totalComercios = comercios.length
  const comerciosActivos = comercios.filter(c => c.activo).length
  const comerciosCertificados = comercios.filter(c => c.certificado).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comercios Aliados</h1>
          <p className="text-gray-600 mt-1">Gestiona los comercios pet friendly de Atlixco</p>
        </div>
        <Link
          href="/admin/comercios/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Agregar Comercio
        </Link>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Comercios</p>
              <p className="text-2xl font-bold text-gray-900">{totalComercios}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Comercios Activos</p>
              <p className="text-2xl font-bold text-green-600">{comerciosActivos}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <MapPinIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Certificados</p>
              <p className="text-2xl font-bold text-blue-600">{comerciosCertificados}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckBadgeIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar comercio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todas las categorías</option>
            <option value="veterinaria">Veterinaria</option>
            <option value="petshop">Pet Shop</option>
            <option value="hotel">Hotel Pet Friendly</option>
            <option value="restaurante">Restaurante</option>
            <option value="cafe">Cafetería</option>
            <option value="parque">Parque</option>
            <option value="otro">Otro</option>
          </select>

          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los estados</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
            <option value="certificados">Certificados</option>
          </select>
        </div>
      </div>

      {/* Lista de comercios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comerciosFiltrados.map((comercio) => (
          <div key={comercio.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">
                    {categoriaIcons[comercio.categoria] || '📍'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {comercio.nombre}
                    </h3>
                    <span className="text-sm text-gray-500">{comercio.codigo}</span>
                  </div>
                </div>
                {comercio.certificado && (
                  <CheckBadgeIcon className="h-6 w-6 text-blue-600" />
                )}
              </div>

              {/* Descripción */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {comercio.descripcion}
              </p>

              {/* Detalles */}
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  <span className="truncate">{comercio.direccion}</span>
                </div>
                {comercio.website && (
                  <div className="flex items-center gap-2">
                    <GlobeAltIcon className="h-4 w-4" />
                    <a href={comercio.website} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline truncate">
                      {comercio.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Estadísticas */}
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>QR Escaneos: {comercio.qrEscaneos}</span>
                <span>Conversiones: {comercio.conversiones}</span>
              </div>

              {/* Estado */}
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  comercio.activo 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {comercio.activo ? 'Activo' : 'Inactivo'}
                </span>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/comercios/${comercio.id}`}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => toggleEstado(comercio.id, comercio.activo)}
                    className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded"
                  >
                    {comercio.activo ? '⏸️' : '▶️'}
                  </button>
                  <button
                    onClick={() => deleteComercio(comercio.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {comerciosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron comercios</p>
        </div>
      )}
    </div>
  )
}