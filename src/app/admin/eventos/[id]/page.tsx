'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Save, Calendar, MapPin, Clock, Users,
  Trash2, CheckCircle, XCircle, Edit3, Dog, Plus
} from 'lucide-react'

interface Evento {
  id: string
  nombre: string
  tipo: string
  tipoLabel?: string
  descripcion: string
  fecha: string
  horaInicio: string
  horaFin: string
  lugar: string
  direccion: string
  estado: 'programado' | 'en_curso' | 'completado' | 'cancelado'
  asistentes: number
  adopciones: number
  perritosIds: string[]
  perritos?: Array<{
    id: string
    nombre: string
    codigo: string
    fotoPrincipal?: string
    estado: string
  }>
}

const tiposEvento = [
  { value: 'feria_adopcion', label: 'Feria de Adopción' },
  { value: 'campana_esterilizacion', label: 'Campaña de Esterilización' },
  { value: 'jornada_vacunacion', label: 'Jornada de Vacunación' },
  { value: 'capacitacion', label: 'Capacitación' },
  { value: 'evento_comunitario', label: 'Evento Comunitario' },
  { value: 'otro', label: 'Otro' }
]

const estadosEvento = [
  { value: 'programado', label: 'Programado', color: '#3b82f6' },
  { value: 'en_curso', label: 'En Curso', color: '#f59e0b' },
  { value: 'completado', label: 'Completado', color: '#10b981' },
  { value: 'cancelado', label: 'Cancelado', color: '#ef4444' }
]

export default function EventoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [evento, setEvento] = useState<Evento | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [formData, setFormData] = useState<Partial<Evento>>({})

  useEffect(() => {
    fetchEvento()
  }, [resolvedParams.id])

  const fetchEvento = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/eventos/${resolvedParams.id}`)

      if (response.ok) {
        const data = await response.json()
        setEvento(data)
        setFormData({
          nombre: data.nombre,
          tipo: data.tipo,
          descripcion: data.descripcion,
          fecha: data.fecha.split('T')[0],
          horaInicio: data.horaInicio,
          horaFin: data.horaFin,
          lugar: data.lugar,
          direccion: data.direccion,
          estado: data.estado,
          asistentes: data.asistentes,
          adopciones: data.adopciones
        })
      } else {
        alert('Evento no encontrado')
        router.push('/admin/eventos')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al cargar evento')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.nombre || !formData.fecha) {
      alert('Por favor completa los campos requeridos')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/eventos/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setEvento({ ...evento, ...data.evento })
        setEditing(false)
        alert('Evento actualizado exitosamente')
      } else {
        const data = await response.json()
        alert(data.error || 'Error al actualizar')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar cambios')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/eventos/${resolvedParams.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push('/admin/eventos')
      } else {
        const data = await response.json()
        alert(data.error || 'Error al eliminar')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar evento')
    }
  }

  const handleQuickStatusChange = async (nuevoEstado: string) => {
    try {
      const response = await fetch(`/api/admin/eventos/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      })

      if (response.ok) {
        setEvento(prev => prev ? { ...prev, estado: nuevoEstado as Evento['estado'] } : null)
        setFormData(prev => ({ ...prev, estado: nuevoEstado as Evento['estado'] }))
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getEstadoColor = (estado: string) => {
    return estadosEvento.find(e => e.value === estado)?.color || '#6b7280'
  }

  const getTipoLabel = (tipo: string) => {
    return tiposEvento.find(t => t.value === tipo)?.label || tipo
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500' as const,
    color: '#374151',
    marginBottom: '6px'
  }

  if (loading) {
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTopColor: '#7d2447',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#64748b' }}>Cargando evento...</p>
        </div>
      </div>
    )
  }

  if (!evento) return null

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          href="/admin/eventos"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#64748b',
            textDecoration: 'none',
            fontSize: '14px',
            marginBottom: '12px'
          }}
        >
          <ArrowLeft size={18} />
          Volver a Eventos
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>
              {evento.nombre}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '500',
                backgroundColor: `${getEstadoColor(evento.estado)}15`,
                color: getEstadoColor(evento.estado)
              }}>
                {estadosEvento.find(e => e.value === evento.estado)?.label}
              </span>
              <span style={{ color: '#64748b', fontSize: '14px' }}>
                {getTipoLabel(evento.tipo)}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {!editing ? (
              <>
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <Edit3 size={16} />
                  Editar
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid #fecaca',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditing(false)
                    setFormData({
                      nombre: evento.nombre,
                      tipo: evento.tipo,
                      descripcion: evento.descripcion,
                      fecha: evento.fecha.split('T')[0],
                      horaInicio: evento.horaInicio,
                      horaFin: evento.horaFin,
                      lugar: evento.lugar,
                      direccion: evento.direccion,
                      estado: evento.estado,
                      asistentes: evento.asistentes,
                      adopciones: evento.adopciones
                    })
                  }}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#7d2447',
                    color: 'white',
                    fontSize: '14px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1
                  }}
                >
                  <Save size={16} />
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {!editing && evento.estado !== 'cancelado' && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px'
        }}>
          <span style={{ color: '#64748b', fontSize: '14px', marginRight: '8px', alignSelf: 'center' }}>
            Cambiar estado:
          </span>
          {estadosEvento.filter(e => e.value !== evento.estado && e.value !== 'cancelado').map(estado => (
            <button
              key={estado.value}
              onClick={() => handleQuickStatusChange(estado.value)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: `1px solid ${estado.color}40`,
                backgroundColor: `${estado.color}10`,
                color: estado.color,
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {estado.label}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Main Content */}
        <div>
          {/* Event Details Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '20px' }}>
              Información del Evento
            </h2>

            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Nombre del Evento *</label>
                  <input
                    type="text"
                    value={formData.nombre || ''}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Tipo de Evento</label>
                    <select
                      value={formData.tipo || ''}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      {tiposEvento.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Estado</label>
                    <select
                      value={formData.estado || ''}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value as Evento['estado'] })}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      {estadosEvento.map(e => (
                        <option key={e.value} value={e.value}>{e.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Descripción</label>
                  <textarea
                    value={formData.descripcion || ''}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Fecha *</label>
                    <input
                      type="date"
                      value={formData.fecha || ''}
                      onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Hora Inicio</label>
                    <input
                      type="time"
                      value={formData.horaInicio || ''}
                      onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Hora Fin</label>
                    <input
                      type="time"
                      value={formData.horaFin || ''}
                      onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Lugar</label>
                    <input
                      type="text"
                      value={formData.lugar || ''}
                      onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Dirección</label>
                    <input
                      type="text"
                      value={formData.direccion || ''}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Asistentes</label>
                    <input
                      type="number"
                      value={formData.asistentes || 0}
                      onChange={(e) => setFormData({ ...formData, asistentes: parseInt(e.target.value) || 0 })}
                      style={inputStyle}
                      min="0"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Adopciones Realizadas</label>
                    <input
                      type="number"
                      value={formData.adopciones || 0}
                      onChange={(e) => setFormData({ ...formData, adopciones: parseInt(e.target.value) || 0 })}
                      style={inputStyle}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {evento.descripcion && (
                  <div>
                    <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>Descripción</p>
                    <p style={{ color: '#0f172a', fontSize: '15px', lineHeight: '1.6' }}>
                      {evento.descripcion}
                    </p>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Calendar size={18} style={{ color: '#64748b' }} />
                    <div>
                      <p style={{ color: '#64748b', fontSize: '12px' }}>Fecha</p>
                      <p style={{ color: '#0f172a', fontSize: '14px', fontWeight: '500' }}>
                        {formatDate(evento.fecha)}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={18} style={{ color: '#64748b' }} />
                    <div>
                      <p style={{ color: '#64748b', fontSize: '12px' }}>Horario</p>
                      <p style={{ color: '#0f172a', fontSize: '14px', fontWeight: '500' }}>
                        {evento.horaInicio} - {evento.horaFin}
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={18} style={{ color: '#64748b' }} />
                  <div>
                    <p style={{ color: '#64748b', fontSize: '12px' }}>Ubicación</p>
                    <p style={{ color: '#0f172a', fontSize: '14px', fontWeight: '500' }}>
                      {evento.lugar}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '13px' }}>
                      {evento.direccion}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Associated Dogs */}
          {evento.perritos && evento.perritos.length > 0 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
                Perritos Participantes ({evento.perritos.length})
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {evento.perritos.map(perrito => (
                  <Link
                    key={perrito.id}
                    href={`/admin/perritos/${perrito.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      backgroundColor: '#e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      {perrito.fotoPrincipal ? (
                        <img
                          src={perrito.fotoPrincipal}
                          alt={perrito.nombre}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Dog size={24} style={{ color: '#94a3b8' }} />
                      )}
                    </div>
                    <div>
                      <p style={{ fontWeight: '500', color: '#0f172a', fontSize: '14px' }}>
                        {perrito.nombre}
                      </p>
                      <p style={{ color: '#64748b', fontSize: '12px' }}>
                        {perrito.codigo}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Stats Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
              Resultados del Evento
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: '#f0fdf4',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={20} style={{ color: '#16a34a' }} />
                  <span style={{ color: '#166534', fontSize: '14px' }}>Asistentes</span>
                </div>
                <span style={{ fontSize: '24px', fontWeight: '700', color: '#166534' }}>
                  {evento.asistentes}
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: '#fef3c7',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Dog size={20} style={{ color: '#d97706' }} />
                  <span style={{ color: '#92400e', fontSize: '14px' }}>Adopciones</span>
                </div>
                <span style={{ fontSize: '24px', fontWeight: '700', color: '#92400e' }}>
                  {evento.adopciones}
                </span>
              </div>

              {evento.asistentes > 0 && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>
                    Tasa de conversión
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a' }}>
                    {((evento.adopciones / evento.asistentes) * 100).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
              Información
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>ID</span>
                <span style={{ color: '#0f172a', fontFamily: 'monospace', fontSize: '12px' }}>
                  {evento.id.slice(0, 8)}...
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Tipo</span>
                <span style={{ color: '#0f172a' }}>{getTipoLabel(evento.tipo)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Perritos</span>
                <span style={{ color: '#0f172a' }}>{evento.perritosIds.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>
              Eliminar Evento
            </h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              ¿Estás seguro de que deseas eliminar "{evento.nombre}"? Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
