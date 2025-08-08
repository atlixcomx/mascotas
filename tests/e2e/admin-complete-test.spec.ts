import { test, expect } from '@playwright/test'

test.describe('Sistema Administrativo Completo - Atlixco', () => {
  test('flujo completo de administración', async ({ page }) => {
    // 1. Ir directamente a la página de login
    await page.goto('/admin/login')
    
    // Verificar que estamos en la página de login
    await expect(page).toHaveURL(/.*admin.*login/)
    
    // 2. Realizar login
    console.log('Realizando login...')
    await page.locator('input[type="email"]').fill('admin@atlixco.gob.mx')
    await page.locator('input[type="password"]').fill('Atlixco2024!')
    
    // Tomar screenshot antes del login
    await page.screenshot({ path: 'before-login.png' })
    
    // Click en el botón de submit
    await page.locator('button[type="submit"]').click()
    
    // Esperar navegación después del login
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)
    
    // Tomar screenshot después del login
    await page.screenshot({ path: 'after-login.png' })
    
    // 3. Verificar que entramos al panel admin
    console.log('URL después del login:', page.url())
    
    // Buscar elementos del dashboard
    const dashboardElements = [
      'Perritos',
      'Solicitudes', 
      'Usuarios',
      'Dashboard',
      'Panel',
      'Administración'
    ]
    
    let foundElement = ''
    for (const element of dashboardElements) {
      const count = await page.locator(`text=${element}`).count()
      if (count > 0) {
        foundElement = element
        console.log(`Encontrado: "${element}"`)
        break
      }
    }
    
    expect(foundElement).not.toBe('')
    
    // 4. Explorar sección de Perritos
    const perritosLink = page.locator('text=Perritos').first()
    if (await perritosLink.count() > 0) {
      console.log('Navegando a sección de Perritos...')
      await perritosLink.click()
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)
      
      // Tomar screenshot de la sección
      await page.screenshot({ path: 'perritos-section.png', fullPage: true })
      
      // Verificar contenido
      const perritosContent = await page.locator('body').textContent()
      console.log('Contenido en sección Perritos:', perritosContent?.substring(0, 200))
    }
    
    // 5. Explorar sección de Solicitudes
    const solicitudesLink = page.locator('text=Solicitudes').first()
    if (await solicitudesLink.count() > 0) {
      console.log('Navegando a sección de Solicitudes...')
      await solicitudesLink.click()
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)
      
      // Tomar screenshot
      await page.screenshot({ path: 'solicitudes-section.png', fullPage: true })
      
      // Verificar contenido
      const solicitudesContent = await page.locator('body').textContent()
      console.log('Contenido en sección Solicitudes:', solicitudesContent?.substring(0, 200))
    }
    
    // 6. Probar logout
    console.log('Buscando opción de logout...')
    const logoutOptions = [
      'Cerrar sesión',
      'Salir',
      'Logout',
      'Sign out'
    ]
    
    let logoutFound = false
    for (const option of logoutOptions) {
      const element = page.locator(`text=${option}`).first()
      if (await element.count() > 0) {
        console.log(`Encontrado botón de logout: "${option}"`)
        await element.click()
        logoutFound = true
        break
      }
    }
    
    if (logoutFound) {
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)
      
      // Verificar que volvimos al login
      const isLoginPage = page.url().includes('login') || 
                         await page.locator('input[type="email"]').count() > 0
      expect(isLoginPage).toBe(true)
      console.log('Logout exitoso, regresamos a la página de login')
    }
  })
  
  test('validación de credenciales incorrectas', async ({ page }) => {
    await page.goto('/admin/login')
    
    // Intentar con credenciales incorrectas
    await page.locator('input[type="email"]').fill('usuario@incorrecto.com')
    await page.locator('input[type="password"]').fill('contraseñaIncorrecta')
    await page.locator('button[type="submit"]').click()
    
    await page.waitForTimeout(2000)
    
    // Buscar mensaje de error
    const errorMessages = [
      'credenciales',
      'error',
      'incorrecto',
      'inválido',
      'failed',
      'Error'
    ]
    
    let errorFound = false
    for (const msg of errorMessages) {
      if (await page.locator(`text=${msg}`).count() > 0) {
        errorFound = true
        console.log(`Mensaje de error encontrado: "${msg}"`)
        break
      }
    }
    
    // También verificar que seguimos en la página de login
    const stillInLogin = await page.locator('input[type="email"]').count() > 0
    expect(stillInLogin || errorFound).toBe(true)
  })
  
  test('responsividad en móvil', async ({ page }) => {
    // Configurar viewport móvil
    await page.setViewportSize({ width: 375, height: 812 })
    
    await page.goto('/admin/login')
    
    // Verificar que los elementos son visibles y accesibles
    const emailField = page.locator('input[type="email"]')
    const passwordField = page.locator('input[type="password"]')
    const submitButton = page.locator('button[type="submit"]')
    
    await expect(emailField).toBeVisible()
    await expect(passwordField).toBeVisible()
    await expect(submitButton).toBeVisible()
    
    // Verificar tamaños mínimos para touch
    const emailBox = await emailField.boundingBox()
    const passwordBox = await passwordField.boundingBox()
    
    if (emailBox) {
      expect(emailBox.height).toBeGreaterThanOrEqual(40)
      console.log('Alto del campo email:', emailBox.height)
    }
    
    if (passwordBox) {
      expect(passwordBox.height).toBeGreaterThanOrEqual(40)
      console.log('Alto del campo password:', passwordBox.height)
    }
    
    // Tomar screenshot móvil
    await page.screenshot({ path: 'admin-mobile.png', fullPage: true })
  })
})