'use client'

import React, { useState, useEffect } from 'react'
import { 
  FileText, 
  Image as ImageIcon, 
  Download, 
  Eye, 
  Trash2,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { FileAttachment, formatFileSize, FILE_CATEGORIES } from '../../lib/attachments'

interface AttachmentsListProps {
  solicitudId: string
  canDelete?: boolean
}

export function AttachmentsList({ solicitudId, canDelete = false }: AttachmentsListProps) {
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAttachments()
  }, [solicitudId])

  const fetchAttachments = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/attachments/upload?solicitudId=${solicitudId}`)
      if (response.ok) {
        const data = await response.json()
        setAttachments(data.attachments || [])
      } else {
        setError('Error al cargar archivos adjuntos')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (fileId: string) => {
    if (!confirm('¿Estás seguro de eliminar este archivo?')) {
      return
    }

    try {
      const response = await fetch(`/api/attachments/${fileId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setAttachments(prev => prev.filter(a => a.id !== fileId))
      } else {
        alert('Error al eliminar archivo')
      }
    } catch (err) {
      alert('Error al eliminar archivo')
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return <ImageIcon style={{ width: '20px', height: '20px' }} />
    }
    return <FileText style={{ width: '20px', height: '20px' }} />
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'identificacion': '#3b82f6',
      'comprobante_domicilio': '#10b981',
      'referencias': '#8b5cf6',
      'otros': '#6b7280'
    }
    return colors[category] || '#6b7280'
  }

  if (loading) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: '12px'
      }}>
        <Loader2 style={{ 
          width: '32px', 
          height: '32px', 
          color: '#6b7280',
          margin: '0 auto 12px',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#6b7280', margin: 0 }}>Cargando archivos adjuntos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: '#fef2f2',
        borderRadius: '12px',
        border: '1px solid #fecaca',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <AlertCircle style={{ width: '20px', height: '20px', color: '#ef4444' }} />
        <p style={{ color: '#991b1b', margin: 0 }}>{error}</p>
      </div>
    )
  }

  if (attachments.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <FileText style={{ 
          width: '48px', 
          height: '48px', 
          color: '#d1d5db',
          margin: '0 auto 12px'
        }} />
        <p style={{ 
          color: '#6b7280', 
          margin: 0,
          fontSize: '0.875rem'
        }}>
          No hay archivos adjuntos para esta solicitud
        </p>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f8fafc'
      }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: '#1f2937',
          margin: 0
        }}>
          Archivos Adjuntos ({attachments.length})
        </h3>
      </div>

      <div style={{ padding: '12px' }}>
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc'
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            {/* Icono del archivo */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: `${getCategoryColor(attachment.category)}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {React.cloneElement(getFileIcon(attachment.fileType), {
                style: { 
                  ...getFileIcon(attachment.fileType).props.style, 
                  color: getCategoryColor(attachment.category) 
                }
              })}
            </div>

            {/* Información del archivo */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#1f2937',
                margin: '0 0 4px 0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {attachment.fileName}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.75rem',
                color: '#6b7280'
              }}>
                <span>{formatFileSize(attachment.fileSize)}</span>
                <span>•</span>
                <span>{FILE_CATEGORIES[attachment.category] || attachment.category}</span>
                <span>•</span>
                <span>{new Date(attachment.uploadedAt).toLocaleDateString('es-MX')}</span>
              </div>
            </div>

            {/* Acciones */}
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <a
                href={attachment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  color: '#4f46e5',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                title="Ver archivo"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
                }}
              >
                <Eye style={{ width: '16px', height: '16px' }} />
              </a>
              
              <a
                href={attachment.fileUrl}
                download
                style={{
                  padding: '8px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  color: '#059669',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                title="Descargar archivo"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
                }}
              >
                <Download style={{ width: '16px', height: '16px' }} />
              </a>

              {canDelete && (
                <button
                  onClick={() => handleDelete(attachment.id)}
                  style={{
                    padding: '8px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    color: '#ef4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  title="Eliminar archivo"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fee2e2'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2'
                  }}
                >
                  <Trash2 style={{ width: '16px', height: '16px' }} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}