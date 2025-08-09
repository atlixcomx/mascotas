'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Search, 
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Globe,
  CheckCircle2,
  BarChart3,
  Building2,
  Filter,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  TrendingUp,
  QrCode,
  Eye,
  ChevronDown,
  MoreVertical,
  Store,
  Coffee,
  Trees,
  Utensils,
  ShoppingBag,
  Hotel,
  Stethoscope,
  Download,
  Calendar,
  Activity
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

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  trend,
  percentage,
  subtitle
}: { 
  title: string
  value: number | string
  icon: any
  color?: string
  trend?: 'up' | 'down'
  percentage?: number
  subtitle?: string
}) {
  const colorStyles = {
    blue: { bg: '#eff6ff', color: '#2563eb' },
    green: { bg: '#f0fdf4', color: '#16a34a' },
    yellow: { bg: '#fefce8', color: '#ca8a04' },
    purple: { bg: '#faf5ff', color: '#9333ea' },
    red: { bg: '#fee2e2', color: '#dc2626' },
    cyan: { bg: '#e0f2fe', color: '#0891b2' }
  }

  const style = colorStyles[color as keyof typeof colorStyles] || colorStyles.blue

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      transition: 'all 0.3s ease',
      height: '100%'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
      e.currentTarget.style.transform = 'translateY(0)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: '0 0 8px 0',
            fontWeight: '500'
          }}>{title}</p>
          <p style={{
            fontSize: '2.25rem',
            fontWeight: '700',
            color: '#111827',
            margin: 0,
            lineHeight: 1.2
          }}>{value}</p>
          {subtitle && (
            <p style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              marginTop: '4px'
            }}>{subtitle}</p>
          )}
          {trend && percentage !== undefined && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              marginTop: '12px',
              backgroundColor: trend === 'up' ? '#f0fdf4' : '#fef2f2',
              padding: '4px 8px',
              borderRadius: '6px',
              width: 'fit-content'
            }}>
              <TrendingUp 
                size={14} 
                style={{ 
                  color: trend === 'up' ? '#16a34a' : '#dc2626',
                  transform: trend === 'down' ? 'rotate(180deg)' : 'none'
                }}
              />
              <span style={{
                fontSize: '0.75rem',
                color: trend === 'up' ? '#16a34a' : '#dc2626',
                fontWeight: '600'
              }}>
                {percentage}% vs mes anterior
              </span>
            </div>
          )}
        </div>
        <div style={{
          padding: '14px',
          borderRadius: '12px',
          backgroundColor: style.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={26} style={{ color: style.color, strokeWidth: 2.5 }} />
        </div>
      </div>
    </div>
  )
}

export default function ComerciosPage() {
  const [comercios, setComercios] = useState<Comercio[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState('todos')
  const [selectedEstado, setSelectedEstado] = useState('todos')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [sortBy, setSortBy] = useState('fecha_desc')
  const [selectedComercios, setSelectedComercios] = useState<string[]>([])
  const [showActions, setShowActions] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchComercios()
  }, [])

  async function fetchComercios() {
    try {
      const response = await fetch('/api/admin/comercios')
      if (response.ok) {
        const data = await response.json()
        setComercios(data)
      }
    } catch (error) {
      console.error('Error fetching comercios:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleEstado(id: string, activo: boolean) {
    try {
      const response = await fetch(`/api/admin/comercios/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !activo })
      })

      if (response.ok) {
        await fetchComercios()
      }
    } catch (error) {
      console.error('Error updating comercio:', error)
    }
  }

  async function deleteComercio(id: string) {
    if (!confirm('¿Estás seguro de eliminar este comercio?')) return

    try {
      const response = await fetch(`/api/admin/comercios/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchComercios()
      }
    } catch (error) {
      console.error('Error deleting comercio:', error)
    }
  }

  const comerciosFiltrados = comercios.filter(comercio => {
    const matchSearch = comercio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       comercio.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       comercio.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategoria = selectedCategoria === 'todos' || comercio.categoria === selectedCategoria
    const matchEstado = selectedEstado === 'todos' || 
                       (selectedEstado === 'activos' && comercio.activo) ||
                       (selectedEstado === 'inactivos' && !comercio.activo) ||
                       (selectedEstado === 'certificados' && comercio.certificado)
    
    return matchSearch && matchCategoria && matchEstado
  })

  // Ordenar comercios
  const comerciosOrdenados = [...comerciosFiltrados].sort((a, b) => {
    switch (sortBy) {
      case 'fecha_desc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'fecha_asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'nombre_asc':
        return a.nombre.localeCompare(b.nombre)
      case 'nombre_desc':
        return b.nombre.localeCompare(a.nombre)
      case 'escaneos_desc':
        return b.qrEscaneos - a.qrEscaneos
      default:
        return 0
    }
  })

  const totalComercios = comercios.length
  const comerciosActivos = comercios.filter(c => c.activo).length
  const comerciosCertificados = comercios.filter(c => c.certificado).length
  const totalEscaneos = comercios.reduce((sum, c) => sum + c.qrEscaneos, 0)
  const totalConversiones = comercios.reduce((sum, c) => sum + c.conversiones, 0)
  const tasaConversion = totalEscaneos > 0 ? ((totalConversiones / totalEscaneos) * 100).toFixed(1) : '0'

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
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Cargando comercios...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: '#111827',
              margin: '0 0 8px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Building2 size={36} style={{ color: '#3b82f6' }} />
              Comercios Aliados
            </h1>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              margin: 0
            }}>Gestiona los comercios pet friendly de Atlixco</p>
          </div>
          <Link
            href="/admin/comercios/nuevo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
          >
            <Plus size={20} />
            Agregar Comercio
          </Link>
        </div>

        {/* Métricas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <MetricCard
            title="Total Comercios"
            value={totalComercios}
            icon={Building2}
            color="blue"
            subtitle="En el directorio"
          />
          <MetricCard
            title="Comercios Activos"
            value={comerciosActivos}
            icon={Activity}
            color="green"
            trend="up"
            percentage={12}
          />
          <MetricCard
            title="Certificados"
            value={comerciosCertificados}
            icon={ShieldCheck}
            color="purple"
            subtitle="Pet Friendly verificados"
          />
          <MetricCard
            title="QR Escaneos"
            value={totalEscaneos.toLocaleString()}
            icon={QrCode}
            color="yellow"
            trend="up"
            percentage={8}
          />
          <MetricCard
            title="Conversiones"
            value={totalConversiones}
            icon={TrendingUp}
            color="cyan"
            subtitle={`${tasaConversion}% tasa de conversión`}
          />
        </div>

        {/* Barra de búsqueda y filtros */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: showAdvancedFilters ? '16px' : '0'
          }}>
            {/* Búsqueda */}
            <div style={{ position: 'relative', gridColumn: 'span 2' }}>
              <Search 
                size={20} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} 
              />
              <input
                type="text"
                placeholder="Buscar por nombre, descripción o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '44px',
                  paddingRight: '16px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
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

            {/* Categoría */}
            <select
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
              style={{
                padding: '12px 16px',
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
              <option value="todos">Todas las categorías</option>
              {Object.entries(categoriaConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>

            {/* Estado */}
            <select
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
              style={{
                padding: '12px 16px',
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
              <option value="todos">Todos los estados</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
              <option value="certificados">Certificados</option>
            </select>

            {/* Ordenar */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '12px 16px',
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
              <option value="fecha_desc">Más recientes</option>
              <option value="fecha_asc">Más antiguos</option>
              <option value="nombre_asc">Nombre A-Z</option>
              <option value="nombre_desc">Nombre Z-A</option>
              <option value="escaneos_desc">Más escaneados</option>
            </select>

            {/* Botón de filtros avanzados */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 16px',
                fontSize: '0.875rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb'
                e.currentTarget.style.color = '#374151'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.color = '#6b7280'
              }}
            >
              <Filter size={16} />
              Filtros
              <ChevronDown 
                size={16} 
                style={{
                  transform: showAdvancedFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}
              />
            </button>
          </div>

          {/* Filtros avanzados */}
          {showAdvancedFilters && (
            <div style={{
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb',
              marginTop: '16px'
            }}>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280', 
                marginBottom: '12px',
                fontWeight: '500'
              }}>
                Próximamente: Filtros por ubicación, horarios y servicios específicos
              </p>
            </div>
          )}
        </div>

        {/* Resultados y acciones */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <p style={{
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            {comerciosOrdenados.length} comercios encontrados
          </p>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '8px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: viewMode === 'grid' ? '#3b82f6' : 'white',
                color: viewMode === 'grid' ? 'white' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="6" height="6" />
                <rect x="9" y="1" width="6" height="6" />
                <rect x="1" y="9" width="6" height="6" />
                <rect x="9" y="9" width="6" height="6" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '8px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: viewMode === 'list' ? '#3b82f6' : 'white',
                color: viewMode === 'list' ? 'white' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="2" width="14" height="2" />
                <rect x="1" y="7" width="14" height="2" />
                <rect x="1" y="12" width="14" height="2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Lista de comercios */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: viewMode === 'grid' 
            ? 'repeat(auto-fill, minmax(380px, 1fr))' 
            : '1fr',
          gap: '24px'
        }}>
          {comerciosOrdenados.map((comercio) => {
            const categoria = categoriaConfig[comercio.categoria] || categoriaConfig.otro
            const Icon = categoria.icon

            return (
              <div 
                key={comercio.id} 
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Header con categoría */}
                <div style={{
                  backgroundColor: categoria.lightBg,
                  padding: '20px',
                  borderBottom: `1px solid ${categoria.bg}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        backgroundColor: categoria.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={28} style={{ color: categoria.color }} />
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          color: '#111827',
                          margin: '0 0 4px 0'
                        }}>{comercio.nombre}</h3>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          margin: 0
                        }}>{comercio.codigo} • {categoria.label}</p>
                      </div>
                    </div>
                    {comercio.certificado && (
                      <div style={{
                        backgroundColor: '#dbeafe',
                        padding: '6px 10px',
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
                  </div>
                </div>

                {/* Contenido */}
                <div style={{ padding: '20px' }}>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#4b5563',
                    marginBottom: '16px',
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {comercio.descripcion}
                  </p>

                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '8px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} style={{ color: '#9ca3af' }} />
                      <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                        {comercio.direccion}
                      </span>
                    </div>
                    {comercio.telefono && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone size={16} style={{ color: '#9ca3af' }} />
                        <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                          {comercio.telefono}
                        </span>
                      </div>
                    )}
                    {comercio.website && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Globe size={16} style={{ color: '#9ca3af' }} />
                        <a 
                          href={comercio.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            fontSize: '0.813rem', 
                            color: '#3b82f6',
                            textDecoration: 'none'
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >
                          {comercio.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Estadísticas */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <QrCode size={14} style={{ color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>QR Escaneos</span>
                      </div>
                      <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                        {comercio.qrEscaneos.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <TrendingUp size={14} style={{ color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Conversiones</span>
                      </div>
                      <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                        {comercio.conversiones}
                      </p>
                    </div>
                  </div>

                  {/* Footer con estado y acciones */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <span style={{
                      padding: '6px 12px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      borderRadius: '6px',
                      backgroundColor: comercio.activo ? '#dcfce7' : '#f3f4f6',
                      color: comercio.activo ? '#166534' : '#4b5563'
                    }}>
                      {comercio.activo ? 'Activo' : 'Inactivo'}
                    </span>

                    <div style={{ 
                      display: 'flex', 
                      gap: '4px',
                      position: 'relative'
                    }}>
                      <Link
                        href={`/admin/comercios/${comercio.id}`}
                        style={{
                          padding: '8px',
                          borderRadius: '6px',
                          backgroundColor: '#f3f4f6',
                          color: '#6b7280',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e5e7eb'
                          e.currentTarget.style.color = '#374151'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f3f4f6'
                          e.currentTarget.style.color = '#6b7280'
                        }}
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowActions(showActions === comercio.id ? null : comercio.id)
                        }}
                        style={{
                          padding: '8px',
                          borderRadius: '6px',
                          backgroundColor: '#f3f4f6',
                          color: '#6b7280',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e5e7eb'
                          e.currentTarget.style.color = '#374151'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f3f4f6'
                          e.currentTarget.style.color = '#6b7280'
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Menú de acciones */}
                      {showActions === comercio.id && (
                        <div style={{
                          position: 'absolute',
                          right: 0,
                          top: '100%',
                          marginTop: '4px',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          border: '1px solid #e5e7eb',
                          padding: '8px',
                          minWidth: '160px',
                          zIndex: 10
                        }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleEstado(comercio.id, comercio.activo)
                              setShowActions(null)
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              padding: '8px 12px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: '#374151',
                              fontSize: '0.875rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              textAlign: 'left'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f3f4f6'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            <Activity size={16} />
                            {comercio.activo ? 'Desactivar' : 'Activar'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteComercio(comercio.id)
                              setShowActions(null)
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              padding: '8px 12px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: '#dc2626',
                              fontSize: '0.875rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              textAlign: 'left'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#fee2e2'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            <Trash2 size={16} />
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {comerciosOrdenados.length === 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <Building2 size={48} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
            <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '8px' }}>
              No se encontraron comercios
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              Intenta ajustar los filtros o agrega un nuevo comercio
            </p>
          </div>
        )}

        {/* Estilos globales para animaciones */}
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
}