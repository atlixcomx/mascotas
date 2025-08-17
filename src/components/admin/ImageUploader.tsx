'use client'

import { useState } from 'react'
import { UploadButton } from '../UploadButton'
import { Upload, X, AlertCircle } from 'lucide-react'

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void
  onError?: (error: string) => void
  endpoint?: 'petImageUploader' | 'newsImageUploader'
}

export function ImageUploader({ onImageUploaded, onError, endpoint = 'petImageUploader' }: ImageUploaderProps) {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ position: 'relative' }}>
        <UploadButton
          endpoint={endpoint}
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
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          padding: '12px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px'
        }}>
          <AlertCircle size={16} style={{ 
            color: '#ef4444', 
            marginTop: '2px', 
            flexShrink: 0 
          }} />
          <div style={{ fontSize: '14px', color: '#991b1b' }}>
            <p style={{ fontWeight: '500', marginBottom: '4px' }}>Error al subir la imagen</p>
            <p style={{ fontSize: '12px', marginBottom: '4px' }}>{uploadError}</p>
            {uploadError.includes('UploadThing') && (
              <p style={{ fontSize: '12px' }}>
                Verifica que las credenciales de UploadThing estén configuradas correctamente.
              </p>
            )}
          </div>
        </div>
      )}

      {isUploading && (
        <div style={{
          fontSize: '14px',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⏳</span>
          Subiendo imagen...
        </div>
      )}
    </div>
  )
}