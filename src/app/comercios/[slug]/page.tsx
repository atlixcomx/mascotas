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
import { prisma } from '@/lib/db'

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

export default async function ComercioPage({ params }: { params: { slug: string } }) {
  const comercio = await prisma.comercio.findUnique({
    where: { 
      slug: params.slug,
      activo: true 
    }
  })

  if (!comercio) {
    notFound()
  }

  // Registrar escaneo de QR
  await prisma.comercio.update({
    where: { id: comercio.id },
    data: { qrEscaneos: { increment: 1 } }
  })

  const categoria = categoriaConfig[comercio.categoria as keyof typeof categoriaConfig] || categoriaConfig.otro
  const Icon = categoria.icon

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Hero Section con Certificación */}
      <div style={{ 
        backgroundColor: categoria.lightBg, 
        borderBottom: `3px solid ${categoria.bg}`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Patrón de fondo */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `repeating-linear-gradient(45deg, ${categoria.color} 0, ${categoria.color} 10px, transparent 10px, transparent 20px)`
        }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px', position: 'relative' }}>
          <div style={{ textAlign: 'center' }}>
            {/* Badge de certificación */}
            {comercio.certificado && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'white',
                padding: '16px 32px',
                borderRadius: '100px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                marginBottom: '32px',
                border: `2px solid ${categoria.bg}`
              }}>
                <Award size={32} style={{ color: '#f59e0b' }} />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280', 
                    margin: '0 0 2px 0',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Establecimiento Certificado
                  </p>
                  <p style={{ 
                    fontSize: '1.125rem', 
                    color: '#111827', 
                    fontWeight: '700',
                    margin: 0,
                    fontFamily: 'Albert Sans, sans-serif'
                  }}>
                    Pet Friendly Atlixco
                  </p>
                </div>
              </div>
            )}

            {/* Icono y nombre */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '24px',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              border: `3px solid ${categoria.bg}`
            }}>
              <Icon size={60} style={{ color: categoria.color }} />
            </div>

            <h1 style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: '#111827',
              margin: '0 0 12px 0',
              fontFamily: 'Albert Sans, sans-serif'
            }}>{comercio.nombre}</h1>

            <p style={{
              fontSize: '1.25rem',
              color: '#4b5563',
              marginBottom: '24px',
              fontFamily: 'Poppins, sans-serif'
            }}>{categoria.label} • Atlixco, Puebla</p>

            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              lineHeight: 1.6,
              maxWidth: '800px',
              margin: '0 auto',
              fontFamily: 'Poppins, sans-serif'
            }}>{comercio.descripcion}</p>
          </div>
        </div>
      </div>

      {/* CTA Principal - Adopción */}
      <div style={{ backgroundColor: '#af1731', color: 'white', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <Dog size={48} style={{ margin: '0 auto 16px' }} />
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '16px',
            fontFamily: 'Albert Sans, sans-serif'
          }}>¿Buscas un Mejor Amigo?</h2>
          <p style={{
            fontSize: '1.125rem',
            marginBottom: '32px',
            opacity: 0.9,
            fontFamily: 'Poppins, sans-serif'
          }}>
            Visita nuestro catálogo de mascotas rescatadas que buscan un hogar lleno de amor
          </p>
          <Link
            href="/catalogo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'white',
              color: '#af1731',
              padding: '16px 40px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '1.125rem',
              fontWeight: '600',
              fontFamily: 'Albert Sans, sans-serif',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Heart size={24} />
            Ver Catálogo de Adopción
          </Link>
        </div>
      </div>

      {/* Información del comercio */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          {/* Información de contacto */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '24px',
              fontFamily: 'Albert Sans, sans-serif'
            }}>Información de Contacto</h3>

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
                    fontFamily: 'Poppins, sans-serif',
                    lineHeight: 1.5
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
                    >{comercio.website.replace(/^https?:\/\//, '')}</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Horarios */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <Clock size={28} style={{ color: categoria.color }} />
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0,
                fontFamily: 'Albert Sans, sans-serif'
              }}>Horarios de Atención</h3>
            </div>

            <pre style={{
              fontSize: '1rem',
              color: '#4b5563',
              whiteSpace: 'pre-wrap',
              fontFamily: 'Poppins, sans-serif',
              margin: 0,
              lineHeight: 1.8
            }}>{comercio.horarios}</pre>
          </div>

          {/* Servicios Pet Friendly */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <Star size={28} style={{ color: categoria.color }} />
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0,
                fontFamily: 'Albert Sans, sans-serif'
              }}>Servicios Pet Friendly</h3>
            </div>

            <pre style={{
              fontSize: '1rem',
              color: '#4b5563',
              whiteSpace: 'pre-wrap',
              fontFamily: 'Poppins, sans-serif',
              margin: 0,
              lineHeight: 1.8
            }}>{comercio.servicios}</pre>
          </div>

          {/* Restricciones */}
          {comercio.restricciones && (
            <div style={{
              backgroundColor: '#fef3c7',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid #fde68a'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Shield size={28} style={{ color: '#d97706' }} />
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#92400e',
                  margin: 0,
                  fontFamily: 'Albert Sans, sans-serif'
                }}>Restricciones</h3>
              </div>

              <pre style={{
                fontSize: '1rem',
                color: '#78350f',
                whiteSpace: 'pre-wrap',
                fontFamily: 'Poppins, sans-serif',
                margin: 0,
                lineHeight: 1.8
              }}>{comercio.restricciones}</pre>
            </div>
          )}
        </div>

        {/* Footer con más CTAs */}
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