'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { MenuIcon, CloseIcon, DogIcon, HomeIcon, FormIcon, HandshakeIcon } from '../icons/Icons'

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
          <a href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flex: 1,
            textDecoration: 'none',
            cursor: 'pointer'
          }}>
            <div style={{
              width: '207px',
              height: '207px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '207px',
              position: 'relative',
              transition: 'transform 0.2s ease',
              margin: '40px 0 40px 0'
            }}>
              <Image 
                src="/centro.png" 
                alt="Centro de Adopción y Bienestar Animal"
                width={207}
                height={207}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </a>

          {/* Navegación desktop */}
          <nav className="desktop-nav" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <a href="/" style={{
              color: '#0e312d',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '600',
              padding: '8px 16px',
              borderRadius: '6px',
              transition: 'all 0.3s',
              border: '2px solid transparent'
            }}>
              Inicio
            </a>
            <a href="/programa-adopcion" style={{
              color: '#0e312d',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '600',
              padding: '8px 16px',
              borderRadius: '6px',
              transition: 'all 0.3s',
              border: '2px solid transparent'
            }}>
              Cómo Adoptar
            </a>
            <a href="/comercios-friendly" style={{
              color: '#0e312d',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '600',
              padding: '8px 16px',
              borderRadius: '6px',
              transition: 'all 0.3s',
              border: '2px solid transparent'
            }}>
              Catálogo de Comercios
            </a>
            <a href="/contacto" style={{
              color: '#0e312d',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '600',
              padding: '8px 16px',
              borderRadius: '6px',
              transition: 'all 0.3s',
              border: '2px solid transparent'
            }}>
              Contacto
            </a>
            <a href="/catalogo" style={{
              backgroundColor: '#0e312d',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '600',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <DogIcon size={18} color="white" /> Catálogo de Perritos
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
            <MenuIcon size={24} color="#4a4a4a" />
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
              <CloseIcon size={20} color="#4a4a4a" />
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
            <HomeIcon size={18} color="#1a1a1a" /> Inicio
          </a>
          <a
            href="/programa-adopcion"
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
            <FormIcon size={18} color="#1a1a1a" /> Cómo Adoptar
          </a>
          <a
            href="/comercios-friendly"
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
            <HandshakeIcon size={18} color="#1a1a1a" /> Comercios Pet Friendly
          </a>
          <a
            href="/contacto"
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
            Contacto
          </a>
          <a
            href="/catalogo"
            onClick={closeMobileMenu}
            style={{
              display: 'block',
              margin: '20px',
              padding: '14px 16px',
              backgroundColor: '#0e312d',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '15px',
              borderRadius: '8px',
              textAlign: 'center',
              transition: 'background-color 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <DogIcon size={18} color="white" /> Ver Catálogo de Perritos
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
        
        a:hover div[style*="transition"] {
          transform: scale(1.05) !important;
        }
        
        .desktop-nav a:hover {
          background-color: #f3f4f6 !important;
          border-color: #0e312d !important;
        }
      `}</style>
    </header>
  );
}