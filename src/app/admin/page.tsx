'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { 
  Dog, 
  FileText, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Users,
  Heart,
  Calendar
} from 'lucide-react'

interface DashboardStats {
  perritos: {
    total: number
    disponibles: number
    enProceso: number
    adoptados: number
  }
  solicitudes: {
    total: number
    pendientes: number
    recientes: any[]
    adopcionesEsteMes: number
  }
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  description 
}: {
  title: string
  value: number | string
  icon: any
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  description?: string
}) {
  const colorStyles = {
    blue: { backgroundColor: '#eff6ff', color: '#2563eb', borderColor: '#dbeafe' },
    green: { backgroundColor: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' },
    yellow: { backgroundColor: '#fefce8', color: '#ca8a04', borderColor: '#fef3c7' },
    red: { backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' },
    purple: { backgroundColor: '#faf5ff', color: '#9333ea', borderColor: '#e9d5ff' }
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      padding: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px', fontWeight: '500', color: '#64748b', margin: 0 }}>{title}</p>
          <p style={{ 
            fontSize: '30px', 
            fontWeight: 'bold', 
            color: '#0e312d', 
            marginTop: '4px',
            margin: '4px 0 0 0'
          }}>{value}</p>
          {description && (
            <p style={{ 
              fontSize: '14px', 
              color: '#94a3b8', 
              marginTop: '4px',
              margin: '4px 0 0 0'
            }}>{description}</p>
          )}
        </div>
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          border: `1px solid ${colorStyles[color].borderColor}`,
          ...colorStyles[color]
        }}>
          <Icon style={{ width: '24px', height: '24px' }} />
        </div>
      </div>
    </div>
  )
}

function SolicitudesRecientes({ solicitudes }: { solicitudes: any[] }) {
  if (solicitudes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <FileText style={{ margin: '0 auto', width: '48px', height: '48px', color: '#94a3b8' }} />
        <p style={{ color: '#64748b', marginTop: '8px', margin: '8px 0 0 0' }}>No hay solicitudes recientes</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {solicitudes.map((solicitud) => (
        <div key={solicitud.id} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          padding: '16px', 
          backgroundColor: '#f8fafc', 
          borderRadius: '8px'
        }}>
          <img
            src={solicitud.perrito.fotoPrincipal}
            alt={solicitud.perrito.nombre}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: '500', color: '#0e312d', margin: 0 }}>{solicitud.nombre}</p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0 0' }}>
              Quiere adoptar a <strong>{solicitud.perrito.nombre}</strong>
            </p>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
              {new Date(solicitud.createdAt).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: solicitud.estado === 'nueva' 
                ? '#dbeafe' 
                : solicitud.estado === 'revision'
                ? '#fef3c7'  
                : '#f3f4f6',
              color: solicitud.estado === 'nueva' 
                ? '#1e40af' 
                : solicitud.estado === 'revision'
                ? '#92400e'  
                : '#374151'
            }}>
              {solicitud.estado}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    perritos: { total: 0, disponibles: 0, enProceso: 0, adoptados: 0 },
    solicitudes: { total: 0, pendientes: 0, recientes: [], adopcionesEsteMes: 0 }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/dashboard')
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

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ opacity: 0.6 }}>
          <div style={{ 
            height: '32px', 
            backgroundColor: '#e2e8f0', 
            borderRadius: '4px', 
            width: '25%', 
            marginBottom: '32px'
          }}></div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '24px'
          }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                padding: '24px'
              }}>
                <div style={{ 
                  height: '16px', 
                  backgroundColor: '#e2e8f0', 
                  borderRadius: '4px', 
                  width: '50%', 
                  marginBottom: '8px'
                }}></div>
                <div style={{ 
                  height: '32px', 
                  backgroundColor: '#e2e8f0', 
                  borderRadius: '4px', 
                  width: '75%'
                }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8f8f8', minHeight: '100vh' }}>
      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px', 
        marginBottom: '32px'
      }}>
        <StatCard
          title="Total Perritos"
          value={stats.perritos.total}
          icon={Dog}
          color="blue"
        />
        <StatCard
          title="Disponibles"
          value={stats.perritos.disponibles}
          icon={Heart}
          color="green"
          description="Listos para adopción"
        />
        <StatCard
          title="En Proceso"
          value={stats.perritos.enProceso}
          icon={Clock}
          color="yellow"
          description="Con solicitudes activas"
        />
        <StatCard
          title="Adoptados"
          value={stats.perritos.adoptados}
          icon={CheckCircle}
          color="purple"
          description="Encontraron hogar"
        />
      </div>

      {/* Second Row Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px', 
        marginBottom: '32px'
      }}>
        <StatCard
          title="Solicitudes Totales"
          value={stats.solicitudes.total}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Solicitudes Pendientes"
          value={stats.solicitudes.pendientes}
          icon={Clock}
          color="red"
          description="Requieren atención"
        />
        <StatCard
          title="Adopciones Este Mes"
          value={stats.solicitudes.adopcionesEsteMes}
          icon={TrendingUp}
          color="green"
          description="Familias felices"
        />
      </div>

      {/* Content Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '32px'
      }}>
        
        {/* Solicitudes Recientes */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          padding: '24px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '24px'
          }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#0e312d',
              margin: 0
            }}>
              Solicitudes Recientes
            </h2>
            <a 
              href="/admin/solicitudes"
              style={{
                fontSize: '14px',
                color: '#af1731',
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              Ver todas →
            </a>
          </div>
          <SolicitudesRecientes solicitudes={stats.solicitudes.recientes} />
        </div>

        {/* Acciones Rápidas */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          padding: '24px'
        }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#0e312d', 
            marginBottom: '24px',
            margin: '0 0 24px 0'
          }}>
            Acciones Rápidas
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <a
              href="/admin/perritos"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'background-color 0.2s'
              }}
            >
              <div style={{
                padding: '8px',
                backgroundColor: '#dbeafe',
                borderRadius: '8px',
                marginRight: '16px'
              }}>
                <Dog style={{ width: '20px', height: '20px', color: '#2563eb' }} />
              </div>
              <div>
                <p style={{ fontWeight: '500', color: '#0e312d', margin: 0 }}>Gestionar Perritos</p>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0 0' }}>Agregar, editar o actualizar estado</p>
              </div>
            </a>
            
            <a
              href="/admin/solicitudes"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'background-color 0.2s'
              }}
            >
              <div style={{
                padding: '8px',
                backgroundColor: '#fef3c7',
                borderRadius: '8px',
                marginRight: '16px'
              }}>
                <FileText style={{ width: '20px', height: '20px', color: '#d97706' }} />
              </div>
              <div>
                <p style={{ fontWeight: '500', color: '#0e312d', margin: 0 }}>Revisar Solicitudes</p>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0 0' }}>Procesar adopciones pendientes</p>
              </div>
            </a>

            <a
              href="/admin/comercios"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'background-color 0.2s'
              }}
            >
              <div style={{
                padding: '8px',
                backgroundColor: '#dcfce7',
                borderRadius: '8px',
                marginRight: '16px'
              }}>
                <Users style={{ width: '20px', height: '20px', color: '#16a34a' }} />
              </div>
              <div>
                <p style={{ fontWeight: '500', color: '#0e312d', margin: 0 }}>Comercios Pet-Friendly</p>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0 0' }}>Gestionar directorio y QR</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {stats.solicitudes.pendientes > 0 && (
        <div style={{ marginTop: '32px' }}>
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Clock style={{ width: '20px', height: '20px', color: '#dc2626', marginRight: '8px' }} />
              <p style={{ color: '#991b1b', margin: 0 }}>
                <strong>{stats.solicitudes.pendientes} solicitudes</strong> requieren tu atención.
                <a href="/admin/solicitudes" style={{
                  marginLeft: '8px',
                  color: '#af1731',
                  textDecoration: 'underline'
                }}>
                  Revisar ahora
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}