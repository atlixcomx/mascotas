'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Save, Search, Calendar, Clock,
  Stethoscope, Syringe, Heart, Shield, 
  FileText, AlertCircle, CheckCircle, Dog
} from 'lucide-react'
import styles from '../veterinario.module.css'

interface Mascota {
  id: string
  nombre: string
  codigo: string
  fotoPrincipal: string
  edad: string
  sexo: string
  tamano: string
  raza: string
  vacunas: boolean
  esterilizado: boolean
  desparasitado: boolean
  historia?: string
}

export default function NuevaConsultaPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const mascotaIdParam = searchParams.get('mascotaId')
  
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(!mascotaIdParam)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5),
    motivo: '',
    sintomas: '',
    temperatura: '',
    peso: '',
    diagnostico: '',
    tratamiento: '',
    medicamentos: '',
    vacunas: false,
    esterilizado: false,
    desparasitado: false,
    proximaCita: '',
    observaciones: '',
    estadoGeneral: 'estable'
  })

  useEffect(() => {
    fetchMascotas()
  }, [])

  useEffect(() => {
    if (mascotaIdParam && mascotas.length > 0) {
      const mascota = mascotas.find(m => m.id === mascotaIdParam)
      if (mascota) {
        setSelectedMascota(mascota)
        setFormData(prev => ({
          ...prev,
          vacunas: mascota.vacunas,
          esterilizado: mascota.esterilizado,
          desparasitado: mascota.desparasitado
        }))
      }
    }
  }, [mascotaIdParam, mascotas])

  const fetchMascotas = async () => {
    try {
      const response = await fetch('/api/admin/perritos')
      if (response.ok) {
        const data = await response.json()
        setMascotas(data.perritos || [])
      }
    } catch (error) {
      console.error('Error fetching mascotas:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedMascota) {
      alert('Por favor selecciona una mascota')
      return
    }

    if (!formData.motivo || !formData.diagnostico) {
      alert('Por favor completa el motivo y diagnóstico')
      return
    }

    setLoading(true)

    try {
      // Mapear motivo a tipo de expediente
      const tipoExpediente = {
        'revision_general': 'consulta',
        'vacunacion': 'vacuna',
        'esterilizacion': 'cirugia',
        'desparasitacion': 'desparasitacion',
        'enfermedad': 'consulta',
        'lesion': 'consulta',
        'cirugia': 'cirugia',
        'emergencia': 'emergencia',
        'seguimiento': 'consulta',
        'otro': 'consulta'
      }[formData.motivo] || 'consulta'

      // Crear descripción completa
      const descripcionCompleta = [
        `Motivo: ${formData.motivo}`,
        formData.sintomas ? `Síntomas: ${formData.sintomas}` : '',
        formData.temperatura ? `Temperatura: ${formData.temperatura}°C` : '',
        formData.peso ? `Peso: ${formData.peso}kg` : '',
        `Diagnóstico: ${formData.diagnostico}`,
        formData.tratamiento ? `Tratamiento: ${formData.tratamiento}` : '',
        `Estado general: ${formData.estadoGeneral}`
      ].filter(Boolean).join('\n')

      // Guardar expediente médico
      const response = await fetch('/api/admin/expedientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perritoId: selectedMascota.id,
          tipo: tipoExpediente,
          fecha: `${formData.fecha}T${formData.hora}:00`,
          descripcion: descripcionCompleta,
          veterinario: session?.user?.name || 'Veterinario',
          medicamento: formData.medicamentos || null,
          proximaDosis: formData.proximaCita || null,
          notas: formData.observaciones || null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar')
      }

      // Actualizar datos médicos de la mascota si cambiaron
      if (formData.vacunas !== selectedMascota.vacunas ||
          formData.esterilizado !== selectedMascota.esterilizado ||
          formData.desparasitado !== selectedMascota.desparasitado) {

        await fetch(`/api/admin/perritos/${selectedMascota.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vacunas: formData.vacunas,
            esterilizado: formData.esterilizado,
            desparasitado: formData.desparasitado
          })
        })
      }

      // Si hay próxima cita, crearla
      if (formData.proximaCita) {
        await fetch('/api/admin/citas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            perritoId: selectedMascota.id,
            fecha: formData.proximaCita,
            hora: '09:00',
            motivo: 'Seguimiento',
            veterinario: session?.user?.name
          })
        })
      }

      alert('Consulta guardada exitosamente')
      router.push('/admin/veterinario')
    } catch (error) {
      console.error('Error al guardar consulta:', error)
      alert('Error al guardar la consulta')
    } finally {
      setLoading(false)
    }
  }

  const filteredMascotas = mascotas.filter(m => 
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.formHeader}>
        <Link href="/admin/veterinario/expedientes" className={styles.backButton}>
          <ArrowLeft size={20} />
          Volver a Expedientes
        </Link>
        <h1 className={styles.formTitle}>Nueva Consulta Veterinaria</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.consultaForm}>
        {/* Selección de Mascota */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>
            <Dog size={20} />
            Datos del Paciente
          </h2>
          
          {!selectedMascota ? (
            <div className={styles.mascotaSelector}>
              <div className={styles.searchContainer}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Buscar mascota por nombre o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              
              <div className={styles.mascotasGrid}>
                {filteredMascotas.map(mascota => (
                  <div 
                    key={mascota.id}
                    className={styles.mascotaCard}
                    onClick={() => {
                      setSelectedMascota(mascota)
                      setFormData(prev => ({
                        ...prev,
                        vacunas: mascota.vacunas,
                        esterilizado: mascota.esterilizado,
                        desparasitado: mascota.desparasitado
                      }))
                    }}
                  >
                    <img 
                      src={mascota.fotoPrincipal} 
                      alt={mascota.nombre}
                      className={styles.mascotaCardImage}
                    />
                    <div className={styles.mascotaCardInfo}>
                      <h3>{mascota.nombre}</h3>
                      <p>Código: {mascota.codigo}</p>
                      <p>{mascota.edad} • {mascota.sexo} • {mascota.tamano}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.selectedMascota}>
              <img 
                src={selectedMascota.fotoPrincipal} 
                alt={selectedMascota.nombre}
                className={styles.selectedMascotaImage}
              />
              <div className={styles.selectedMascotaInfo}>
                <h3>{selectedMascota.nombre}</h3>
                <p>Código: {selectedMascota.codigo}</p>
                <p>{selectedMascota.edad} • {selectedMascota.sexo} • {selectedMascota.tamano} • {selectedMascota.raza}</p>
                {selectedMascota.historia && (
                  <p className={styles.mascotaHistoria}>{selectedMascota.historia}</p>
                )}
              </div>
              <button 
                type="button"
                onClick={() => setSelectedMascota(null)}
                className={styles.changeButton}
              >
                Cambiar mascota
              </button>
            </div>
          )}
        </div>

        {selectedMascota && (
          <>
            {/* Información de la Consulta */}
            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>
                <Calendar size={20} />
                Información de la Consulta
              </h2>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Fecha</label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Hora</label>
                  <input
                    type="time"
                    value={formData.hora}
                    onChange={(e) => setFormData(prev => ({ ...prev, hora: e.target.value }))}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Motivo de Consulta</label>
                  <select
                    value={formData.motivo}
                    onChange={(e) => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="revision_general">Revisión General</option>
                    <option value="vacunacion">Vacunación</option>
                    <option value="esterilizacion">Esterilización</option>
                    <option value="desparasitacion">Desparasitación</option>
                    <option value="enfermedad">Enfermedad</option>
                    <option value="lesion">Lesión</option>
                    <option value="cirugia">Cirugía</option>
                    <option value="emergencia">Emergencia</option>
                    <option value="seguimiento">Seguimiento</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Estado General</label>
                  <select
                    value={formData.estadoGeneral}
                    onChange={(e) => setFormData(prev => ({ ...prev, estadoGeneral: e.target.value }))}
                  >
                    <option value="excelente">Excelente</option>
                    <option value="estable">Estable</option>
                    <option value="regular">Regular</option>
                    <option value="delicado">Delicado</option>
                    <option value="critico">Crítico</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Examen Clínico */}
            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>
                <Stethoscope size={20} />
                Examen Clínico
              </h2>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Síntomas</label>
                  <textarea
                    value={formData.sintomas}
                    onChange={(e) => setFormData(prev => ({ ...prev, sintomas: e.target.value }))}
                    placeholder="Describir síntomas observados..."
                    rows={3}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Temperatura (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.temperatura}
                    onChange={(e) => setFormData(prev => ({ ...prev, temperatura: e.target.value }))}
                    placeholder="38.5"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.peso}
                    onChange={(e) => setFormData(prev => ({ ...prev, peso: e.target.value }))}
                    placeholder="15.5"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Diagnóstico</label>
                  <textarea
                    value={formData.diagnostico}
                    onChange={(e) => setFormData(prev => ({ ...prev, diagnostico: e.target.value }))}
                    placeholder="Diagnóstico médico..."
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Tratamiento */}
            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>
                <FileText size={20} />
                Tratamiento
              </h2>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Tratamiento</label>
                  <textarea
                    value={formData.tratamiento}
                    onChange={(e) => setFormData(prev => ({ ...prev, tratamiento: e.target.value }))}
                    placeholder="Describir tratamiento aplicado..."
                    rows={3}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Medicamentos</label>
                  <textarea
                    value={formData.medicamentos}
                    onChange={(e) => setFormData(prev => ({ ...prev, medicamentos: e.target.value }))}
                    placeholder="Medicamentos recetados y dosis..."
                    rows={3}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Próxima Cita</label>
                  <input
                    type="date"
                    value={formData.proximaCita}
                    onChange={(e) => setFormData(prev => ({ ...prev, proximaCita: e.target.value }))}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Observaciones</label>
                  <textarea
                    value={formData.observaciones}
                    onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                    placeholder="Observaciones adicionales..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Estado de Salud */}
            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>
                <Shield size={20} />
                Actualización de Estado de Salud
              </h2>
              
              <div className={styles.healthChecks}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.vacunas}
                    onChange={(e) => setFormData(prev => ({ ...prev, vacunas: e.target.checked }))}
                  />
                  <Syringe size={20} />
                  <span>Vacunas al día</span>
                </label>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.esterilizado}
                    onChange={(e) => setFormData(prev => ({ ...prev, esterilizado: e.target.checked }))}
                  />
                  <Heart size={20} />
                  <span>Esterilizado</span>
                </label>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.desparasitado}
                    onChange={(e) => setFormData(prev => ({ ...prev, desparasitado: e.target.checked }))}
                  />
                  <Shield size={20} />
                  <span>Desparasitado</span>
                </label>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => router.push('/admin/veterinario')}
                className={styles.cancelButton}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? (
                  <>Guardando...</>
                ) : (
                  <>
                    <Save size={20} />
                    Guardar Consulta
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}