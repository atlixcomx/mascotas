'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  ArrowLeft, Edit, Save, X, Calendar, User, Phone,
  Heart, Syringe, Shield, AlertCircle, Clock,
  FileText, Activity, Stethoscope, Plus, Download
} from 'lucide-react'
import styles from '../../veterinario.module.css'

// Imagen por defecto para mascotas
const defaultDogImage = 'https://somosmaka.com/cdn/shop/articles/perro_mestizo.jpg?v=1697855331'

interface ExpedienteDetalle {
  id: string
  mascotaId: string
  mascotaNombre: string
  mascotaCodigo: string
  fotoPrincipal: string
  edad: string
  sexo: string
  raza: string
  peso: string
  color: string
  duenio: string
  telefono: string
  email?: string
  direccion: string
  fechaIngreso: string
  ultimaConsulta: string
  estadoGeneral: 'excelente' | 'bueno' | 'regular' | 'delicado' | 'critico'
  vacunas: boolean
  esterilizado: boolean
  desparasitado: boolean
  alergias: string[]
  condicionesCronicas: string[]
  historialMedico: HistorialMedico[]
  proximaCita?: string
  notas: string
}

interface HistorialMedico {
  id: string
  fecha: string
  tipo: 'consulta' | 'vacuna' | 'cirugia' | 'emergencia' | 'revision'
  motivo: string
  diagnostico: string
  tratamiento: string
  veterinario: string
  observaciones?: string
}

export default function ExpedienteMedicoDetallePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [expediente, setExpediente] = useState<ExpedienteDetalle | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchExpediente(params.id as string)
    }
  }, [params.id])

  const fetchExpediente = async (id: string) => {
    try {
      // Intentar obtener datos reales de la mascota primero
      let realPetData = null
      try {
        const response = await fetch(`/api/admin/perritos/${id}`)
        if (response.ok) {
          realPetData = await response.json()
        }
      } catch (error) {
        console.log('No se pudieron obtener datos reales, usando mock data')
      }

      // Datos mock para demostrar funcionalidad, con datos reales si están disponibles
      const expedienteMock: ExpedienteDetalle = {
        id,
        mascotaId: realPetData?.id || '1',
        mascotaNombre: realPetData?.nombre || 'Max',
        mascotaCodigo: realPetData?.codigo || 'P001',
        fotoPrincipal: realPetData?.fotoPrincipal || defaultDogImage,
        edad: '3 años',
        sexo: 'Macho',
        raza: 'Labrador Retriever',
        peso: '28 kg',
        color: 'Dorado',
        duenio: 'Juan Pérez',
        telefono: '244-123-4567',
        email: 'juan.perez@email.com',
        direccion: 'Calle Principal #123, Atlixco, Puebla',
        fechaIngreso: '2023-01-15',
        ultimaConsulta: '2024-01-15',
        estadoGeneral: 'bueno',
        vacunas: true,
        esterilizado: true,
        desparasitado: true,
        alergias: ['Polen', 'Pollo'],
        condicionesCronicas: [],
        proximaCita: '2024-02-15',
        notas: 'Perro muy dócil y bien socializado. Responde bien a tratamientos.',
        historialMedico: [
          {
            id: '1',
            fecha: '2024-01-15',
            tipo: 'consulta',
            motivo: 'Revisión general anual',
            diagnostico: 'Estado de salud general bueno',
            tratamiento: 'Vacuna de refuerzo aplicada',
            veterinario: session?.user?.name || 'Dr. Veterinario',
            observaciones: 'Sin complicaciones'
          },
          {
            id: '2',
            fecha: '2023-12-10',
            tipo: 'vacuna',
            motivo: 'Vacunación antirrábica',
            diagnostico: 'Apto para vacunación',
            tratamiento: 'Vacuna antirrábica aplicada',
            veterinario: session?.user?.name || 'Dr. Veterinario'
          },
          {
            id: '3',
            fecha: '2023-08-20',
            tipo: 'cirugia',
            motivo: 'Esterilización',
            diagnostico: 'Cirugía exitosa',
            tratamiento: 'Esterilización + cuidados post-operatorios',
            veterinario: session?.user?.name || 'Dr. Veterinario',
            observaciones: 'Recuperación sin complicaciones'
          }
        ]
      }

      setExpediente(expedienteMock)
    } catch (error) {
      console.error('Error fetching expediente:', error)
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

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'consulta': return <Stethoscope size={16} />
      case 'vacuna': return <Syringe size={16} />
      case 'cirugia': return <Activity size={16} />
      case 'emergencia': return <AlertCircle size={16} />
      case 'revision': return <FileText size={16} />
      default: return <Clock size={16} />
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Aquí iría la lógica para guardar los cambios
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular guardado
      setEditMode(false)
    } catch (error) {
      console.error('Error saving expediente:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando expediente médico...</p>
      </div>
    )
  }

  if (!expediente) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <AlertCircle size={48} />
          <h2>Expediente no encontrado</h2>
          <p>No se pudo encontrar el expediente médico solicitado.</p>
          <Link href="/admin/veterinario/expedientes" className={styles.primaryButton}>
            <ArrowLeft size={20} />
            Volver a Expedientes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <Link 
              href="/admin/veterinario/expedientes"
              className={styles.backButton}
            >
              <ArrowLeft size={20} />
              Volver
            </Link>
            <div>
              <h1 className={styles.title}>Expediente Médico</h1>
              <p className={styles.subtitle}>{expediente.mascotaNombre} - {expediente.mascotaCodigo}</p>
            </div>
          </div>
          
          <div className={styles.headerActions}>
            <button className={styles.secondaryButton}>
              <Download size={20} />
              Exportar
            </button>
            {editMode ? (
              <>
                <button 
                  onClick={() => setEditMode(false)}
                  className={styles.secondaryButton}
                  disabled={saving}
                >
                  <X size={20} />
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className={styles.primaryButton}
                  disabled={saving}
                >
                  <Save size={20} />
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </>
            ) : (
              <button 
                onClick={() => setEditMode(true)}
                className={styles.primaryButton}
              >
                <Edit size={20} />
                Editar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Información Principal */}
      <div className={styles.expedienteDetailGrid}>
        {/* Foto y Estado */}
        <div className={styles.expedienteCard}>
          <div className={styles.expedienteFotoSection}>
            <img 
              src={expediente.fotoPrincipal || defaultDogImage} 
              alt={expediente.mascotaNombre}
              className={styles.expedienteFotoLarge}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = defaultDogImage
              }}
            />
            <div 
              className={styles.expedienteEstadoLarge}
              style={{ 
                backgroundColor: `${getEstadoColor(expediente.estadoGeneral)}20`,
                color: getEstadoColor(expediente.estadoGeneral)
              }}
            >
              <Heart size={20} />
              Estado: {expediente.estadoGeneral.charAt(0).toUpperCase() + expediente.estadoGeneral.slice(1)}
            </div>
          </div>
        </div>

        {/* Información Básica */}
        <div className={styles.expedienteCard}>
          <h3 className={styles.cardTitle}>Información Básica</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Nombre:</span>
              <span className={styles.infoValue}>{expediente.mascotaNombre}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Código:</span>
              <span className={styles.infoValue}>{expediente.mascotaCodigo}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Edad:</span>
              <span className={styles.infoValue}>{expediente.edad}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Sexo:</span>
              <span className={styles.infoValue}>{expediente.sexo}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Raza:</span>
              <span className={styles.infoValue}>{expediente.raza}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Peso:</span>
              <span className={styles.infoValue}>{expediente.peso}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Color:</span>
              <span className={styles.infoValue}>{expediente.color}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Fecha de Ingreso:</span>
              <span className={styles.infoValue}>{new Date(expediente.fechaIngreso).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Información del Dueño */}
        <div className={styles.expedienteCard}>
          <h3 className={styles.cardTitle}>Información del Dueño</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <User size={16} />
              <span className={styles.infoValue}>{expediente.duenio}</span>
            </div>
            <div className={styles.infoItem}>
              <Phone size={16} />
              <span className={styles.infoValue}>{expediente.telefono}</span>
            </div>
            {expediente.email && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{expediente.email}</span>
              </div>
            )}
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Dirección:</span>
              <span className={styles.infoValue}>{expediente.direccion}</span>
            </div>
          </div>
        </div>

        {/* Estado de Salud */}
        <div className={styles.expedienteCard}>
          <h3 className={styles.cardTitle}>Estado de Salud</h3>
          <div className={styles.healthStatus}>
            <div className={`${styles.healthItem} ${expediente.vacunas ? styles.positive : styles.negative}`}>
              <Syringe size={20} />
              <span>Vacunas {expediente.vacunas ? 'al día' : 'pendientes'}</span>
            </div>
            <div className={`${styles.healthItem} ${expediente.esterilizado ? styles.positive : styles.negative}`}>
              <Heart size={20} />
              <span>{expediente.esterilizado ? 'Esterilizado' : 'Sin esterilizar'}</span>
            </div>
            <div className={`${styles.healthItem} ${expediente.desparasitado ? styles.positive : styles.negative}`}>
              <Shield size={20} />
              <span>{expediente.desparasitado ? 'Desparasitado' : 'Sin desparasitar'}</span>
            </div>
          </div>

          {expediente.proximaCita && (
            <div className={styles.proximaCita}>
              <Calendar size={16} />
              <span>Próxima cita: {new Date(expediente.proximaCita).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Alergias y Condiciones */}
      {(expediente.alergias.length > 0 || expediente.condicionesCronicas.length > 0) && (
        <div className={styles.section}>
          <div className={styles.alertasGrid}>
            {expediente.alergias.length > 0 && (
              <div className={styles.alertCard}>
                <h4>Alergias</h4>
                <div className={styles.tagsList}>
                  {expediente.alergias.map(alergia => (
                    <span key={alergia} className={styles.alertTag}>
                      <AlertCircle size={12} />
                      {alergia}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {expediente.condicionesCronicas.length > 0 && (
              <div className={styles.alertCard}>
                <h4>Condiciones Crónicas</h4>
                <div className={styles.tagsList}>
                  {expediente.condicionesCronicas.map(condicion => (
                    <span key={condicion} className={styles.alertTag}>
                      <AlertCircle size={12} />
                      {condicion}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notas */}
      {expediente.notas && (
        <div className={styles.section}>
          <div className={styles.expedienteCard}>
            <h3 className={styles.cardTitle}>Notas Generales</h3>
            <p className={styles.notasContent}>{expediente.notas}</p>
          </div>
        </div>
      )}

      {/* Historial Médico */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <FileText size={20} />
            Historial Médico ({expediente.historialMedico.length})
          </h2>
          <button className={styles.primaryButton}>
            <Plus size={20} />
            Nueva Consulta
          </button>
        </div>

        <div className={styles.historialList}>
          {expediente.historialMedico.map(consulta => (
            <div key={consulta.id} className={styles.historialItem}>
              <div className={styles.historialHeader}>
                <div className={styles.historialTipo}>
                  {getTipoIcon(consulta.tipo)}
                  <span>{consulta.tipo.charAt(0).toUpperCase() + consulta.tipo.slice(1)}</span>
                </div>
                <span className={styles.historialFecha}>
                  {new Date(consulta.fecha).toLocaleDateString()}
                </span>
              </div>
              
              <div className={styles.historialContent}>
                <h4>{consulta.motivo}</h4>
                <div className={styles.historialDetalle}>
                  <div>
                    <strong>Diagnóstico:</strong> {consulta.diagnostico}
                  </div>
                  <div>
                    <strong>Tratamiento:</strong> {consulta.tratamiento}
                  </div>
                  <div>
                    <strong>Veterinario:</strong> {consulta.veterinario}
                  </div>
                  {consulta.observaciones && (
                    <div>
                      <strong>Observaciones:</strong> {consulta.observaciones}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}