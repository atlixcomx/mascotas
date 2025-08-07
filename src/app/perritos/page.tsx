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
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              marginBottom: '24px',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.2)'
            }}>
              <DogIcon size={40} color="white" />
            </div>
            <h1 style={{ 
              fontSize: 'clamp(36px, 5vw, 56px)', 
              fontWeight: '800', 
              marginBottom: '16px',
              letterSpacing: '-1px'
            }}>
              Encuentra a Tu Nuevo Mejor Amigo
            </h1>
            <p style={{ 
              fontSize: '20px', 
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Cada uno de nuestros rescatados está listo para llenar tu hogar de amor, 
              lealtad y momentos inolvidables
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e9ecef',
        position: 'sticky',
        top: '88px',
        zIndex: 10,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          {[
            { number: '24', label: 'Disponibles', color: '#6b3838' },
            { number: '12', label: 'Cachorros', color: '#bfb591' },
            { number: '8', label: 'Adultos', color: '#0e312d' },
            { number: '4', label: 'Especiales', color: '#246257' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              textAlign: 'center',
              minWidth: '100px'
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: '800',
                color: stat.color,
                marginBottom: '4px'
              }}>{stat.number}</div>
              <div style={{
                fontSize: '14px',
                color: '#666',
                fontWeight: '500'
              }}>{stat.label}</div>
            </div>
          ))}
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