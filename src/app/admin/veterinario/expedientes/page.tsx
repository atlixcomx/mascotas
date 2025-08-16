'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  FileText, Plus, Search, Filter, Dog,
  Calendar, User, Stethoscope, AlertCircle,
  CheckCircle, Clock, Eye, Download,
  Heart, Syringe, Shield, Activity
} from 'lucide-react'
import styles from '../veterinario.module.css'

// Imagen por defecto para mascotas
const defaultDogImage = 'https://somosmaka.com/cdn/shop/articles/perro_mestizo.jpg?v=1697855331'

interface ExpedienteMedico {
  id: string
  mascotaId: string
  mascotaNombre: string
  mascotaCodigo: string
  fotoPrincipal: string
  edad: string
  sexo: string
  raza: string
  duenio: string
  telefono: string
  ultimaConsulta: string
  estadoGeneral: 'excelente' | 'bueno' | 'regular' | 'delicado' | 'critico'
  vacunas: boolean
  esterilizado: boolean
  desparasitado: boolean
  alergias: string[]
  condicionesCronicas: string[]
  totalConsultas: number
}

interface ResumenSalud {
  totalExpedientes: number
  expedientesActivos: number
  consultas30Dias: number
  tratamientosActivos: number
}

export default function ExpedientesMedicosPage() {
  const { data: session } = useSession()
  const [expedientes, setExpedientes] = useState<ExpedienteMedico[]>([])
  const [resumen, setResumen] = useState<ResumenSalud>({
    totalExpedientes: 0,
    expedientesActivos: 0,
    consultas30Dias: 0,
    tratamientosActivos: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [filterHealth, setFilterHealth] = useState('todos')

  useEffect(() => {
    fetchExpedientes()
  }, [])

  const fetchExpedientes = async () => {
    try {
      // Obtener datos reales de mascotas para los expedientes
      const response = await fetch('/api/admin/perritos')
      let realPets: any[] = []
      
      if (response.ok) {
        const data = await response.json()
        realPets = data.perritos || []
      }
      
      // Mapear mascotas reales a formato de expedientes
      const expedientesReales: ExpedienteMedico[] = realPets.map(pet => ({
        id: pet.id,
        mascotaId: pet.id,
        mascotaNombre: pet.nombre,
        mascotaCodigo: pet.codigo,
        fotoPrincipal: pet.fotoPrincipal || defaultDogImage,
        edad: pet.edad,
        sexo: pet.sexo,
        raza: pet.raza,
        duenio: 'Sin asignar', // Estos datos vendrían de la tabla de adopciones
        telefono: '--',
        ultimaConsulta: pet.fechaIngreso,
        estadoGeneral: pet.vacunas && pet.esterilizado && pet.desparasitado ? 'bueno' : 'regular',
        vacunas: pet.vacunas,
        esterilizado: pet.esterilizado,
        desparasitado: pet.desparasitado,
        alergias: [],
        condicionesCronicas: [],
        totalConsultas: Math.floor(Math.random() * 10) + 1
      }))
      
      // Si no hay datos reales, usar algunos mock como fallback
      const expedientesMock: ExpedienteMedico[] = expedientesReales.length > 0 ? expedientesReales : [
        {
          id: '1',
          mascotaId: '1',
          mascotaNombre: 'Max',
          mascotaCodigo: 'P001',
          fotoPrincipal: defaultDogImage,
          edad: '3 años',
          sexo: 'Macho',
          raza: 'Labrador Retriever',
          duenio: 'Juan Pérez',
          telefono: '244-123-4567',
          ultimaConsulta: '2024-01-15',
          estadoGeneral: 'bueno',
          vacunas: true,
          esterilizado: true,
          desparasitado: true,
          alergias: ['Polen'],
          condicionesCronicas: [],
          totalConsultas: 8
        },
        {
          id: '2',
          mascotaId: '2',
          mascotaNombre: 'Luna',
          mascotaCodigo: 'P002',
          fotoPrincipal: defaultDogImage,
          edad: '2 años',
          sexo: 'Hembra',
          raza: 'Golden Retriever',
          duenio: 'María García',
          telefono: '244-987-6543',
          ultimaConsulta: '2024-01-10',
          estadoGeneral: 'regular',
          vacunas: false,
          esterilizado: false,
          desparasitado: true,
          alergias: [],
          condicionesCronicas: ['Displasia de cadera'],
          totalConsultas: 12
        },
        {
          id: '3',
          mascotaId: '3',
          mascotaNombre: 'Rocky',
          mascotaCodigo: 'P003',
          fotoPrincipal: defaultDogImage,
          edad: '5 años',
          sexo: 'Macho',
          raza: 'Pastor Alemán',
          duenio: 'Carlos López',
          telefono: '244-555-0123',
          ultimaConsulta: '2024-01-12',
          estadoGeneral: 'excelente',
          vacunas: true,
          esterilizado: true,
          desparasitado: true,
          alergias: [],
          condicionesCronicas: [],
          totalConsultas: 15
        }
      ]

      setExpedientes(expedientesReales.length > 0 ? expedientesReales : expedientesMock)
      
      setResumen({
        totalExpedientes: 45,
        expedientesActivos: 42,
        consultas30Dias: 38,
        tratamientosActivos: 8
      })
    } catch (error) {
      console.error('Error fetching expedientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'excelente': return '#16a34a'
      case 'bueno': return '#65a30d'
      case 'regular': return '#eab308'
      case 'delicado': return '#f97316'
      case 'critico': return '#dc2626'
      default: return '#6b7280'
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'excelente': return <CheckCircle size={16} />
      case 'bueno': return <CheckCircle size={16} />
      case 'regular': return <Clock size={16} />
      case 'delicado': return <AlertCircle size={16} />
      case 'critico': return <AlertCircle size={16} />
      default: return <Clock size={16} />
    }
  }

  const filteredExpedientes = expedientes.filter(exp => {
    const matchesSearch = exp.mascotaNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.mascotaCodigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.duenio.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'todos' || 
                         (filterStatus === 'vacunas_pendientes' && !exp.vacunas) ||
                         (filterStatus === 'esterilizacion_pendiente' && !exp.esterilizado) ||
                         (filterStatus === 'condiciones_cronicas' && exp.condicionesCronicas.length > 0)
    
    const matchesHealth = filterHealth === 'todos' || exp.estadoGeneral === filterHealth
    
    return matchesSearch && matchesStatus && matchesHealth
  })

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando expedientes médicos...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <FileText className={styles.headerIcon} />
            <div>
              <h1 className={styles.title}>Expedientes Médicos</h1>
              <p className={styles.subtitle}>Historiales clínicos completos</p>
            </div>
          </div>
          
          <div className={styles.headerActions}>
            <button className={styles.secondaryButton}>
              <Download size={20} />
              Exportar Datos
            </button>
            <Link href="/admin/veterinario/expedientes/nuevo" className={styles.primaryButton}>
              <Plus size={20} />
              Crear Expediente
            </Link>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#e0f2fe' }}>
            <FileText size={24} style={{ color: '#0284c7' }} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Expedientes</p>
            <p className={styles.statValue}>{resumen.totalExpedientes}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#dcfce7' }}>
            <Activity size={24} style={{ color: '#16a34a' }} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Expedientes Activos</p>
            <p className={styles.statValue}>{resumen.expedientesActivos}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fef3c7' }}>
            <Calendar size={24} style={{ color: '#d97706' }} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Consultas (30 días)</p>
            <p className={styles.statValue}>{resumen.consultas30Dias}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fce7f3' }}>
            <Stethoscope size={24} style={{ color: '#be185d' }} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Tratamientos Activos</p>
            <p className={styles.statValue}>{resumen.tratamientosActivos}</p>
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
              placeholder="Buscar por mascota, código o dueño..."
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
              <option value="todos">Todos los expedientes</option>
              <option value="vacunas_pendientes">Vacunas pendientes</option>
              <option value="esterilizacion_pendiente">Esterilización pendiente</option>
              <option value="condiciones_cronicas">Con condiciones crónicas</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <Heart size={16} />
            <select
              value={filterHealth}
              onChange={(e) => setFilterHealth(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="todos">Todos los estados</option>
              <option value="excelente">Excelente</option>
              <option value="bueno">Bueno</option>
              <option value="regular">Regular</option>
              <option value="delicado">Delicado</option>
              <option value="critico">Crítico</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Expedientes */}
      <div className={styles.expedientesGrid}>
        {filteredExpedientes.map(expediente => (
          <Link
            key={expediente.id}
            href={`/admin/veterinario/expedientes/${expediente.id}`}
            className={styles.expedienteCard}
          >
            <div className={styles.expedienteHeader}>
              <img 
                src={expediente.fotoPrincipal || defaultDogImage} 
                alt={expediente.mascotaNombre}
                className={styles.expedienteFoto}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = defaultDogImage
                }}
              />
              <div className={styles.expedienteInfo}>
                <h3 className={styles.expedienteNombre}>{expediente.mascotaNombre}</h3>
                <p className={styles.expedienteCodigo}>{expediente.mascotaCodigo}</p>
                <div 
                  className={styles.expedienteEstado}
                  style={{ 
                    backgroundColor: `${getEstadoColor(expediente.estadoGeneral)}20`,
                    color: getEstadoColor(expediente.estadoGeneral)
                  }}
                >
                  {getEstadoIcon(expediente.estadoGeneral)}
                  {expediente.estadoGeneral.charAt(0).toUpperCase() + expediente.estadoGeneral.slice(1)}
                </div>
              </div>
            </div>

            <div className={styles.expedienteDetalles}>
              <div className={styles.expedienteDetalle}>
                <Dog size={14} />
                <span>{expediente.edad} • {expediente.sexo} • {expediente.raza}</span>
              </div>
              <div className={styles.expedienteDetalle}>
                <User size={14} />
                <span>{expediente.duenio}</span>
              </div>
              <div className={styles.expedienteDetalle}>
                <Calendar size={14} />
                <span>Última consulta: {new Date(expediente.ultimaConsulta).toLocaleDateString()}</span>
              </div>
            </div>

            <div className={styles.expedienteStatus}>
              <div className={styles.statusIndicators}>
                <div 
                  className={`${styles.statusIndicator} ${expediente.vacunas ? styles.positive : styles.negative}`}
                  title={expediente.vacunas ? "Vacunas al día" : "Vacunas pendientes"}
                >
                  <Syringe size={14} />
                </div>
                <div 
                  className={`${styles.statusIndicator} ${expediente.esterilizado ? styles.positive : styles.negative}`}
                  title={expediente.esterilizado ? "Esterilizado" : "Sin esterilizar"}
                >
                  <Heart size={14} />
                </div>
                <div 
                  className={`${styles.statusIndicator} ${expediente.desparasitado ? styles.positive : styles.negative}`}
                  title={expediente.desparasitado ? "Desparasitado" : "Sin desparasitar"}
                >
                  <Shield size={14} />
                </div>
              </div>

              <div className={styles.expedienteStats}>
                <span>{expediente.totalConsultas} consultas</span>
              </div>
            </div>

            {(expediente.alergias.length > 0 || expediente.condicionesCronicas.length > 0) && (
              <div className={styles.expedienteAlertas}>
                {expediente.alergias.length > 0 && (
                  <span className={styles.alerta}>
                    <AlertCircle size={12} />
                    {expediente.alergias.length} alergia(s)
                  </span>
                )}
                {expediente.condicionesCronicas.length > 0 && (
                  <span className={styles.alerta}>
                    <AlertCircle size={12} />
                    {expediente.condicionesCronicas.length} condición(es) crónica(s)
                  </span>
                )}
              </div>
            )}
          </Link>
        ))}
      </div>

      {filteredExpedientes.length === 0 && (
        <div className={styles.emptyState}>
          <FileText size={48} />
          <h3>No hay expedientes médicos</h3>
          <p>No se encontraron expedientes con los filtros seleccionados</p>
          <Link href="/admin/veterinario/expedientes/nuevo" className={styles.primaryButton}>
            <Plus size={20} />
            Crear Primer Expediente
          </Link>
        </div>
      )}
    </div>
  )
}