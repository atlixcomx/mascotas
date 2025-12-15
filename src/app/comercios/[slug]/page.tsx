'use client'

import { useState, useEffect, use } from 'react'

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'
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

export default function ComercioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [comercio, setComercio] = useState<Comercio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [mascotas, setMascotas] = useState<any[]>([])  // Para mostrar 3 mascotas aleatorias

  useEffect(() => {
    fetchComercio()
    fetchMascotas()
    trackQRScan() // Trackear si llegó via QR
  }, [slug])

  const fetchComercio = async () => {
    try {
      const response = await fetch(`/api/comercios/${slug}`)
      
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

  const fetchMascotas = async () => {
    try {
      const response = await fetch('/api/perritos?limit=3&destacados=true')
      if (response.ok) {
        const data = await response.json()
        // Si no hay destacados, obtener los primeros 3
        if (data.perritos.length === 0) {
          const fallbackResponse = await fetch('/api/perritos?limit=3')
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json()
            setMascotas(fallbackData.perritos || [])
          }
        } else {
          setMascotas(data.perritos || [])
        }
      }
    } catch (error) {
      console.error('Error fetching mascotas:', error)
    }
  }

  const trackQRScan = async () => {
    // Solo trackear si viene de un QR scan (puede ser por referrer o parámetro)
    const urlParams = new URLSearchParams(window.location.search)
    const referrer = document.referrer
    
    // Verificar si viene de QR (sin referrer o con parámetro específico)
    if (!referrer || referrer === '' || urlParams.get('qr') === '1') {
      try {
        await fetch(`/api/comercios/${slug}/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            source: 'qr_scan',
            timestamp: new Date().toISOString()
          })
        })
      } catch (error) {
        console.error('Error tracking QR scan:', error)
      }
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Hero Section Institucional */}
      <div style={{
        background: 'linear-gradient(135deg, #0e312d 0%, #1a4a45 100%)',
        padding: '60px 20px 80px',
        color: 'white'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {/* Navegación */}
          <Link
            href="/comercios-friendly"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '32px',
              transition: 'color 0.2s'
            }}
          >
            <ArrowLeft size={18} />
            Volver al directorio
          </Link>

          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            {/* Badge de categoría */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '8px 16px',
              borderRadius: '20px',
              marginBottom: '20px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <Icon size={18} />
              {categoria.label}
            </div>

            {/* Título */}
            <h1 style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: '800',
              margin: '0 0 16px 0',
              lineHeight: 1.2
            }}>
              {comercio.nombre}
            </h1>

            {/* Certificación */}
            {comercio.certificado && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#bfb591',
                color: '#0e312d',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                <Shield size={18} />
                Certificado Pet Friendly
                {comercio.fechaCert && (
                  <span style={{ opacity: 0.7, marginLeft: '8px' }}>
                    · desde {new Date(comercio.fechaCert).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'short'
                    })}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div style={{ maxWidth: '900px', margin: '-40px auto 0', padding: '0 20px 60px', position: 'relative', zIndex: 2 }}>
        {/* Tarjeta única con toda la información */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          {/* Descripción */}
          <div style={{ padding: '32px', borderBottom: '1px solid #f0f0f0' }}>
            <p style={{
              fontSize: '17px',
              color: '#4b5563',
              lineHeight: 1.7,
              margin: 0
            }}>
              {comercio.descripcion}
            </p>
          </div>

          {/* Grid de 2 columnas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
          }}>
            {/* Columna izquierda - Contacto */}
            <div style={{ padding: '32px', borderRight: '1px solid #f0f0f0' }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#8b7355',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '20px'
              }}>
                Contacto
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MapPin size={18} style={{ color: '#0e312d', flexShrink: 0 }} />
                  <span style={{ fontSize: '15px', color: '#374151' }}>{comercio.direccion}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone size={18} style={{ color: '#0e312d', flexShrink: 0 }} />
                  <a href={`tel:${comercio.telefono}`} style={{ fontSize: '15px', color: '#0e312d', textDecoration: 'none', fontWeight: '500' }}>
                    {comercio.telefono}
                  </a>
                </div>

                {comercio.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Mail size={18} style={{ color: '#0e312d', flexShrink: 0 }} />
                    <a href={`mailto:${comercio.email}`} style={{ fontSize: '15px', color: '#0e312d', textDecoration: 'none' }}>
                      {comercio.email}
                    </a>
                  </div>
                )}

                {comercio.website && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Globe size={18} style={{ color: '#0e312d', flexShrink: 0 }} />
                    <a href={comercio.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '15px', color: '#0e312d', textDecoration: 'none' }}>
                      Visitar sitio web
                    </a>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Clock size={18} style={{ color: '#0e312d', flexShrink: 0 }} />
                  <span style={{ fontSize: '15px', color: '#374151' }}>{comercio.horarios}</span>
                </div>
              </div>
            </div>

            {/* Columna derecha - Servicios */}
            <div style={{ padding: '32px' }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#8b7355',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '20px'
              }}>
                Servicios Pet Friendly
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(typeof serviciosTexto === 'string' ? serviciosTexto.split('\n') : []).map((servicio, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
                    <span style={{ fontSize: '15px', color: '#374151' }}>{servicio}</span>
                  </div>
                ))}
              </div>

              {comercio.restricciones && (
                <div style={{
                  marginTop: '24px',
                  padding: '16px',
                  backgroundColor: '#fef9e7',
                  borderRadius: '8px',
                  borderLeft: '3px solid #d97706'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Shield size={16} style={{ color: '#d97706' }} />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#d97706' }}>Restricciones</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#92400e', margin: 0, lineHeight: 1.5 }}>
                    {comercio.restricciones}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA para adopción */}
        <div style={{
          marginTop: '48px',
          padding: '40px',
          backgroundColor: '#f5f3ed',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#0e312d',
            marginBottom: '12px'
          }}>
            ¿Buscas un compañero <span style={{ color: '#8b7355' }}>peludo</span>?
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '24px',
            maxWidth: '500px',
            margin: '0 auto 24px'
          }}>
            Visita nuestro catálogo de adopción y encuentra a tu nuevo mejor amigo
          </p>
          <Link
            href="/catalogo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#0e312d',
              color: 'white',
              padding: '14px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            <Dog size={20} />
            Ver Catálogo de Adopción
          </Link>
        </div>
      </div>
    </div>
  )
}