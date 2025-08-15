'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { 
  X, Download, Copy, CheckCircle, QrCode, Store,
  Calendar, Eye, TrendingUp, Shield, Info, FileText,
  Image as ImageIcon, Code, Palette
} from 'lucide-react'

// Importar componentes QR dinámicamente
const QRPetFriendly = dynamic(() => import('@/components/QRPetFriendly'), { ssr: false })
const QRPetFriendlyEnhanced = dynamic(() => import('@/components/QRPetFriendlyEnhanced'), { ssr: false })

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

interface QRModalAdminProps {
  comercio: Comercio
  isOpen: boolean
  onClose: () => void
  categoriaConfig: any
}

export default function QRModalAdmin({ 
  comercio, 
  isOpen, 
  onClose,
  categoriaConfig 
}: QRModalAdminProps) {
  const [qrData, setQrData] = useState<{dataUrl: string, svg: string} | null>(null)
  const [loadingQR, setLoadingQR] = useState(false)
  const [qrStyle, setQrStyle] = useState<'classic' | 'petfriendly'>('petfriendly')
  const [copied, setCopied] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg' | 'pdf'>('png')

  const categoria = categoriaConfig[comercio.categoria] || categoriaConfig.otro
  const Icon = categoria.icon

  useEffect(() => {
    if (isOpen) {
      generateQR()
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

  function downloadQR(format: 'png' | 'svg' | 'pdf') {
    if (qrStyle === 'petfriendly' && format === 'png') {
      // Buscar el canvas dentro del componente QRPetFriendlyEnhanced
      const canvases = document.querySelectorAll('#qr-canvas canvas')
      const canvas = canvases[canvases.length - 1] as HTMLCanvasElement // Tomar el último canvas generado
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.download = `QR-${comercio.codigo}-${comercio.nombre.replace(/\s+/g, '-')}-PetFriendly-Enhanced.png`
            link.href = url
            link.click()
            URL.revokeObjectURL(url)
          }
        })
      } else {
        // Fallback: usar la imagen generada
        const img = document.querySelector('#qr-canvas img') as HTMLImageElement
        if (img) {
          const link = document.createElement('a')
          link.download = `QR-${comercio.codigo}-${comercio.nombre.replace(/\s+/g, '-')}-PetFriendly-Enhanced.png`
          link.href = img.src
          link.click()
        }
      }
    } else if (qrData) {
      if (format === 'png') {
        const link = document.createElement('a')
        link.download = `QR-${comercio.codigo}-${comercio.nombre.replace(/\s+/g, '-')}.png`
        link.href = qrData.dataUrl
        link.click()
      } else if (format === 'svg') {
        const blob = new Blob([qrData.svg], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `QR-${comercio.codigo}-${comercio.nombre.replace(/\s+/g, '-')}.svg`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
      } else if (format === 'pdf') {
        // Aquí se podría implementar generación de PDF con el QR
        alert('La descarga en PDF estará disponible próximamente')
      }
    }
  }

  function copyLink() {
    const url = `${process.env.NEXT_PUBLIC_URL || 'https://4tlixco.vercel.app'}/comercios/${comercio.slug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          maxWidth: '720px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px 24px 0',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                backgroundColor: categoria.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={24} style={{ color: categoria.color }} />
              </div>
              <div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#111827',
                  margin: '0 0 4px 0'
                }}>
                  Código QR - {comercio.nombre}
                </h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  <span>Código: {comercio.codigo}</span>
                  {comercio.certificado && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      <Shield size={12} />
                      Certificado
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={20} style={{ color: '#6b7280' }} />
            </button>
          </div>

          {/* Tabs de estilo */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '20px'
          }}>
            <button
              onClick={() => setQrStyle('petfriendly')}
              style={{
                padding: '8px 16px',
                backgroundColor: qrStyle === 'petfriendly' ? '#f3f4f6' : 'transparent',
                border: 'none',
                borderBottom: qrStyle === 'petfriendly' ? `2px solid ${categoria.color}` : '2px solid transparent',
                fontSize: '0.875rem',
                fontWeight: qrStyle === 'petfriendly' ? '600' : '500',
                color: qrStyle === 'petfriendly' ? categoria.color : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Palette size={16} />
              Diseño Pet Friendly
            </button>
            <button
              onClick={() => setQrStyle('classic')}
              style={{
                padding: '8px 16px',
                backgroundColor: qrStyle === 'classic' ? '#f3f4f6' : 'transparent',
                border: 'none',
                borderBottom: qrStyle === 'classic' ? '2px solid #374151' : '2px solid transparent',
                fontSize: '0.875rem',
                fontWeight: qrStyle === 'classic' ? '600' : '500',
                color: qrStyle === 'classic' ? '#374151' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Code size={16} />
              QR Clásico
            </button>
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          {loadingQR ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid #f3f4f6',
                borderTop: `4px solid ${categoria.color}`,
                borderRadius: '50%',
                margin: '0 auto 16px',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ color: '#6b7280' }}>Generando código QR...</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px'
            }}>
              {/* Columna izquierda - QR */}
              <div>
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  border: '1px solid #e5e7eb'
                }}>
                  <div id="qr-canvas" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    {qrStyle === 'petfriendly' ? (
                      <QRPetFriendlyEnhanced
                        url={`${process.env.NEXT_PUBLIC_URL || 'https://4tlixco.vercel.app'}/comercios/${comercio.slug}`}
                        size={260}
                        color={categoria.color}
                        backgroundColor={categoria.lightBg || categoria.bg}
                        comercioNombre={comercio.nombre}
                        codigo={comercio.codigo}
                        categoria={comercio.categoria}
                      />
                    ) : qrData && (
                      <img
                        src={qrData.dataUrl}
                        alt="QR Code"
                        style={{
                          width: '280px',
                          height: '280px',
                          borderRadius: '8px'
                        }}
                      />
                    )}
                  </div>
                  
                  {/* URL del QR */}
                  <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '0.813rem',
                    color: '#6b7280',
                    wordBreak: 'break-all',
                    fontFamily: 'monospace'
                  }}>
                    {`${process.env.NEXT_PUBLIC_URL || 'https://4tlixco.vercel.app'}/comercios/${comercio.slug}`}
                  </div>
                </div>

                {/* Opciones de descarga */}
                <div style={{
                  marginTop: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    margin: '0 0 12px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Download size={16} />
                    Opciones de Descarga
                  </h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => downloadQR('png')}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.813rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                    >
                      <ImageIcon size={14} />
                      PNG
                    </button>
                    <button
                      onClick={() => downloadQR('svg')}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        backgroundColor: 'white',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.813rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb'
                        e.currentTarget.style.borderColor = '#9ca3af'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white'
                        e.currentTarget.style.borderColor = '#d1d5db'
                      }}
                    >
                      <Code size={14} />
                      SVG
                    </button>
                    <button
                      onClick={() => downloadQR('pdf')}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        backgroundColor: 'white',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.813rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb'
                        e.currentTarget.style.borderColor = '#9ca3af'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white'
                        e.currentTarget.style.borderColor = '#d1d5db'
                      }}
                    >
                      <FileText size={14} />
                      PDF
                    </button>
                  </div>
                  <button
                    onClick={copyLink}
                    style={{
                      width: '100%',
                      marginTop: '8px',
                      padding: '8px 12px',
                      backgroundColor: copied ? '#10b981' : '#f3f4f6',
                      color: copied ? 'white' : '#374151',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.813rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                    {copied ? 'Enlace copiado' : 'Copiar enlace'}
                  </button>
                </div>
              </div>

              {/* Columna derecha - Información */}
              <div>
                {/* Información del comercio */}
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    margin: '0 0 12px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Info size={16} />
                    Información del Comercio
                  </h4>
                  <div style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500', color: '#374151' }}>Categoría:</span>{' '}
                      {categoria.label}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500', color: '#374151' }}>Dirección:</span>{' '}
                      {comercio.direccion}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500', color: '#374151' }}>Teléfono:</span>{' '}
                      {comercio.telefono}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500', color: '#374151' }}>Horarios:</span>{' '}
                      {comercio.horarios}
                    </div>
                    {comercio.certificado && (
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ fontWeight: '500', color: '#374151' }}>Fecha certificación:</span>{' '}
                        {comercio.fechaCert ? new Date(comercio.fechaCert).toLocaleDateString() : 'N/A'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Estadísticas */}
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    margin: '0 0 12px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <TrendingUp size={16} />
                    Estadísticas de Uso
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px'
                  }}>
                    <div style={{
                      backgroundColor: 'white',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: '#3b82f6'
                      }}>
                        {comercio.qrEscaneos?.toLocaleString() || 0}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginTop: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Eye size={12} />
                        Escaneos QR
                      </div>
                    </div>
                    <div style={{
                      backgroundColor: 'white',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: '#10b981'
                      }}>
                        {comercio.conversiones?.toLocaleString() || 0}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginTop: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <CheckCircle size={12} />
                        Conversiones
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instrucciones de uso */}
                <div style={{
                  backgroundColor: '#eff6ff',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #bfdbfe'
                }}>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1e40af',
                    margin: '0 0 8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <QrCode size={16} />
                    Uso del Código QR
                  </h4>
                  <ul style={{
                    margin: 0,
                    paddingLeft: '20px',
                    fontSize: '0.813rem',
                    color: '#3730a3',
                    lineHeight: '1.6'
                  }}>
                    <li>Imprime el código en alta calidad (300 DPI recomendado)</li>
                    <li>Colócalo en un lugar visible del establecimiento</li>
                    <li>Asegúrate de que tenga buena iluminación</li>
                    <li>Tamaño mínimo recomendado: 10x10 cm</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}