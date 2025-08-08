'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Heart,
  Calendar,
  DollarSign,
  Dog,
  Users,
  Check,
  X,
  AlertCircle,
  FileText,
  Camera,
  Upload
} from 'lucide-react'

interface Mascota {
  id: string
  codigo: string
  nombre: string
  raza: string
  edad: string
  sexo: string
  tamano: string
  fotoPrincipal: string
  estado: string
}

interface FormData {
  // Datos del solicitante
  nombreCompleto: string
  email: string
  telefono: string
  fechaNacimiento: string
  ocupacion: string
  direccion: string
  ciudad: string
  estado: string
  codigoPostal: string
  tipoIdentificacion: 'ine' | 'pasaporte' | 'otro'
  numeroIdentificacion: string
  
  // Información sobre la adopción
  mascotaId: string
  motivoAdopcion: string
  experienciaMascotas: boolean
  descripcionExperiencia: string
  
  // Información sobre el hogar
  tipoVivienda: 'casa' | 'departamento' | 'otro'
  esPropia: boolean
  tieneJardin: boolean
  tamanoEspacio: 'pequeno' | 'mediano' | 'grande'
  personasEnCasa: number
  hayNinos: boolean
  edadesNinos: string
  otrosMascotas: boolean
  descripcionMascotas: string
  alergias: boolean
  descripcionAlergias: string
  
  // Información económica
  ingresosMensuales: 'menos_10k' | '10k_20k' | '20k_30k' | 'mas_30k'
  puedeManutención: boolean
  gastoEstimado: string
  
  // Compromiso
  tiempoSolo: string
  compromisoEsterilizacion: boolean
  compromisoSeguimiento: boolean
  permitirVisitas: boolean
  
  // Referencias
  referencias: Array<{
    nombre: string
    relacion: string
    telefono: string
  }>
  
  // Documentos
  comprobanteIngresos?: File
  comprobanteDomicilio?: File
  identificacionOficial?: File
}

export default function NuevaSolicitud() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    nombreCompleto: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    ocupacion: '',
    direccion: '',
    ciudad: '',
    estado: 'Puebla',
    codigoPostal: '',
    tipoIdentificacion: 'ine',
    numeroIdentificacion: '',
    mascotaId: '',
    motivoAdopcion: '',
    experienciaMascotas: false,
    descripcionExperiencia: '',
    tipoVivienda: 'casa',
    esPropia: true,
    tieneJardin: false,
    tamanoEspacio: 'mediano',
    personasEnCasa: 1,
    hayNinos: false,
    edadesNinos: '',
    otrosMascotas: false,
    descripcionMascotas: '',
    alergias: false,
    descripcionAlergias: '',
    ingresosMensuales: '10k_20k',
    puedeManutención: true,
    gastoEstimado: '',
    tiempoSolo: '',
    compromisoEsterilizacion: true,
    compromisoSeguimiento: true,
    permitirVisitas: true,
    referencias: [
      { nombre: '', relacion: '', telefono: '' },
      { nombre: '', relacion: '', telefono: '' }
    ]
  })
  
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const steps = [
    { id: 1, name: 'Datos Personales', icon: User },
    { id: 2, name: 'Información del Hogar', icon: Home },
    { id: 3, name: 'Selección de Mascota', icon: Dog },
    { id: 4, name: 'Compromiso y Referencias', icon: Heart },
    { id: 5, name: 'Documentación', icon: FileText },
    { id: 6, name: 'Revisión', icon: Check }
  ]

  useEffect(() => {
    fetchMascotasDisponibles()
  }, [])

  async function fetchMascotasDisponibles() {
    try {
      const response = await fetch('/api/admin/perritos?estado=disponible')
      const data = await response.json()
      if (response.ok) {
        setMascotas(data.perritos || [])
      }
    } catch (error) {
      console.error('Error fetching mascotas:', error)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleReferenciaChange = (index: number, field: string, value: string) => {
    const nuevasReferencias = [...formData.referencias]
    nuevasReferencias[index] = {
      ...nuevasReferencias[index],
      [field]: value
    }
    setFormData(prev => ({
      ...prev,
      referencias: nuevasReferencias
    }))
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.nombreCompleto) newErrors.nombreCompleto = 'Nombre completo requerido'
        if (!formData.email) newErrors.email = 'Email requerido'
        if (!formData.telefono) newErrors.telefono = 'Teléfono requerido'
        if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'Fecha de nacimiento requerida'
        if (!formData.direccion) newErrors.direccion = 'Dirección requerida'
        if (!formData.numeroIdentificacion) newErrors.numeroIdentificacion = 'Número de identificación requerido'
        break
      case 2:
        if (formData.personasEnCasa < 1) newErrors.personasEnCasa = 'Debe haber al menos 1 persona'
        if (formData.hayNinos && !formData.edadesNinos) newErrors.edadesNinos = 'Especifique las edades de los niños'
        if (formData.otrosMascotas && !formData.descripcionMascotas) newErrors.descripcionMascotas = 'Describa sus otras mascotas'
        break
      case 3:
        if (!formData.mascotaId) newErrors.mascotaId = 'Debe seleccionar una mascota'
        if (!formData.motivoAdopcion) newErrors.motivoAdopcion = 'Explique por qué desea adoptar'
        if (formData.experienciaMascotas && !formData.descripcionExperiencia) newErrors.descripcionExperiencia = 'Describa su experiencia'
        break
      case 4:
        if (!formData.tiempoSolo) newErrors.tiempoSolo = 'Indique cuánto tiempo estará sola la mascota'
        if (!formData.gastoEstimado) newErrors.gastoEstimado = 'Estime el gasto mensual'
        // Validate at least one complete reference
        const hasValidReference = formData.referencias.some(ref => 
          ref.nombre && ref.relacion && ref.telefono
        )
        if (!hasValidReference) newErrors.referencias = 'Proporcione al menos una referencia completa'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const formDataToSend = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'referencias') {
          formDataToSend.append(key, JSON.stringify(value))
        } else if (value instanceof File) {
          formDataToSend.append(key, value)
        } else {
          formDataToSend.append(key, String(value))
        }
      })

      const response = await fetch('/api/admin/solicitudes', {
        method: 'POST',
        body: formDataToSend
      })

      if (response.ok) {
        router.push('/admin/solicitudes')
      } else {
        console.error('Error creating solicitud')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Nombre Completo *
              </label>
              <input
                type="text"
                value={formData.nombreCompleto}
                onChange={(e) => handleInputChange('nombreCompleto', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: errors.nombreCompleto ? '1px solid #ef4444' : '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              {errors.nombreCompleto && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.nombreCompleto}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: errors.email ? '1px solid #ef4444' : '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              {errors.email && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.email}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Teléfono *
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: errors.telefono ? '1px solid #ef4444' : '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              {errors.telefono && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.telefono}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: errors.fechaNacimiento ? '1px solid #ef4444' : '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              {errors.fechaNacimiento && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.fechaNacimiento}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Ocupación
              </label>
              <input
                type="text"
                value={formData.ocupacion}
                onChange={(e) => handleInputChange('ocupacion', e.target.value)}
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
                Tipo de Identificación *
              </label>
              <select
                value={formData.tipoIdentificacion}
                onChange={(e) => handleInputChange('tipoIdentificacion', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="ine">INE</option>
                <option value="pasaporte">Pasaporte</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Número de Identificación *
              </label>
              <input
                type="text"
                value={formData.numeroIdentificacion}
                onChange={(e) => handleInputChange('numeroIdentificacion', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: errors.numeroIdentificacion ? '1px solid #ef4444' : '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              {errors.numeroIdentificacion && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.numeroIdentificacion}</p>
              )}
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Dirección Completa *
              </label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: errors.direccion ? '1px solid #ef4444' : '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              {errors.direccion && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.direccion}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Ciudad
              </label>
              <input
                type="text"
                value={formData.ciudad}
                onChange={(e) => handleInputChange('ciudad', e.target.value)}
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
                Estado
              </label>
              <input
                type="text"
                value={formData.estado}
                onChange={(e) => handleInputChange('estado', e.target.value)}
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
                Código Postal
              </label>
              <input
                type="text"
                value={formData.codigoPostal}
                onChange={(e) => handleInputChange('codigoPostal', e.target.value)}
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
        )

      case 2:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Tipo de Vivienda
              </label>
              <select
                value={formData.tipoVivienda}
                onChange={(e) => handleInputChange('tipoVivienda', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                ¿La vivienda es propia?
              </label>
              <select
                value={formData.esPropia ? 'si' : 'no'}
                onChange={(e) => handleInputChange('esPropia', e.target.value === 'si')}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="si">Sí</option>
                <option value="no">No (Renta)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                ¿Tiene jardín o patio?
              </label>
              <select
                value={formData.tieneJardin ? 'si' : 'no'}
                onChange={(e) => handleInputChange('tieneJardin', e.target.value === 'si')}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Tamaño del espacio
              </label>
              <select
                value={formData.tamanoEspacio}
                onChange={(e) => handleInputChange('tamanoEspacio', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="pequeno">Pequeño</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Número de personas en casa *
              </label>
              <input
                type="number"
                min="1"
                value={formData.personasEnCasa}
                onChange={(e) => handleInputChange('personasEnCasa', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: errors.personasEnCasa ? '1px solid #ef4444' : '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              {errors.personasEnCasa && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.personasEnCasa}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                ¿Hay niños en casa?
              </label>
              <select
                value={formData.hayNinos ? 'si' : 'no'}
                onChange={(e) => handleInputChange('hayNinos', e.target.value === 'si')}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </div>

            {formData.hayNinos && (
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Edades de los niños *
                </label>
                <input
                  type="text"
                  value={formData.edadesNinos}
                  onChange={(e) => handleInputChange('edadesNinos', e.target.value)}
                  placeholder="Ej: 5 y 8 años"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: errors.edadesNinos ? '1px solid #ef4444' : '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                {errors.edadesNinos && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.edadesNinos}</p>
                )}
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                ¿Tiene otras mascotas?
              </label>
              <select
                value={formData.otrosMascotas ? 'si' : 'no'}
                onChange={(e) => handleInputChange('otrosMascotas', e.target.value === 'si')}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </div>

            {formData.otrosMascotas && (
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Describa sus otras mascotas *
                </label>
                <textarea
                  value={formData.descripcionMascotas}
                  onChange={(e) => handleInputChange('descripcionMascotas', e.target.value)}
                  rows={3}
                  placeholder="Tipo, raza, edad, temperamento..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: errors.descripcionMascotas ? '1px solid #ef4444' : '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
                {errors.descripcionMascotas && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.descripcionMascotas}</p>
                )}
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                ¿Alguien tiene alergias?
              </label>
              <select
                value={formData.alergias ? 'si' : 'no'}
                onChange={(e) => handleInputChange('alergias', e.target.value === 'si')}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </div>

            {formData.alergias && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Describa las alergias
                </label>
                <input
                  type="text"
                  value={formData.descripcionAlergias}
                  onChange={(e) => handleInputChange('descripcionAlergias', e.target.value)}
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
            )}
          </div>
        )

      case 3:
        return (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Seleccione la mascota que desea adoptar *
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                {mascotas.map((mascota) => (
                  <div
                    key={mascota.id}
                    onClick={() => {
                      handleInputChange('mascotaId', mascota.id)
                      setSelectedMascota(mascota)
                    }}
                    style={{
                      cursor: 'pointer',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: formData.mascotaId === mascota.id ? '2px solid #7d2447' : '2px solid transparent',
                      backgroundColor: 'white',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Image
                      src={mascota.fotoPrincipal || '/placeholder-dog.jpg'}
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
                        margin: 0,
                        fontSize: '0.75rem',
                        color: '#64748b'
                      }}>{mascota.raza} • {mascota.edad} • {mascota.tamano}</p>
                    </div>
                  </div>
                ))}
              </div>
              {errors.mascotaId && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '8px' }}>{errors.mascotaId}</p>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                ¿Por qué desea adoptar esta mascota? *
              </label>
              <textarea
                value={formData.motivoAdopcion}
                onChange={(e) => handleInputChange('motivoAdopcion', e.target.value)}
                rows={4}
                placeholder="Explique sus motivaciones para adoptar..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: errors.motivoAdopcion ? '1px solid #ef4444' : '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
              {errors.motivoAdopcion && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.motivoAdopcion}</p>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                ¿Tiene experiencia con mascotas?
              </label>
              <select
                value={formData.experienciaMascotas ? 'si' : 'no'}
                onChange={(e) => handleInputChange('experienciaMascotas', e.target.value === 'si')}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </div>

            {formData.experienciaMascotas && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Describa su experiencia *
                </label>
                <textarea
                  value={formData.descripcionExperiencia}
                  onChange={(e) => handleInputChange('descripcionExperiencia', e.target.value)}
                  rows={3}
                  placeholder="Cuéntenos sobre su experiencia previa con mascotas..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: errors.descripcionExperiencia ? '1px solid #ef4444' : '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
                {errors.descripcionExperiencia && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.descripcionExperiencia}</p>
                )}
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '20px', color: '#0f172a' }}>
              Información Económica y Compromiso
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Rango de ingresos mensuales
                </label>
                <select
                  value={formData.ingresosMensuales}
                  onChange={(e) => handleInputChange('ingresosMensuales', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                >
                  <option value="menos_10k">Menos de $10,000</option>
                  <option value="10k_20k">$10,000 - $20,000</option>
                  <option value="20k_30k">$20,000 - $30,000</option>
                  <option value="mas_30k">Más de $30,000</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Gasto mensual estimado en la mascota *
                </label>
                <input
                  type="text"
                  value={formData.gastoEstimado}
                  onChange={(e) => handleInputChange('gastoEstimado', e.target.value)}
                  placeholder="$1,500"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: errors.gastoEstimado ? '1px solid #ef4444' : '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                {errors.gastoEstimado && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.gastoEstimado}</p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  ¿Cuánto tiempo estará sola la mascota al día? *
                </label>
                <input
                  type="text"
                  value={formData.tiempoSolo}
                  onChange={(e) => handleInputChange('tiempoSolo', e.target.value)}
                  placeholder="4-6 horas"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: errors.tiempoSolo ? '1px solid #ef4444' : '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                {errors.tiempoSolo && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.tiempoSolo}</p>
                )}
              </div>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', color: '#0f172a' }}>
                Compromisos de Adopción
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.compromisoEsterilizacion}
                    onChange={(e) => handleInputChange('compromisoEsterilizacion', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                    Me comprometo a esterilizar a la mascota (si aplica)
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.compromisoSeguimiento}
                    onChange={(e) => handleInputChange('compromisoSeguimiento', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                    Acepto el seguimiento post-adopción
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.permitirVisitas}
                    onChange={(e) => handleInputChange('permitirVisitas', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                    Permito visitas de verificación en mi domicilio
                  </span>
                </label>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', color: '#0f172a' }}>
                Referencias Personales
              </h4>
              {errors.referencias && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginBottom: '12px' }}>{errors.referencias}</p>
              )}
              
              {formData.referencias.map((ref, index) => (
                <div key={index} style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px'
                }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '12px', color: '#374151' }}>
                    Referencia {index + 1}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={ref.nombre}
                      onChange={(e) => handleReferenciaChange(index, 'nombre', e.target.value)}
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
                      placeholder="Relación"
                      value={ref.relacion}
                      onChange={(e) => handleReferenciaChange(index, 'relacion', e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                    <input
                      type="tel"
                      placeholder="Teléfono"
                      value={ref.telefono}
                      onChange={(e) => handleReferenciaChange(index, 'telefono', e.target.value)}
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
        )

      case 5:
        return (
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '20px', color: '#0f172a' }}>
              Documentación Requerida
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '24px' }}>
              Por favor suba los siguientes documentos en formato PDF, JPG o PNG
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                border: '2px dashed #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                backgroundColor: '#fafafa'
              }}>
                <Upload style={{ width: '48px', height: '48px', color: '#94a3b8', margin: '0 auto 12px' }} />
                <label style={{ display: 'block', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    Identificación Oficial
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleInputChange('identificacionOficial', e.target.files?.[0])}
                    style={{ display: 'none' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                    {formData.identificacionOficial?.name || 'Haga clic para seleccionar archivo'}
                  </p>
                </label>
              </div>

              <div style={{
                border: '2px dashed #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                backgroundColor: '#fafafa'
              }}>
                <Upload style={{ width: '48px', height: '48px', color: '#94a3b8', margin: '0 auto 12px' }} />
                <label style={{ display: 'block', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    Comprobante de Domicilio
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleInputChange('comprobanteDomicilio', e.target.files?.[0])}
                    style={{ display: 'none' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                    {formData.comprobanteDomicilio?.name || 'Haga clic para seleccionar archivo'}
                  </p>
                </label>
              </div>

              <div style={{
                border: '2px dashed #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                backgroundColor: '#fafafa'
              }}>
                <Upload style={{ width: '48px', height: '48px', color: '#94a3b8', margin: '0 auto 12px' }} />
                <label style={{ display: 'block', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    Comprobante de Ingresos
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleInputChange('comprobanteIngresos', e.target.files?.[0])}
                    style={{ display: 'none' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                    {formData.comprobanteIngresos?.name || 'Haga clic para seleccionar archivo'}
                  </p>
                </label>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '24px', color: '#0f172a' }}>
              Resumen de la Solicitud
            </h3>

            {/* Solicitante */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User style={{ width: '20px', height: '20px', color: '#7d2447' }} />
                Datos del Solicitante
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Nombre:</span>
                  <span style={{ color: '#0f172a', marginLeft: '8px', fontWeight: '500' }}>{formData.nombreCompleto}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Email:</span>
                  <span style={{ color: '#0f172a', marginLeft: '8px', fontWeight: '500' }}>{formData.email}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Teléfono:</span>
                  <span style={{ color: '#0f172a', marginLeft: '8px', fontWeight: '500' }}>{formData.telefono}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Dirección:</span>
                  <span style={{ color: '#0f172a', marginLeft: '8px', fontWeight: '500' }}>{formData.direccion}</span>
                </div>
              </div>
            </div>

            {/* Mascota Seleccionada */}
            {selectedMascota && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Dog style={{ width: '20px', height: '20px', color: '#7d2447' }} />
                  Mascota Seleccionada
                </h4>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <Image
                    src={selectedMascota.fotoPrincipal || '/placeholder-dog.jpg'}
                    alt={selectedMascota.nombre}
                    width={80}
                    height={80}
                    style={{
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 4px 0', color: '#0f172a' }}>
                      {selectedMascota.nombre}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                      {selectedMascota.codigo} • {selectedMascota.raza} • {selectedMascota.edad}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Información del Hogar */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Home style={{ width: '20px', height: '20px', color: '#7d2447' }} />
                Información del Hogar
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Tipo de vivienda:</span>
                  <span style={{ color: '#0f172a', marginLeft: '8px', fontWeight: '500' }}>{formData.tipoVivienda}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Tiene jardín:</span>
                  <span style={{ color: '#0f172a', marginLeft: '8px', fontWeight: '500' }}>{formData.tieneJardin ? 'Sí' : 'No'}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Personas en casa:</span>
                  <span style={{ color: '#0f172a', marginLeft: '8px', fontWeight: '500' }}>{formData.personasEnCasa}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Otras mascotas:</span>
                  <span style={{ color: '#0f172a', marginLeft: '8px', fontWeight: '500' }}>{formData.otrosMascotas ? 'Sí' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Compromisos */}
            <div style={{
              backgroundColor: '#f0fdf4',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #bbf7d0'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle style={{ width: '20px', height: '20px' }} />
                Compromisos Aceptados
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem', color: '#047857' }}>
                {formData.compromisoEsterilizacion && <li>Esterilización de la mascota</li>}
                {formData.compromisoSeguimiento && <li>Seguimiento post-adopción</li>}
                {formData.permitirVisitas && <li>Permitir visitas de verificación</li>}
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
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
          onClick={() => router.push('/admin/solicitudes')}
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
          Volver a Solicitudes
        </button>
        
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#0f172a',
          margin: '0 0 4px 0',
          fontFamily: 'Albert Sans, sans-serif'
        }}>Nueva Solicitud de Adopción</h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#64748b',
          margin: 0,
          fontFamily: 'Poppins, sans-serif'
        }}>Complete el formulario para registrar una nueva solicitud</p>
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
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          {/* Progress Line */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '40px',
            right: '40px',
            height: '2px',
            backgroundColor: '#e5e7eb',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '40px',
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            height: '2px',
            backgroundColor: '#7d2447',
            zIndex: 0,
            transition: 'width 0.3s ease'
          }} />

          {steps.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div
                key={step.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 1,
                  cursor: isCompleted ? 'pointer' : 'default'
                }}
                onClick={() => isCompleted && setCurrentStep(step.id)}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#7d2447' : isCompleted ? '#bfb591' : 'white',
                  border: isActive || isCompleted ? 'none' : '2px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                  transition: 'all 0.3s ease'
                }}>
                  <Icon style={{
                    width: '20px',
                    height: '20px',
                    color: isActive || isCompleted ? 'white' : '#94a3b8'
                  }} />
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? '#7d2447' : isCompleted ? '#bfb591' : '#94a3b8',
                  textAlign: 'center',
                  maxWidth: '80px'
                }}>
                  {step.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Form Content */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        minHeight: '400px'
      }}>
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: currentStep === 1 ? '#f3f4f6' : 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            color: currentStep === 1 ? '#94a3b8' : '#374151',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: currentStep === 1 ? 0.5 : 1
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Anterior
        </button>

        {currentStep < steps.length ? (
          <button
            onClick={handleNext}
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
              fontFamily: 'Albert Sans, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s'
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
            {loading ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        )}
      </div>
    </div>
  )
}