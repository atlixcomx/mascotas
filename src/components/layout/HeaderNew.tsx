'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MenuIcon, CloseIcon, DogIcon } from '../icons/Icons'

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

      {/* Overlay móvil */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMenu} />
      )}

      {/* Menú móvil */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu--open' : ''}`}>
        <div className="mobile-menu-header">
          <h2 className="mobile-menu-title">Menú</h2>
          <button
            className="mobile-menu-close"
            onClick={closeMenu}
            aria-label="Cerrar menú"
          >
            <CloseIcon size={24} color="#000000" />
          </button>
        </div>
        
        <nav className="mobile-menu-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-menu-link"
              onClick={closeMenu}
            >
              <span className="mobile-menu-text">{item.label}</span>
            </Link>
          ))}
          <Link
            href="/catalogo"
            className="mobile-menu-cta"
            onClick={closeMenu}
          >
            <DogIcon size={20} color="white" />
            <span className="mobile-menu-cta-text">Ver Catálogo de Perritos</span>
          </Link>
        </nav>
      </div>

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

        .header-cta-button {
          background-color: var(--cta-color);
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .header-cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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

        /* Overlay móvil */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1001;
          opacity: 0;
          animation: fadeIn 0.3s forwards;
        }

        /* Menú móvil */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: -320px;
          width: 320px;
          height: 100vh;
          background-color: #ffffff;
          box-shadow: -4px 0 16px rgba(0,0,0,0.15);
          z-index: 1002;
          transition: right 0.3s ease;
          overflow-y: auto;
        }

        .mobile-menu--open {
          right: 0;
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 2px solid #f0f0f0;
          background-color: #fafafa;
        }

        .mobile-menu-title {
          font-size: 24px;
          font-weight: 800;
          color: #000000;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .mobile-menu-close {
          background-color: #f0f0f0;
          border: 2px solid #000000;
          padding: 10px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-menu-close:hover {
          background-color: #000000;
        }
        
        :global(.mobile-menu-close:hover svg) {
          stroke: #ffffff;
        }

        .mobile-menu-nav {
          padding: 24px 0;
        }

        .mobile-menu-link {
          display: flex;
          align-items: center;
          padding: 20px 24px;
          text-decoration: none;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .mobile-menu-text {
          color: #000000;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }

        .mobile-menu-link:hover {
          background-color: #f5f5f5;
        }
        
        .mobile-menu-link:hover .mobile-menu-text {
          color: #af1731;
          transform: translateX(8px);
        }

        .mobile-menu-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 24px;
          padding: 18px 24px;
          background-color: #0e312d;
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(14, 49, 45, 0.25);
        }
        
        .mobile-menu-cta-text {
          color: #ffffff;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }

        .mobile-menu-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(14, 49, 45, 0.35);
          background-color: #1a4a45;
        }

        /* Animaciones */
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        
        /* Estilos adicionales para mejorar legibilidad móvil */
        @media (max-width: 768px) {
          .mobile-menu-text {
            transition: transform 0.2s ease;
          }
          
          /* Asegurar que el menú se vea correctamente en móviles pequeños */
          .mobile-menu {
            width: 100%;
            max-width: 320px;
            right: -100%;
          }
          
          .mobile-menu--open {
            right: 0;
          }
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

          .header-cta-button {
            padding: 12px 24px;
            font-size: 16px;
          }
        }
      `}</style>
    </>
  )
}