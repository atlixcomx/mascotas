'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ChevronLeft, ChevronRight, Check, User, Home, Heart, FileText, AlertCircle } from 'lucide-react'
import ErrorMessage from './ui/ErrorMessage'

interface Perrito {
  id: string
  nombre: string
  fotoPrincipal: string
  raza: string
  edad: string
  sexo: string
  tamano: string
  estado: string
  slug: string
}

interface FormularioAdopcionProps {
  perrito: Perrito
}

// Schema de validación con Zod
const solicitudSchema = z.object({
  // Step 1: Datos personales
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  edad: z.number().min(18, 'Debes ser mayor de edad').max(100, 'Edad inválida'),
  telefono: z.string().min(10, 'Teléfono debe tener al menos 10 dígitos'),
  email: z.string().email('Email inválido'),
  
  // Step 2: Información de vivienda
  direccion: z.string().min(5, 'Dirección debe ser más específica'),
  ciudad: z.string().min(2, 'Ciudad requerida'),
  codigoPostal: z.string().min(5, 'Código postal inválido'),
  tipoVivienda: z.enum(['casa', 'departamento'], {
    errorMap: () => ({ message: 'Selecciona tipo de vivienda' })
  }),
  tienePatio: z.boolean(),
  
  // Step 3: Experiencia y motivación
  experiencia: z.string().min(10, 'Describe tu experiencia con mascotas'),
  otrasMascotas: z.string().optional(),
  motivoAdopcion: z.string().min(20, 'Explica tu motivación para adoptar'),
})

type SolicitudData = z.infer<typeof solicitudSchema>

const steps = [
  { id: 1, name: 'Datos Personales', icon: User, fields: ['nombre', 'edad', 'telefono', 'email'] },
  { id: 2, name: 'Tu Hogar', icon: Home, fields: ['direccion', 'ciudad', 'codigoPostal', 'tipoVivienda', 'tienePatio'] },
  { id: 3, name: 'Experiencia', icon: Heart, fields: ['experiencia', 'otrasMascotas', 'motivoAdopcion'] },
  { id: 4, name: 'Revisión', icon: FileText, fields: [] },
]

export default function FormularioAdopcion({ perrito }: FormularioAdopcionProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{ codigo: string } | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    watch,
    setValue,
    getValues
  } = useForm<SolicitudData>({
    resolver: zodResolver(solicitudSchema),
    mode: 'onChange',
    defaultValues: {
      tienePatio: false,
      otrasMascotas: '',
    }
  })

  // Guardar progreso en localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`solicitud-${perrito.id}`)
    if (savedData) {
      const parsed = JSON.parse(savedData)
      Object.keys(parsed).forEach((key) => {
        setValue(key as keyof SolicitudData, parsed[key])
      })
    }
  }, [perrito.id, setValue])

  // Guardar en localStorage cuando cambien los datos
  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem(`solicitud-${perrito.id}`, JSON.stringify(data))
    })
    return () => subscription.unsubscribe()
  }, [watch, perrito.id])

  const validateCurrentStep = async () => {
    const currentStepFields = steps[currentStep - 1].fields
    const isStepValid = await trigger(currentStepFields as (keyof SolicitudData)[])
    return isStepValid
  }

  const nextStep = async () => {
    if (currentStep < 4) {
      const isValid = await validateCurrentStep()
      if (isValid) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: SolicitudData, attempt = 0) => {
    setLoading(true)
    if (attempt === 0) {
      setError('')
      setRetryCount(0)
    }
    setIsRetrying(attempt > 0)

    try {
      const response = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          perritoId: perrito.id,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar solicitud')
      }

      // Limpiar localStorage
      localStorage.removeItem(`solicitud-${perrito.id}`)
      
      setSuccess({ codigo: result.solicitud.codigo })
      setRetryCount(0)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar la solicitud'
      
      // Intentar retry automático hasta 2 veces para errores de red
      if (attempt < 2 && (errorMessage.includes('fetch') || errorMessage.includes('network'))) {
        setRetryCount(attempt + 1)
        setTimeout(() => {
          onSubmit(data, attempt + 1)
        }, 1000 * (attempt + 1)) // Delay incremental
      } else {
        setError(errorMessage)
        setRetryCount(attempt)
      }
    } finally {
      setLoading(false)
      setIsRetrying(false)
    }
  }

  const retrySubmit = () => {
    const data = getValues()
    onSubmit(data, 0)
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            ¡Solicitud Enviada Exitosamente!
          </h2>
          
          <div className="bg-atlixco-50 border border-atlixco-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-atlixco-700 mb-2">Tu código de seguimiento es:</p>
            <p className="text-2xl font-bold text-atlixco-800">{success.codigo}</p>
          </div>

          <p className="text-slate-600 mb-6">
            Hemos recibido tu solicitud para adoptar a <strong>{perrito.nombre}</strong>. 
            Te contactaremos pronto para continuar con el proceso de adopción.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => router.push(`/perritos/${perrito.slug}`)}
              className="w-full btn-secondary"
            >
              Ver perfil de {perrito.nombre}
            </button>
            <button
              onClick={() => router.push('/perritos')}
              className="w-full btn-primary"
            >
              Ver otros perritos
            </button>
          </div>
        </div>
      </div>
    )
  }

  const allData = getValues()

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isActive
                      ? 'bg-atlixco-500 border-atlixco-500 text-white'
                      : 'bg-white border-slate-300 text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-atlixco-600' : 'text-slate-500'
                  }`}
                >
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-12 h-0.5 bg-slate-300 mx-4"></div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Step 1: Datos Personales */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">Datos Personales</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      {...register('nombre')}
                      className="input"
                      placeholder="Tu nombre completo"
                    />
                    {errors.nombre && (
                      <p className="text-red-600 text-sm mt-1">{errors.nombre.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Edad *
                    </label>
                    <input
                      {...register('edad', { valueAsNumber: true })}
                      type="number"
                      min="18"
                      max="100"
                      className="input"
                      placeholder="Tu edad"
                    />
                    {errors.edad && (
                      <p className="text-red-600 text-sm mt-1">{errors.edad.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      {...register('telefono')}
                      type="tel"
                      className="input"
                      placeholder="10 dígitos"
                    />
                    {errors.telefono && (
                      <p className="text-red-600 text-sm mt-1">{errors.telefono.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="input"
                      placeholder="tu@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Información de vivienda */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">Tu Hogar</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Dirección completa *
                    </label>
                    <input
                      {...register('direccion')}
                      className="input"
                      placeholder="Calle, número, colonia"
                    />
                    {errors.direccion && (
                      <p className="text-red-600 text-sm mt-1">{errors.direccion.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Ciudad *
                      </label>
                      <input
                        {...register('ciudad')}
                        className="input"
                        placeholder="Tu ciudad"
                      />
                      {errors.ciudad && (
                        <p className="text-red-600 text-sm mt-1">{errors.ciudad.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Código Postal *
                      </label>
                      <input
                        {...register('codigoPostal')}
                        className="input"
                        placeholder="74200"
                      />
                      {errors.codigoPostal && (
                        <p className="text-red-600 text-sm mt-1">{errors.codigoPostal.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tipo de vivienda *
                    </label>
                    <select {...register('tipoVivienda')} className="input">
                      <option value="">Selecciona...</option>
                      <option value="casa">Casa</option>
                      <option value="departamento">Departamento</option>
                    </select>
                    {errors.tipoVivienda && (
                      <p className="text-red-600 text-sm mt-1">{errors.tipoVivienda.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        {...register('tienePatio')}
                        type="checkbox"
                        className="rounded border-slate-300 text-atlixco-500 focus:ring-atlixco-500"
                      />
                      <span className="ml-2 text-sm text-slate-700">
                        Tengo patio o jardín
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Experiencia y motivación */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">Experiencia con Mascotas</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      ¿Qué experiencia tienes con mascotas? *
                    </label>
                    <textarea
                      {...register('experiencia')}
                      rows={4}
                      className="input"
                      placeholder="Cuéntanos sobre tu experiencia cuidando mascotas, si has tenido perros antes, etc."
                    />
                    {errors.experiencia && (
                      <p className="text-red-600 text-sm mt-1">{errors.experiencia.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      ¿Tienes otras mascotas? (opcional)
                    </label>
                    <textarea
                      {...register('otrasMascotas')}
                      rows={3}
                      className="input"
                      placeholder="Describe qué otras mascotas tienes, sus edades, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      ¿Por qué quieres adoptar a {perrito.nombre}? *
                    </label>
                    <textarea
                      {...register('motivoAdopcion')}
                      rows={4}
                      className="input"
                      placeholder="Explica tu motivación para adoptar y qué puedes ofrecer como familia"
                    />
                    {errors.motivoAdopcion && (
                      <p className="text-red-600 text-sm mt-1">{errors.motivoAdopcion.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">Revisión de tu Solicitud</h3>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-2">Datos Personales</h4>
                    <div className="text-sm text-slate-600 space-y-1">
                      <p><strong>Nombre:</strong> {allData.nombre}</p>
                      <p><strong>Edad:</strong> {allData.edad} años</p>
                      <p><strong>Teléfono:</strong> {allData.telefono}</p>
                      <p><strong>Email:</strong> {allData.email}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-2">Tu Hogar</h4>
                    <div className="text-sm text-slate-600 space-y-1">
                      <p><strong>Dirección:</strong> {allData.direccion}</p>
                      <p><strong>Ciudad:</strong> {allData.ciudad}, CP: {allData.codigoPostal}</p>
                      <p><strong>Vivienda:</strong> {allData.tipoVivienda}</p>
                      <p><strong>Patio:</strong> {allData.tienePatio ? 'Sí' : 'No'}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-2">Experiencia</h4>
                    <div className="text-sm text-slate-600 space-y-2">
                      <p><strong>Experiencia:</strong></p>
                      <p className="bg-white p-2 rounded">{allData.experiencia}</p>
                      {allData.otrasMascotas && (
                        <>
                          <p><strong>Otras mascotas:</strong></p>
                          <p className="bg-white p-2 rounded">{allData.otrasMascotas}</p>
                        </>
                      )}
                      <p><strong>Motivación:</strong></p>
                      <p className="bg-white p-2 rounded">{allData.motivoAdopcion}</p>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <ErrorMessage 
                  error={error}
                  onRetry={retrySubmit}
                  retryCount={retryCount}
                  isRetrying={isRetrying}
                  showRetryInfo={true}
                />
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 border border-slate-300 rounded-md text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center btn-primary"
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}