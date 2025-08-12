import { useState, useCallback, useEffect } from 'react'
import { UIUXAgent, uiuxAgent } from '@/lib/ui-ux-agent'

interface UseUIUXAgentOptions {
  autoAnalyze?: boolean
  componentPath?: string
}

interface UIUXAnalysis {
  score: number
  issues: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical'
    type: string
    description: string
    solution?: string
  }>
  recommendations: string[]
  isAnalyzing: boolean
  error: Error | null
}

export function useUIUXAgent(options: UseUIUXAgentOptions = {}) {
  const { autoAnalyze = false, componentPath } = options
  
  const [analysis, setAnalysis] = useState<UIUXAnalysis>({
    score: 0,
    issues: [],
    recommendations: [],
    isAnalyzing: false,
    error: null
  })

  const analyzeComponent = useCallback(async (path?: string) => {
    const targetPath = path || componentPath
    if (!targetPath) {
      setAnalysis(prev => ({
        ...prev,
        error: new Error('No component path provided')
      }))
      return
    }

    setAnalysis(prev => ({ ...prev, isAnalyzing: true, error: null }))

    try {
      const component = await uiuxAgent.analyzeComponent(targetPath)
      const accessibilityIssues = await uiuxAgent.validateAccessibility(component)
      const improvements = await uiuxAgent.suggestImprovements(component)
      
      // Calcular puntuación basada en los problemas encontrados
      const score = Math.max(0, 100 - (accessibilityIssues.length * 5))

      setAnalysis({
        score,
        issues: accessibilityIssues,
        recommendations: improvements,
        isAnalyzing: false,
        error: null
      })
    } catch (error) {
      setAnalysis(prev => ({
        ...prev,
        isAnalyzing: false,
        error: error as Error
      }))
    }
  }, [componentPath])

  const analyzeCurrentPage = useCallback(async () => {
    setAnalysis(prev => ({ ...prev, isAnalyzing: true, error: null }))

    try {
      const projectPath = process.cwd()
      const result = await uiuxAgent.analyzeDesignSystem(projectPath)
      
      // Combinar todos los issues
      const allIssues = [
        ...result.accessibility.issues,
        ...result.usability.issues,
        ...result.consistency.issues
      ]

      // Combinar todas las recomendaciones
      const allRecommendations = [
        ...result.recommendations.immediate,
        ...result.recommendations.shortTerm
      ]

      setAnalysis({
        score: result.score,
        issues: allIssues,
        recommendations: allRecommendations,
        isAnalyzing: false,
        error: null
      })
    } catch (error) {
      setAnalysis(prev => ({
        ...prev,
        isAnalyzing: false,
        error: error as Error
      }))
    }
  }, [])

  const generateReport = useCallback(async () => {
    if (analysis.score === 0) {
      return 'No hay análisis disponible. Ejecuta un análisis primero.'
    }

    const report = `
## Análisis UI/UX

### Puntuación: ${analysis.score}/100

### Problemas Encontrados (${analysis.issues.length})
${analysis.issues.map(issue => 
  `- **${issue.severity.toUpperCase()}**: ${issue.description}${issue.solution ? `\n  Solución: ${issue.solution}` : ''}`
).join('\n')}

### Recomendaciones (${analysis.recommendations.length})
${analysis.recommendations.map(rec => `- ${rec}`).join('\n')}
    `.trim()

    return report
  }, [analysis])

  useEffect(() => {
    if (autoAnalyze && componentPath) {
      analyzeComponent()
    }
  }, [autoAnalyze, componentPath, analyzeComponent])

  return {
    analysis,
    analyzeComponent,
    analyzeCurrentPage,
    generateReport,
    isAnalyzing: analysis.isAnalyzing,
    error: analysis.error
  }
}