'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Cerrar menú móvil cuando cambia el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header style={{
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        height: '8px',
        backgroundColor: '#af1731'
      }}></div>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '80px'
        }}>
          {/* Logo y título */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flex: 1
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #af1731, #840f31)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              minWidth: '48px'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 7V11C3 16.5 6.8 21.7 12 23C17.2 21.7 21 16.5 21 11V7L12 2Z" />
              </svg>
            </div>
            <div className="header-title">
              <h1 style={{
                fontWeight: 'bold',
                fontSize: '20px',
                color: '#0e312d',
                margin: 0,
                lineHeight: '1.2'
              }}>Centro de Adopción Atlixco</h1>
              <p style={{
                fontSize: '12px',
                color: '#666',
                margin: 0,
                lineHeight: '1.2'
              }}>Gobierno Municipal de Atlixco | 2024</p>
            </div>
          </div>

          {/* Navegación desktop */}
          <nav className="desktop-nav" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px'
          }}>
            <a href="/" style={{
              color: '#4a4a4a',
              textDecoration: 'none',
              fontWeight: '500',
              padding: '8px 0',
              transition: 'color 0.2s'
            }}>
              Inicio
            </a>
            <a href="/perritos" style={{
              color: '#4a4a4a',
              textDecoration: 'none',
              fontWeight: '500',
              padding: '8px 0',
              transition: 'color 0.2s'
            }}>
              Perritos
            </a>
            <a href="#contacto" style={{
              color: '#4a4a4a',
              textDecoration: 'none',
              fontWeight: '500',
              padding: '8px 0',
              transition: 'color 0.2s'
            }}>
              Contacto
            </a>
            <a href="/admin" style={{
              backgroundColor: '#af1731',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}>
              Portal Administrativo
            </a>
          </nav>

          {/* Botón menú hamburguesa */}
          <button
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            aria-label="Abrir menú de navegación"
          >
            <Menu style={{ width: '24px', height: '24px', color: '#4a4a4a' }} />
          </button>
        </div>
      </div>

      {/* Overlay del menú móvil */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1001
          }}
          onClick={closeMobileMenu}
        />
      )}

      {/* Menú móvil */}
      <div
        className="mobile-menu"
        style={{
          position: 'fixed',
          top: 0,
          right: isMobileMenuOpen ? 0 : '-100%',
          width: '280px',
          height: '100vh',
          backgroundColor: 'white',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
          zIndex: 1002,
          transition: 'right 0.3s ease',
          overflow: 'hidden'
        }}
      >
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #af1731, #840f31)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L3 7V11C3 16.5 6.8 21.7 12 23C17.2 21.7 21 16.5 21 11V7L12 2Z" />
                </svg>
              </div>
              <span style={{
                fontWeight: '600',
                fontSize: '16px',
                color: '#0e312d'
              }}>Menú</span>
            </div>
            <button
              onClick={closeMobileMenu}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Cerrar menú"
            >
              <X style={{ width: '20px', height: '20px', color: '#4a4a4a' }} />
            </button>
          </div>
        </div>

        <nav style={{ padding: '20px 0' }}>
          <a
            href="/"
            onClick={closeMobileMenu}
            style={{
              display: 'block',
              padding: '16px 20px',
              color: '#1a1a1a',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '16px',
              borderBottom: '1px solid #f3f4f6',
              transition: 'background-color 0.2s'
            }}
          >
            🏠 Inicio
          </a>
          <a
            href="/perritos"
            onClick={closeMobileMenu}
            style={{
              display: 'block',
              padding: '16px 20px',
              color: '#1a1a1a',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '16px',
              borderBottom: '1px solid #f3f4f6',
              transition: 'background-color 0.2s'
            }}
          >
            🐕 Perritos
          </a>
          <a
            href="#contacto"
            onClick={closeMobileMenu}
            style={{
              display: 'block',
              padding: '16px 20px',
              color: '#1a1a1a',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '16px',
              borderBottom: '1px solid #f3f4f6',
              transition: 'background-color 0.2s'
            }}
          >
            📞 Contacto
          </a>
          <a
            href="/admin"
            onClick={closeMobileMenu}
            style={{
              display: 'block',
              margin: '20px',
              padding: '12px 16px',
              backgroundColor: '#af1731',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              borderRadius: '8px',
              textAlign: 'center',
              transition: 'background-color 0.2s'
            }}
          >
            ⚙️ Portal Administrativo
          </a>
        </nav>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          
          .mobile-menu-button {
            display: flex !important;
          }
          
          .header-title h1 {
            font-size: 16px !important;
          }
          
          .header-title p {
            font-size: 11px !important;
          }
        }
        
        @media (max-width: 480px) {
          .header-title h1 {
            font-size: 14px !important;
          }
          
          .header-title p {
            display: none !important;
          }
        }
        
        .mobile-menu a:hover {
          background-color: #f9fafb;
        }
        
        .mobile-menu-button:hover {
          background-color: #f3f4f6;
        }
      `}</style>
    </header>
  );
}