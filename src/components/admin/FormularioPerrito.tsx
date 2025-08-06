'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Upload, X, Plus, Save, AlertCircle } from 'lucide-react'

interface PerritoData {
  id?: string
  nombre: string
  raza: string
  edad: string
  sexo: string
  tamano: string
  peso?: number
  historia: string
  procedencia?: string
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
  raza: z.string().min(2, 'La raza es requerida'),
  edad: z.string().min(1, 'La edad es requerida'),
  sexo: z.enum(['macho', 'hembra'], { errorMap: () => ({ message: 'Selecciona el sexo' }) }),
  tamano: z.enum(['chico', 'mediano', 'grande'], { errorMap: () => ({ message: 'Selecciona el tamaño' }) }),
  peso: z.number().positive().optional(),
  historia: z.string().min(20, 'La historia debe tener al menos 20 caracteres'),
  procedencia: z.string().optional(),
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
  'Inteligente', 'Obediente', 'Independiente', 'Curioso', 'Leal', 'Amigable'
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
      raza: perrito?.raza || '',
      edad: perrito?.edad || '',
      sexo: perrito?.sexo || 'macho',
      tamano: perrito?.tamano || 'mediano',
      peso: perrito?.peso || undefined,
      historia: perrito?.historia || '',
      procedencia: perrito?.procedencia || '',
      vacunas: perrito?.vacunas || false,
      esterilizado: perrito?.esterilizado || false,
      desparasitado: perrito?.desparasitado || false,
      saludNotas: perrito?.saludNotas || '',
      energia: perrito?.energia || 'media',
      aptoNinos: perrito?.aptoNinos || false,
      aptoPerros: perrito?.aptoPerros || false,
      aptoGatos: perrito?.aptoGatos || false,
      caracter: perrito?.caracter || [],
      fotoPrincipal: perrito?.fotoPrincipal || 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400',
      fotos: perrito?.fotos || ['https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400'],
      destacado: perrito?.destacado || false,
      estado: perrito?.estado || 'disponible'
    }
  })

  const watchedCaracter = watch('caracter')
  const watchedFotos = watch('fotos')

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
      setValue('fotos', [...actual, nuevaFoto.trim()])
      // Si es la primera foto, también ponerla como principal
      if (actual.length === 0) {
        setValue('fotoPrincipal', nuevaFoto.trim())
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
    if (fotoPrincipal === actual[index] && nuevasFotos.length > 0) {
      setValue('fotoPrincipal', nuevasFotos[0])
    }
  }

  const onSubmit = async (data: PerritoFormData) => {
    setLoading(true)
    setError('')
    setSuccess('')

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

      setSuccess(isEditing ? 'Perrito actualizado exitosamente' : 'Perrito creado exitosamente')
      
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
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Información Básica */}
        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-4">Información Básica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre *
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
                Raza *
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
                Edad *
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
                Sexo *
              </label>
              <select {...register('sexo')} className="input">
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tamaño *
              </label>
              <select {...register('tamano')} className="input">
                <option value="chico">Chico</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
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
                Procedencia
              </label>
              <input
                {...register('procedencia')}
                className="input"
                placeholder="Rescate callejero, entrega voluntaria, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nivel de Energía *
              </label>
              <select {...register('energia')} className="input">
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>
        </div>

        {/* Historia */}
        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-4">Historia</h3>
          <textarea
            {...register('historia')}
            rows={5}
            className="input"
            placeholder="Cuenta la historia de este perrito, cómo llegó al centro, su personalidad, etc."
          />
          {errors.historia && (
            <p className="text-red-600 text-sm mt-1">{errors.historia.message}</p>
          )}
        </div>

        {/* Estado de Salud */}
        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-4">Estado de Salud</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <label className="flex items-center">
              <input
                {...register('vacunas')}
                type="checkbox"
                className="rounded border-slate-300 text-atlixco-500 focus:ring-atlixco-500"
              />
              <span className="ml-2 text-sm text-slate-700">Vacunado</span>
            </label>
            <label className="flex items-center">
              <input
                {...register('esterilizado')}
                type="checkbox"
                className="rounded border-slate-300 text-atlixco-500 focus:ring-atlixco-500"
              />
              <span className="ml-2 text-sm text-slate-700">Esterilizado</span>
            </label>
            <label className="flex items-center">
              <input
                {...register('desparasitado')}
                type="checkbox"
                className="rounded border-slate-300 text-atlixco-500 focus:ring-atlixco-500"
              />
              <span className="ml-2 text-sm text-slate-700">Desparasitado</span>
            </label>
          </div>
          <textarea
            {...register('saludNotas')}
            rows={3}
            className="input"
            placeholder="Notas adicionales sobre la salud del perrito"
          />
        </div>

        {/* Compatibilidad */}
        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-4">Compatibilidad</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center">
              <input
                {...register('aptoNinos')}
                type="checkbox"
                className="rounded border-slate-300 text-atlixco-500 focus:ring-atlixco-500"
              />
              <span className="ml-2 text-sm text-slate-700">Apto para niños</span>
            </label>
            <label className="flex items-center">
              <input
                {...register('aptoPerros')}
                type="checkbox"
                className="rounded border-slate-300 text-atlixco-500 focus:ring-atlixco-500"
              />
              <span className="ml-2 text-sm text-slate-700">Apto para otros perros</span>
            </label>
            <label className="flex items-center">
              <input
                {...register('aptoGatos')}
                type="checkbox"
                className="rounded border-slate-300 text-atlixco-500 focus:ring-atlixco-500"
              />
              <span className="ml-2 text-sm text-slate-700">Apto para gatos</span>
            </label>
          </div>
        </div>

        {/* Características */}
        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-4">Características de Personalidad</h3>
          
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
        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-4">Fotos</h3>
          
          {/* Foto principal */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Foto Principal *
            </label>
            <input
              {...register('fotoPrincipal')}
              className="input"
              placeholder="https://ejemplo.com/foto.jpg"
            />
            {errors.fotoPrincipal && (
              <p className="text-red-600 text-sm mt-1">{errors.fotoPrincipal.message}</p>
            )}
          </div>

          {/* Galería de fotos */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Galería de Fotos
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {watchedFotos.map((foto, index) => (
                <div key={index} className="relative">
                  <img
                    src={foto}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => removerFoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('fotoPrincipal', foto)}
                    className={`absolute bottom-1 left-1 px-2 py-1 text-xs rounded ${
                      getValues('fotoPrincipal') === foto 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white/80 text-slate-700 hover:bg-white'
                    }`}
                  >
                    {getValues('fotoPrincipal') === foto ? 'Principal' : 'Hacer principal'}
                  </button>
                </div>
              ))}
            </div>

            {/* Agregar nueva foto */}
            <div className="flex gap-2">
              <input
                value={nuevaFoto}
                onChange={(e) => setNuevaFoto(e.target.value)}
                className="input flex-1"
                placeholder="https://ejemplo.com/nueva-foto.jpg"
              />
              <button
                type="button"
                onClick={agregarFoto}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
              </button>
            </div>
            {errors.fotos && (
              <p className="text-red-600 text-sm mt-2">{errors.fotos.message}</p>
            )}
          </div>
        </div>

        {/* Opciones adicionales */}
        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-4">Opciones</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                {...register('destacado')}
                type="checkbox"
                className="rounded border-slate-300 text-atlixco-500 focus:ring-atlixco-500"
              />
              <span className="ml-2 text-sm text-slate-700">
                Marcar como destacado (aparecerá en la página principal)
              </span>
            </label>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <select {...register('estado')} className="input">
                  <option value="disponible">Disponible</option>
                  <option value="proceso">En Proceso</option>
                  <option value="adoptado">Adoptado</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
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
            <Save className="h-4 w-4 mr-2" />
            {loading 
              ? 'Guardando...' 
              : isEditing 
              ? 'Actualizar Perrito' 
              : 'Crear Perrito'
            }
          </button>
        </div>
      </form>
    </div>
  )
}