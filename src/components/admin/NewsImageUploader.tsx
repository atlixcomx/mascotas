'use client'

import { useState } from 'react'
import { UploadButton } from '../UploadButton'
import { Upload, X, AlertCircle, Image } from 'lucide-react'

interface NewsImageUploaderProps {
  onImageUploaded: (url: string) => void
  onError?: (error: string) => void
  currentImage?: string
}

export function NewsImageUploader({ onImageUploaded, onError, currentImage }: NewsImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  const handleUploadComplete = (res: any) => {
    setIsUploading(false)
    setUploadError(null)
    
    if (res && res[0] && res[0].url) {
      setUploadedUrl(res[0].url)
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
    
    console.error('Upload error:', error)
  }

  const handleUploadBegin = () => {
    setIsUploading(true)
    setUploadError(null)
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <UploadButton
          endpoint="newsImageUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
          onUploadBegin={handleUploadBegin}
          appearance={{
            button: {
              backgroundColor: isUploading ? '#9ca3af' : '#0891b2',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              '&:hover': {
                backgroundColor: isUploading ? '#9ca3af' : '#0c7490',
              },
            },
            allowedContent: {
              color: '#6b7280',
              fontSize: '12px',
              marginTop: '8px'
            },
          }}
          content={{
            button({ ready }) {
              if (!ready) return "Preparando..."
              if (isUploading) return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <span>Subiendo imagen...</span>
                </div>
              )
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Upload size={18} />
                  <span>Seleccionar imagen</span>
                </div>
              )
            },
            allowedContent() {
              return "Imágenes hasta 8MB (JPG, PNG, GIF, WEBP)"
            }
          }}
        />
      </div>

      {uploadError && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          padding: '12px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px'
        }}>
          <AlertCircle size={16} style={{ color: '#dc2626', marginTop: '2px', flexShrink: 0 }} />
          <div style={{ fontSize: '14px', color: '#991b1b' }}>
            <p style={{ fontWeight: '600', marginBottom: '4px' }}>Error al subir la imagen</p>
            <p style={{ fontSize: '12px' }}>{uploadError}</p>
            {uploadError.includes('UploadThing') && (
              <p style={{ fontSize: '12px', marginTop: '4px' }}>
                Verifica que las credenciales de UploadThing estén configuradas.
              </p>
            )}
          </div>
        </div>
      )}

      {isUploading && (
        <div style={{
          fontSize: '14px',
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            border: '2px solid #6b7280',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Subiendo imagen a la nube...
        </div>
      )}

      {uploadedUrl && !isUploading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
          backgroundColor: '#dcfce7',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#166534'
        }}>
          <Image size={16} />
          <span style={{ fontWeight: '500' }}>Imagen subida exitosamente</span>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}