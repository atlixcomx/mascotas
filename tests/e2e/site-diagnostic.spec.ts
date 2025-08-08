import { test, expect } from '@playwright/test'

test.describe('Diagnóstico del Sitio', () => {
  test('análisis completo del estado del sitio', async ({ page }) => {
    console.log('🔍 Iniciando diagnóstico del sitio...\n')
    
    // 1. Verificar página principal
    console.log('1. PÁGINA PRINCIPAL')
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 })
    
    const title = await page.title()
    console.log(`   Título: "${title}"`)
    
    const url = page.url()
    console.log(`   URL: ${url}`)
    
    // Verificar si hay contenido
    const bodyText = await page.locator('body').textContent()
    console.log(`   Longitud del contenido: ${bodyText?.length} caracteres`)
    
    // Buscar elementos comunes
    const elements = {
      'header': await page.locator('header').count(),
      'nav': await page.locator('nav').count(),
      'main': await page.locator('main').count(),
      'footer': await page.locator('footer').count(),
      'h1': await page.locator('h1').count(),
      'img': await page.locator('img').count(),
      'a': await page.locator('a').count(),
      'button': await page.locator('button').count()
    }
    
    console.log('\n   Elementos encontrados:')
    for (const [elem, count] of Object.entries(elements)) {
      console.log(`   - ${elem}: ${count}`)
    }
    
    // 2. Verificar API
    console.log('\n2. VERIFICACIÓN DE API')
    const apiEndpoints = [
      '/api/perritos',
      '/api/auth/session',
      '/api/comercios'
    ]
    
    for (const endpoint of apiEndpoints) {
      try {
        const response = await page.request.get(`https://4tlixco.vercel.app${endpoint}`)
        console.log(`   ${endpoint}: ${response.status()} ${response.statusText()}`)
      } catch (error) {
        console.log(`   ${endpoint}: ERROR - ${error.message}`)
      }
    }
    
    // 3. Verificar rutas principales
    console.log('\n3. RUTAS PRINCIPALES')
    const routes = [
      { path: '/', name: 'Inicio' },
      { path: '/perritos', name: 'Perritos' },
      { path: '/comercios', name: 'Comercios' },
      { path: '/admin/login', name: 'Admin Login' },
      { path: '/solicitud/1', name: 'Formulario Adopción' }
    ]
    
    for (const route of routes) {
      await page.goto(route.path, { waitUntil: 'domcontentloaded' })
      const pageTitle = await page.title()
      const hasContent = (await page.locator('body').textContent())?.length > 100
      console.log(`   ${route.name} (${route.path}): ${hasContent ? '✓ Con contenido' : '✗ Sin contenido'} - Título: "${pageTitle}"`)
    }
    
    // 4. Verificar consola de errores
    console.log('\n4. ERRORES DE CONSOLA')
    const errors = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto('/')
    await page.waitForTimeout(3000)
    
    if (errors.length > 0) {
      console.log('   Errores encontrados:')
      errors.forEach(err => console.log(`   - ${err}`))
    } else {
      console.log('   ✓ No se encontraron errores de consola')
    }
    
    // 5. Verificar recursos cargados
    console.log('\n5. RECURSOS')
    const failedRequests = []
    page.on('requestfailed', request => {
      failedRequests.push({
        url: request.url(),
        failure: request.failure()?.errorText
      })
    })
    
    await page.reload()
    await page.waitForTimeout(2000)
    
    if (failedRequests.length > 0) {
      console.log('   Recursos fallidos:')
      failedRequests.forEach(req => console.log(`   - ${req.url}: ${req.failure}`))
    } else {
      console.log('   ✓ Todos los recursos se cargaron correctamente')
    }
    
    // 6. Tomar screenshots de diagnóstico
    await page.goto('/')
    await page.screenshot({ path: 'diagnostic-home.png', fullPage: true })
    
    await page.goto('/perritos')
    await page.screenshot({ path: 'diagnostic-perritos.png', fullPage: true })
    
    await page.goto('/admin/login')
    await page.screenshot({ path: 'diagnostic-admin.png', fullPage: true })
    
    console.log('\n📸 Screenshots guardados: diagnostic-home.png, diagnostic-perritos.png, diagnostic-admin.png')
    
    // Resumen final
    console.log('\n=== RESUMEN ===')
    console.log(`Sitio accesible: ${url.includes('4tlixco.vercel.app') ? '✓' : '✗'}`)
    console.log(`Tiene contenido: ${bodyText?.length > 100 ? '✓' : '✗'}`)
    console.log(`Elementos HTML básicos: ${elements.header > 0 || elements.nav > 0 ? '✓' : '✗'}`)
    
    // Al menos verificar que el sitio carga
    expect(url).toContain('4tlixco.vercel.app')
  })
})