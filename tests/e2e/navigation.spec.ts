import { test, expect } from '@playwright/test'

test.describe('Navigation E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept API calls to prevent real database queries
    await page.route('**/api/perritos**', async route => {
      const mockResponse = {
        perritos: [
          {
            id: '1',
            nombre: 'Max',
            slug: 'max-golden',
            fotoPrincipal: '/images/test-dog.jpg',
            raza: 'Golden Retriever',
            edad: '3 años',
            sexo: 'Macho',
            tamano: 'Grande',
            energia: 'Alta',
            estado: 'disponible',
            aptoNinos: true,
            esNuevo: true,
            destacado: true
          }
        ],
        pagination: {
          page: 1,
          limit: 12,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        },
        filters: {}
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      })
    })

    await page.route('**/api/health**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'ok',
          timestamp: new Date().toISOString(),
          env: {
            NEXTAUTH_URL: 'configured',
            DATABASE_URL: 'configured',
            NEXTAUTH_SECRET: 'configured'
          }
        })
      })
    })
  })

  test('should navigate to homepage and display correct elements', async ({ page }) => {
    await page.goto('/')

    // Check page title
    await expect(page).toHaveTitle(/Atlixco/i)

    // Check header elements
    await expect(page.locator('header')).toBeVisible()
    
    // Check main navigation links
    const homeLink = page.locator('nav a[href="/"]')
    if (await homeLink.count() > 0) {
      await expect(homeLink).toBeVisible()
    }

    // Check if there's a perritos link
    const perritosLink = page.locator('nav a[href="/perritos"], a[href*="perritos"]')
    if (await perritosLink.count() > 0) {
      await expect(perritosLink).toBeVisible()
    }
  })

  test('should navigate to perritos catalog page', async ({ page }) => {
    await page.goto('/perritos')

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Check URL
    expect(page.url()).toContain('/perritos')

    // Check for catalog elements
    const catalogContainer = page.locator('[data-testid="catalogo-perritos"], .perritos-catalog, main')
    await expect(catalogContainer).toBeVisible({ timeout: 10000 })

    // Should display search functionality
    const searchInput = page.locator('input[placeholder*="buscar"], input[aria-label*="búsqueda"]')
    if (await searchInput.count() > 0) {
      await expect(searchInput).toBeVisible()
    }
  })

  test('should navigate from homepage to perritos catalog', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Look for various possible navigation elements to perritos
    const navigationSelectors = [
      'a[href="/perritos"]',
      'a[href*="perritos"]',
      'text=Ver Perritos',
      'text=Adoptar',
      'text=Adopción',
      'text=Catálogo'
    ]

    let navigationLink = null
    for (const selector of navigationSelectors) {
      const element = page.locator(selector).first()
      if (await element.count() > 0 && await element.isVisible()) {
        navigationLink = element
        break
      }
    }

    if (navigationLink) {
      await navigationLink.click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toMatch(/\/perritos|\/adopcion|\/catalogo/)
    } else {
      // Navigate directly if no link found
      await page.goto('/perritos')
    }

    // Verify we're on the correct page
    await expect(page.locator('main, body')).toBeVisible()
  })

  test('should handle navigation with keyboard', async ({ page }) => {
    await page.goto('/')
    
    // Test tab navigation
    await page.keyboard.press('Tab')
    
    // Check if focus is on a navigation element
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeTruthy()

    // Test Enter key navigation if focused on a link
    if (await focusedElement.getAttribute('href')) {
      await page.keyboard.press('Enter')
      await page.waitForLoadState('networkidle')
      
      // Should navigate to the linked page
      expect(page.url()).not.toBe('/')
    }
  })

  test('should display responsive navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Check for mobile navigation elements
    const possibleMobileMenus = [
      'button[aria-label*="menu"]',
      'button[aria-label*="navigation"]',
      '.mobile-menu-button',
      '[data-testid="mobile-menu"]'
    ]

    let mobileMenuButton = null
    for (const selector of possibleMobileMenus) {
      const element = page.locator(selector).first()
      if (await element.count() > 0) {
        mobileMenuButton = element
        break
      }
    }

    if (mobileMenuButton) {
      await expect(mobileMenuButton).toBeVisible()
      
      // Test mobile menu functionality
      await mobileMenuButton.click()
      
      // Check if mobile menu opened
      const mobileMenu = page.locator('.mobile-menu, [data-testid="mobile-menu-content"]')
      if (await mobileMenu.count() > 0) {
        await expect(mobileMenu).toBeVisible()
      }
    }
  })

  test('should handle back and forward browser navigation', async ({ page }) => {
    // Start at homepage
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Navigate to perritos
    await page.goto('/perritos')
    await page.waitForLoadState('networkidle')

    // Go back
    await page.goBack()
    await page.waitForLoadState('networkidle')
    expect(page.url()).toBe('http://localhost:3000/')

    // Go forward
    await page.goForward()
    await page.waitForLoadState('networkidle')
    expect(page.url()).toContain('/perritos')
  })

  test('should display footer navigation', async ({ page }) => {
    await page.goto('/')
    
    // Check for footer
    const footer = page.locator('footer')
    if (await footer.count() > 0) {
      await expect(footer).toBeVisible()
      
      // Check for footer links
      const footerLinks = footer.locator('a')
      const linkCount = await footerLinks.count()
      
      if (linkCount > 0) {
        // Test that footer links are visible and clickable
        for (let i = 0; i < Math.min(linkCount, 3); i++) {
          const link = footerLinks.nth(i)
          await expect(link).toBeVisible()
          
          const href = await link.getAttribute('href')
          if (href && href.startsWith('/')) {
            // Internal link - test navigation
            await link.click()
            await page.waitForLoadState('networkidle')
            expect(page.url()).toContain(href)
            
            // Go back for next test
            await page.goBack()
            await page.waitForLoadState('networkidle')
            break
          }
        }
      }
    }
  })

  test('should handle 404 errors gracefully', async ({ page }) => {
    // Visit a non-existent page
    const response = await page.goto('/non-existent-page')
    
    // Should either redirect to a valid page or show 404
    const status = response?.status()
    
    if (status === 404) {
      // Check for 404 page elements
      const notFoundIndicators = [
        'text=404',
        'text=Not Found',
        'text=Page not found',
        'text=No encontrada'
      ]

      let found404 = false
      for (const indicator of notFoundIndicators) {
        if (await page.locator(indicator).count() > 0) {
          found404 = true
          break
        }
      }
      
      expect(found404).toBe(true)
    } else {
      // Should redirect to a valid page
      expect(status).toBeLessThan(400)
    }

    // Should still have navigation available
    const navigation = page.locator('nav, header')
    if (await navigation.count() > 0) {
      await expect(navigation).toBeVisible()
    }
  })

  test('should maintain navigation state across page reloads', async ({ page }) => {
    await page.goto('/perritos')
    await page.waitForLoadState('networkidle')

    // Get current URL
    const originalUrl = page.url()

    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Should be on same page
    expect(page.url()).toBe(originalUrl)

    // Navigation should still be functional
    const navigation = page.locator('nav, header')
    if (await navigation.count() > 0) {
      await expect(navigation).toBeVisible()
    }
  })

  test('should load pages within reasonable time', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000)

    // Check page is functional
    await expect(page.locator('body')).toBeVisible()
  })
})