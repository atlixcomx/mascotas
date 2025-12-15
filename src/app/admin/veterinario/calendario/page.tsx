'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  Calendar, Plus, Clock, Dog, User,
  ChevronLeft, ChevronRight, Search,
  Filter, AlertCircle, CheckCircle,
  Edit, Trash2, Eye, MapPin
} from 'lucide-react'
import styles from '../veterinario.module.css'

interface CitaVeterinaria {
  id: string
  fecha: string
  hora: string
  mascotaId: string
  mascotaNombre: string
  mascotaCodigo: string
  duenio: string
  motivo: string
  estado: 'programada' | 'confirmada' | 'completada' | 'cancelada'
  veterinario: string
  notas?: string
}

export default function CalendarioCitasPage() {
  const { data: session } = useSession()
  const [citas, setCitas] = useState<CitaVeterinaria[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewType, setViewType] = useState<'dia' | 'semana' | 'mes'>('dia')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('todas')

  useEffect(() => {
    fetchCitas()
  }, [selectedDate, viewType])

  const getDateRange = () => {
    const start = new Date(selectedDate)
    const end = new Date(selectedDate)

    if (viewType === 'dia') {
      return { start, end }
    } else if (viewType === 'semana') {
      const dayOfWeek = start.getDay()
      start.setDate(start.getDate() - dayOfWeek)
      end.setDate(start.getDate() + 6)
      return { start, end }
    } else {
      start.setDate(1)
      end.setMonth(end.getMonth() + 1)
      end.setDate(0)
      return { start, end }
    }
  }

  const fetchCitas = async () => {
    try {
      setLoading(true)
      const { start, end } = getDateRange()
      const startStr = start.toISOString().split('T')[0]
      const endStr = end.toISOString().split('T')[0]

      const response = await fetch(`/api/admin/citas?fechaInicio=${startStr}&fechaFin=${endStr}`)

      if (response.ok) {
        const data = await response.json()
        const citasData: CitaVeterinaria[] = (data.citas || []).map((c: any) => ({
          id: c.id,
          fecha: c.fecha,
          hora: c.hora,
          mascotaId: c.mascotaId,
          mascotaNombre: c.mascotaNombre,
          mascotaCodigo: c.mascotaCodigo,
          duenio: c.duenio || 'Sin asignar',
          motivo: c.motivo,
          estado: c.estado,
          veterinario: c.veterinario || session?.user?.name || 'Veterinario',
          notas: c.notas
        }))
        setCitas(citasData)
      } else {
        console.error('Error en respuesta:', response.status)
        setCitas([])
      }
    } catch (error) {
      console.error('Error fetching citas:', error)
      setCitas([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'confirmada': return '#16a34a'
      case 'programada': return '#eab308'
      case 'completada': return '#6b7280'
      case 'cancelada': return '#dc2626'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'confirmada': return <CheckCircle size={16} />
      case 'programada': return <Clock size={16} />
      case 'completada': return <CheckCircle size={16} />
      case 'cancelada': return <AlertCircle size={16} />
      default: return <Clock size={16} />
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric'
    })
  }

  const handleUpdateStatus = async (id: string, nuevoEstado: string) => {
    try {
      const response = await fetch(`/api/admin/citas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      })

      if (response.ok) {
        setCitas(citas.map(c =>
          c.id === id ? { ...c, estado: nuevoEstado as CitaVeterinaria['estado'] } : c
        ))
      }
    } catch (error) {
      console.error('Error updating cita:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) return

    try {
      const response = await fetch(`/api/admin/citas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'cancelada' })
      })

      if (response.ok) {
        setCitas(citas.map(c =>
          c.id === id ? { ...c, estado: 'cancelada' } : c
        ))
      }
    } catch (error) {
      console.error('Error canceling cita:', error)
    }
  }

  const filteredCitas = citas.filter(cita => {
    const matchesSearch = cita.mascotaNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cita.duenio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cita.mascotaCodigo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === 'todas' || cita.estado === filterStatus

    return matchesSearch && matchesFilter
  })

  const getCitasForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return filteredCitas.filter(c => c.fecha === dateStr)
  }

  const navigateDate = (direction: number) => {
    const newDate = new Date(selectedDate)
    if (viewType === 'dia') {
      newDate.setDate(newDate.getDate() + direction)
    } else if (viewType === 'semana') {
      newDate.setDate(newDate.getDate() + (direction * 7))
    } else {
      newDate.setMonth(newDate.getMonth() + direction)
    }
    setSelectedDate(newDate)
  }

  const getWeekDays = () => {
    const days: Date[] = []
    const start = new Date(selectedDate)
    const dayOfWeek = start.getDay()
    start.setDate(start.getDate() - dayOfWeek)

    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      days.push(day)
    }
    return days
  }

  const getMonthDays = () => {
    const days: (Date | null)[] = []
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)

    // Días vacíos antes del primer día del mes
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }

    // Días del mes
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i))
    }

    return days
  }

  const getHeaderTitle = () => {
    if (viewType === 'dia') {
      return formatDate(selectedDate)
    } else if (viewType === 'semana') {
      const days = getWeekDays()
      return `${days[0].getDate()} - ${days[6].getDate()} de ${days[0].toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`
    } else {
      return selectedDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    }
  }

  const renderCitaCard = (cita: CitaVeterinaria, compact: boolean = false) => (
    <div
      key={cita.id}
      style={{
        padding: compact ? '8px' : '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: `2px solid ${getStatusColor(cita.estado)}20`,
        marginBottom: '8px',
        fontSize: compact ? '12px' : '14px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: compact ? '4px' : '8px' }}>
        <Clock size={compact ? 12 : 14} style={{ color: '#6b7280' }} />
        <span style={{ fontWeight: '600' }}>{cita.hora}</span>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: compact ? '10px' : '12px',
            backgroundColor: `${getStatusColor(cita.estado)}20`,
            color: getStatusColor(cita.estado)
          }}
        >
          {cita.estado}
        </span>
      </div>
      <div style={{ fontWeight: '600', color: '#0f172a' }}>
        {cita.mascotaNombre}
      </div>
      {!compact && (
        <>
          <div style={{ color: '#6b7280', fontSize: '13px' }}>
            {cita.duenio} • {cita.motivo}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            {cita.estado === 'programada' && (
              <button
                onClick={() => handleUpdateStatus(cita.id, 'confirmada')}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Confirmar
              </button>
            )}
            {cita.estado !== 'cancelada' && cita.estado !== 'completada' && (
              <button
                onClick={() => handleDelete(cita.id)}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )

  const renderDayView = () => (
    <div className={styles.citasList}>
      {filteredCitas.length > 0 ? (
        filteredCitas.map(cita => renderCitaCard(cita, false))
      ) : (
        <div className={styles.emptyCitas}>
          <Calendar size={48} />
          <h3>No hay citas programadas</h3>
          <p>No se encontraron citas para este día</p>
          <Link href="/admin/veterinario/calendario/nueva" className={styles.primaryButton}>
            <Plus size={20} />
            Programar Cita
          </Link>
        </div>
      )}
    </div>
  )

  const renderWeekView = () => {
    const weekDays = getWeekDays()
    const today = new Date().toISOString().split('T')[0]

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '8px',
        backgroundColor: '#f8fafc',
        padding: '16px',
        borderRadius: '12px'
      }}>
        {weekDays.map((day, index) => {
          const dayStr = day.toISOString().split('T')[0]
          const isToday = dayStr === today
          const dayCitas = getCitasForDate(day)

          return (
            <div
              key={index}
              style={{
                backgroundColor: isToday ? '#eff6ff' : 'white',
                borderRadius: '8px',
                padding: '12px',
                minHeight: '200px',
                border: isToday ? '2px solid #3b82f6' : '1px solid #e2e8f0'
              }}
            >
              <div style={{
                textAlign: 'center',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  textTransform: 'uppercase'
                }}>
                  {day.toLocaleDateString('es-ES', { weekday: 'short' })}
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: isToday ? '#3b82f6' : '#0f172a'
                }}>
                  {day.getDate()}
                </div>
              </div>

              <div style={{ fontSize: '12px' }}>
                {dayCitas.length > 0 ? (
                  dayCitas.map(cita => renderCitaCard(cita, true))
                ) : (
                  <div style={{
                    color: '#9ca3af',
                    textAlign: 'center',
                    padding: '20px 0'
                  }}>
                    Sin citas
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderMonthView = () => {
    const monthDays = getMonthDays()
    const today = new Date().toISOString().split('T')[0]
    const weekDayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #e2e8f0'
      }}>
        {/* Header con días de la semana */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          marginBottom: '8px'
        }}>
          {weekDayNames.map(day => (
            <div key={day} style={{
              textAlign: 'center',
              padding: '8px',
              fontWeight: '600',
              color: '#6b7280',
              fontSize: '12px'
            }}>
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px'
        }}>
          {monthDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} style={{ padding: '8px' }} />
            }

            const dayStr = day.toISOString().split('T')[0]
            const isToday = dayStr === today
            const dayCitas = getCitasForDate(day)
            const hasConfirmed = dayCitas.some(c => c.estado === 'confirmada')
            const hasProgrammed = dayCitas.some(c => c.estado === 'programada')

            return (
              <div
                key={index}
                onClick={() => {
                  setSelectedDate(day)
                  setViewType('dia')
                }}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: isToday ? '#eff6ff' : dayCitas.length > 0 ? '#f8fafc' : 'white',
                  border: isToday ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  minHeight: '80px',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  fontWeight: isToday ? '700' : '500',
                  color: isToday ? '#3b82f6' : '#0f172a',
                  marginBottom: '4px'
                }}>
                  {day.getDate()}
                </div>

                {dayCitas.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      {dayCitas.length} cita{dayCitas.length > 1 ? 's' : ''}
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {hasConfirmed && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#16a34a'
                        }} />
                      )}
                      {hasProgrammed && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#eab308'
                        }} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Leyenda */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #e2e8f0',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6b7280' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
            Confirmada
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6b7280' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#eab308' }} />
            Programada
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando calendario...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <Calendar className={styles.headerIcon} />
            <div>
              <h1 className={styles.title}>Calendario de Citas</h1>
              <p className={styles.subtitle}>Gestión de citas veterinarias</p>
            </div>
          </div>

          <div className={styles.headerActions}>
            <Link href="/admin/veterinario/calendario/nueva" className={styles.primaryButton}>
              <Plus size={20} />
              Nueva Cita
            </Link>
          </div>
        </div>
      </div>

      {/* Controles de Calendario */}
      <div className={styles.calendarControls}>
        <div className={styles.dateNavigation}>
          <button
            onClick={() => navigateDate(-1)}
            className={styles.navButton}
          >
            <ChevronLeft size={20} />
          </button>

          <h2 className={styles.selectedDate} style={{ textTransform: 'capitalize' }}>
            {getHeaderTitle()}
          </h2>

          <button
            onClick={() => navigateDate(1)}
            className={styles.navButton}
          >
            <ChevronRight size={20} />
          </button>

          <button
            onClick={() => setSelectedDate(new Date())}
            style={{
              marginLeft: '16px',
              padding: '8px 16px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              color: '#475569'
            }}
          >
            Hoy
          </button>
        </div>

        <div className={styles.viewControls}>
          <button
            onClick={() => setViewType('dia')}
            className={`${styles.viewButton} ${viewType === 'dia' ? styles.active : ''}`}
          >
            Día
          </button>
          <button
            onClick={() => setViewType('semana')}
            className={`${styles.viewButton} ${viewType === 'semana' ? styles.active : ''}`}
          >
            Semana
          </button>
          <button
            onClick={() => setViewType('mes')}
            className={`${styles.viewButton} ${viewType === 'mes' ? styles.active : ''}`}
          >
            Mes
          </button>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className={styles.section}>
        <div className={styles.filtersRow}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por mascota, dueño o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <Filter size={16} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="todas">Todas las citas</option>
              <option value="programada">Programadas</option>
              <option value="confirmada">Confirmadas</option>
              <option value="completada">Completadas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vista del Calendario */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {viewType === 'dia' && `Citas del día (${filteredCitas.length})`}
            {viewType === 'semana' && `Vista Semanal`}
            {viewType === 'mes' && `Vista Mensual`}
          </h2>
        </div>

        {viewType === 'dia' && renderDayView()}
        {viewType === 'semana' && renderWeekView()}
        {viewType === 'mes' && renderMonthView()}
      </div>
    </div>
  )
}
