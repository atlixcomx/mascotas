'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, CheckBadgeIcon } from '@heroicons/react/24/outline'

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

export default function EditarComercioPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [comercio, setComercio] = useState<Comercio | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'otro',
    logo: '',
    descripcion: '',
    direccion: '',
    telefono: '',
    email: '',
    website: '',
    horarios: '',
    servicios: '',
    restricciones: '',
    latitud: '',
    longitud: '',
    certificado: false,
    fechaCert: '',
    activo: true
  })

  useEffect(() => {
    fetchComercio()
  }, [params.id])

  async function fetchComercio() {
    try {
      const response = await fetch(`/api/admin/comercios/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setComercio(data)
        setFormData({
          nombre: data.nombre,
          categoria: data.categoria,
          logo: data.logo || '',
          descripcion: data.descripcion,
          direccion: data.direccion,
          telefono: data.telefono,
          email: data.email || '',
          website: data.website || '',
          horarios: data.horarios,
          servicios: data.servicios,
          restricciones: data.restricciones || '',
          latitud: data.latitud?.toString() || '',
          longitud: data.longitud?.toString() || '',
          certificado: data.certificado,
          fechaCert: data.fechaCert ? new Date(data.fechaCert).toISOString().split('T')[0] : '',
          activo: data.activo
        })
      } else {
        router.push('/admin/comercios')
      }
    } catch (error) {
      console.error('Error fetching comercio:', error)
      router.push('/admin/comercios')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/comercios/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/admin/comercios')
      } else {
        const error = await response.json()
        alert(error.error || 'Error al actualizar comercio')
      }
    } catch (error) {
      console.error('Error updating comercio:', error)
      alert('Error al actualizar comercio')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!comercio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Comercio no encontrado</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/admin/comercios"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Regresar a Comercios
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Comercio</h1>
            <p className="text-gray-600 mt-1">Actualiza la información del comercio</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Código: {comercio.codigo}</span>
            {comercio.certificado && (
              <div className="flex items-center gap-1 text-blue-600">
                <CheckBadgeIcon className="h-5 w-5" />
                <span className="text-sm">Certificado</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Información Básica</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Comercio *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                required
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                id="categoria"
                name="categoria"
                required
                value={formData.categoria}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="veterinaria">🏥 Veterinaria</option>
                <option value="petshop">🛍️ Pet Shop</option>
                <option value="hotel">🏨 Hotel Pet Friendly</option>
                <option value="restaurante">🍽️ Restaurante</option>
                <option value="cafe">☕ Cafetería</option>
                <option value="parque">🌳 Parque</option>
                <option value="otro">📍 Otro</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                required
                rows={3}
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe brevemente el comercio y sus servicios pet friendly..."
              />
            </div>

            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                URL del Logo
              </label>
              <input
                type="url"
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://ejemplo.com/logo.jpg"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Comercio Activo</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Información de Contacto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                Dirección *
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                required
                value={formData.direccion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Calle, número, colonia, Atlixco, Puebla"
              />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                required
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="244 123 4567"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="contacto@ejemplo.com"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Sitio Web
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://www.ejemplo.com"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Detalles del Servicio</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="horarios" className="block text-sm font-medium text-gray-700 mb-1">
                Horarios *
              </label>
              <textarea
                id="horarios"
                name="horarios"
                required
                rows={2}
                value={formData.horarios}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Lunes a Viernes: 9:00 - 18:00&#10;Sábados: 9:00 - 14:00&#10;Domingos: Cerrado"
              />
            </div>

            <div>
              <label htmlFor="servicios" className="block text-sm font-medium text-gray-700 mb-1">
                Servicios Pet Friendly *
              </label>
              <textarea
                id="servicios"
                name="servicios"
                required
                rows={3}
                value={formData.servicios}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="- Se permiten mascotas en todas las áreas&#10;- Bebederos disponibles&#10;- Área especial para mascotas&#10;- Personal capacitado"
              />
            </div>

            <div>
              <label htmlFor="restricciones" className="block text-sm font-medium text-gray-700 mb-1">
                Restricciones
              </label>
              <textarea
                id="restricciones"
                name="restricciones"
                rows={2}
                value={formData.restricciones}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="- Solo perros pequeños y medianos&#10;- Mascotas deben usar correa&#10;- Máximo 2 mascotas por persona"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Certificación y Ubicación</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="certificado"
                  checked={formData.certificado}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Certificado como Pet Friendly</span>
              </label>
              
              {formData.certificado && (
                <div className="mb-4">
                  <label htmlFor="fechaCert" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Certificación
                  </label>
                  <input
                    type="date"
                    id="fechaCert"
                    name="fechaCert"
                    value={formData.fechaCert}
                    onChange={handleChange}
                    className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="latitud" className="block text-sm font-medium text-gray-700 mb-1">
                Latitud
              </label>
              <input
                type="number"
                id="latitud"
                name="latitud"
                step="any"
                value={formData.latitud}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="18.9124"
              />
            </div>

            <div>
              <label htmlFor="longitud" className="block text-sm font-medium text-gray-700 mb-1">
                Longitud
              </label>
              <input
                type="number"
                id="longitud"
                name="longitud"
                step="any"
                value={formData.longitud}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="-98.4316"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Estadísticas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded">
              <p className="text-3xl font-bold text-gray-900">{comercio.qrEscaneos}</p>
              <p className="text-sm text-gray-600">QR Escaneos</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <p className="text-3xl font-bold text-gray-900">{comercio.conversiones}</p>
              <p className="text-sm text-gray-600">Conversiones</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <p className="text-3xl font-bold text-gray-900">
                {comercio.conversiones > 0 
                  ? `${((comercio.conversiones / comercio.qrEscaneos) * 100).toFixed(1)}%`
                  : '0%'
                }
              </p>
              <p className="text-sm text-gray-600">Tasa de Conversión</p>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/comercios"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}