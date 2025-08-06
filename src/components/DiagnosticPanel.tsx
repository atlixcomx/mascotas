'use client'

import { useState, useEffect } from 'react'
import { Check, X, AlertCircle, RefreshCw, Database, Globe, Server } from 'lucide-react'
import LoadingSpinner from './ui/LoadingSpinner'

interface DiagnosticResult {
  name: string
  status: 'success' | 'error' | 'loading'
  message: string
  details?: string
  timing?: number
}

export default function DiagnosticPanel() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const diagnostics = [
    {
      name: 'API Health Check',
      test: async () => {
        const start = Date.now()
        const response = await fetch('/api/health')
        const timing = Date.now() - start
        
        if (response.ok) {
          const data = await response.json()
          return {
            status: 'success' as const,
            message: 'API funcionando correctamente',
            details: `Status: ${data.status}`,
            timing
          }
        }
        throw new Error(`HTTP ${response.status}`)
      }
    },
    {
      name: 'Database Connection',
      test: async () => {
        const start = Date.now()
        const response = await fetch('/api/perritos?limit=1')
        const timing = Date.now() - start
        
        if (response.ok) {
          const data = await response.json()
          return {
            status: 'success' as const,
            message: 'Conexión a base de datos exitosa',
            details: `Total perritos: ${data.pagination?.total || 0}`,
            timing
          }
        }
        throw new Error(`HTTP ${response.status}`)
      }
    },
    {
      name: 'Perritos API List',
      test: async () => {
        const start = Date.now()
        const response = await fetch('/api/perritos')
        const timing = Date.now() - start
        
        if (response.ok) {
          const data = await response.json()
          return {
            status: 'success' as const,
            message: `API lista de perritos funcionando`,
            details: `${data.perritos?.length || 0} perritos cargados`,
            timing
          }
        }
        throw new Error(`HTTP ${response.status}`)
      }
    },
    {
      name: 'Perritos API Detail',
      test: async () => {
        // Primero obtener un perrito para probar
        const listResponse = await fetch('/api/perritos?limit=1')
        
        if (!listResponse.ok) {
          throw new Error('No se puede obtener lista de perritos')
        }
        
        const listData = await listResponse.json()
        
        if (!listData.perritos || listData.perritos.length === 0) {
          throw new Error('No hay perritos para probar')
        }
        
        const slug = listData.perritos[0].slug
        const start = Date.now()
        const response = await fetch(`/api/perritos/${slug}`)
        const timing = Date.now() - start
        
        if (response.ok) {
          const data = await response.json()
          return {
            status: 'success' as const,
            message: `API detalle de perrito funcionando`,
            details: `Perrito: ${data.nombre}`,
            timing
          }
        }
        throw new Error(`HTTP ${response.status}`)
      }
    }
  ]

  const runDiagnostics = async () => {
    setIsRunning(true)
    setResults([])

    for (const diagnostic of diagnostics) {
      // Mostrar estado de carga
      setResults(prev => [
        ...prev,
        {
          name: diagnostic.name,
          status: 'loading',
          message: 'Ejecutando...'
        }
      ])

      try {
        const result = await diagnostic.test()
        setResults(prev => prev.map(r => 
          r.name === diagnostic.name 
            ? { name: diagnostic.name, ...result }
            : r
        ))
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        setResults(prev => prev.map(r => 
          r.name === diagnostic.name 
            ? {
                name: diagnostic.name,
                status: 'error' as const,
                message: 'Error en la prueba',
                details: errorMessage
              }
            : r
        ))
      }

      // Pequeña pausa entre pruebas
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    setIsRunning(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <Check style={{ width: '20px', height: '20px', color: '#10b981' }} />
      case 'error':
        return <X style={{ width: '20px', height: '20px', color: '#ef4444' }} />
      case 'loading':
        return (
          <div style={{ animation: 'spin 1s linear infinite' }}>
            <RefreshCw style={{ width: '20px', height: '20px', color: '#6b7280' }} />
          </div>
        )
      default:
        return <AlertCircle style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#ecfdf5'
      case 'error':
        return '#fef2f2'
      case 'loading':
        return '#f9fafb'
      default:
        return '#fefbf0'
    }
  }

  const successCount = results.filter(r => r.status === 'success').length
  const errorCount = results.filter(r => r.status === 'error').length
  const totalCount = diagnostics.length

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 20px' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '32px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '24px' 
        }}>
          <Database style={{ width: '28px', height: '28px', color: '#af1731' }} />
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#1a1a1a',
            margin: 0 
          }}>
            Diagnósticos del Sistema
          </h1>
        </div>

        {/* Resumen */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
              Estado general del sistema
            </p>
            <p style={{ 
              margin: '4px 0 0 0', 
              fontSize: '18px', 
              fontWeight: '600',
              color: errorCount > 0 ? '#ef4444' : successCount === totalCount ? '#10b981' : '#f59e0b'
            }}>
              {errorCount > 0 
                ? 'Problemas detectados' 
                : successCount === totalCount 
                  ? 'Todo funcionando correctamente'
                  : 'Ejecutando diagnósticos...'
              }
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {successCount}/{totalCount}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Pruebas exitosas
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {results.map((result) => (
            <div
              key={result.name}
              style={{
                backgroundColor: getStatusColor(result.status),
                border: `1px solid ${result.status === 'success' ? '#d1fae5' : 
                                      result.status === 'error' ? '#fecaca' : '#e5e7eb'}`,
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              {getStatusIcon(result.status)}
              
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  margin: '0 0 4px 0',
                  color: '#1a1a1a'
                }}>
                  {result.name}
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  margin: 0,
                  color: '#64748b'
                }}>
                  {result.message}
                </p>
                {result.details && (
                  <p style={{ 
                    fontSize: '12px', 
                    margin: '4px 0 0 0',
                    color: '#9ca3af'
                  }}>
                    {result.details}
                  </p>
                )}
              </div>

              {result.timing && (
                <div style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  textAlign: 'right'
                }}>
                  {result.timing}ms
                </div>
              )}
            </div>
          ))}

          {results.length < diagnostics.length && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px',
              color: '#64748b'
            }}>
              <LoadingSpinner size="md" text="Ejecutando diagnósticos..." />
            </div>
          )}
        </div>

        {/* Botón para reiniciar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '32px' 
        }}>
          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: isRunning ? '#f3f4f6' : '#af1731',
              color: isRunning ? '#6b7280' : 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            <RefreshCw 
              style={{ 
                width: '16px', 
                height: '16px',
                animation: isRunning ? 'spin 1s linear infinite' : 'none'
              }} 
            />
            {isRunning ? 'Ejecutando...' : 'Ejecutar Diagnósticos'}
          </button>
        </div>
      </div>
    </div>
  )
}