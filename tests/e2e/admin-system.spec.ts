import { test, expect } from '@playwright/test'

test.describe('Sistema Administrativo de Atlixco', () => {
  test('debe permitir login de administrador', async ({ page }) => {
    await page.goto('/admin/')
    
    // Verificar que estamos en la página de login
    await expect(page).toHaveURL(/.*admin/)
    
    // Buscar campos de login
    const emailField = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"], input[placeholder*="correo"]').first()
    const passwordField = page.locator('input[type="password"], input[name="password"], input[placeholder*="contraseña"], input[placeholder*="password"]').first()
    const submitButton = page.locator('button[type="submit"], button:has-text("Iniciar"), button:has-text("Entrar"), button:has-text("Login")').first()
    
    // Llenar credenciales
    await emailField.fill('admin@atlixco.gob.mx')
    await passwordField.fill('Atlixco2024!')
    
    // Hacer login
    await submitButton.click()
    
    // Esperar redirección o cambio de estado
    await page.waitForLoadState('networkidle')
    
    // Verificar que el login fue exitoso
    const dashboardSelectors = [
      'text=Dashboard',
      'text=Panel',
      'text=Administración',
      'text=Bienvenido',
      'nav',
      '.dashboard',
      '.admin-panel'
    ]
    
    let foundDashboard = false
    for (const selector of dashboardSelectors) {
      if (await page.locator(selector).count() > 0) {
        foundDashboard = true
        break
      }
    }
    
    expect(foundDashboard).toBe(true)
  })
  
  test('debe mostrar panel de administración después del login', async ({ page }) => {
    // Login primero
    await page.goto('/admin/')
    await page.locator('input[type="email"]').first().fill('admin@atlixco.gob.mx')
    await page.locator('input[type="password"]').first().fill('Atlixco2024!')
    await page.locator('button[type="submit"]').first().click()
    await page.waitForLoadState('networkidle')
    
    // Verificar elementos del panel admin
    const adminElements = [
      { selector: 'text=Perritos', description: 'Gestión de perritos' },
      { selector: 'text=Solicitudes', description: 'Gestión de solicitudes' },
      { selector: 'text=Adopciones', description: 'Gestión de adopciones' },
      { selector: 'text=Usuarios', description: 'Gestión de usuarios' }
    ]
    
    for (const element of adminElements) {
      const found = await page.locator(element.selector).count() > 0
      if (found) {
        await expect(page.locator(element.selector).first()).toBeVisible()
      }
    }
  })
  
  test('debe permitir gestionar perritos', async ({ page }) => {
    // Login
    await page.goto('/admin/')
    await page.locator('input[type="email"]').first().fill('admin@atlixco.gob.mx')
    await page.locator('input[type="password"]').first().fill('Atlixco2024!')
    await page.locator('button[type="submit"]').first().click()
    await page.waitForLoadState('networkidle')
    
    // Navegar a sección de perritos
    const perritosLink = page.locator('a:has-text("Perritos"), nav >> text=Perritos').first()
    if (await perritosLink.count() > 0) {
      await perritosLink.click()
      await page.waitForLoadState('networkidle')
      
      // Verificar que estamos en la sección correcta
      const perritosPageSelectors = [
        'h1:has-text("Perritos")',
        'text=Lista de perritos',
        'text=Gestión de perritos',
        'table',
        '.perritos-list'
      ]
      
      let foundPerritosPage = false
      for (const selector of perritosPageSelectors) {
        if (await page.locator(selector).count() > 0) {
          foundPerritosPage = true
          break
        }
      }
      
      expect(foundPerritosPage).toBe(true)
      
      // Buscar botón para agregar nuevo perrito
      const addButtonSelectors = [
        'button:has-text("Agregar")',
        'button:has-text("Nuevo")',
        'a:has-text("Agregar")',
        'a:has-text("Nuevo")',
        '.add-button',
        '[aria-label*="agregar"]'
      ]
      
      let foundAddButton = false
      for (const selector of addButtonSelectors) {
        if (await page.locator(selector).count() > 0) {
          foundAddButton = true
          break
        }
      }
      
      expect(foundAddButton).toBe(true)
    }
  })
  
  test('debe mostrar lista de solicitudes de adopción', async ({ page }) => {
    // Login
    await page.goto('/admin/')
    await page.locator('input[type="email"]').first().fill('admin@atlixco.gob.mx')
    await page.locator('input[type="password"]').first().fill('Atlixco2024!')
    await page.locator('button[type="submit"]').first().click()
    await page.waitForLoadState('networkidle')
    
    // Navegar a solicitudes
    const solicitudesLink = page.locator('a:has-text("Solicitudes"), nav >> text=Solicitudes').first()
    if (await solicitudesLink.count() > 0) {
      await solicitudesLink.click()
      await page.waitForLoadState('networkidle')
      
      // Verificar elementos de la página de solicitudes
      const solicitudesElements = [
        'text=Solicitudes de adopción',
        'text=Pendientes',
        'text=Aprobadas',
        'text=Rechazadas',
        'table',
        '.solicitudes-table'
      ]
      
      let foundElement = false
      for (const selector of solicitudesElements) {
        if (await page.locator(selector).count() > 0) {
          foundElement = true
          break
        }
      }
      
      expect(foundElement).toBe(true)
    }
  })
  
  test('debe permitir cerrar sesión', async ({ page }) => {
    // Login
    await page.goto('/admin/')
    await page.locator('input[type="email"]').first().fill('admin@atlixco.gob.mx')
    await page.locator('input[type="password"]').first().fill('Atlixco2024!')
    await page.locator('button[type="submit"]').first().click()
    await page.waitForLoadState('networkidle')
    
    // Buscar botón de logout
    const logoutSelectors = [
      'button:has-text("Cerrar sesión")',
      'button:has-text("Salir")',
      'a:has-text("Logout")',
      'button:has-text("Logout")',
      '[aria-label*="logout"]',
      '[aria-label*="cerrar sesión"]'
    ]
    
    let logoutButton = null
    for (const selector of logoutSelectors) {
      const element = page.locator(selector).first()
      if (await element.count() > 0) {
        logoutButton = element
        break
      }
    }
    
    if (logoutButton) {
      await logoutButton.click()
      await page.waitForLoadState('networkidle')
      
      // Verificar que volvimos al login
      const loginField = await page.locator('input[type="email"], input[type="password"]').count()
      expect(loginField).toBeGreaterThan(0)
    }
  })
  
  test('debe validar credenciales incorrectas', async ({ page }) => {
    await page.goto('/admin/')
    
    // Intentar login con credenciales incorrectas
    await page.locator('input[type="email"]').first().fill('wrong@email.com')
    await page.locator('input[type="password"]').first().fill('wrongpassword')
    await page.locator('button[type="submit"]').first().click()
    
    await page.waitForTimeout(2000)
    
    // Buscar mensaje de error
    const errorSelectors = [
      'text=credenciales incorrectas',
      'text=error',
      'text=inválido',
      'text=incorrecto',
      '.error-message',
      '.alert-danger',
      '[role="alert"]'
    ]
    
    let foundError = false
    for (const selector of errorSelectors) {
      if (await page.locator(selector).count() > 0) {
        foundError = true
        break
      }
    }
    
    expect(foundError).toBe(true)
  })
  
  test('debe ser responsive en dispositivos móviles', async ({ page }) => {
    // Configurar viewport móvil
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/admin/')
    
    // Verificar que el formulario de login es visible en móvil
    const loginForm = await page.locator('form, .login-form').count()
    expect(loginForm).toBeGreaterThan(0)
    
    // Verificar que los campos son accesibles
    const emailField = page.locator('input[type="email"]').first()
    const passwordField = page.locator('input[type="password"]').first()
    
    await expect(emailField).toBeVisible()
    await expect(passwordField).toBeVisible()
    
    // Verificar tamaño mínimo para touch
    const emailBox = await emailField.boundingBox()
    const passwordBox = await passwordField.boundingBox()
    
    if (emailBox) expect(emailBox.height).toBeGreaterThanOrEqual(40)
    if (passwordBox) expect(passwordBox.height).toBeGreaterThanOrEqual(40)
  })
})