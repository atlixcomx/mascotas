'use client'

import { useState } from 'react'
import { UploadButton } from '../UploadButton'
import { Upload, X, AlertCircle } from 'lucide-react'

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void
  onError?: (error: string) => void
}

export function ImageUploader({ onImageUploaded, onError }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleUploadComplete = (res: any) => {
    setIsUploading(false)
    setUploadError(null)
    
    if (res && res[0] && res[0].url) {
      onImageUploaded(res[0].url)
    }
  }

  const handleUploadError = (error: Error) => {
    setIsUploading(false)
    const errorMessage = error.message || 'Error al subir la imagen'
    setUploadError(errorMessage)
    
    if (onError) {
      onError(errorMessage)
    }
    
    // Log para debugging
    console.error('Upload error:', error)
  }

  const handleUploadBegin = () => {
    setIsUploading(true)
    setUploadError(null)
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <UploadButton
          endpoint="petImageUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
          onUploadBegin={handleUploadBegin}
          appearance={{
            button: {
              backgroundColor: isUploading ? '#9ca3af' : '#4f46e5',
              color: 'white',
              '&:hover': {
                backgroundColor: isUploading ? '#9ca3af' : '#4338ca',
              },
            },
            allowedContent: {
              display: 'none',
            },
          }}
          content={{
            button({ ready }) {
              if (!ready) return "Preparando..."
              if (isUploading) return "Subiendo..."
              return (
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span>Subir imagen</span>
                </div>
              )
            },
          }}
        />
      </div>

      {uploadError && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-700">
            <p className="font-medium">Error al subir la imagen</p>
            <p className="text-xs mt-1">{uploadError}</p>
            {uploadError.includes('UploadThing') && (
              <p className="text-xs mt-1">
                Verifica que las credenciales de UploadThing estén configuradas correctamente.
              </p>
            )}
          </div>
        </div>
      )}

      {isUploading && (
        <div className="text-sm text-slate-600 flex items-center gap-2">
          <div className="animate-spin rounded-full h-3 w-3 border-2 border-slate-600 border-t-transparent"></div>
          Subiendo imagen...
        </div>
      )}
    </div>
  )
}