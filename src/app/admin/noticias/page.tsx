'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Newspaper, Plus, Search, Filter, Edit, Trash2, Eye, EyeOff,
  Calendar, Tag, MapPin, Users, Clock, ChevronLeft, Image,
  Save, X, AlertCircle, CheckCircle, TrendingUp, Upload
} from 'lucide-react'
import { NewsImageUploader } from '../../../components/admin/NewsImageUploader'

interface Noticia {
  id: string
  titulo: string
  resumen: string
  contenido: string
  imagen: string
  categoria: string
  ubicacion?: string
  hora?: string
  aforo?: number
  autor?: string
  publicada: boolean
  destacada: boolean
  vistas: number
  createdAt: string
  updatedAt: string
}

const categoriasColores = {
  evento: { bg: '#dc2626', text: 'Evento' },
  adopcion: { bg: '#16a34a', text: 'Adopción' },
  salud: { bg: '#0891b2', text: 'Salud' },
  general: { bg: '#6b7280', text: 'General' }
}

export default function AdminNoticiasPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategoria, setFilterCategoria] = useState('todas')
  const [showForm, setShowForm] = useState(false)
  const [editingNoticia, setEditingNoticia] = useState<Noticia | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    resumen: '',
    contenido: '',
    imagen: '',
    categoria: 'general',
    ubicacion: '',
    hora: '',
    aforo: '',
    publicada: true,
    destacada: false
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchNoticias()
    }
  }, [status, router])

  const fetchNoticias = async () => {
    try {
      const response = await fetch('/api/admin/noticias')
      if (response.ok) {
        const data = await response.json()
        setNoticias(data.noticias || [])
      }
    } catch (error) {
      console.error('Error fetching noticias:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const url = editingNoticia 
        ? `/api/admin/noticias/${editingNoticia.id}`
        : '/api/admin/noticias'
      
      const method = editingNoticia ? 'PUT' : 'POST'
      
      const dataToSend = {
        ...formData,
        aforo: formData.aforo ? parseInt(formData.aforo) : null,
        autor: session?.user?.name || 'Admin'
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      })

      if (response.ok) {
        setMessage({
          type: 'success',
          text: editingNoticia ? 'Noticia actualizada exitosamente' : 'Noticia creada exitosamente'
        })
        resetForm()
        fetchNoticias()
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('Error al guardar la noticia')
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al guardar la noticia'
      })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (noticia: Noticia) => {
    setEditingNoticia(noticia)
    setFormData({
      titulo: noticia.titulo,
      resumen: noticia.resumen,
      contenido: noticia.contenido,
      imagen: noticia.imagen,
      categoria: noticia.categoria,
      ubicacion: noticia.ubicacion || '',
      hora: noticia.hora || '',
      aforo: noticia.aforo?.toString() || '',
      publicada: noticia.publicada,
      destacada: noticia.destacada
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta noticia?')) return

    try {
      const response = await fetch(`/api/admin/noticias/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Noticia eliminada exitosamente'
        })
        fetchNoticias()
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al eliminar la noticia'
      })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const togglePublicada = async (noticia: Noticia) => {
    try {
      const response = await fetch(`/api/admin/noticias/${noticia.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicada: !noticia.publicada })
      })

      if (response.ok) {
        fetchNoticias()
      }
    } catch (error) {
      console.error('Error toggling publicada:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      titulo: '',
      resumen: '',
      contenido: '',
      imagen: '',
      categoria: 'general',
      ubicacion: '',
      hora: '',
      aforo: '',
      publicada: true,
      destacada: false
    })
    setEditingNoticia(null)
    setShowForm(false)
  }

  const filteredNoticias = noticias.filter(noticia => {
    const matchesSearch = noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          noticia.resumen.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = filterCategoria === 'todas' || noticia.categoria === filterCategoria
    return matchesSearch && matchesCategoria
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Cargando noticias...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link href="/admin" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}>
                <ChevronLeft size={20} />
              </Link>
              <div>
                <h1 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#111827',
                  margin: 0
                }}>
                  Gestión de Noticias
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '4px 0 0'
                }}>
                  Administra las noticias y eventos del centro
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowForm(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#16a34a',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Plus size={20} />
              Nueva Noticia
            </button>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      {message && (
        <div style={{
          padding: '16px',
          margin: '20px auto',
          maxWidth: '1200px',
          backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: message.type === 'success' ? '#16a34a' : '#dc2626',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#111827'
              }}>
                {editingNoticia ? 'Editar Noticia' : 'Nueva Noticia'}
              </h2>
              <button
                onClick={resetForm}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Título */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px'
                  }}
                />
              </div>

              {/* Resumen */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Resumen * (máximo 200 caracteres)
                </label>
                <textarea
                  value={formData.resumen}
                  onChange={(e) => setFormData({ ...formData, resumen: e.target.value })}
                  required
                  maxLength={200}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginTop: '4px'
                }}>
                  {formData.resumen.length}/200 caracteres
                </p>
              </div>

              {/* Contenido */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Contenido completo *
                </label>
                <textarea
                  value={formData.contenido}
                  onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                  required
                  rows={10}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Imagen */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Imagen de la noticia *
                </label>
                
                {/* Opción 1: Subir imagen con UploadThing */}
                <div style={{
                  marginBottom: '16px',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Upload size={16} />
                    Subir nueva imagen
                  </p>
                  <NewsImageUploader 
                    onImageUploaded={(url) => setFormData({ ...formData, imagen: url })}
                    onError={(error) => {
                      setMessage({
                        type: 'error',
                        text: `Error al subir imagen: ${error}`
                      })
                      setTimeout(() => setMessage(null), 5000)
                    }}
                    currentImage={formData.imagen}
                  />
                </div>

                {/* Opción 2: URL directa */}
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '8px'
                  }}>
                    O usar URL de imagen existente:
                  </p>
                  <input
                    type="text"
                    value={formData.imagen}
                    onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                    placeholder="/images/centro/foto1.jpeg o https://..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  />
                </div>

                {/* Vista previa */}
                {formData.imagen && (
                  <div style={{ marginTop: '16px' }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Vista previa:
                    </p>
                    <div style={{
                      height: '200px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <img
                        src={formData.imagen}
                        alt="Vista previa"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imagen: '' })}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Eliminar imagen"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Grid de 2 columnas */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px',
                marginBottom: '20px'
              }}>
                {/* Categoría */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Categoría *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '16px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="general">General</option>
                    <option value="evento">Evento</option>
                    <option value="adopcion">Adopción</option>
                    <option value="salud">Salud</option>
                  </select>
                </div>

                {/* Ubicación (opcional) */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Ubicación (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                    placeholder="Centro Municipal de Adopción"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '16px'
                    }}
                  />
                </div>

                {/* Hora (opcional) */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Hora (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.hora}
                    onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                    placeholder="10:00 - 17:00"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '16px'
                    }}
                  />
                </div>

                {/* Aforo (opcional) */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Aforo (opcional)
                  </label>
                  <input
                    type="number"
                    value={formData.aforo}
                    onChange={(e) => setFormData({ ...formData, aforo: e.target.value })}
                    placeholder="100"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div style={{
                display: 'flex',
                gap: '24px',
                marginBottom: '24px'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.publicada}
                    onChange={(e) => setFormData({ ...formData, publicada: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '14px', color: '#374151' }}>Publicar inmediatamente</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.destacada}
                    onChange={(e) => setFormData({ ...formData, destacada: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '14px', color: '#374151' }}>Noticia destacada</span>
                </label>
              </div>

              {/* Botones */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1
                  }}
                >
                  <Save size={20} />
                  {saving ? 'Guardando...' : (editingNoticia ? 'Actualizar' : 'Crear Noticia')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div style={{
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            flex: '1',
            minWidth: '200px',
            position: 'relative'
          }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280'
            }} size={20} />
            <input
              type="text"
              placeholder="Buscar noticias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '16px'
              }}
            />
          </div>

          <select
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '16px',
              backgroundColor: 'white'
            }}
          >
            <option value="todas">Todas las categorías</option>
            <option value="general">General</option>
            <option value="evento">Evento</option>
            <option value="adopcion">Adopción</option>
            <option value="salud">Salud</option>
          </select>
        </div>
      </div>

      {/* Lista de noticias */}
      <div style={{
        padding: '0 20px 40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {filteredNoticias.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '60px',
            textAlign: 'center'
          }}>
            <Newspaper size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
            <h3 style={{ color: '#374151', marginBottom: '8px' }}>No hay noticias</h3>
            <p style={{ color: '#6b7280' }}>Crea tu primera noticia para comenzar</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            {filteredNoticias.map((noticia) => (
              <div
                key={noticia.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center'
                }}
              >
                {/* Imagen */}
                <div style={{
                  width: '120px',
                  height: '120px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  <img
                    src={noticia.imagen}
                    alt={noticia.titulo}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>

                {/* Contenido */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#111827',
                        marginBottom: '4px'
                      }}>
                        {noticia.titulo}
                        {noticia.destacada && (
                          <span style={{
                            marginLeft: '8px',
                            padding: '2px 8px',
                            backgroundColor: '#fef3c7',
                            color: '#f59e0b',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            DESTACADA
                          </span>
                        )}
                      </h3>
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: categoriasColores[noticia.categoria as keyof typeof categoriasColores]?.bg || '#6b7280',
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {categoriasColores[noticia.categoria as keyof typeof categoriasColores]?.text || noticia.categoria}
                        </span>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                          <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                          {formatDate(noticia.createdAt)}
                        </span>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                          <Eye size={14} style={{ display: 'inline', marginRight: '4px' }} />
                          {noticia.vistas} vistas
                        </span>
                      </div>
                    </div>
                  </div>

                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '12px',
                    lineHeight: '1.5'
                  }}>
                    {noticia.resumen}
                  </p>

                  {/* Acciones */}
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <button
                      onClick={() => togglePublicada(noticia)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        backgroundColor: noticia.publicada ? '#dcfce7' : '#fee2e2',
                        color: noticia.publicada ? '#16a34a' : '#dc2626',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {noticia.publicada ? <Eye size={16} /> : <EyeOff size={16} />}
                      {noticia.publicada ? 'Publicada' : 'Oculta'}
                    </button>

                    <Link
                      href={`/noticias/${noticia.id}`}
                      target="_blank"
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        backgroundColor: 'white',
                        color: '#374151',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Eye size={16} />
                      Ver
                    </Link>

                    <button
                      onClick={() => handleEdit(noticia)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        backgroundColor: 'white',
                        color: '#374151',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Edit size={16} />
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(noticia.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #fee2e2',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}