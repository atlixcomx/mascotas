'use client'

import { useState } from 'react'
import { CSVImporter } from '../../../components/admin/CSVImporter'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function ImportarPage() {
  const [activeTab, setActiveTab] = useState<'perritos' | 'solicitudes'>('perritos')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()

  const handleImportPerritos = async (data: any[]) => {
    try {
      const response = await fetch('/api/admin/import/perritos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perritos: data })
      })

      if (!response.ok) {
        throw new Error('Error al importar perritos')
      }

      const result = await response.json()
      setMessage({ 
        type: 'success', 
        text: `Se importaron ${result.count} perritos exitosamente` 
      })
      
      setTimeout(() => {
        router.push('/admin/perritos')
      }, 2000)
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Error al importar datos' 
      })
    }
  }

  const handleImportSolicitudes = async (data: any[]) => {
    try {
      const response = await fetch('/api/admin/import/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ solicitudes: data })
      })

      if (!response.ok) {
        throw new Error('Error al importar solicitudes')
      }

      const result = await response.json()
      setMessage({ 
        type: 'success', 
        text: `Se importaron ${result.count} solicitudes exitosamente` 
      })
      
      setTimeout(() => {
        router.push('/admin/solicitudes')
      }, 2000)
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Error al importar datos' 
      })
    }
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '24px',
      minHeight: '100vh'
    }}>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '32px'
      }}>
        Importar Datos
      </h1>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '2px'
      }}>
        <button
          onClick={() => setActiveTab('perritos')}
          style={{
            padding: '12px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'perritos' ? '2px solid #4f46e5' : '2px solid transparent',
            color: activeTab === 'perritos' ? '#4f46e5' : '#6b7280',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '-2px'
          }}
        >
          Perritos
        </button>
        <button
          onClick={() => setActiveTab('solicitudes')}
          style={{
            padding: '12px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'solicitudes' ? '2px solid #4f46e5' : '2px solid transparent',
            color: activeTab === 'solicitudes' ? '#4f46e5' : '#6b7280',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '-2px'
          }}
        >
          Solicitudes
        </button>
      </div>

      {/* Mensaje global */}
      {message && (
        <div style={{
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {message.type === 'success' ? (
            <CheckCircle style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0 }} />
          ) : (
            <AlertCircle style={{ width: '20px', height: '20px', color: '#ef4444', flexShrink: 0 }} />
          )}
          <p style={{ 
            fontSize: '0.875rem', 
            color: message.type === 'success' ? '#166534' : '#991b1b', 
            margin: 0 
          }}>
            {message.text}
          </p>
        </div>
      )}

      {/* Contenido */}
      <div style={{ marginTop: '24px' }}>
        {activeTab === 'perritos' ? (
          <CSVImporter 
            type="perritos" 
            onImport={handleImportPerritos}
          />
        ) : (
          <CSVImporter 
            type="solicitudes" 
            onImport={handleImportSolicitudes}
          />
        )}
      </div>
    </div>
  )
}