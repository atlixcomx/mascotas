'use client'

import { Suspense } from 'react'
import CatalogoPerritos from '../../components/CatalogoPerritos'
import { DogIcon, HeartIcon } from '../../components/icons/Icons'

export default function PerritosPage() {
  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0e312d 0%, #1a4a45 50%, #246257 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Patrón decorativo */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)`
        }} />
        
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '80px 20px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            textAlign: 'center',
            color: 'white'
          }}>
            <h1 style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: '800',
              marginBottom: '20px',
              letterSpacing: '-1px',
              lineHeight: '1.2'
            }}>
              Encuentra a Tu Nuevo{' '}
              <span style={{ color: '#bfb591' }}>Mejor Amigo</span>
            </h1>
            <p style={{
              fontSize: '20px',
              opacity: 0.85,
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6',
              fontWeight: '300'
            }}>
              Cada uno de nuestros rescatados está listo para llenar tu hogar de amor,
              lealtad y momentos inolvidables
            </p>
          </div>
        </div>
      </div>


      {/* Catálogo */}
      <Suspense fallback={
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '48px 20px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <div style={{
                  height: '240px',
                  background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <div style={{
                      height: '8px',
                      flex: 1,
                      background: 'rgba(255,255,255,0.3)',
                      borderRadius: '4px'
                    }} />
                    <div style={{
                      height: '8px',
                      flex: 1,
                      background: 'rgba(255,255,255,0.3)',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{
                    height: '20px',
                    background: '#f0f0f0',
                    borderRadius: '4px',
                    width: '60%',
                    marginBottom: '12px'
                  }} />
                  <div style={{
                    height: '14px',
                    background: '#f0f0f0',
                    borderRadius: '4px',
                    width: '80%',
                    marginBottom: '8px'
                  }} />
                  <div style={{
                    height: '14px',
                    background: '#f0f0f0',
                    borderRadius: '4px',
                    width: '40%'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      }>
        <CatalogoPerritos />
      </Suspense>
    </div>
  )
}