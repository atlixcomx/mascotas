'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { usePerrito } from '../../../hooks/usePerritos'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import ErrorMessage from '../../../components/ui/ErrorMessage'
import PerritoDetailSkeleton from '../../../components/ui/PerritoDetailSkeleton'
import { 
  HeartIcon, HomeIcon, CalendarIcon, LocationIcon, 
  CheckCircleIcon, ArrowRightIcon, DogIcon, ShieldIcon,
  VaccineIcon, ScissorsIcon, StethoscopeIcon
} from '../../../components/icons/Icons'

interface PageProps {
  params: { slug: string }
}

// URL de imagen estándar para todos los perritos
const defaultDogImage = 'https://somosmaka.com/cdn/shop/articles/perro_mestizo.jpg?v=1697855331'

export default function PerritoDetailPage({ params }: PageProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [imageError, setImageError] = useState(false)

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
        backgroundColor: '#f8f9fa',
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

  // Construir array de imágenes sin duplicados
  const validPhotos: string[] = []
  
  // Agregar foto principal primero si es válida
  if (perrito.fotoPrincipal && 
      (perrito.fotoPrincipal.includes('utfs.io') || 
       perrito.fotoPrincipal.includes('uploadthing'))) {
    validPhotos.push(perrito.fotoPrincipal)
  }
  
  // Agregar otras fotos válidas sin duplicados
  if (perrito.fotos && Array.isArray(perrito.fotos)) {
    perrito.fotos.forEach(foto => {
      if (foto && 
          foto !== perrito.fotoPrincipal && 
          (foto.includes('utfs.io') || foto.includes('uploadthing')) &&
          !validPhotos.includes(foto)) {
        validPhotos.push(foto)
      }
    })
  }
  
  // Si no hay fotos válidas, usar imagen por defecto
  const allImages = validPhotos.length > 0 ? validPhotos : [defaultDogImage]
  
  console.log('Fotos válidas finales:', allImages)
  
  console.log('Perrito data en cliente:', {
    nombre: perrito.nombre,
    fotoPrincipal: perrito.fotoPrincipal,
    fotos: perrito.fotos,
    fotosType: typeof perrito.fotos,
    fotosIsArray: Array.isArray(perrito.fotos),
    allImages: allImages,
    allImagesLength: allImages.length
  })
  
  // Log detallado del contenido de fotos
  if (perrito.fotos && Array.isArray(perrito.fotos)) {
    console.log('Contenido del array fotos:')
    perrito.fotos.forEach((foto, index) => {
      console.log(`  [${index}]: ${foto}`)
    })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Hero Image Section */}
      <div style={{
        position: 'relative',
        height: '60vh',
        minHeight: '500px',
        background: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%), url(${defaultDogImage}) center/cover`,
        overflow: 'hidden'
      }}>
        {allImages[selectedImage] && (
          <Image
            src={imageError ? defaultDogImage : allImages[selectedImage]}
            alt={perrito.nombre}
            fill
            sizes="100vw"
            style={{
              objectFit: 'cover',
              zIndex: -1,
              imageOrientation: 'from-image'
            }}
            priority
            quality={95}
            onError={() => {
              console.error('Error loading image:', allImages[selectedImage])
              setImageError(true)
            }}
            onLoad={() => setImageError(false)}
          />
        )}
        
        {/* Navigation */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '24px',
          zIndex: 10
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Link
              href="/catalogo"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                textDecoration: 'none',
                color: 'white',
                fontSize: '15px',
                fontWeight: '500',
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.2s'
              }}
            >
              ← Volver al catálogo
            </Link>
            
            <button
              onClick={() => setIsLiked(!isLiked)}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <HeartIcon size={24} color={isLiked ? '#ef4444' : 'white'} />
            </button>
          </div>
        </div>

        {/* Info overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '48px 24px 24px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            color: 'white'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '24px',
              marginBottom: '16px'
            }}>
              <h1 style={{
                fontSize: 'clamp(36px, 5vw, 56px)',
                fontWeight: '800',
                margin: 0,
                letterSpacing: '-1px'
              }}>{perrito.nombre}</h1>
              
              {perrito.estado === 'disponible' && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '2px solid #22c55e',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600'
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
            
            <p style={{
              fontSize: '20px',
              opacity: 0.9,
              marginBottom: '24px'
            }}>
              {(perrito.raza || 'Mestizo')} • {(perrito.edad || 'Sin especificar')} • {(perrito.sexo || 'Sin especificar')}
            </p>

            {/* Image thumbnails */}
            {allImages.length > 1 && (
              <div style={{
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                paddingBottom: '8px'
              }}>
                {allImages.slice(0, 5).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index)
                      setImageError(false)
                    }}
                    style={{
                      minWidth: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: selectedImage === index ? '3px solid white' : '3px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Image
                      src={img || defaultDogImage}
                      alt={`${perrito.nombre} ${index + 1}`}
                      width={80}
                      height={80}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        imageOrientation: 'from-image'
                      }}
                      quality={90}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        transform: 'translateY(-40px)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '32px'
        }}>
          {/* Left Column - Details */}
          <div>
            {/* Características principales */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0e312d',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <DogIcon size={28} color="#6b3838" />
                Características
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px'
              }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Tamaño</p>
                  <p style={{ fontSize: '18px', fontWeight: '600', color: '#0e312d' }}>{perrito.tamano || 'No especificado'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Energía</p>
                  <p style={{ fontSize: '18px', fontWeight: '600', color: '#0e312d' }}>{perrito.energia || 'No especificado'}</p>
                </div>
                {perrito.peso && (
                  <div>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Peso</p>
                    <p style={{ fontSize: '18px', fontWeight: '600', color: '#0e312d' }}>{perrito.peso || 0} kg</p>
                  </div>
                )}
                <div>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Ingreso</p>
                  <p style={{ fontSize: '18px', fontWeight: '600', color: '#0e312d' }}>
                    {perrito.fechaIngreso ? new Date(perrito.fechaIngreso).toLocaleDateString('es-MX', { month: 'short', year: 'numeric' }) : 'No especificado'}
                  </p>
                </div>
              </div>

              {/* Personalidad */}
              <div style={{ marginTop: '32px' }}>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#0e312d', marginBottom: '12px' }}>
                  Personalidad
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {(perrito.caracter || []).map((trait, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '8px 16px',
                        background: '#f3f4f6',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#4a4a4a'
                      }}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Historia */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0e312d',
                marginBottom: '16px'
              }}>
                Mi historia
              </h2>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#4a4a4a'
              }}>
                {perrito.historia || 'Este hermoso perrito fue rescatado y está buscando un hogar lleno de amor. Es un compañero leal que está listo para llenar tu vida de alegría y momentos inolvidables.'}
              </p>
              {perrito.procedencia && (
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  marginTop: '16px',
                  fontStyle: 'italic'
                }}>
                  Procedencia: {perrito.procedencia}
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Adoption & Health */}
          <div>
            {/* Estado de salud */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0e312d',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <ShieldIcon size={28} color="#6b3838" />
                Estado de Salud
              </h2>

              <div style={{
                display: 'grid',
                gap: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: (perrito.vacunas ?? false) ? '#dcfce7' : '#fee2e2',
                  borderRadius: '12px'
                }}>
                  <VaccineIcon size={24} color={(perrito.vacunas ?? false) ? '#15803d' : '#dc2626'} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', color: '#0e312d' }}>Vacunas</p>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {(perrito.vacunas ?? false) ? 'Esquema completo' : 'Pendiente'}
                    </p>
                  </div>
                  {(perrito.vacunas ?? false) && <CheckCircleIcon size={20} color="#15803d" />}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: (perrito.esterilizado ?? false) ? '#dcfce7' : '#fee2e2',
                  borderRadius: '12px'
                }}>
                  <ScissorsIcon size={24} color={(perrito.esterilizado ?? false) ? '#15803d' : '#dc2626'} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', color: '#0e312d' }}>Esterilización</p>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {(perrito.esterilizado ?? false) ? 'Realizada' : 'Pendiente'}
                    </p>
                  </div>
                  {(perrito.esterilizado ?? false) && <CheckCircleIcon size={20} color="#15803d" />}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: (perrito.desparasitado ?? false) ? '#dcfce7' : '#fee2e2',
                  borderRadius: '12px'
                }}>
                  <StethoscopeIcon size={24} color={(perrito.desparasitado ?? false) ? '#15803d' : '#dc2626'} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', color: '#0e312d' }}>Desparasitación</p>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {(perrito.desparasitado ?? false) ? 'Al día' : 'Pendiente'}
                    </p>
                  </div>
                  {(perrito.desparasitado ?? false) && <CheckCircleIcon size={20} color="#15803d" />}
                </div>
              </div>

              {perrito.saludNotas && (
                <p style={{
                  marginTop: '20px',
                  padding: '16px',
                  background: '#f3f4f6',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: '1.6'
                }}>
                  {perrito.saludNotas}
                </p>
              )}
            </div>

            {/* Compatibilidad */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0e312d',
                marginBottom: '24px'
              }}>
                Compatibilidad
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px'
              }}>
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: perrito.aptoNinos ? '#dcfce7' : '#f3f4f6',
                  borderRadius: '12px'
                }}>
                  <p style={{ fontSize: '24px', marginBottom: '8px' }}>👶</p>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: perrito.aptoNinos ? '#15803d' : '#9ca3af'
                  }}>
                    {perrito.aptoNinos ? 'Apto' : 'No apto'}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666' }}>Niños</p>
                </div>

                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: perrito.aptoPerros ? '#dcfce7' : '#f3f4f6',
                  borderRadius: '12px'
                }}>
                  <p style={{ fontSize: '24px', marginBottom: '8px' }}>🐕</p>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: perrito.aptoPerros ? '#15803d' : '#9ca3af'
                  }}>
                    {perrito.aptoPerros ? 'Apto' : 'No apto'}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666' }}>Perros</p>
                </div>

                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: perrito.aptoGatos ? '#dcfce7' : '#f3f4f6',
                  borderRadius: '12px'
                }}>
                  <p style={{ fontSize: '24px', marginBottom: '8px' }}>🐱</p>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: perrito.aptoGatos ? '#15803d' : '#9ca3af'
                  }}>
                    {perrito.aptoGatos ? 'Apto' : 'No apto'}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666' }}>Gatos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner - ¿Listo para adoptar? */}
        {perrito.estado === 'disponible' && (
          <div style={{
            margin: '64px 0',
            maxWidth: '1200px',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '0 24px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #6b3838 0%, #8b4848 100%)',
              borderRadius: '24px',
              padding: '48px 40px',
              color: 'white',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(107, 56, 56, 0.2)'
            }}>
              {/* Patrón decorativo de fondo */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px)`
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  fontWeight: '700',
                  marginBottom: '16px',
                  letterSpacing: '-1px'
                }}>
                  ¿Listo para adoptar?
                </h3>
                <p style={{
                  fontSize: '20px',
                  opacity: 0.9,
                  marginBottom: '32px',
                  maxWidth: '600px',
                  margin: '0 auto 32px',
                  lineHeight: '1.6'
                }}>
                  {perrito.nombre} está esperando conocerte. Inicia el proceso de adopción 
                  y dale la oportunidad de ser parte de tu familia.
                </p>
                <Link
                  href={`/solicitud-adopcion/${params.slug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '18px 36px',
                    background: 'white',
                    color: '#6b3838',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)'
                  }}
                >
                  <HomeIcon size={22} color="#6b3838" />
                  Iniciar Solicitud de Adopción
                  <ArrowRightIcon size={22} color="#6b3838" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Perritos similares */}
        {perrito.similares && perrito.similares.length > 0 && (
          <div style={{
            marginTop: '80px',
            marginBottom: '80px'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#0e312d',
              marginBottom: '32px',
              textAlign: 'center'
            }}>
              También te pueden interesar
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {perrito.similares.slice(0, 3).map((similar, index) => (
                <Link
                  key={similar.id}
                  href={`/catalogo/${similar.slug}`}
                  style={{
                    display: 'block',
                    background: 'white',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{
                    position: 'relative',
                    height: '200px',
                    overflow: 'hidden'
                  }}>
                    <Image
                      src={similar.fotoPrincipal || defaultDogImage}
                      alt={similar.nombre}
                      fill
                      style={{
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <div style={{ padding: '24px' }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#0e312d',
                      marginBottom: '8px'
                    }}>{similar.nombre}</h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#666'
                    }}>{similar.raza} • {similar.edad}</p>
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