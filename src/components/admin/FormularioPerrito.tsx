'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
  Upload, 
  X, 
  Plus, 
  Save, 
  AlertCircle,
  Dog,
  MapPin,
  Heart,
  Syringe,
  FileText,
  Calendar,
  User,
  Camera
} from 'lucide-react'
import { ImageUploader } from './ImageUploader'
import { SimpleImageUploader } from './SimpleImageUploader'

interface PerritoData {
  id?: string
  codigo?: string
  nombre: string
  raza: string
  edad: string
  sexo: string
  tamano: string
  peso?: number
  historia: string
  tipoIngreso?: string
  procedencia?: string
  responsableIngreso?: string
  vacunas: boolean
  esterilizado: boolean
  desparasitado: boolean
  saludNotas?: string
  energia: string
  aptoNinos: boolean
  aptoPerros: boolean
  aptoGatos: boolean
  caracter: string[]
  fotoPrincipal: string
  fotos: string[]
  destacado: boolean
  estado?: string
}

interface FormularioPerritoProps {
  perrito?: PerritoData
}

const perritoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  codigo: z.string().optional(),
  raza: z.string().min(2, 'La raza es requerida'),
  edad: z.string().min(1, 'La edad es requerida'),
  sexo: z.enum(['macho', 'hembra'], { errorMap: () => ({ message: 'Selecciona el sexo' }) }),
  tamano: z.enum(['chico', 'mediano', 'grande'], { errorMap: () => ({ message: 'Selecciona el tamaño' }) }),
  peso: z.number().positive().optional().or(z.literal('')),
  historia: z.string().min(20, 'La historia debe tener al menos 20 caracteres'),
  tipoIngreso: z.enum(['entrega_voluntaria', 'rescate', 'decomiso'], { 
    errorMap: () => ({ message: 'Selecciona el tipo de ingreso' }) 
  }),
  procedencia: z.string().optional(),
  responsableIngreso: z.string().optional(),
  vacunas: z.boolean(),
  esterilizado: z.boolean(),
  desparasitado: z.boolean(),
  saludNotas: z.string().optional(),
  energia: z.enum(['baja', 'media', 'alta'], { errorMap: () => ({ message: 'Selecciona el nivel de energía' }) }),
  aptoNinos: z.boolean(),
  aptoPerros: z.boolean(),
  aptoGatos: z.boolean(),
  caracter: z.array(z.string()).min(1, 'Agrega al menos una característica'),
  fotoPrincipal: z.string().url('URL de imagen inválida'),
  fotos: z.array(z.string().url()).min(1, 'Agrega al menos una foto'),
  destacado: z.boolean(),
  estado: z.enum(['disponible', 'proceso', 'adoptado']).optional()
})

type PerritoFormData = z.infer<typeof perritoSchema>

const caracteristicasSugeridas = [
  'Cariñoso', 'Juguetón', 'Tranquilo', 'Energético', 'Protector', 'Sociable',
  'Inteligente', 'Obediente', 'Independiente', 'Curioso', 'Leal', 'Amigable',
  'Tímido', 'Valiente', 'Dormilón', 'Activo', 'Guardian', 'Territorial'
]

export default function FormularioPerrito({ perrito }: FormularioPerritoProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [nuevaCaracteristica, setNuevaCaracteristica] = useState('')
  const [nuevaFoto, setNuevaFoto] = useState('')

  const isEditing = !!perrito?.id

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues
  } = useForm<PerritoFormData>({
    resolver: zodResolver(perritoSchema),
    defaultValues: {
      nombre: perrito?.nombre || '',
      codigo: perrito?.codigo || '',
      raza: perrito?.raza || '',
      edad: perrito?.edad || '',
      sexo: perrito?.sexo || 'macho',
      tamano: perrito?.tamano || 'mediano',
      peso: perrito?.peso || undefined,
      historia: perrito?.historia || '',
      tipoIngreso: perrito?.tipoIngreso || 'entrega_voluntaria',
      procedencia: perrito?.procedencia || '',
      responsableIngreso: perrito?.responsableIngreso || '',
      vacunas: perrito?.vacunas || false,
      esterilizado: perrito?.esterilizado || false,
      desparasitado: perrito?.desparasitado || false,
      saludNotas: perrito?.saludNotas || '',
      energia: perrito?.energia || 'media',
      aptoNinos: perrito?.aptoNinos || false,
      aptoPerros: perrito?.aptoPerros || false,
      aptoGatos: perrito?.aptoGatos || false,
      caracter: perrito?.caracter || [],
      fotoPrincipal: perrito?.fotoPrincipal || '',
      fotos: perrito?.fotos || [],
      destacado: perrito?.destacado || false,
      estado: perrito?.estado || 'disponible'
    }
  })

  const watchedCaracter = watch('caracter')
  const watchedFotos = watch('fotos')

  // Generar código automático al crear nuevo
  useEffect(() => {
    if (!isEditing && !getValues('codigo')) {
      const año = new Date().getFullYear()
      const mes = String(new Date().getMonth() + 1).padStart(2, '0')
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      setValue('codigo', `ATL-${año}${mes}-${random}`)
    }
  }, [isEditing, setValue, getValues])

  const agregarCaracteristica = (caracteristica: string) => {
    const actual = getValues('caracter')
    if (!actual.includes(caracteristica) && caracteristica.trim()) {
      setValue('caracter', [...actual, caracteristica.trim()])
    }
    setNuevaCaracteristica('')
  }

  const removerCaracteristica = (index: number) => {
    const actual = getValues('caracter')
    setValue('caracter', actual.filter((_, i) => i !== index))
  }

  const agregarFoto = () => {
    if (nuevaFoto.trim() && nuevaFoto.startsWith('http')) {
      const actual = getValues('fotos')
      const nuevaFotoUrl = nuevaFoto.trim()
      setValue('fotos', [...actual, nuevaFotoUrl])
      // Si no hay foto principal, establecer esta como principal
      if (!getValues('fotoPrincipal')) {
        setValue('fotoPrincipal', nuevaFotoUrl)
      }
      setNuevaFoto('')
    }
  }

  const removerFoto = (index: number) => {
    const actual = getValues('fotos')
    const nuevasFotos = actual.filter((_, i) => i !== index)
    setValue('fotos', nuevasFotos)
    
    // Si se eliminó la foto principal, usar la primera disponible
    const fotoPrincipal = getValues('fotoPrincipal')
    if (fotoPrincipal === actual[index]) {
      if (nuevasFotos.length > 0) {
        setValue('fotoPrincipal', nuevasFotos[0])
      } else {
        setValue('fotoPrincipal', '')
      }
    }
  }

  const onSubmit = async (data: PerritoFormData) => {
    setLoading(true)
    setError('')
    setSuccess('')

    // Asegurarse de que la foto principal esté en el array de fotos
    if (data.fotoPrincipal && !data.fotos.includes(data.fotoPrincipal)) {
      data.fotos = [data.fotoPrincipal, ...data.fotos]
    }

    try {
      const url = isEditing 
        ? `/api/admin/perritos/${perrito.id}`
        : '/api/admin/perritos'
      
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al guardar')
      }

      setSuccess(isEditing ? 'Mascota actualizada exitosamente' : 'Mascota registrada exitosamente')
      
      if (!isEditing) {
        // Redirigir a la página de edición del perrito recién creado
        setTimeout(() => {
          router.push(`/admin/perritos/${result.perrito.id}`)
        }, 1500)
      }

    } catch (err: any) {
      setError(err.message || 'Error al guardar la información')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <form onSubmit={handleSubmit(onSubmit)}>
        
        {/* Información Básica */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center mb-6">
            <Dog className="w-5 h-5 text-slate-600 mr-3" />
            <h3 className="text-lg font-semibold text-slate-900">Información Básica</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                {...register('nombre')}
                className="input"
                placeholder="Nombre del perrito"
              />
              {errors.nombre && (
                <p className="text-red-600 text-sm mt-1">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Código Único
              </label>
              <input
                {...register('codigo')}
                className="input bg-slate-50"
                placeholder="ATL-202412-001"
                readOnly={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Raza <span className="text-red-500">*</span>
              </label>
              <input
                {...register('raza')}
                className="input"
                placeholder="Raza o mestizo"
              />
              {errors.raza && (
                <p className="text-red-600 text-sm mt-1">{errors.raza.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Edad <span className="text-red-500">*</span>
              </label>
              <input
                {...register('edad')}
                className="input"
                placeholder="ej: 2 años, 6 meses"
              />
              {errors.edad && (
                <p className="text-red-600 text-sm mt-1">{errors.edad.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sexo <span className="text-red-500">*</span>
              </label>
              <select {...register('sexo')} className="input">
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tamaño <span className="text-red-500">*</span>
              </label>
              <select {...register('tamano')} className="input">
                <option value="chico">Chico (hasta 10kg)</option>
                <option value="mediano">Mediano (10-25kg)</option>
                <option value="grande">Grande (más de 25kg)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Peso (kg)
              </label>
              <input
                {...register('peso', { valueAsNumber: true })}
                type="number"
                step="0.1"
                min="0"
                className="input"
                placeholder="15.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nivel de Energía <span className="text-red-500">*</span>
              </label>
              <select {...register('energia')} className="input">
                <option value="baja">Baja - Tranquilo y relajado</option>
                <option value="media">Media - Activo pero equilibrado</option>
                <option value="alta">Alta - Muy activo y juguetón</option>
              </select>
            </div>
          </div>
        </div>

        {/* Procedencia y Recepción */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center mb-6">
            <MapPin className="w-5 h-5 text-slate-600 mr-3" />
            <h3 className="text-lg font-semibold text-slate-900">Procedencia y Recepción</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipo de Ingreso <span className="text-red-500">*</span>
              </label>
              <select {...register('tipoIngreso')} className="input">
                <option value="entrega_voluntaria">Entrega Voluntaria</option>
                <option value="rescate">Rescate</option>
                <option value="decomiso">Decomiso</option>
              </select>
              {errors.tipoIngreso && (
                <p className="text-red-600 text-sm mt-1">{errors.tipoIngreso.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Lugar de Procedencia
              </label>
              <input
                {...register('procedencia')}
                className="input"
                placeholder="Ej: Calle Principal, Colonia Centro"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Responsable del Ingreso
              </label>
              <input
                {...register('responsableIngreso')}
                className="input"
                placeholder="Nombre de quien trajo o reportó"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Historia / Observaciones <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('historia')}
              rows={5}
              className="input"
              placeholder="Describe las circunstancias del rescate, estado en que fue encontrado, comportamiento inicial, personalidad, etc."
            />
            {errors.historia && (
              <p className="text-red-600 text-sm mt-1">{errors.historia.message}</p>
            )}
          </div>
        </div>

        {/* Estado de Salud */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center mb-6">
            <Syringe className="w-5 h-5 text-slate-600 mr-3" />
            <h3 className="text-lg font-semibold text-slate-900">Estado de Salud</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <label className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
              <input
                {...register('vacunas')}
                type="checkbox"
                className="rounded border-slate-300 text-atlixco-500 focus:ring-atlixco-500 mr-3"
              />
              <div>
                <span className="font-medium text-slate-900">Vacunado</span>
                <p className="text-sm text-slate-500">Tiene vacunas al día</p>
              </div>
            </label>
            
            <label className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
              <input
                {...register('esterilizado')}
                type="checkbox"
                className="rounded border-slate-300 text-atlixco-500 focus:ring-atlixco-500 mr-3"
              />
              <div>
                <span className="font-medium text-slate-900">Esterilizado</span>
                <p className="text-sm text-slate-500">Ya fue esterilizado</p>
              </div>
            </label>
            
            <label className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
              <input
                {...register('desparasitado')}
                type="checkbox"
                className="rounded border-slate-300 text-atlixco-500 focus:ring-atlixco-500 mr-3"
              />
              <div>
                <span className="font-medium text-slate-900">Desparasitado</span>
                <p className="text-sm text-slate-500">Tratamiento reciente</p>
              </div>
            </label>
          </div>
          
          <textarea
            {...register('saludNotas')}
            rows={3}
            className="input"
            placeholder="Notas adicionales sobre la salud: alergias, lesiones, tratamientos en curso, etc."
          />
        </div>

        {/* Compatibilidad */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center mb-6">
            <Heart className="w-5 h-5 text-slate-600 mr-3" />
            <h3 className="text-lg font-semibold text-slate-900">Compatibilidad</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
              <input
                {...register('aptoNinos')}
                type="checkbox"
                className="rounded border-slate-300 text-atlixco-500 focus:ring-atlixco-500 mr-3"
              />
              <span className="text-slate-700">Apto para niños</span>
            </label>
            
            <label className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
              <input
                {...register('aptoPerros')}
                type="checkbox"
                className="rounded border-slate-300 text-atlixco-500 focus:ring-atlixco-500 mr-3"
              />
              <span className="text-slate-700">Se lleva bien con otros perros</span>
            </label>
            
            <label className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
              <input
                {...register('aptoGatos')}
                type="checkbox"
                className="rounded border-slate-300 text-atlixco-500 focus:ring-atlixco-500 mr-3"
              />
              <span className="text-slate-700">Se lleva bien con gatos</span>
            </label>
          </div>
        </div>

        {/* Características */}
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Características de Personalidad</h3>
          
          {/* Características actuales */}
          <div className="flex flex-wrap gap-2 mb-4">
            {watchedCaracter.map((caracteristica, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-atlixco-100 text-atlixco-800 rounded-full text-sm"
              >
                {caracteristica}
                <button
                  type="button"
                  onClick={() => removerCaracteristica(index)}
                  className="ml-2 hover:text-atlixco-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Agregar característica personalizada */}
          <div className="flex gap-2 mb-4">
            <input
              value={nuevaCaracteristica}
              onChange={(e) => setNuevaCaracteristica(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  agregarCaracteristica(nuevaCaracteristica)
                }
              }}
              className="input flex-1"
              placeholder="Agregar característica personalizada"
            />
            <button
              type="button"
              onClick={() => agregarCaracteristica(nuevaCaracteristica)}
              className="px-4 py-2 bg-atlixco-600 text-white rounded-lg hover:bg-atlixco-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Características sugeridas */}
          <div className="flex flex-wrap gap-2">
            {caracteristicasSugeridas
              .filter(c => !watchedCaracter.includes(c))
              .map((caracteristica) => (
              <button
                key={caracteristica}
                type="button"
                onClick={() => agregarCaracteristica(caracteristica)}
                className="px-3 py-1 border border-slate-300 text-slate-700 rounded-full text-sm hover:bg-slate-50 transition-colors"
              >
                + {caracteristica}
              </button>
            ))}
          </div>

          {errors.caracter && (
            <p className="text-red-600 text-sm mt-2">{errors.caracter.message}</p>
          )}
        </div>

        {/* Fotos */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center mb-6">
            <Camera className="w-5 h-5 text-slate-600 mr-3" />
            <h3 className="text-lg font-semibold text-slate-900">Fotos</h3>
          </div>
          
          {/* Foto principal */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              URL de Foto Principal <span className="text-red-500">*</span>
            </label>
            <input
              {...register('fotoPrincipal')}
              className="input"
              placeholder="https://ejemplo.com/foto.jpg"
            />
            {errors.fotoPrincipal && (
              <p className="text-red-600 text-sm mt-1">{errors.fotoPrincipal.message}</p>
            )}
            {getValues('fotoPrincipal') && (
              <img 
                src={getValues('fotoPrincipal')} 
                alt="Vista previa" 
                className="mt-2 w-32 h-32 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Galería de fotos */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Galería de Fotos
            </label>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {watchedFotos.map((foto, index) => (
                <div key={index} className="relative group">
                  <img
                    src={foto}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => removerFoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('fotoPrincipal', foto)}
                    className={`absolute bottom-1 left-1 px-2 py-1 text-xs rounded transition-all ${
                      getValues('fotoPrincipal') === foto 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white/80 text-slate-700 hover:bg-white opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {getValues('fotoPrincipal') === foto ? 'Principal' : 'Hacer principal'}
                  </button>
                </div>
              ))}
            </div>

            {/* Agregar nueva foto */}
            <div className="space-y-4">
              {/* Temporalmente usando SimpleImageUploader mientras se soluciona UploadThing */}
              <SimpleImageUploader
                onImageAdded={(url) => {
                  const actual = getValues('fotos')
                  setValue('fotos', [...actual, url])
                  
                  // Si no hay foto principal, establecer esta como principal
                  if (!getValues('fotoPrincipal')) {
                    setValue('fotoPrincipal', url)
                  }
                }}
              />
              
              {/* Mantenemos el uploader original comentado para cuando se solucione
              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-2">Sube imágenes directamente:</p>
                <ImageUploader
                  onImageUploaded={(url) => {
                    const actual = getValues('fotos')
                    setValue('fotos', [...actual, url])
                    
                    // Si no hay foto principal, establecer esta como principal
                    if (!getValues('fotoPrincipal')) {
                      setValue('fotoPrincipal', url)
                    }
                  }}
                  onError={(error) => {
                    setError(error)
                  }}
                />
              </div>
              */}
            </div>
            {errors.fotos && (
              <p className="text-red-600 text-sm mt-2">{errors.fotos.message}</p>
            )}
          </div>
        </div>

        {/* Opciones adicionales */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center mb-6">
            <FileText className="w-5 h-5 text-slate-600 mr-3" />
            <h3 className="text-lg font-semibold text-slate-900">Configuración</h3>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                {...register('destacado')}
                type="checkbox"
                className="rounded border-slate-300 text-atlixco-500 focus:ring-atlixco-500 mr-3"
              />
              <div>
                <span className="font-medium text-slate-900">Destacar en página principal</span>
                <p className="text-sm text-slate-500">Esta mascota aparecerá en la sección de destacados</p>
              </div>
            </label>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <select {...register('estado')} className="input">
                  <option value="disponible">Disponible para adopción</option>
                  <option value="proceso">En proceso de adopción</option>
                  <option value="adoptado">Adoptado</option>
                </select>
              </div>
            )}
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
                {isEditing ? 'Actualizar Mascota' : 'Registrar Mascota'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}