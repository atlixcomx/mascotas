import { test, expect } from '@playwright/test'

test.describe('Debug Admin System', () => {
  test('verificar página de admin', async ({ page }) => {
    console.log('Navegando a: https://4tlixco.vercel.app/admin/')
    
    // Navegar con timeout extendido
    await page.goto('/admin/', { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    })
    
    // Tomar screenshot para ver qué se está mostrando
    await page.screenshot({ path: 'admin-page.png', fullPage: true })
    
    // Esperar un poco más
    await page.waitForTimeout(5000)
    
    // Imprimir el título y URL actual
    const title = await page.title()
    const url = page.url()
    console.log('Título de la página:', title)
    console.log('URL actual:', url)
    
    // Buscar cualquier contenido en la página
    const bodyText = await page.locator('body').textContent()
    console.log('Contenido de la página (primeros 500 caracteres):', bodyText?.substring(0, 500))
    
    // Verificar si hay algún formulario
    const forms = await page.locator('form').count()
    console.log('Número de formularios encontrados:', forms)
    
    // Buscar inputs
    const inputs = await page.locator('input').count()
    console.log('Número de inputs encontrados:', inputs)
    
    // Buscar específicamente campos de email y password
    const emailInputs = await page.locator('input[type="email"]').count()
    const passwordInputs = await page.locator('input[type="password"]').count()
    console.log('Campos de email encontrados:', emailInputs)
    console.log('Campos de password encontrados:', passwordInputs)
    
    // Verificar si estamos en la página correcta
    expect(url).toContain('admin')
  })
})