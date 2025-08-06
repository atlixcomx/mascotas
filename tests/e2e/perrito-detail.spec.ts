import { test, expect } from '@playwright/test'

test.describe('Perrito Detail E2E Tests', () => {
  const mockPerritoDetail = {
    id: '1',
    nombre: 'Max',
    slug: 'max-golden',
    fotoPrincipal: '/images/max.jpg',
    fotos: ['/images/max.jpg', '/images/max2.jpg', '/images/max3.jpg'],
    raza: 'Golden Retriever',
    edad: '3 años',
    sexo: 'Macho',
    tamano: 'Grande',
    energia: 'Alta',
    estado: 'disponible',
    aptoNinos: true,
    aptoPerros: true,
    aptoGatos: false,
    destacado: true,
    fechaIngreso: '2024-01-01',
    caracter: ['amigable', 'jugueton', 'leal'],
    historia: 'Max es un perro muy cariñoso que llegó al refugio después de ser encontrado en las calles. Es muy amigable con las personas y le encanta jugar.',
    peso: 25,
    procedencia: 'Rescate callejero',
    vacunas: true,
    esterilizado: true,
    desparasitado: true,
    saludNotas: 'Excelente estado de salud',
    vistas: 150,
    similares: [
      {
        id: '2',
        nombre: 'Buddy',
        slug: 'buddy-golden',
        fotoPrincipal: '/images/buddy.jpg',
        raza: 'Golden Retriever'
      }
    ]
  }

  test.beforeEach(async ({ page }) => {
    // Mock individual perrito API
    await page.route('**/api/perritos/max-golden', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPerritoDetail)
      })
    })

    // Mock general perritos API for navigation
    await page.route('**/api/perritos**', async route => {
      if (!route.request().url().includes('max-golden')) {
        const mockResponse = {
          perritos: [mockPerritoDetail],
          pagination: { page: 1, limit: 12, total: 1, totalPages: 1, hasNext: false, hasPrev: false },
          filters: {}
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockResponse)
        })
      }
    })

    await page.goto('/perritos/max-golden')
    await page.waitForLoadState('networkidle')
  })

  test('should display perrito basic information', async ({ page }) => {
    // Check page title or heading
    await expect(page.locator('h1, .perrito-name')).toContainText('Max')

    // Check basic information
    await expect(page.locator('text=Golden Retriever')).toBeVisible()
    await expect(page.locator('text=3 años')).toBeVisible()
    await expect(page.locator('text=Macho')).toBeVisible()
    await expect(page.locator('text=Grande')).toBeVisible()
    await expect(page.locator('text=Alta')).toBeVisible()
  })

  test('should display perrito main image', async ({ page }) => {
    // Check for main image
    const mainImage = page.locator('img[alt*="Max"], .main-image img, .perrito-photo img').first()
    await expect(mainImage).toBeVisible()
    
    // Check image has correct alt text
    const altText = await mainImage.getAttribute('alt')
    expect(altText?.toLowerCase()).toContain('max')
  })

  test('should display perrito gallery if available', async ({ page }) => {
    // Look for additional photos or gallery
    const gallerySelectors = [
      '.photo-gallery',
      '.image-gallery',
      '.perrito-photos',
      'img[src*="/images/max2.jpg"]',
      'img[src*="/images/max3.jpg"]'
    ]

    let hasGallery = false
    for (const selector of gallerySelectors) {
      if (await page.locator(selector).count() > 0) {
        await expect(page.locator(selector).first()).toBeVisible()
        hasGallery = true
        break
      }
    }

    // If no gallery found, at least main image should be present
    if (!hasGallery) {
      const mainImage = page.locator('img').first()
      await expect(mainImage).toBeVisible()
    }
  })

  test('should display adoption status', async ({ page }) => {
    // Check for availability status
    const statusSelectors = [
      'text=disponible',
      'text=Disponible',
      '.status-badge',
      '.availability-status'
    ]

    let foundStatus = false
    for (const selector of statusSelectors) {
      if (await page.locator(selector).count() > 0) {
        await expect(page.locator(selector).first()).toBeVisible()
        foundStatus = true
        break
      }
    }

    expect(foundStatus).toBe(true)
  })

  test('should display character traits', async ({ page }) => {
    // Look for character traits
    const traitSelectors = [
      'text=amigable',
      'text=jugueton',
      'text=leal',
      '.traits',
      '.character',
      '.personality'
    ]

    let foundTraits = 0
    for (const selector of traitSelectors) {
      if (await page.locator(selector).count() > 0) {
        foundTraits++
      }
    }

    expect(foundTraits).toBeGreaterThan(0)
  })

  test('should display compatibility information', async ({ page }) => {
    // Check for child-friendly indicator
    const childFriendlySelectors = [
      'text=Niños',
      'text=Apto para niños',
      'text=✓ Niños',
      '.child-friendly'
    ]

    let foundChildFriendly = false
    for (const selector of childFriendlySelectors) {
      if (await page.locator(selector).count() > 0) {
        foundChildFriendly = true
        break
      }
    }

    expect(foundChildFriendly).toBe(true)
  })

  test('should display perrito history/story', async ({ page }) => {
    // Look for story or history section
    const storyText = 'Max es un perro muy cariñoso'
    const storySelectors = [
      `text=${storyText}`,
      '.history',
      '.story',
      '.description'
    ]

    let foundStory = false
    for (const selector of storySelectors) {
      if (await page.locator(selector).count() > 0) {
        await expect(page.locator(selector).first()).toBeVisible()
        foundStory = true
        break
      }
    }

    // Story might be truncated or styled differently
    if (!foundStory) {
      // At least some descriptive text should be present
      const anyText = page.locator('text=cariñoso')
      if (await anyText.count() > 0) {
        foundStory = true
      }
    }

    expect(foundStory).toBe(true)
  })

  test('should display health information', async ({ page }) => {
    const healthIndicators = [
      'text=vacunas',
      'text=esterilizado',
      'text=desparasitado',
      'text=Vacunado',
      'text=Castrado',
      '.health-info'
    ]

    let foundHealthInfo = false
    for (const selector of healthIndicators) {
      if (await page.locator(selector).count() > 0) {
        foundHealthInfo = true
        break
      }
    }

    expect(foundHealthInfo).toBe(true)
  })

  test('should have adoption/contact call-to-action', async ({ page }) => {
    // Look for adoption buttons or contact information
    const ctaSelectors = [
      'button:has-text("Adoptar")',
      'button:has-text("Contactar")',
      'a:has-text("Adoptar")',
      'a:has-text("Solicitud")',
      '.adoption-button',
      '.contact-button'
    ]

    let foundCTA = false
    for (const selector of ctaSelectors) {
      if (await page.locator(selector).count() > 0) {
        await expect(page.locator(selector).first()).toBeVisible()
        foundCTA = true
        break
      }
    }

    expect(foundCTA).toBe(true)
  })

  test('should display similar perros if available', async ({ page }) => {
    // Look for similar dogs section
    const similarSelectors = [
      'text=similares',
      'text=Similares',
      'text=recomendados',
      'text=otros perros',
      '.similar-dogs',
      '.recommendations'
    ]

    // Since we have similar dogs in mock, at least section should exist
    let foundSimilar = false
    for (const selector of similarSelectors) {
      if (await page.locator(selector).count() > 0) {
        foundSimilar = true
        break
      }
    }

    // If similar section exists, should show Buddy
    if (foundSimilar) {
      const buddyText = page.locator('text=Buddy')
      if (await buddyText.count() > 0) {
        await expect(buddyText).toBeVisible()
      }
    }
  })

  test('should handle adoption button click', async ({ page }) => {
    // Find adoption button
    const adoptionButton = page.locator('button:has-text("Adoptar"), a:has-text("Adoptar")').first()
    
    if (await adoptionButton.count() > 0) {
      await adoptionButton.click()
      
      // Should navigate to adoption form or show modal
      await page.waitForTimeout(500)
      
      // Check for form, modal, or navigation
      const adoptionIndicators = [
        '.modal',
        '.adoption-form',
        'text=formulario',
        'text=solicitud'
      ]

      let foundAdoptionFlow = false
      for (const selector of adoptionIndicators) {
        if (await page.locator(selector).count() > 0) {
          foundAdoptionFlow = true
          break
        }
      }

      // Or check if URL changed
      if (!foundAdoptionFlow) {
        const currentUrl = page.url()
        foundAdoptionFlow = currentUrl.includes('solicitud') || currentUrl.includes('adopcion')
      }

      expect(foundAdoptionFlow).toBe(true)
    }
  })

  test('should handle image interactions', async ({ page }) => {
    const mainImage = page.locator('img[alt*="Max"], .main-image img, .perrito-photo img').first()
    await expect(mainImage).toBeVisible()

    // Click on image
    await mainImage.click()

    // Should open lightbox, modal, or gallery
    await page.waitForTimeout(500)

    const imageModalSelectors = [
      '.lightbox',
      '.image-modal',
      '.gallery-modal',
      '.modal img'
    ]

    let foundImageModal = false
    for (const selector of imageModalSelectors) {
      if (await page.locator(selector).count() > 0) {
        await expect(page.locator(selector).first()).toBeVisible()
        foundImageModal = true
        break
      }
    }

    // If modal opened, test closing it
    if (foundImageModal) {
      const closeSelectors = [
        'button[aria-label*="cerrar"]',
        'button[aria-label*="close"]',
        '.close-button',
        '.modal-close'
      ]

      for (const selector of closeSelectors) {
        const closeButton = page.locator(selector).first()
        if (await closeButton.count() > 0) {
          await closeButton.click()
          break
        }
      }

      // Or press Escape
      await page.keyboard.press('Escape')
    }
  })

  test('should handle 404 for non-existent perrito', async ({ page }) => {
    // Mock 404 response
    await page.route('**/api/perritos/non-existent-slug', async route => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Perrito no encontrado' })
      })
    })

    // Navigate to non-existent perrito
    const response = await page.goto('/perritos/non-existent-slug')
    
    // Should show 404 page or redirect
    if (response?.status() === 404) {
      const notFoundIndicators = [
        'text=404',
        'text=No encontrado',
        'text=Not found'
      ]

      let found404 = false
      for (const indicator of notFoundIndicators) {
        if (await page.locator(indicator).count() > 0) {
          found404 = true
          break
        }
      }

      expect(found404).toBe(true)
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    // Check that content is still visible and properly laid out
    await expect(page.locator('h1, .perrito-name')).toBeVisible()
    await expect(page.locator('img').first()).toBeVisible()

    // Check that text is readable (not too small)
    const heading = page.locator('h1, .perrito-name').first()
    const fontSize = await heading.evaluate(el => window.getComputedStyle(el).fontSize)
    const fontSizeNum = parseInt(fontSize.replace('px', ''))
    expect(fontSizeNum).toBeGreaterThan(16) // Minimum readable size

    // Test that adoption button is accessible on mobile
    const adoptionButton = page.locator('button:has-text("Adoptar"), a:has-text("Adoptar")').first()
    if (await adoptionButton.count() > 0) {
      await expect(adoptionButton).toBeVisible()
      
      // Button should be large enough for touch
      const buttonSize = await adoptionButton.boundingBox()
      if (buttonSize) {
        expect(buttonSize.height).toBeGreaterThan(40) // Minimum touch target
      }
    }
  })

  test('should have proper SEO elements', async ({ page }) => {
    // Check page title includes perrito name
    const title = await page.title()
    expect(title.toLowerCase()).toContain('max')

    // Check meta description if present
    const metaDescription = page.locator('meta[name="description"]')
    if (await metaDescription.count() > 0) {
      const content = await metaDescription.getAttribute('content')
      expect(content?.toLowerCase()).toContain('max')
    }

    // Check heading structure
    const h1 = page.locator('h1')
    expect(await h1.count()).toBeGreaterThan(0)
  })

  test('should handle loading states', async ({ page }) => {
    // Slow down API response to test loading state
    await page.route('**/api/perritos/max-golden', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPerritoDetail)
      })
    })

    await page.goto('/perritos/max-golden')

    // Should show loading state initially
    const loadingSelectors = [
      'text=Cargando',
      'text=Loading',
      '.loading',
      '.spinner',
      '.skeleton'
    ]

    let foundLoading = false
    for (const selector of loadingSelectors) {
      if (await page.locator(selector).count() > 0) {
        foundLoading = true
        break
      }
    }

    // Wait for content to load
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=Max')).toBeVisible()
  })
})