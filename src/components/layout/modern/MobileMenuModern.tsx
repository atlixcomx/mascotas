'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { navigationItems } from './navigation.config'
import styles from './MobileMenuModern.module.css'

interface MobileMenuModernProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenuModern({ isOpen, onClose }: MobileMenuModernProps) {
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)
  const lastTouchY = useRef(0)

  // Manejo de gestos táctiles para cerrar
  useEffect(() => {
    if (!isOpen) return

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY
      const deltaY = currentY - lastTouchY.current
      
      // Si el usuario desliza hacia abajo desde la parte superior, cerrar
      if (menuRef.current && deltaY > 50 && menuRef.current.scrollTop === 0) {
        onClose()
      }
    }

    const menu = menuRef.current
    if (menu) {
      menu.addEventListener('touchstart', handleTouchStart, { passive: true })
      menu.addEventListener('touchmove', handleTouchMove, { passive: true })
    }

    return () => {
      if (menu) {
        menu.removeEventListener('touchstart', handleTouchStart)
        menu.removeEventListener('touchmove', handleTouchMove)
      }
    }
  }, [isOpen, onClose])

  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const isActiveRoute = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu */}
      <div 
        id="mobile-menu"
        ref={menuRef}
        className={`${styles.menu} ${isOpen ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación móvil"
      >
        {/* Header del menú */}
        <div className={styles.menuHeader}>
          <Image
            src="/centroB.png"
            alt="Centro de Bienestar Animal"
            width={100}
            height={34}
            className={styles.menuLogo}
          />
          
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Cerrar menú"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Pull indicator para gestos */}
        <div className={styles.pullIndicator} aria-hidden="true" />

        {/* Navigation */}
        <nav className={styles.menuNav}>
          <ul className={styles.menuList}>
            {navigationItems.map((item, index) => (
              <li 
                key={item.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className={styles.menuItem}
              >
                <Link
                  href={item.href}
                  className={`
                    ${styles.menuLink} 
                    ${isActiveRoute(item.href) ? styles.active : ''}
                    ${item.highlight ? styles.highlight : ''}
                  `}
                  onClick={onClose}
                >
                  <span className={styles.menuIcon}>{item.icon}</span>
                  <span className={styles.menuLabel}>{item.label}</span>
                  {isActiveRoute(item.href) && (
                    <span className={styles.activeIndicator} aria-hidden="true" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA Section */}
        <div className={styles.ctaSection}>
          <Link 
            href="/catalogo" 
            className={styles.ctaButton}
            onClick={onClose}
          >
            <span className={styles.ctaIcon}>🐕</span>
            <span className={styles.ctaText}>Conoce a nuestros perritos</span>
            <svg 
              className={styles.ctaArrow}
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Footer info */}
        <div className={styles.menuFooter}>
          <p className={styles.footerText}>
            Centro de Bienestar Animal Atlixco
          </p>
          <p className={styles.footerSubtext}>
            Gobierno Municipal 2024-2027
          </p>
        </div>
      </div>
    </>
  )
}