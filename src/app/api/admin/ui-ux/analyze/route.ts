import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { UIUXAgent } from '@/lib/ui-ux-agent'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { componentPath, analysisType = 'component' } = await request.json()

    const agent = new UIUXAgent()
    let result

    if (analysisType === 'component') {
      if (!componentPath) {
        return NextResponse.json(
          { error: 'La ruta del componente es requerida' }, 
          { status: 400 }
        )
      }

      const component = await agent.analyzeComponent(componentPath)
      const accessibilityIssues = await agent.validateAccessibility(component)
      const improvements = await agent.suggestImprovements(component)

      result = {
        component,
        issues: accessibilityIssues,
        recommendations: improvements,
        score: Math.max(0, 100 - (accessibilityIssues.length * 5))
      }
    } else if (analysisType === 'system') {
      const projectPath = process.cwd()
      const analysis = await agent.analyzeDesignSystem(projectPath)
      const styleGuide = await agent.generateStyleGuide(analysis)

      result = {
        ...analysis,
        styleGuide
      }
    } else {
      return NextResponse.json(
        { error: 'Tipo de análisis inválido' }, 
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Error en análisis UI/UX:', error)
    return NextResponse.json(
      { error: 'Error al realizar el análisis' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Retornar información sobre el agente
    return NextResponse.json({
      name: 'UI/UX Agent',
      version: '1.0.0',
      capabilities: [
        'Análisis de componentes individuales',
        'Análisis del sistema de diseño completo',
        'Validación de accesibilidad',
        'Análisis de usabilidad',
        'Análisis de consistencia',
        'Generación de guías de estilo',
        'Recomendaciones priorizadas'
      ],
      endpoints: {
        analyze: '/api/admin/ui-ux/analyze',
        methods: ['POST'],
        parameters: {
          componentPath: 'string (opcional)',
          analysisType: 'component | system'
        }
      }
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error al obtener información del agente' }, 
      { status: 500 }
    )
  }
}