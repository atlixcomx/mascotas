'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  Syringe, Plus, Calendar, Dog, AlertCircle,
  CheckCircle, Clock, Search, Filter,
  TrendingUp, Activity, FileText, Download
} from 'lucide-react'
import styles from '../veterinario.module.css'

interface VacunacionRecord {
  id: string
  mascotaId: string
  mascotaNombre: string
  mascotaCodigo: string
  tipoVacuna: string
  fechaAplicacion?: string
  fechaVencimiento: string
  estado: 'pendiente' | 'aplicada' | 'vencida' | 'proxima'
  lote?: string
  veterinario?: string
  notas?: string
}

interface EstadisticasVacunacion {
  totalMascotas: number
  alDia: number
  pendientes: number
  vencidas: number
  proximasVencer: number
}

export default function ProgramaVacunacionPage() {
  const { data: session } = useSession()
  const [vacunaciones, setVacunaciones] = useState<VacunacionRecord[]>([])
  const [stats, setStats] = useState<EstadisticasVacunacion>({
    totalMascotas: 0,
    alDia: 0,
    pendientes: 0,
    vencidas: 0,
    proximasVencer: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('todas')
  const [filterVaccine, setFilterVaccine] = useState('todas')

  const tiposVacuna = [
    'Antirrábica',
    'DHPP (Quíntuple)',
    'Parvovirus',
    'Moquillo',
    'Hepatitis',
    'Parainfluenza',
    'Bordetella',
    'Leptospirosis'
  ]

  useEffect(() => {
    fetchVacunaciones()
  }, [])

  const fetchVacunaciones = async () => {
    try {
      // Datos mock para demostrar funcionalidad
      const vacunacionesMock: VacunacionRecord[] = [
        {
          id: '1',
          mascotaId: '1',
          mascotaNombre: 'Max',
          mascotaCodigo: 'P001',
          tipoVacuna: 'Antirrábica',
          fechaAplicacion: '2024-01-15',
          fechaVencimiento: '2025-01-15',
          estado: 'aplicada',
          lote: 'VAC-2024-001',
          veterinario: session?.user?.name,
          notas: 'Aplicada sin complicaciones'
        },
        {
          id: '2',
          mascotaId: '2',
          mascotaNombre: 'Luna',
          mascotaCodigo: 'P002',
          tipoVacuna: 'DHPP (Quíntuple)',
          fechaVencimiento: '2024-01-25',
          estado: 'pendiente'
        },
        {
          id: '3',
          mascotaId: '3',
          mascotaNombre: 'Rocky',
          mascotaCodigo: 'P003',
          tipoVacuna: 'Antirrábica',
          fechaVencimiento: '2024-01-22',
          estado: 'proxima'
        },
        {
          id: '4',
          mascotaId: '4',
          mascotaNombre: 'Bella',
          mascotaCodigo: 'P004',
          tipoVacuna: 'Parvovirus',
          fechaVencimiento: '2024-01-18',
          estado: 'vencida'
        }
      ]

      setVacunaciones(vacunacionesMock)
      
      // Calcular estadísticas
      setStats({
        totalMascotas: 45,
        alDia: 32,
        pendientes: 8,
        vencidas: 3,
        proximasVencer: 2
      })
    } catch (error) {
      console.error('Error fetching vacunaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'aplicada': return '#16a34a'
      case 'pendiente': return '#eab308'
      case 'proxima': return '#f97316'
      case 'vencida': return '#dc2626'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'aplicada': return <CheckCircle size={16} />
      case 'pendiente': return <Clock size={16} />
      case 'proxima': return <AlertCircle size={16} />
      case 'vencida': return <AlertCircle size={16} />
      default: return <Clock size={16} />
    }
  }

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'aplicada': return 'Aplicada'
      case 'pendiente': return 'Pendiente'
      case 'proxima': return 'Próxima a vencer'
      case 'vencida': return 'Vencida'
      default: return estado
    }
  }

  const filteredVacunaciones = vacunaciones.filter(vac => {
    const matchesSearch = vac.mascotaNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vac.mascotaCodigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vac.tipoVacuna.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'todas' || vac.estado === filterStatus
    const matchesVaccine = filterVaccine === 'todas' || vac.tipoVacuna === filterVaccine
    
    return matchesSearch && matchesStatus && matchesVaccine
  })

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando programa de vacunación...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <Syringe className={styles.headerIcon} />
            <div>
              <h1 className={styles.title}>Programa de Vacunación</h1>
              <p className={styles.subtitle}>Control y seguimiento de vacunas</p>
            </div>
          </div>
          
          <div className={styles.headerActions}>
            <button className={styles.secondaryButton}>
              <Download size={20} />
              Exportar Reporte
            </button>
            <Link href="/admin/veterinario/vacunacion/nueva" className={styles.primaryButton}>
              <Plus size={20} />
              Registrar Vacuna
            </Link>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#e0f2fe' }}>
            <Dog size={24} style={{ color: '#0284c7' }} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Mascotas</p>
            <p className={styles.statValue}>{stats.totalMascotas}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#dcfce7' }}>
            <CheckCircle size={24} style={{ color: '#16a34a' }} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Vacunas al Día</p>
            <p className={styles.statValue}>{stats.alDia}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fef3c7' }}>
            <Clock size={24} style={{ color: '#d97706' }} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Pendientes</p>
            <p className={styles.statValue}>{stats.pendientes}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fee2e2' }}>
            <AlertCircle size={24} style={{ color: '#dc2626' }} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Vencidas</p>
            <p className={styles.statValue}>{stats.vencidas}</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className={styles.section}>
        <div className={styles.filtersRow}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por mascota, código o tipo de vacuna..."
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
              <option value="todas">Todos los estados</option>
              <option value="aplicada">Aplicadas</option>
              <option value="pendiente">Pendientes</option>
              <option value="proxima">Próximas a vencer</option>
              <option value="vencida">Vencidas</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <Syringe size={16} />
            <select
              value={filterVaccine}
              onChange={(e) => setFilterVaccine(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="todas">Todas las vacunas</option>
              {tiposVacuna.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Vacunaciones */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Registro de Vacunaciones ({filteredVacunaciones.length})
          </h2>
        </div>

        <div className={styles.vacunacionTable}>
          <div className={styles.tableHeader}>
            <span>Mascota</span>
            <span>Vacuna</span>
            <span>Fecha Aplicación</span>
            <span>Vencimiento</span>
            <span>Estado</span>
            <span>Acciones</span>
          </div>

          {filteredVacunaciones.map(vac => (
            <div key={vac.id} className={styles.tableRow}>
              <div className={styles.mascotaCell}>
                <div>
                  <strong>{vac.mascotaNombre}</strong>
                  <span className={styles.codigo}>({vac.mascotaCodigo})</span>
                </div>
              </div>

              <div className={styles.vacunaCell}>
                <span>{vac.tipoVacuna}</span>
                {vac.lote && (
                  <span className={styles.lote}>Lote: {vac.lote}</span>
                )}
              </div>

              <div className={styles.fechaCell}>
                {vac.fechaAplicacion ? (
                  <span>{new Date(vac.fechaAplicacion).toLocaleDateString()}</span>
                ) : (
                  <span className={styles.noData}>No aplicada</span>
                )}
              </div>

              <div className={styles.fechaCell}>
                <span>{new Date(vac.fechaVencimiento).toLocaleDateString()}</span>
              </div>

              <div className={styles.estadoCell}>
                <span 
                  className={styles.estadoBadge}
                  style={{ 
                    backgroundColor: `${getStatusColor(vac.estado)}20`,
                    color: getStatusColor(vac.estado)
                  }}
                >
                  {getStatusIcon(vac.estado)}
                  {getStatusText(vac.estado)}
                </span>
              </div>

              <div className={styles.actionsCell}>
                <button className={styles.actionButton} title="Ver detalles">
                  <FileText size={16} />
                </button>
                {vac.estado === 'pendiente' && (
                  <button className={styles.actionButton} title="Aplicar vacuna">
                    <Syringe size={16} />
                  </button>
                )}
                <button className={styles.actionButton} title="Programar siguiente">
                  <Calendar size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVacunaciones.length === 0 && (
          <div className={styles.emptyState}>
            <Syringe size={48} />
            <h3>No hay registros de vacunación</h3>
            <p>No se encontraron registros con los filtros seleccionados</p>
          </div>
        )}
      </div>

      {/* Alertas de Vacunas Próximas */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <AlertCircle size={20} />
            Alertas de Vacunación
          </h2>
        </div>

        <div className={styles.alertsGrid}>
          <div className={styles.alertCard} style={{ borderLeftColor: '#dc2626' }}>
            <div className={styles.alertIcon}>
              <AlertCircle size={24} style={{ color: '#dc2626' }} />
            </div>
            <div className={styles.alertContent}>
              <h4>Vacunas Vencidas</h4>
              <p>{stats.vencidas} mascotas tienen vacunas vencidas que requieren atención inmediata</p>
              <button className={styles.alertButton}>Ver detalles</button>
            </div>
          </div>

          <div className={styles.alertCard} style={{ borderLeftColor: '#f97316' }}>
            <div className={styles.alertIcon}>
              <Clock size={24} style={{ color: '#f97316' }} />
            </div>
            <div className={styles.alertContent}>
              <h4>Próximas a Vencer</h4>
              <p>{stats.proximasVencer} vacunas vencen en los próximos 7 días</p>
              <button className={styles.alertButton}>Programar citas</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}