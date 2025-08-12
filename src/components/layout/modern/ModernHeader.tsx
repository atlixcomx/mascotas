'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { navigationItems, headerConfig } from './navigation.config'
import MobileMenuModern from './MobileMenuModern'
import styles from './ModernHeader.module.css'

export default function ModernHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()

  // Manejo inteligente del scroll
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    
    // Determinar si el header debe mostrarse
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false) // Ocultar al hacer scroll down
    } else {
      setIsVisible(true) // Mostrar al hacer scroll up
    }
    
    setIsScrolled(currentScrollY > 10)
    setLastScrollY(currentScrollY)
  }, [lastScrollY])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevenir scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const isActiveRoute = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <header 
        className={`
          ${styles.header} 
          ${isScrolled ? styles.scrolled : ''} 
          ${!isVisible ? styles.hidden : ''}
        `}
        role="banner"
      >
        <nav 
          className={styles.nav} 
          role="navigation" 
          aria-label="Navegación principal"
        >
          <div className={styles.container}>
            {/* Logo */}
            <Link 
              href="/" 
              className={styles.logo}
              aria-label="Ir al inicio - Centro de Bienestar Animal Atlixco"
            >
              <Image
                src="/micasab.png"
                alt="Centro de Bienestar Animal Atlixco"
                width={headerConfig.logo.desktop.width}
                height={headerConfig.logo.desktop.height}
                priority
                className={styles.logoImage}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className={styles.desktopNav}>
              <ul className={styles.navList}>
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`
                        ${styles.navLink} 
                        ${isActiveRoute(item.href) ? styles.active : ''}
                        ${item.highlight ? styles.highlight : ''}
                      `}
                      aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className={styles.menuIcon}>
                <span className={`${styles.menuLine} ${isMobileMenuOpen ? styles.open : ''}`} />
                <span className={`${styles.menuLine} ${isMobileMenuOpen ? styles.open : ''}`} />
                <span className={`${styles.menuLine} ${isMobileMenuOpen ? styles.open : ''}`} />
              </span>
            </button>
          </div>
        </nav>

        {/* Progress Bar (opcional) */}
        <div className={styles.progressBar} aria-hidden="true" />
      </header>

      {/* Mobile Menu */}
      <MobileMenuModern 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  )
}