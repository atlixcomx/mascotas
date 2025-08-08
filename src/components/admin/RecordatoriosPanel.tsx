'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Clock, 
  AlertTriangle, 
  Bell, 
  Send, 
  RefreshCw, 
  Calendar,
  User,
  Dog,
  TrendingUp,
  CheckCircle
} from 'lucide-react'

interface ReminderRule {
  estado: string
  diasLimite: number
  mensaje: string
  tipo: 'urgente' | 'normal'
  requiereEmail: boolean
}

interface SolicitudVencida {
  id: string
  codigo: string
  nombre: string
  email: string
  estado: string
  diasVencidos: number
  perrito: {
    nombre: string
  }
  fechaUltimaActualizacion: string
  regla: ReminderRule
}

interface RecordatoriosData {
  recordatorios: SolicitudVencida[]
  resumen: {
    total: number
    urgentes: number
    normales: number
  }
}

interface ReminderStats {
  total: number
  urgentes: number
  normales: number
  porEstado: { [key: string]: number }
  promedioVencimiento: number
}

export function RecordatoriosPanel() {
  const [recordatorios, setRecordatorios] = useState<RecordatoriosData | null>(null)
  const [stats, setStats] = useState<ReminderStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchRecordatorios = async () => {
    try {
      setLoading(true)
      
      const [recordatoriosRes, statsRes] = await Promise.all([
        fetch('/api/admin/recordatorios'),
        fetch('/api/admin/recordatorios?action=stats')
      ])
      
      if (recordatoriosRes.ok && statsRes.ok) {
        const recordatoriosData = await recordatoriosRes.json()
        const statsData = await statsRes.json()
        
        setRecordatorios(recordatoriosData)
        setStats(statsData)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Error fetching recordatorios:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendRecordatorios = async () => {
    try {
      setSending(true)
      const response = await fetch('/api/admin/recordatorios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'send' })
      })
      
      if (response.ok) {
        // Refrescar los datos después de enviar
        await fetchRecordatorios()
      } else {
        console.error('Error enviando recordatorios')
      }
    } catch (error) {
      console.error('Error sending recordatorios:', error)
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    fetchRecordatorios()
  }, [])

  const estadoLabels: { [key: string]: string } = {
    'nueva': 'Nueva',
    'revision': 'En Revisión',
    'entrevista': 'Entrevista',
    'prueba': 'Período de Prueba'
  }

  const estadoColors: { [key: string]: string } = {
    'nueva': '#ef4444',
    'revision': '#f59e0b',
    'entrevista': '#8b5cf6',
    'prueba': '#06b6d4'
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)
    
    if (diffInDays > 0) {
      return `hace ${diffInDays} día${diffInDays === 1 ? '' : 's'}`
    }
    return `hace ${diffInHours} hora${diffInHours === 1 ? '' : 's'}`
  }

  if (loading && !recordatorios) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <RefreshCw style={{ width: '32px', height: '32px', color: '#6b7280', margin: '0 auto 16px' }} className="animate-spin" />
        <p style={{ color: '#6b7280', margin: 0 }}>Cargando recordatorios...</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header y controles */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#1f2937', 
            margin: '0 0 8px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Bell style={{ width: '24px', height: '24px', color: '#4f46e5' }} />
            Sistema de Recordatorios
          </h2>
          <p style={{ 
            color: '#6b7280', 
            margin: 0,
            fontSize: '0.875rem'
          }}>
            Última actualización: {lastUpdate.toLocaleTimeString('es-MX')}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={fetchRecordatorios}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            <RefreshCw style={{ width: '16px', height: '16px' }} />
            Actualizar
          </button>
          
          <button
            onClick={sendRecordatorios}
            disabled={sending || !recordatorios?.resumen.total}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: recordatorios?.resumen.total ? '#4f46e5' : '#9ca3af',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'white',
              cursor: (sending || !recordatorios?.resumen.total) ? 'not-allowed' : 'pointer'
            }}
          >
            <Send style={{ width: '16px', height: '16px' }} />
            {sending ? 'Enviando...' : 'Enviar Recordatorios'}
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fef2f2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <AlertTriangle style={{ width: '24px', height: '24px', color: '#ef4444' }} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444', margin: '0 0 4px 0' }}>
              {stats.urgentes}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Urgentes</div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fefbf3',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <Clock style={{ width: '24px', height: '24px', color: '#f59e0b' }} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b', margin: '0 0 4px 0' }}>
              {stats.normales}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Normales</div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#f0f9ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <TrendingUp style={{ width: '24px', height: '24px', color: '#0369a1' }} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0369a1', margin: '0 0 4px 0' }}>
              {stats.promedioVencimiento}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Días promedio</div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#ecfdf5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <CheckCircle style={{ width: '24px', height: '24px', color: '#10b981' }} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', margin: '0 0 4px 0' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total</div>
          </div>
        </div>
      )}

      {/* Lista de recordatorios */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc'
        }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#1f2937', 
            margin: 0 
          }}>
            Solicitudes que Requieren Atención ({recordatorios?.resumen.total || 0})
          </h3>
        </div>

        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {!recordatorios?.recordatorios.length ? (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#6b7280' 
            }}>
              <CheckCircle style={{ 
                width: '48px', 
                height: '48px', 
                margin: '0 auto 16px',
                color: '#10b981'
              }} />
              <p style={{ fontSize: '1.125rem', fontWeight: '500', margin: '0 0 8px 0' }}>
                ¡Excelente trabajo!
              </p>
              <p style={{ margin: 0 }}>
                No hay solicitudes que requieran recordatorios en este momento.
              </p>
            </div>
          ) : (
            recordatorios.recordatorios.map((recordatorio, index) => (
              <div
                key={recordatorio.id}
                style={{
                  padding: '16px 20px',
                  borderBottom: index < recordatorios.recordatorios.length - 1 ? '1px solid #f1f5f9' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {/* Indicador de urgencia */}
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: recordatorio.regla.tipo === 'urgente' ? '#ef4444' : '#f59e0b',
                  flexShrink: 0
                }} />

                {/* Información principal */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <Link
                      href={`/admin/solicitudes/${recordatorio.id}`}
                      style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        textDecoration: 'none'
                      }}
                    >
                      {recordatorio.codigo}
                    </Link>
                    
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: `${estadoColors[recordatorio.estado]}15`,
                      color: estadoColors[recordatorio.estado]
                    }}>
                      {estadoLabels[recordatorio.estado]}
                    </span>

                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: recordatorio.regla.tipo === 'urgente' ? '#ef4444' : '#f59e0b'
                    }}>
                      {recordatorio.diasVencidos} día{recordatorio.diasVencidos === 1 ? '' : 's'} vencido{recordatorio.diasVencidos === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User style={{ width: '14px', height: '14px' }} />
                      {recordatorio.nombre}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Dog style={{ width: '14px', height: '14px' }} />
                      {recordatorio.perrito.nombre}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar style={{ width: '14px', height: '14px' }} />
                      {getTimeAgo(recordatorio.fechaUltimaActualizacion)}
                    </div>
                  </div>

                  <p style={{ 
                    fontSize: '0.8125rem', 
                    color: '#9ca3af', 
                    margin: '6px 0 0 0',
                    fontStyle: 'italic'
                  }}>
                    {recordatorio.regla.mensaje}
                  </p>
                </div>

                {/* Icono de urgencia */}
                {recordatorio.regla.tipo === 'urgente' && (
                  <AlertTriangle style={{ 
                    width: '20px', 
                    height: '20px', 
                    color: '#ef4444',
                    flexShrink: 0
                  }} />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}