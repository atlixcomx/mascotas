'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Save, Camera, Plus, X,
  Stethoscope, AlertCircle, Info,
  Dog, Calendar, MapPin, Heart,
  FileText, Syringe, Shield
} from 'lucide-react'
import styles from '../veterinario.module.css'

export default function NuevoIngresoPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [fotos, setFotos] = useState<string[]>([])
  const [fotosPreview, setFotosPreview] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    // Información básica
    nombre: '',
    edad: '',
    sexo: 'macho',
    tamano: 'mediano',
    raza: '',
    color: '',
    
    // Información de rescate
    fechaIngreso: new Date().toISOString().split('T')[0],
    lugarRescate: '',
    condicionRescate: '',
    
    // Diagnóstico veterinario inicial
    estadoGeneral: 'regular',
    peso: '',
    temperatura: '',
    sintomas: '',
    lesiones: '',
    enfermedades: '',
    
    // Estado de salud
    vacunas: false,
    esterilizado: false,
    desparasitado: false,
    
    // Tratamiento inicial
    tratamientoInmediato: '',
    medicamentos: '',
    cuidadosEspeciales: '',
    
    // Información adicional
    temperamento: '',
    historia: '',
    observaciones: '',
    
    // Estado de adopción
    disponibleAdopcion: false,
    requiereCuarentena: true,
    diasCuarentena: '15'
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingPhotos(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Crear preview local
        const preview = URL.createObjectURL(file)

        // Subir archivo al servidor
        const formData = new FormData()
        formData.append('image', file)

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Error al subir imagen')
        }

        const data = await response.json()
        return { preview, url: data.data.url }
      })

      const results = await Promise.all(uploadPromises)

      setFotosPreview(prev => [...prev, ...results.map(r => r.preview)])
      setFotos(prev => [...prev, ...results.map(r => r.url)])
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Error al subir algunas imágenes')
    } finally {
      setUploadingPhotos(false)
    }
  }

  const removeFoto = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index))
    setFotosPreview(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre || !formData.edad) {
      alert('Por favor completa los campos obligatorios')
      return
    }

    if (uploadingPhotos) {
      alert('Espera a que terminen de subir las fotos')
      return
    }

    setLoading(true)

    try {
      // Mapear tamaño al formato esperado
      const tamanoMap: Record<string, string> = {
        'pequeno': 'chico',
        'mediano': 'mediano',
        'grande': 'grande'
      }

      // Mapear energía basada en temperamento
      const energiaMap: Record<string, string> = {
        'critico': 'baja',
        'grave': 'baja',
        'regular': 'media',
        'estable': 'media',
        'bueno': 'alta'
      }

      // Crear historia completa
      const historiaCompleta = [
        formData.condicionRescate || 'Rescatado por el municipio',
        formData.lugarRescate ? `Lugar: ${formData.lugarRescate}` : '',
        formData.sintomas ? `Síntomas iniciales: ${formData.sintomas}` : '',
        formData.lesiones ? `Lesiones: ${formData.lesiones}` : '',
        formData.enfermedades ? `Enfermedades: ${formData.enfermedades}` : '',
        formData.tratamientoInmediato ? `Tratamiento: ${formData.tratamientoInmediato}` : '',
        formData.observaciones || ''
      ].filter(Boolean).join('. ')

      // Crear notas de salud
      const saludNotas = [
        formData.peso ? `Peso: ${formData.peso}kg` : '',
        formData.temperatura ? `Temperatura: ${formData.temperatura}°C` : '',
        formData.cuidadosEspeciales ? `Cuidados especiales: ${formData.cuidadosEspeciales}` : '',
        formData.medicamentos ? `Medicamentos: ${formData.medicamentos}` : ''
      ].filter(Boolean).join('. ')

      const mascotaData = {
        nombre: formData.nombre,
        raza: formData.raza || 'Mestizo',
        edad: formData.edad,
        sexo: formData.sexo as 'macho' | 'hembra',
        tamano: tamanoMap[formData.tamano] || 'mediano',
        peso: formData.peso ? parseFloat(formData.peso) : undefined,
        historia: historiaCompleta.length >= 10 ? historiaCompleta : 'Mascota rescatada e ingresada al centro de adopción municipal.',
        tipoIngreso: 'rescate' as const,
        procedencia: formData.lugarRescate || 'Atlixco, Puebla',
        responsableIngreso: session?.user?.name || 'Veterinario',
        vacunas: formData.vacunas,
        esterilizado: formData.esterilizado,
        desparasitado: formData.desparasitado,
        saludNotas: saludNotas || undefined,
        energia: (energiaMap[formData.estadoGeneral] || 'media') as 'baja' | 'media' | 'alta',
        aptoNinos: false,
        aptoPerros: false,
        aptoGatos: false,
        caracter: formData.temperamento ? [formData.temperamento] : ['sociable'],
        fotoPrincipal: fotos[0] || null,
        fotos: fotos,
        destacado: false,
        estado: formData.disponibleAdopcion ? 'disponible' : 'proceso'
      }

      // Crear la mascota
      const response = await fetch('/api/admin/perritos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mascotaData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear mascota')
      }

      const data = await response.json()
      alert(`Mascota registrada exitosamente con código: ${data.perrito?.codigo || 'N/A'}`)
      router.push('/admin/veterinario')
    } catch (error) {
      console.error('Error al guardar:', error)
      alert(`Error al registrar la mascota: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.formHeader}>
        <Link href="/admin/perritos" className={styles.backButton}>
          <ArrowLeft size={20} />
          Volver a Mascotas
        </Link>
        <h1 className={styles.formTitle}>Nuevo Ingreso por Diagnóstico Veterinario</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.consultaForm}>
        {/* Información de Rescate */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>
            <MapPin size={20} />
            Información de Rescate
          </h2>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Fecha de Ingreso *</label>
              <input
                type="date"
                value={formData.fechaIngreso}
                onChange={(e) => setFormData(prev => ({ ...prev, fechaIngreso: e.target.value }))}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Lugar de Rescate</label>
              <input
                type="text"
                value={formData.lugarRescate}
                onChange={(e) => setFormData(prev => ({ ...prev, lugarRescate: e.target.value }))}
                placeholder="Dirección o referencia del lugar"
              />
            </div>
            
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <label>Condición del Rescate</label>
              <textarea
                value={formData.condicionRescate}
                onChange={(e) => setFormData(prev => ({ ...prev, condicionRescate: e.target.value }))}
                placeholder="Describe las condiciones en las que fue encontrado..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Información Básica */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>
            <Dog size={20} />
            Información Básica del Paciente
          </h2>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Nombre de la mascota"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Edad Aproximada *</label>
              <input
                type="text"
                value={formData.edad}
                onChange={(e) => setFormData(prev => ({ ...prev, edad: e.target.value }))}
                placeholder="Ej: 2 años, 6 meses"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Sexo</label>
              <select
                value={formData.sexo}
                onChange={(e) => setFormData(prev => ({ ...prev, sexo: e.target.value }))}
              >
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Tamaño</label>
              <select
                value={formData.tamano}
                onChange={(e) => setFormData(prev => ({ ...prev, tamano: e.target.value }))}
              >
                <option value="pequeno">Pequeño (hasta 10kg)</option>
                <option value="mediano">Mediano (10-25kg)</option>
                <option value="grande">Grande (más de 25kg)</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Raza</label>
              <input
                type="text"
                value={formData.raza}
                onChange={(e) => setFormData(prev => ({ ...prev, raza: e.target.value }))}
                placeholder="Raza o mestizo"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Color/Marcas</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                placeholder="Color y marcas distintivas"
              />
            </div>
          </div>
        </div>

        {/* Diagnóstico Veterinario */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>
            <Stethoscope size={20} />
            Diagnóstico Veterinario Inicial
          </h2>
          
          <div className={styles.alertBox}>
            <AlertCircle size={20} />
            <span>Complete el diagnóstico inicial basado en el examen físico del paciente</span>
          </div>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Estado General</label>
              <select
                value={formData.estadoGeneral}
                onChange={(e) => setFormData(prev => ({ ...prev, estadoGeneral: e.target.value }))}
              >
                <option value="critico">Crítico</option>
                <option value="grave">Grave</option>
                <option value="regular">Regular</option>
                <option value="estable">Estable</option>
                <option value="bueno">Bueno</option>
              </select>
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
              <label>Síntomas Observados</label>
              <textarea
                value={formData.sintomas}
                onChange={(e) => setFormData(prev => ({ ...prev, sintomas: e.target.value }))}
                placeholder="Describir síntomas visibles..."
                rows={3}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Lesiones</label>
              <textarea
                value={formData.lesiones}
                onChange={(e) => setFormData(prev => ({ ...prev, lesiones: e.target.value }))}
                placeholder="Describir lesiones si las hay..."
                rows={3}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Enfermedades Detectadas</label>
              <textarea
                value={formData.enfermedades}
                onChange={(e) => setFormData(prev => ({ ...prev, enfermedades: e.target.value }))}
                placeholder="Enfermedades o condiciones médicas..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Tratamiento Inicial */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>
            <FileText size={20} />
            Tratamiento Inicial
          </h2>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <label>Tratamiento Inmediato</label>
              <textarea
                value={formData.tratamientoInmediato}
                onChange={(e) => setFormData(prev => ({ ...prev, tratamientoInmediato: e.target.value }))}
                placeholder="Describir tratamiento aplicado o necesario..."
                rows={3}
              />
            </div>
            
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <label>Medicamentos</label>
              <textarea
                value={formData.medicamentos}
                onChange={(e) => setFormData(prev => ({ ...prev, medicamentos: e.target.value }))}
                placeholder="Medicamentos administrados o recetados..."
                rows={3}
              />
            </div>
            
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <label>Cuidados Especiales</label>
              <textarea
                value={formData.cuidadosEspeciales}
                onChange={(e) => setFormData(prev => ({ ...prev, cuidadosEspeciales: e.target.value }))}
                placeholder="Cuidados especiales requeridos..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Estado de Salud */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>
            <Shield size={20} />
            Estado de Salud
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

        {/* Fotografías */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>
            <Camera size={20} />
            Fotografías
          </h2>
          
          <div className={styles.photoUpload}>
            <input
              type="file"
              id="fotos"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            
            <div className={styles.photoGrid}>
              {fotosPreview.map((foto, index) => (
                <div key={index} className={styles.photoItem}>
                  <img src={foto} alt={`Foto ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeFoto(index)}
                    className={styles.removePhoto}
                  >
                    <X size={16} />
                  </button>
                  {index === 0 && <span className={styles.photoPrincipal}>Principal</span>}
                </div>
              ))}

              <label htmlFor="fotos" className={styles.addPhoto} style={{ opacity: uploadingPhotos ? 0.5 : 1, pointerEvents: uploadingPhotos ? 'none' : 'auto' }}>
                {uploadingPhotos ? (
                  <>
                    <div style={{ width: 24, height: 24, border: '2px solid #ccc', borderTopColor: '#0e312d', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <span>Subiendo...</span>
                  </>
                ) : (
                  <>
                    <Plus size={24} />
                    <span>Agregar Foto</span>
                  </>
                )}
              </label>
            </div>
            
            <p className={styles.photoHint}>
              La primera foto será la principal. Recomendamos al menos 3 fotos.
            </p>
          </div>
        </div>

        {/* Información Adicional */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>
            <Info size={20} />
            Información Adicional
          </h2>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <label>Temperamento</label>
              <textarea
                value={formData.temperamento}
                onChange={(e) => setFormData(prev => ({ ...prev, temperamento: e.target.value }))}
                placeholder="Describe el temperamento y comportamiento..."
                rows={3}
              />
            </div>
            
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <label>Historia</label>
              <textarea
                value={formData.historia}
                onChange={(e) => setFormData(prev => ({ ...prev, historia: e.target.value }))}
                placeholder="Historia o información relevante..."
                rows={3}
              />
            </div>
            
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
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

        {/* Estado de Adopción */}
        <div className={styles.formSection}>
          <h2 className={styles.formSectionTitle}>
            <Heart size={20} />
            Estado de Adopción
          </h2>
          
          <div className={styles.adoptionStatus}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.requiereCuarentena}
                onChange={(e) => setFormData(prev => ({ ...prev, requiereCuarentena: e.target.checked }))}
              />
              <span>Requiere período de cuarentena</span>
            </label>
            
            {formData.requiereCuarentena && (
              <div className={styles.formGroup}>
                <label>Días de cuarentena</label>
                <input
                  type="number"
                  value={formData.diasCuarentena}
                  onChange={(e) => setFormData(prev => ({ ...prev, diasCuarentena: e.target.value }))}
                  min="1"
                  max="60"
                />
              </div>
            )}
            
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.disponibleAdopcion}
                onChange={(e) => setFormData(prev => ({ ...prev, disponibleAdopcion: e.target.checked }))}
              />
              <span>Disponible para adopción inmediata</span>
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
                Registrar Mascota
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}