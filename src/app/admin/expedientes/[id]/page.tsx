'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft,
  Calendar,
  Heart,
  Syringe,
  Pill,
  Activity,
  AlertCircle,
  FileText,
  ClipboardList,
  Stethoscope,
  ShieldCheck,
  Clock,
  Edit2,
  Plus,
  Download,
  ChevronRight,
  Thermometer,
  Weight,
  Ruler,
  User,
  MapPin,
  Phone,
  Mail,
  Info
} from 'lucide-react'

interface ExpedienteCompleto {
  id: string
  mascota: {
    id: string
    codigo: string
    nombre: string
    foto: string
    raza: string
    edad: string
    sexo: string
    peso: number
    altura: number
    fechaIngreso: string
    tipoIngreso: string
    estado: string
    esterilizado: boolean
    fechaEsterilizacion?: string
    microchip?: string
    caracteristicas: string[]
  }
  
  propietarioActual?: {
    nombre: string
    telefono: string
    email: string
    direccion: string
  }
  
  estadoSalud: 'excelente' | 'bueno' | 'regular' | 'tratamiento'
  
  vacunas: Array<{
    id: string
    nombre: string
    fecha: string
    proximaDosis?: string
    veterinario: string
    lote?: string
    observaciones?: string
  }>
  
  tratamientos: Array<{
    id: string
    tipo: string
    descripcion: string
    fechaInicio: string
    fechaFin?: string
    estado: 'activo' | 'completado' | 'suspendido'
    medicamentos: string[]
    veterinario: string
    resultados?: string
  }>
  
  consultas: Array<{
    id: string
    fecha: string
    motivo: string
    diagnostico: string
    veterinario: string
    peso?: number
    temperatura?: number
    sintomas: string[]
    tratamiento?: string
    proximaCita?: string
    costo?: number
  }>
  
  padecimientos: Array<{
    nombre: string
    tipo: 'cronico' | 'temporal'
    fechaDiagnostico: string
    estado: 'activo' | 'controlado' | 'resuelto'
    tratamiento?: string
  }>
  
  alergias: string[]
  
  alertas: Array<{
    id: string
    tipo: 'vacuna' | 'tratamiento' | 'cita' | 'otro'
    mensaje: string
    fecha: string
    prioridad: 'alta' | 'media' | 'baja'
  }>
  
  historial: Array<{
    fecha: string
    evento: string
    descripcion: string
    usuario: string
  }>
}

const estadoSaludConfig = {
  excelente: { label: 'Excelente', color: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' }, icon: Heart },
  bueno: { label: 'Bueno', color: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' }, icon: Activity },
  regular: { label: 'Regular', color: { bg: '#fefce8', text: '#a16207', border: '#fde68a' }, icon: AlertCircle },
  tratamiento: { label: 'En Tratamiento', color: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' }, icon: Pill }
}

export default function ExpedienteDetalle() {
  const router = useRouter()
  const params = useParams()
  const [expediente, setExpediente] = useState<ExpedienteCompleto | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('resumen')

  useEffect(() => {
    if (params.id) {
      fetchExpediente()
    }
  }, [params.id])

  async function fetchExpediente() {
    try {
      const response = await fetch(`/api/admin/expedientes/${params.id}`)
      const data = await response.json()
      if (response.ok) {
        setExpediente(data)
      }
    } catch (error) {
      console.error('Error fetching expediente:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        padding: '48px',
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #af1731',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#64748b', fontFamily: 'Poppins, sans-serif' }}>
            Cargando expediente...
          </p>
        </div>
      </div>
    )
  }

  if (!expediente) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <p>Expediente no encontrado</p>
      </div>
    )
  }

  const estado = estadoSaludConfig[expediente.estadoSalud]
  const EstadoIcon = estado.icon

  return (
    <div style={{
      padding: '16px',
      width: '100%',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => router.push('/admin/expedientes')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            color: '#374151',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            marginBottom: '16px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#bfb591'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Volver a Expedientes
        </button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#0f172a',
              margin: '0 0 4px 0',
              fontFamily: 'Albert Sans, sans-serif'
            }}>Expediente Médico - {expediente.mascota.nombre}</h1>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b',
              margin: 0,
              fontFamily: 'Poppins, sans-serif'
            }}>Código: {expediente.mascota.codigo}</p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '500',
              backgroundColor: estado.color.bg,
              color: estado.color.text,
              border: `1px solid ${estado.color.border}`,
              fontFamily: 'Poppins, sans-serif'
            }}>
              <EstadoIcon style={{ width: '16px', height: '16px' }} />
              {estado.label}
            </span>
            
            <button
              onClick={() => router.push(`/admin/expedientes/${params.id}/consulta`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#7d2447',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                fontFamily: 'Albert Sans, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a1a33'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7d2447'}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              Nueva Consulta
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
        {/* Sidebar - Pet Info */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          height: 'fit-content'
        }}>
          <Image
            src={expediente.mascota.foto || '/placeholder-dog.jpg'}
            alt={expediente.mascota.nombre}
            width={260}
            height={260}
            style={{
              borderRadius: '12px',
              objectFit: 'cover',
              marginBottom: '20px'
            }}
          />
          
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 16px 0',
            fontFamily: 'Albert Sans, sans-serif'
          }}>{expediente.mascota.nombre}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 4px 0' }}>Raza</p>
              <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0, fontWeight: '500' }}>
                {expediente.mascota.raza}
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 4px 0' }}>Edad</p>
                <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0, fontWeight: '500' }}>
                  {expediente.mascota.edad}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 4px 0' }}>Sexo</p>
                <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0, fontWeight: '500' }}>
                  {expediente.mascota.sexo}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Weight style={{ width: '12px', height: '12px' }} /> Peso
                </p>
                <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0, fontWeight: '500' }}>
                  {expediente.mascota.peso} kg
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Ruler style={{ width: '12px', height: '12px' }} /> Altura
                </p>
                <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0, fontWeight: '500' }}>
                  {expediente.mascota.altura} cm
                </p>
              </div>
            </div>

            <div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 4px 0' }}>Esterilizado</p>
              <p style={{ 
                fontSize: '0.875rem', 
                color: expediente.mascota.esterilizado ? '#16a34a' : '#dc2626', 
                margin: 0, 
                fontWeight: '500' 
              }}>
                {expediente.mascota.esterilizado ? 'Sí' : 'No'}
                {expediente.mascota.fechaEsterilizacion && (
                  <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: '8px' }}>
                    ({new Date(expediente.mascota.fechaEsterilizacion).toLocaleDateString('es-MX')})
                  </span>
                )}
              </p>
            </div>

            {expediente.mascota.microchip && (
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 4px 0' }}>Microchip</p>
                <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0, fontWeight: '500' }}>
                  {expediente.mascota.microchip}
                </p>
              </div>
            )}

            {expediente.alergias.length > 0 && (
              <div style={{
                padding: '12px',
                backgroundColor: '#fee2e2',
                borderRadius: '8px',
                border: '1px solid #fecaca'
              }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#991b1b', margin: '0 0 8px 0' }}>
                  ⚠️ Alergias
                </p>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.75rem', color: '#7f1d1d' }}>
                  {expediente.alergias.map((alergia, index) => (
                    <li key={index}>{alergia}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {expediente.propietarioActual && (
            <div style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 12px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <User style={{ width: '16px', height: '16px' }} />
                Propietario Actual
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0, fontWeight: '500' }}>
                  {expediente.propietarioActual.nombre}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone style={{ width: '12px', height: '12px' }} />
                  {expediente.propietarioActual.telefono}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail style={{ width: '12px', height: '12px' }} />
                  {expediente.propietarioActual.email}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div>
          {/* Alerts */}
          {expediente.alertas.length > 0 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 12px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle style={{ width: '20px', height: '20px', color: '#dc2626' }} />
                Alertas Activas
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {expediente.alertas.map((alerta) => (
                  <div key={alerta.id} style={{
                    padding: '12px',
                    backgroundColor: alerta.prioridad === 'alta' ? '#fee2e2' : '#fefce8',
                    borderRadius: '8px',
                    border: `1px solid ${alerta.prioridad === 'alta' ? '#fecaca' : '#fde68a'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <p style={{
                        fontSize: '0.875rem',
                        color: alerta.prioridad === 'alta' ? '#991b1b' : '#a16207',
                        margin: '0 0 4px 0',
                        fontWeight: '500'
                      }}>
                        {alerta.mensaje}
                      </p>
                      <p style={{
                        fontSize: '0.75rem',
                        color: alerta.prioridad === 'alta' ? '#7f1d1d' : '#854d0e',
                        margin: 0
                      }}>
                        {new Date(alerta.fecha).toLocaleDateString('es-MX')} • {alerta.tipo}
                      </p>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: alerta.prioridad === 'alta' ? '#dc2626' : '#d97706',
                      textTransform: 'uppercase'
                    }}>
                      {alerta.prioridad}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #e5e7eb'
            }}>
              {[
                { id: 'resumen', label: 'Resumen', icon: FileText },
                { id: 'vacunas', label: 'Vacunas', icon: Syringe },
                { id: 'tratamientos', label: 'Tratamientos', icon: Pill },
                { id: 'consultas', label: 'Consultas', icon: Stethoscope },
                { id: 'padecimientos', label: 'Padecimientos', icon: Heart },
                { id: 'historial', label: 'Historial', icon: Clock }
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: activeTab === tab.id ? '#faf5ff' : 'transparent',
                      border: 'none',
                      borderBottom: activeTab === tab.id ? '2px solid #7d2447' : '2px solid transparent',
                      color: activeTab === tab.id ? '#7d2447' : '#64748b',
                      fontSize: '0.875rem',
                      fontWeight: activeTab === tab.id ? '600' : '500',
                      fontFamily: 'Poppins, sans-serif',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Icon style={{ width: '16px', height: '16px' }} />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Tab Content */}
            <div style={{ padding: '24px' }}>
              {activeTab === 'resumen' && (
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '20px', color: '#0f172a' }}>
                    Resumen de Salud
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div style={{
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Syringe style={{ width: '20px', height: '20px', color: '#7d2447' }} />
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>
                          Vacunas
                        </p>
                      </div>
                      <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                        {expediente.vacunas.length}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0 0' }}>
                        Aplicadas
                      </p>
                    </div>

                    <div style={{
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Pill style={{ width: '20px', height: '20px', color: '#7d2447' }} />
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>
                          Tratamientos
                        </p>
                      </div>
                      <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                        {expediente.tratamientos.filter(t => t.estado === 'activo').length}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0 0' }}>
                        Activos
                      </p>
                    </div>

                    <div style={{
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Stethoscope style={{ width: '20px', height: '20px', color: '#7d2447' }} />
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>
                          Consultas
                        </p>
                      </div>
                      <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                        {expediente.consultas.length}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0 0' }}>
                        Totales
                      </p>
                    </div>

                    <div style={{
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Heart style={{ width: '20px', height: '20px', color: '#7d2447' }} />
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>
                          Padecimientos
                        </p>
                      </div>
                      <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                        {expediente.padecimientos.filter(p => p.estado === 'activo').length}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0 0' }}>
                        Activos
                      </p>
                    </div>
                  </div>

                  {/* Última consulta */}
                  {expediente.consultas.length > 0 && (
                    <div style={{
                      padding: '20px',
                      backgroundColor: '#fafafa',
                      borderRadius: '8px',
                      marginBottom: '20px'
                    }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px', color: '#0f172a' }}>
                        Última Consulta
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <div>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 4px 0' }}>Fecha</p>
                          <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0, fontWeight: '500' }}>
                            {new Date(expediente.consultas[0].fecha).toLocaleDateString('es-MX')}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 4px 0' }}>Motivo</p>
                          <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0, fontWeight: '500' }}>
                            {expediente.consultas[0].motivo}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 4px 0' }}>Veterinario</p>
                          <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0, fontWeight: '500' }}>
                            {expediente.consultas[0].veterinario}
                          </p>
                        </div>
                      </div>
                      {expediente.consultas[0].proximaCita && (
                        <div style={{
                          marginTop: '16px',
                          padding: '12px',
                          backgroundColor: '#fefce8',
                          borderRadius: '6px',
                          border: '1px solid #fde68a'
                        }}>
                          <p style={{ fontSize: '0.875rem', color: '#a16207', margin: 0, fontWeight: '500' }}>
                            <Calendar style={{ width: '14px', height: '14px', display: 'inline', marginRight: '6px' }} />
                            Próxima cita: {new Date(expediente.consultas[0].proximaCita).toLocaleDateString('es-MX')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'vacunas' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0, color: '#0f172a' }}>
                      Historial de Vacunas
                    </h3>
                    <button
                      onClick={() => router.push(`/admin/expedientes/${params.id}/vacuna`)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        backgroundColor: '#7d2447',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a1a33'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7d2447'}
                    >
                      <Plus style={{ width: '14px', height: '14px' }} />
                      Registrar Vacuna
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {expediente.vacunas.map((vacuna) => (
                      <div key={vacuna.id} style={{
                        padding: '16px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 8px 0', color: '#0f172a' }}>
                              {vacuna.nombre}
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                              <div>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 2px 0' }}>Fecha aplicación</p>
                                <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>
                                  {new Date(vacuna.fecha).toLocaleDateString('es-MX')}
                                </p>
                              </div>
                              <div>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 2px 0' }}>Veterinario</p>
                                <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>
                                  {vacuna.veterinario}
                                </p>
                              </div>
                              {vacuna.lote && (
                                <div>
                                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 2px 0' }}>Lote</p>
                                  <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>
                                    {vacuna.lote}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          {vacuna.proximaDosis && (
                            <span style={{
                              padding: '4px 12px',
                              backgroundColor: '#fefce8',
                              color: '#a16207',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <Clock style={{ width: '12px', height: '12px' }} />
                              Próxima: {new Date(vacuna.proximaDosis).toLocaleDateString('es-MX')}
                            </span>
                          )}
                        </div>
                        {vacuna.observaciones && (
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#64748b',
                            margin: '12px 0 0 0',
                            paddingTop: '12px',
                            borderTop: '1px solid #f1f5f9'
                          }}>
                            {vacuna.observaciones}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'tratamientos' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0, color: '#0f172a' }}>
                      Tratamientos Médicos
                    </h3>
                    <button
                      onClick={() => router.push(`/admin/expedientes/${params.id}/tratamiento`)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        backgroundColor: '#7d2447',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a1a33'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7d2447'}
                    >
                      <Plus style={{ width: '14px', height: '14px' }} />
                      Nuevo Tratamiento
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {expediente.tratamientos.map((tratamiento) => {
                      const estadoColors = {
                        activo: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
                        completado: { bg: '#e0e7ff', text: '#3730a3', border: '#a5b4fc' },
                        suspendido: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' }
                      }
                      const colors = estadoColors[tratamiento.estado]
                      
                      return (
                        <div key={tratamiento.id} style={{
                          padding: '16px',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                            <div>
                              <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 4px 0', color: '#0f172a' }}>
                                {tratamiento.tipo}
                              </h4>
                              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                                {tratamiento.descripcion}
                              </p>
                            </div>
                            <span style={{
                              padding: '4px 12px',
                              backgroundColor: colors.bg,
                              color: colors.text,
                              border: `1px solid ${colors.border}`,
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}>
                              {tratamiento.estado}
                            </span>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                            <div>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 2px 0' }}>Inicio</p>
                              <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>
                                {new Date(tratamiento.fechaInicio).toLocaleDateString('es-MX')}
                              </p>
                            </div>
                            {tratamiento.fechaFin && (
                              <div>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 2px 0' }}>Fin</p>
                                <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>
                                  {new Date(tratamiento.fechaFin).toLocaleDateString('es-MX')}
                                </p>
                              </div>
                            )}
                            <div>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 2px 0' }}>Veterinario</p>
                              <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>
                                {tratamiento.veterinario}
                              </p>
                            </div>
                          </div>

                          <div style={{
                            padding: '8px 12px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '6px',
                            marginBottom: tratamiento.resultados ? '12px' : 0
                          }}>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 4px 0', fontWeight: '500' }}>
                              Medicamentos
                            </p>
                            <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>
                              {tratamiento.medicamentos.join(', ')}
                            </p>
                          </div>

                          {tratamiento.resultados && (
                            <div style={{
                              paddingTop: '12px',
                              borderTop: '1px solid #f1f5f9'
                            }}>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 4px 0', fontWeight: '500' }}>
                                Resultados
                              </p>
                              <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>
                                {tratamiento.resultados}
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'consultas' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0, color: '#0f172a' }}>
                      Historial de Consultas
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {expediente.consultas.map((consulta) => (
                      <div key={consulta.id} style={{
                        padding: '16px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                          <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 4px 0', color: '#0f172a' }}>
                              {consulta.motivo}
                            </h4>
                            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                              {new Date(consulta.fecha).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                          {consulta.costo && (
                            <p style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>
                              ${consulta.costo.toFixed(2)}
                            </p>
                          )}
                        </div>

                        <div style={{
                          padding: '12px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '6px',
                          marginBottom: '12px'
                        }}>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 4px 0', fontWeight: '500' }}>
                            Diagnóstico
                          </p>
                          <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>
                            {consulta.diagnostico}
                          </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 2px 0' }}>Veterinario</p>
                            <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>
                              {consulta.veterinario}
                            </p>
                          </div>
                          {consulta.peso && (
                            <div>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 2px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Weight style={{ width: '12px', height: '12px' }} /> Peso
                              </p>
                              <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>
                                {consulta.peso} kg
                              </p>
                            </div>
                          )}
                          {consulta.temperatura && (
                            <div>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 2px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Thermometer style={{ width: '12px', height: '12px' }} /> Temperatura
                              </p>
                              <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>
                                {consulta.temperatura}°C
                              </p>
                            </div>
                          )}
                        </div>

                        {consulta.sintomas.length > 0 && (
                          <div style={{ marginBottom: '12px' }}>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 6px 0', fontWeight: '500' }}>
                              Síntomas
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {consulta.sintomas.map((sintoma, index) => (
                                <span key={index} style={{
                                  padding: '2px 8px',
                                  backgroundColor: '#e2e8f0',
                                  borderRadius: '12px',
                                  fontSize: '0.75rem',
                                  color: '#475569'
                                }}>
                                  {sintoma}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {consulta.tratamiento && (
                          <div style={{
                            paddingTop: '12px',
                            borderTop: '1px solid #f1f5f9'
                          }}>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 4px 0', fontWeight: '500' }}>
                              Tratamiento prescrito
                            </p>
                            <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>
                              {consulta.tratamiento}
                            </p>
                          </div>
                        )}

                        {consulta.proximaCita && (
                          <div style={{
                            marginTop: '12px',
                            padding: '8px 12px',
                            backgroundColor: '#fefce8',
                            borderRadius: '6px',
                            border: '1px solid #fde68a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <Calendar style={{ width: '14px', height: '14px', color: '#a16207' }} />
                            <p style={{ fontSize: '0.875rem', color: '#a16207', margin: 0, fontWeight: '500' }}>
                              Próxima cita: {new Date(consulta.proximaCita).toLocaleDateString('es-MX')}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'padecimientos' && (
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '20px', color: '#0f172a' }}>
                    Padecimientos y Condiciones
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {expediente.padecimientos.map((padecimiento, index) => {
                      const estadoColors = {
                        activo: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
                        controlado: { bg: '#fefce8', text: '#a16207', border: '#fde68a' },
                        resuelto: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' }
                      }
                      const colors = estadoColors[padecimiento.estado]
                      
                      return (
                        <div key={index} style={{
                          padding: '16px',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                              <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 8px 0', color: '#0f172a' }}>
                                {padecimiento.nombre}
                              </h4>
                              <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                                  <strong>Tipo:</strong> {padecimiento.tipo === 'cronico' ? 'Crónico' : 'Temporal'}
                                </p>
                                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                                  <strong>Diagnosticado:</strong> {new Date(padecimiento.fechaDiagnostico).toLocaleDateString('es-MX')}
                                </p>
                              </div>
                            </div>
                            <span style={{
                              padding: '4px 12px',
                              backgroundColor: colors.bg,
                              color: colors.text,
                              border: `1px solid ${colors.border}`,
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}>
                              {padecimiento.estado}
                            </span>
                          </div>
                          {padecimiento.tratamiento && (
                            <div style={{
                              padding: '8px 12px',
                              backgroundColor: '#f8fafc',
                              borderRadius: '6px'
                            }}>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 4px 0', fontWeight: '500' }}>
                                Tratamiento actual
                              </p>
                              <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>
                                {padecimiento.tratamiento}
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'historial' && (
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '20px', color: '#0f172a' }}>
                    Historial de Eventos
                  </h3>

                  <div style={{ position: 'relative' }}>
                    {/* Timeline line */}
                    <div style={{
                      position: 'absolute',
                      left: '20px',
                      top: '20px',
                      bottom: '20px',
                      width: '2px',
                      backgroundColor: '#e2e8f0'
                    }} />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {expediente.historial.map((evento, index) => (
                        <div key={index} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: index === 0 ? '#7d2447' : 'white',
                            border: index === 0 ? 'none' : '2px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            zIndex: 1
                          }}>
                            <Info style={{
                              width: '20px',
                              height: '20px',
                              color: index === 0 ? 'white' : '#94a3b8'
                            }} />
                          </div>
                          <div style={{ flex: 1, paddingBottom: '8px' }}>
                            <p style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: '#0f172a',
                              margin: '0 0 4px 0'
                            }}>
                              {evento.evento}
                            </p>
                            <p style={{
                              fontSize: '0.875rem',
                              color: '#64748b',
                              margin: '0 0 4px 0'
                            }}>
                              {evento.descripcion}
                            </p>
                            <p style={{
                              fontSize: '0.75rem',
                              color: '#94a3b8',
                              margin: 0
                            }}>
                              {new Date(evento.fecha).toLocaleString('es-MX')} • Por {evento.usuario}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}