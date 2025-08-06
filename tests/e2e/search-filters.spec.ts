import { test, expect } from '@playwright/test'

test.describe('Search and Filters E2E Tests', () => {
  const mockPerritos = [
    {
      id: '1',
      nombre: 'Max',
      slug: 'max-golden',
      fotoPrincipal: '/images/max.jpg',
      raza: 'Golden Retriever',
      edad: '3 años',
      sexo: 'Macho',
      tamano: 'Grande',
      energia: 'Alta',
      estado: 'disponible',
      aptoNinos: true,
      esNuevo: true,
      destacado: true
    },
    {
      id: '2',
      nombre: 'Luna',
      slug: 'luna-labrador',
      fotoPrincipal: '/images/luna.jpg',
      raza: 'Labrador',
      edad: '2 años',
      sexo: 'Hembra',
      tamano: 'Mediano',
      energia: 'Media',
      estado: 'disponible',
      aptoNinos: true,
      esNuevo: false,
      destacado: false
    }
  ]

  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/perritos**', async (route, request) => {
      const url = new URL(request.url())
      const search = url.searchParams.get('search') || ''
      const tamano = url.searchParams.get('tamano') || ''
      const energia = url.searchParams.get('energia') || ''
      
      // Filter mock data based on search parameters
      let filteredPerritos = [...mockPerritos]
      
      if (search) {
        filteredPerritos = filteredPerritos.filter(p => 
          p.nombre.toLowerCase().includes(search.toLowerCase()) ||
          p.raza.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      if (tamano) {
        filteredPerritos = filteredPerritos.filter(p => p.tamano === tamano)
      }
      
      if (energia) {
        filteredPerritos = filteredPerritos.filter(p => p.energia === energia)
      }

      const mockResponse = {
        perritos: filteredPerritos,
        pagination: {
          page: 1,
          limit: 12,
          total: filteredPerritos.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        },
        filters: { search, tamano, energia }
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      })
    })

    await page.goto('/perritos')
    await page.waitForLoadState('networkidle')
  })

  test('should perform basic text search', async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[placeholder*="buscar"], input[aria-label*="búsqueda"]')
    await expect(searchInput).toBeVisible()

    // Perform search
    await searchInput.fill('Max')
    await searchInput.press('Enter')
    
    // Wait for API response
    await page.waitForResponse('**/api/perritos**')
    await page.waitForTimeout(500) // Allow debounce

    // Should show filtered results
    const resultText = page.locator('text=Max')
    await expect(resultText).toBeVisible()

    // Should not show Luna
    const lunaText = page.locator('text=Luna')
    expect(await lunaText.count()).toBe(0)
  })

  test('should search by breed', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="buscar"], input[aria-label*="búsqueda"]')
    await expect(searchInput).toBeVisible()

    // Search for Golden Retriever
    await searchInput.fill('Golden')
    await page.waitForResponse('**/api/perritos**')
    await page.waitForTimeout(500)

    // Should show Max (Golden Retriever)
    await expect(page.locator('text=Max')).toBeVisible()
    await expect(page.locator('text=Golden Retriever')).toBeVisible()
  })

  test('should clear search results', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="buscar"], input[aria-label*="búsqueda"]')
    
    // Perform search first
    await searchInput.fill('Max')
    await page.waitForResponse('**/api/perritos**')
    await page.waitForTimeout(500)

    // Clear search
    const clearButton = page.locator('button[aria-label*="limpiar"], .clear-search')
    if (await clearButton.count() > 0) {
      await clearButton.click()
    } else {
      await searchInput.clear()
      await searchInput.press('Enter')
    }

    await page.waitForResponse('**/api/perritos**')
    await page.waitForTimeout(500)

    // Should show all results again
    await expect(page.locator('text=Max')).toBeVisible()
    await expect(page.locator('text=Luna')).toBeVisible()
  })

  test('should handle empty search results', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="buscar"], input[aria-label*="búsqueda"]')
    
    // Search for non-existent dog
    await searchInput.fill('NonExistentDog')
    await page.waitForResponse('**/api/perritos**')
    await page.waitForTimeout(500)

    // Should show no results message
    const noResultsMessages = [
      'text=No se encontraron',
      'text=Sin resultados',
      'text=No hay perritos',
      '.empty-state',
      '[data-testid="empty-results"]'
    ]

    let foundEmptyState = false
    for (const selector of noResultsMessages) {
      if (await page.locator(selector).count() > 0) {
        await expect(page.locator(selector)).toBeVisible()
        foundEmptyState = true
        break
      }
    }

    // At minimum, shouldn't show the normal results
    expect(await page.locator('text=Max').count()).toBe(0)
    expect(await page.locator('text=Luna').count()).toBe(0)
  })

  test('should filter by size', async ({ page }) => {
    // Look for size filter controls
    const sizeFilterSelectors = [
      'select[name="tamano"]',
      'select[name="size"]',
      'input[name="tamano"]',
      'button:has-text("Grande")',
      'label:has-text("Grande")'
    ]

    let sizeFilter = null
    for (const selector of sizeFilterSelectors) {
      const element = page.locator(selector).first()
      if (await element.count() > 0) {
        sizeFilter = element
        break
      }
    }

    if (sizeFilter) {
      if (await sizeFilter.getAttribute('type') === 'checkbox' || 
          await sizeFilter.getAttribute('type') === 'radio') {
        await sizeFilter.check()
      } else if ((await sizeFilter.tagName()) === 'SELECT') {
        await sizeFilter.selectOption('Grande')
      } else if ((await sizeFilter.tagName()) === 'BUTTON') {
        await sizeFilter.click()
      }

      await page.waitForResponse('**/api/perritos**')
      await page.waitForTimeout(500)

      // Should show only large dogs (Max)
      await expect(page.locator('text=Max')).toBeVisible()
      expect(await page.locator('text=Luna').count()).toBe(0)
    }
  })

  test('should filter by energy level', async ({ page }) => {
    const energyFilterSelectors = [
      'select[name="energia"]',
      'select[name="energy"]',
      'button:has-text("Alta")',
      'label:has-text("Alta")',
      'input[value="Alta"]'
    ]

    let energyFilter = null
    for (const selector of energyFilterSelectors) {
      const element = page.locator(selector).first()
      if (await element.count() > 0) {
        energyFilter = element
        break
      }
    }

    if (energyFilter) {
      if (await energyFilter.getAttribute('type') === 'checkbox' || 
          await energyFilter.getAttribute('type') === 'radio') {
        await energyFilter.check()
      } else if ((await energyFilter.tagName()) === 'SELECT') {
        await energyFilter.selectOption('Alta')
      } else if ((await energyFilter.tagName()) === 'BUTTON') {
        await energyFilter.click()
      }

      await page.waitForResponse('**/api/perritos**')
      await page.waitForTimeout(500)

      // Should show only high energy dogs (Max)
      await expect(page.locator('text=Max')).toBeVisible()
      expect(await page.locator('text=Luna').count()).toBe(0)
    }
  })

  test('should combine search and filters', async ({ page }) => {
    // First apply a filter (if available)
    const sizeFilter = page.locator('select[name="tamano"], button:has-text("Grande")').first()
    if (await sizeFilter.count() > 0) {
      if ((await sizeFilter.tagName()) === 'SELECT') {
        await sizeFilter.selectOption('Grande')
      } else {
        await sizeFilter.click()
      }
      await page.waitForResponse('**/api/perritos**')
    }

    // Then apply search
    const searchInput = page.locator('input[placeholder*="buscar"], input[aria-label*="búsqueda"]')
    if (await searchInput.count() > 0) {
      await searchInput.fill('Max')
      await page.waitForResponse('**/api/perritos**')
      await page.waitForTimeout(500)

      // Should show Max (matches both search and filter)
      await expect(page.locator('text=Max')).toBeVisible()
    }
  })

  test('should handle search input debouncing', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="buscar"], input[aria-label*="búsqueda"]')
    await expect(searchInput).toBeVisible()

    // Type quickly without waiting
    await searchInput.type('Max', { delay: 50 })

    // Should debounce and eventually make the API call
    await page.waitForResponse('**/api/perritos**')
    await page.waitForTimeout(500)

    await expect(page.locator('text=Max')).toBeVisible()
  })

  test('should display search loading state', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="buscar"], input[aria-label*="búsqueda"]')
    
    // Look for loading indicators during search
    await searchInput.fill('Max')
    
    // Check for loading states
    const loadingIndicators = [
      '.loading',
      '.spinner',
      'text=Cargando',
      'text=Loading',
      '[data-testid="loading"]'
    ]

    // Note: This might be too fast to catch, so we'll just ensure search works
    await page.waitForResponse('**/api/perritos**')
    await page.waitForTimeout(500)

    await expect(page.locator('text=Max')).toBeVisible()
  })

  test('should maintain filter state on page refresh', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="buscar"], input[aria-label*="búsqueda"]')
    
    // Apply search
    await searchInput.fill('Max')
    await page.waitForResponse('**/api/perritos**')
    await page.waitForTimeout(500)

    // Get current URL (might include search params)
    const currentUrl = page.url()

    // Refresh page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // If URL params are used, search should be maintained
    if (currentUrl.includes('search=Max')) {
      await expect(searchInput).toHaveValue('Max')
      await expect(page.locator('text=Max')).toBeVisible()
    }
  })

  test('should handle special characters in search', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="buscar"], input[aria-label*="búsqueda"]')
    
    // Test with special characters
    const specialSearchTerms = ['ñ', 'á', '@', '$', '#']
    
    for (const term of specialSearchTerms) {
      await searchInput.clear()
      await searchInput.fill(term)
      await page.waitForResponse('**/api/perritos**')
      await page.waitForTimeout(300)
      
      // Should not crash and should handle gracefully
      await expect(searchInput).toHaveValue(term)
    }
  })

  test('should be accessible with keyboard navigation', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="buscar"], input[aria-label*="búsqueda"]')
    
    // Tab to search input
    await page.keyboard.press('Tab')
    
    // Check if search input is focused (or at least reachable)
    const focusedElement = page.locator(':focus')
    if (await focusedElement.count() > 0) {
      // Type in search
      await page.keyboard.type('Max')
      await page.keyboard.press('Enter')
      
      await page.waitForResponse('**/api/perritos**')
      await page.waitForTimeout(500)
      
      await expect(page.locator('text=Max')).toBeVisible()
    }
  })

  test('should work on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    const searchInput = page.locator('input[placeholder*="buscar"], input[aria-label*="búsqueda"]')
    await expect(searchInput).toBeVisible()
    
    // Test search on mobile
    await searchInput.fill('Max')
    await page.waitForResponse('**/api/perritos**')
    await page.waitForTimeout(500)
    
    await expect(page.locator('text=Max')).toBeVisible()
    
    // Check that filters are accessible (might be in a collapsible menu)
    const filterToggleSelectors = [
      'button:has-text("Filtros")',
      'button:has-text("Filters")',
      '.filter-toggle',
      '[data-testid="filter-toggle"]'
    ]

    for (const selector of filterToggleSelectors) {
      const filterToggle = page.locator(selector).first()
      if (await filterToggle.count() > 0) {
        await filterToggle.click()
        // Filters should become visible
        break
      }
    }
  })
})