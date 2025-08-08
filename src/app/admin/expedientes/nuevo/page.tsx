'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft,
  Save,
  Dog,
  Search,
  Heart,
  Syringe,
  Pill,
  AlertCircle,
  FileText,
  Plus,
  X,
  Check
} from 'lucide-react'

interface Mascota {
  id: string
  codigo: string
  nombre: string
  foto: string
  raza: string
  edad: string
  sexo: string
  tamano: string
  tipoIngreso: string
  fechaIngreso: string
}

interface FormData {
  mascotaId: string
  estadoSalud: 'excelente' | 'bueno' | 'regular' | 'tratamiento'
  peso: string
  altura: string
  esterilizado: boolean
  fechaEsterilizacion: string
  microchip: string
  
  // Padecimientos
  padecimientos: Array<{
    nombre: string
    tipo: 'cronico' | 'temporal'
    fechaDiagnostico: string
    estado: 'activo' | 'controlado' | 'resuelto'
    tratamiento: string
  }>
  
  // Alergias
  alergias: string[]
  
  // Vacunas iniciales
  vacunas: Array<{
    nombre: string
    fecha: string
    proximaDosis: string
    veterinario: string
    lote: string
  }>
  
  // Observaciones iniciales
  observacionesGenerales: string
  historialPrevio: string
}

const vacunasComunes = [
  'Puppy DP (Distemper, Parvovirus)',
  'DHPPI+L (Séxtuple)',
  'Rabia',
  'KC (Tos de las perreras)',
  'Giardia',
  'Influenza canina'
]

const alergiasComunes = [
  'Pollo',
  'Res',
  'Lácteos',
  'Granos',
  'Pulgas',
  'Polen',
  'Ácaros del polvo',
  'Medicamentos específicos'
]

export default function NuevoExpediente() {
  const router = useRouter()
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    mascotaId: '',
    estadoSalud: 'bueno',
    peso: '',
    altura: '',
    esterilizado: false,
    fechaEsterilizacion: '',
    microchip: '',
    padecimientos: [],
    alergias: [],
    vacunas: [],
    observacionesGenerales: '',
    historialPrevio: ''
  })

  useEffect(() => {
    fetchMascotasSinExpediente()
  }, [])

  async function fetchMascotasSinExpediente() {
    try {
      const response = await fetch('/api/admin/mascotas/sin-expediente')
      const data = await response.json()
      if (response.ok) {
        setMascotas(data.mascotas || [])
      }
    } catch (error) {
      console.error('Error fetching mascotas:', error)
    }
  }

  const handleSelectMascota = (mascota: Mascota) => {
    setSelectedMascota(mascota)
    setFormData(prev => ({ ...prev, mascotaId: mascota.id }))
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleAlergia = (alergia: string) => {
    setFormData(prev => ({
      ...prev,
      alergias: prev.alergias.includes(alergia)
        ? prev.alergias.filter(a => a !== alergia)
        : [...prev.alergias, alergia]
    }))
  }

  const addPadecimiento = () => {
    setFormData(prev => ({
      ...prev,
      padecimientos: [...prev.padecimientos, {
        nombre: '',
        tipo: 'temporal',
        fechaDiagnostico: new Date().toISOString().split('T')[0],
        estado: 'activo',
        tratamiento: ''
      }]
    }))
  }

  const removePadecimiento = (index: number) => {
    setFormData(prev => ({
      ...prev,
      padecimientos: prev.padecimientos.filter((_, i) => i !== index)
    }))
  }

  const updatePadecimiento = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      padecimientos: prev.padecimientos.map((pad, i) => 
        i === index ? { ...pad, [field]: value } : pad
      )
    }))
  }

  const addVacuna = () => {
    setFormData(prev => ({
      ...prev,
      vacunas: [...prev.vacunas, {
        nombre: '',
        fecha: new Date().toISOString().split('T')[0],
        proximaDosis: '',
        veterinario: '',
        lote: ''
      }]
    }))
  }

  const removeVacuna = (index: number) => {
    setFormData(prev => ({
      ...prev,
      vacunas: prev.vacunas.filter((_, i) => i !== index)
    }))
  }

  const updateVacuna = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      vacunas: prev.vacunas.map((vac, i) => 
        i === index ? { ...vac, [field]: value } : vac
      )
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/expedientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/admin/expedientes/${data.id}`)
      } else {
        console.error('Error creating expediente')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMascotas = mascotas.filter(mascota => 
    mascota.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mascota.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#0f172a',
          margin: '0 0 4px 0',
          fontFamily: 'Albert Sans, sans-serif'
        }}>Nuevo Expediente Médico</h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#64748b',
          margin: 0,
          fontFamily: 'Poppins, sans-serif'
        }}>Crea un expediente médico para una mascota</p>
      </div>

      {/* Progress Steps */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px'
        }}>
          {[
            { num: 1, label: 'Selección de Mascota' },
            { num: 2, label: 'Información Médica' },
            { num: 3, label: 'Revisión' }
          ].map((s, index) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: step >= s.num ? '#7d2447' : '#e5e7eb',
                color: step >= s.num ? 'white' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.3s'
              }}>
                {step > s.num ? <Check style={{ width: '20px', height: '20px' }} /> : s.num}
              </div>
              <p style={{
                marginLeft: '12px',
                fontSize: '0.875rem',
                color: step >= s.num ? '#0f172a' : '#94a3b8',
                fontWeight: step === s.num ? '600' : '400'
              }}>
                {s.label}
              </p>
              {index < 2 && (
                <div style={{
                  width: '60px',
                  height: '2px',
                  backgroundColor: step > s.num ? '#7d2447' : '#e5e7eb',
                  marginLeft: '24px',
                  transition: 'all 0.3s'
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
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        {step === 1 && (
          <div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 20px 0'
            }}>Selecciona la Mascota</h3>

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
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
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

            {/* Mascotas Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {filteredMascotas.map((mascota) => (
                <div
                  key={mascota.id}
                  onClick={() => handleSelectMascota(mascota)}
                  style={{
                    cursor: 'pointer',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: selectedMascota?.id === mascota.id ? '2px solid #7d2447' : '2px solid transparent',
                    backgroundColor: selectedMascota?.id === mascota.id ? '#faf5ff' : 'white',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Image
                    src={mascota.foto || '/placeholder-dog.jpg'}
                    alt={mascota.nombre}
                    width={200}
                    height={150}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ padding: '12px' }}>
                    <h4 style={{
                      margin: '0 0 4px 0',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#0f172a'
                    }}>{mascota.nombre}</h4>
                    <p style={{
                      margin: '0 0 2px 0',
                      fontSize: '0.75rem',
                      color: '#64748b'
                    }}>{mascota.codigo}</p>
                    <p style={{
                      margin: '0 0 8px 0',
                      fontSize: '0.75rem',
                      color: '#64748b'
                    }}>{mascota.raza} • {mascota.edad} • {mascota.tamano}</p>
                    <p style={{
                      margin: 0,
                      fontSize: '0.75rem',
                      color: '#94a3b8'
                    }}>
                      Ingreso: {new Date(mascota.fechaIngreso).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {filteredMascotas.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px' }}>
                <Dog style={{ width: '48px', height: '48px', color: '#cbd5e1', margin: '0 auto 16px' }} />
                <p style={{ color: '#64748b' }}>No se encontraron mascotas sin expediente</p>
              </div>
            )}
          </div>
        )}

        {step === 2 && selectedMascota && (
          <div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 20px 0'
            }}>Información Médica Inicial</h3>

            {/* Selected Pet Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <Image
                src={selectedMascota.foto || '/placeholder-dog.jpg'}
                alt={selectedMascota.nombre}
                width={60}
                height={60}
                style={{
                  borderRadius: '8px',
                  objectFit: 'cover'
                }}
              />
              <div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: '0 0 4px 0'
                }}>
                  {selectedMascota.nombre}
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  margin: 0
                }}>
                  {selectedMascota.codigo} • {selectedMascota.raza} • {selectedMascota.edad}
                </p>
              </div>
            </div>

            {/* Basic Health Info */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Heart style={{ width: '18px', height: '18px', color: '#7d2447' }} />
                Estado de Salud General
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    Estado de Salud
                  </label>
                  <select
                    value={formData.estadoSalud}
                    onChange={(e) => handleInputChange('estadoSalud', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  >
                    <option value="excelente">Excelente</option>
                    <option value="bueno">Bueno</option>
                    <option value="regular">Regular</option>
                    <option value="tratamiento">En Tratamiento</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
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
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.altura}
                    onChange={(e) => handleInputChange('altura', e.target.value)}
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
                    Microchip
                  </label>
                  <input
                    type="text"
                    value={formData.microchip}
                    onChange={(e) => handleInputChange('microchip', e.target.value)}
                    placeholder="Número de microchip"
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

              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.esterilizado}
                    onChange={(e) => handleInputChange('esterilizado', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>Esterilizado</span>
                </label>
                {formData.esterilizado && (
                  <input
                    type="date"
                    value={formData.fechaEsterilizacion}
                    onChange={(e) => handleInputChange('fechaEsterilizacion', e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                )}
              </div>
            </div>

            {/* Allergies */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle style={{ width: '18px', height: '18px', color: '#7d2447' }} />
                Alergias Conocidas
              </h4>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {alergiasComunes.map((alergia) => (
                  <button
                    key={alergia}
                    onClick={() => toggleAlergia(alergia)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '20px',
                      border: formData.alergias.includes(alergia) ? 'none' : '1px solid #e5e7eb',
                      backgroundColor: formData.alergias.includes(alergia) ? '#dc2626' : 'white',
                      color: formData.alergias.includes(alergia) ? 'white' : '#374151',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {alergia}
                  </button>
                ))}
              </div>
            </div>

            {/* Medical Conditions */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Pill style={{ width: '18px', height: '18px', color: '#7d2447' }} />
                  Padecimientos
                </h4>
                <button
                  onClick={addPadecimiento}
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
                  Agregar Padecimiento
                </button>
              </div>

              {formData.padecimientos.map((pad, index) => (
                <div key={index} style={{
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  position: 'relative'
                }}>
                  <button
                    onClick={() => removePadecimiento(index)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#fee2e2',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <X style={{ width: '14px', height: '14px', color: '#dc2626' }} />
                  </button>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                    <input
                      type="text"
                      value={pad.nombre}
                      onChange={(e) => updatePadecimiento(index, 'nombre', e.target.value)}
                      placeholder="Nombre del padecimiento"
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                    <select
                      value={pad.tipo}
                      onChange={(e) => updatePadecimiento(index, 'tipo', e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    >
                      <option value="temporal">Temporal</option>
                      <option value="cronico">Crónico</option>
                    </select>
                    <input
                      type="date"
                      value={pad.fechaDiagnostico}
                      onChange={(e) => updatePadecimiento(index, 'fechaDiagnostico', e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                    <select
                      value={pad.estado}
                      onChange={(e) => updatePadecimiento(index, 'estado', e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    >
                      <option value="activo">Activo</option>
                      <option value="controlado">Controlado</option>
                      <option value="resuelto">Resuelto</option>
                    </select>
                  </div>
                  <textarea
                    value={pad.tratamiento}
                    onChange={(e) => updatePadecimiento(index, 'tratamiento', e.target.value)}
                    placeholder="Tratamiento actual o recomendado"
                    rows={2}
                    style={{
                      width: '100%',
                      marginTop: '8px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Initial Vaccines */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Syringe style={{ width: '18px', height: '18px', color: '#7d2447' }} />
                  Vacunas Aplicadas
                </h4>
                <button
                  onClick={addVacuna}
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
                  Agregar Vacuna
                </button>
              </div>

              {formData.vacunas.map((vac, index) => (
                <div key={index} style={{
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  position: 'relative'
                }}>
                  <button
                    onClick={() => removeVacuna(index)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#fee2e2',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <X style={{ width: '14px', height: '14px', color: '#dc2626' }} />
                  </button>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                    <select
                      value={vac.nombre}
                      onChange={(e) => updateVacuna(index, 'nombre', e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    >
                      <option value="">Seleccionar vacuna</option>
                      {vacunasComunes.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={vac.fecha}
                      onChange={(e) => updateVacuna(index, 'fecha', e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                    <input
                      type="date"
                      value={vac.proximaDosis}
                      onChange={(e) => updateVacuna(index, 'proximaDosis', e.target.value)}
                      placeholder="Próxima dosis"
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
                      value={vac.veterinario}
                      onChange={(e) => updateVacuna(index, 'veterinario', e.target.value)}
                      placeholder="Veterinario"
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
                      value={vac.lote}
                      onChange={(e) => updateVacuna(index, 'lote', e.target.value)}
                      placeholder="Lote"
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

            {/* Additional Notes */}
            <div>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FileText style={{ width: '18px', height: '18px', color: '#7d2447' }} />
                Observaciones
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    Historial Previo
                  </label>
                  <textarea
                    value={formData.historialPrevio}
                    onChange={(e) => handleInputChange('historialPrevio', e.target.value)}
                    rows={3}
                    placeholder="Información relevante sobre el historial médico previo..."
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
                    Observaciones Generales
                  </label>
                  <textarea
                    value={formData.observacionesGenerales}
                    onChange={(e) => handleInputChange('observacionesGenerales', e.target.value)}
                    rows={3}
                    placeholder="Cualquier observación adicional sobre la salud de la mascota..."
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
        )}

        {step === 3 && selectedMascota && (
          <div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 20px 0'
            }}>Resumen del Expediente</h3>

            {/* Pet Info */}
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Dog style={{ width: '18px', height: '18px', color: '#7d2447' }} />
                Información de la Mascota
              </h4>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Image
                  src={selectedMascota.foto || '/placeholder-dog.jpg'}
                  alt={selectedMascota.nombre}
                  width={80}
                  height={80}
                  style={{
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', flex: 1 }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 2px 0' }}>Nombre</p>
                    <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0, fontWeight: '500' }}>
                      {selectedMascota.nombre}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 2px 0' }}>Código</p>
                    <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0, fontWeight: '500' }}>
                      {selectedMascota.codigo}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 2px 0' }}>Raza</p>
                    <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0, fontWeight: '500' }}>
                      {selectedMascota.raza}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 2px 0' }}>Edad</p>
                    <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0, fontWeight: '500' }}>
                      {selectedMascota.edad}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Status */}
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Heart style={{ width: '18px', height: '18px', color: '#7d2447' }} />
                Estado de Salud
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 2px 0' }}>Estado General</p>
                  <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0, fontWeight: '500' }}>
                    {formData.estadoSalud}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 2px 0' }}>Peso</p>
                  <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0, fontWeight: '500' }}>
                    {formData.peso} kg
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 2px 0' }}>Altura</p>
                  <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0, fontWeight: '500' }}>
                    {formData.altura} cm
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 2px 0' }}>Esterilizado</p>
                  <p style={{ fontSize: '0.875rem', color: formData.esterilizado ? '#16a34a' : '#dc2626', margin: 0, fontWeight: '500' }}>
                    {formData.esterilizado ? 'Sí' : 'No'}
                  </p>
                </div>
              </div>
            </div>

            {/* Allergies */}
            {formData.alergias.length > 0 && (
              <div style={{
                backgroundColor: '#fee2e2',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid #fecaca'
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#991b1b',
                  margin: '0 0 12px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle style={{ width: '18px', height: '18px' }} />
                  Alergias Registradas
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {formData.alergias.map((alergia, index) => (
                    <span key={index} style={{
                      padding: '4px 12px',
                      backgroundColor: 'white',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      color: '#7f1d1d',
                      border: '1px solid #fecaca'
                    }}>
                      {alergia}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Medical Conditions */}
            {formData.padecimientos.length > 0 && (
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: '0 0 16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Pill style={{ width: '18px', height: '18px', color: '#7d2447' }} />
                  Padecimientos Registrados
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {formData.padecimientos.map((pad, index) => (
                    <div key={index} style={{
                      padding: '12px',
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', margin: '0 0 4px 0' }}>
                            {pad.nombre}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                            {pad.tipo === 'cronico' ? 'Crónico' : 'Temporal'} • {pad.estado}
                          </p>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          Desde: {new Date(pad.fechaDiagnostico).toLocaleDateString('es-MX')}
                        </p>
                      </div>
                      {pad.tratamiento && (
                        <p style={{ fontSize: '0.875rem', color: '#475569', marginTop: '8px' }}>
                          Tratamiento: {pad.tratamiento}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vaccines */}
            {formData.vacunas.length > 0 && (
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: '0 0 16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Syringe style={{ width: '18px', height: '18px', color: '#7d2447' }} />
                  Vacunas Aplicadas
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {formData.vacunas.map((vac, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: index < formData.vacunas.length - 1 ? '1px solid #e5e7eb' : 'none'
                    }}>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#0f172a', margin: 0 }}>
                          {vac.nombre}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                          Dr. {vac.veterinario} • Lote: {vac.lote}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>
                          {new Date(vac.fecha).toLocaleDateString('es-MX')}
                        </p>
                        {vac.proximaDosis && (
                          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                            Próxima: {new Date(vac.proximaDosis).toLocaleDateString('es-MX')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{
        marginTop: '24px',
        display: 'flex',
        gap: '12px',
        justifyContent: 'space-between'
      }}>
        <button
          onClick={() => step > 1 ? setStep(step - 1) : router.push('/admin/expedientes')}
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
          {step === 1 ? 'Cancelar' : 'Anterior'}
        </button>
        
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={step === 1 && !selectedMascota}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: (step === 1 && !selectedMascota) ? '#e5e7eb' : '#7d2447',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              fontFamily: 'Albert Sans, sans-serif',
              cursor: (step === 1 && !selectedMascota) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => (step !== 1 || selectedMascota) && (e.currentTarget.style.backgroundColor = '#5a1a33')}
            onMouseLeave={(e) => (step !== 1 || selectedMascota) && (e.currentTarget.style.backgroundColor = '#7d2447')}
          >
            Siguiente
            <ChevronRight style={{ width: '16px', height: '16px' }} />
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
              backgroundColor: loading ? '#94a3b8' : '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              fontFamily: 'Albert Sans, sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#15803d')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#16a34a')}
          >
            <Save style={{ width: '16px', height: '16px' }} />
            {loading ? 'Creando...' : 'Crear Expediente'}
          </button>
        )}
      </div>
    </div>
  )
}