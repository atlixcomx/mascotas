'use client'

import { useState } from 'react'
import { useUIUXAgent } from '@/hooks/useUIUXAgent'

export function UIUXAnalyzer() {
  const [componentPath, setComponentPath] = useState('')
  const { 
    analysis, 
    analyzeComponent, 
    analyzeCurrentPage, 
    generateReport,
    isAnalyzing,
    error 
  } = useUIUXAgent()

  const handleAnalyzeComponent = () => {
    if (componentPath) {
      analyzeComponent(componentPath)
    }
  }

  const handleExportReport = async () => {
    const report = await generateReport()
    const blob = new Blob([report], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ui-ux-analysis-report.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Analizador UI/UX</h2>
        
        {/* Controles de análisis */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={componentPath}
              onChange={(e) => setComponentPath(e.target.value)}
              placeholder="Ruta del componente (ej: /src/components/Button.tsx)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAnalyzeComponent}
              disabled={!componentPath || isAnalyzing}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? 'Analizando...' : 'Analizar Componente'}
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={analyzeCurrentPage}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? 'Analizando...' : 'Analizar Sistema Completo'}
            </button>
            
            {analysis.score > 0 && (
              <button
                onClick={handleExportReport}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Exportar Reporte
              </button>
            )}
          </div>
        </div>

        {/* Mostrar error si existe */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">Error: {error.message}</p>
          </div>
        )}

        {/* Resultados del análisis */}
        {analysis.score > 0 && !isAnalyzing && (
          <div className="space-y-6">
            {/* Puntuación general */}
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Puntuación UI/UX</p>
              <p className={`text-5xl font-bold ${getScoreColor(analysis.score)}`}>
                {analysis.score}/100
              </p>
            </div>

            {/* Problemas encontrados */}
            {analysis.issues.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Problemas Encontrados ({analysis.issues.length})
                </h3>
                <div className="space-y-2">
                  {analysis.issues.map((issue, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-md ${getSeverityColor(issue.severity)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="font-semibold text-sm uppercase">
                            {issue.severity} - {issue.type}
                          </span>
                          <p className="mt-1">{issue.description}</p>
                          {issue.solution && (
                            <p className="mt-2 text-sm">
                              <strong>Solución:</strong> {issue.solution}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recomendaciones */}
            {analysis.recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Recomendaciones ({analysis.recommendations.length})
                </h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Estado inicial */}
        {analysis.score === 0 && !isAnalyzing && !error && (
          <div className="text-center py-12 text-gray-500">
            <p>Selecciona un componente o analiza el sistema completo para comenzar</p>
          </div>
        )}

        {/* Estado de carga */}
        {isAnalyzing && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Analizando UI/UX...</p>
          </div>
        )}
      </div>
    </div>
  )
}