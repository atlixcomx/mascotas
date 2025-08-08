'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft,
  Save,
  Search,
  Dog,
  User,
  Heart,
  Calendar,
  Star,
  AlertTriangle,
  CheckCircle,
  Camera,
  Plus,
  X,
  Stethoscope,
  Activity,
  Home,
  Award
} from 'lucide-react'

interface Adopcion {
  id: string
  folio: string
  fechaAdopcion: string
  adoptante: {
    nombre: string
    telefono: string
    email: string
    direccion: string
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
  estado: string
}

interface FormData {
  adopcionId: string
  tipoSeguimiento: 'inicial' | 'mensual' | 'semestral' | 'anual' | 'problema'
  fechaSeguimiento: string
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
      peso: string
      vacunas: boolean
      desparasitacion: boolean
      visitas_veterinario: string
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
      tiempo_solo: string
      interaccion_familia: 'excelente' | 'buena' | 'regular' | 'mala'
    }
  }
  observaciones: string
  problemas: string[]
  recomendaciones: string[]
  proximoSeguimiento: string
  responsable: string
}

const problemasSaludComunes = [
  'Problemas digestivos',
  'Problemas de piel',
  'Sobrepeso',
  'Bajo peso',
  'Problemas dentales',
  'Problemas respiratorios',
  'Problemas articulares',
  'Infecciones'
]

const problemasComportamientoComunes = [
  'Ansiedad por separación',
  'Ladridos excesivos',
  'Destructividad',
  'Agresividad',
  'Miedos',
  'Problemas de socialización',
  'Desobediencia',
  'Marcaje territorial'
]

const problemasGeneralesComunes = [
  'Adaptación lenta',
  'Conflictos con otros animales',
  'Problemas de salud',
  'Cuidados inadecuados',
  'Falta de ejercicio',
  'Alimentación inadecuada',
  'Necesita entrenamiento',
  'Requiere atención veterinaria'
]

export default function NuevoSeguimiento() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [adopciones, setAdopciones] = useState<Adopcion[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAdopcion, setSelectedAdopcion] = useState<Adopcion | null>(null)
  const [formData, setFormData] = useState<FormData>({
    adopcionId: '',
    tipoSeguimiento: 'inicial',
    fechaSeguimiento: new Date().toISOString().split('T')[0],
    estado: 'pendiente',
    estadoMascota: 'bueno',
    satisfaccionAdoptante: 4,
    detalles: {
      alimentacion: {
        tipo: '',
        frecuencia: '2 veces al día',
        cantidad: '',
        apetito: 'bueno'
      },
      salud: {
        peso: '',
        vacunas: true,
        desparasitacion: true,
        visitas_veterinario: '0',
        problemas_salud: []
      },
      comportamiento: {
        adaptacion: 'buena',
        socializacion: 'buena',
        obediencia: 'buena',
        problemas_comportamiento: []
      },
      ambiente: {
        espacio_adecuado: true,
        ejercicio_diario: 'suficiente',
        tiempo_solo: '0',
        interaccion_familia: 'buena'
      }
    },
    observaciones: '',
    problemas: [],
    recomendaciones: [],
    proximoSeguimiento: '',
    responsable: ''
  })

  const steps = [
    { num: 1, label: 'Selección de Adopción' },
    { num: 2, label: 'Información General' },
    { num: 3, label: 'Estado de Salud' },
    { num: 4, label: 'Comportamiento' },
    { num: 5, label: 'Ambiente y Cuidados' },
    { num: 6, label: 'Observaciones y Revisión' }
  ]

  useEffect(() => {
    const adopcionId = searchParams.get('adopcion')
    if (adopcionId) {
      setFormData(prev => ({ ...prev, adopcionId }))
      // Find and select the adoption
      fetchAdopciones(adopcionId)
    } else {
      fetchAdopciones()
    }
  }, [])

  async function fetchAdopciones(selectedId?: string) {
    try {
      // Mock data - replace with actual API call
      const mockData: Adopcion[] = [
        {
          id: '1',
          folio: 'ADOP-2024-001',
          fechaAdopcion: '2024-01-08',
          adoptante: {
            nombre: 'María González',
            telefono: '222-123-4567',
            email: 'maria.gonzalez@email.com',
            direccion: 'Av. Reforma 123, Col. Centro'
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
          estado: 'adoptado'
        },
        {
          id: '2',
          folio: 'ADOP-2024-002',
          fechaAdopcion: '2024-01-12',
          adoptante: {
            nombre: 'Carlos Hernández',
            telefono: '222-987-6543',
            email: 'carlos.hernandez@email.com',
            direccion: 'Calle 5 de Mayo 456, Col. San Miguel'
          },
          mascota: {
            id: 'perro2',
            nombre: 'Rocky',
            codigo: 'PER-002',
            foto: '/placeholder-dog.jpg',
            raza: 'Pastor Alemán Mix',
            edad: '3 años',
            sexo: 'Macho'
          },
          estado: 'adoptado'
        }
      ]

      setAdopciones(mockData)
      
      if (selectedId) {
        const adopcion = mockData.find(a => a.id === selectedId)
        if (adopcion) {
          setSelectedAdopcion(adopcion)
          setStep(2)
        }
      }
    } catch (error) {
      console.error('Error fetching adopciones:', error)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [section, subfield] = field.split('.')
      setFormData(prev => ({
        ...prev,
        detalles: {
          ...prev.detalles,
          [section]: {
            ...prev.detalles[section as keyof typeof prev.detalles],
            [subfield]: value
          }
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const toggleArrayItem = (field: string, item: string) => {
    if (field.includes('.')) {
      const [section, subfield] = field.split('.')
      setFormData(prev => ({
        ...prev,
        detalles: {
          ...prev.detalles,
          [section]: {
            ...prev.detalles[section as keyof typeof prev.detalles],
            [subfield]: (prev.detalles[section as keyof typeof prev.detalles] as any)[subfield].includes(item)
              ? (prev.detalles[section as keyof typeof prev.detalles] as any)[subfield].filter((i: string) => i !== item)
              : [...(prev.detalles[section as keyof typeof prev.detalles] as any)[subfield], item]
          }
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: (prev[field as keyof FormData] as string[]).includes(item)
          ? (prev[field as keyof FormData] as string[]).filter(i => i !== item)
          : [...(prev[field as keyof FormData] as string[]), item]
      }))
    }
  }

  const addRecomendacion = () => {
    setFormData(prev => ({
      ...prev,
      recomendaciones: [...prev.recomendaciones, '']
    }))
  }

  const updateRecomendacion = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      recomendaciones: prev.recomendaciones.map((rec, i) => i === index ? value : rec)
    }))
  }

  const removeRecomendacion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      recomendaciones: prev.recomendaciones.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // API call to create follow-up
      const response = await fetch('/api/admin/seguimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          adopcionId: selectedAdopcion?.id
        })
      })

      if (response.ok) {
        router.push('/admin/seguimientos')
      } else {
        console.error('Error creating seguimiento')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAdopciones = adopciones.filter(adopcion =>
    adopcion.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adopcion.adoptante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adopcion.mascota.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adopcion.mascota.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderStars = (rating: number, onRate?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        onClick={() => onRate && onRate(i + 1)}
        style={{
          width: '24px',
          height: '24px',
          color: i < rating ? '#fbbf24' : '#e5e7eb',
          fill: i < rating ? '#fbbf24' : 'transparent',
          cursor: onRate ? 'pointer' : 'default'
        }}
      />
    ))
  }

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
        
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#0f172a',
          margin: '0 0 4px 0',
          fontFamily: 'Albert Sans, sans-serif'
        }}>Nuevo Seguimiento Post-Adopción</h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#64748b',
          margin: 0,
          fontFamily: 'Poppins, sans-serif'
        }}>Registra un nuevo seguimiento para verificar el bienestar de la mascota adoptada</p>
      </div>

      {/* Progress Steps */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {steps.map((stepItem, index) => (
            <div key={stepItem.num} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: step >= stepItem.num ? '#7d2447' : '#e5e7eb',
                  color: step >= stepItem.num ? 'white' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>
                  {stepItem.num}
                </div>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: step === stepItem.num ? '600' : '500',
                  color: step === stepItem.num ? '#7d2447' : '#64748b',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  {stepItem.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div style={{
                  flex: 1,
                  height: '2px',
                  backgroundColor: step > stepItem.num ? '#7d2447' : '#e5e7eb',
                  marginLeft: '16px'
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        marginBottom: '20px',
        minHeight: '500px'
      }}>
        {step === 1 && (
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 20px 0',
              fontFamily: 'Albert Sans, sans-serif'
            }}>Seleccionar Adopción para Seguimiento</h3>

            {/* Search */}
            <div style={{
              position: 'relative',
              marginBottom: '20px'
            }}>
              <Search style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: '#94a3b8'
              }} />
              <input
                type="text"
                placeholder="Buscar por folio, adoptante, mascota o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.875rem',
                  fontFamily: 'Poppins, sans-serif',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#bfb591'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Adoption List */}
            <div style={{
              display: 'grid',
              gap: '16px',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {filteredAdopciones.map((adopcion) => (
                <div
                  key={adopcion.id}
                  onClick={() => {
                    setSelectedAdopcion(adopcion)
                    setFormData(prev => ({ ...prev, adopcionId: adopcion.id }))
                  }}
                  style={{
                    padding: '16px',
                    border: selectedAdopcion?.id === adopcion.id ? '2px solid #7d2447' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: selectedAdopcion?.id === adopcion.id ? '#f8fafc' : 'white'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedAdopcion?.id !== adopcion.id) {
                      e.currentTarget.style.borderColor = '#bfb591'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedAdopcion?.id !== adopcion.id) {
                      e.currentTarget.style.borderColor = '#e5e7eb'
                    }
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <Image
                      src={adopcion.mascota.foto || '/placeholder-dog.jpg'}
                      alt={adopcion.mascota.nombre}
                      width={60}
                      height={60}
                      style={{
                        borderRadius: '8px',
                        objectFit: 'cover',
                        border: '2px solid #f1f5f9'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <h4 style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#0f172a',
                            margin: '0 0 4px 0',
                            fontFamily: 'Albert Sans, sans-serif'
                          }}>{adopcion.folio}</h4>
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#64748b',
                            margin: 0,
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            Adoptado el {new Date(adopcion.fechaAdopcion).toLocaleDateString('es-MX')}
                          </p>
                        </div>
                        {selectedAdopcion?.id === adopcion.id && (
                          <CheckCircle style={{ width: '20px', height: '20px', color: '#7d2447' }} />
                        )}
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <Dog style={{ width: '14px', height: '14px', color: '#7d2447' }} />
                            <span style={{
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#0f172a',
                              fontFamily: 'Albert Sans, sans-serif'
                            }}>
                              {adopcion.mascota.nombre}
                            </span>
                          </div>
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            margin: 0,
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            {adopcion.mascota.codigo} • {adopcion.mascota.raza}
                          </p>
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <User style={{ width: '14px', height: '14px', color: '#7d2447' }} />
                            <span style={{
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#0f172a',
                              fontFamily: 'Albert Sans, sans-serif'
                            }}>
                              {adopcion.adoptante.nombre}
                            </span>
                          </div>
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            margin: 0,
                            fontFamily: 'Poppins, sans-serif'
                          }}>
                            {adopcion.adoptante.telefono}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && selectedAdopcion && (
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 20px 0',
              fontFamily: 'Albert Sans, sans-serif'
            }}>Información General del Seguimiento</h3>

            {/* Selected Adoption Info */}
            <div style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              marginBottom: '24px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Image
                  src={selectedAdopcion.mascota.foto || '/placeholder-dog.jpg'}
                  alt={selectedAdopcion.mascota.nombre}
                  width={60}
                  height={60}
                  style={{
                    borderRadius: '8px',
                    objectFit: 'cover',
                    border: '2px solid #f1f5f9'
                  }}
                />
                <div>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 4px 0',
                    fontFamily: 'Albert Sans, sans-serif'
                  }}>
                    {selectedAdopcion.mascota.nombre} - {selectedAdopcion.adoptante.nombre}
                  </h4>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                    margin: 0,
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    {selectedAdopcion.folio} • Adoptado el {new Date(selectedAdopcion.fechaAdopcion).toLocaleDateString('es-MX')}
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>
                  Tipo de Seguimiento
                </label>
                <select
                  value={formData.tipoSeguimiento}
                  onChange={(e) => handleInputChange('tipoSeguimiento', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <option value="inicial">Inicial (7 días)</option>
                  <option value="mensual">Mensual</option>
                  <option value="semestral">Semestral</option>
                  <option value="anual">Anual</option>
                  <option value="problema">Por Problema</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>
                  Fecha del Seguimiento
                </label>
                <input
                  type="date"
                  value={formData.fechaSeguimiento}
                  onChange={(e) => handleInputChange('fechaSeguimiento', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>
                  Estado del Seguimiento
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="completado">Completado</option>
                  <option value="problema_detectado">Problema Detectado</option>
                  <option value="requiere_atencion">Requiere Atención</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>
                  Estado General de la Mascota
                </label>
                <select
                  value={formData.estadoMascota}
                  onChange={(e) => handleInputChange('estadoMascota', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <option value="excelente">Excelente</option>
                  <option value="bueno">Bueno</option>
                  <option value="regular">Regular</option>
                  <option value="preocupante">Preocupante</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>
                  Responsable del Seguimiento
                </label>
                <input
                  type="text"
                  value={formData.responsable}
                  onChange={(e) => handleInputChange('responsable', e.target.value)}
                  placeholder="Dr./Dra. Nombre Apellido"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>
                  Próximo Seguimiento
                </label>
                <input
                  type="date"
                  value={formData.proximoSeguimiento}
                  onChange={(e) => handleInputChange('proximoSeguimiento', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                />
              </div>
            </div>

            {/* Satisfaction Rating */}
            <div style={{ marginTop: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '12px',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                fontFamily: 'Albert Sans, sans-serif'
              }}>
                Satisfacción del Adoptante (1-5 estrellas)
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                {renderStars(formData.satisfaccionAdoptante, (rating) => handleInputChange('satisfaccionAdoptante', rating))}
                <span style={{
                  marginLeft: '12px',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#7d2447',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>
                  {formData.satisfaccionAdoptante}/5
                </span>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 20px 0',
              fontFamily: 'Albert Sans, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Stethoscope style={{ width: '20px', height: '20px', color: '#7d2447' }} />
              Estado de Salud
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '24px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>
                  Peso Actual (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.detalles.salud.peso}
                  onChange={(e) => handleInputChange('salud.peso', e.target.value)}
                  placeholder="15.5"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>
                  Visitas al Veterinario
                </label>
                <input
                  type="number"
                  value={formData.detalles.salud.visitas_veterinario}
                  onChange={(e) => handleInputChange('salud.visitas_veterinario', e.target.value)}
                  placeholder="1"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.detalles.salud.vacunas}
                    onChange={(e) => handleInputChange('salud.vacunas', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Vacunas al día
                </label>
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.detalles.salud.desparasitacion}
                    onChange={(e) => handleInputChange('salud.desparasitacion', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Desparasitación al día
                </label>
              </div>
            </div>

            {/* Alimentación */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 16px 0',
                fontFamily: 'Albert Sans, sans-serif'
              }}>Alimentación</h4>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    fontFamily: 'Albert Sans, sans-serif'
                  }}>
                    Tipo de Alimento
                  </label>
                  <input
                    type="text"
                    value={formData.detalles.alimentacion.tipo}
                    onChange={(e) => handleInputChange('alimentacion.tipo', e.target.value)}
                    placeholder="Alimento premium para perros adultos"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '0.875rem',
                      outline: 'none',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    fontFamily: 'Albert Sans, sans-serif'
                  }}>
                    Frecuencia
                  </label>
                  <select
                    value={formData.detalles.alimentacion.frecuencia}
                    onChange={(e) => handleInputChange('alimentacion.frecuencia', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '0.875rem',
                      outline: 'none',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    <option value="1 vez al día">1 vez al día</option>
                    <option value="2 veces al día">2 veces al día</option>
                    <option value="3 veces al día">3 veces al día</option>
                    <option value="Libre acceso">Libre acceso</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    fontFamily: 'Albert Sans, sans-serif'
                  }}>
                    Cantidad por Comida
                  </label>
                  <input
                    type="text"
                    value={formData.detalles.alimentacion.cantidad}
                    onChange={(e) => handleInputChange('alimentacion.cantidad', e.target.value)}
                    placeholder="1 taza"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '0.875rem',
                      outline: 'none',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    fontFamily: 'Albert Sans, sans-serif'
                  }}>
                    Apetito
                  </label>
                  <select
                    value={formData.detalles.alimentacion.apetito}
                    onChange={(e) => handleInputChange('alimentacion.apetito', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '0.875rem',
                      outline: 'none',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    <option value="excelente">Excelente</option>
                    <option value="bueno">Bueno</option>
                    <option value="regular">Regular</option>
                    <option value="malo">Malo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Problemas de Salud */}
            <div>
              <h4 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 12px 0',
                fontFamily: 'Albert Sans, sans-serif'
              }}>Problemas de Salud Detectados</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {problemasSaludComunes.map((problema) => (
                  <button
                    key={problema}
                    onClick={() => toggleArrayItem('salud.problemas_salud', problema)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '20px',
                      border: formData.detalles.salud.problemas_salud.includes(problema) ? 'none' : '1px solid #e5e7eb',
                      backgroundColor: formData.detalles.salud.problemas_salud.includes(problema) ? '#7d2447' : 'white',
                      color: formData.detalles.salud.problemas_salud.includes(problema) ? 'white' : '#374151',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {problema}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 20px 0',
              fontFamily: 'Albert Sans, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Activity style={{ width: '20px', height: '20px', color: '#7d2447' }} />
              Comportamiento
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '24px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>
                  Adaptación al Hogar
                </label>
                <select
                  value={formData.detalles.comportamiento.adaptacion}
                  onChange={(e) => handleInputChange('comportamiento.adaptacion', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <option value="excelente">Excelente</option>
                  <option value="buena">Buena</option>
                  <option value="regular">Regular</option>
                  <option value="mala">Mala</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>
                  Socialización
                </label>
                <select
                  value={formData.detalles.comportamiento.socializacion}
                  onChange={(e) => handleInputChange('comportamiento.socializacion', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <option value="excelente">Excelente</option>
                  <option value="buena">Buena</option>
                  <option value="regular">Regular</option>
                  <option value="mala">Mala</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>
                  Obediencia
                </label>
                <select
                  value={formData.detalles.comportamiento.obediencia}
                  onChange={(e) => handleInputChange('comportamiento.obediencia', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <option value="excelente">Excelente</option>
                  <option value="buena">Buena</option>
                  <option value="regular">Regular</option>
                  <option value="mala">Mala</option>
                </select>
              </div>
            </div>

            {/* Problemas de Comportamiento */}
            <div>
              <h4 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 12px 0',
                fontFamily: 'Albert Sans, sans-serif'
              }}>Problemas de Comportamiento Detectados</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {problemasComportamientoComunes.map((problema) => (
                  <button
                    key={problema}
                    onClick={() => toggleArrayItem('comportamiento.problemas_comportamiento', problema)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '20px',
                      border: formData.detalles.comportamiento.problemas_comportamiento.includes(problema) ? 'none' : '1px solid #e5e7eb',
                      backgroundColor: formData.detalles.comportamiento.problemas_comportamiento.includes(problema) ? '#7d2447' : 'white',
                      color: formData.detalles.comportamiento.problemas_comportamiento.includes(problema) ? 'white' : '#374151',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {problema}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 20px 0',
              fontFamily: 'Albert Sans, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Home style={{ width: '20px', height: '20px', color: '#7d2447' }} />
              Ambiente y Cuidados
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '24px'
            }}>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.detalles.ambiente.espacio_adecuado}
                    onChange={(e) => handleInputChange('ambiente.espacio_adecuado', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Espacio adecuado para la mascota
                </label>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>
                  Ejercicio Diario
                </label>
                <select
                  value={formData.detalles.ambiente.ejercicio_diario}
                  onChange={(e) => handleInputChange('ambiente.ejercicio_diario', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <option value="suficiente">Suficiente</option>
                  <option value="regular">Regular</option>
                  <option value="insuficiente">Insuficiente</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>
                  Horas Sola al Día
                </label>
                <input
                  type="number"
                  value={formData.detalles.ambiente.tiempo_solo}
                  onChange={(e) => handleInputChange('ambiente.tiempo_solo', e.target.value)}
                  placeholder="6"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>
                  Interacción con la Familia
                </label>
                <select
                  value={formData.detalles.ambiente.interaccion_familia}
                  onChange={(e) => handleInputChange('ambiente.interaccion_familia', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <option value="excelente">Excelente</option>
                  <option value="buena">Buena</option>
                  <option value="regular">Regular</option>
                  <option value="mala">Mala</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 20px 0',
              fontFamily: 'Albert Sans, sans-serif'
            }}>Observaciones y Revisión Final</h3>

            {/* Observaciones */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                fontFamily: 'Albert Sans, sans-serif'
              }}>
                Observaciones Generales
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                rows={4}
                placeholder="Describa las observaciones generales sobre el estado de la mascota y su adaptación..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'Poppins, sans-serif'
                }}
              />
            </div>

            {/* Problemas Generales */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 12px 0',
                fontFamily: 'Albert Sans, sans-serif'
              }}>Problemas Generales Detectados</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {problemasGeneralesComunes.map((problema) => (
                  <button
                    key={problema}
                    onClick={() => toggleArrayItem('problemas', problema)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '20px',
                      border: formData.problemas.includes(problema) ? 'none' : '1px solid #e5e7eb',
                      backgroundColor: formData.problemas.includes(problema) ? '#7d2447' : 'white',
                      color: formData.problemas.includes(problema) ? 'white' : '#374151',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {problema}
                  </button>
                ))}
              </div>
            </div>

            {/* Recomendaciones */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: 0,
                  fontFamily: 'Albert Sans, sans-serif'
                }}>Recomendaciones</h4>
                <button
                  onClick={addRecomendacion}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    backgroundColor: '#7d2447',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'Albert Sans, sans-serif'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a1a33'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7d2447'}
                >
                  <Plus style={{ width: '14px', height: '14px' }} />
                  Agregar
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {formData.recomendaciones.map((recomendacion, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center'
                  }}>
                    <input
                      type="text"
                      value={recomendacion}
                      onChange={(e) => updateRecomendacion(index, e.target.value)}
                      placeholder="Escriba una recomendación..."
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.875rem',
                        outline: 'none',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    />
                    <button
                      onClick={() => removeRecomendacion(index)}
                      style={{
                        padding: '6px',
                        backgroundColor: '#fee2e2',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                    >
                      <X style={{ width: '14px', height: '14px', color: '#dc2626' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button
          onClick={() => setStep(prev => Math.max(1, prev - 1))}
          disabled={step === 1}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: step === 1 ? '#f3f4f6' : 'white',
            color: step === 1 ? '#9ca3af' : '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: step === 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            fontFamily: 'Albert Sans, sans-serif'
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Anterior
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.875rem',
          color: '#64748b',
          fontFamily: 'Poppins, sans-serif'
        }}>
          Paso {step} de {steps.length}
        </div>

        {step < steps.length ? (
          <button
            onClick={() => {
              if (step === 1 && !selectedAdopcion) {
                alert('Por favor seleccione una adopción')
                return
              }
              setStep(prev => Math.min(steps.length, prev + 1))
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#7d2447',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'Albert Sans, sans-serif'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a1a33'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7d2447'}
          >
            Siguiente
            <ArrowLeft style={{ width: '16px', height: '16px', transform: 'rotate(180deg)' }} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: loading ? '#94a3b8' : '#7d2447',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'Albert Sans, sans-serif'
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#5a1a33')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#7d2447')}
          >
            <Save style={{ width: '16px', height: '16px' }} />
            {loading ? 'Guardando...' : 'Crear Seguimiento'}
          </button>
        )}
      </div>
    </div>
  )
}