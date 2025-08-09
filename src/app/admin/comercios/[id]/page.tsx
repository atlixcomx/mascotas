'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  CheckCircle2,
  Building2,
  Save,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Shield,
  QrCode,
  TrendingUp,
  Calendar,
  AlertCircle,
  Store,
  Coffee,
  Trees,
  Utensils,
  ShoppingBag,
  Hotel,
  Stethoscope,
  Info,
  Activity,
  ChevronRight,
  XCircle
} from 'lucide-react'

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

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color = '#3b82f6',
  subtitle
}: { 
  title: string
  value: number | string
  icon: any
  color?: string
  subtitle?: string
}) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      textAlign: 'center'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: color + '20',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 12px'
      }}>
        <Icon size={24} style={{ color }} />
      </div>
      <p style={{
        fontSize: '2rem',
        fontWeight: '700',
        color: '#111827',
        margin: '0 0 4px 0'
      }}>{value}</p>
      <p style={{
        fontSize: '0.875rem',
        color: '#6b7280',
        margin: '0 0 4px 0'
      }}>{title}</p>
      {subtitle && (
        <p style={{
          fontSize: '0.75rem',
          color: '#9ca3af',
          margin: 0
        }}>{subtitle}</p>
      )}
    </div>
  )
}

export default function EditarComercioPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [comercio, setComercio] = useState<Comercio | null>(null)
  const [activeTab, setActiveTab] = useState('informacion')
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'otro',
    logo: '',
    descripcion: '',
    direccion: '',
    telefono: '',
    email: '',
    website: '',
    horarios: '',
    servicios: '',
    restricciones: '',
    latitud: '',
    longitud: '',
    certificado: false,
    fechaCert: '',
    activo: true
  })

  useEffect(() => {
    fetchComercio()
  }, [params.id])

  async function fetchComercio() {
    try {
      const response = await fetch(`/api/admin/comercios/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setComercio(data)
        setFormData({
          nombre: data.nombre,
          categoria: data.categoria,
          logo: data.logo || '',
          descripcion: data.descripcion,
          direccion: data.direccion,
          telefono: data.telefono,
          email: data.email || '',
          website: data.website || '',
          horarios: data.horarios,
          servicios: data.servicios,
          restricciones: data.restricciones || '',
          latitud: data.latitud?.toString() || '',
          longitud: data.longitud?.toString() || '',
          certificado: data.certificado,
          fechaCert: data.fechaCert ? new Date(data.fechaCert).toISOString().split('T')[0] : '',
          activo: data.activo
        })
      } else {
        router.push('/admin/comercios')
      }
    } catch (error) {
      console.error('Error fetching comercio:', error)
      router.push('/admin/comercios')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/comercios/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/admin/comercios')
      } else {
        const error = await response.json()
        alert(error.error || 'Error al actualizar comercio')
      }
    } catch (error) {
      console.error('Error updating comercio:', error)
      alert('Error al actualizar comercio')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #e5e7eb',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Cargando comercio...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!comercio) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <XCircle size={48} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>Comercio no encontrado</p>
          <Link
            href="/admin/comercios"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '16px',
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            <ArrowLeft size={16} />
            Volver a comercios
          </Link>
        </div>
      </div>
    )
  }

  const categoria = categoriaConfig[comercio.categoria as keyof typeof categoriaConfig] || categoriaConfig.otro
  const Icon = categoria.icon
  const tasaConversion = comercio.qrEscaneos > 0 
    ? ((comercio.conversiones / comercio.qrEscaneos) * 100).toFixed(1) 
    : '0'

  const tabs = [
    { id: 'informacion', label: 'Información General', icon: Info },
    { id: 'servicios', label: 'Servicios y Horarios', icon: Clock },
    { id: 'ubicacion', label: 'Ubicación y Contacto', icon: MapPin },
    { id: 'certificacion', label: 'Certificación', icon: Shield }
  ]

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <Link 
            href="/admin/comercios"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '0.875rem',
              marginBottom: '16px',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#374151'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            <ArrowLeft size={20} />
            Volver a Comercios
          </Link>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                backgroundColor: categoria.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={32} style={{ color: categoria.color }} />
              </div>
              <div>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#111827',
                  margin: '0 0 4px 0'
                }}>{comercio.nombre}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {comercio.codigo} • {categoria.label}
                  </span>
                  {comercio.certificado && (
                    <div style={{
                      backgroundColor: '#dbeafe',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <CheckCircle2 size={14} style={{ color: '#2563eb' }} />
                      <span style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: '500' }}>
                        Certificado
                      </span>
                    </div>
                  )}
                  <div style={{
                    backgroundColor: comercio.activo ? '#dcfce7' : '#f3f4f6',
                    padding: '4px 8px',
                    borderRadius: '6px'
                  }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: comercio.activo ? '#166534' : '#4b5563',
                      fontWeight: '500'
                    }}>
                      {comercio.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => router.push('/admin/comercios')}
                style={{
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
                onClick={handleSubmit}
                disabled={saving}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.5 : 1,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!saving) e.currentTarget.style.backgroundColor = '#2563eb'
                }}
                onMouseLeave={(e) => {
                  if (!saving) e.currentTarget.style.backgroundColor = '#3b82f6'
                }}
              >
                <Save size={16} />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <StatCard
            title="QR Escaneos"
            value={comercio.qrEscaneos.toLocaleString()}
            icon={QrCode}
            color="#f59e0b"
          />
          <StatCard
            title="Conversiones"
            value={comercio.conversiones}
            icon={TrendingUp}
            color="#10b981"
          />
          <StatCard
            title="Tasa de Conversión"
            value={`${tasaConversion}%`}
            icon={Activity}
            color="#8b5cf6"
          />
          <StatCard
            title="Miembro desde"
            value={new Date(comercio.createdAt).toLocaleDateString('es-MX', { 
              month: 'short', 
              year: 'numeric' 
            })}
            icon={Calendar}
            color="#6b7280"
            subtitle={`${Math.floor((Date.now() - new Date(comercio.createdAt).getTime()) / (1000 * 60 * 60 * 24))} días`}
          />
        </div>

        {/* Tabs */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '8px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          display: 'flex',
          gap: '4px'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#eff6ff' : 'transparent',
                color: activeTab === tab.id ? '#2563eb' : '#6b7280',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flex: 1
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = '#f9fafb'
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <tab.icon size={18} />
              <span style={{ display: window.innerWidth > 768 ? 'inline' : 'none' }}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            {/* Tab: Información General */}
            {activeTab === 'informacion' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h2 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Info size={20} />
                    Información Básica
                  </h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Nombre del Comercio *
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        required
                        value={formData.nombre}
                        onChange={handleChange}
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
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Categoría *
                      </label>
                      <select
                        name="categoria"
                        required
                        value={formData.categoria}
                        onChange={handleChange}
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
                        {Object.entries(categoriaConfig).map(([key, config]) => (
                          <option key={key} value={key}>{config.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Descripción *
                    </label>
                    <textarea
                      name="descripcion"
                      required
                      rows={4}
                      value={formData.descripcion}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '0.875rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        outline: 'none',
                        resize: 'vertical',
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
                      placeholder="Describe brevemente el comercio y sus servicios pet friendly..."
                    />
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      URL del Logo
                    </label>
                    <input
                      type="url"
                      name="logo"
                      value={formData.logo}
                      onChange={handleChange}
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
                      placeholder="https://ejemplo.com/logo.jpg"
                    />
                  </div>

                  <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        name="activo"
                        checked={formData.activo}
                        onChange={handleChange}
                        style={{
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer',
                          accentColor: '#3b82f6'
                        }}
                      />
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                        Comercio Activo
                      </span>
                    </label>
                    <div style={{
                      backgroundColor: formData.activo ? '#f0fdf4' : '#fef2f2',
                      padding: '4px 8px',
                      borderRadius: '6px'
                    }}>
                      <span style={{
                        fontSize: '0.75rem',
                        color: formData.activo ? '#166534' : '#991b1b',
                        fontWeight: '500'
                      }}>
                        {formData.activo ? 'Visible en el directorio' : 'Oculto del directorio'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Servicios y Horarios */}
            {activeTab === 'servicios' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h2 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Clock size={20} />
                    Servicios y Horarios
                  </h2>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Horarios de Atención *
                    </label>
                    <textarea
                      name="horarios"
                      required
                      rows={3}
                      value={formData.horarios}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '0.875rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        outline: 'none',
                        resize: 'vertical',
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
                      placeholder="Lunes a Viernes: 9:00 - 18:00&#10;Sábados: 9:00 - 14:00&#10;Domingos: Cerrado"
                    />
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Servicios Pet Friendly *
                    </label>
                    <textarea
                      name="servicios"
                      required
                      rows={4}
                      value={formData.servicios}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '0.875rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        outline: 'none',
                        resize: 'vertical',
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
                      placeholder="- Se permiten mascotas en todas las áreas&#10;- Bebederos disponibles&#10;- Área especial para mascotas&#10;- Personal capacitado"
                    />
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '4px'
                    }}>
                      Describe todos los servicios y facilidades que ofreces para mascotas
                    </p>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Restricciones
                    </label>
                    <textarea
                      name="restricciones"
                      rows={3}
                      value={formData.restricciones}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '0.875rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        outline: 'none',
                        resize: 'vertical',
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
                      placeholder="- Solo perros pequeños y medianos&#10;- Mascotas deben usar correa&#10;- Máximo 2 mascotas por persona"
                    />
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '4px'
                    }}>
                      Especifica cualquier limitación o requerimiento especial
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Ubicación y Contacto */}
            {activeTab === 'ubicacion' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h2 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <MapPin size={20} />
                    Ubicación y Contacto
                  </h2>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Dirección Completa *
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      required
                      value={formData.direccion}
                      onChange={handleChange}
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
                      placeholder="Calle, número, colonia, Atlixco, Puebla"
                    />
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '16px',
                    marginTop: '16px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        required
                        value={formData.telefono}
                        onChange={handleChange}
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
                        placeholder="244 123 4567"
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
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
                        placeholder="contacto@ejemplo.com"
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        <Globe size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Sitio Web
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
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
                        placeholder="https://www.ejemplo.com"
                      />
                    </div>
                  </div>

                  <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <MapPin size={16} />
                      Coordenadas GPS (Opcional)
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.813rem',
                          color: '#6b7280',
                          marginBottom: '4px'
                        }}>
                          Latitud
                        </label>
                        <input
                          type="number"
                          name="latitud"
                          step="any"
                          value={formData.latitud}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            fontSize: '0.875rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            outline: 'none',
                            transition: 'all 0.2s ease'
                          }}
                          placeholder="18.9124"
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.813rem',
                          color: '#6b7280',
                          marginBottom: '4px'
                        }}>
                          Longitud
                        </label>
                        <input
                          type="number"
                          name="longitud"
                          step="any"
                          value={formData.longitud}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            fontSize: '0.875rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            outline: 'none',
                            transition: 'all 0.2s ease'
                          }}
                          placeholder="-98.4316"
                        />
                      </div>
                    </div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '8px'
                    }}>
                      Las coordenadas permiten mostrar el comercio en mapas interactivos
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Certificación */}
            {activeTab === 'certificacion' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h2 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Shield size={20} />
                    Certificación Pet Friendly
                  </h2>
                  
                  <div style={{
                    padding: '24px',
                    backgroundColor: formData.certificado ? '#eff6ff' : '#f9fafb',
                    borderRadius: '12px',
                    border: `1px solid ${formData.certificado ? '#dbeafe' : '#e5e7eb'}`
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      marginBottom: '16px'
                    }}>
                      <input
                        type="checkbox"
                        name="certificado"
                        checked={formData.certificado}
                        onChange={handleChange}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          accentColor: '#3b82f6'
                        }}
                      />
                      <span style={{ 
                        fontSize: '1rem', 
                        fontWeight: '500',
                        color: '#111827' 
                      }}>
                        Certificado como Pet Friendly
                      </span>
                    </label>

                    {formData.certificado && (
                      <>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '16px',
                          padding: '12px',
                          backgroundColor: '#dbeafe',
                          borderRadius: '8px'
                        }}>
                          <CheckCircle2 size={20} style={{ color: '#2563eb' }} />
                          <p style={{
                            margin: 0,
                            fontSize: '0.875rem',
                            color: '#1e40af',
                            fontWeight: '500'
                          }}>
                            Este comercio está verificado como Pet Friendly
                          </p>
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '6px'
                          }}>
                            Fecha de Certificación
                          </label>
                          <input
                            type="date"
                            name="fechaCert"
                            value={formData.fechaCert}
                            onChange={handleChange}
                            style={{
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
                          />
                        </div>
                      </>
                    )}

                    <div style={{
                      marginTop: '20px',
                      paddingTop: '20px',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      <h4 style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '12px'
                      }}>
                        ¿Qué incluye la certificación?
                      </h4>
                      <ul style={{
                        margin: 0,
                        paddingLeft: '20px',
                        fontSize: '0.813rem',
                        color: '#6b7280',
                        lineHeight: 1.6
                      }}>
                        <li>Badge de verificación en el directorio</li>
                        <li>Prioridad en resultados de búsqueda</li>
                        <li>Código QR personalizado para campañas</li>
                        <li>Aparición en la sección de destacados</li>
                        <li>Reporte mensual de estadísticas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div style={{
              marginTop: '32px',
              paddingTop: '32px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#6b7280',
                fontSize: '0.813rem'
              }}>
                <AlertCircle size={16} />
                <span>
                  Última actualización: {new Date(comercio.updatedAt).toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}