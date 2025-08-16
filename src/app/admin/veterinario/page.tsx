'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Stethoscope, Plus, Search, Calendar, FileText, 
  AlertCircle, CheckCircle, Clock, Activity,
  Heart, Syringe, Shield, ChevronRight, Dog,
  ClipboardList, UserPlus, History, TrendingUp
} from 'lucide-react'
import styles from './veterinario.module.css'

interface Mascota {
  id: string
  nombre: string
  codigo: string
  fotoPrincipal: string
  edad: string
  sexo: string
  tamano: string
  vacunas: boolean
  esterilizado: boolean
  desparasitado: boolean
  estado: string
  ultimaConsulta?: string
  proximaCita?: string
}

interface ConsultaReciente {
  id: string
  mascotaId: string
  mascotaNombre: string
  fecha: string
  motivo: string
  veterinario: string
  estado: 'completada' | 'pendiente' | 'en_proceso'
}

export default function VeterinarioPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [consultasRecientes, setConsultasRecientes] = useState<ConsultaReciente[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    consultasHoy: 0,
    mascotasAtendidas: 0,
    vacunacionesPendientes: 0,
    esterilizacionesPendientes: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Obtener mascotas del catálogo
      const mascotasRes = await fetch('/api/admin/perritos')
      if (mascotasRes.ok) {
        const data = await mascotasRes.json()
        setMascotas(data.perritos || [])
      }

      // Por ahora usar datos mock para consultas
      setConsultasRecientes([
        {
          id: '1',
          mascotaId: '1',
          mascotaNombre: 'Max',
          fecha: new Date().toISOString(),
          motivo: 'Vacunación anual',
          veterinario: session?.user?.name || 'Dr. Veterinario',
          estado: 'pendiente'
        },
        {
          id: '2',
          mascotaId: '2',
          mascotaNombre: 'Luna',
          fecha: new Date(Date.now() - 86400000).toISOString(),
          motivo: 'Revisión general',
          veterinario: session?.user?.name || 'Dr. Veterinario',
          estado: 'completada'
        }
      ])

      // Calcular estadísticas
      const mascotasData = await fetch('/api/admin/perritos')
      const mascotasJson = await mascotasData.json()
      const mascotasArray = mascotasJson?.perritos || []
      
      setStats({
        consultasHoy: 2,
        mascotasAtendidas: mascotasArray.length,
        vacunacionesPendientes: mascotasArray.filter((m: Mascota) => !m.vacunas).length,
        esterilizacionesPendientes: mascotasArray.filter((m: Mascota) => !m.esterilizado).length
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMascotas = mascotas.filter(m => 
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando módulo veterinario...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <Stethoscope className={styles.headerIcon} />
            <div>
              <h1 className={styles.title}>Módulo Veterinario</h1>
              <p className={styles.subtitle}>Gestión médica y diagnósticos</p>
            </div>
          </div>
          
          <div className={styles.headerActions}>
            <Link href="/admin/veterinario/nueva-consulta" className={styles.primaryButton}>
              <Plus size={20} />
              Nueva Consulta
            </Link>
            <Link href="/admin/veterinario/nuevo-ingreso" className={styles.secondaryButton}>
              <UserPlus size={20} />
              Nuevo Ingreso
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#e0f2fe' }}>
            <ClipboardList size={24} style={{ color: '#0284c7' }} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Consultas Hoy</p>
            <p className={styles.statValue}>{stats.consultasHoy}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#dcfce7' }}>
            <Dog size={24} style={{ color: '#16a34a' }} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Mascotas en Sistema</p>
            <p className={styles.statValue}>{stats.mascotasAtendidas}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fef3c7' }}>
            <Syringe size={24} style={{ color: '#d97706' }} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Vacunaciones Pendientes</p>
            <p className={styles.statValue}>{stats.vacunacionesPendientes}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fce7f3' }}>
            <Heart size={24} style={{ color: '#be185d' }} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Esterilizaciones Pendientes</p>
            <p className={styles.statValue}>{stats.esterilizacionesPendientes}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.mainGrid}>
        {/* Consultas Recientes */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Activity size={20} />
              Consultas Recientes
            </h2>
            <Link href="/admin/veterinario/historial" className={styles.viewAllLink}>
              Ver todas
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className={styles.consultasList}>
            {consultasRecientes.map(consulta => (
              <div key={consulta.id} className={styles.consultaItem}>
                <div className={styles.consultaInfo}>
                  <div className={styles.consultaHeader}>
                    <h3 className={styles.consultaMascota}>{consulta.mascotaNombre}</h3>
                    <span className={`${styles.consultaEstado} ${styles[consulta.estado]}`}>
                      {consulta.estado === 'completada' && <CheckCircle size={14} />}
                      {consulta.estado === 'pendiente' && <Clock size={14} />}
                      {consulta.estado === 'en_proceso' && <Activity size={14} />}
                      {consulta.estado.replace('_', ' ')}
                    </span>
                  </div>
                  <p className={styles.consultaMotivo}>{consulta.motivo}</p>
                  <div className={styles.consultaMeta}>
                    <span>{new Date(consulta.fecha).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{consulta.veterinario}</span>
                  </div>
                </div>
                <Link 
                  href={`/admin/veterinario/nueva-consulta?mascotaId=${consulta.mascotaId}`}
                  className={styles.consultaAction}
                >
                  <ChevronRight size={20} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Búsqueda de Mascotas */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Dog size={20} />
              Buscar Mascota del Catálogo
            </h2>
          </div>

          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.mascotasList}>
            {filteredMascotas.slice(0, 5).map(mascota => (
              <div key={mascota.id} className={styles.mascotaItem}>
                <img 
                  src={mascota.fotoPrincipal} 
                  alt={mascota.nombre}
                  className={styles.mascotaImage}
                />
                <div className={styles.mascotaInfo}>
                  <h3 className={styles.mascotaNombre}>{mascota.nombre}</h3>
                  <p className={styles.mascotaCodigo}>Código: {mascota.codigo}</p>
                  <div className={styles.mascotaEstado}>
                    {mascota.vacunas ? 
                      <span className={styles.estadoPositivo}><Syringe size={14} /> Vacunado</span> :
                      <span className={styles.estadoNegativo}><Syringe size={14} /> Sin vacunar</span>
                    }
                    {mascota.esterilizado ? 
                      <span className={styles.estadoPositivo}><Heart size={14} /> Esterilizado</span> :
                      <span className={styles.estadoNegativo}><Heart size={14} /> Sin esterilizar</span>
                    }
                  </div>
                </div>
                <Link 
                  href={`/admin/veterinario/nueva-consulta?mascotaId=${mascota.id}`}
                  className={styles.mascotaAction}
                >
                  Crear Consulta
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Acciones Rápidas</h2>
        <div className={styles.actionsGrid}>
          <button 
            onClick={() => router.push('/admin/veterinario/calendario')}
            className={styles.actionCard}
          >
            <Calendar size={24} />
            <span>Calendario de Citas</span>
          </button>
          <button 
            onClick={() => router.push('/admin/veterinario/vacunacion')}
            className={styles.actionCard}
          >
            <Syringe size={24} />
            <span>Programa de Vacunación</span>
          </button>
          <button 
            onClick={() => router.push('/admin/veterinario/expedientes')}
            className={styles.actionCard}
          >
            <FileText size={24} />
            <span>Expedientes Médicos</span>
          </button>
          <button 
            onClick={() => router.push('/admin/veterinario/reportes')}
            className={styles.actionCard}
          >
            <TrendingUp size={24} />
            <span>Reportes de Salud</span>
          </button>
        </div>
      </div>
    </div>
  )
}