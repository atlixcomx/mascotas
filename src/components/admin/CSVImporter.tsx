'use client'

import React, { useState, useRef } from 'react'
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  AlertCircle, 
  CheckCircle,
  X,
  Loader2,
  Info
} from 'lucide-react'

interface CSVImporterProps {
  type: 'perritos' | 'solicitudes'
  onImport: (data: any[]) => Promise<void>
}

export function CSVImporter({ type, onImport }: CSVImporterProps) {
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const templates = {
    perritos: {
      headers: ['nombre', 'edad', 'sexo', 'tamaño', 'raza', 'descripcion', 'personalidad', 'salud', 'estado'],
      example: [
        ['Max', '2 años', 'macho', 'mediano', 'Mestizo', 'Perro muy amigable y juguetón', 'Activo, Juguetón, Amigable', 'Vacunado, Esterilizado', 'disponible'],
        ['Luna', '1 año', 'hembra', 'pequeño', 'Chihuahua', 'Perrita cariñosa y tranquila', 'Tranquila, Cariñosa', 'Vacunada', 'disponible']
      ]
    },
    solicitudes: {
      headers: ['nombre', 'email', 'telefono', 'direccion', 'ciudad', 'codigoPostal', 'perritoNombre', 'estado', 'fecha'],
      example: [
        ['Juan Pérez', 'juan@email.com', '5551234567', 'Calle 123', 'Atlixco', '74200', 'Max', 'nueva', '2024-01-01'],
        ['María García', 'maria@email.com', '5559876543', 'Av. Principal 456', 'Atlixco', '74200', 'Luna', 'aprobada', '2024-01-02']
      ]
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    setSuccess(null)
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim()))
        
        // Validar que tiene headers
        if (rows.length < 2) {
          setError('El archivo CSV debe contener al menos headers y una fila de datos')
          return
        }

        // Mostrar preview
        setPreview(rows.slice(0, 6)) // Headers + primeras 5 filas
      } catch (err) {
        setError('Error al leer el archivo CSV')
      }
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (preview.length < 2) return

    setIsImporting(true)
    setError(null)

    try {
      const headers = preview[0]
      const data = preview.slice(1).filter(row => row.some(cell => cell)) // Filtrar filas vacías
      
      const objects = data.map(row => {
        const obj: any = {}
        headers.forEach((header, index) => {
          obj[header] = row[index] || ''
        })
        return obj
      })

      await onImport(objects)
      setSuccess(`Se importaron ${objects.length} registros exitosamente`)
      setPreview([])
      setFileName(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al importar datos')
    } finally {
      setIsImporting(false)
    }
  }

  const downloadTemplate = () => {
    const template = templates[type]
    const csv = [
      template.headers.join(','),
      ...template.example.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `plantilla_${type}.csv`
    link.click()
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #e5e7eb'
    }}>
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <FileSpreadsheet style={{ width: '24px', height: '24px', color: '#4f46e5' }} />
        Importar {type === 'perritos' ? 'Perritos' : 'Solicitudes'} desde CSV
      </h2>

      {/* Info box */}
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
        display: 'flex',
        gap: '12px'
      }}>
        <Info style={{ width: '20px', height: '20px', color: '#0369a1', flexShrink: 0 }} />
        <div>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#075985',
            margin: '0 0 8px 0',
            fontWeight: '500'
          }}>
            Formato CSV requerido:
          </p>
          <p style={{ 
            fontSize: '0.8125rem', 
            color: '#0c4a6e',
            margin: 0,
            fontFamily: 'monospace'
          }}>
            {templates[type].headers.join(', ')}
          </p>
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <button
          onClick={downloadTemplate}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            color: '#374151',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb'
            e.currentTarget.style.borderColor = '#9ca3af'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white'
            e.currentTarget.style.borderColor = '#d1d5db'
          }}
        >
          <Download style={{ width: '16px', height: '16px' }} />
          Descargar Plantilla
        </button>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#4f46e5',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4338ca'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4f46e5'
          }}
        >
          <Upload style={{ width: '16px', height: '16px' }} />
          Seleccionar Archivo CSV
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* Nombre del archivo */}
      {fileName && (
        <div style={{
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{
            fontSize: '0.875rem',
            color: '#374151',
            fontWeight: '500'
          }}>
            {fileName}
          </span>
          <button
            onClick={() => {
              setPreview([])
              setFileName(null)
              setError(null)
              setSuccess(null)
              if (fileInputRef.current) {
                fileInputRef.current.value = ''
              }
            }}
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      )}

      {/* Preview */}
      {preview.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px'
          }}>
            Vista previa de datos:
          </h3>
          <div style={{
            overflowX: 'auto',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}>
            <table style={{
              width: '100%',
              fontSize: '0.8125rem',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  {preview[0].map((header, index) => (
                    <th
                      key={index}
                      style={{
                        padding: '8px 12px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        borderBottom: '1px solid #e5e7eb',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(1, 6).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        style={{
                          padding: '8px 12px',
                          color: '#6b7280',
                          borderBottom: '1px solid #f3f4f6',
                          whiteSpace: 'nowrap',
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {cell || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {preview.length > 6 && (
            <p style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              marginTop: '8px',
              textAlign: 'center'
            }}>
              ... y {preview.length - 6} filas más
            </p>
          )}
        </div>
      )}

      {/* Mensajes */}
      {error && (
        <div style={{
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle style={{ width: '16px', height: '16px', color: '#ef4444', flexShrink: 0 }} />
          <p style={{ fontSize: '0.875rem', color: '#991b1b', margin: 0 }}>{error}</p>
        </div>
      )}

      {success && (
        <div style={{
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#f0fdf4',
          border: '1px solid '#bbf7d0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle style={{ width: '16px', height: '16px', color: '#10b981', flexShrink: 0 }} />
          <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0 }}>{success}</p>
        </div>
      )}

      {/* Botón de importar */}
      {preview.length > 1 && (
        <button
          onClick={handleImport}
          disabled={isImporting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isImporting ? '#9ca3af' : '#10b981',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: isImporting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isImporting) {
              e.currentTarget.style.backgroundColor = '#059669'
            }
          }}
          onMouseLeave={(e) => {
            if (!isImporting) {
              e.currentTarget.style.backgroundColor = '#10b981'
            }
          }}
        >
          {isImporting ? (
            <>
              <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
              Importando...
            </>
          ) : (
            <>
              <Upload style={{ width: '16px', height: '16px' }} />
              Importar {preview.length - 1} Registros
            </>
          )}
        </button>
      )}
    </div>
  )
}