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
  }, [selectedDate])

  const fetchCitas = async () => {
    try {
      setLoading(true)
      const fechaStr = selectedDate.toISOString().split('T')[0]
      const response = await fetch(`/api/admin/citas?fecha=${fechaStr}`)

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
            onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
            className={styles.navButton}
          >
            <ChevronLeft size={20} />
          </button>
          
          <h2 className={styles.selectedDate}>
            {formatDate(selectedDate)}
          </h2>
          
          <button
            onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
            className={styles.navButton}
          >
            <ChevronRight size={20} />
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

      {/* Lista de Citas */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Citas del día ({filteredCitas.length})
          </h2>
        </div>

        <div className={styles.citasList}>
          {filteredCitas.map(cita => (
            <div key={cita.id} className={styles.citaCard}>
              <div className={styles.citaTime}>
                <Clock size={18} />
                <span>{cita.hora}</span>
              </div>

              <div className={styles.citaInfo}>
                <div className={styles.citaHeader}>
                  <h3 className={styles.citaMascota}>
                    {cita.mascotaNombre} ({cita.mascotaCodigo})
                  </h3>
                  <span 
                    className={styles.citaEstado}
                    style={{ 
                      backgroundColor: `${getStatusColor(cita.estado)}20`,
                      color: getStatusColor(cita.estado)
                    }}
                  >
                    {getStatusIcon(cita.estado)}
                    {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                  </span>
                </div>

                <div className={styles.citaDetails}>
                  <div className={styles.citaDetail}>
                    <User size={14} />
                    <span>Dueño: {cita.duenio}</span>
                  </div>
                  <div className={styles.citaDetail}>
                    <MapPin size={14} />
                    <span>Motivo: {cita.motivo}</span>
                  </div>
                  <div className={styles.citaDetail}>
                    <User size={14} />
                    <span>Veterinario: {cita.veterinario}</span>
                  </div>
                </div>

                {cita.notas && (
                  <div className={styles.citaNotas}>
                    <strong>Notas:</strong> {cita.notas}
                  </div>
                )}
              </div>

              <div className={styles.citaActions}>
                {cita.estado === 'programada' && (
                  <button
                    className={styles.actionButton}
                    title="Confirmar cita"
                    onClick={() => handleUpdateStatus(cita.id, 'confirmada')}
                    style={{ color: '#16a34a' }}
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
                {(cita.estado === 'programada' || cita.estado === 'confirmada') && (
                  <button
                    className={styles.actionButton}
                    title="Marcar completada"
                    onClick={() => handleUpdateStatus(cita.id, 'completada')}
                  >
                    <Eye size={18} />
                  </button>
                )}
                {cita.estado !== 'cancelada' && cita.estado !== 'completada' && (
                  <button
                    className={styles.actionButton}
                    title="Cancelar cita"
                    onClick={() => handleDelete(cita.id)}
                    style={{ color: '#dc2626' }}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredCitas.length === 0 && (
          <div className={styles.emptyCitas}>
            <Calendar size={48} />
            <h3>No hay citas programadas</h3>
            <p>No se encontraron citas para los filtros seleccionados</p>
            <Link href="/admin/veterinario/calendario/nueva" className={styles.primaryButton}>
              <Plus size={20} />
              Programar Primera Cita
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}