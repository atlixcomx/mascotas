'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Edit2, 
  Trash2, 
  Upload, 
  Calendar, 
  FileText, 
  Camera,
  Eye,
  EyeOff,
  Heart,
  AlertCircle,
  Stethoscope,
  History,
  X
} from 'lucide-react'

interface Perrito {
  id: string
  codigo: string
  nombre: string
  raza: string
  edad: string
  sexo: string
  tamano: string
  estado: string
  tipoIngreso: string
  fechaIngreso: string
  fotoPrincipal: string
  fotos: string
  historia: string
  peso?: number
  vacunas: boolean
  esterilizado: boolean
  desparasitado: boolean
  saludNotas?: string
  energia: string
  aptoNinos: boolean
  aptoPerros: boolean
  aptoGatos: boolean
  caracter: string
  destacado: boolean
  procedencia?: string
  responsableIngreso?: string
}

interface ExpedienteMedico {
  id: string
  tipo: string
  descripcion: string
  fecha: string
  veterinario?: string
  vacunaTipo?: string
  proximaDosis?: string
  medicamento?: string
  dosis?: string
  duracion?: string
  costo?: number
  notas?: string
}

interface NotaPerrito {
  id: string
  contenido: string
  autor: string
  tipo: string
  createdAt: string
}

interface CambioHistorial {
  id: string
  campo: string
  valorAnterior: string
  valorNuevo: string
  usuario: string
  fecha: string
}

// Helper function to safely parse photos field
function parsePhotosField(fotos: string | null): string[] {
  if (!fotos || fotos === '[]') return []
  
  try {
    const parsed = JSON.parse(fotos)
    return Array.isArray(parsed) ? parsed : [fotos]
  } catch (error) {
    // If it's not valid JSON, treat as single URL
    return [fotos]
  }
}

export default function EditPerrito() {
  const params = useParams()
  const router = useRouter()
  const perritoId = params.id as string

  const [perrito, setPerrito] = useState<Perrito | null>(null)
  const [expedienteMedico, setExpedienteMedico] = useState<ExpedienteMedico[]>([])
  const [notas, setNotas] = useState<NotaPerrito[]>([])
  const [historialCambios, setHistorialCambios] = useState<CambioHistorial[]>([])
  
  const [activeTab, setActiveTab] = useState('informacion')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Estados para modales
  const [showMedicalModal, setShowMedicalModal] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState(false)

  // Estados para formularios
  const [newMedical, setNewMedical] = useState({
    tipo: 'consulta',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    veterinario: '',
    vacunaTipo: '',
    proximaDosis: '',
    medicamento: '',
    dosis: '',
    duracion: '',
    costo: '',
    notas: ''
  })

  const [newNote, setNewNote] = useState({
    contenido: '',
    tipo: 'general'
  })

  const [newPhotos, setNewPhotos] = useState<string[]>([])

  useEffect(() => {
    fetchPerrito()
  }, [perritoId])

  async function fetchPerrito() {
    try {
      const response = await fetch(`/api/admin/perritos/${perritoId}`)
      if (response.ok) {
        const data = await response.json()
        setPerrito(data.perrito)
        setExpedienteMedico(data.expedienteMedico || [])
        setNotas(data.notas || [])
        setHistorialCambios(data.historialCambios || [])
      }
    } catch (error) {
      console.error('Error fetching perrito:', error)
    } finally {
      setLoading(false)
    }
  }

  async function savePerrito() {
    if (!perrito) return
    
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/perritos/${perritoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(perrito)
      })
      
      if (response.ok) {
        alert('Información actualizada correctamente')
        fetchPerrito() // Refresh data
      }
    } catch (error) {
      console.error('Error saving perrito:', error)
      alert('Error al guardar los cambios')
    } finally {
      setSaving(false)
    }
  }

  async function saveMedicalRecord() {
    try {
      const response = await fetch(`/api/admin/perritos/${perritoId}/medico`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMedical)
      })
      
      if (response.ok) {
        setShowMedicalModal(false)
        setNewMedical({
          tipo: 'consulta',
          descripcion: '',
          fecha: new Date().toISOString().split('T')[0],
          veterinario: '',
          vacunaTipo: '',
          proximaDosis: '',
          medicamento: '',
          dosis: '',
          duracion: '',
          costo: '',
          notas: ''
        })
        fetchPerrito()
      }
    } catch (error) {
      console.error('Error saving medical record:', error)
    }
  }

  async function saveNote() {
    try {
      const response = await fetch(`/api/admin/perritos/${perritoId}/notas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote)
      })
      
      if (response.ok) {
        setShowNoteModal(false)
        setNewNote({ contenido: '', tipo: 'general' })
        fetchPerrito()
      }
    } catch (error) {
      console.error('Error saving note:', error)
    }
  }

  async function deleteExpediente(id: string) {
    if (!confirm('¿Eliminar este registro médico?')) return
    
    try {
      const response = await fetch(`/api/admin/expediente/${id}`, { method: 'DELETE' })
      if (response.ok) fetchPerrito()
    } catch (error) {
      console.error('Error deleting medical record:', error)
    }
  }

  async function deleteNote(id: string) {
    if (!confirm('¿Eliminar esta nota?')) return
    
    try {
      const response = await fetch(`/api/admin/notas/${id}`, { method: 'DELETE' })
      if (response.ok) fetchPerrito()
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (perrito) {
      setPerrito({ ...perrito, [field]: value })
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const formData = new FormData()
    const file = files[0]
    formData.append('archivo', file)
    formData.append('tipo', 'galeria')
    formData.append('descripcion', '')

    try {
      const response = await fetch(`/api/admin/perritos/${perritoId}/fotos`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        await fetchPerrito()
        alert('Foto subida correctamente')
      } else {
        alert('Error al subir la foto')
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Error al subir la foto')
    }
  }

  const getEstadoColor = (estado: string) => {
    const colors = {
      disponible: '#16a34a',
      proceso: '#ca8a04',
      adoptado: '#6b7280',
      tratamiento: '#dc2626'
    }
    return colors[estado as keyof typeof colors] || '#6b7280'
  }

  if (loading) {
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

  if (!perrito) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <AlertCircle style={{ width: '48px', height: '48px', color: '#ef4444', margin: '0 auto 16px' }} />
        <h2 style={{ color: '#0f172a', marginBottom: '8px' }}>Mascota no encontrada</h2>
        <button 
          onClick={() => router.back()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#af1731',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Volver
        </button>
      </div>
    )
  }

  const tabs = [
    { id: 'informacion', label: 'Información General', icon: FileText },
    { id: 'medico', label: 'Historial Médico', icon: Stethoscope },
    { id: 'fotos', label: 'Galería de Fotos', icon: Camera },
    { id: 'notas', label: 'Notas y Observaciones', icon: Edit2 },
    { id: 'historial', label: 'Historial de Cambios', icon: History }
  ]

  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <button
          onClick={() => router.back()}
          style={{
            padding: '8px',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft style={{ width: '20px', height: '20px' }} />
        </button>

        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#0f172a',
            margin: 0,
            fontFamily: 'Albert Sans, sans-serif'
          }}>
            Editar: {perrito.nombre}
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            margin: '4px 0 0 0'
          }}>
            {perrito.codigo} • {perrito.raza} • {perrito.sexo}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            backgroundColor: getEstadoColor(perrito.estado),
            color: 'white',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '500'
          }}>
            {perrito.destacado && <Heart style={{ width: '14px', height: '14px' }} />}
            {perrito.estado}
          </div>

          <button
            onClick={savePerrito}
            disabled={saving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: '#af1731',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1
            }}
          >
            <Save style={{ width: '16px', height: '16px' }} />
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        overflowX: 'auto',
        paddingBottom: '8px'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: activeTab === tab.id ? '#af1731' : 'white',
                color: activeTab === tab.id ? 'white' : '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <Icon style={{ width: '16px', height: '16px' }} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        {activeTab === 'informacion' && (
          <div>
            <h3 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
              Información General
            </h3>
            
            {/* Basic Info */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Código
                </label>
                <input
                  type="text"
                  value={perrito.codigo}
                  onChange={(e) => handleInputChange('codigo', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Nombre
                </label>
                <input
                  type="text"
                  value={perrito.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Raza
                </label>
                <input
                  type="text"
                  value={perrito.raza}
                  onChange={(e) => handleInputChange('raza', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Edad
                </label>
                <input
                  type="text"
                  value={perrito.edad}
                  onChange={(e) => handleInputChange('edad', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Sexo
                </label>
                <select
                  value={perrito.sexo}
                  onChange={(e) => handleInputChange('sexo', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="macho">Macho</option>
                  <option value="hembra">Hembra</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Tamaño
                </label>
                <select
                  value={perrito.tamano}
                  onChange={(e) => handleInputChange('tamano', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="chico">Chico</option>
                  <option value="mediano">Mediano</option>
                  <option value="grande">Grande</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={perrito.peso || ''}
                  onChange={(e) => handleInputChange('peso', e.target.value ? parseFloat(e.target.value) : null)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Estado
                </label>
                <select
                  value={perrito.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="disponible">Disponible para Adopción</option>
                  <option value="proceso">En Proceso de Adopción</option>
                  <option value="adoptado">Adoptado</option>
                  <option value="tratamiento">En Tratamiento/Recuperación</option>
                </select>
              </div>
            </div>

            {/* Visibility Controls */}
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                Visibilidad en Catálogo
              </h4>
              
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={perrito.estado === 'disponible'}
                    onChange={(e) => handleInputChange('estado', e.target.checked ? 'disponible' : 'tratamiento')}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <Eye style={{ width: '16px', height: '16px', color: '#16a34a' }} />
                  Visible como "Disponible para Adopción"
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={perrito.destacado}
                    onChange={(e) => handleInputChange('destacado', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <Heart style={{ width: '16px', height: '16px', color: '#af1731' }} />
                  Destacar en página principal
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={perrito.estado === 'tratamiento'}
                    onChange={(e) => handleInputChange('estado', e.target.checked ? 'tratamiento' : 'disponible')}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <EyeOff style={{ width: '16px', height: '16px', color: '#dc2626' }} />
                  Mostrar como "En Recuperación"
                </label>
              </div>
            </div>

            {/* Health Status */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: '600' }}>
                Estado de Salud
              </h4>
              
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={perrito.vacunas}
                    onChange={(e) => handleInputChange('vacunas', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Vacunas completas
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={perrito.esterilizado}
                    onChange={(e) => handleInputChange('esterilizado', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Esterilizado/Castrado
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={perrito.desparasitado}
                    onChange={(e) => handleInputChange('desparasitado', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Desparasitado
                </label>
              </div>
            </div>

            {/* Temperament */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: '600' }}>
                Temperamento y Compatibilidad
              </h4>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    Nivel de Energía
                  </label>
                  <select
                    value={perrito.energia}
                    onChange={(e) => handleInputChange('energia', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={perrito.aptoNinos}
                    onChange={(e) => handleInputChange('aptoNinos', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Apto para niños
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={perrito.aptoPerros}
                    onChange={(e) => handleInputChange('aptoPerros', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Apto para otros perros
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={perrito.aptoGatos}
                    onChange={(e) => handleInputChange('aptoGatos', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Apto para gatos
                </label>
              </div>
            </div>

            {/* Historia */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500' }}>
                Historia
              </label>
              <textarea
                value={perrito.historia}
                onChange={(e) => handleInputChange('historia', e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.875rem',
                  resize: 'vertical'
                }}
                placeholder="Cuenta la historia de esta mascota..."
              />
            </div>
          </div>
        )}

        {activeTab === 'medico' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: '#111827' }}>
                Historial Médico
              </h3>
              <button
                onClick={() => setShowMedicalModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#af1731',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <Plus style={{ width: '16px', height: '16px' }} />
                Agregar Registro
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {expedienteMedico.map((record) => (
                <div key={record.id} style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '2px 8px',
                        backgroundColor: '#af1731',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {record.tipo}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        {new Date(record.fecha).toLocaleDateString('es-MX')}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteExpediente(record.id)}
                      style={{
                        padding: '4px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                  
                  <p style={{ margin: '8px 0', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {record.descripcion}
                  </p>
                  
                  {record.veterinario && (
                    <p style={{ margin: '4px 0', fontSize: '0.75rem', color: '#64748b' }}>
                      Veterinario: {record.veterinario}
                    </p>
                  )}
                  
                  {record.medicamento && (
                    <p style={{ margin: '4px 0', fontSize: '0.75rem', color: '#64748b' }}>
                      Medicamento: {record.medicamento} - {record.dosis}
                    </p>
                  )}
                  
                  {record.costo && (
                    <p style={{ margin: '4px 0', fontSize: '0.75rem', color: '#16a34a', fontWeight: '500' }}>
                      Costo: ${record.costo}
                    </p>
                  )}
                </div>
              ))}
              
              {expedienteMedico.length === 0 && (
                <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                  <Stethoscope style={{ width: '32px', height: '32px', margin: '0 auto 8px' }} />
                  <p>No hay registros médicos. Agrega el primer registro.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'fotos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: '#111827' }}>
                Galería de Fotos
              </h3>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#af1731',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <Upload style={{ width: '16px', height: '16px' }} />
                Subir Fotos
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Photo Gallery */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {/* Main Photo */}
              <div style={{ position: 'relative', gridColumn: 'span 2' }}>
                <Image
                  src={perrito.fotoPrincipal || '/placeholder-dog.jpg'}
                  alt={perrito.nombre}
                  width={400}
                  height={300}
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '3px solid #af1731'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  padding: '4px 8px',
                  backgroundColor: '#af1731',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  Foto Principal
                </div>
              </div>
              
              {/* Additional Photos */}
              {parsePhotosField(perrito.fotos).slice(0, 6).map((foto: string, index: number) => (
                <div key={index} style={{ position: 'relative' }}>
                  <Image
                    src={foto}
                    alt={`${perrito.nombre} ${index + 1}`}
                    width={200}
                    height={200}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notas' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: '#111827' }}>
                Notas y Observaciones
              </h3>
              <button
                onClick={() => setShowNoteModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#af1731',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <Plus style={{ width: '16px', height: '16px' }} />
                Agregar Nota
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notas.map((nota) => (
                <div key={nota.id} style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '2px 8px',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {nota.tipo}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {nota.autor} - {new Date(nota.createdAt).toLocaleDateString('es-MX')}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteNote(nota.id)}
                      style={{
                        padding: '4px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                  
                  <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {nota.contenido}
                  </p>
                </div>
              ))}
              
              {notas.length === 0 && (
                <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                  <FileText style={{ width: '32px', height: '32px', margin: '0 auto 8px' }} />
                  <p>No hay notas. Agrega la primera observación.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'historial' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '20px' }}>
              Historial de Cambios
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {historialCambios.map((cambio) => (
                <div key={cambio.id} style={{
                  padding: '12px 16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  borderLeft: '4px solid #af1731'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#0f172a' }}>
                      Campo: {cambio.campo}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {cambio.usuario} - {new Date(cambio.fecha).toLocaleString('es-MX')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    <span style={{ textDecoration: 'line-through', color: '#ef4444' }}>
                      {cambio.valorAnterior}
                    </span>
                    {' → '}
                    <span style={{ color: '#16a34a', fontWeight: '500' }}>
                      {cambio.valorNuevo}
                    </span>
                  </div>
                </div>
              ))}
              
              {historialCambios.length === 0 && (
                <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                  <History style={{ width: '32px', height: '32px', margin: '0 auto 8px' }} />
                  <p>No hay cambios registrados aún.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Medical Modal */}
      {showMedicalModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                Nuevo Registro Médico
              </h4>
              <button
                onClick={() => setShowMedicalModal(false)}
                style={{
                  padding: '4px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Tipo
                </label>
                <select
                  value={newMedical.tipo}
                  onChange={(e) => setNewMedical({ ...newMedical, tipo: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="consulta">Consulta</option>
                  <option value="vacuna">Vacuna</option>
                  <option value="cirugia">Cirugía</option>
                  <option value="tratamiento">Tratamiento</option>
                  <option value="desparasitacion">Desparasitación</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Fecha
                </label>
                <input
                  type="date"
                  value={newMedical.fecha}
                  onChange={(e) => setNewMedical({ ...newMedical, fecha: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Descripción
                </label>
                <textarea
                  value={newMedical.descripcion}
                  onChange={(e) => setNewMedical({ ...newMedical, descripcion: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Veterinario
                </label>
                <input
                  type="text"
                  value={newMedical.veterinario}
                  onChange={(e) => setNewMedical({ ...newMedical, veterinario: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Costo
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newMedical.costo}
                  onChange={(e) => setNewMedical({ ...newMedical, costo: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowMedicalModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={saveMedicalRecord}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#af1731',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Guardar Registro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                Nueva Nota
              </h4>
              <button
                onClick={() => setShowNoteModal(false)}
                style={{
                  padding: '4px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500' }}>
                Tipo de Nota
              </label>
              <select
                value={newNote.tipo}
                onChange={(e) => setNewNote({ ...newNote, tipo: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.875rem'
                }}
              >
                <option value="general">General</option>
                <option value="salud">Salud</option>
                <option value="comportamiento">Comportamiento</option>
                <option value="adopcion">Adopción</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500' }}>
                Contenido
              </label>
              <textarea
                value={newNote.contenido}
                onChange={(e) => setNewNote({ ...newNote, contenido: e.target.value })}
                rows={4}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.875rem',
                  resize: 'vertical'
                }}
                placeholder="Escribe tu observación aquí..."
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowNoteModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={saveNote}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#af1731',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Guardar Nota
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}