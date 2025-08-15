'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { 
  X, Download, Share2, MapPin, Phone, Clock, Star, 
  CheckCircle, Droplets, Heart, Users, Shield, 
  ExternalLink, Navigation, MessageCircle, Copy,
  Facebook, Twitter, Mail, ChevronRight, Sparkles
} from 'lucide-react'

// Importar componente QR dinámicamente
const QRPetFriendly = dynamic(() => import('@/components/QRPetFriendly'), { ssr: false })

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
}

interface QRModalEnhancedProps {
  comercio: Comercio
  isOpen: boolean
  onClose: () => void
  categoriaConfig: any
}

export default function QRModalEnhanced({ 
  comercio, 
  isOpen, 
  onClose,
  categoriaConfig 
}: QRModalEnhancedProps) {
  const [qrData, setQrData] = useState<{dataUrl: string, svg: string} | null>(null)
  const [loadingQR, setLoadingQR] = useState(false)
  const [qrStyle, setQrStyle] = useState<'classic' | 'petfriendly'>('petfriendly')
  const [copied, setCopied] = useState(false)
  const [isOpenNow, setIsOpenNow] = useState(false)

  const categoria = categoriaConfig[comercio.categoria] || categoriaConfig.otro
  const Icon = categoria.icon

  useEffect(() => {
    if (isOpen) {
      generateQR()
      checkIfOpen()
    }
  }, [isOpen])

  async function generateQR() {
    setLoadingQR(true)
    try {
      const response = await fetch(`/api/admin/comercios/${comercio.id}/qr`)
      if (response.ok) {
        const data = await response.json()
        setQrData(data.qr)
      }
    } catch (error) {
      console.error('Error generating QR:', error)
    } finally {
      setLoadingQR(false)
    }
  }

  function checkIfOpen() {
    // Lógica simple para verificar si está abierto basado en horarios
    const now = new Date()
    const currentHour = now.getHours()
    // Por simplicidad, asumimos que está abierto de 9:00 a 22:00
    setIsOpenNow(currentHour >= 9 && currentHour < 22)
  }

  function downloadQR(format: 'png' | 'svg') {
    if (qrStyle === 'petfriendly' && format === 'png') {
      const canvas = document.querySelector('#qr-canvas canvas') as HTMLCanvasElement
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.download = `QR-PetFriendly-${comercio.codigo}-${comercio.nombre.replace(/\s+/g, '-')}.png`
            link.href = url
            link.click()
            URL.revokeObjectURL(url)
          }
        })
      }
    } else if (qrData) {
      if (format === 'png') {
        const link = document.createElement('a')
        link.download = `QR-${comercio.codigo}-${comercio.nombre.replace(/\s+/g, '-')}.png`
        link.href = qrData.dataUrl
        link.click()
      } else {
        const blob = new Blob([qrData.svg], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `QR-${comercio.codigo}-${comercio.nombre.replace(/\s+/g, '-')}.svg`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
      }
    }
  }

  function shareOn(platform: 'whatsapp' | 'facebook' | 'twitter' | 'copy') {
    const url = `${process.env.NEXT_PUBLIC_URL || 'https://4tlixco.vercel.app'}/comercios/${comercio.slug}`
    const text = `¡Visita ${comercio.nombre}! Un lugar Pet Friendly certificado en Atlixco 🐾`
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        break
    }
  }

  function openInMaps() {
    if (comercio.latitud && comercio.longitud) {
      window.open(`https://www.google.com/maps?q=${comercio.latitud},${comercio.longitud}`, '_blank')
    } else {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(comercio.direccion + ', Atlixco, Puebla')}`, '_blank')
    }
  }

  if (!isOpen) return null

  // Servicios pet-friendly específicos según categoría
  const petServices = {
    veterinaria: ['Consultas especializadas', 'Urgencias 24/7', 'Grooming profesional', 'Farmacia veterinaria'],
    petshop: ['Alimento premium', 'Juguetes y accesorios', 'Asesoría nutricional', 'Envío a domicilio'],
    hotel: ['Habitaciones pet-friendly', 'Área de paseo', 'Servicio de cuidado', 'Menú para mascotas'],
    restaurante: ['Mesas en terraza', 'Agua fresca disponible', 'Treats de cortesía', 'Zona pet-friendly'],
    cafe: ['Espacios al aire libre', 'Agua y snacks', 'Ambiente relajado', 'WiFi gratis'],
    parque: ['Áreas verdes amplias', 'Bebederos', 'Zona de juegos', 'Bolsas biodegradables'],
    otro: ['Mascota bienvenidas', 'Personal amigable', 'Espacio seguro', 'Agua disponible']
  }

  const services = petServices[comercio.categoria as keyof typeof petServices] || petServices.otro

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          animation: 'slideUp 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: `linear-gradient(135deg, ${categoria.color}15 0%, ${categoria.color}05 100%)`,
          borderRadius: '20px 20px 0 0',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: -20,
            right: -20,
            opacity: 0.1
          }}>
            <Sparkles size={150} color={categoria.color} />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '10px',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 10,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <X size={20} style={{ color: '#6b7280' }} />
        </button>

        <div style={{ padding: '32px', position: 'relative' }}>
          {loadingQR ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{
                width: '60px',
                height: '60px',
                border: '4px solid #f3f4f6',
                borderTop: `4px solid ${categoria.color}`,
                borderRadius: '50%',
                margin: '0 auto 20px',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ color: '#6b7280' }}>Generando código QR...</p>
            </div>
          ) : (
            <>
              {/* Header con Logo y Certificación */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '16px',
                    backgroundColor: categoria.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 16px ${categoria.color}20`
                  }}>
                    <Icon size={40} style={{ color: categoria.color }} />
                  </div>
                  {comercio.certificado && (
                    <div style={{
                      padding: '8px 16px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      animation: 'pulse 2s infinite'
                    }}>
                      <Shield size={16} />
                      Certificado Pet Friendly
                    </div>
                  )}
                </div>
                
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: '800',
                  color: '#111827',
                  margin: '0 0 8px 0'
                }}>{comercio.nombre}</h2>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  color: '#6b7280',
                  fontSize: '0.875rem'
                }}>
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: categoria.lightBg,
                    color: categoria.color,
                    borderRadius: '12px',
                    fontWeight: '500'
                  }}>
                    {categoria.label}
                  </span>
                  <span>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={16} style={{ color: '#fbbf24' }} />
                    <span style={{ fontWeight: '600' }}>4.8</span>
                    <span>(127 reseñas)</span>
                  </div>
                </div>
              </div>

              {/* Toggle Estilo QR */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '24px'
              }}>
                <button
                  onClick={() => setQrStyle('petfriendly')}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: qrStyle === 'petfriendly' ? categoria.color : '#f3f4f6',
                    color: qrStyle === 'petfriendly' ? 'white' : '#6b7280',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Heart size={16} />
                  Diseño Pet Friendly
                </button>
                <button
                  onClick={() => setQrStyle('classic')}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: qrStyle === 'classic' ? '#374151' : '#f3f4f6',
                    color: qrStyle === 'classic' ? 'white' : '#6b7280',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  Clásico
                </button>
              </div>

              {/* QR Code con decoración */}
              <div style={{
                background: `linear-gradient(135deg, ${categoria.bg} 0%, white 100%)`,
                borderRadius: '20px',
                padding: '32px',
                marginBottom: '32px',
                position: 'relative',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
              }}>
                {/* Decorative paws */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  opacity: 0.2,
                  transform: 'rotate(-15deg)'
                }}>
                  🐾
                </div>
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  opacity: 0.2,
                  transform: 'rotate(15deg)'
                }}>
                  🐾
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  opacity: 0.2,
                  transform: 'rotate(15deg)'
                }}>
                  🐾
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  opacity: 0.2,
                  transform: 'rotate(-15deg)'
                }}>
                  🐾
                </div>

                <div id="qr-canvas" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  {qrStyle === 'petfriendly' ? (
                    <QRPetFriendly
                      url={`${process.env.NEXT_PUBLIC_URL || 'https://4tlixco.vercel.app'}/comercios/${comercio.slug}`}
                      size={280}
                      color={categoria.color}
                      backgroundColor={categoria.bg}
                      comercioNombre={comercio.nombre}
                    />
                  ) : qrData && (
                    <img
                      src={qrData.dataUrl}
                      alt="QR Code"
                      style={{
                        width: '280px',
                        height: '280px',
                        borderRadius: '12px'
                      }}
                    />
                  )}
                </div>
                
                <p style={{
                  textAlign: 'center',
                  marginTop: '20px',
                  fontSize: '1rem',
                  color: '#374151',
                  fontWeight: '500',
                  fontStyle: 'italic'
                }}>
                  "Escanea y descubre un lugar donde tu mascota es familia"
                </p>
              </div>

              {/* Información del Comercio */}
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MapPin size={20} style={{ color: categoria.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 2px 0' }}>Dirección</p>
                      <p style={{ fontSize: '0.95rem', color: '#111827', margin: 0, fontWeight: '500' }}>
                        {comercio.direccion}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Phone size={20} style={{ color: categoria.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 2px 0' }}>Teléfono</p>
                      <a 
                        href={`tel:${comercio.telefono}`}
                        style={{ 
                          fontSize: '0.95rem', 
                          color: '#111827', 
                          fontWeight: '500',
                          textDecoration: 'none'
                        }}
                      >
                        {comercio.telefono}
                      </a>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Clock size={20} style={{ color: categoria.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 2px 0' }}>Horarios</p>
                      <p style={{ fontSize: '0.95rem', color: '#111827', margin: 0, fontWeight: '500' }}>
                        {comercio.horarios}
                        {isOpenNow && (
                          <span style={{
                            marginLeft: '8px',
                            padding: '2px 8px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            Abierto ahora
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Servicios Pet Friendly */}
              <div style={{
                backgroundColor: '#f0fdf4',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid #bbf7d0'
              }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#065f46',
                  margin: '0 0 16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Heart size={20} />
                  Servicios Pet Friendly
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {services.map((service, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.875rem',
                      color: '#047857'
                    }}>
                      <CheckCircle size={16} style={{ flexShrink: 0, color: '#10b981' }} />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de Acción */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '24px'
              }}>
                <button
                  onClick={() => downloadQR('png')}
                  style={{
                    padding: '12px',
                    backgroundColor: categoria.color,
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <Download size={18} />
                  Descargar PNG
                </button>
                
                <button
                  onClick={() => downloadQR('svg')}
                  style={{
                    padding: '12px',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = categoria.color
                    e.currentTarget.style.color = categoria.color
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb'
                    e.currentTarget.style.color = '#374151'
                  }}
                >
                  <Download size={18} />
                  Descargar SVG
                </button>
                
                <button
                  onClick={openInMaps}
                  style={{
                    padding: '12px',
                    backgroundColor: '#4285f4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(66,133,244,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <Navigation size={18} />
                  Cómo llegar
                </button>
                
                <button
                  style={{
                    padding: '12px',
                    backgroundColor: '#fbbf24',
                    color: '#78350f',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(251,191,36,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <MessageCircle size={18} />
                  Dejar reseña
                </button>
              </div>

              {/* Compartir */}
              <div style={{
                backgroundColor: '#eff6ff',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <h4 style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#1e40af',
                  margin: '0 0 12px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Share2 size={18} />
                  Comparte este lugar Pet Friendly
                </h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => shareOn('whatsapp')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#25d366',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.813rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => shareOn('facebook')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#1877f2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.813rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => shareOn('copy')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: copied ? '#10b981' : '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.813rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.3s'
                    }}
                  >
                    <Copy size={14} />
                    {copied ? 'Copiado!' : 'Copiar enlace'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}