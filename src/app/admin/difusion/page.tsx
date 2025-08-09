'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { 
  QrCode,
  Download,
  Copy,
  Check,
  Share2,
  Target,
  MapPin,
  Calendar,
  Users,
  Megaphone,
  BarChart3,
  Plus,
  X,
  Eye,
  Link as LinkIcon,
  School,
  Building2,
  Trees,
  Coffee,
  Store,
  Heart
} from 'lucide-react'

// Importar componente QR dinámicamente para evitar SSR
const QRPetFriendly = dynamic(() => import('@/components/QRPetFriendly'), { ssr: false })

interface Campaign {
  id: string
  nombre: string
  ubicacion: string
  tipo: string
  utm_source: string
  utm_medium: string
  utm_campaign: string
  url: string
  scans: number
  conversiones: number
  fechaCreacion: string
}

const tiposUbicacion = [
  { value: 'universidad', label: 'Universidad', icon: School, color: '#3b82f6' },
  { value: 'plaza', label: 'Plaza Pública', icon: Trees, color: '#16a34a' },
  { value: 'oficina', label: 'Oficina Gubernamental', icon: Building2, color: '#6366f1' },
  { value: 'cafe', label: 'Cafetería', icon: Coffee, color: '#84cc16' },
  { value: 'tienda', label: 'Tienda', icon: Store, color: '#f59e0b' },
  { value: 'otro', label: 'Otro', icon: MapPin, color: '#6b7280' }
]

export default function DifusionPage() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [copied, setCopied] = useState(false)
  const [qrStyle, setQrStyle] = useState<'classic' | 'petfriendly'>('petfriendly')
  
  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    tipo: 'universidad',
    utm_source: '',
    utm_medium: 'qr_code',
    utm_campaign: ''
  })

  // Datos de ejemplo - en producción vendrían de la DB
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      nombre: 'QR BUAP Campus Central',
      ubicacion: 'Benemérita Universidad Autónoma de Puebla',
      tipo: 'universidad',
      utm_source: 'buap',
      utm_medium: 'qr_code',
      utm_campaign: 'adopcion_universitaria_2024',
      url: 'https://4tlixco.vercel.app/catalogo?utm_source=buap&utm_medium=qr_code&utm_campaign=adopcion_universitaria_2024',
      scans: 245,
      conversiones: 12,
      fechaCreacion: '2024-01-15'
    },
    {
      id: '2',
      nombre: 'QR Plaza de Armas',
      ubicacion: 'Plaza de Armas Atlixco',
      tipo: 'plaza',
      utm_source: 'plaza_armas',
      utm_medium: 'qr_code',
      utm_campaign: 'difusion_publica_2024',
      url: 'https://4tlixco.vercel.app/catalogo?utm_source=plaza_armas&utm_medium=qr_code&utm_campaign=difusion_publica_2024',
      scans: 189,
      conversiones: 8,
      fechaCreacion: '2024-01-20'
    }
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Generar UTM campaign si no se especificó
    const utmCampaign = formData.utm_campaign || 
      `${formData.tipo}_${formData.utm_source}_${new Date().getFullYear()}`
    
    // Construir URL con UTMs
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://4tlixco.vercel.app'
    const url = `${baseUrl}/catalogo?utm_source=${formData.utm_source}&utm_medium=${formData.utm_medium}&utm_campaign=${utmCampaign}`
    
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      nombre: formData.nombre,
      ubicacion: formData.ubicacion,
      tipo: formData.tipo,
      utm_source: formData.utm_source,
      utm_medium: formData.utm_medium,
      utm_campaign: utmCampaign,
      url: url,
      scans: 0,
      conversiones: 0,
      fechaCreacion: new Date().toISOString().split('T')[0]
    }
    
    setCampaigns([newCampaign, ...campaigns])
    setShowModal(false)
    resetForm()
    
    // Mostrar QR generado
    setSelectedCampaign(newCampaign)
    setShowQRModal(true)
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      ubicacion: '',
      tipo: 'universidad',
      utm_source: '',
      utm_medium: 'qr_code',
      utm_campaign: ''
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQR = (campaign: Campaign) => {
    if (qrStyle === 'petfriendly') {
      // Para el diseño pet friendly, capturar el canvas
      const canvas = document.querySelector('canvas') as HTMLCanvasElement
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.download = `QR-Difusion-${campaign.utm_source}-${campaign.nombre.replace(/\s+/g, '-')}.png`
            link.href = url
            link.click()
            URL.revokeObjectURL(url)
          }
        })
      }
    }
  }

  const getTipoConfig = (tipo: string) => {
    return tiposUbicacion.find(t => t.value === tipo) || tiposUbicacion[tiposUbicacion.length - 1]
  }

  return (
    <div style={{
      padding: '16px',
      width: '100%',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#0f172a',
          margin: '0 0 4px 0',
          fontFamily: 'Albert Sans, sans-serif'
        }}>Módulo de Difusión</h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#64748b',
          margin: 0,
          fontFamily: 'Poppins, sans-serif'
        }}>Genera códigos QR con tracking para campañas de adopción</p>
      </div>

      {/* Métricas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                margin: '0 0 4px 0',
                fontFamily: 'Poppins, sans-serif'
              }}>Campañas Activas</p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#0f172a',
                margin: 0,
                fontFamily: 'Albert Sans, sans-serif'
              }}>{campaigns.length}</p>
            </div>
            <div style={{
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              color: '#3b82f6'
            }}>
              <Megaphone style={{ width: '20px', height: '20px' }} />
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                margin: '0 0 4px 0',
                fontFamily: 'Poppins, sans-serif'
              }}>Total Escaneos</p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#0f172a',
                margin: 0,
                fontFamily: 'Albert Sans, sans-serif'
              }}>{campaigns.reduce((sum, c) => sum + c.scans, 0)}</p>
            </div>
            <div style={{
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: '#f0fdf4',
              color: '#16a34a'
            }}>
              <QrCode style={{ width: '20px', height: '20px' }} />
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                margin: '0 0 4px 0',
                fontFamily: 'Poppins, sans-serif'
              }}>Conversiones</p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#0f172a',
                margin: 0,
                fontFamily: 'Albert Sans, sans-serif'
              }}>{campaigns.reduce((sum, c) => sum + c.conversiones, 0)}</p>
            </div>
            <div style={{
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: '#fef2f2',
              color: '#dc2626'
            }}>
              <Heart style={{ width: '20px', height: '20px' }} />
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                margin: '0 0 4px 0',
                fontFamily: 'Poppins, sans-serif'
              }}>Tasa Conversión</p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#0f172a',
                margin: 0,
                fontFamily: 'Albert Sans, sans-serif'
              }}>
                {campaigns.reduce((sum, c) => sum + c.scans, 0) > 0 
                  ? `${((campaigns.reduce((sum, c) => sum + c.conversiones, 0) / campaigns.reduce((sum, c) => sum + c.scans, 0)) * 100).toFixed(1)}%`
                  : '0%'
                }
              </p>
            </div>
            <div style={{
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: '#faf5ff',
              color: '#9333ea'
            }}>
              <BarChart3 style={{ width: '20px', height: '20px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Botón crear campaña */}
      <div style={{
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#af1731',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            fontFamily: 'Albert Sans, sans-serif',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7d2447'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#af1731'}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          Nueva Campaña
        </button>
      </div>

      {/* Tabla de campañas */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>CAMPAÑA</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>UBICACIÓN</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>UTM SOURCE</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>ESCANEOS</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>CONVERSIONES</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => {
              const tipoConfig = getTipoConfig(campaign.tipo)
              const Icon = tipoConfig.icon
              return (
                <tr key={campaign.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        backgroundColor: `${tipoConfig.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={20} style={{ color: tipoConfig.color }} />
                      </div>
                      <div>
                        <p style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#0f172a',
                          margin: '0 0 2px 0',
                          fontFamily: 'Albert Sans, sans-serif'
                        }}>{campaign.nombre}</p>
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          margin: 0,
                          fontFamily: 'Poppins, sans-serif'
                        }}>Creada: {campaign.fechaCreacion}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.875rem', color: '#475569', fontFamily: 'Poppins, sans-serif' }}>
                    {campaign.ubicacion}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <code style={{
                      fontSize: '0.813rem',
                      backgroundColor: '#f1f5f9',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      color: '#475569'
                    }}>{campaign.utm_source}</code>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.875rem', color: '#475569', fontFamily: 'Poppins, sans-serif' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Eye size={16} style={{ color: '#6b7280' }} />
                      {campaign.scans}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        <Heart size={12} />
                        {campaign.conversiones}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        ({campaign.scans > 0 ? `${((campaign.conversiones / campaign.scans) * 100).toFixed(0)}%` : '0%'})
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => {
                          setSelectedCampaign(campaign)
                          setShowQRModal(true)
                        }}
                        style={{
                          padding: '6px',
                          backgroundColor: '#eff6ff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                        title="Ver QR"
                      >
                        <QrCode style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
                      </button>
                      <button
                        onClick={() => copyToClipboard(campaign.url)}
                        style={{
                          padding: '6px',
                          backgroundColor: '#f1f5f9',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        title="Copiar URL"
                      >
                        {copied ? <Check style={{ width: '16px', height: '16px', color: '#16a34a' }} /> : <Copy style={{ width: '16px', height: '16px', color: '#64748b' }} />}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal crear campaña */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={() => setShowModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
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

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '24px',
              fontFamily: 'Albert Sans, sans-serif'
            }}>Nueva Campaña de Difusión</h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Nombre de la Campaña *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '0.875rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6'
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb'
                      e.target.style.boxShadow = 'none'
                    }}
                    placeholder="Ej: QR BUAP Campus Central"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Tipo de Ubicación *
                  </label>
                  <select
                    required
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '0.875rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6'
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb'
                      e.target.style.boxShadow = 'none'
                    }}
                  >
                    {tiposUbicacion.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Ubicación Específica *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '0.875rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6'
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb'
                      e.target.style.boxShadow = 'none'
                    }}
                    placeholder="Ej: Benemérita Universidad Autónoma de Puebla"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    UTM Source * <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>(identificador único)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.utm_source}
                    onChange={(e) => setFormData({...formData, utm_source: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '0.875rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      outline: 'none',
                      fontFamily: 'monospace',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6'
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb'
                      e.target.style.boxShadow = 'none'
                    }}
                    placeholder="buap_central"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    UTM Campaign <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.utm_campaign}
                    onChange={(e) => setFormData({...formData, utm_campaign: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '0.875rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      outline: 'none',
                      fontFamily: 'monospace',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6'
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb'
                      e.target.style.boxShadow = 'none'
                    }}
                    placeholder="adopcion_universitaria_2024"
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '8px'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      flex: 1,
                      padding: '10px 20px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      color: '#374151',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                      e.currentTarget.style.borderColor = '#d1d5db'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white'
                      e.currentTarget.style.borderColor = '#e5e7eb'
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                  >
                    <QrCode size={16} />
                    Generar QR
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal QR */}
      {showQRModal && selectedCampaign && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={() => {
          setShowQRModal(false)
          setSelectedCampaign(null)
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setShowQRModal(false)
                setSelectedCampaign(null)
              }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
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

            {/* Header */}
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                backgroundColor: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Share2 size={32} style={{ color: '#dc2626' }} />
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#111827',
                margin: '0 0 4px 0',
                fontFamily: 'Albert Sans, sans-serif'
              }}>{selectedCampaign.nombre}</h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0,
                fontFamily: 'Poppins, sans-serif'
              }}>{selectedCampaign.ubicacion}</p>
            </div>

            {/* Toggle estilo QR */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <button
                onClick={() => setQrStyle('petfriendly')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: qrStyle === 'petfriendly' ? '#af1731' : '#f3f4f6',
                  color: qrStyle === 'petfriendly' ? 'white' : '#6b7280',
                  fontSize: '0.813rem',
                  fontWeight: '500',
                  fontFamily: 'Poppins, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🐾 Diseño Pet Friendly
              </button>
              <button
                onClick={() => setQrStyle('classic')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: qrStyle === 'classic' ? '#374151' : '#f3f4f6',
                  color: qrStyle === 'classic' ? 'white' : '#6b7280',
                  fontSize: '0.813rem',
                  fontWeight: '500',
                  fontFamily: 'Poppins, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Clásico
              </button>
            </div>

            {/* QR Code */}
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              {qrStyle === 'petfriendly' ? (
                <QRPetFriendly
                  url={selectedCampaign.url}
                  size={300}
                  color='#af1731'
                  backgroundColor='#fee2e2'
                  comercioNombre="Adopta en Atlixco"
                />
              ) : (
                <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '8px' }}>
                  <p style={{ color: '#6b7280', fontFamily: 'Poppins, sans-serif' }}>
                    QR Clásico disponible próximamente
                  </p>
                </div>
              )}
            </div>

            {/* URL con UTMs */}
            <div style={{
              backgroundColor: '#f1f5f9',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: '#475569',
              wordBreak: 'break-all',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <LinkIcon size={16} style={{ flexShrink: 0 }} />
              {selectedCampaign.url}
              <button
                onClick={() => copyToClipboard(selectedCampaign.url)}
                style={{
                  marginLeft: 'auto',
                  padding: '4px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
                title="Copiar URL"
              >
                {copied ? <Check size={16} style={{ color: '#16a34a' }} /> : <Copy size={16} />}
              </button>
            </div>

            {/* Acciones */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => downloadQR(selectedCampaign)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  fontFamily: 'Poppins, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                <Download size={16} />
                Descargar QR
              </button>
            </div>

            {/* Info */}
            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <Target size={20} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#1e40af',
                  margin: '0 0 4px 0',
                  fontWeight: '500',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  Tracking UTM activo
                </p>
                <p style={{
                  fontSize: '0.813rem',
                  color: '#3730a3',
                  margin: 0,
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  Este QR incluye parámetros UTM para rastrear el origen de las visitas 
                  y medir la efectividad de la campaña de difusión.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}