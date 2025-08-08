'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Eye,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  ShoppingCart,
  Calendar,
  BarChart3,
  Truck,
  CheckCircle,
  Clock,
  X
} from 'lucide-react'

interface Insumo {
  id: string
  nombre: string
  categoria: 'alimento' | 'medicamento' | 'limpieza' | 'juguetes' | 'accesorios' | 'equipo_medico' | 'construccion' | 'otros'
  descripcion: string
  marca: string
  unidadMedida: 'kg' | 'litros' | 'unidades' | 'cajas' | 'paquetes' | 'metros'
  stockActual: number
  stockMinimo: number
  stockMaximo: number
  costo: number
  proveedor: {
    id: string
    nombre: string
    contacto: string
  }
  fechaVencimiento?: string
  lote?: string
  ubicacion: string
  estado: 'disponible' | 'agotado' | 'por_vencer' | 'vencido' | 'reservado'
  ultimaEntrada: string
  ultimaSalida: string
}

interface Metrics {
  total: number
  disponibles: number
  agotados: number
  porVencer: number
  vencidos: number
  valorInventario: number
  categorias: Record<string, number>
  alertas: number
}

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  trend,
  subtitle
}: { 
  title: string
  value: number | string
  icon: any
  color?: string
  trend?: 'up' | 'down' | 'stable'
  subtitle?: string
}) {
  const colorStyles = {
    blue: { bg: '#eff6ff', color: '#2563eb' },
    green: { bg: '#f0fdf4', color: '#16a34a' },
    yellow: { bg: '#fefce8', color: '#ca8a04' },
    red: { bg: '#fef2f2', color: '#dc2626' },
    purple: { bg: '#faf5ff', color: '#9333ea' }
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b',
              margin: 0,
              fontFamily: 'Poppins, sans-serif'
            }}>{title}</p>
            {trend && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {trend === 'up' && <TrendingUp style={{ width: '12px', height: '12px', color: '#16a34a' }} />}
                {trend === 'down' && <TrendingDown style={{ width: '12px', height: '12px', color: '#dc2626' }} />}
              </div>
            )}
          </div>
          <p style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#0f172a',
            margin: '0 0 2px 0',
            fontFamily: 'Albert Sans, sans-serif'
          }}>{value}</p>
          {subtitle && (
            <p style={{
              fontSize: '0.75rem',
              color: '#64748b',
              margin: 0,
              fontFamily: 'Poppins, sans-serif'
            }}>{subtitle}</p>
          )}
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

export default function InsumosAdmin() {
  const router = useRouter()
  const [insumos, setInsumos] = useState<Insumo[]>([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategoria, setFilterCategoria] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchInsumos()
  }, [currentPage, filterCategoria, filterEstado])

  async function fetchInsumos() {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (filterCategoria) params.append('categoria', filterCategoria)
      if (filterEstado) params.append('estado', filterEstado)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/admin/insumos?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setInsumos(data.insumos || [])
        setTotalPages(data.totalPages || 1)
        
        // Calculate metrics
        const metricsData: Metrics = {
          total: data.total || 0,
          disponibles: data.summary?.disponible || 0,
          agotados: data.summary?.agotado || 0,
          porVencer: data.summary?.por_vencer || 0,
          vencidos: data.summary?.vencido || 0,
          valorInventario: data.summary?.valor_inventario || 0,
          categorias: data.summary?.categorias || {},
          alertas: data.summary?.alertas || 0
        }
        setMetrics(metricsData)
      }
    } catch (error) {
      console.error('Error fetching insumos:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEstadoStyle = (estado: string, stock: number, stockMinimo: number) => {
    if (estado === 'vencido') {
      return { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca', icon: X }
    }
    if (estado === 'por_vencer') {
      return { bg: '#fef3c7', color: '#d97706', border: '#fed7aa', icon: Clock }
    }
    if (estado === 'agotado' || stock === 0) {
      return { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca', icon: AlertTriangle }
    }
    if (stock <= stockMinimo) {
      return { bg: '#fef3c7', color: '#d97706', border: '#fed7aa', icon: AlertTriangle }
    }
    return { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', icon: CheckCircle }
  }

  const getCategoriaColor = (categoria: string) => {
    const colores = {
      alimento: '#2563eb',
      medicamento: '#dc2626',
      limpieza: '#16a34a',
      juguetes: '#9333ea',
      accesorios: '#d97706',
      equipo_medico: '#b91c1c',
      construccion: '#64748b',
      otros: '#374151'
    }
    return colores[categoria as keyof typeof colores] || '#374151'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const isVenciendo = (fechaVencimiento?: string) => {
    if (!fechaVencimiento) return false
    const hoy = new Date()
    const vencimiento = new Date(fechaVencimiento)
    const diferencia = vencimiento.getTime() - hoy.getTime()
    const diasParaVencer = Math.ceil(diferencia / (1000 * 3600 * 24))
    return diasParaVencer <= 30 && diasParaVencer > 0
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
        }}>Gestión de Insumos</h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#64748b',
          margin: 0,
          fontFamily: 'Poppins, sans-serif'
        }}>Controla el inventario de suministros y materiales del centro</p>
      </div>

      {/* Metrics */}
      {metrics && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <MetricCard 
            title="Total Insumos" 
            value={metrics.total} 
            icon={Package} 
            color="blue" 
          />
          <MetricCard 
            title="Disponibles" 
            value={metrics.disponibles} 
            icon={CheckCircle} 
            color="green" 
          />
          <MetricCard 
            title="Alertas Activas" 
            value={metrics.alertas} 
            icon={AlertTriangle} 
            color="red" 
            subtitle={`${metrics.agotados} agotados, ${metrics.porVencer} por vencer`}
          />
          <MetricCard 
            title="Valor Inventario" 
            value={formatCurrency(metrics.valorInventario)} 
            icon={BarChart3} 
            color="purple" 
          />
        </div>
      )}

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
                placeholder="Buscar por nombre, marca o lote..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchInsumos()}
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

            {/* Filter Categoria */}
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
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
              <option value="">Todas las categorías</option>
              <option value="alimento">Alimento</option>
              <option value="medicamento">Medicamentos</option>
              <option value="limpieza">Limpieza</option>
              <option value="juguetes">Juguetes</option>
              <option value="accesorios">Accesorios</option>
              <option value="equipo_medico">Equipo Médico</option>
              <option value="construccion">Construcción</option>
              <option value="otros">Otros</option>
            </select>

            {/* Filter Estado */}
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
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
              <option value="">Todos los estados</option>
              <option value="disponible">Disponible</option>
              <option value="agotado">Agotado</option>
              <option value="por_vencer">Por Vencer</option>
              <option value="vencido">Vencido</option>
              <option value="reservado">Reservado</option>
            </select>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => router.push('/admin/insumos/entrada')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
            >
              <Truck style={{ width: '16px', height: '16px' }} />
              Entrada
            </button>
            <button
              onClick={() => router.push('/admin/insumos/salida')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: '#d97706',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b45309'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
            >
              <ShoppingCart style={{ width: '16px', height: '16px' }} />
              Salida
            </button>
            <button
              onClick={() => router.push('/admin/insumos/nuevo')}
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
              Nuevo Insumo
            </button>
          </div>
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
              Cargando insumos...
            </p>
          </div>
        ) : insumos.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <Package style={{ width: '48px', height: '48px', color: '#cbd5e1', margin: '0 auto 16px' }} />
            <p style={{ color: '#64748b', fontFamily: 'Poppins, sans-serif' }}>
              No se encontraron insumos
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>PRODUCTO</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>CATEGORÍA</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>STOCK</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>ESTADO</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>COSTO</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>UBICACIÓN</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', fontFamily: 'Albert Sans, sans-serif' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {insumos.map((insumo) => {
                const estadoStyle = getEstadoStyle(insumo.estado, insumo.stockActual, insumo.stockMinimo)
                const categoriaColor = getCategoriaColor(insumo.categoria)
                const venciendo = isVenciendo(insumo.fechaVencimiento)
                
                return (
                  <tr key={insumo.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <p style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#0f172a',
                          margin: '0 0 4px 0',
                          fontFamily: 'Albert Sans, sans-serif'
                        }}>{insumo.nombre}</p>
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          margin: '0 0 2px 0',
                          fontFamily: 'Poppins, sans-serif'
                        }}>{insumo.marca}</p>
                        {insumo.lote && (
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            margin: 0,
                            fontFamily: 'Poppins, sans-serif'
                          }}>Lote: {insumo.lote}</p>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: `${categoriaColor}15`,
                        color: categoriaColor,
                        border: `1px solid ${categoriaColor}30`,
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        {insumo.categoria.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <p style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: insumo.stockActual <= insumo.stockMinimo ? '#dc2626' : '#0f172a',
                          margin: '0 0 2px 0',
                          fontFamily: 'Albert Sans, sans-serif'
                        }}>
                          {insumo.stockActual} {insumo.unidadMedida}
                        </p>
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          margin: 0,
                          fontFamily: 'Poppins, sans-serif'
                        }}>
                          Mín: {insumo.stockMinimo} | Máx: {insumo.stockMaximo}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <estadoStyle.icon style={{ width: '14px', height: '14px', color: estadoStyle.color }} />
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            color: estadoStyle.color,
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            {insumo.stockActual === 0 ? 'Agotado' : 
                             insumo.stockActual <= insumo.stockMinimo ? 'Stock Bajo' : 'Disponible'}
                          </span>
                        </div>
                        {venciendo && (
                          <div style={{
                            padding: '2px 6px',
                            borderRadius: '10px',
                            backgroundColor: '#fef3c7',
                            color: '#d97706',
                            fontSize: '0.65rem',
                            fontWeight: '500',
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            Vence: {new Date(insumo.fechaVencimiento!).toLocaleDateString('es-MX')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <p style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#0f172a',
                        margin: '0 0 2px 0',
                        fontFamily: 'Albert Sans, sans-serif'
                      }}>
                        {formatCurrency(insumo.costo)}
                      </p>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        margin: 0,
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        por {insumo.unidadMedida}
                      </p>
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.875rem', color: '#475569', fontFamily: 'Poppins, sans-serif' }}>
                      {insumo.ubicacion}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => router.push(`/admin/insumos/${insumo.id}`)}
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
                          onClick={() => router.push(`/admin/insumos/${insumo.id}/editar`)}
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
                        {(insumo.stockActual <= insumo.stockMinimo || venciendo) && (
                          <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: '#dc2626',
                            alignSelf: 'center'
                          }} title="Requiere atención" />
                        )}
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
                ←
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
                →
              </button>
            </div>
          </div>
        )}
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