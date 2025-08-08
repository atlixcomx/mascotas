import { z } from 'zod'

// Esquemas base para campos complejos
const vacunaSchema = z.object({
  nombre: z.string().min(1, 'Nombre de la vacuna es requerido'),
  fecha: z.string().refine((date) => !isNaN(Date.parse(date)), 'Fecha inválida'),
  veterinario: z.string().min(1, 'Veterinario es requerido')
})

const tratamientoSchema = z.object({
  descripcion: z.string().min(1, 'Descripción del tratamiento es requerida'),
  fechaInicio: z.string().refine((date) => !isNaN(Date.parse(date)), 'Fecha de inicio inválida'),
  fechaFin: z.string().optional().refine((date) => !date || !isNaN(Date.parse(date)), 'Fecha de fin inválida')
})

// Esquema para crear perrito
export const crearPerritoSchema = z.object({
  // Información básica
  nombre: z.string().min(1, 'Nombre es requerido').max(100, 'Nombre muy largo'),
  raza: z.string().min(1, 'Raza es requerida').max(50, 'Raza muy larga'),
  edad: z.string().min(1, 'Edad es requerida'),
  sexo: z.enum(['macho', 'hembra'], { required_error: 'Sexo es requerido' }),
  tamano: z.enum(['chico', 'mediano', 'grande'], { required_error: 'Tamaño es requerido' }),
  peso: z.number().positive('Peso debe ser positivo').optional(),

  // Historia y procedencia
  historia: z.string().min(10, 'Historia debe tener al menos 10 caracteres'),
  tipoIngreso: z.enum(['entrega_voluntaria', 'rescate', 'decomiso'], { required_error: 'Tipo de ingreso es requerido' }),
  procedencia: z.string().optional(),
  responsableIngreso: z.string().optional(),

  // Salud básica
  vacunas: z.boolean().default(false),
  esterilizado: z.boolean().default(false),
  desparasitado: z.boolean().default(false),
  saludNotas: z.string().optional(),

  // Campos adicionales del requerimiento
  padecimientos: z.array(z.string()).default([]),
  vacunasDetalle: z.array(vacunaSchema).default([]),
  tratamientos: z.array(tratamientoSchema).default([]),
  alergias: z.array(z.string()).default([]),

  // Temperamento
  energia: z.enum(['baja', 'media', 'alta'], { required_error: 'Nivel de energía es requerido' }),
  aptoNinos: z.boolean().default(false),
  aptoPerros: z.boolean().default(false),
  aptoGatos: z.boolean().default(false),
  caracter: z.array(z.string()).default([]),

  // Fotos
  fotoPrincipal: z.string().url('URL de foto principal inválida').optional(),
  fotos: z.array(z.string().url('URL de foto inválida')).default([]),
  fotosInternas: z.array(z.string().url('URL de foto interna inválida')).default([]),
  fotosCatalogo: z.array(z.string().url('URL de foto catálogo inválida')).default([]),

  // Estado
  destacado: z.boolean().default(false),
  estado: z.enum(['disponible', 'proceso', 'adoptado']).default('disponible')
})

// Esquema para actualizar perrito (todos los campos opcionales excepto ID)
export const actualizarPerritoSchema = crearPerritoSchema.partial()

// Esquema para filtros de búsqueda
export const filtrosPerritoSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  estado: z.enum(['disponible', 'proceso', 'adoptado']).optional(),
  tamano: z.enum(['chico', 'mediano', 'grande']).optional(),
  tipoIngreso: z.enum(['entrega_voluntaria', 'rescate', 'decomiso']).optional(),
  fechaInicio: z.string().refine((date) => !date || !isNaN(Date.parse(date)), 'Fecha inicio inválida').optional(),
  fechaFin: z.string().refine((date) => !date || !isNaN(Date.parse(date)), 'Fecha fin inválida').optional(),
  energia: z.enum(['baja', 'media', 'alta']).optional(),
  sexo: z.enum(['macho', 'hembra']).optional(),
  aptoNinos: z.boolean().optional(),
  aptoPerros: z.boolean().optional(),
  aptoGatos: z.boolean().optional(),
  vacunas: z.boolean().optional(),
  esterilizado: z.boolean().optional(),
  destacado: z.boolean().optional()
})

// Esquema para subir fotos
export const subirFotoSchema = z.object({
  tipo: z.enum(['principal', 'galeria', 'interna', 'catalogo'], { required_error: 'Tipo de foto es requerido' }),
  archivo: z.any().refine((file) => file instanceof File, 'Archivo es requerido'),
  descripcion: z.string().optional()
})

// Esquema para eliminar foto
export const eliminarFotoSchema = z.object({
  fotoId: z.string().min(1, 'ID de foto es requerido'),
  tipo: z.enum(['principal', 'galeria', 'interna', 'catalogo'], { required_error: 'Tipo de foto es requerido' })
})

// Tipos TypeScript derivados de los esquemas
export type CrearPerritoInput = z.infer<typeof crearPerritoSchema>
export type ActualizarPerritoInput = z.infer<typeof actualizarPerritoSchema>
export type FiltrosPerritoInput = z.infer<typeof filtrosPerritoSchema>
export type SubirFotoInput = z.infer<typeof subirFotoSchema>
export type EliminarFotoInput = z.infer<typeof eliminarFotoSchema>
export type VacunaInput = z.infer<typeof vacunaSchema>
export type TratamientoInput = z.infer<typeof tratamientoSchema>