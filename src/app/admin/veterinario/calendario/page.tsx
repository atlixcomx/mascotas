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
      // Por ahora usar datos mock
      const citasMock: CitaVeterinaria[] = [
        {
          id: '1',
          fecha: '2024-01-20',
          hora: '09:00',
          mascotaId: '1',
          mascotaNombre: 'Max',
          mascotaCodigo: 'P001',
          duenio: 'Juan Pérez',
          motivo: 'Vacunación anual',
          estado: 'confirmada',
          veterinario: session?.user?.name || 'Dr. Veterinario',
          notas: 'Primera dosis de refuerzo'
        },
        {
          id: '2',
          fecha: '2024-01-20',
          hora: '10:30',
          mascotaId: '2',
          mascotaNombre: 'Luna',
          mascotaCodigo: 'P002',
          duenio: 'María García',
          motivo: 'Revisión general',
          estado: 'programada',
          veterinario: session?.user?.name || 'Dr. Veterinario'
        },
        {
          id: '3',
          fecha: '2024-01-20',
          hora: '14:00',
          mascotaId: '3',
          mascotaNombre: 'Rocky',
          mascotaCodigo: 'P003',
          duenio: 'Carlos López',
          motivo: 'Esterilización',
          estado: 'confirmada',
          veterinario: session?.user?.name || 'Dr. Veterinario',
          notas: 'Cirugía programada'
        }
      ]
      
      setCitas(citasMock)
    } catch (error) {
      console.error('Error fetching citas:', error)
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
                <button className={styles.actionButton} title="Ver detalles">
                  <Eye size={18} />
                </button>
                <button className={styles.actionButton} title="Editar">
                  <Edit size={18} />
                </button>
                <button className={styles.actionButton} title="Cancelar">
                  <Trash2 size={18} />
                </button>
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