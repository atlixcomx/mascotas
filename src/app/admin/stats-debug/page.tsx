'use client'

import { useState, useEffect } from 'react'
import { BarChart3, RefreshCw, AlertCircle, CheckCircle, Database, Eye } from 'lucide-react'

interface ComercioStats {
  id: string
  codigo: string
  nombre: string
  qrEscaneos: number
  conversiones: number
  _count: {
    qrScans: number
  }
}

interface StatsResponse {
  comercios: ComercioStats[]
  totalScansFromTable: number
  message: string
}

export default function StatsDebugPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/comercios/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  async function resetAllStats() {
    if (!confirm('¿Estás seguro de resetear TODAS las estadísticas? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      setResetting(true)
      const response = await fetch('/api/admin/comercios/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_all' })
      })

      if (response.ok) {
        alert('Estadísticas reseteadas correctamente')
        await fetchStats()
      }
    } catch (error) {
      console.error('Error resetting stats:', error)
      alert('Error al resetear estadísticas')
    } finally {
      setResetting(false)
    }
  }

  async function resetComercioStats(comercioId: string) {
    if (!confirm('¿Resetear las estadísticas de este comercio?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/comercios/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_comercio', comercioId })
      })

      if (response.ok) {
        alert('Estadísticas del comercio reseteadas')
        await fetchStats()
      }
    } catch (error) {
      console.error('Error resetting comercio stats:', error)
      alert('Error al resetear estadísticas del comercio')
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>
          <RefreshCw size={40} />
        </div>
        <p style={{ marginTop: '16px' }}>Cargando estadísticas...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: '#111827', 
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <BarChart3 size={32} style={{ color: '#3b82f6' }} />
          Debug: Estadísticas Reales
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
          Verificación de datos reales desde la base de datos
        </p>
      </div>

      {stats && (
        <>
          {/* Resumen */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Database size={20} />
              Resumen General
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6' }}>
                  {stats.comercios.length}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Comercios</div>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>
                  {stats.totalScansFromTable}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Escaneos (Tabla QrScan)</div>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>
                  {stats.comercios.reduce((sum, c) => sum + c.qrEscaneos, 0)}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Escaneos (Campo Comercio)</div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={fetchStats}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              <RefreshCw size={16} />
              Actualizar Datos
            </button>
            <button
              onClick={resetAllStats}
              disabled={resetting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: resetting ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                opacity: resetting ? 0.6 : 1
              }}
            >
              <AlertCircle size={16} />
              {resetting ? 'Reseteando...' : 'Resetear Todas las Estadísticas'}
            </button>
          </div>

          {/* Lista de comercios */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb'
            }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Eye size={20} />
                Estadísticas por Comercio
              </h3>
            </div>
            <div style={{ padding: '20px' }}>
              {stats.comercios.map((comercio) => {
                const isConsistent = comercio.qrEscaneos === comercio._count.qrScans
                return (
                  <div 
                    key={comercio.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      marginBottom: '12px',
                      backgroundColor: isConsistent ? '#f0fdf4' : '#fef2f2',
                      border: `1px solid ${isConsistent ? '#bbf7d0' : '#fecaca'}`,
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '600', fontSize: '1rem' }}>
                          {comercio.codigo} - {comercio.nombre}
                        </span>
                        {isConsistent ? (
                          <CheckCircle size={16} style={{ color: '#16a34a' }} />
                        ) : (
                          <AlertCircle size={16} style={{ color: '#dc2626' }} />
                        )}
                      </div>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                        gap: '16px',
                        fontSize: '0.875rem'
                      }}>
                        <div>
                          <span style={{ color: '#6b7280' }}>Campo qrEscaneos: </span>
                          <span style={{ fontWeight: '600', color: '#374151' }}>{comercio.qrEscaneos}</span>
                        </div>
                        <div>
                          <span style={{ color: '#6b7280' }}>Registros QrScan: </span>
                          <span style={{ fontWeight: '600', color: '#374151' }}>{comercio._count.qrScans}</span>
                        </div>
                        <div>
                          <span style={{ color: '#6b7280' }}>Conversiones: </span>
                          <span style={{ fontWeight: '600', color: '#374151' }}>{comercio.conversiones}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => resetComercioStats(comercio.id)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}
                    >
                      Reset
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#eff6ff',
            borderRadius: '8px',
            border: '1px solid #bfdbfe'
          }}>
            <p style={{ 
              margin: 0, 
              fontSize: '0.875rem', 
              color: '#1e40af',
              fontWeight: '500'
            }}>
              💡 <strong>Explicación:</strong> Los datos mostrados aquí son los valores REALES desde la base de datos. 
              Si los números no coinciden con lo que esperas, usa el botón "Reset" para limpiar las estadísticas 
              y comenzar a trackear desde cero.
            </p>
          </div>
        </>
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