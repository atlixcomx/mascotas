import { prisma } from '../../lib/db'

export interface FileAttachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  fileUrl: string
  uploadedAt: Date
  uploadedBy: string
  category: 'identificacion' | 'comprobante_domicilio' | 'referencias' | 'otros'
}

export interface AttachmentMetadata {
  solicitudId?: string
  perritoId?: string
  expedienteId?: string
  category: string
  description?: string
}

// Configuración de tipos de archivo permitidos
export const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  all: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const FILE_CATEGORIES = {
  identificacion: 'Identificación Oficial',
  comprobante_domicilio: 'Comprobante de Domicilio',
  referencias: 'Cartas de Referencia',
  otros: 'Otros Documentos'
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  // Verificar tipo de archivo
  if (!ALLOWED_FILE_TYPES.all.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de archivo no permitido. Solo se permiten imágenes (JPG, PNG, WebP) y documentos (PDF, Word).'
    }
  }

  // Verificar tamaño
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `El archivo es demasiado grande. El tamaño máximo permitido es ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
    }
  }

  return { valid: true }
}

export function getFileCategory(fileType: string): string {
  if (ALLOWED_FILE_TYPES.images.includes(fileType)) {
    return 'imagen'
  }
  if (ALLOWED_FILE_TYPES.documents.includes(fileType)) {
    return 'documento'
  }
  return 'archivo'
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Función para generar un nombre único para el archivo
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  const nameWithoutExt = originalName.split('.').slice(0, -1).join('.')
  const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
  
  return `${sanitizedName}-${timestamp}-${randomString}.${extension}`
}

// Mock para almacenar archivos en memoria (en producción usarías S3, Cloudinary, etc.)
const fileStorage = new Map<string, {
  data: ArrayBuffer
  metadata: FileAttachment
}>()

export async function uploadFile(
  file: File,
  metadata: AttachmentMetadata,
  uploadedBy: string
): Promise<FileAttachment> {
  // Validar archivo
  const validation = validateFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Generar nombre único
  const uniqueFileName = generateUniqueFileName(file.name)
  const fileId = Math.random().toString(36).substring(2, 15)
  
  // En producción, aquí subirías a S3, Cloudinary, etc.
  // Por ahora, simulamos el almacenamiento
  const arrayBuffer = await file.arrayBuffer()
  const fileUrl = `/api/attachments/${fileId}/${uniqueFileName}`
  
  const attachment: FileAttachment = {
    id: fileId,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    fileUrl,
    uploadedAt: new Date(),
    uploadedBy,
    category: metadata.category as any
  }
  
  // Almacenar en memoria (mock)
  fileStorage.set(fileId, {
    data: arrayBuffer,
    metadata: attachment
  })
  
  // En producción, aquí guardarías la metadata en la base de datos
  // await prisma.attachment.create({ data: { ...attachment, ...metadata } })
  
  return attachment
}

export async function getFile(fileId: string): Promise<{ data: ArrayBuffer; metadata: FileAttachment } | null> {
  return fileStorage.get(fileId) || null
}

export async function deleteFile(fileId: string): Promise<boolean> {
  // En producción, eliminarías de S3/Cloudinary y de la base de datos
  return fileStorage.delete(fileId)
}

export async function getAttachmentsBySolicitud(solicitudId: string): Promise<FileAttachment[]> {
  // En producción, consultarías la base de datos
  // return await prisma.attachment.findMany({ where: { solicitudId } })
  
  // Mock: filtrar archivos en memoria
  const attachments: FileAttachment[] = []
  fileStorage.forEach((file, id) => {
    // En un sistema real, tendrías la relación con solicitudId
    attachments.push(file.metadata)
  })
  return attachments
}