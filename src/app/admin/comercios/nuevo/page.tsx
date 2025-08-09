'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Save,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Shield,
  Info,
  Store,
  Coffee,
  Trees,
  Utensils,
  ShoppingBag,
  Hotel,
  Stethoscope,
  Building2,
  Plus
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

export default function NuevoComercioPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    longitud: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/comercios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/admin/comercios')
      } else {
        const error = await response.json()
        alert(error.error || 'Error al crear comercio')
      }
    } catch (error) {
      console.error('Error creating comercio:', error)
      alert('Error al crear comercio')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const tabs = [
    { id: 'informacion', label: 'Información General', icon: Info },
    { id: 'servicios', label: 'Servicios y Horarios', icon: Clock },
    { id: 'ubicacion', label: 'Ubicación y Contacto', icon: MapPin }
  ]

  const selectedCategoria = categoriaConfig[formData.categoria as keyof typeof categoriaConfig] || categoriaConfig.otro
  const CategoriaIcon = selectedCategoria.icon

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
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Plus size={32} style={{ color: '#3b82f6' }} />
              </div>
              <div>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#111827',
                  margin: '0 0 4px 0'
                }}>Nuevo Comercio</h1>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Registra un nuevo comercio pet friendly en el directorio
                </p>
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
                disabled={loading}
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
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#2563eb'
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#3b82f6'
                }}
              >
                <Save size={16} />
                {loading ? 'Guardando...' : 'Guardar Comercio'}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#6b7280',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>Vista Previa</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              backgroundColor: selectedCategoria.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CategoriaIcon size={28} style={{ color: selectedCategoria.color }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 4px 0'
              }}>
                {formData.nombre || 'Nombre del comercio'}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                {selectedCategoria.label} • {formData.direccion || 'Dirección'}
              </p>
            </div>
          </div>
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
              {tab.label}
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
                        placeholder="Ej: Veterinaria San Francisco"
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
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '4px'
                    }}>
                      Opcional: URL de la imagen del logo del comercio
                    </p>
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
                      Opcional: Especifica cualquier limitación o requerimiento especial
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

            {/* Información adicional */}
            <div style={{
              marginTop: '32px',
              paddingTop: '32px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{
                backgroundColor: '#f0f9ff',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <Shield size={20} style={{ color: '#0891b2', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#0c4a6e',
                    margin: '0 0 4px 0',
                    fontWeight: '500'
                  }}>
                    ¿Quieres certificar este comercio como Pet Friendly?
                  </p>
                  <p style={{
                    fontSize: '0.813rem',
                    color: '#075985',
                    margin: 0
                  }}>
                    Una vez creado el comercio, podrás solicitar la certificación oficial 
                    que incluye verificación, badge especial y aparición en destacados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}