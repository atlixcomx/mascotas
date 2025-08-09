'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Shield,
  ArrowLeft,
  Store,
  Coffee,
  Trees,
  Utensils,
  ShoppingBag,
  Hotel,
  Stethoscope,
  CheckCircle2,
  Calendar,
  Star,
  Heart,
  Dog,
  Award,
  Users
} from 'lucide-react'

const categoriaConfig = {
  veterinaria: { 
    icon: Stethoscope, 
    color: '#dc2626', 
    bg: '#fee2e2', 
    label: 'Veterinaria',
    lightBg: '#fef2f2'
  },
  petshop: { 
    icon: ShoppingBag, 
    color: '#9333ea', 
    bg: '#faf5ff', 
    label: 'Pet Shop',
    lightBg: '#fdf4ff'
  },
  hotel: { 
    icon: Hotel, 
    color: '#0891b2', 
    bg: '#e0f2fe', 
    label: 'Hotel Pet Friendly',
    lightBg: '#f0f9ff'
  },
  restaurante: { 
    icon: Utensils, 
    color: '#ea580c', 
    bg: '#fed7aa', 
    label: 'Restaurante',
    lightBg: '#fff7ed'
  },
  cafe: { 
    icon: Coffee, 
    color: '#84cc16', 
    bg: '#ecfccb', 
    label: 'Cafetería',
    lightBg: '#f7fee7'
  },
  parque: { 
    icon: Trees, 
    color: '#16a34a', 
    bg: '#dcfce7', 
    label: 'Parque',
    lightBg: '#f0fdf4'
  },
  otro: { 
    icon: Store, 
    color: '#6b7280', 
    bg: '#f3f4f6', 
    label: 'Otro',
    lightBg: '#f9fafb'
  }
}

interface Comercio {
  id: string
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
  servicios: string | string[]
  restricciones?: string
  certificado: boolean
  fechaCert?: string
  latitud?: number
  longitud?: number
}

export default function ComercioPage({ params }: { params: { slug: string } }) {
  const [comercio, setComercio] = useState<Comercio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchComercio()
  }, [params.slug])

  const fetchComercio = async () => {
    try {
      const response = await fetch(`/api/comercios/${params.slug}`)
      
      if (!response.ok) {
        setError(true)
        return
      }

      const data = await response.json()
      setComercio(data)
    } catch (error) {
      console.error('Error fetching comercio:', error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-block',
            width: '50px',
            height: '50px',
            border: '3px solid #f3f4f6',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{
            marginTop: '16px',
            color: '#6b7280',
            fontSize: '16px'
          }}>Cargando información...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error || !comercio) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px'
        }}>
          <Store size={64} style={{ color: '#e5e7eb', margin: '0 auto 16px' }} />
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>Comercio no encontrado</h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '24px'
          }}>
            El comercio que buscas no existe o no está disponible.
          </p>
          <Link
            href="/comercios-friendly"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            <ArrowLeft size={20} />
            Ver todos los comercios
          </Link>
        </div>
      </div>
    )
  }

  const categoria = categoriaConfig[comercio.categoria as keyof typeof categoriaConfig] || categoriaConfig.otro
  const Icon = categoria.icon
  
  // Parsear servicios si vienen como JSON string
  let serviciosTexto = comercio.servicios
  if (typeof comercio.servicios === 'string') {
    try {
      if (comercio.servicios.startsWith('[')) {
        const serviciosArray = JSON.parse(comercio.servicios)
        serviciosTexto = serviciosArray.join('\n')
      }
    } catch (e) {
      // Si no se puede parsear, usar el texto tal cual
    }
  } else if (Array.isArray(comercio.servicios)) {
    serviciosTexto = comercio.servicios.join('\n')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Hero Section con Certificación */}
      <div style={{
        background: `linear-gradient(135deg, ${categoria.color}15 0%, ${categoria.bg} 100%)`,
        padding: '40px 20px 60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Patrón decorativo */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, ${categoria.color} 35px, ${categoria.color} 70px)`
        }} />

        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Navegación */}
          <Link
            href="/comercios-friendly"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: categoria.color,
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '32px',
              fontFamily: 'Albert Sans, sans-serif'
            }}
          >
            <ArrowLeft size={20} />
            Volver al directorio
          </Link>

          {/* Header */}
          <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Logo/Icon */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '24px',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              flexShrink: 0
            }}>
              <Icon size={60} style={{ color: categoria.color }} />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: '#111827',
                  margin: 0,
                  lineHeight: 1.2,
                  fontFamily: 'Albert Sans, sans-serif',
                  flex: 1
                }}>
                  {comercio.nombre}
                </h1>
                {comercio.certificado && (
                  <div style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '24px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    <Shield size={16} />
                    Certificado Pet Friendly
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: categoria.color,
                  backgroundColor: 'white',
                  padding: '8px 20px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  <Icon size={20} />
                  {categoria.label}
                </span>

                {comercio.fechaCert && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    <Calendar size={16} />
                    Certificado desde {new Date(comercio.fechaCert).toLocaleDateString('es-MX', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div style={{ maxWidth: '1200px', margin: '-40px auto 0', padding: '0 20px 80px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
          
          {/* Información General */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#111827',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: 'Albert Sans, sans-serif'
            }}>
              <Store size={24} style={{ color: categoria.color }} />
              Información General
            </h2>

            <p style={{ 
              fontSize: '1rem', 
              color: '#4b5563', 
              lineHeight: 1.8,
              marginBottom: '24px',
              fontFamily: 'Poppins, sans-serif'
            }}>
              {comercio.descripcion}
            </p>

            {/* Horarios */}
            <div style={{
              backgroundColor: categoria.lightBg,
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: categoria.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Clock size={20} style={{ color: categoria.color }} />
                </div>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#111827',
                  margin: 0,
                  fontFamily: 'Poppins, sans-serif'
                }}>Horarios de Atención</h3>
              </div>
              <pre style={{ 
                fontSize: '0.875rem', 
                color: '#4b5563',
                whiteSpace: 'pre-wrap',
                fontFamily: 'Poppins, sans-serif',
                margin: 0
              }}>{comercio.horarios}</pre>
            </div>
          </div>

          {/* Información de Contacto */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#111827',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: 'Albert Sans, sans-serif'
            }}>
              <Phone size={24} style={{ color: categoria.color }} />
              Contacto y Ubicación
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: categoria.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MapPin size={24} style={{ color: categoria.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: '#374151',
                    marginBottom: '4px',
                    fontFamily: 'Poppins, sans-serif'
                  }}>Dirección</p>
                  <p style={{ 
                    fontSize: '1rem', 
                    color: '#6b7280',
                    margin: 0,
                    fontFamily: 'Poppins, sans-serif'
                  }}>{comercio.direccion}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: categoria.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Phone size={24} style={{ color: categoria.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: '#374151',
                    marginBottom: '4px',
                    fontFamily: 'Poppins, sans-serif'
                  }}>Teléfono</p>
                  <a 
                    href={`tel:${comercio.telefono}`}
                    style={{ 
                      fontSize: '1rem', 
                      color: '#3b82f6',
                      textDecoration: 'none',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >{comercio.telefono}</a>
                </div>
              </div>

              {comercio.email && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: categoria.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Mail size={24} style={{ color: categoria.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: '#374151',
                      marginBottom: '4px',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Email</p>
                    <a 
                      href={`mailto:${comercio.email}`}
                      style={{ 
                        fontSize: '1rem', 
                        color: '#3b82f6',
                        textDecoration: 'none',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >{comercio.email}</a>
                  </div>
                </div>
              )}

              {comercio.website && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: categoria.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Globe size={24} style={{ color: categoria.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: '#374151',
                      marginBottom: '4px',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Sitio Web</p>
                    <a 
                      href={comercio.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        fontSize: '1rem', 
                        color: '#3b82f6',
                        textDecoration: 'none',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >{comercio.website}</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Servicios Pet Friendly */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#111827',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: 'Albert Sans, sans-serif'
            }}>
              <Heart size={24} style={{ color: categoria.color }} />
              Servicios Pet Friendly
            </h2>

            <div style={{
              backgroundColor: '#f0fdf4',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <CheckCircle2 size={20} style={{ color: '#16a34a' }} />
                <span style={{ 
                  fontWeight: '600', 
                  color: '#16a34a',
                  fontFamily: 'Poppins, sans-serif'
                }}>Servicios Disponibles</span>
              </div>
              <pre style={{ 
                fontSize: '0.875rem', 
                color: '#4b5563',
                whiteSpace: 'pre-wrap',
                fontFamily: 'Poppins, sans-serif',
                margin: 0,
                lineHeight: 1.8
              }}>{serviciosTexto}</pre>
            </div>

            {/* Restricciones */}
            {comercio.restricciones && (
              <div style={{
                backgroundColor: '#fef3c7',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Shield size={20} style={{ color: '#d97706' }} />
                  <span style={{ 
                    fontWeight: '600', 
                    color: '#d97706',
                    fontFamily: 'Poppins, sans-serif'
                  }}>Restricciones</span>
                </div>
                <pre style={{ 
                  fontSize: '0.875rem', 
                  color: '#92400e',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'Poppins, sans-serif',
                  margin: 0
                }}>{comercio.restricciones}</pre>
              </div>
            )}
          </div>

          {/* Beneficios de la Certificación */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#111827',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: 'Albert Sans, sans-serif'
            }}>
              <Award size={24} style={{ color: '#fbbf24' }} />
              Beneficios de la Certificación
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: Star, text: 'Reconocimiento oficial como establecimiento Pet Friendly' },
                { icon: Users, text: 'Mayor visibilidad en nuestra comunidad' },
                { icon: Heart, text: 'Contribuye al bienestar animal en Atlixco' },
                { icon: Dog, text: 'Acceso a eventos y promociones especiales' }
              ].map((benefit, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <benefit.icon size={18} style={{ color: '#d97706' }} />
                  </div>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#4b5563',
                    margin: 0,
                    fontFamily: 'Poppins, sans-serif'
                  }}>{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          marginTop: '64px',
          padding: '48px',
          backgroundColor: categoria.lightBg,
          borderRadius: '24px',
          border: `2px solid ${categoria.bg}`,
          textAlign: 'center'
        }}>
          <Users size={48} style={{ color: categoria.color, margin: '0 auto 16px' }} />
          <h3 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '16px',
            fontFamily: 'Albert Sans, sans-serif'
          }}>Únete al Movimiento Pet Friendly</h3>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Juntos podemos crear una ciudad más amigable para las mascotas y 
            darle una segunda oportunidad a muchos animalitos
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/catalogo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: categoria.color,
                color: 'white',
                padding: '12px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                fontFamily: 'Albert Sans, sans-serif'
              }}
            >
              <Heart size={20} />
              Adoptar una Mascota
            </Link>
            <Link
              href="/solicitud"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'white',
                color: categoria.color,
                padding: '12px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                border: `2px solid ${categoria.color}`,
                fontFamily: 'Albert Sans, sans-serif'
              }}
            >
              Iniciar Proceso de Adopción
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}