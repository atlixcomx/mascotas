'use client'

import { useState } from 'react'
import { Upload, X, AlertCircle } from 'lucide-react'

interface CloudinaryUploaderProps {
  onUploadComplete: (url: string) => void
  onUploadError?: (error: Error) => void
}

export default function CloudinaryUploader({ onUploadComplete, onUploadError }: CloudinaryUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vista previa local
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setUploading(true)

    try {
      // Subir a un servicio gratuito como ImgBB
      const formData = new FormData()
      formData.append('image', file)

      // Usar el endpoint local que creamos
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Error al subir imagen')
      }

      const data = await response.json()
      if (data.success) {
        onUploadComplete(data.data.url)
      } else {
        throw new Error(data.error?.message || 'Error desconocido')
      }
    } catch (error) {
      console.error('Error uploading:', error)
      onUploadError?.(error as Error)
      
      // Como fallback, usar la imagen en base64
      if (preview) {
        console.log('Usando preview local como fallback')
        onUploadComplete(preview)
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click para subir</span> o arrastra una imagen
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>

      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-white">Subiendo...</div>
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Solución temporal</p>
            <p>Mientras resolvemos el problema con UploadThing, las imágenes se subirán a un servicio alternativo o se guardarán localmente.</p>
          </div>
        </div>
      </div>
    </div>
  )
}