'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Heart, MapPin, User, Shield, Zap, Eye } from 'lucide-react'
import { usePerrito } from '../../../hooks/usePerritos'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import ErrorMessage from '../../../components/ui/ErrorMessage'
import PerritoDetailSkeleton from '../../../components/ui/PerritoDetailSkeleton'

interface PageProps {
  params: { slug: string }
}


export default function PerritoDetailPage({ params }: PageProps) {
  const {
    perrito,
    loading,
    error,
    notFound: perritoNotFound,
    retryCount,
    isRetrying,
    retry
  } = usePerrito(params.slug)

  if (loading) {
    return <PerritoDetailSkeleton />
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
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

  if (perritoNotFound || !perrito) {
    notFound()
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 20px' }}>
          <nav style={{ fontSize: '14px' }}>
            <Link href="/" style={{ color: '#af1731', textDecoration: 'none' }}>Inicio</Link>
            <span style={{ margin: '0 8px', color: '#94a3b8' }}>/</span>
            <Link href="/perritos" style={{ color: '#af1731', textDecoration: 'none' }}>Perritos</Link>
            <span style={{ margin: '0 8px', color: '#94a3b8' }}>/</span>
            <span style={{ color: '#64748b' }}>{perrito.nombre}</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px',
          marginBottom: '48px'
        }}>
          
          {/* Galería de fotos */}
          <div>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Image
                src={perrito.fotoPrincipal}
                alt={perrito.nombre}
                width={600}
                height={400}
                style={{
                  width: '100%',
                  height: '384px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }}
                priority
              />
              
              {/* Badges */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {perrito.esNuevo && (
                  <span style={{
                    backgroundColor: '#af1731',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    ✨ Nuevo
                  </span>
                )}
                {perrito.destacado && (
                  <span style={{
                    backgroundColor: '#eab308',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    ⭐ Destacado
                  </span>
                )}
                <span style={{
                  backgroundColor: perrito.estado === 'disponible' ? '#10b981' : '#f59e0b',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {perrito.estado}
                </span>
              </div>

              {/* Stats en imagen */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <Eye style={{ width: '16px', height: '16px' }} />
                  {perrito.vistas} vistas
                </div>
              </div>
            </div>

            {/* Thumbnails de fotos adicionales */}
            {perrito.fotos.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {perrito.fotos.slice(1, 5).map((foto: string, index: number) => (
                  <Image
                    key={index}
                    src={foto}
                    alt={`${perrito.nombre} foto ${index + 2}`}
                    width={150}
                    height={100}
                    style={{
                      width: '100%',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Información del perrito */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h1 style={{
                fontSize: '30px',
                fontWeight: 'bold',
                color: '#0f172a',
                marginBottom: '8px'
              }}>{perrito.nombre}</h1>
              <p style={{
                fontSize: '18px',
                color: '#64748b',
                marginBottom: '16px'
              }}>{perrito.raza}</p>

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