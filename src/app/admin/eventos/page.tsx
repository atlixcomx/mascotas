'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  Heart,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface Evento {
  id: string
  nombre: string
  tipo: string
  tipoLabel: string
  descripcion: string
  fecha: string
  horaInicio: string
  horaFin: string
  lugar: string
  direccion: string
  estado: string
  asistentes: number
  adopciones: number
}

interface Stats {
  total: number
  programados: number
  completados: number
  cancelados: number
  totalAdopciones: number
  totalAsistentes: number
}

const estadoConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  programado: { label: 'Programado', color: '#2563eb', bgColor: '#dbeafe', icon: Calendar },
  en_curso: { label: 'En Curso', color: '#f59e0b', bgColor: '#fef3c7', icon: Clock },
  completado: { label: 'Completado', color: '#16a34a', bgColor: '#dcfce7', icon: CheckCircle },
  cancelado: { label: 'Cancelado', color: '#dc2626', bgColor: '#fee2e2', icon: XCircle }
}

const tipoConfig: Record<string, { color: string; bgColor: string }> = {
  feria_adopcion: { color: '#ec4899', bgColor: '#fce7f3' },
  campana_esterilizacion: { color: '#8b5cf6', bgColor: '#ede9fe' },
  jornada_vacunacion: { color: '#06b6d4', bgColor: '#cffafe' },
  capacitacion: { color: '#f97316', bgColor: '#ffedd5' },
  evento_comunitario: { color: '#22c55e', bgColor: '#dcfce7' },
  otro: { color: '#6b7280', bgColor: '#f3f4f6' }
}

export default function EventosPage() {
  const router = useRouter()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [tiposEvento, setTiposEvento] = useState<{value: string, label: string}[]>([])

  useEffect(() => {
    fetchEventos()
  }, [currentPage, filterTipo, filterEstado])

  async function fetchEventos() {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })

      if (filterTipo) params.append('tipo', filterTipo)
      if (filterEstado) params.append('estado', filterEstado)

      const response = await fetch(`/api/admin/eventos?${params}`)

      if (response.ok) {
        const data = await response.json()
        setEventos(data.eventos || [])
        setTotalPages(data.pagination?.totalPages || 1)
        setStats(data.stats || null)
        setTiposEvento(data.tiposEvento || [])
      } else {
        console.error('Error:', response.status)
        setEventos([])
      }
    } catch (error) {
      console.error('Error fetching eventos:', error)
      setEventos([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return

    try {
      const response = await fetch(`/api/admin/eventos/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchEventos()
      }
    } catch (error) {
      console.error('Error deleting evento:', error)
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
            Eventos y Campañas
          </h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>
            Gestiona ferias de adopción, campañas y eventos comunitarios
          </p>
        </div>
        <Link
          href="/admin/eventos/nuevo"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#7d2447',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          <Plus size={18} />
          Nuevo Evento
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {[
            { label: 'Total Eventos', value: stats.total, icon: Calendar, color: '#2563eb' },
            { label: 'Programados', value: stats.programados, icon: Clock, color: '#f59e0b' },
            { label: 'Completados', value: stats.completados, icon: CheckCircle, color: '#16a34a' },
            { label: 'Total Asistentes', value: stats.totalAsistentes, icon: Users, color: '#8b5cf6' },
            { label: 'Adopciones en Eventos', value: stats.totalAdopciones, icon: Heart, color: '#ec4899' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{stat.label}</p>
                  <p style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '4px 0 0' }}>
                    {stat.value}
                  </p>
                </div>
                <div style={{
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: `${stat.color}15`
                }}>
                  <stat.icon size={20} color={stat.color} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 10px 10px 40px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>
        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
          style={{
            padding: '10px 16px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="">Todos los tipos</option>
          {tiposEvento.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          style={{
            padding: '10px 16px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="">Todos los estados</option>
          <option value="programado">Programado</option>
          <option value="en_curso">En Curso</option>
          <option value="completado">Completado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Events List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          Cargando eventos...
        </div>
      ) : eventos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Calendar size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
          <h3 style={{ color: '#0f172a', marginBottom: '8px' }}>No hay eventos</h3>
          <p style={{ color: '#64748b', marginBottom: '16px' }}>Crea tu primer evento para empezar</p>
          <Link
            href="/admin/eventos/nuevo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#7d2447',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none'
            }}
          >
            <Plus size={18} /> Crear Evento
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {eventos.map(evento => {
            const estadoInfo = estadoConfig[evento.estado] || estadoConfig.programado
            const tipoInfo = tipoConfig[evento.tipo] || tipoConfig.otro
            const EstadoIcon = estadoInfo.icon

            return (
              <div
                key={evento.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start'
                }}
              >
                {/* Date Box */}
                <div style={{
                  minWidth: '80px',
                  textAlign: 'center',
                  padding: '12px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '8px'
                }}>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0, textTransform: 'uppercase' }}>
                    {new Date(evento.fecha).toLocaleDateString('es-MX', { month: 'short' })}
                  </p>
                  <p style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: '4px 0' }}>
                    {new Date(evento.fecha).getDate()}
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                    {new Date(evento.fecha).getFullYear()}
                  </p>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: tipoInfo.bgColor,
                      color: tipoInfo.color
                    }}>
                      {evento.tipoLabel}
                    </span>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: estadoInfo.bgColor,
                      color: estadoInfo.color
                    }}>
                      <EstadoIcon size={12} />
                      {estadoInfo.label}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', margin: '0 0 8px' }}>
                    {evento.nombre}
                  </h3>

                  <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 12px', lineHeight: '1.5' }}>
                    {evento.descripcion?.substring(0, 150)}
                    {evento.descripcion?.length > 150 ? '...' : ''}
                  </p>

                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' }}>
                      <Clock size={14} />
                      {evento.horaInicio} - {evento.horaFin}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' }}>
                      <MapPin size={14} />
                      {evento.lugar}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' }}>
                      <Users size={14} />
                      {evento.asistentes} asistentes
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ec4899', fontSize: '13px' }}>
                      <Heart size={14} />
                      {evento.adopciones} adopciones
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    href={`/admin/eventos/${evento.id}`}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Eye size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(evento.id)}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '24px'
        }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <span style={{ color: '#64748b', fontSize: '14px' }}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
