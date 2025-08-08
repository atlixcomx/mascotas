'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft,
  Edit,
  Calendar,
  Phone,
  Mail,
  MapPin,
  User,
  Dog,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  MessageSquare,
  Camera,
  FileText,
  Activity,
  Award,
  Home,
  Stethoscope,
  Shield,
  AlertCircle
} from 'lucide-react'

interface Seguimiento {
  id: string
  folio: string
  fechaSeguimiento: string
  tipoSeguimiento: 'inicial' | 'mensual' | 'semestral' | 'anual' | 'problema'
  adopcion: {
    id: string
    folio: string
    fechaAdopcion: string
  }
  adoptante: {
    nombre: string
    telefono: string
    email: string
    direccion: string
    ocupacion: string
  }
  mascota: {
    id: string
    nombre: string
    codigo: string
    foto: string
    raza: string
    edad: string
    sexo: string
  }
  estado: 'pendiente' | 'completado' | 'problema_detectado' | 'requiere_atencion'
  estadoMascota: 'excelente' | 'bueno' | 'regular' | 'preocupante'
  satisfaccionAdoptante: number
  detalles: {
    alimentacion: {
      tipo: string
      frecuencia: string
      cantidad: string
      apetito: 'excelente' | 'bueno' | 'regular' | 'malo'
    }
    salud: {
      peso: number
      vacunas: boolean
      desparasitacion: boolean
      visitas_veterinario: number
      problemas_salud: string[]
    }
    comportamiento: {
      adaptacion: 'excelente' | 'buena' | 'regular' | 'mala'
      socializacion: 'excelente' | 'buena' | 'regular' | 'mala'
      obediencia: 'excelente' | 'buena' | 'regular' | 'mala'
      problemas_comportamiento: string[]
    }
    ambiente: {
      espacio_adecuado: boolean
      ejercicio_diario: 'suficiente' | 'regular' | 'insuficiente'
      tiempo_solo: number
      interaccion_familia: 'excelente' | 'buena' | 'regular' | 'mala'
    }
  }
  observaciones: string
  problemas: string[]
  recomendaciones: string[]
  proximoSeguimiento: string
  responsable: string
  fotos: string[]
}

const tipoSeguimientoConfig = {
  inicial: { label: 'Inicial (7 días)', color: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' }, icon: Heart },
  mensual: { label: 'Mensual', color: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' }, icon: Calendar },
  semestral: { label: 'Semestral', color: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' }, icon: Clock },
  anual: { label: 'Anual', color: { bg: '#e0e7ff', text: '#3730a3', border: '#a5b4fc' }, icon: Star },
  problema: { label: 'Por Problema', color: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' }, icon: AlertTriangle }
}

const estadoConfig = {
  pendiente: { label: 'Pendiente', color: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' } },
  completado: { label: 'Completado', color: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' } },
  problema_detectado: { label: 'Problema Detectado', color: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' } },
  requiere_atencion: { label: 'Requiere Atención', color: { bg: '#fef2f2', text: '#7f1d1d', border: '#fca5a5' } }
}

const estadoMascotaConfig = {
  excelente: { label: 'Excelente', color: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' } },
  bueno: { label: 'Bueno', color: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' } },
  regular: { label: 'Regular', color: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' } },
  preocupante: { label: 'Preocupante', color: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' } }
}

export default function SeguimientoDetalle() {
  const router = useRouter()
  const params = useParams()
  const [seguimiento, setSeguimiento] = useState<Seguimiento | null>(null)
  const [activeTab, setActiveTab] = useState('resumen')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchSeguimiento()
    }
  }, [params.id])

  async function fetchSeguimiento() {
    try {
      // Mock data - replace with actual API call
      const mockData: Seguimiento = {
        id: params.id as string,
        folio: 'SEG-2024-001',
        fechaSeguimiento: '2024-01-15',
        tipoSeguimiento: 'inicial',
        adopcion: {
          id: 'adop1',
          folio: 'ADOP-2024-001',
          fechaAdopcion: '2024-01-08'
        },
        adoptante: {
          nombre: 'María González Rodríguez',
          telefono: '222-123-4567',
          email: 'maria.gonzalez@email.com',
          direccion: 'Av. Reforma 123, Col. Centro, Atlixco, Puebla',
          ocupacion: 'Maestra'
        },
        mascota: {
          id: 'perro1',
          nombre: 'Luna',
          codigo: 'PER-001',
          foto: '/placeholder-dog.jpg',
          raza: 'Mestizo',
          edad: '2 años',
          sexo: 'Hembra'
        },
        estado: 'completado',
        estadoMascota: 'excelente',
        satisfaccionAdoptante: 5,
        detalles: {
          alimentacion: {
            tipo: 'Alimento premium para perros adultos',
            frecuencia: '2 veces al día',
            cantidad: '1 taza por comida',
            apetito: 'excelente'
          },
          salud: {
            peso: 15.5,
            vacunas: true,
            desparasitacion: true,
            visitas_veterinario: 1,
            problemas_salud: []
          },
          comportamiento: {
            adaptacion: 'excelente',
            socializacion: 'buena',
            obediencia: 'buena',
            problemas_comportamiento: []
          },
          ambiente: {
            espacio_adecuado: true,
            ejercicio_diario: 'suficiente',
            tiempo_solo: 6,
            interaccion_familia: 'excelente'
          }
        },
        observaciones: 'Luna se ha adaptado perfectamente a su nuevo hogar. La familia está muy satisfecha y comprometida con su cuidado. Se observa una excelente relación entre la mascota y todos los miembros de la familia.',
        problemas: [],
        recomendaciones: [
          'Continuar con la rutina de ejercicio actual',
          'Mantener las citas veterinarias programadas',
          'Considerar entrenamiento básico de obediencia'
        ],
        proximoSeguimiento: '2024-02-15',
        responsable: 'Dr. Carlos Méndez',
        fotos: ['/placeholder-dog.jpg', '/placeholder-dog-2.jpg']
      }

      setSeguimiento(mockData)
    } catch (error) {
      console.error('Error fetching seguimiento:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        style={{
          width: '16px',
          height: '16px',
          color: i < rating ? '#fbbf24' : '#e5e7eb',
          fill: i < rating ? '#fbbf24' : 'transparent'
        }}
      />
    ))
  }

  const renderStatusBadge = (status: string, config: any) => (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '0.875rem',
      fontWeight: '500',
      backgroundColor: config.color.bg,
      color: config.color.text,
      border: `1px solid ${config.color.border}`,
      fontFamily: 'Poppins, sans-serif'
    }}>
      {config.label}
    </span>
  )

  const tabs = [
    { id: 'resumen', label: 'Resumen General', icon: FileText },
    { id: 'salud', label: 'Estado de Salud', icon: Stethoscope },
    { id: 'comportamiento', label: 'Comportamiento', icon: Activity },
    { id: 'ambiente', label: 'Ambiente y Cuidados', icon: Home },
    { id: 'fotos', label: 'Evidencias Fotográficas', icon: Camera },
    { id: 'historial', label: 'Historial de Seguimientos', icon: Clock }
  ]

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #7d2447',
          borderRadius: '50%',
          margin: '0 auto 16px',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#64748b', fontFamily: 'Poppins, sans-serif' }}>
          Cargando seguimiento...
        </p>
      </div>
    )
  }

  if (!seguimiento) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <AlertCircle style={{ width: '48px', height: '48px', color: '#cbd5e1', margin: '0 auto 16px' }} />
        <p style={{ color: '#64748b', fontFamily: 'Poppins, sans-serif' }}>
          Seguimiento no encontrado
        </p>
      </div>
    )
  }

  const tipoConfig = tipoSeguimientoConfig[seguimiento.tipoSeguimiento]
  const estadoStyle = estadoConfig[seguimiento.estado]
  const estadoMascotaStyle = estadoMascotaConfig[seguimiento.estadoMascota]

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
          onClick={() => router.push('/admin/seguimientos')}
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
          Volver a Seguimientos
        </button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#0f172a',
              margin: '0 0 8px 0',
              fontFamily: 'Albert Sans, sans-serif'
            }}>{seguimiento.folio}</h1>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {renderStatusBadge(seguimiento.tipoSeguimiento, tipoConfig)}
              {renderStatusBadge(seguimiento.estado, estadoStyle)}
              {renderStatusBadge(seguimiento.estadoMascota, estadoMascotaStyle)}
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b',
              margin: 0,
              fontFamily: 'Poppins, sans-serif'
            }}>
              Seguimiento realizado el {new Date(seguimiento.fechaSeguimiento).toLocaleDateString('es-MX', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <button
            onClick={() => router.push(`/admin/seguimientos/${seguimiento.id}/editar`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
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
            <Edit style={{ width: '16px', height: '16px' }} />
            Editar Seguimiento
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
        {/* Sidebar - Pet and Adopter Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Pet Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <Dog style={{ width: '20px', height: '20px', color: '#7d2447' }} />
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#0f172a',
                margin: 0,
                fontFamily: 'Albert Sans, sans-serif'
              }}>Información de la Mascota</h3>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Image
                src={seguimiento.mascota.foto || '/placeholder-dog.jpg'}
                alt={seguimiento.mascota.nombre}
                width={120}
                height={120}
                style={{
                  borderRadius: '12px',
                  objectFit: 'cover',
                  border: '3px solid #f1f5f9'
                }}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <h4 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#0f172a',
                margin: '0 0 4px 0',
                fontFamily: 'Albert Sans, sans-serif'
              }}>{seguimiento.mascota.nombre}</h4>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                margin: '0 0 8px 0',
                fontFamily: 'Poppins, sans-serif'
              }}>{seguimiento.mascota.codigo}</p>
              <p style={{
                fontSize: '0.875rem',
                color: '#475569',
                margin: 0,
                fontFamily: 'Poppins, sans-serif'
              }}>
                {seguimiento.mascota.raza} • {seguimiento.mascota.edad} • {seguimiento.mascota.sexo}
              </p>
            </div>
          </div>

          {/* Adopter Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <User style={{ width: '20px', height: '20px', color: '#7d2447' }} />
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#0f172a',
                margin: 0,
                fontFamily: 'Albert Sans, sans-serif'
              }}>Adoptante</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: '0 0 4px 0',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>{seguimiento.adoptante.nombre}</h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  margin: 0,
                  fontFamily: 'Poppins, sans-serif'
                }}>{seguimiento.adoptante.ocupacion}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone style={{ width: '16px', height: '16px', color: '#64748b' }} />
                <span style={{
                  fontSize: '0.875rem',
                  color: '#475569',
                  fontFamily: 'Poppins, sans-serif'
                }}>{seguimiento.adoptante.telefono}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail style={{ width: '16px', height: '16px', color: '#64748b' }} />
                <span style={{
                  fontSize: '0.875rem',
                  color: '#475569',
                  fontFamily: 'Poppins, sans-serif'
                }}>{seguimiento.adoptante.email}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin style={{ width: '16px', height: '16px', color: '#64748b', marginTop: '2px' }} />
                <span style={{
                  fontSize: '0.875rem',
                  color: '#475569',
                  fontFamily: 'Poppins, sans-serif',
                  lineHeight: '1.4'
                }}>{seguimiento.adoptante.direccion}</span>
              </div>
            </div>
          </div>

          {/* Satisfaction Score */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <Award style={{ width: '20px', height: '20px', color: '#7d2447' }} />
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#0f172a',
                margin: 0,
                fontFamily: 'Albert Sans, sans-serif'
              }}>Satisfacción</h3>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '4px',
              marginBottom: '8px'
            }}>
              {renderStars(seguimiento.satisfaccionAdoptante)}
            </div>
            
            <p style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#7d2447',
              margin: 0,
              fontFamily: 'Albert Sans, sans-serif'
            }}>{seguimiento.satisfaccionAdoptante}/5</p>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {/* Tabs */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px 12px 0 0',
            padding: '0 20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              gap: '0',
              overflowX: 'auto'
            }}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '16px 20px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: isActive ? '3px solid #7d2447' : '3px solid transparent',
                      color: isActive ? '#7d2447' : '#64748b',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? '600' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                      fontFamily: 'Albert Sans, sans-serif'
                    }}
                  >
                    <tab.icon style={{ width: '16px', height: '16px' }} />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0 0 12px 12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            minHeight: '500px'
          }}>
            {activeTab === 'resumen' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0',
                    fontFamily: 'Albert Sans, sans-serif'
                  }}>Observaciones Generales</h4>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#475569',
                    lineHeight: '1.6',
                    margin: 0,
                    fontFamily: 'Poppins, sans-serif'
                  }}>{seguimiento.observaciones}</p>
                </div>

                {seguimiento.problemas.length > 0 && (
                  <div>
                    <h4 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#0f172a',
                      margin: '0 0 12px 0',
                      fontFamily: 'Albert Sans, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <AlertTriangle style={{ width: '18px', height: '18px', color: '#dc2626' }} />
                      Problemas Detectados
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {seguimiento.problemas.map((problema, index) => (
                        <span
                          key={index}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            borderRadius: '16px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                        >
                          {problema}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0',
                    fontFamily: 'Albert Sans, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CheckCircle style={{ width: '18px', height: '18px', color: '#16a34a' }} />
                    Recomendaciones
                  </h4>
                  <ul style={{
                    margin: 0,
                    paddingLeft: '20px',
                    fontSize: '0.875rem',
                    color: '#475569',
                    lineHeight: '1.6',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    {seguimiento.recomendaciones.map((recomendacion, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>{recomendacion}</li>
                    ))}
                  </ul>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <Calendar style={{ width: '24px', height: '24px', color: '#7d2447', margin: '0 auto 8px' }} />
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      margin: '0 0 4px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Adopción</p>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#0f172a',
                      margin: 0,
                      fontFamily: 'Albert Sans, sans-serif'
                    }}>{new Date(seguimiento.adopcion.fechaAdopcion).toLocaleDateString('es-MX')}</p>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <Clock style={{ width: '24px', height: '24px', color: '#7d2447', margin: '0 auto 8px' }} />
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      margin: '0 0 4px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Próximo Seguimiento</p>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#0f172a',
                      margin: 0,
                      fontFamily: 'Albert Sans, sans-serif'
                    }}>{new Date(seguimiento.proximoSeguimiento).toLocaleDateString('es-MX')}</p>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <User style={{ width: '24px', height: '24px', color: '#7d2447', margin: '0 auto 8px' }} />
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      margin: '0 0 4px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Responsable</p>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#0f172a',
                      margin: 0,
                      fontFamily: 'Albert Sans, sans-serif'
                    }}>{seguimiento.responsable}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'salud' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px'
                }}>
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <Shield style={{ width: '24px', height: '24px', color: '#16a34a', margin: '0 auto 8px' }} />
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#15803d',
                      margin: '0 0 4px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Peso Actual</p>
                    <p style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#15803d',
                      margin: 0,
                      fontFamily: 'Albert Sans, sans-serif'
                    }}>{seguimiento.detalles.salud.peso} kg</p>
                  </div>

                  <div style={{
                    padding: '16px',
                    backgroundColor: '#dbeafe',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <CheckCircle style={{ width: '24px', height: '24px', color: '#1d4ed8', margin: '0 auto 8px' }} />
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#1e40af',
                      margin: '0 0 4px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Vacunas</p>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1e40af',
                      margin: 0,
                      fontFamily: 'Albert Sans, sans-serif'
                    }}>{seguimiento.detalles.salud.vacunas ? 'Al día' : 'Pendientes'}</p>
                  </div>

                  <div style={{
                    padding: '16px',
                    backgroundColor: '#e0e7ff',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <Stethoscope style={{ width: '24px', height: '24px', color: '#6366f1', margin: '0 auto 8px' }} />
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#4338ca',
                      margin: '0 0 4px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Visitas Veterinario</p>
                    <p style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#4338ca',
                      margin: 0,
                      fontFamily: 'Albert Sans, sans-serif'
                    }}>{seguimiento.detalles.salud.visitas_veterinario}</p>
                  </div>
                </div>

                <div>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0',
                    fontFamily: 'Albert Sans, sans-serif'
                  }}>Alimentación</h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px'
                  }}>
                    <div>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        margin: '0 0 4px 0',
                        fontFamily: 'Poppins, sans-serif'
                      }}>Tipo de Alimento</p>
                      <p style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#0f172a',
                        margin: 0,
                        fontFamily: 'Albert Sans, sans-serif'
                      }}>{seguimiento.detalles.alimentacion.tipo}</p>
                    </div>
                    <div>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        margin: '0 0 4px 0',
                        fontFamily: 'Poppins, sans-serif'
                      }}>Frecuencia</p>
                      <p style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#0f172a',
                        margin: 0,
                        fontFamily: 'Albert Sans, sans-serif'
                      }}>{seguimiento.detalles.alimentacion.frecuencia}</p>
                    </div>
                    <div>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        margin: '0 0 4px 0',
                        fontFamily: 'Poppins, sans-serif'
                      }}>Cantidad</p>
                      <p style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#0f172a',
                        margin: 0,
                        fontFamily: 'Albert Sans, sans-serif'
                      }}>{seguimiento.detalles.alimentacion.cantidad}</p>
                    </div>
                    <div>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        margin: '0 0 4px 0',
                        fontFamily: 'Poppins, sans-serif'
                      }}>Apetito</p>
                      <p style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#0f172a',
                        margin: 0,
                        fontFamily: 'Albert Sans, sans-serif',
                        textTransform: 'capitalize'
                      }}>{seguimiento.detalles.alimentacion.apetito}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'comportamiento' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <Heart style={{ width: '24px', height: '24px', color: '#16a34a', margin: '0 auto 8px' }} />
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#15803d',
                      margin: '0 0 4px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Adaptación</p>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#15803d',
                      margin: 0,
                      fontFamily: 'Albert Sans, sans-serif',
                      textTransform: 'capitalize'
                    }}>{seguimiento.detalles.comportamiento.adaptacion}</p>
                  </div>

                  <div style={{
                    padding: '16px',
                    backgroundColor: '#dbeafe',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <User style={{ width: '24px', height: '24px', color: '#1d4ed8', margin: '0 auto 8px' }} />
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#1e40af',
                      margin: '0 0 4px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Socialización</p>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1e40af',
                      margin: 0,
                      fontFamily: 'Albert Sans, sans-serif',
                      textTransform: 'capitalize'
                    }}>{seguimiento.detalles.comportamiento.socializacion}</p>
                  </div>

                  <div style={{
                    padding: '16px',
                    backgroundColor: '#e0e7ff',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <Award style={{ width: '24px', height: '24px', color: '#6366f1', margin: '0 auto 8px' }} />
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#4338ca',
                      margin: '0 0 4px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Obediencia</p>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#4338ca',
                      margin: 0,
                      fontFamily: 'Albert Sans, sans-serif',
                      textTransform: 'capitalize'
                    }}>{seguimiento.detalles.comportamiento.obediencia}</p>
                  </div>
                </div>

                {seguimiento.detalles.comportamiento.problemas_comportamiento.length > 0 && (
                  <div>
                    <h4 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#0f172a',
                      margin: '0 0 12px 0',
                      fontFamily: 'Albert Sans, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <AlertTriangle style={{ width: '18px', height: '18px', color: '#dc2626' }} />
                      Problemas de Comportamiento
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {seguimiento.detalles.comportamiento.problemas_comportamiento.map((problema, index) => (
                        <span
                          key={index}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            borderRadius: '16px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                        >
                          {problema}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ambiente' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  <div style={{
                    padding: '16px',
                    backgroundColor: seguimiento.detalles.ambiente.espacio_adecuado ? '#f0fdf4' : '#fef2f2',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <Home style={{ 
                      width: '24px', 
                      height: '24px', 
                      color: seguimiento.detalles.ambiente.espacio_adecuado ? '#16a34a' : '#dc2626',
                      margin: '0 auto 8px'
                    }} />
                    <p style={{
                      fontSize: '0.75rem',
                      color: seguimiento.detalles.ambiente.espacio_adecuado ? '#15803d' : '#dc2626',
                      margin: '0 0 4px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Espacio</p>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: seguimiento.detalles.ambiente.espacio_adecuado ? '#15803d' : '#dc2626',
                      margin: 0,
                      fontFamily: 'Albert Sans, sans-serif'
                    }}>{seguimiento.detalles.ambiente.espacio_adecuado ? 'Adecuado' : 'Inadecuado'}</p>
                  </div>

                  <div style={{
                    padding: '16px',
                    backgroundColor: '#dbeafe',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <Activity style={{ width: '24px', height: '24px', color: '#1d4ed8', margin: '0 auto 8px' }} />
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#1e40af',
                      margin: '0 0 4px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Ejercicio</p>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1e40af',
                      margin: 0,
                      fontFamily: 'Albert Sans, sans-serif',
                      textTransform: 'capitalize'
                    }}>{seguimiento.detalles.ambiente.ejercicio_diario}</p>
                  </div>

                  <div style={{
                    padding: '16px',
                    backgroundColor: '#e0e7ff',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <Clock style={{ width: '24px', height: '24px', color: '#6366f1', margin: '0 auto 8px' }} />
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#4338ca',
                      margin: '0 0 4px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Tiempo Solo</p>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#4338ca',
                      margin: 0,
                      fontFamily: 'Albert Sans, sans-serif'
                    }}>{seguimiento.detalles.ambiente.tiempo_solo}h/día</p>
                  </div>

                  <div style={{
                    padding: '16px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <Heart style={{ width: '24px', height: '24px', color: '#d97706', margin: '0 auto 8px' }} />
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#92400e',
                      margin: '0 0 4px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Interacción Familiar</p>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#92400e',
                      margin: 0,
                      fontFamily: 'Albert Sans, sans-serif',
                      textTransform: 'capitalize'
                    }}>{seguimiento.detalles.ambiente.interaccion_familia}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fotos' && (
              <div>
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: '0 0 16px 0',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>Evidencias Fotográficas</h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  {seguimiento.fotos.map((foto, index) => (
                    <div key={index} style={{
                      position: 'relative',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      aspectRatio: '1'
                    }}>
                      <Image
                        src={foto}
                        alt={`Foto de seguimiento ${index + 1}`}
                        fill
                        style={{
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'historial' && (
              <div>
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: '0 0 16px 0',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>Historial de Seguimientos</h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  fontStyle: 'italic',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  Esta funcionalidad mostraría todos los seguimientos realizados a esta adopción en orden cronológico.
                </p>
              </div>
            )}
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