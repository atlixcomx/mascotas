'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MenuIcon, CloseIcon, DogIcon } from '../icons/Icons'
import MobileMenu from './MobileMenu'

export default function HeaderNew() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Prevenir scroll cuando el menú está abierto
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

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMenu = () => setIsMobileMenuOpen(false)

  const navItems = [
    { href: '/', label: 'Inicio' },
    { href: '/programa-adopcion', label: 'Bienestar Animal' },
    { href: '/catalogo', label: 'Catálogo Adopción' },
    { href: '/comercios-friendly', label: 'Comercios Pet Friendly' },
    { href: '/noticias', label: 'Noticias' },
  ]

  return (
    <>
      {/* Barra superior de color */}
      <div className="header-top-bar" />
      
      {/* Header principal */}
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            {/* Logo */}
            <Link href="/" className="header-logo">
              <Image
                src="/centro.png"
                alt="Centro de Adopción y Bienestar Animal"
                width={180}
                height={180}
                className="header-logo-img"
                priority
              />
            </Link>

            {/* Navegación Desktop */}
            <nav className="header-nav-desktop">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className="header-nav-link"
                  style={{ color: '#000000', fontWeight: 700 }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Botón menú móvil */}
            <button
              className="header-menu-button"
              onClick={toggleMenu}
              aria-label="Menú de navegación"
            >
              <MenuIcon size={24} color="#0e312d" />
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil profesional */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMenu} />

      <style jsx>{`
        /* Forzar color negro en todos los enlaces */
        :global(.header-nav-link) {
          color: #000000 !important;
        }
        
        /* Variables CSS */
        :root {
          --header-height-mobile: 120px;
          --header-height-desktop: 180px;
          --primary-color: #0e312d;
          --accent-color: #af1731;
          --cta-color: #0e312d;
          --text-color: #000000;
          --bg-color: white;
          --shadow: 0 2px 4px rgba(0,0,0,0.1);
          --max-width: 1200px;
          --transition: all 0.3s ease;
        }

        /* Barra superior */
        .header-top-bar {
          height: 8px;
          background-color: var(--accent-color);
        }

        /* Header principal */
        .header {
          background-color: var(--bg-color);
          box-shadow: var(--shadow);
          position: relative;
          z-index: 100;
        }

        .header-container {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 20px;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--header-height-mobile);
        }

        /* Logo */
        .header-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          transition: var(--transition);
        }

        .header-logo:hover {
          transform: scale(1.05);
        }

        :global(.header-logo-img) {
          width: 100px;
          height: 100px;
          object-fit: contain;
        }

        /* Navegación Desktop */
        .header-nav-desktop {
          display: none;
          align-items: center;
          gap: 12px;
        }

        .header-nav-link {
          color: #000000 !important;
          text-decoration: none;
          font-size: 18px;
          font-weight: 700;
          padding: 12px 20px;
          border-radius: 6px;
          transition: var(--transition);
          position: relative;
          white-space: nowrap;
        }

        .header-nav-link:hover {
          background-color: #f3f4f6;
          color: #af1731;
        }

        .header-nav-link::after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background-color: var(--accent-color);
          transition: width 0.3s ease;
        }

        .header-nav-link:hover::after {
          width: calc(100% - 32px);
        }

        /* Botón menú móvil */
        .header-menu-button {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          border-radius: 4px;
          transition: var(--transition);
        }

        .header-menu-button:hover {
          background-color: #f3f4f6;
        }

        /* Media Queries - Mobile First */
        @media (min-width: 768px) {
          .header-content {
            height: var(--header-height-desktop);
          }

          :global(.header-logo-img) {
            width: 140px;
            height: 140px;
          }

          .header-nav-desktop {
            display: flex;
          }

          .header-menu-button {
            display: none;
          }
        }

        @media (min-width: 1024px) {
          :global(.header-logo-img) {
            width: 160px;
            height: 160px;
          }

          .header-nav-desktop {
            gap: 20px;
          }

          .header-nav-link {
            font-size: 18px !important;
            color: #000000 !important;
          }
        }
      `}</style>
    </>
  )
}