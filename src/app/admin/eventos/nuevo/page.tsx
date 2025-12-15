'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Calendar, MapPin, Clock, Users } from 'lucide-react'

export default function NuevoEventoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'feria_adopcion',
    descripcion: '',
    fecha: '',
    horaInicio: '09:00',
    horaFin: '17:00',
    lugar: 'Centro Municipal de Adopción y Bienestar Animal',
    direccion: 'Blvd. Niños Héroes #1003, Atlixco, Puebla'
  })

  const tiposEvento = [
    { value: 'feria_adopcion', label: 'Feria de Adopción' },
    { value: 'campana_esterilizacion', label: 'Campaña de Esterilización' },
    { value: 'jornada_vacunacion', label: 'Jornada de Vacunación' },
    { value: 'capacitacion', label: 'Capacitación' },
    { value: 'evento_comunitario', label: 'Evento Comunitario' },
    { value: 'otro', label: 'Otro' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre || !formData.fecha) {
      alert('Por favor completa los campos requeridos')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/admin/eventos')
      } else {
        const data = await response.json()
        alert(data.error || 'Error al crear evento')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear evento')
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
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px'
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          href="/admin/eventos"
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
          Volver a Eventos
        </Link>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
          Crear Nuevo Evento
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
          {/* Nombre */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>
              Nombre del Evento *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Feria de Adopción de Primavera"
              style={inputStyle}
              required
            />
          </div>

          {/* Tipo */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>
              Tipo de Evento
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {tiposEvento.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
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
              placeholder="Describe el evento, actividades, requisitos..."
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Fecha y Horario */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
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
                Hora Inicio
              </label>
              <input
                type="time"
                value={formData.horaInicio}
                onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>
                <Clock size={14} style={{ display: 'inline', marginRight: '6px' }} />
                Hora Fin
              </label>
              <input
                type="time"
                value={formData.horaFin}
                onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Ubicación */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>
                <MapPin size={14} style={{ display: 'inline', marginRight: '6px' }} />
                Lugar
              </label>
              <input
                type="text"
                value={formData.lugar}
                onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                placeholder="Nombre del lugar"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>
                Dirección
              </label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                placeholder="Dirección completa"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Link
              href="/admin/eventos"
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
                backgroundColor: '#7d2447',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              <Save size={18} />
              {loading ? 'Guardando...' : 'Crear Evento'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
