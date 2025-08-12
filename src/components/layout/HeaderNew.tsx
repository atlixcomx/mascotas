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
    { href: '/programa-adopcion', label: 'Cómo Adoptar' },
    { href: '/noticias', label: 'Noticias y Eventos' },
    { href: '/comercios-friendly', label: 'Comercios Pet Friendly' },
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
                width={120}
                height={120}
                className="header-logo-img"
                priority
              />
            </Link>

            {/* Navegación Desktop */}
            <nav className="header-nav-desktop">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="header-nav-link">
                  {item.label}
                </Link>
              ))}
              <Link href="/catalogo" className="header-cta-button">
                <DogIcon size={18} color="white" />
                <span>Catálogo de Perritos</span>
              </Link>
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
          <span className="mobile-menu-title">Menú</span>
          <button
            className="mobile-menu-close"
            onClick={closeMenu}
            aria-label="Cerrar menú"
          >
            <CloseIcon size={20} color="#4a4a4a" />
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
              {item.label}
            </Link>
          ))}
          <Link
            href="/catalogo"
            className="mobile-menu-cta"
            onClick={closeMenu}
          >
            <DogIcon size={18} color="white" />
            <span>Ver Catálogo de Perritos</span>
          </Link>
        </nav>
      </div>

      <style jsx>{`
        /* Variables CSS */
        :root {
          --header-height-mobile: 70px;
          --header-height-desktop: 100px;
          --primary-color: #0e312d;
          --accent-color: #af1731;
          --cta-color: #0e312d;
          --text-color: #0e312d;
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
          position: sticky;
          top: 0;
          z-index: 1000;
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
          width: 50px;
          height: 50px;
          object-fit: contain;
        }

        /* Navegación Desktop */
        .header-nav-desktop {
          display: none;
          align-items: center;
          gap: 24px;
        }

        .header-nav-link {
          color: var(--text-color);
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 6px;
          transition: var(--transition);
          position: relative;
        }

        .header-nav-link:hover {
          background-color: #f3f4f6;
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
          right: -280px;
          width: 280px;
          height: 100vh;
          background-color: white;
          box-shadow: -2px 0 8px rgba(0,0,0,0.1);
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
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .mobile-menu-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-color);
        }

        .mobile-menu-close {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          border-radius: 4px;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-menu-close:hover {
          background-color: #f3f4f6;
        }

        .mobile-menu-nav {
          padding: 20px 0;
        }

        .mobile-menu-link {
          display: block;
          padding: 16px 20px;
          color: var(--text-color);
          text-decoration: none;
          font-weight: 500;
          font-size: 16px;
          border-bottom: 1px solid #f3f4f6;
          transition: var(--transition);
        }

        .mobile-menu-link:hover {
          background-color: #f9fafb;
          padding-left: 24px;
        }

        .mobile-menu-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 20px;
          padding: 14px 16px;
          background-color: var(--cta-color);
          color: white;
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
          border-radius: 8px;
          transition: var(--transition);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .mobile-menu-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        /* Animaciones */
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        /* Media Queries - Mobile First */
        @media (min-width: 768px) {
          .header-content {
            height: var(--header-height-desktop);
          }

          :global(.header-logo-img) {
            width: 80px;
            height: 80px;
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
            width: 100px;
            height: 100px;
          }

          .header-nav-desktop {
            gap: 32px;
          }

          .header-nav-link {
            font-size: 16px;
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