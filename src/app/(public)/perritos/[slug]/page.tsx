'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Heart, MapPin, User, Shield, Zap, Eye } from 'lucide-react'

interface PageProps {
  params: { slug: string }
}

interface Perrito {
  id: string
  nombre: string
  slug: string
  fotoPrincipal: string
  fotos: string[]
  raza: string
  edad: string
  sexo: string
  tamano: string
  energia: string
  peso: number | null
  caracter: string[]
  historia: string
  estado: string
  destacado: boolean
  esNuevo: boolean
  vistas: number
  fechaIngreso: string
  procedencia: string | null
  aptoNinos: boolean
  aptoPerros: boolean
  aptoGatos: boolean
  vacunas: boolean
  esterilizado: boolean
  desparasitado: boolean
  saludNotas: string | null
  similares: any[]
}

export default function PerritoDetailPage({ params }: PageProps) {
  const [perrito, setPerrito] = useState<Perrito | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPerrito() {
      try {
        const response = await fetch(`/api/perritos/${params.slug}`)
        
        if (!response.ok) {
          setPerrito(null)
        } else {
          const data = await response.json()
          setPerrito(data)
        }
      } catch (error) {
        console.error('Error fetching perrito:', error)
        setPerrito(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPerrito()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="animate-pulse">
          <div className="bg-white border-b p-4">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-slate-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 bg-slate-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!perrito) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm">
            <Link href="/" className="text-atlixco-600 hover:text-atlixco-700">Inicio</Link>
            <span className="mx-2 text-slate-400">/</span>
            <Link href="/perritos" className="text-atlixco-600 hover:text-atlixco-700">Perritos</Link>
            <span className="mx-2 text-slate-400">/</span>
            <span className="text-slate-600">{perrito.nombre}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Galería de fotos */}
          <div>
            <div className="relative mb-4">
              <Image
                src={perrito.fotoPrincipal}
                alt={perrito.nombre}
                width={600}
                height={400}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                priority
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {perrito.esNuevo && (
                  <span className="bg-atlixco-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ✨ Nuevo
                  </span>
                )}
                {perrito.destacado && (
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ⭐ Destacado
                  </span>
                )}
                <span className={`badge-${perrito.estado}`}>
                  {perrito.estado}
                </span>
              </div>

              {/* Stats en imagen */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4" />
                  {perrito.vistas} vistas
                </div>
              </div>
            </div>

            {/* Thumbnails de fotos adicionales */}
            {perrito.fotos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {perrito.fotos.slice(1, 5).map((foto: string, index: number) => (
                  <Image
                    key={index}
                    src={foto}
                    alt={`${perrito.nombre} foto ${index + 2}`}
                    width={150}
                    height={100}
                    className="w-full h-20 object-cover rounded-md cursor-pointer hover:opacity-80"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Información del perrito */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{perrito.nombre}</h1>
              <p className="text-lg text-slate-600 mb-4">{perrito.raza}</p>

              {/* Información básica */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-atlixco-500" />
                  <div>
                    <div className="text-sm text-slate-500">Edad</div>
                    <div className="font-medium">{perrito.edad}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-atlixco-500" />
                  <div>
                    <div className="text-sm text-slate-500">Sexo</div>
                    <div className="font-medium">{perrito.sexo}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-atlixco-500" />
                  <div>
                    <div className="text-sm text-slate-500">Tamaño</div>
                    <div className="font-medium capitalize">{perrito.tamano}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-atlixco-500" />
                  <div>
                    <div className="text-sm text-slate-500">Energía</div>
                    <div className="font-medium capitalize">{perrito.energia}</div>
                  </div>
                </div>
              </div>

              {/* Peso */}
              {perrito.peso && (
                <div className="mb-6">
                  <div className="text-sm text-slate-500">Peso aproximado</div>
                  <div className="font-medium">{perrito.peso} kg</div>
                </div>
              )}

              {/* Características */}
              <div className="mb-6">
                <h3 className="font-medium text-slate-900 mb-2">Características</h3>
                <div className="flex flex-wrap gap-2">
                  {perrito.caracter.map((caracteristica: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-atlixco-100 text-atlixco-700 rounded-full text-sm"
                    >
                      {caracteristica}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compatibilidad */}
              <div className="mb-6">
                <h3 className="font-medium text-slate-900 mb-2">Compatibilidad</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className={`p-2 rounded text-center ${perrito.aptoNinos ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {perrito.aptoNinos ? '✓' : '✗'} Niños
                  </div>
                  <div className={`p-2 rounded text-center ${perrito.aptoPerros ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {perrito.aptoPerros ? '✓' : '✗'} Perros
                  </div>
                  <div className={`p-2 rounded text-center ${perrito.aptoGatos ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {perrito.aptoGatos ? '✓' : '✗'} Gatos
                  </div>
                </div>
              </div>

              {/* CTA Principal */}
              <div className="space-y-3">
                {perrito.estado === 'disponible' ? (
                  <Link
                    href={`/solicitud/${perrito.id}`}
                    className="block w-full text-center btn-primary py-3"
                  >
                    🏠 ¡Quiero Adoptarlo!
                  </Link>
                ) : (
                  <div className="block w-full text-center bg-gray-400 text-white py-3 rounded-lg">
                    {perrito.estado === 'proceso' ? 'En proceso de adopción' : 'No disponible'}
                  </div>
                )}
                <button className="w-full btn-secondary py-3">
                  <Heart className="h-4 w-4 mr-2" />
                  Agregar a Favoritos
                </button>
              </div>
            </div>

            {/* Información de salud */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Estado de Salud
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className={`text-center p-2 rounded ${perrito.vacunas ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {perrito.vacunas ? '✓' : '✗'} Vacunado
                </div>
                <div className={`text-center p-2 rounded ${perrito.esterilizado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {perrito.esterilizado ? '✓' : '✗'} Esterilizado
                </div>
                <div className={`text-center p-2 rounded ${perrito.desparasitado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {perrito.desparasitado ? '✓' : '✗'} Desparasitado
                </div>
              </div>
              {perrito.saludNotas && (
                <p className="mt-4 text-sm text-slate-600">{perrito.saludNotas}</p>
              )}
            </div>
          </div>
        </div>

        {/* Historia del perrito */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">La historia de {perrito.nombre}</h2>
          <p className="text-slate-700 leading-relaxed mb-4">{perrito.historia}</p>
          
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div>Ingresó el {new Date(perrito.fechaIngreso).toLocaleDateString()}</div>
            {perrito.procedencia && (
              <>
                <span>•</span>
                <div>Procedencia: {perrito.procedencia}</div>
              </>
            )}
          </div>
        </div>

        {/* Perritos similares */}
        {perrito.similares && perrito.similares.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Otros perritos que te pueden interesar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {perrito.similares.map((similar) => (
                <Link
                  key={similar.id}
                  href={`/perritos/${similar.slug}`}
                  className="card overflow-hidden group"
                >
                  <Image
                    src={similar.fotoPrincipal}
                    alt={similar.nombre}
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900">{similar.nombre}</h3>
                    <p className="text-sm text-slate-600">{similar.raza} • {similar.edad}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}