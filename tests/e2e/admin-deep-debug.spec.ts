import { test, expect } from '@playwright/test'

test.describe('Debug Profundo - Sistema Admin', () => {
  test('analizar respuesta del servidor al login', async ({ page }) => {
    // Habilitar logging de red
    page.on('response', response => {
      if (response.url().includes('api') || response.url().includes('auth')) {
        console.log(`📡 Response: ${response.status()} - ${response.url()}`)
      }
    })
    
    page.on('request', request => {
      if (request.method() === 'POST') {
        console.log(`📤 POST Request: ${request.url()}`)
      }
    })
    
    // Navegar a login
    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('networkidle')
    
    // Verificar que los campos existen
    const emailField = page.locator('input[type="email"]')
    const passwordField = page.locator('input[type="password"]')
    const submitButton = page.locator('button[type="submit"]')
    
    await expect(emailField).toBeVisible()
    await expect(passwordField).toBeVisible()
    await expect(submitButton).toBeVisible()
    
    console.log('✅ Campos de login visibles')
    
    // Llenar formulario
    await emailField.fill('admin@atlixco.gob.mx')
    await passwordField.fill('Atlixco2024!')
    
    // Interceptar respuestas de la API
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('api/auth') || 
      response.url().includes('callback') ||
      response.url().includes('signin')
    , { timeout: 15000 }).catch(() => null)
    
    // Hacer clic en submit
    console.log('🔄 Enviando formulario de login...')
    await submitButton.click()
    
    // Esperar respuesta
    const response = await responsePromise
    if (response) {
      console.log(`📥 Respuesta recibida: ${response.status()} - ${response.url()}`)
      const headers = response.headers()
      console.log('Headers:', Object.keys(headers).filter(h => h.toLowerCase().includes('cookie')))
      
      try {
        const body = await response.text()
        console.log('Body preview:', body.substring(0, 200))
      } catch (e) {
        console.log('No se pudo leer el body')
      }
    } else {
      console.log('⚠️ No se detectó respuesta de API de autenticación')
    }
    
    // Esperar un poco más
    await page.waitForTimeout(5000)
    
    // Verificar estado final
    const finalUrl = page.url()
    console.log('📍 URL final:', finalUrl)
    
    // Verificar cookies
    const cookies = await page.context().cookies()
    const authCookies = cookies.filter(c => 
      c.name.includes('auth') || 
      c.name.includes('session') || 
      c.name.includes('token')
    )
    console.log('🍪 Cookies de autenticación:', authCookies.map(c => c.name))
    
    // Verificar localStorage
    const localStorage = await page.evaluate(() => {
      const items = {}
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i)
        if (key) items[key] = window.localStorage.getItem(key)
      }
      return items
    })
    console.log('💾 LocalStorage keys:', Object.keys(localStorage))
    
    // Intentar navegar manualmente al dashboard
    console.log('🚀 Intentando navegar manualmente al dashboard...')
    await page.goto('/admin', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(3000)
    
    const dashboardUrl = page.url()
    console.log('📍 URL después de intentar ir al dashboard:', dashboardUrl)
    
    // Verificar contenido
    const pageTitle = await page.title()
    const h1Text = await page.locator('h1').first().textContent().catch(() => 'No h1 found')
    
    console.log('📄 Título de página:', pageTitle)
    console.log('📝 Primer H1:', h1Text)
    
    // Tomar screenshots
    await page.screenshot({ path: 'debug-login-form.png', fullPage: true })
    if (!dashboardUrl.includes('login')) {
      await page.screenshot({ path: 'debug-dashboard.png', fullPage: true })
    }
  })
})