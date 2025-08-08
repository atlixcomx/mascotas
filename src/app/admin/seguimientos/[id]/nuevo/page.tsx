'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft,
  Save,
  Calendar,
  Star,
  Camera,
  FileText,
  Heart,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Phone,
  Video,
  MessageCircle,
  User,
  Plus,
  X
} from 'lucide-react'

interface SeguimientoBase {
  id: string
  mascota: {
    id: string
    nombre: string
    codigo: string
    foto: string
    raza: string
  }
  adoptante: {
    id: string
    nombre: string
    telefono: string
  }
  fechaAdopcion: string
}

interface FormData {
  fecha: string
  tipo: 'presencial' | 'telefonica' | 'video' | 'mensaje'
  responsable: string
  estadoSalud: 'excelente' | 'bueno' | 'regular' | 'malo'
  estadoComportamiento: 'adaptado' | 'adaptandose' | 'problemas' | 'regresion'
  calificacion: number
  observaciones: string
  recomendaciones: string
  fotos: File[]
  proximoSeguimiento: string
  problemasIdentificados: string[]
  mejorasObservadas: string[]
  requiereIntervencion: boolean
  tipoIntervencion: string
}

const tiposContacto = [
  { value: 'presencial', label: 'Visita Presencial', icon: User, color: '#16a34a' },
  { value: 'telefonica', label: 'Llamada Telefónica', icon: Phone, color: '#2563eb' },
  { value: 'video', label: 'Videollamada', icon: Video, color: '#9333ea' },
  { value: 'mensaje', label: 'Mensaje/Chat', icon: MessageCircle, color: '#d97706' }
]

const problemasComunes = [
  'Problemas de alimentación',
  'Ansiedad por separación',
  'Comportamiento destructivo',
  'Problemas de socialización',
  'Dificultades con otros animales',
  'Problemas de salud',
  'Falta de ejercicio',
  'Problemas de entrenamiento',
  'Estrés del adoptante',
  'Cambios en el hogar'
]

const mejorasComunes = [
  'Mejor adaptación al hogar',
  'Socialización mejorada',
  'Comportamiento más tranquilo',
  'Mejor apetito',
  'Mayor actividad física',
  'Vínculo fortalecido con adoptante',
  'Obediencia mejorada',
  'Reducción de ansiedad',
  'Mejor salud general',
  'Integración familiar exitosa'
]

const estadosSalud = [
  { value: 'excelente', label: 'Excelente', color: '#16a34a', icon: CheckCircle },
  { value: 'bueno', label: 'Bueno', color: '#2563eb', icon: CheckCircle },
  { value: 'regular', label: 'Regular', color: '#d97706', icon: Clock },
  { value: 'malo', label: 'Malo/Requiere Atención', color: '#dc2626', icon: AlertTriangle }
]

const estadosComportamiento = [
  { value: 'adaptado', label: 'Completamente Adaptado', color: '#16a34a' },
  { value: 'adaptandose', label: 'En Proceso de Adaptación', color: '#2563eb' },
  { value: 'problemas', label: 'Con Problemas Menores', color: '#d97706' },
  { value: 'regresion', label: 'Con Problemas Graves/Regresión', color: '#dc2626' }
]

export default function NuevoSeguimiento() {
  const router = useRouter()
  const params = useParams()
  const [seguimiento, setSeguimiento] = useState<SeguimientoBase | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'telefonica',
    responsable: '',
    estadoSalud: 'bueno',
    estadoComportamiento: 'adaptado',
    calificacion: 4,
    observaciones: '',
    recomendaciones: '',
    fotos: [],
    proximoSeguimiento: '',
    problemasIdentificados: [],
    mejorasObservadas: [],
    requiereIntervencion: false,
    tipoIntervencion: ''
  })

  useEffect(() => {
    if (params.id) {
      fetchSeguimiento()
    }
  }, [params.id])

  async function fetchSeguimiento() {
    try {
      const response = await fetch(`/api/admin/seguimientos/${params.id}/base`)
      const data = await response.json()
      if (response.ok) {
        setSeguimiento(data)
        // Set next follow-up date to 30 days from now by default
        const nextDate = new Date()
        nextDate.setDate(nextDate.getDate() + 30)
        setFormData(prev => ({
          ...prev,
          proximoSeguimiento: nextDate.toISOString().split('T')[0]
        }))
      }
    } catch (error) {
      console.error('Error fetching seguimiento:', error)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleProblema = (problema: string) => {
    setFormData(prev => ({
      ...prev,
      problemasIdentificados: prev.problemasIdentificados.includes(problema)
        ? prev.problemasIdentificados.filter(p => p !== problema)
        : [...prev.problemasIdentificados, problema]
    }))
  }

  const toggleMejora = (mejora: string) => {
    setFormData(prev => ({
      ...prev,
      mejorasObservadas: prev.mejorasObservadas.includes(mejora)
        ? prev.mejorasObservadas.filter(m => m !== mejora)
        : [...prev.mejorasObservadas, mejora]
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFormData(prev => ({
        ...prev,
        fotos: [...prev.fotos, ...newFiles]
      }))
    }
  }

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index)
    }))
  }

  const getStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => handleInputChange('calificacion', i + 1)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px'
        }}
      >
        <Star
          style={{
            width: '24px',
            height: '24px',
            color: i < rating ? '#fbbf24' : '#e5e7eb',
            fill: i < rating ? '#fbbf24' : '#e5e7eb',
            transition: 'all 0.2s'
          }}
        />
      </button>
    ))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const formDataToSend = new FormData()
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'fotos') {
          formData.fotos.forEach((file, index) => {
            formDataToSend.append(`fotos`, file)
          })
        } else if (Array.isArray(value)) {
          formDataToSend.append(key, JSON.stringify(value))
        } else {
          formDataToSend.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/admin/seguimientos/${params.id}/registros`, {
        method: 'POST',
        body: formDataToSend
      })

      if (response.ok) {
        router.push(`/admin/seguimientos/${params.id}`)
      } else {
        console.error('Error creating seguimiento')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!seguimiento) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
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
          Cargando información...
        </p>
      </div>
    )
  }

  const tipoSeleccionado = tiposContacto.find(t => t.value === formData.tipo)
  const estadoSaludSeleccionado = estadosSalud.find(e => e.value === formData.estadoSalud)
  const estadoComportamientoSeleccionado = estadosComportamiento.find(e => e.value === formData.estadoComportamiento)

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
          onClick={() => router.push(`/admin/seguimientos/${params.id}`)}
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
          Volver al Seguimiento
        </button>
        
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#0f172a',
          margin: '0 0 4px 0',
          fontFamily: 'Albert Sans, sans-serif'
        }}>Nuevo Registro de Seguimiento</h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#64748b',
          margin: 0,
          fontFamily: 'Poppins, sans-serif'
        }}>Registra el estado actual de {seguimiento.mascota.nombre}</p>
      </div>

      {/* Pet Info */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <Image
          src={seguimiento.mascota.foto || '/placeholder-dog.jpg'}
          alt={seguimiento.mascota.nombre}
          width={64}
          height={64}
          style={{
            borderRadius: '12px',
            objectFit: 'cover',
            border: '2px solid #f1f5f9'
          }}
        />
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 4px 0',
            fontFamily: 'Albert Sans, sans-serif'
          }}>
            {seguimiento.mascota.nombre}
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            margin: '0 0 4px 0',
            fontFamily: 'Poppins, sans-serif'
          }}>
            {seguimiento.mascota.codigo} • {seguimiento.mascota.raza}
          </p>
          <p style={{
            fontSize: '0.75rem',
            color: '#64748b',
            margin: 0,
            fontFamily: 'Poppins, sans-serif'
          }}>
            Adoptado por {seguimiento.adoptante.nombre} el {new Date(seguimiento.fechaAdopcion).toLocaleDateString('es-MX')}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {/* Basic Info */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Calendar style={{ width: '20px', height: '20px', color: '#7d2447' }} />
            Información del Contacto
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Fecha del Seguimiento
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => handleInputChange('fecha', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Responsable del Seguimiento
              </label>
              <input
                type="text"
                value={formData.responsable}
                onChange={(e) => handleInputChange('responsable', e.target.value)}
                placeholder="Nombre del responsable"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
              Tipo de Contacto
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {tiposContacto.map((tipo) => {
                const Icon = tipo.icon
                return (
                  <button
                    key={tipo.value}
                    type="button"
                    onClick={() => handleInputChange('tipo', tipo.value)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: formData.tipo === tipo.value ? `2px solid ${tipo.color}` : '1px solid #e5e7eb',
                      backgroundColor: formData.tipo === tipo.value ? `${tipo.color}15` : 'white',
                      color: formData.tipo === tipo.value ? tipo.color : '#374151',
                      fontSize: '0.875rem',
                      fontWeight: formData.tipo === tipo.value ? '600' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Icon style={{ width: '18px', height: '18px' }} />
                    {tipo.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Health and Behavior Status */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Heart style={{ width: '20px', height: '20px', color: '#7d2447' }} />
            Estado de Salud y Comportamiento
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Estado de Salud
              </label>
              <div style={{ display: 'grid', gap: '8px' }}>
                {estadosSalud.map((estado) => {
                  const Icon = estado.icon
                  return (
                    <button
                      key={estado.value}
                      type="button"
                      onClick={() => handleInputChange('estadoSalud', estado.value)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: formData.estadoSalud === estado.value ? `2px solid ${estado.color}` : '1px solid #e5e7eb',
                        backgroundColor: formData.estadoSalud === estado.value ? `${estado.color}15` : 'white',
                        color: formData.estadoSalud === estado.value ? estado.color : '#374151',
                        fontSize: '0.875rem',
                        fontWeight: formData.estadoSalud === estado.value ? '600' : '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        textAlign: 'left'
                      }}
                    >
                      <Icon style={{ width: '18px', height: '18px' }} />
                      {estado.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Estado de Comportamiento
              </label>
              <div style={{ display: 'grid', gap: '8px' }}>
                {estadosComportamiento.map((estado) => (
                  <button
                    key={estado.value}
                    type="button"
                    onClick={() => handleInputChange('estadoComportamiento', estado.value)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: formData.estadoComportamiento === estado.value ? `2px solid ${estado.color}` : '1px solid #e5e7eb',
                      backgroundColor: formData.estadoComportamiento === estado.value ? `${estado.color}15` : 'white',
                      color: formData.estadoComportamiento === estado.value ? estado.color : '#374151',
                      fontSize: '0.875rem',
                      fontWeight: formData.estadoComportamiento === estado.value ? '600' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      textAlign: 'left'
                    }}
                  >
                    <Activity style={{ width: '18px', height: '18px' }} />
                    {estado.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Overall Rating */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Star style={{ width: '20px', height: '20px', color: '#7d2447' }} />
            Calificación General de Adaptación
          </h3>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '12px'
            }}>
              {getStars(formData.calificacion)}
            </div>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#0f172a',
              margin: '0 0 4px 0',
              fontFamily: 'Albert Sans, sans-serif'
            }}>
              {formData.calificacion}/5 Estrellas
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b',
              margin: 0,
              fontFamily: 'Poppins, sans-serif'
            }}>
              Haz clic en las estrellas para calificar
            </p>
          </div>
        </div>

        {/* Problems Identified */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle style={{ width: '20px', height: '20px', color: '#7d2447' }} />
            Problemas Identificados
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {problemasComunes.map((problema) => (
              <button
                key={problema}
                type="button"
                onClick={() => toggleProblema(problema)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  border: formData.problemasIdentificados.includes(problema) ? 'none' : '1px solid #e5e7eb',
                  backgroundColor: formData.problemasIdentificados.includes(problema) ? '#dc2626' : 'white',
                  color: formData.problemasIdentificados.includes(problema) ? 'white' : '#374151',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {problema}
              </button>
            ))}
          </div>
        </div>

        {/* Improvements Observed */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle style={{ width: '20px', height: '20px', color: '#7d2447' }} />
            Mejoras Observadas
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {mejorasComunes.map((mejora) => (
              <button
                key={mejora}
                type="button"
                onClick={() => toggleMejora(mejora)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  border: formData.mejorasObservadas.includes(mejora) ? 'none' : '1px solid #e5e7eb',
                  backgroundColor: formData.mejorasObservadas.includes(mejora) ? '#16a34a' : 'white',
                  color: formData.mejorasObservadas.includes(mejora) ? 'white' : '#374151',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {mejora}
              </button>
            ))}
          </div>
        </div>

        {/* Observations and Recommendations */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FileText style={{ width: '20px', height: '20px', color: '#7d2447' }} />
            Observaciones y Recomendaciones
          </h3>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Observaciones Detalladas
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                rows={4}
                placeholder="Describe el estado actual de la mascota, comportamientos observados, cambios desde el último seguimiento..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Recomendaciones para el Adoptante
              </label>
              <textarea
                value={formData.recomendaciones}
                onChange={(e) => handleInputChange('recomendaciones', e.target.value)}
                rows={3}
                placeholder="Recomendaciones específicas, cuidados especiales, próximos pasos..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
        </div>

        {/* Photos */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Camera style={{ width: '20px', height: '20px', color: '#7d2447' }} />
            Fotos del Seguimiento
          </h3>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '24px',
                  border: '2px dashed #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  color: '#64748b',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#bfb591'
                  e.currentTarget.style.backgroundColor = '#f0fdf4'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.backgroundColor = '#f8fafc'
                }}
              >
                <Plus style={{ width: '20px', height: '20px' }} />
                Agregar Fotos
              </label>
            </div>

            {formData.fotos.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                {formData.fotos.map((file, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Foto ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #f1f5f9'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      <X style={{ width: '12px', height: '12px' }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Intervention and Next Follow-up */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Clock style={{ width: '20px', height: '20px', color: '#7d2447' }} />
            Seguimiento y Próximos Pasos
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Próximo Seguimiento Programado
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
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontFamily: 'Poppins, sans-serif'
              }}>
                <input
                  type="checkbox"
                  checked={formData.requiereIntervencion}
                  onChange={(e) => handleInputChange('requiereIntervencion', e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                Requiere intervención especializada
              </label>
            </div>
          </div>

          {formData.requiereIntervencion && (
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Tipo de Intervención Requerida
              </label>
              <select
                value={formData.tipoIntervencion}
                onChange={(e) => handleInputChange('tipoIntervencion', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="">Seleccionar tipo de intervención</option>
                <option value="veterinaria">Atención Veterinaria</option>
                <option value="comportamental">Entrenamiento de Comportamiento</option>
                <option value="social">Socialización Especializada</option>
                <option value="nutricional">Asesoría Nutricional</option>
                <option value="urgente">Intervención Urgente</option>
                <option value="devolucion">Evaluación para Devolución</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{
        marginTop: '24px',
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={() => router.push(`/admin/seguimientos/${params.id}`)}
          style={{
            padding: '10px 20px',
            backgroundColor: 'white',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
        >
          Cancelar
        </button>
        
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
            fontFamily: 'Albert Sans, sans-serif',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#5a1a33')}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#7d2447')}
        >
          <Save style={{ width: '16px', height: '16px' }} />
          {loading ? 'Guardando...' : 'Guardar Seguimiento'}
        </button>
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