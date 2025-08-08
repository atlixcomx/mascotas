'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { 
  ChevronLeft,
  Dog,
  Calendar,
  MapPin,
  User,
  Heart,
  Syringe,
  FileText,
  Edit2,
  Save,
  X,
  Camera,
  Shield,
  Clock,
  Activity,
  AlertCircle,
  CheckCircle,
  Trash2
} from 'lucide-react'

interface PerritoDetalle {
  id: string
  codigo: string
  nombre: string
  raza: string
  edad: string
  sexo: string
  tamano: string
  peso?: number
  energia: string
  personalidad?: string
  descripcion?: string
  estado: string
  aptoNinos: boolean
  aptoPerros: boolean
  aptoGatos: boolean
  esterilizado: boolean
  vacunado: boolean
  tipoIngreso: string
  fechaIngreso: string
  responsableIngreso?: string
  fotoPrincipal?: string
  galeria?: string[]
  fotosInternas?: string[]
  fotosCatalogo?: string[]
  padecimientos?: string[]
  alergias?: string[]
  vacunas?: Array<{
    nombre: string
    fecha: string
    veterinario: string
  }>
  tratamientos?: Array<{
    descripcion: string
    fechaInicio: string
    fechaFin?: string
  }>
  createdAt: string
  updatedAt: string
  notas?: string
}

export default function PerritoDetalle() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  
  const [perrito, setPerrito] = useState<PerritoDetalle | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const [editedData, setEditedData] = useState<Partial<PerritoDetalle>>({})

  useEffect(() => {
    if (id) {
      fetchPerrito()
    }
  }, [id])

  async function fetchPerrito() {
    try {
      const response = await fetch(`/api/admin/perritos/${id}`)
      if (response.ok) {
        const data = await response.json()
        setPerrito(data)
        setEditedData(data)
      }
    } catch (error) {
      console.error('Error fetching perrito:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/perritos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData)
      })
      
      if (response.ok) {
        const updated = await response.json()
        setPerrito(updated)
        setEditMode(false)
      }
    } catch (error) {
      console.error('Error updating perrito:', error)
    }
  }

  const getEstadoStyle = (estado: string) => {
    const styles = {
      disponible: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', icon: CheckCircle },
      proceso: { bg: '#fefce8', color: '#a16207', border: '#fde68a', icon: Clock },
      adoptado: { bg: '#f3f4f6', color: '#374151', border: '#d1d5db', icon: Heart },
      tratamiento: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', icon: Syringe }
    }
    return styles[estado as keyof typeof styles] || styles.disponible
  }

  const tabs = [
    { id: 'info', name: 'Información General', icon: Dog },
    { id: 'salud', name: 'Historial Médico', icon: Heart },
    { id: 'fotos', name: 'Fotos', icon: Camera },
    { id: 'historial', name: 'Historial de Cambios', icon: Activity }
  ]

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #af1731',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    )
  }

  if (!perrito) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <AlertCircle style={{ width: '48px', height: '48px', color: '#ef4444', marginBottom: '16px' }} />
        <p style={{ fontSize: '1.125rem', color: '#0f172a' }}>Mascota no encontrada</p>
      </div>
    )
  }

  const estadoStyle = getEstadoStyle(perrito.estado)
  const StatusIcon = estadoStyle.icon

  return (
    <div style={{
      display: 'flex',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      width: '100%'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '320px',
        backgroundColor: 'white',
        borderRight: '1px solid #e2e8f0',
        padding: '24px',
        overflowY: 'auto',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}>
        <button
          onClick={() => router.back()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#475569',
            cursor: 'pointer',
            marginBottom: '24px',
            transition: 'all 0.2s',
            width: '100%',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
        >
          <ChevronLeft style={{ width: '16px', height: '16px' }} />
          Volver al listado
        </button>

        {/* Foto Principal */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Image
            src={perrito.fotoPrincipal || '/placeholder-dog.jpg'}
            alt={perrito.nombre}
            width={280}
            height={280}
            style={{
              borderRadius: '12px',
              objectFit: 'cover',
              marginBottom: '16px'
            }}
          />
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#0f172a',
            margin: '0 0 8px 0',
            fontFamily: 'Albert Sans, sans-serif'
          }}>{perrito.nombre}</h2>
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            margin: '0 0 12px 0',
            fontFamily: 'Poppins, sans-serif'
          }}>{perrito.codigo}</p>
          
          {/* Estado Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 16px',
            borderRadius: '20px',
            backgroundColor: estadoStyle.bg,
            color: estadoStyle.color,
            border: `1px solid ${estadoStyle.border}`,
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '24px'
          }}>
            <StatusIcon style={{ width: '16px', height: '16px' }} />
            {perrito.estado}
          </div>
        </div>

        {/* Info Rápida */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#0f172a',
            marginBottom: '12px',
            fontFamily: 'Albert Sans, sans-serif'
          }}>Información Rápida</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar style={{ width: '14px', height: '14px', color: '#64748b' }} />
              <span style={{ fontSize: '0.875rem', color: '#475569' }}>
                Ingreso: {new Date(perrito.fechaIngreso).toLocaleDateString('es-MX')}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User style={{ width: '14px', height: '14px', color: '#64748b' }} />
              <span style={{ fontSize: '0.875rem', color: '#475569' }}>
                {perrito.sexo} • {perrito.edad}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield style={{ width: '14px', height: '14px', color: '#64748b' }} />
              <span style={{ fontSize: '0.875rem', color: '#475569' }}>
                {perrito.raza}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin style={{ width: '14px', height: '14px', color: '#64748b' }} />
              <span style={{ fontSize: '0.875rem', color: '#475569' }}>
                {perrito.tipoIngreso.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {tabs.map(tab => {
            const TabIcon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: activeTab === tab.id ? '#fef2f2' : 'transparent',
                  color: activeTab === tab.id ? '#af1731' : '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  fontFamily: 'Poppins, sans-serif'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = '#f8fafc'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <TabIcon style={{ width: '18px', height: '18px' }} />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '24px',
        overflowY: 'auto'
      }}>
        {/* Header con acciones */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#0f172a',
            margin: 0,
            fontFamily: 'Albert Sans, sans-serif'
          }}>
            {tabs.find(t => t.id === activeTab)?.name}
          </h1>
          
          {activeTab === 'info' && (
            <div style={{ display: 'flex', gap: '12px' }}>
              {editMode ? (
                <>
                  <button
                    onClick={() => {
                      setEditMode(false)
                      setEditedData(perrito)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      color: '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <X style={{ width: '16px', height: '16px' }} />
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: '#15803d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#166534'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                  >
                    <Save style={{ width: '16px', height: '16px' }} />
                    Guardar Cambios
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: '#af1731',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7d2447'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#af1731'}
                >
                  <Edit2 style={{ width: '16px', height: '16px' }} />
                  Editar Información
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <div style={{ display: 'grid', gap: '24px' }}>
            {/* Datos Básicos */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '20px',
                fontFamily: 'Albert Sans, sans-serif'
              }}>Datos Básicos</h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
              }}>
                <InfoField
                  label="Raza"
                  value={perrito.raza}
                  editable={editMode}
                  onChange={(value) => setEditedData({...editedData, raza: value})}
                />
                <InfoField
                  label="Edad"
                  value={perrito.edad}
                  editable={editMode}
                  type="select"
                  options={[
                    { value: 'cachorro', label: 'Cachorro (0-1 año)' },
                    { value: 'joven', label: 'Joven (1-3 años)' },
                    { value: 'adulto', label: 'Adulto (3-7 años)' },
                    { value: 'senior', label: 'Senior (7+ años)' }
                  ]}
                  onChange={(value) => setEditedData({...editedData, edad: value})}
                />
                <InfoField
                  label="Sexo"
                  value={perrito.sexo}
                  editable={editMode}
                  type="select"
                  options={[
                    { value: 'macho', label: 'Macho' },
                    { value: 'hembra', label: 'Hembra' }
                  ]}
                  onChange={(value) => setEditedData({...editedData, sexo: value})}
                />
                <InfoField
                  label="Tamaño"
                  value={perrito.tamano}
                  editable={editMode}
                  type="select"
                  options={[
                    { value: 'pequeño', label: 'Pequeño' },
                    { value: 'mediano', label: 'Mediano' },
                    { value: 'grande', label: 'Grande' },
                    { value: 'gigante', label: 'Gigante' }
                  ]}
                  onChange={(value) => setEditedData({...editedData, tamano: value})}
                />
                <InfoField
                  label="Peso (kg)"
                  value={perrito.peso?.toString() || '-'}
                  editable={editMode}
                  type="number"
                  onChange={(value) => setEditedData({...editedData, peso: parseFloat(value)})}
                />
                <InfoField
                  label="Nivel de Energía"
                  value={perrito.energia}
                  editable={editMode}
                  type="select"
                  options={[
                    { value: 'baja', label: 'Baja' },
                    { value: 'media', label: 'Media' },
                    { value: 'alta', label: 'Alta' }
                  ]}
                  onChange={(value) => setEditedData({...editedData, energia: value})}
                />
              </div>

              {/* Descripción */}
              <div style={{ marginTop: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px',
                  fontFamily: 'Poppins, sans-serif'
                }}>Descripción</label>
                {editMode ? (
                  <textarea
                    value={editedData.descripcion || ''}
                    onChange={(e) => setEditedData({...editedData, descripcion: e.target.value})}
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.875rem',
                      fontFamily: 'Poppins, sans-serif',
                      outline: 'none',
                      transition: 'all 0.2s',
                      resize: 'vertical'
                    }}
                  />
                ) : (
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#475569',
                    lineHeight: '1.5'
                  }}>
                    {perrito.descripcion || 'Sin descripción'}
                  </p>
                )}
              </div>
            </div>

            {/* Compatibilidad */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '20px',
                fontFamily: 'Albert Sans, sans-serif'
              }}>Compatibilidad</h2>
              
              <div style={{ display: 'flex', gap: '24px' }}>
                <CompatibilityCheck
                  label="Apto para niños"
                  value={perrito.aptoNinos}
                  editable={editMode}
                  onChange={(value) => setEditedData({...editedData, aptoNinos: value})}
                />
                <CompatibilityCheck
                  label="Apto con perros"
                  value={perrito.aptoPerros}
                  editable={editMode}
                  onChange={(value) => setEditedData({...editedData, aptoPerros: value})}
                />
                <CompatibilityCheck
                  label="Apto con gatos"
                  value={perrito.aptoGatos}
                  editable={editMode}
                  onChange={(value) => setEditedData({...editedData, aptoGatos: value})}
                />
              </div>
            </div>

            {/* Información de Ingreso */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '20px',
                fontFamily: 'Albert Sans, sans-serif'
              }}>Información de Ingreso</h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
              }}>
                <InfoField
                  label="Tipo de Ingreso"
                  value={perrito.tipoIngreso.replace('_', ' ')}
                  editable={false}
                />
                <InfoField
                  label="Fecha de Ingreso"
                  value={new Date(perrito.fechaIngreso).toLocaleDateString('es-MX')}
                  editable={false}
                />
                <InfoField
                  label="Responsable"
                  value={perrito.responsableIngreso || '-'}
                  editable={false}
                />
                <InfoField
                  label="Días en el refugio"
                  value={Math.floor((Date.now() - new Date(perrito.fechaIngreso).getTime()) / (1000 * 60 * 60 * 24)).toString()}
                  editable={false}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'salud' && (
          <div style={{ display: 'grid', gap: '24px' }}>
            {/* Estado de Salud */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '20px',
                fontFamily: 'Albert Sans, sans-serif'
              }}>Estado de Salud</h2>
              
              <div style={{ display: 'flex', gap: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {perrito.esterilizado ? (
                    <CheckCircle style={{ width: '20px', height: '20px', color: '#15803d' }} />
                  ) : (
                    <X style={{ width: '20px', height: '20px', color: '#ef4444' }} />
                  )}
                  <span style={{ fontSize: '0.875rem', color: '#475569' }}>
                    {perrito.esterilizado ? 'Esterilizado' : 'No esterilizado'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {perrito.vacunado ? (
                    <CheckCircle style={{ width: '20px', height: '20px', color: '#15803d' }} />
                  ) : (
                    <X style={{ width: '20px', height: '20px', color: '#ef4444' }} />
                  )}
                  <span style={{ fontSize: '0.875rem', color: '#475569' }}>
                    {perrito.vacunado ? 'Vacunas al día' : 'Vacunas pendientes'}
                  </span>
                </div>
              </div>
            </div>

            {/* Padecimientos */}
            {perrito.padecimientos && perrito.padecimientos.length > 0 && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '20px',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>Padecimientos</h2>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {perrito.padecimientos.map((padecimiento, index) => (
                    <span key={index} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '6px 16px',
                      backgroundColor: '#fef2f2',
                      color: '#b91c1c',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      border: '1px solid #fecaca'
                    }}>
                      <AlertCircle style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                      {padecimiento}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Alergias */}
            {perrito.alergias && perrito.alergias.length > 0 && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '20px',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>Alergias</h2>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {perrito.alergias.map((alergia, index) => (
                    <span key={index} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '6px 16px',
                      backgroundColor: '#fff7ed',
                      color: '#c2410c',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      border: '1px solid #fed7aa'
                    }}>
                      {alergia}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Historial de Vacunas */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '20px',
                fontFamily: 'Albert Sans, sans-serif'
              }}>Historial de Vacunas</h2>
              
              {perrito.vacunas && perrito.vacunas.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {perrito.vacunas.map((vacuna, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Syringe style={{ width: '18px', height: '18px', color: '#15803d' }} />
                        <div>
                          <p style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#0f172a',
                            margin: '0 0 2px 0'
                          }}>{vacuna.nombre}</p>
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            margin: 0
                          }}>Dr. {vacuna.veterinario}</p>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#475569'
                      }}>
                        {new Date(vacuna.fecha).toLocaleDateString('es-MX')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  No hay vacunas registradas
                </p>
              )}
            </div>

            {/* Tratamientos Activos */}
            {perrito.tratamientos && perrito.tratamientos.length > 0 && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '20px',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>Tratamientos Activos</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {perrito.tratamientos.map((tratamiento, index) => (
                    <div key={index} style={{
                      padding: '16px',
                      backgroundColor: '#fef2f2',
                      borderRadius: '8px',
                      border: '1px solid #fecaca'
                    }}>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#0f172a',
                        marginBottom: '8px',
                        lineHeight: '1.5'
                      }}>{tratamiento.descripcion}</p>
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        fontSize: '0.75rem',
                        color: '#b91c1c'
                      }}>
                        <span>Inicio: {new Date(tratamiento.fechaInicio).toLocaleDateString('es-MX')}</span>
                        {tratamiento.fechaFin && (
                          <span>Fin: {new Date(tratamiento.fechaFin).toLocaleDateString('es-MX')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'fotos' && (
          <div style={{ display: 'grid', gap: '24px' }}>
            {/* Foto Principal */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '20px',
                fontFamily: 'Albert Sans, sans-serif'
              }}>Foto Principal</h2>
              
              {perrito.fotoPrincipal ? (
                <Image
                  src={perrito.fotoPrincipal}
                  alt="Foto principal"
                  width={400}
                  height={400}
                  style={{
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  height: '200px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Camera style={{ width: '48px', height: '48px', color: '#cbd5e1' }} />
                </div>
              )}
            </div>

            {/* Galería Pública */}
            {perrito.fotosCatalogo && perrito.fotosCatalogo.length > 0 && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '20px',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>Fotos del Catálogo</h2>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  {perrito.fotosCatalogo.map((foto, index) => (
                    <Image
                      key={index}
                      src={foto}
                      alt={`Foto catálogo ${index + 1}`}
                      width={200}
                      height={200}
                      style={{
                        borderRadius: '8px',
                        objectFit: 'cover',
                        width: '100%',
                        height: '200px'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Fotos Internas */}
            {perrito.fotosInternas && perrito.fotosInternas.length > 0 && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '20px',
                  fontFamily: 'Albert Sans, sans-serif'
                }}>Fotos de Uso Interno</h2>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  {perrito.fotosInternas.map((foto, index) => (
                    <Image
                      key={index}
                      src={foto}
                      alt={`Foto interna ${index + 1}`}
                      width={200}
                      height={200}
                      style={{
                        borderRadius: '8px',
                        objectFit: 'cover',
                        width: '100%',
                        height: '200px'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'historial' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#0f172a',
              marginBottom: '20px',
              fontFamily: 'Albert Sans, sans-serif'
            }}>Historial de Cambios</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px'
              }}>
                <Activity style={{ width: '18px', height: '18px', color: '#64748b' }} />
                <div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#0f172a',
                    margin: '0 0 2px 0'
                  }}>Mascota registrada en el sistema</p>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    margin: 0
                  }}>
                    {new Date(perrito.createdAt).toLocaleDateString('es-MX')} a las{' '}
                    {new Date(perrito.createdAt).toLocaleTimeString('es-MX')}
                  </p>
                </div>
              </div>
              
              {perrito.updatedAt !== perrito.createdAt && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <Edit2 style={{ width: '18px', height: '18px', color: '#64748b' }} />
                  <div>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      margin: '0 0 2px 0'
                    }}>Última actualización</p>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      margin: 0
                    }}>
                      {new Date(perrito.updatedAt).toLocaleDateString('es-MX')} a las{' '}
                      {new Date(perrito.updatedAt).toLocaleTimeString('es-MX')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
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

// Helper Components
function InfoField({ 
  label, 
  value, 
  editable, 
  type = 'text',
  options,
  onChange 
}: { 
  label: string
  value: string
  editable: boolean
  type?: 'text' | 'number' | 'select'
  options?: { value: string; label: string }[]
  onChange?: (value: string) => void
}) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '6px',
        fontFamily: 'Poppins, sans-serif'
      }}>{label}</label>
      {editable ? (
        type === 'select' ? (
          <select
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '0.875rem',
              fontFamily: 'Poppins, sans-serif',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '0.875rem',
              fontFamily: 'Poppins, sans-serif',
              outline: 'none'
            }}
          />
        )
      ) : (
        <p style={{
          fontSize: '0.875rem',
          color: '#475569',
          fontWeight: '600'
        }}>{value}</p>
      )}
    </div>
  )
}

function CompatibilityCheck({
  label,
  value,
  editable,
  onChange
}: {
  label: string
  value: boolean
  editable: boolean
  onChange?: (value: boolean) => void
}) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: editable ? 'pointer' : 'default'
    }}>
      {editable ? (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange?.(e.target.checked)}
        />
      ) : value ? (
        <CheckCircle style={{ width: '18px', height: '18px', color: '#15803d' }} />
      ) : (
        <X style={{ width: '18px', height: '18px', color: '#ef4444' }} />
      )}
      <span style={{
        fontSize: '0.875rem',
        color: '#475569'
      }}>{label}</span>
    </label>
  )
}