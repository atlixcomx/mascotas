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
            <DogIcon size={24} color="white" />
            <span>Ver Catálogo de Perritos</span>
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
          z-index: 999;
          pointer-events: none;
          transition: background-color 0.3s ease;
        }

        .mobile-overlay.active {
          background-color: rgba(0, 0, 0, 0.5);
          pointer-events: auto;
        }

        /* Menu Panel */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: -100%;
          width: 100%;
          max-width: 380px;
          height: 100vh;
          height: 100dvh;
          background-color: #ffffff;
          z-index: 1000;
          transition: right 0.3s ease;
          display: flex;
          flex-direction: column;
          box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
        }

        .mobile-menu.active {
          right: 0;
        }

        /* Header */
        .mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 2px solid #f0f0f0;
          background-color: #fafafa;
        }

        .mobile-logo {
          width: 60px;
          height: 60px;
        }

        .mobile-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .mobile-close {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          border: 2px solid #000000;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-close:hover {
          background-color: #000000;
        }

        :global(.mobile-close:hover svg) {
          stroke: #ffffff;
        }

        /* Navigation */
        .mobile-nav {
          flex: 1;
          overflow-y: auto;
          padding: 24px 0;
          -webkit-overflow-scrolling: touch;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          padding: 20px 24px;
          text-decoration: none;
          transition: all 0.2s ease;
          border-bottom: 1px solid #f5f5f5;
          position: relative;
        }

        .mobile-nav-item:hover {
          background-color: #f8f8f8;
        }

        .mobile-nav-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0f0f0;
          border-radius: 10px;
          margin-right: 16px;
          transition: all 0.2s ease;
        }

        .mobile-nav-item:hover .mobile-nav-icon {
          background-color: #af1731;
        }

        :global(.mobile-nav-item:hover .mobile-nav-icon svg) {
          stroke: #ffffff;
          fill: #ffffff;
        }

        .mobile-nav-label {
          flex: 1;
          font-size: 18px;
          font-weight: 600;
          color: #000000;
          letter-spacing: -0.3px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .mobile-nav-arrow {
          font-size: 20px;
          color: #999999;
          transition: all 0.2s ease;
        }

        .mobile-nav-item:hover .mobile-nav-arrow {
          color: #af1731;
          transform: translateX(4px);
        }

        /* CTA Container */
        .mobile-cta-container {
          padding: 24px;
          border-top: 2px solid #f0f0f0;
        }

        .mobile-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 18px 24px;
          background-color: #0e312d;
          color: #ffffff;
          text-decoration: none;
          font-size: 18px;
          font-weight: 700;
          border-radius: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(14, 49, 45, 0.2);
        }

        .mobile-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(14, 49, 45, 0.3);
          background-color: #1a4a45;
        }

        /* Footer */
        .mobile-footer {
          padding: 20px 24px;
          text-align: center;
          background-color: #fafafa;
          border-top: 1px solid #f0f0f0;
        }

        .mobile-footer p {
          margin: 4px 0;
          font-size: 14px;
          color: #666666;
          line-height: 1.4;
        }

        /* Responsive */
        @media (max-width: 380px) {
          .mobile-menu {
            max-width: 100%;
          }

          .mobile-nav-label {
            font-size: 16px;
          }

          .mobile-cta {
            font-size: 16px;
            padding: 16px 20px;
          }
        }
      `}</style>
    </>
  )
}