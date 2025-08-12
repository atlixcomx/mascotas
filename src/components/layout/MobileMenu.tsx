'use client'

import Link from 'next/link'
import { HomeIcon, HeartIcon, CatalogIcon, StoreIcon, NewsIcon, DogIcon, CloseIcon } from '../icons/Icons'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuItems = [
    { 
      href: '/', 
      label: 'Inicio',
      icon: <HomeIcon size={24} color="#0e312d" />
    },
    { 
      href: '/programa-adopcion', 
      label: 'Bienestar Animal',
      icon: <HeartIcon size={24} color="#0e312d" />
    },
    { 
      href: '/catalogo', 
      label: 'Catálogo Adopción',
      icon: <CatalogIcon size={24} color="#0e312d" />
    },
    { 
      href: '/comercios-friendly', 
      label: 'Comercios Pet Friendly',
      icon: <StoreIcon size={24} color="#0e312d" />
    },
    { 
      href: '/noticias', 
      label: 'Noticias',
      icon: <NewsIcon size={24} color="#0e312d" />
    },
  ]

  return (
    <>
      {/* Overlay */}
      <div 
        className={`mobile-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
        {/* Header */}
        <div className="mobile-header">
          <div className="mobile-logo">
            <img src="/centro.png" alt="Centro de Adopción" />
          </div>
          <button className="mobile-close" onClick={onClose}>
            <CloseIcon size={28} color="#000000" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mobile-nav">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-nav-item"
              onClick={onClose}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="mobile-nav-label">{item.label}</span>
              <span className="mobile-nav-arrow">→</span>
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="mobile-cta-container">
          <Link href="/catalogo" className="mobile-cta" onClick={onClose}>
            <DogIcon size={20} color="white" />
            <span>Conoce a nuestros perritos</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="mobile-footer">
          <p>Centro Municipal de Adopción</p>
          <p>Atlixco, Puebla</p>
        </div>
      </div>

      <style jsx>{`
        /* Overlay */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0);
          z-index: 9998;
          pointer-events: none;
          transition: background-color 0.3s ease;
          -webkit-backdrop-filter: blur(0px);
          backdrop-filter: blur(0px);
        }

        .mobile-overlay.active {
          background-color: rgba(0, 0, 0, 0.7);
          pointer-events: auto;
          -webkit-backdrop-filter: blur(4px);
          backdrop-filter: blur(4px);
        }

        /* Menu Panel */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: -100%;
          width: 85%;
          max-width: 320px;
          height: 100vh;
          height: 100dvh;
          background-color: #ffffff;
          z-index: 9999;
          transition: right 0.3s ease;
          display: flex;
          flex-direction: column;
          box-shadow: -8px 0 32px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }

        .mobile-menu.active {
          right: 0;
        }

        /* Header */
        .mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e5e5;
          background-color: #ffffff;
          min-height: 64px;
        }

        .mobile-logo {
          width: 50px;
          height: 50px;
        }

        .mobile-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .mobile-close {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f5f5;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .mobile-close:hover,
        .mobile-close:active {
          background-color: #e5e5e5;
          transform: scale(0.95);
        }

        /* Navigation */
        .mobile-nav {
          flex: 1;
          overflow-y: auto;
          padding: 16px 0;
          -webkit-overflow-scrolling: touch;
          background-color: #ffffff;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          text-decoration: none;
          transition: all 0.2s ease;
          margin: 0 12px 8px;
          border-radius: 12px;
          position: relative;
          background-color: #fafafa;
          -webkit-tap-highlight-color: transparent;
        }

        .mobile-nav-item:active {
          transform: scale(0.98);
          background-color: #f0f0f0;
        }

        .mobile-nav-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          border-radius: 10px;
          margin-right: 14px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        }

        .mobile-nav-item:active .mobile-nav-icon {
          background-color: #af1731;
        }

        :global(.mobile-nav-item:active .mobile-nav-icon svg) {
          stroke: #ffffff;
          fill: #ffffff;
        }

        .mobile-nav-label {
          flex: 1;
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: -0.2px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          line-height: 1.3;
        }

        .mobile-nav-arrow {
          font-size: 18px;
          color: #cccccc;
          transition: all 0.2s ease;
        }

        .mobile-nav-item:active .mobile-nav-arrow {
          color: #af1731;
          transform: translateX(2px);
        }

        /* CTA Container */
        .mobile-cta-container {
          padding: 16px 20px 20px;
          border-top: 1px solid #e5e5e5;
          background-color: #ffffff;
        }

        .mobile-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 14px 20px;
          background-color: #af1731;
          color: #ffffff;
          text-decoration: none;
          font-size: 16px;
          font-weight: 700;
          border-radius: 12px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(175, 23, 49, 0.25);
          -webkit-tap-highlight-color: transparent;
        }

        .mobile-cta:active {
          transform: scale(0.98);
          box-shadow: 0 2px 8px rgba(175, 23, 49, 0.2);
        }

        /* Footer */
        .mobile-footer {
          padding: 16px 20px;
          text-align: center;
          background-color: #f8f8f8;
          border-top: 1px solid #e5e5e5;
        }

        .mobile-footer p {
          margin: 2px 0;
          font-size: 12px;
          color: #666666;
          line-height: 1.5;
          font-weight: 500;
        }

        /* Responsive */
        @media (max-width: 380px) {
          .mobile-menu {
            width: 90%;
            max-width: 100%;
          }

          .mobile-nav-label {
            font-size: 15px;
          }

          .mobile-nav-item {
            padding: 14px 16px;
          }

          .mobile-cta {
            font-size: 15px;
            padding: 12px 16px;
          }
        }

        /* Force hardware acceleration */
        .mobile-menu,
        .mobile-overlay {
          -webkit-transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          -webkit-perspective: 1000;
        }
      `}</style>
    </>
  )
}