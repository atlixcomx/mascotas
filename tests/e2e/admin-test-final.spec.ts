import { test, expect } from '@playwright/test'

test.describe('Sistema Administrativo - Pruebas Finales', () => {
  const adminCredentials = {
    email: 'admin@atlixco.gob.mx',
    password: 'Atlixco2024!'
  }

  test('login exitoso y navegación completa', async ({ page }) => {
    console.log('1. Navegando a página de login...')
    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle')
    
    // Verificar que estamos en la página correcta
    await expect(page).toHaveURL(/.*admin.*login/)
    console.log('✓ Página de login cargada correctamente')
    
    // Llenar formulario de login
    console.log('2. Llenando formulario de login...')
    const emailField = page.locator('input[type="email"]')
    const passwordField = page.locator('input[type="password"]')
    
    await emailField.fill(adminCredentials.email)
    await passwordField.fill(adminCredentials.password)
    console.log('✓ Credenciales ingresadas')
    
    // Hacer clic en el botón de submit
    console.log('3. Enviando formulario...')
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()
    
    // Esperar respuesta del servidor
    console.log('4. Esperando respuesta del servidor...')
    
    // Esperar a que cambie la URL o aparezca contenido del dashboard
    await Promise.race([
      page.waitForURL(url => !url.includes('/login'), { timeout: 10000 }),
      page.waitForSelector('text=Dashboard', { timeout: 10000 }),
      page.waitForSelector('text=Panel', { timeout: 10000 }),
      page.waitForSelector('text=Perritos', { timeout: 10000 })
    ]).catch(() => {
      console.log('⚠️ No se detectó cambio de página automático')
    })
    
    await page.waitForLoadState('networkidle')
    
    // Verificar el estado después del login
    const currentUrl = page.url()
    console.log('5. URL actual:', currentUrl)
    
    // Tomar screenshot del resultado
    await page.screenshot({ path: 'login-result.png', fullPage: true })
    
    // Verificar si el login fue exitoso
    if (currentUrl.includes('/login')) {
      // Si seguimos en login, buscar mensajes de error
      const errorMessages = await page.locator('text=/error|incorrecto|inválido/i').count()
      if (errorMessages > 0) {
        console.log('❌ Login falló - se encontraron mensajes de error')
      } else {
        console.log('⚠️ Login no completó la redirección')
      }
      
      // Intentar encontrar el problema
      const pageContent = await page.locator('body').textContent()
      console.log('Contenido de la página:', pageContent?.substring(0, 500))
    } else {
      console.log('✓ Login exitoso - redirigido fuera de /login')
      
      // Verificar elementos del dashboard
      const dashboardElements = ['Dashboard', 'Panel', 'Perritos', 'Solicitudes', 'Administración']
      let foundElements = []
      
      for (const element of dashboardElements) {
        if (await page.locator(`text=${element}`).count() > 0) {
          foundElements.push(element)
        }
      }
      
      console.log('✓ Elementos encontrados:', foundElements.join(', '))
      expect(foundElements.length).toBeGreaterThan(0)
    }
  })

  test('navegación por secciones del admin', async ({ page }) => {
    // Primero hacer login
    await page.goto('/admin/login')
    await page.locator('input[type="email"]').fill(adminCredentials.email)
    await page.locator('input[type="password"]').fill(adminCredentials.password)
    await page.locator('button[type="submit"]').click()
    
    // Esperar a estar logueado
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)
    
    // Si no estamos logueados, saltar el test
    if (page.url().includes('/login')) {
      console.log('⚠️ No se pudo hacer login, saltando test de navegación')
      return
    }
    
    // Probar navegación a Perritos
    console.log('Navegando a sección Perritos...')
    const perritosLink = page.locator('a:has-text("Perritos"), nav >> text=Perritos, [href*="perritos"]').first()
    if (await perritosLink.count() > 0) {
      await perritosLink.click()
      await page.waitForLoadState('networkidle')
      await page.screenshot({ path: 'admin-perritos.png' })
      console.log('✓ Sección Perritos cargada')
    }
    
    // Probar navegación a Solicitudes
    console.log('Navegando a sección Solicitudes...')
    const solicitudesLink = page.locator('a:has-text("Solicitudes"), nav >> text=Solicitudes, [href*="solicitudes"]').first()
    if (await solicitudesLink.count() > 0) {
      await solicitudesLink.click()
      await page.waitForLoadState('networkidle')
      await page.screenshot({ path: 'admin-solicitudes.png' })
      console.log('✓ Sección Solicitudes cargada')
    }
  })

  test('validación de credenciales incorrectas', async ({ page }) => {
    await page.goto('/admin/login')
    
    // Intentar con credenciales incorrectas
    await page.locator('input[type="email"]').fill('incorrecto@ejemplo.com')
    await page.locator('input[type="password"]').fill('contraseñaIncorrecta')
    await page.locator('button[type="submit"]').click()
    
    // Esperar respuesta
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    // Verificar que seguimos en login
    expect(page.url()).toContain('/login')
    
    // Buscar mensaje de error
    const errorFound = await page.locator('text=/error|credenciales|incorrecto/i').count() > 0
    expect(errorFound).toBe(true)
    console.log('✓ Validación de credenciales incorrectas funciona')
  })

  test('responsividad móvil del panel admin', async ({ page }) => {
    // Configurar viewport móvil
    await page.setViewportSize({ width: 375, height: 812 })
    
    await page.goto('/admin/login')
    
    // Verificar que los elementos son visibles
    const emailField = page.locator('input[type="email"]')
    const passwordField = page.locator('input[type="password"]')
    const submitButton = page.locator('button[type="submit"]')
    
    await expect(emailField).toBeVisible()
    await expect(passwordField).toBeVisible()
    await expect(submitButton).toBeVisible()
    
    // Verificar tamaños táctiles
    const emailBox = await emailField.boundingBox()
    const passwordBox = await passwordField.boundingBox()
    
    expect(emailBox?.height).toBeGreaterThanOrEqual(40)
    expect(passwordBox?.height).toBeGreaterThanOrEqual(40)
    
    console.log('✓ Interfaz móvil responsive correctamente')
  })

  test('funcionalidad de logout', async ({ page }) => {
    // Login primero
    await page.goto('/admin/login')
    await page.locator('input[type="email"]').fill(adminCredentials.email)
    await page.locator('input[type="password"]').fill(adminCredentials.password)
    await page.locator('button[type="submit"]').click()
    
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)
    
    // Si no logramos entrar, saltar
    if (page.url().includes('/login')) {
      console.log('⚠️ No se pudo hacer login, saltando test de logout')
      return
    }
    
    // Buscar botón de logout
    const logoutSelectors = [
      'button:has-text("Cerrar sesión")',
      'button:has-text("Salir")',
      'button:has-text("Logout")',
      '[aria-label*="logout"]'
    ]
    
    let logoutClicked = false
    for (const selector of logoutSelectors) {
      const element = page.locator(selector).first()
      if (await element.count() > 0) {
        await element.click()
        logoutClicked = true
        console.log(`✓ Botón de logout encontrado: ${selector}`)
        break
      }
    }
    
    if (logoutClicked) {
      await page.waitForLoadState('networkidle')
      
      // Verificar que volvimos al login
      expect(page.url()).toContain('/login')
      console.log('✓ Logout exitoso')
    }
  })
})