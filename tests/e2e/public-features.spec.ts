import { test, expect } from '@playwright/test'

test.describe('Funcionalidades Públicas - Sistema de Adopción', () => {
  test('página principal y navegación', async ({ page }) => {
    console.log('1. Verificando página principal...')
    await page.goto('/')
    await expect(page).toHaveTitle(/Centro de Adopción|Atlixco/)
    
    // Verificar elementos principales
    const mainElements = [
      { selector: 'nav', name: 'Navegación' },
      { selector: 'h1, h2', name: 'Encabezados' },
      { selector: 'text=Adoptar', name: 'Enlace adoptar' },
      { selector: 'text=Perritos', name: 'Sección perritos' }
    ]
    
    for (const element of mainElements) {
      const count = await page.locator(element.selector).count()
      console.log(`✓ ${element.name}: ${count} encontrado(s)`)
      expect(count).toBeGreaterThan(0)
    }
  })

  test('listado de perritos disponibles', async ({ page }) => {
    console.log('2. Verificando listado de perritos...')
    await page.goto('/perritos')
    
    // Esperar a que carguen los perritos
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    // Verificar que hay perritos listados
    const perritoCards = page.locator('[class*="card"], [class*="perrito"], article')
    const count = await perritoCards.count()
    console.log(`✓ Perritos encontrados: ${count}`)
    
    if (count > 0) {
      // Verificar información del primer perrito
      const firstCard = perritoCards.first()
      const hasImage = await firstCard.locator('img').count() > 0
      const hasName = await firstCard.locator('h2, h3, h4').count() > 0
      
      expect(hasImage).toBe(true)
      expect(hasName).toBe(true)
      console.log('✓ Los perritos muestran imagen y nombre')
    }
    
    // Tomar screenshot
    await page.screenshot({ path: 'perritos-list.png', fullPage: true })
  })

  test('detalle de un perrito', async ({ page }) => {
    console.log('3. Verificando página de detalle...')
    await page.goto('/perritos')
    await page.waitForLoadState('networkidle')
    
    // Hacer clic en el primer perrito
    const firstPerrito = page.locator('[class*="card"], [class*="perrito"], article').first()
    const perritoLink = firstPerrito.locator('a').first()
    
    if (await perritoLink.count() > 0) {
      await perritoLink.click()
      await page.waitForLoadState('networkidle')
      
      // Verificar elementos del detalle
      const detailElements = [
        { selector: 'img', name: 'Imagen principal' },
        { selector: 'h1', name: 'Nombre del perrito' },
        { selector: 'text=edad', name: 'Edad' },
        { selector: 'text=tamaño', name: 'Tamaño' },
        { selector: 'button:has-text("Adoptar"), a:has-text("Adoptar")', name: 'Botón adoptar' }
      ]
      
      for (const element of detailElements) {
        const exists = await page.locator(element.selector).count() > 0
        console.log(`${exists ? '✓' : '✗'} ${element.name}`)
      }
      
      await page.screenshot({ path: 'perrito-detail.png', fullPage: true })
    }
  })

  test('formulario de adopción', async ({ page }) => {
    console.log('4. Verificando formulario de adopción...')
    
    // Ir directamente a un formulario de adopción
    await page.goto('/solicitud/1')
    await page.waitForLoadState('networkidle')
    
    // Verificar campos del formulario
    const formFields = [
      { selector: 'input[type="text"], input[name="nombre"]', name: 'Campo nombre' },
      { selector: 'input[type="email"]', name: 'Campo email' },
      { selector: 'input[type="tel"], input[name="telefono"]', name: 'Campo teléfono' },
      { selector: 'textarea, input[name="mensaje"]', name: 'Campo mensaje' },
      { selector: 'button[type="submit"]', name: 'Botón enviar' }
    ]
    
    let fieldsFound = 0
    for (const field of formFields) {
      const exists = await page.locator(field.selector).count() > 0
      if (exists) fieldsFound++
      console.log(`${exists ? '✓' : '✗'} ${field.name}`)
    }
    
    expect(fieldsFound).toBeGreaterThan(3)
    await page.screenshot({ path: 'adoption-form.png', fullPage: true })
  })

  test('comercios amigables', async ({ page }) => {
    console.log('5. Verificando sección de comercios...')
    await page.goto('/comercios')
    await page.waitForLoadState('networkidle')
    
    // Verificar que existe la página
    const hasTitle = await page.locator('h1').count() > 0
    expect(hasTitle).toBe(true)
    
    // Buscar comercios listados
    const comercios = await page.locator('[class*="comercio"], [class*="card"], article').count()
    console.log(`✓ Comercios encontrados: ${comercios}`)
    
    await page.screenshot({ path: 'comercios-list.png', fullPage: true })
  })

  test('responsividad móvil', async ({ page }) => {
    console.log('6. Verificando diseño responsive...')
    
    // Configurar viewport móvil
    await page.setViewportSize({ width: 375, height: 812 })
    
    await page.goto('/')
    
    // Verificar menú móvil
    const mobileMenu = page.locator('[aria-label*="menu"], [class*="mobile-menu"], button:has-text("Menu")')
    const hasMobileMenu = await mobileMenu.count() > 0
    console.log(`${hasMobileMenu ? '✓' : '✗'} Menú móvil detectado`)
    
    // Navegar a perritos en móvil
    await page.goto('/perritos')
    await page.waitForLoadState('networkidle')
    
    // Verificar que los elementos se adaptan
    const cards = page.locator('[class*="card"], [class*="perrito"]')
    if (await cards.count() > 0) {
      const firstCard = cards.first()
      const box = await firstCard.boundingBox()
      
      if (box) {
        console.log(`✓ Ancho de tarjeta en móvil: ${box.width}px`)
        expect(box.width).toBeLessThanOrEqual(375)
      }
    }
    
    await page.screenshot({ path: 'mobile-view.png', fullPage: true })
  })

  test('búsqueda y filtros', async ({ page }) => {
    console.log('7. Verificando búsqueda y filtros...')
    await page.goto('/perritos')
    await page.waitForLoadState('networkidle')
    
    // Buscar elementos de filtro
    const filterElements = [
      { selector: 'select, [role="combobox"]', name: 'Selectores' },
      { selector: 'input[type="search"], input[placeholder*="buscar"]', name: 'Búsqueda' },
      { selector: 'button:has-text("Filtrar"), button:has-text("Buscar")', name: 'Botón filtrar' }
    ]
    
    let filtersFound = 0
    for (const element of filterElements) {
      const count = await page.locator(element.selector).count()
      if (count > 0) filtersFound++
      console.log(`${count > 0 ? '✓' : '✗'} ${element.name}: ${count}`)
    }
    
    // Si hay filtros, intentar usarlos
    if (filtersFound > 0) {
      const selects = page.locator('select')
      if (await selects.count() > 0) {
        const firstSelect = selects.first()
        const options = await firstSelect.locator('option').count()
        console.log(`✓ Opciones en primer filtro: ${options}`)
      }
    }
  })
})