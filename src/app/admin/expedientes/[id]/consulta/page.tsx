'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft,
  Save,
  Calendar,
  Stethoscope,
  Thermometer,
  Weight,
  FileText,
  Pill,
  AlertCircle,
  Heart,
  Activity,
  DollarSign,
  Clock,
  Plus,
  X
} from 'lucide-react'

interface Mascota {
  id: string
  codigo: string
  nombre: string
  foto: string
  raza: string
  edad: string
  sexo: string
  pesoActual: number
}

interface FormData {
  fecha: string
  hora: string
  motivo: string
  sintomas: string[]
  peso: string
  temperatura: string
  frecuenciaCardiaca: string
  frecuenciaRespiratoria: string
  examenFisico: string
  diagnostico: string
  tratamiento: string
  medicamentos: Array<{
    nombre: string
    dosis: string
    frecuencia: string
    duracion: string
  }>
  examenes: string[]
  observaciones: string
  proximaCita: string
  veterinario: string
  costo: string
}

const sintomasComunes = [
  'Vómito',
  'Diarrea',
  'Pérdida de apetito',
  'Letargo',
  'Tos',
  'Estornudos',
  'Picazón',
  'Cojera',
  'Secreción ocular',
  'Secreción nasal',
  'Pérdida de peso',
  'Aumento de sed',
  'Dificultad respiratoria',
  'Convulsiones',
  'Dolor abdominal'
]

const examenesComunes = [
  'Hemograma completo',
  'Química sanguínea',
  'Urianálisis',
  'Radiografía',
  'Ultrasonido',
  'Coproscópico',
  'Test de parvovirus',
  'Test de moquillo',
  'Cultivo bacteriano',
  'Raspado de piel'
]

export default function NuevaConsulta() {
  const router = useRouter()
  const params = useParams()
  const [mascota, setMascota] = useState<Mascota | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5),
    motivo: '',
    sintomas: [],
    peso: '',
    temperatura: '',
    frecuenciaCardiaca: '',
    frecuenciaRespiratoria: '',
    examenFisico: '',
    diagnostico: '',
    tratamiento: '',
    medicamentos: [],
    examenes: [],
    observaciones: '',
    proximaCita: '',
    veterinario: '',
    costo: ''
  })

  useEffect(() => {
    if (params.id) {
      fetchMascota()
    }
  }, [params.id])

  async function fetchMascota() {
    try {
      const response = await fetch(`/api/admin/expedientes/${params.id}/mascota`)
      const data = await response.json()
      if (response.ok) {
        setMascota(data)
        setFormData(prev => ({ ...prev, peso: data.pesoActual.toString() }))
      }
    } catch (error) {
      console.error('Error fetching mascota:', error)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleSintoma = (sintoma: string) => {
    setFormData(prev => ({
      ...prev,
      sintomas: prev.sintomas.includes(sintoma)
        ? prev.sintomas.filter(s => s !== sintoma)
        : [...prev.sintomas, sintoma]
    }))
  }

  const toggleExamen = (examen: string) => {
    setFormData(prev => ({
      ...prev,
      examenes: prev.examenes.includes(examen)
        ? prev.examenes.filter(e => e !== examen)
        : [...prev.examenes, examen]
    }))
  }

  const addMedicamento = () => {
    setFormData(prev => ({
      ...prev,
      medicamentos: [...prev.medicamentos, {
        nombre: '',
        dosis: '',
        frecuencia: '',
        duracion: ''
      }]
    }))
  }

  const removeMedicamento = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medicamentos: prev.medicamentos.filter((_, i) => i !== index)
    }))
  }

  const updateMedicamento = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      medicamentos: prev.medicamentos.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/expedientes/${params.id}/consultas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push(`/admin/expedientes/${params.id}`)
      } else {
        console.error('Error creating consulta')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!mascota) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <p>Cargando información...</p>
      </div>
    )
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
          onClick={() => router.push(`/admin/expedientes/${params.id}`)}
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
          Volver al Expediente
        </button>
        
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#0f172a',
          margin: '0 0 4px 0',
          fontFamily: 'Albert Sans, sans-serif'
        }}>Nueva Consulta Médica</h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#64748b',
          margin: 0,
          fontFamily: 'Poppins, sans-serif'
        }}>Registra los detalles de la consulta veterinaria</p>
      </div>

      {/* Patient Info */}
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
          src={mascota.foto || '/placeholder-dog.jpg'}
          alt={mascota.nombre}
          width={60}
          height={60}
          style={{
            borderRadius: '8px',
            objectFit: 'cover'
          }}
        />
        <div>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 4px 0'
          }}>
            {mascota.nombre}
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            margin: 0
          }}>
            {mascota.codigo} • {mascota.raza} • {mascota.edad} • {mascota.sexo}
          </p>
        </div>
      </div>

      {/* Form */}
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
            Información General
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Fecha de Consulta
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
                Hora
              </label>
              <input
                type="time"
                value={formData.hora}
                onChange={(e) => handleInputChange('hora', e.target.value)}
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
                Veterinario
              </label>
              <input
                type="text"
                value={formData.veterinario}
                onChange={(e) => handleInputChange('veterinario', e.target.value)}
                placeholder="Dr./Dra."
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

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Motivo de Consulta
              </label>
              <input
                type="text"
                value={formData.motivo}
                onChange={(e) => handleInputChange('motivo', e.target.value)}
                placeholder="Describa brevemente el motivo de la consulta"
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
        </div>

        {/* Symptoms */}
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
            <AlertCircle style={{ width: '20px', height: '20px', color: '#7d2447' }} />
            Síntomas Presentados
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {sintomasComunes.map((sintoma) => (
              <button
                key={sintoma}
                onClick={() => toggleSintoma(sintoma)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  border: formData.sintomas.includes(sintoma) ? 'none' : '1px solid #e5e7eb',
                  backgroundColor: formData.sintomas.includes(sintoma) ? '#7d2447' : 'white',
                  color: formData.sintomas.includes(sintoma) ? 'white' : '#374151',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {sintoma}
              </button>
            ))}
          </div>
        </div>

        {/* Vital Signs */}
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
            <Activity style={{ width: '20px', height: '20px', color: '#7d2447' }} />
            Signos Vitales
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                <Weight style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
                Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.peso}
                onChange={(e) => handleInputChange('peso', e.target.value)}
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
                <Thermometer style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
                Temperatura (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.temperatura}
                onChange={(e) => handleInputChange('temperatura', e.target.value)}
                placeholder="38.5"
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
                <Heart style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
                Frecuencia Cardíaca (lpm)
              </label>
              <input
                type="number"
                value={formData.frecuenciaCardiaca}
                onChange={(e) => handleInputChange('frecuenciaCardiaca', e.target.value)}
                placeholder="80-120"
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
                <Activity style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
                Frecuencia Respiratoria (rpm)
              </label>
              <input
                type="number"
                value={formData.frecuenciaRespiratoria}
                onChange={(e) => handleInputChange('frecuenciaRespiratoria', e.target.value)}
                placeholder="15-30"
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
        </div>

        {/* Physical Exam & Diagnosis */}
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
            <Stethoscope style={{ width: '20px', height: '20px', color: '#7d2447' }} />
            Examen Físico y Diagnóstico
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Hallazgos del Examen Físico
              </label>
              <textarea
                value={formData.examenFisico}
                onChange={(e) => handleInputChange('examenFisico', e.target.value)}
                rows={4}
                placeholder="Describa los hallazgos del examen físico..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
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
                Diagnóstico
              </label>
              <textarea
                value={formData.diagnostico}
                onChange={(e) => handleInputChange('diagnostico', e.target.value)}
                rows={3}
                placeholder="Diagnóstico presuntivo o definitivo..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
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

        {/* Lab Tests */}
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
            Exámenes Solicitados
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {examenesComunes.map((examen) => (
              <button
                key={examen}
                onClick={() => toggleExamen(examen)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  border: formData.examenes.includes(examen) ? 'none' : '1px solid #e5e7eb',
                  backgroundColor: formData.examenes.includes(examen) ? '#7d2447' : 'white',
                  color: formData.examenes.includes(examen) ? 'white' : '#374151',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {examen}
              </button>
            ))}
          </div>
        </div>

        {/* Treatment */}
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
            <Pill style={{ width: '20px', height: '20px', color: '#7d2447' }} />
            Tratamiento
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Plan de Tratamiento
              </label>
              <textarea
                value={formData.tratamiento}
                onChange={(e) => handleInputChange('tratamiento', e.target.value)}
                rows={3}
                placeholder="Describa el plan de tratamiento..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Medicamentos Prescritos
                </label>
                <button
                  onClick={addMedicamento}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 12px',
                    backgroundColor: '#7d2447',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a1a33'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7d2447'}
                >
                  <Plus style={{ width: '14px', height: '14px' }} />
                  Agregar Medicamento
                </button>
              </div>

              {formData.medicamentos.map((med, index) => (
                <div key={index} style={{
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  position: 'relative'
                }}>
                  <button
                    onClick={() => removeMedicamento(index)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#fee2e2',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                  >
                    <X style={{ width: '14px', height: '14px', color: '#dc2626' }} />
                  </button>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                    <input
                      type="text"
                      value={med.nombre}
                      onChange={(e) => updateMedicamento(index, 'nombre', e.target.value)}
                      placeholder="Nombre del medicamento"
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                    <input
                      type="text"
                      value={med.dosis}
                      onChange={(e) => updateMedicamento(index, 'dosis', e.target.value)}
                      placeholder="Dosis"
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                    <input
                      type="text"
                      value={med.frecuencia}
                      onChange={(e) => updateMedicamento(index, 'frecuencia', e.target.value)}
                      placeholder="Frecuencia"
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                    <input
                      type="text"
                      value={med.duracion}
                      onChange={(e) => updateMedicamento(index, 'duracion', e.target.value)}
                      placeholder="Duración"
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Follow-up & Cost */}
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
            Seguimiento y Costos
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Próxima Cita
              </label>
              <input
                type="date"
                value={formData.proximaCita}
                onChange={(e) => handleInputChange('proximaCita', e.target.value)}
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
                <DollarSign style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
                Costo de la Consulta
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.costo}
                onChange={(e) => handleInputChange('costo', e.target.value)}
                placeholder="0.00"
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

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Observaciones Adicionales
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                rows={3}
                placeholder="Notas adicionales sobre la consulta..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
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
      </div>

      {/* Actions */}
      <div style={{
        marginTop: '24px',
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={() => router.push(`/admin/expedientes/${params.id}`)}
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
          {loading ? 'Guardando...' : 'Guardar Consulta'}
        </button>
      </div>
    </div>
  )
}