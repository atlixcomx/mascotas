'use client'

import React, { useState, useRef } from 'react'
import { 
  Upload, 
  File, 
  X, 
  Check, 
  AlertCircle,
  FileText,
  Image,
  Loader2
} from 'lucide-react'
import { 
  validateFile, 
  formatFileSize, 
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  FILE_CATEGORIES,
  FileAttachment
} from '../lib/attachments'

interface FileUploadProps {
  onUpload: (file: File, category: string) => Promise<FileAttachment>
  onRemove?: (fileId: string) => Promise<void>
  category?: string
  showCategorySelect?: boolean
  maxFiles?: number
  uploadedFiles?: FileAttachment[]
  disabled?: boolean
}

export function FileUpload({
  onUpload,
  onRemove,
  category = 'otros',
  showCategorySelect = true,
  maxFiles = 5,
  uploadedFiles = [],
  disabled = false
}: FileUploadProps) {
  const [selectedCategory, setSelectedCategory] = useState(category)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files: FileList) => {
    setError(null)
    
    // Verificar límite de archivos
    if (uploadedFiles.length + files.length > maxFiles) {
      setError(`Solo puedes subir un máximo de ${maxFiles} archivos`)
      return
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validar archivo
      const validation = validateFile(file)
      if (!validation.valid) {
        setError(validation.error!)
        continue
      }

      // Subir archivo
      try {
        setUploading(true)
        await onUpload(file, selectedCategory)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al subir el archivo')
      } finally {
        setUploading(false)
      }
    }
  }

  const handleRemove = async (fileId: string) => {
    if (onRemove) {
      try {
        await onRemove(fileId)
      } catch (err) {
        setError('Error al eliminar el archivo')
      }
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return <Image style={{ width: '16px', height: '16px' }} />
    }
    return <FileText style={{ width: '16px', height: '16px' }} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Selector de categoría */}
      {showCategorySelect && (
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: '#374151',
            marginBottom: '8px'
          }}>
            Tipo de documento
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={disabled || uploading}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              cursor: disabled || uploading ? 'not-allowed' : 'pointer'
            }}
          >
            {Object.entries(FILE_CATEGORIES).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Área de carga */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          position: 'relative',
          padding: '32px',
          borderRadius: '8px',
          border: `2px dashed ${dragActive ? '#4f46e5' : '#d1d5db'}`,
          backgroundColor: dragActive ? '#f0f9ff' : disabled ? '#f9fafb' : '#ffffff',
          cursor: disabled || uploading ? 'not-allowed' : 'pointer',
          textAlign: 'center',
          transition: 'all 0.2s',
          opacity: disabled ? 0.6 : 1
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          onChange={handleChange}
          accept={ALLOWED_FILE_TYPES.all.join(',')}
          disabled={disabled || uploading}
          style={{ display: 'none' }}
        />

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '12px' 
        }}>
          {uploading ? (
            <Loader2 style={{ 
              width: '40px', 
              height: '40px', 
              color: '#4f46e5',
              animation: 'spin 1s linear infinite'
            }} />
          ) : (
            <Upload style={{ 
              width: '40px', 
              height: '40px', 
              color: dragActive ? '#4f46e5' : '#9ca3af' 
            }} />
          )}
          
          <div>
            <p style={{ 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#1f2937',
              margin: '0 0 4px 0'
            }}>
              {uploading ? 'Subiendo archivo...' : 'Arrastra archivos aquí o haz clic para seleccionar'}
            </p>
            <p style={{ 
              fontSize: '0.75rem', 
              color: '#6b7280',
              margin: 0
            }}>
              JPG, PNG, PDF o Word (máx. {MAX_FILE_SIZE / (1024 * 1024)}MB)
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '12px',
          borderRadius: '6px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle style={{ width: '16px', height: '16px', color: '#ef4444', flexShrink: 0 }} />
          <p style={{ fontSize: '0.875rem', color: '#991b1b', margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Archivos subidos */}
      {uploadedFiles.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: '#374151',
            margin: 0
          }}>
            Archivos adjuntos ({uploadedFiles.length}/{maxFiles})
          </p>
          
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              style={{
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: '#e0e7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {getFileIcon(file.fileType)}
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#1f2937',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {file.fileName}
                </p>
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: '#6b7280',
                  margin: 0
                }}>
                  {formatFileSize(file.fileSize)} • {FILE_CATEGORIES[file.category] || file.category}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '6px',
                    borderRadius: '4px',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    color: '#4f46e5',
                    textDecoration: 'none',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}
                >
                  Ver
                </a>
                {onRemove && !disabled && (
                  <button
                    onClick={() => handleRemove(file.id)}
                    style={{
                      padding: '6px',
                      borderRadius: '4px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <X style={{ width: '14px', height: '14px' }} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}