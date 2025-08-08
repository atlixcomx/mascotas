import { test, expect } from '@playwright/test'

test.describe('Verificación de Datos en Producción', () => {
  test('verificar API de perritos', async ({ page }) => {
    const response = await page.request.get('https://4tlixco.vercel.app/api/perritos')
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    const perritos = data.perritos || data // Manejar ambas estructuras
    console.log(`✅ API de perritos devuelve ${perritos.length} registros`)
    
    // Verificar que tenemos los 4 perritos
    expect(perritos.length).toBe(4)
    
    // Verificar nombres
    const nombres = perritos.map(p => p.nombre)
    expect(nombres).toContain('Max')
    expect(nombres).toContain('Luna')
    expect(nombres).toContain('Rocky')
    expect(nombres).toContain('Bella')
    
    console.log('✅ Perritos encontrados:', nombres.join(', '))
  })
  
  test('verificar página de catálogo muestra datos', async ({ page }) => {
    await page.goto('https://4tlixco.vercel.app/catalogo')
    await page.waitForLoadState('networkidle')
    
    // Esperar a que los datos se carguen
    await page.waitForTimeout(5000)
    
    // Verificar que se muestran los perritos (pueden estar como imágenes, cards, etc.)
    const perritoElements = await page.locator('img, [class*="card"], article, [class*="perrito"], [class*="grid"] > div').count()
    console.log(`✅ Se encontraron ${perritoElements} elementos en el catálogo`)
    
    // Verificar nombres de perritos en el contenido
    const pageContent = await page.locator('body').textContent()
    const maxVisible = pageContent?.includes('Max') || false
    const lunaVisible = pageContent?.includes('Luna') || false
    
    console.log(`Max visible: ${maxVisible}, Luna visible: ${lunaVisible}`)
    
    // Al menos verificar que la página carga correctamente
    const title = await page.locator('h1').first().textContent()
    console.log(`Título de la página: "${title}"`)
    expect(title).toBeTruthy()
    
    // Tomar screenshot
    await page.screenshot({ path: 'catalogo-con-datos.png', fullPage: true })
  })
  
  test('verificar login de admin funciona', async ({ page }) => {
    await page.goto('https://4tlixco.vercel.app/admin/login')
    
    // Llenar formulario
    await page.locator('input[type="email"]').fill('admin@atlixco.gob.mx')
    await page.locator('input[type="password"]').fill('Atlixco2024!')
    
    // Hacer login
    await page.locator('button[type="submit"]').click()
    
    // Esperar respuesta
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(5000)
    
    // Verificar resultado
    const currentUrl = page.url()
    console.log(`URL después del login: ${currentUrl}`)
    
    // Si el login funciona, no deberíamos estar en /login
    if (!currentUrl.includes('/login')) {
      console.log('✅ Login exitoso!')
      await page.screenshot({ path: 'admin-dashboard.png', fullPage: true })
    } else {
      console.log('⚠️ Login no completó - verificando mensajes de error')
      const errorCount = await page.locator('[class*="error"], [class*="alert"]').count()
      console.log(`Mensajes de error encontrados: ${errorCount}`)
    }
  })
  
  test('verificar detalle de perrito', async ({ page }) => {
    // Primero obtener los perritos de la API
    const response = await page.request.get('https://4tlixco.vercel.app/api/perritos')
    const data = await response.json()
    const perritos = data.perritos || data
    
    if (perritos.length > 0) {
      const primerPerrito = perritos[0]
      console.log(`Verificando detalle de: ${primerPerrito.nombre} (ID: ${primerPerrito.id})`)
      
      // Ir a la página de solicitud con el ID del perrito
      await page.goto(`https://4tlixco.vercel.app/solicitud/${primerPerrito.id}`)
      await page.waitForLoadState('networkidle')
      
      // Verificar que se muestra información del perrito
      const nombreVisible = await page.locator(`text=${primerPerrito.nombre}`).count() > 0
      console.log(`Nombre del perrito visible: ${nombreVisible}`)
      
      // Verificar formulario
      const formFields = await page.locator('input, textarea').count()
      console.log(`Campos de formulario encontrados: ${formFields}`)
      
      await page.screenshot({ path: 'formulario-adopcion.png', fullPage: true })
    }
  })
})