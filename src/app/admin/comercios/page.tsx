'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// Importar componente QR dinámicamente para evitar SSR
const QRPetFriendly = dynamic(() => import('@/components/QRPetFriendly'), { ssr: false })
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
  Edit2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
  Activity,
  Star,
  AlertCircle,
  X,
  Share2
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
  color = 'blue'
}: { 
  title: string
  value: number | string
  icon: any
  color?: string
}) {
  const colorStyles = {
    blue: { bg: '#eff6ff', color: '#2563eb' },
    green: { bg: '#f0fdf4', color: '#16a34a' },
    yellow: { bg: '#fefce8', color: '#ca8a04' },
    purple: { bg: '#faf5ff', color: '#9333ea' },
    red: { bg: '#fef2f2', color: '#dc2626' },
    cyan: { bg: '#e0f2fe', color: '#0891b2' }
  }

  const style = colorStyles[color as keyof typeof colorStyles] || colorStyles.blue

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            margin: '0 0 4px 0',
            fontFamily: 'Poppins, sans-serif'
          }}>{title}</p>
          <p style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#0f172a',
            margin: 0,
            fontFamily: 'Albert Sans, sans-serif'
          }}>{value}</p>
        </div>
        <div style={{
          padding: '10px',
          borderRadius: '8px',
          backgroundColor: style.bg,
          color: style.color
        }}>
          <Icon style={{ width: '20px', height: '20px' }} />
        </div>
      </div>
    </div>
  )
}

export default function ComerciosPage() {
  const router = useRouter()
  const [comercios, setComercios] = useState<Comercio[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState('todos')
  const [selectedEstado, setSelectedEstado] = useState('todos')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showQRModal, setShowQRModal] = useState<string | null>(null)
  const [qrData, setQrData] = useState<{dataUrl: string, svg: string} | null>(null)
  const [loadingQR, setLoadingQR] = useState(false)
  const [qrStyle, setQrStyle] = useState<'classic' | 'petfriendly'>('petfriendly')
  const itemsPerPage = 12

  useEffect(() => {
    fetchComercios()
  }, [currentPage, selectedCategoria, selectedEstado])

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

  async function generateQR(comercio: Comercio) {
    setLoadingQR(true)
    setShowQRModal(comercio.id)
    
    try {
      const response = await fetch(`/api/admin/comercios/${comercio.id}/qr`)
      if (response.ok) {
        const data = await response.json()
        setQrData(data.qr)
      } else {
        alert('Error al generar el código QR')
        setShowQRModal(null)
      }
    } catch (error) {
      console.error('Error generating QR:', error)
      alert('Error al generar el código QR')
      setShowQRModal(null)
    } finally {
      setLoadingQR(false)
    }
  }

  function downloadQR(format: 'png' | 'svg', comercio: Comercio) {
    if (qrStyle === 'petfriendly' && format === 'png') {
      // Para el diseño pet friendly, capturar el canvas
      const canvas = document.querySelector('canvas') as HTMLCanvasElement
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
    } else if (!qrData) {
      return
    } else if (format === 'png') {
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

  // Paginación
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const comerciosPaginados = comerciosFiltrados.slice(startIndex, endIndex)
  const totalPageCount = Math.ceil(comerciosFiltrados.length / itemsPerPage)

  const totalComercios = comercios.length
  const comerciosActivos = comercios.filter(c => c.activo).length
  const comerciosCertificados = comercios.filter(c => c.certificado).length
  const totalEscaneos = comercios.reduce((sum, c) => sum + c.qrEscaneos, 0)
  const totalConversiones = comercios.reduce((sum, c) => sum + c.conversiones, 0)

  useEffect(() => {
    setTotalPages(totalPageCount)
  }, [totalPageCount])

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #af1731',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#64748b', fontFamily: 'Poppins, sans-serif' }}>Cargando comercios...</p>
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
        }}>Gestión de Comercios</h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#64748b',
          margin: 0,
          fontFamily: 'Poppins, sans-serif'
        }}>Administra los comercios pet friendly del directorio</p>
      </div>

      {/* Métricas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <MetricCard title="Total Comercios" value={totalComercios} icon={Building2} color="blue" />
        <MetricCard title="Comercios Activos" value={comerciosActivos} icon={Activity} color="green" />
        <MetricCard title="Certificados" value={comerciosCertificados} icon={ShieldCheck} color="purple" />
        <MetricCard title="QR Escaneos" value={totalEscaneos.toLocaleString()} icon={QrCode} color="yellow" />
        <MetricCard title="Conversiones" value={totalConversiones} icon={TrendingUp} color="cyan" />
      </div>

      {/* Filters and Actions */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
            {/* Search */}
            <div style={{
              position: 'relative',
              minWidth: '250px'
            }}>
              <Search style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: '#94a3b8'
              }} />
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setCurrentPage(1)
                  }
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 40px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.875rem',
                  fontFamily: 'Poppins, sans-serif',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#bfb591'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Filter Categoría */}
            <select
              value={selectedCategoria}
              onChange={(e) => {
                setSelectedCategoria(e.target.value)
                setCurrentPage(1)
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '0.875rem',
                fontFamily: 'Poppins, sans-serif',
                outline: 'none',
                cursor: 'pointer',
                minWidth: '150px'
              }}
            >
              <option value="todos">Todas las categorías</option>
              {Object.entries(categoriaConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>

            {/* Filter Estado */}
            <select
              value={selectedEstado}
              onChange={(e) => {
                setSelectedEstado(e.target.value)
                setCurrentPage(1)
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '0.875rem',
                fontFamily: 'Poppins, sans-serif',
                outline: 'none',
                cursor: 'pointer',
                minWidth: '150px'
              }}
            >
              <option value="todos">Todos los estados</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
              <option value="certificados">Certificados</option>
            </select>
          </div>

          {/* Actions */}
          <button
            onClick={() => router.push('/admin/comercios/nuevo')}
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
            Registrar Comercio
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #af1731',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#64748b', fontFamily: 'Poppins, sans-serif' }}>
              Cargando comercios...
            </p>
          </div>
        ) : comerciosPaginados.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <Building2 style={{ width: '48px', height: '48px', color: '#cbd5e1', margin: '0 auto 16px' }} />
            <p style={{ color: '#64748b', fontFamily: 'Poppins, sans-serif' }}>
              No se encontraron comercios
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>CÓDIGO</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>COMERCIO</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>CATEGORÍA</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>ESTADO</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>CERTIFICADO</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>QR ESCANEOS</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {comerciosPaginados.map((comercio) => {
                const categoria = categoriaConfig[comercio.categoria] || categoriaConfig.otro
                const Icon = categoria.icon
                return (
                  <tr key={comercio.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px', fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                      {comercio.codigo}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '8px',
                          backgroundColor: categoria.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Icon size={24} style={{ color: categoria.color }} />
                        </div>
                        <div>
                          <p style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#0f172a',
                            margin: '0 0 2px 0',
                            fontFamily: 'Albert Sans, sans-serif'
                          }}>{comercio.nombre}</p>
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            margin: 0,
                            fontFamily: 'Poppins, sans-serif'
                          }}>{comercio.direccion}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: categoria.lightBg,
                        color: categoria.color,
                        border: `1px solid ${categoria.bg}`,
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        {categoria.label}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: comercio.activo ? '#f0fdf4' : '#f3f4f6',
                        color: comercio.activo ? '#15803d' : '#374151',
                        border: `1px solid ${comercio.activo ? '#bbf7d0' : '#d1d5db'}`,
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        {comercio.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {comercio.certificado ? (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          backgroundColor: '#dbeafe',
                          color: '#1e40af',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          fontFamily: 'Poppins, sans-serif'
                        }}>
                          <ShieldCheck size={14} />
                          Certificado
                        </div>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif' }}>
                          No certificado
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.875rem', color: '#475569', fontFamily: 'Poppins, sans-serif' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <QrCode size={16} style={{ color: '#6b7280' }} />
                        {comercio.qrEscaneos.toLocaleString()}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => generateQR(comercio)}
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
                          title="Generar QR"
                        >
                          <QrCode style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/comercios/${comercio.id}`)}
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
                          title="Ver detalles"
                        >
                          <Eye style={{ width: '16px', height: '16px', color: '#64748b' }} />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/comercios/${comercio.id}`)}
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
                          title="Editar"
                        >
                          <Edit2 style={{ width: '16px', height: '16px', color: '#64748b' }} />
                        </button>
                        <button
                          onClick={() => deleteComercio(comercio.id)}
                          style={{
                            padding: '6px',
                            backgroundColor: '#fef2f2',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                          title="Eliminar"
                        >
                          <Trash2 style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            padding: '16px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Página {currentPage} de {totalPages}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px',
                  backgroundColor: currentPage === 1 ? '#f3f4f6' : 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: currentPage === 1 ? 0.5 : 1
                }}
              >
                <ChevronLeft style={{ width: '16px', height: '16px', color: '#64748b' }} />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px',
                  backgroundColor: currentPage === totalPages ? '#f3f4f6' : 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: currentPage === totalPages ? 0.5 : 1
                }}
              >
                <ChevronRight style={{ width: '16px', height: '16px', color: '#64748b' }} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* QR Modal */}
      {showQRModal && (
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
          setShowQRModal(null)
          setQrData(null)
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => {
                setShowQRModal(null)
                setQrData(null)
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

            {loadingQR ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  border: '4px solid #f3f4f6',
                  borderTop: '4px solid #3b82f6',
                  borderRadius: '50%',
                  margin: '0 auto 16px',
                  animation: 'spin 1s linear infinite'
                }} />
                <p style={{ color: '#6b7280', fontFamily: 'Poppins, sans-serif' }}>Generando código QR...</p>
              </div>
            ) : qrData && (
              <>
                {(() => {
                  const comercio = comercios.find(c => c.id === showQRModal)
                  const categoria = comercio ? categoriaConfig[comercio.categoria] || categoriaConfig.otro : categoriaConfig.otro
                  const Icon = categoria.icon
                  
                  return (
                    <>
                      {/* Header */}
                      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                        <div style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '12px',
                          backgroundColor: categoria.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 16px'
                        }}>
                          <Icon size={32} style={{ color: categoria.color }} />
                        </div>
                        <h3 style={{
                          fontSize: '1.25rem',
                          fontWeight: '700',
                          color: '#111827',
                          margin: '0 0 4px 0',
                          fontFamily: 'Albert Sans, sans-serif'
                        }}>{comercio?.nombre}</h3>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          margin: 0,
                          fontFamily: 'Poppins, sans-serif'
                        }}>Código: {comercio?.codigo}</p>
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
                            backgroundColor: qrStyle === 'petfriendly' ? categoria.color : '#f3f4f6',
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
                            url={`${process.env.NEXT_PUBLIC_URL || 'https://4tlixco.vercel.app'}/catalogo`}
                            size={300}
                            color={categoria.color}
                            backgroundColor={categoria.bg}
                            comercioNombre={comercio?.nombre}
                          />
                        ) : (
                          <img
                            src={qrData.dataUrl}
                            alt="QR Code"
                            style={{
                              width: '300px',
                              height: '300px',
                              margin: '0 auto'
                            }}
                          />
                        )}
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          marginTop: '12px',
                          fontFamily: 'Poppins, sans-serif'
                        }}>
                          Escanea este código QR para visitar el comercio
                        </p>
                      </div>

                      {/* Actions */}
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'center'
                      }}>
                        <button
                          onClick={() => downloadQR('png', comercio!)}
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
                          Descargar PNG
                        </button>
                        <button
                          onClick={() => downloadQR('svg', comercio!)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            backgroundColor: 'white',
                            color: '#374151',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            fontFamily: 'Poppins, sans-serif',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
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
                          <Download size={16} />
                          Descargar SVG
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
                        <Share2 size={20} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#1e40af',
                            margin: '0 0 4px 0',
                            fontWeight: '500',
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            Comparte este código QR
                          </p>
                          <p style={{
                            fontSize: '0.813rem',
                            color: '#3730a3',
                            margin: 0,
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            Puedes imprimir este código QR para colocarlo en tu establecimiento 
                            o compartirlo en redes sociales para que más personas conozcan tu comercio.
                          </p>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}