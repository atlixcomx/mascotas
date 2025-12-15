'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Calendar, Clock, Dog, User, FileText } from 'lucide-react'

interface Perrito {
  id: string
  nombre: string
  codigo: string
  fotoPrincipal: string
  adoptanteNombre?: string
  adoptanteTelefono?: string
}

export default function NuevaCitaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const perritoIdParam = searchParams.get('perritoId')

  const [loading, setLoading] = useState(false)
  const [perritos, setPerritos] = useState<Perrito[]>([])
  const [loadingPerritos, setLoadingPerritos] = useState(true)
  const [formData, setFormData] = useState({
    perritoId: perritoIdParam || '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '09:00',
    motivo: '',
    descripcion: '',
    veterinario: '',
    duenio: '',
    telefono: '',
    notas: ''
  })

  const motivosComunes = [
    'Vacunación',
    'Revisión general',
    'Desparasitación',
    'Esterilización',
    'Consulta',
    'Emergencia',
    'Seguimiento',
    'Cirugía',
    'Otro'
  ]

  useEffect(() => {
    fetchPerritos()
  }, [])

  useEffect(() => {
    if (formData.perritoId && perritos.length > 0) {
      const perrito = perritos.find(p => p.id === formData.perritoId)
      if (perrito) {
        setFormData(prev => ({
          ...prev,
          duenio: perrito.adoptanteNombre || prev.duenio,
          telefono: perrito.adoptanteTelefono || prev.telefono
        }))
      }
    }
  }, [formData.perritoId, perritos])

  const fetchPerritos = async () => {
    try {
      const response = await fetch('/api/admin/perritos?limit=100')
      if (response.ok) {
        const data = await response.json()
        setPerritos(data.perritos || [])
      }
    } catch (error) {
      console.error('Error fetching perritos:', error)
    } finally {
      setLoadingPerritos(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.perritoId || !formData.fecha || !formData.hora || !formData.motivo) {
      alert('Por favor completa los campos requeridos')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/admin/veterinario/calendario')
      } else {
        const data = await response.json()
        alert(data.error || 'Error al crear cita')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear cita')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500' as const,
    color: '#374151',
    marginBottom: '6px'
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          href="/admin/veterinario/calendario"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#64748b',
            textDecoration: 'none',
            fontSize: '14px',
            marginBottom: '12px'
          }}
        >
          <ArrowLeft size={18} />
          Volver al Calendario
        </Link>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
          Programar Nueva Cita
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {/* Seleccionar Perrito */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>
              <Dog size={14} style={{ display: 'inline', marginRight: '6px' }} />
              Mascota *
            </label>
            {loadingPerritos ? (
              <p style={{ color: '#64748b', fontSize: '14px' }}>Cargando mascotas...</p>
            ) : (
              <select
                value={formData.perritoId}
                onChange={(e) => setFormData({ ...formData, perritoId: e.target.value })}
                style={{ ...inputStyle, cursor: 'pointer' }}
                required
              >
                <option value="">Seleccionar mascota...</option>
                {perritos.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} ({p.codigo})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Fecha y Hora */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>
                <Calendar size={14} style={{ display: 'inline', marginRight: '6px' }} />
                Fecha *
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>
                <Clock size={14} style={{ display: 'inline', marginRight: '6px' }} />
                Hora *
              </label>
              <input
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                style={inputStyle}
                required
              />
            </div>
          </div>

          {/* Motivo */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>
              Motivo de la Cita *
            </label>
            <select
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              style={{ ...inputStyle, cursor: 'pointer' }}
              required
            >
              <option value="">Seleccionar motivo...</option>
              {motivosComunes.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Detalles adicionales de la cita..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Dueño y Teléfono */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>
                <User size={14} style={{ display: 'inline', marginRight: '6px' }} />
                Dueño / Responsable
              </label>
              <input
                type="text"
                value={formData.duenio}
                onChange={(e) => setFormData({ ...formData, duenio: e.target.value })}
                placeholder="Nombre del responsable"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>
                Teléfono de Contacto
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="Teléfono"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Veterinario */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>
              Veterinario Asignado
            </label>
            <input
              type="text"
              value={formData.veterinario}
              onChange={(e) => setFormData({ ...formData, veterinario: e.target.value })}
              placeholder="Nombre del veterinario"
              style={inputStyle}
            />
          </div>

          {/* Notas */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>
              <FileText size={14} style={{ display: 'inline', marginRight: '6px' }} />
              Notas Adicionales
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              placeholder="Notas o instrucciones especiales..."
              rows={2}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Link
              href="/admin/veterinario/calendario"
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                color: '#374151',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#0e312d',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              <Save size={18} />
              {loading ? 'Guardando...' : 'Programar Cita'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
