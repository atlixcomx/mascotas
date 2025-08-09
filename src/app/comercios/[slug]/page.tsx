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
  Star
} from 'lucide-react'
import { prisma } from '@/lib/prisma'

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
      {/* Header */}
      <div style={{ backgroundColor: categoria.lightBg, borderBottom: `2px solid ${categoria.bg}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
          <Link 
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '0.875rem',
              marginBottom: '24px',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            <ArrowLeft size={20} />
            Volver al inicio
          </Link>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '20px',
              backgroundColor: categoria.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Icon size={60} style={{ color: categoria.color }} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#111827',
                  margin: 0,
                  fontFamily: 'Albert Sans, sans-serif'
                }}>{comercio.nombre}</h1>
                
                {comercio.certificado && (
                  <div style={{
                    backgroundColor: '#dbeafe',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CheckCircle2 size={20} style={{ color: '#2563eb' }} />
                    <span style={{ 
                      fontSize: '0.875rem', 
                      color: '#1e40af', 
                      fontWeight: '600',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      Certificado Pet Friendly
                    </span>
                  </div>
                )}
              </div>

              <p style={{
                fontSize: '1.125rem',
                color: '#4b5563',
                marginBottom: '16px',
                fontFamily: 'Poppins, sans-serif'
              }}>{categoria.label} en Atlixco</p>

              <p style={{
                fontSize: '1rem',
                color: '#6b7280',
                lineHeight: 1.6,
                fontFamily: 'Poppins, sans-serif'
              }}>{comercio.descripcion}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          {/* Información de contacto */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '20px',
              fontFamily: 'Albert Sans, sans-serif'
            }}>Información de Contacto</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={20} style={{ color: categoria.color, flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: '#374151',
                    marginBottom: '4px',
                    fontFamily: 'Poppins, sans-serif'
                  }}>Dirección</p>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280',
                    fontFamily: 'Poppins, sans-serif'
                  }}>{comercio.direccion}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Phone size={20} style={{ color: categoria.color, flexShrink: 0, marginTop: '2px' }} />
                <div>
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
                      fontSize: '0.875rem', 
                      color: '#3b82f6',
                      textDecoration: 'none',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >{comercio.telefono}</a>
                </div>
              </div>

              {comercio.email && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Mail size={20} style={{ color: categoria.color, flexShrink: 0, marginTop: '2px' }} />
                  <div>
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
                        fontSize: '0.875rem', 
                        color: '#3b82f6',
                        textDecoration: 'none',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >{comercio.email}</a>
                  </div>
                </div>
              )}

              {comercio.website && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Globe size={20} style={{ color: categoria.color, flexShrink: 0, marginTop: '2px' }} />
                  <div>
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
                        fontSize: '0.875rem', 
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
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'Albert Sans, sans-serif'
            }}>
              <Clock size={24} style={{ color: categoria.color }} />
              Horarios de Atención
            </h2>

            <pre style={{
              fontSize: '0.875rem',
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
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'Albert Sans, sans-serif'
            }}>
              <Star size={24} style={{ color: categoria.color }} />
              Servicios Pet Friendly
            </h2>

            <pre style={{
              fontSize: '0.875rem',
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
              padding: '24px',
              border: '1px solid #fde68a'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#92400e',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Albert Sans, sans-serif'
              }}>
                <Shield size={24} />
                Restricciones
              </h2>

              <pre style={{
                fontSize: '0.875rem',
                color: '#78350f',
                whiteSpace: 'pre-wrap',
                fontFamily: 'Poppins, sans-serif',
                margin: 0,
                lineHeight: 1.8
              }}>{comercio.restricciones}</pre>
            </div>
          )}
        </div>

        {/* Mapa si hay coordenadas */}
        {comercio.latitud && comercio.longitud && (
          <div style={{
            marginTop: '24px',
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '20px',
              fontFamily: 'Albert Sans, sans-serif'
            }}>Ubicación en el Mapa</h2>
            
            <div style={{
              backgroundColor: '#f3f4f6',
              borderRadius: '12px',
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Mapa próximamente disponible
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{
          marginTop: '48px',
          backgroundColor: categoria.lightBg,
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          border: `2px solid ${categoria.bg}`
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '16px',
            fontFamily: 'Albert Sans, sans-serif'
          }}>¿Quieres adoptar una mascota?</h3>
          <p style={{
            fontSize: '1rem',
            color: '#6b7280',
            marginBottom: '24px',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Visita nuestro catálogo de mascotas disponibles para adopción en Atlixco
          </p>
          <Link
            href="/mascotas"
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
            Ver Mascotas Disponibles
          </Link>
        </div>
      </div>
    </div>
  )
}