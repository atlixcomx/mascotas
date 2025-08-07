'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { 
  ArrowLeft,
  Save,
  Syringe,
  Dog,
  Calendar,
  FileText,
  DollarSign,
  Building2,
  User,
  Pill,
  Activity,
  AlertTriangle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface Perrito {
  id: string
  nombre: string
  codigo: string
  fotoPrincipal: string
  vacunas: boolean
  esterilizado: boolean
  desparasitado: boolean
}

interface Veterinaria {
  id: string
  nombre: string
  direccion: string
  telefono: string
}

const expedienteSchema = z.object({
  perritoId: z.string().min(1, 'Selecciona una mascota'),
  tipo: z.enum(['consulta', 'vacunacion', 'desparasitacion', 'esterilizacion', 'emergencia', 'seguimiento']),
  fecha: z.string().min(1, 'La fecha es requerida'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  tratamiento: z.string().optional(),
  medicamentos: z.string().optional(),
  veterinarioId: z.string().optional(),
  veterinariaId: z.string().optional(),
  proximaCita: z.string().optional(),
  observaciones: z.string().optional(),
  costo: z.number().positive().optional().or(z.literal(''))
})

type ExpedienteFormData = z.infer<typeof expedienteSchema>

export default function NuevoExpediente() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [perritos, setPerritos] = useState<Perrito[]>([])
  const [veterinarias, setVeterinarias] = useState<Veterinaria[]>([])
  const [selectedPerrito, setSelectedPerrito] = useState<Perrito | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<ExpedienteFormData>({
    resolver: zodResolver(expedienteSchema),
    defaultValues: {
      tipo: 'consulta',
      fecha: new Date().toISOString().split('T')[0]
    }
  })

  const watchedPerritoId = watch('perritoId')
  const watchedTipo = watch('tipo')

  useEffect(() => {
    fetchPerritos()
    fetchVeterinarias()
  }, [])

  useEffect(() => {
    if (watchedPerritoId) {
      const perrito = perritos.find(p => p.id === watchedPerritoId)
      setSelectedPerrito(perrito || null)
    }
  }, [watchedPerritoId, perritos])

  async function fetchPerritos() {
    try {
      const response = await fetch('/api/admin/perritos?limit=100&estado=disponible')
      if (response.ok) {
        const data = await response.json()
        setPerritos(data.perritos)
      }
    } catch (error) {
      console.error('Error fetching perritos:', error)
    }
  }

  async function fetchVeterinarias() {
    try {
      const response = await fetch('/api/admin/veterinarias')
      if (response.ok) {
        const data = await response.json()
        setVeterinarias(data.veterinarias || [])
      }
    } catch (error) {
      console.error('Error fetching veterinarias:', error)
    }
  }

  const onSubmit = async (data: ExpedienteFormData) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/expedientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al guardar')
      }

      setSuccess('Expediente médico registrado exitosamente')
      
      setTimeout(() => {
        router.push('/admin/expedientes')
      }, 1500)

    } catch (err: any) {
      setError(err.message || 'Error al guardar la información')
    } finally {
      setLoading(false)
    }
  }

  const tipoOptions = [
    { value: 'consulta', label: 'Consulta General', icon: FileText },
    { value: 'vacunacion', label: 'Vacunación', icon: Syringe },
    { value: 'desparasitacion', label: 'Desparasitación', icon: Pill },
    { value: 'esterilizacion', label: 'Esterilización', icon: Activity },
    { value: 'emergencia', label: 'Emergencia', icon: AlertTriangle },
    { value: 'seguimiento', label: 'Seguimiento', icon: Clock }
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/expedientes"
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Link>
        </div>
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-slate-900">Nuevo Registro Médico</h1>
          <p className="text-slate-600 mt-1">
            Registra la atención médica o procedimiento realizado
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            
            {/* Selección de mascota */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center mb-6">
                <Dog className="w-5 h-5 text-slate-600 mr-3" />
                <h3 className="text-lg font-semibold text-slate-900">Mascota</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Selecciona la mascota <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('perritoId')}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-atlixco-500 focus:border-transparent"
                  >
                    <option value="">Selecciona una mascota</option>
                    {perritos.map((perrito) => (
                      <option key={perrito.id} value={perrito.id}>
                        {perrito.nombre} - {perrito.codigo}
                      </option>
                    ))}
                  </select>
                  {errors.perritoId && (
                    <p className="text-red-600 text-sm mt-1">{errors.perritoId.message}</p>
                  )}
                </div>

                {selectedPerrito && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <img
                        src={selectedPerrito.fotoPrincipal || '/placeholder-dog.jpg'}
                        alt={selectedPerrito.nombre}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">{selectedPerrito.nombre}</h4>
                        <p className="text-sm text-slate-600">{selectedPerrito.codigo}</p>
                        <div className="flex gap-3 mt-2 text-xs">
                          <span className={`px-2 py-1 rounded-full ${
                            selectedPerrito.vacunas 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {selectedPerrito.vacunas ? '✓' : '✕'} Vacunas
                          </span>
                          <span className={`px-2 py-1 rounded-full ${
                            selectedPerrito.esterilizado 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {selectedPerrito.esterilizado ? '✓' : '✕'} Esterilizado
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tipo de registro */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center mb-6">
                <Syringe className="w-5 h-5 text-slate-600 mr-3" />
                <h3 className="text-lg font-semibold text-slate-900">Tipo de Registro</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {tipoOptions.map((tipo) => {
                  const IconComponent = tipo.icon
                  return (
                    <label
                      key={tipo.value}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        watchedTipo === tipo.value
                          ? 'border-atlixco-500 bg-atlixco-50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        {...register('tipo')}
                        type="radio"
                        value={tipo.value}
                        className="sr-only"
                      />
                      <IconComponent className="w-5 h-5 mr-3 text-slate-600" />
                      <span className="font-medium text-slate-900">{tipo.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Detalles del registro */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center mb-6">
                <FileText className="w-5 h-5 text-slate-600 mr-3" />
                <h3 className="text-lg font-semibold text-slate-900">Detalles del Registro</h3>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Fecha <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('fecha')}
                      type="date"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-atlixco-500 focus:border-transparent"
                    />
                    {errors.fecha && (
                      <p className="text-red-600 text-sm mt-1">{errors.fecha.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Veterinaria
                    </label>
                    <select
                      {...register('veterinariaId')}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-atlixco-500 focus:border-transparent"
                    >
                      <option value="">Centro de Adopción</option>
                      {veterinarias.map((vet) => (
                        <option key={vet.id} value={vet.id}>
                          {vet.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('descripcion')}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-atlixco-500 focus:border-transparent"
                    placeholder="Describe el motivo de la consulta, síntomas, hallazgos..."
                  />
                  {errors.descripcion && (
                    <p className="text-red-600 text-sm mt-1">{errors.descripcion.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tratamiento
                  </label>
                  <textarea
                    {...register('tratamiento')}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-atlixco-500 focus:border-transparent"
                    placeholder="Describe el tratamiento aplicado o recomendado"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Medicamentos
                  </label>
                  <input
                    {...register('medicamentos')}
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-atlixco-500 focus:border-transparent"
                    placeholder="Lista de medicamentos recetados"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Próxima Cita
                    </label>
                    <input
                      {...register('proximaCita')}
                      type="date"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-atlixco-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Costo
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                      <input
                        {...register('costo', { valueAsNumber: true })}
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-atlixco-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Observaciones
                  </label>
                  <textarea
                    {...register('observaciones')}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-atlixco-500 focus:border-transparent"
                    placeholder="Notas adicionales, recomendaciones, precauciones..."
                  />
                </div>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="mx-6 mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">{success}</p>
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-end space-x-4 p-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-atlixco-600 text-white rounded-lg hover:bg-atlixco-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Registro
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}