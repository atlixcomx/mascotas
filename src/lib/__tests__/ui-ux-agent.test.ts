import { UIUXAgent } from '../ui-ux-agent'

describe('UIUXAgent', () => {
  let agent: UIUXAgent

  beforeEach(() => {
    agent = new UIUXAgent()
  })

  describe('analyzeComponent', () => {
    it('debe analizar un componente y retornar su estructura', async () => {
      const componentPath = '/src/components/Button.tsx'
      const result = await agent.analyzeComponent(componentPath)

      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('type')
      expect(result).toHaveProperty('path', componentPath)
      expect(result).toHaveProperty('issues')
      expect(result).toHaveProperty('recommendations')
      expect(Array.isArray(result.issues)).toBe(true)
      expect(Array.isArray(result.recommendations)).toBe(true)
    })

    it('debe detectar correctamente el tipo de componente', async () => {
      const buttonPath = '/src/components/Button.tsx'
      const formPath = '/src/components/LoginForm.tsx'
      const navPath = '/src/components/Navigation.tsx'

      const button = await agent.analyzeComponent(buttonPath)
      const form = await agent.analyzeComponent(formPath)
      const nav = await agent.analyzeComponent(navPath)

      expect(button.type).toBe('button')
      expect(form.type).toBe('form')
      expect(nav.type).toBe('navigation')
    })
  })

  describe('validateAccessibility', () => {
    it('debe validar accesibilidad de un componente', async () => {
      const component = await agent.analyzeComponent('/src/components/Form.tsx')
      const issues = await agent.validateAccessibility(component)

      expect(Array.isArray(issues)).toBe(true)
      issues.forEach(issue => {
        expect(issue).toHaveProperty('severity')
        expect(issue).toHaveProperty('type', 'accessibility')
        expect(issue).toHaveProperty('description')
      })
    })
  })

  describe('suggestImprovements', () => {
    it('debe sugerir mejoras para formularios', async () => {
      const formComponent = {
        name: 'LoginForm',
        type: 'form' as const,
        path: '/src/components/LoginForm.tsx',
        issues: [],
        recommendations: []
      }

      const suggestions = await agent.suggestImprovements(formComponent)

      expect(Array.isArray(suggestions)).toBe(true)
      expect(suggestions.length).toBeGreaterThan(0)
      expect(suggestions.some(s => s.includes('validación'))).toBe(true)
    })

    it('debe sugerir mejoras para botones', async () => {
      const buttonComponent = {
        name: 'Button',
        type: 'button' as const,
        path: '/src/components/Button.tsx',
        issues: [],
        recommendations: []
      }

      const suggestions = await agent.suggestImprovements(buttonComponent)

      expect(Array.isArray(suggestions)).toBe(true)
      expect(suggestions.length).toBeGreaterThan(0)
      expect(suggestions.some(s => s.includes('hover'))).toBe(true)
    })

    it('debe sugerir mejoras para navegación', async () => {
      const navComponent = {
        name: 'Navigation',
        type: 'navigation' as const,
        path: '/src/components/Navigation.tsx',
        issues: [],
        recommendations: []
      }

      const suggestions = await agent.suggestImprovements(navComponent)

      expect(Array.isArray(suggestions)).toBe(true)
      expect(suggestions.length).toBeGreaterThan(0)
      expect(suggestions.some(s => s.includes('breadcrumbs') || s.includes('teclado'))).toBe(true)
    })
  })

  describe('analyzeColorScheme', () => {
    it('debe analizar un esquema de colores', async () => {
      const colors = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b']
      const result = await agent.analyzeColorScheme(colors)

      expect(result).toHaveProperty('accessible')
      expect(result).toHaveProperty('issues')
      expect(result).toHaveProperty('suggestions')
      expect(typeof result.accessible).toBe('boolean')
      expect(Array.isArray(result.issues)).toBe(true)
      expect(Array.isArray(result.suggestions)).toBe(true)
    })
  })

  describe('analyzeLayout', () => {
    it('debe analizar un layout', async () => {
      const layoutPath = '/src/components/Layout.tsx'
      const result = await agent.analyzeLayout(layoutPath)

      expect(result).toHaveProperty('responsive')
      expect(result).toHaveProperty('issues')
      expect(result).toHaveProperty('suggestions')
      expect(typeof result.responsive).toBe('boolean')
      expect(Array.isArray(result.issues)).toBe(true)
      expect(Array.isArray(result.suggestions)).toBe(true)
    })
  })

  describe('analyzeDesignSystem', () => {
    it('debe analizar el sistema de diseño completo', async () => {
      const projectPath = '/test/project'
      const result = await agent.analyzeDesignSystem(projectPath)

      expect(result).toHaveProperty('score')
      expect(result).toHaveProperty('components')
      expect(result).toHaveProperty('designTokens')
      expect(result).toHaveProperty('accessibility')
      expect(result).toHaveProperty('usability')
      expect(result).toHaveProperty('consistency')
      expect(result).toHaveProperty('recommendations')

      expect(typeof result.score).toBe('number')
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
    })

    it('debe generar recomendaciones categorizadas', async () => {
      const projectPath = '/test/project'
      const result = await agent.analyzeDesignSystem(projectPath)

      expect(result.recommendations).toHaveProperty('immediate')
      expect(result.recommendations).toHaveProperty('shortTerm')
      expect(result.recommendations).toHaveProperty('longTerm')

      expect(Array.isArray(result.recommendations.immediate)).toBe(true)
      expect(Array.isArray(result.recommendations.shortTerm)).toBe(true)
      expect(Array.isArray(result.recommendations.longTerm)).toBe(true)
    })
  })

  describe('generateStyleGuide', () => {
    it('debe generar una guía de estilo basada en el análisis', async () => {
      const projectPath = '/test/project'
      const analysis = await agent.analyzeDesignSystem(projectPath)
      const guide = await agent.generateStyleGuide(analysis)

      expect(typeof guide).toBe('string')
      expect(guide).toContain('Guía de Estilo UI/UX')
      expect(guide).toContain('Puntuación General')
      expect(guide).toContain('Tokens de Diseño')
      expect(guide).toContain('Accesibilidad')
      expect(guide).toContain('Usabilidad')
      expect(guide).toContain('Consistencia')
      expect(guide).toContain('Recomendaciones')
    })
  })
})