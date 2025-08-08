'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Dog, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Upload,
  X,
  Calendar,
  User,
  MapPin,
  Syringe,
  FileText,
  Check,
  AlertCircle,
  Camera,
  Heart,
  Shield,
  Trash2
} from 'lucide-react'

interface FormData {
  // Datos Básicos
  nombre: string
  raza: string
  edad: string
  sexo: string
  tamano: string
  peso: string
  energia: string
  personalidad: string
  descripcion: string
  aptoNinos: boolean
  aptoPerros: boolean
  aptoGatos: boolean
  
  // Ingreso
  tipoIngreso: string
  fechaIngreso: string
  responsableIngreso: string
  notasIngreso: string
  
  // Salud
  esterilizado: boolean
  vacunado: boolean
  padecimientos: string[]
  alergias: string[]
  vacunas: Array<{
    nombre: string
    fecha: string
    veterinario: string
  }>
  tratamientos: Array<{
    descripcion: string
    fechaInicio: string
    fechaFin?: string
  }>
}

export default function NuevoPerrito() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    raza: '',
    edad: '',
    sexo: '',
    tamano: '',
    peso: '',
    energia: 'media',
    personalidad: '',
    descripcion: '',
    aptoNinos: false,
    aptoPerros: false,
    aptoGatos: false,
    tipoIngreso: 'entrega_voluntaria',
    fechaIngreso: new Date().toISOString().split('T')[0],
    responsableIngreso: '',
    notasIngreso: '',
    esterilizado: false,
    vacunado: false,
    padecimientos: [],
    alergias: [],
    vacunas: [],
    tratamientos: []
  })
  
  const [fotosInternas, setFotosInternas] = useState<File[]>([])
  const [fotosCatalogo, setFotosCatalogo] = useState<File[]>([])
  const [fotoPrincipal, setFotoPrincipal] = useState<File | null>(null)

  const steps = [
    { id: 1, name: 'Datos Básicos', icon: Dog },
    { id: 2, name: 'Salud', icon: Heart },
    { id: 3, name: 'Fotos', icon: Camera },
    { id: 4, name: 'Revisión', icon: Check }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleArrayAdd = (field: 'padecimientos' | 'alergias', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }))
    }
  }

  const handleArrayRemove = (field: 'padecimientos' | 'alergias', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleVacunaAdd = () => {
    setFormData(prev => ({
      ...prev,
      vacunas: [...prev.vacunas, { nombre: '', fecha: '', veterinario: '' }]
    }))
  }

  const handleVacunaRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      vacunas: prev.vacunas.filter((_, i) => i !== index)
    }))
  }

  const handleTratamientoAdd = () => {
    setFormData(prev => ({
      ...prev,
      tratamientos: [...prev.tratamientos, { descripcion: '', fechaInicio: '' }]
    }))
  }

  const handleTratamientoRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tratamientos: prev.tratamientos.filter((_, i) => i !== index)
    }))
  }

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    type: 'principal' | 'internas' | 'catalogo'
  ) => {
    const files = Array.from(e.target.files || [])
    
    if (type === 'principal') {
      setFotoPrincipal(files[0] || null)
    } else if (type === 'internas') {
      setFotosInternas(prev => [...prev, ...files])
    } else {
      setFotosCatalogo(prev => [...prev, ...files])
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Preparar datos para enviar - coincidiendo con el esquema de validación Zod
      const dataToSend = {
        nombre: formData.nombre,
        raza: formData.raza,
        edad: formData.edad,
        sexo: formData.sexo,
        tamano: formData.tamano,
        peso: formData.peso ? parseFloat(formData.peso) : undefined,
        energia: formData.energia,
        historia: formData.descripcion || formData.notasIngreso || 'Perrito rescatado en busca de un hogar',
        tipoIngreso: formData.tipoIngreso,
        procedencia: formData.notasIngreso || undefined, // undefined en lugar de null
        responsableIngreso: formData.responsableIngreso || undefined, // undefined en lugar de null
        // Campos de salud booleanos
        vacunas: formData.vacunado,
        esterilizado: formData.esterilizado,
        desparasitado: true, // Default true
        saludNotas: '', // Se puede mejorar concatenando info de padecimientos/alergias
        // Arrays que espera el esquema
        padecimientos: formData.padecimientos,
        alergias: formData.alergias,
        vacunasDetalle: formData.vacunas,
        tratamientos: formData.tratamientos,
        // Temperamento
        aptoNinos: formData.aptoNinos,
        aptoPerros: formData.aptoPerros,
        aptoGatos: formData.aptoGatos,
        caracter: formData.personalidad ? [formData.personalidad] : [], // Array, no string
        // Fotos
        fotoPrincipal: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
        fotos: [], // Array, no string
        fotosInternas: [],
        fotosCatalogo: [],
        // Estado
        destacado: false,
        estado: 'disponible'
      }

      const response = await fetch('/api/admin/perritos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      })

      if (response.ok) {
        const newPerrito = await response.json()
        
        // Si hay fotos, subirlas
        if (fotoPrincipal || fotosInternas.length > 0 || fotosCatalogo.length > 0) {
          const formData = new FormData()
          
          if (fotoPrincipal) {
            formData.append('principal', fotoPrincipal)
          }
          
          fotosInternas.forEach(file => {
            formData.append('internas', file)
          })
          
          fotosCatalogo.forEach(file => {
            formData.append('catalogo', file)
          })
          
          await fetch(`/api/admin/perritos/${newPerrito.id}/fotos`, {
            method: 'POST',
            body: formData
          })
        }
        
        router.push('/admin/perritos')
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        alert(`Error al guardar: ${errorData.error || 'Error desconocido'}${errorData.details ? '\n\nDetalles: ' + JSON.stringify(errorData.details, null, 2) : ''}`)
      }
    } catch (error) {
      console.error('Error creating perrito:', error)
      alert('Error al guardar el perrito. Por favor revisa los datos e intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
            </div>
            
            <div>
              <label style={labelStyle}>Raza *</label>
              <input
                type="text"
                name="raza"
                value={formData.raza}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
            </div>
            
            <div>
              <label style={labelStyle}>Edad *</label>
              <select
                name="edad"
                value={formData.edad}
                onChange={handleInputChange}
                style={inputStyle}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="cachorro">Cachorro (0-1 año)</option>
                <option value="joven">Joven (1-3 años)</option>
                <option value="adulto">Adulto (3-7 años)</option>
                <option value="senior">Senior (7+ años)</option>
              </select>
            </div>
            
            <div>
              <label style={labelStyle}>Sexo *</label>
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleInputChange}
                style={inputStyle}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
            </div>
            
            <div>
              <label style={labelStyle}>Tamaño *</label>
              <select
                name="tamano"
                value={formData.tamano}
                onChange={handleInputChange}
                style={inputStyle}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="chico">Chico (0-10 kg)</option>
                <option value="mediano">Mediano (10-25 kg)</option>
                <option value="grande">Grande (25+ kg)</option>
              </select>
            </div>
            
            <div>
              <label style={labelStyle}>Peso (kg)</label>
              <input
                type="number"
                name="peso"
                value={formData.peso}
                onChange={handleInputChange}
                style={inputStyle}
                step="0.1"
              />
            </div>
            
            <div>
              <label style={labelStyle}>Nivel de Energía</label>
              <select
                name="energia"
                value={formData.energia}
                onChange={handleInputChange}
                style={inputStyle}
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
            
            <div>
              <label style={labelStyle}>Tipo de Ingreso *</label>
              <select
                name="tipoIngreso"
                value={formData.tipoIngreso}
                onChange={handleInputChange}
                style={inputStyle}
                required
              >
                <option value="entrega_voluntaria">Entrega Voluntaria</option>
                <option value="rescate">Rescate</option>
                <option value="decomiso">Decomiso</option>
              </select>
            </div>
            
            <div>
              <label style={labelStyle}>Fecha de Ingreso *</label>
              <input
                type="date"
                name="fechaIngreso"
                value={formData.fechaIngreso}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
            </div>
            
            <div>
              <label style={labelStyle}>Responsable de Ingreso</label>
              <input
                type="text"
                name="responsableIngreso"
                value={formData.responsableIngreso}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Personalidad</label>
              <textarea
                name="personalidad"
                value={formData.personalidad}
                onChange={handleInputChange}
                style={{ ...inputStyle, minHeight: '80px' }}
                placeholder="Describe el temperamento y personalidad..."
              />
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Descripción General</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                style={{ ...inputStyle, minHeight: '100px' }}
                placeholder="Historia, características especiales, necesidades..."
              />
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Compatibilidad</label>
              <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="aptoNinos"
                    checked={formData.aptoNinos}
                    onChange={handleInputChange}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#475569' }}>Apto para niños</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="aptoPerros"
                    checked={formData.aptoPerros}
                    onChange={handleInputChange}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#475569' }}>Apto con perros</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="aptoGatos"
                    checked={formData.aptoGatos}
                    onChange={handleInputChange}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#475569' }}>Apto con gatos</span>
                </label>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="esterilizado"
                  checked={formData.esterilizado}
                  onChange={handleInputChange}
                />
                <span style={{ fontSize: '0.875rem', color: '#475569' }}>Esterilizado</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="vacunado"
                  checked={formData.vacunado}
                  onChange={handleInputChange}
                />
                <span style={{ fontSize: '0.875rem', color: '#475569' }}>Vacunas al día</span>
              </label>
            </div>

            {/* Padecimientos */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Padecimientos</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="Agregar padecimiento..."
                  style={{ ...inputStyle, flex: 1 }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleArrayAdd('padecimientos', (e.target as HTMLInputElement).value)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.padecimientos.map((item, index) => (
                  <span key={index} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 12px',
                    backgroundColor: '#fef2f2',
                    color: '#b91c1c',
                    borderRadius: '20px',
                    fontSize: '0.875rem'
                  }}>
                    {item}
                    <button
                      onClick={() => handleArrayRemove('padecimientos', index)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <X style={{ width: '14px', height: '14px' }} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Alergias */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Alergias</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="Agregar alergia..."
                  style={{ ...inputStyle, flex: 1 }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleArrayAdd('alergias', (e.target as HTMLInputElement).value)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.alergias.map((item, index) => (
                  <span key={index} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 12px',
                    backgroundColor: '#fff7ed',
                    color: '#c2410c',
                    borderRadius: '20px',
                    fontSize: '0.875rem'
                  }}>
                    {item}
                    <button
                      onClick={() => handleArrayRemove('alergias', index)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <X style={{ width: '14px', height: '14px' }} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Vacunas */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={labelStyle}>Historial de Vacunas</label>
                <button
                  onClick={handleVacunaAdd}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f0fdf4',
                    color: '#15803d',
                    border: '1px solid #bbf7d0',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  + Agregar Vacuna
                </button>
              </div>
              {formData.vacunas.map((vacuna, index) => (
                <div key={index} style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr auto',
                  gap: '8px',
                  marginBottom: '8px',
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <input
                    type="text"
                    placeholder="Nombre de la vacuna"
                    value={vacuna.nombre}
                    onChange={(e) => {
                      const newVacunas = [...formData.vacunas]
                      newVacunas[index].nombre = e.target.value
                      setFormData(prev => ({ ...prev, vacunas: newVacunas }))
                    }}
                    style={inputStyle}
                  />
                  <input
                    type="date"
                    value={vacuna.fecha}
                    onChange={(e) => {
                      const newVacunas = [...formData.vacunas]
                      newVacunas[index].fecha = e.target.value
                      setFormData(prev => ({ ...prev, vacunas: newVacunas }))
                    }}
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    placeholder="Veterinario"
                    value={vacuna.veterinario}
                    onChange={(e) => {
                      const newVacunas = [...formData.vacunas]
                      newVacunas[index].veterinario = e.target.value
                      setFormData(prev => ({ ...prev, vacunas: newVacunas }))
                    }}
                    style={inputStyle}
                  />
                  <button
                    onClick={() => handleVacunaRemove(index)}
                    style={{
                      padding: '6px',
                      backgroundColor: '#fef2f2',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                  </button>
                </div>
              ))}
            </div>

            {/* Tratamientos */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={labelStyle}>Tratamientos Activos</label>
                <button
                  onClick={handleTratamientoAdd}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#fef2f2',
                    color: '#b91c1c',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  + Agregar Tratamiento
                </button>
              </div>
              {formData.tratamientos.map((tratamiento, index) => (
                <div key={index} style={{
                  marginBottom: '12px',
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', marginBottom: '8px' }}>
                    <textarea
                      placeholder="Descripción del tratamiento"
                      value={tratamiento.descripcion}
                      onChange={(e) => {
                        const newTratamientos = [...formData.tratamientos]
                        newTratamientos[index].descripcion = e.target.value
                        setFormData(prev => ({ ...prev, tratamientos: newTratamientos }))
                      }}
                      style={{ ...inputStyle, minHeight: '60px' }}
                    />
                    <button
                      onClick={() => handleTratamientoRemove(index)}
                      style={{
                        padding: '6px',
                        backgroundColor: '#fef2f2',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        height: 'fit-content'
                      }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Fecha Inicio</label>
                      <input
                        type="date"
                        value={tratamiento.fechaInicio}
                        onChange={(e) => {
                          const newTratamientos = [...formData.tratamientos]
                          newTratamientos[index].fechaInicio = e.target.value
                          setFormData(prev => ({ ...prev, tratamientos: newTratamientos }))
                        }}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Fecha Fin (opcional)</label>
                      <input
                        type="date"
                        value={tratamiento.fechaFin || ''}
                        onChange={(e) => {
                          const newTratamientos = [...formData.tratamientos]
                          newTratamientos[index].fechaFin = e.target.value
                          setFormData(prev => ({ ...prev, tratamientos: newTratamientos }))
                        }}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div>
            {/* Foto Principal */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>
                Foto Principal (Catálogo)
              </h3>
              <div style={{
                border: '2px dashed #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                backgroundColor: fotoPrincipal ? '#f8fafc' : 'white'
              }}>
                {fotoPrincipal ? (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={URL.createObjectURL(fotoPrincipal)}
                      alt="Foto principal"
                      style={{
                        maxWidth: '300px',
                        maxHeight: '300px',
                        borderRadius: '8px',
                        objectFit: 'cover'
                      }}
                    />
                    <button
                      onClick={() => setFotoPrincipal(null)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        padding: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <X style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Camera style={{ width: '48px', height: '48px', color: '#cbd5e1', margin: '0 auto 12px' }} />
                    <p style={{ color: '#64748b', marginBottom: '12px' }}>
                      Arrastra o selecciona la foto principal
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'principal')}
                      style={{ display: 'none' }}
                      id="foto-principal"
                    />
                    <label
                      htmlFor="foto-principal"
                      style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        backgroundColor: '#af1731',
                        color: 'white',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}
                    >
                      Seleccionar Foto
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Fotos para Catálogo */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>
                Fotos para Catálogo Público
              </h3>
              <div style={{
                border: '2px dashed #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
                backgroundColor: '#f8fafc'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                  {fotosCatalogo.map((file, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Foto catálogo ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                      <button
                        onClick={() => setFotosCatalogo(prev => prev.filter((_, i) => i !== index))}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          padding: '4px',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <X style={{ width: '14px', height: '14px', color: '#ef4444' }} />
                      </button>
                    </div>
                  ))}
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '150px',
                    border: '2px dashed #cbd5e1',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: 'white'
                  }}>
                    <Upload style={{ width: '24px', height: '24px', color: '#94a3b8', marginBottom: '4px' }} />
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Agregar fotos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload(e, 'catalogo')}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Fotos Internas */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>
                Fotos de Uso Interno
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '12px' }}>
                Fotos médicas, de seguimiento o documentación interna
              </p>
              <div style={{
                border: '2px dashed #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
                backgroundColor: '#f8fafc'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                  {fotosInternas.map((file, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Foto interna ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                      <button
                        onClick={() => setFotosInternas(prev => prev.filter((_, i) => i !== index))}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          padding: '4px',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <X style={{ width: '14px', height: '14px', color: '#ef4444' }} />
                      </button>
                    </div>
                  ))}
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '150px',
                    border: '2px dashed #cbd5e1',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: 'white'
                  }}>
                    <Upload style={{ width: '24px', height: '24px', color: '#94a3b8', marginBottom: '4px' }} />
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Agregar fotos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload(e, 'internas')}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div>
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Check style={{ width: '24px', height: '24px', color: '#15803d' }} />
              <div>
                <p style={{ fontWeight: '600', color: '#15803d', marginBottom: '4px' }}>
                  Revisa la información antes de guardar
                </p>
                <p style={{ fontSize: '0.875rem', color: '#166534' }}>
                  Se generará automáticamente el código: ATL-{new Date().getFullYear()}-XXX
                </p>
              </div>
            </div>

            {/* Resumen de Datos */}
            <div style={{ display: 'grid', gap: '24px' }}>
              {/* Datos Básicos */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
                  Datos Básicos
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Nombre</p>
                    <p style={{ fontWeight: '600', color: '#0f172a' }}>{formData.nombre || '-'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Raza</p>
                    <p style={{ fontWeight: '600', color: '#0f172a' }}>{formData.raza || '-'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Edad</p>
                    <p style={{ fontWeight: '600', color: '#0f172a' }}>{formData.edad || '-'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Sexo</p>
                    <p style={{ fontWeight: '600', color: '#0f172a' }}>{formData.sexo || '-'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Tamaño</p>
                    <p style={{ fontWeight: '600', color: '#0f172a' }}>{formData.tamano || '-'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Tipo de Ingreso</p>
                    <p style={{ fontWeight: '600', color: '#0f172a' }}>{formData.tipoIngreso.replace('_', ' ') || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Información de Salud */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
                  Información de Salud
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {formData.esterilizado ? (
                        <Check style={{ width: '16px', height: '16px', color: '#15803d' }} />
                      ) : (
                        <X style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                      )}
                      <span>Esterilizado</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {formData.vacunado ? (
                        <Check style={{ width: '16px', height: '16px', color: '#15803d' }} />
                      ) : (
                        <X style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                      )}
                      <span>Vacunado</span>
                    </div>
                  </div>
                  
                  {formData.padecimientos.length > 0 && (
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>Padecimientos:</p>
                      <p>{formData.padecimientos.join(', ')}</p>
                    </div>
                  )}
                  
                  {formData.alergias.length > 0 && (
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>Alergias:</p>
                      <p>{formData.alergias.join(', ')}</p>
                    </div>
                  )}
                  
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>
                      Vacunas registradas: {formData.vacunas.length}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      Tratamientos activos: {formData.tratamientos.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fotos */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
                  Fotos Cargadas
                </h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <p style={{ fontSize: '0.875rem' }}>
                    • Foto principal: {fotoPrincipal ? '✓ Cargada' : '✗ Sin cargar'}
                  </p>
                  <p style={{ fontSize: '0.875rem' }}>
                    • Fotos para catálogo: {fotosCatalogo.length} archivo(s)
                  </p>
                  <p style={{ fontSize: '0.875rem' }}>
                    • Fotos internas: {fotosInternas.length} archivo(s)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px',
    fontFamily: 'Poppins, sans-serif'
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '0.875rem',
    fontFamily: 'Poppins, sans-serif',
    outline: 'none',
    transition: 'all 0.2s'
  }

  return (
    <div style={{
      padding: '16px',
      width: '100%',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => router.back()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#475569',
            cursor: 'pointer',
            marginBottom: '16px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
        >
          <ChevronLeft style={{ width: '16px', height: '16px' }} />
          Volver
        </button>
        
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#0f172a',
          margin: '0 0 4px 0',
          fontFamily: 'Albert Sans, sans-serif'
        }}>Registrar Nueva Mascota</h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#64748b',
          margin: 0,
          fontFamily: 'Poppins, sans-serif'
        }}>Complete todos los campos requeridos para agregar una nueva mascota al sistema</p>
      </div>

      {/* Steps */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          {/* Progress Line */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '10%',
            right: '10%',
            height: '2px',
            backgroundColor: '#e2e8f0',
            zIndex: 0
          }}>
            <div style={{
              height: '100%',
              backgroundColor: '#af1731',
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
          
          {steps.map((step) => {
            const StepIcon = step.icon
            const isActive = step.id === currentStep
            const isCompleted = step.id < currentStep
            
            return (
              <div
                key={step.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 1,
                  cursor: isCompleted ? 'pointer' : 'default'
                }}
                onClick={() => isCompleted && setCurrentStep(step.id)}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#af1731' : isCompleted ? '#7d2447' : '#f3f4f6',
                  color: isActive || isCompleted ? 'white' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                  transition: 'all 0.2s'
                }}>
                  <StepIcon style={{ width: '20px', height: '20px' }} />
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? '#0f172a' : '#64748b',
                  fontFamily: 'Poppins, sans-serif'
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
        {renderStep()}
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <button
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: currentStep === 1 ? '#cbd5e1' : '#475569',
            cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: currentStep === 1 ? 0.5 : 1
          }}
        >
          <ChevronLeft style={{ width: '16px', height: '16px' }} />
          Anterior
        </button>
        
        {currentStep < steps.length ? (
          <button
            onClick={() => setCurrentStep(prev => prev + 1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#af1731',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              fontFamily: 'Albert Sans, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7d2447'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#af1731'}
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
              padding: '10px 24px',
              backgroundColor: loading ? '#94a3b8' : '#15803d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              fontFamily: 'Albert Sans, sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#166534')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#15803d')}
          >
            <Save style={{ width: '16px', height: '16px' }} />
            {loading ? 'Guardando...' : 'Guardar Mascota'}
          </button>
        )}
      </div>
    </div>
  )
}