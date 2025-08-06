import { Suspense } from 'react'
import { Metadata } from 'next'
import CatalogoPerritos from '../../components/CatalogoPerritos'

export const metadata: Metadata = {
  title: 'Perritos en Adopción | Centro de Adopción Atlixco',
  description: 'Encuentra tu compañero perfecto entre nuestros perritos disponibles para adopción en Atlixco, Puebla.',
  keywords: 'adopción, perros, mascotas, Atlixco, Puebla, rescate animal',
  openGraph: {
    title: 'Perritos en Adopción - Atlixco',
    description: 'Encuentra tu compañero perfecto entre nuestros perritos disponibles para adopción.',
    images: ['/og-perritos.jpg'],
  },
}

export default function PerritosPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f8f8' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '32px 20px'
        }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#0e312d', 
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>
            Perritos en Adopción
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#666',
            margin: 0
          }}>
            Encuentra a tu nuevo mejor amigo entre nuestros perritos rescatados
          </p>
        </div>
      </div>

      {/* Catálogo */}
      <Suspense fallback={
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '32px 20px'
        }}>
          <div style={{ opacity: 0.6 }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '32px'
            }}>
              {/* Sidebar skeleton */}
              <div>
                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '24px', 
                  borderRadius: '8px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ 
                    height: '16px', 
                    backgroundColor: '#e5e5e5', 
                    borderRadius: '4px', 
                    width: '80px', 
                    marginBottom: '16px'
                  }}></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ height: '12px', backgroundColor: '#e5e5e5', borderRadius: '4px' }}></div>
                    <div style={{ height: '12px', backgroundColor: '#e5e5e5', borderRadius: '4px' }}></div>
                    <div style={{ height: '12px', backgroundColor: '#e5e5e5', borderRadius: '4px' }}></div>
                  </div>
                </div>
              </div>
              {/* Grid skeleton */}
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '24px'
                }}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} style={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px', 
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                      overflow: 'hidden'
                    }}>
                      <div style={{ height: '192px', backgroundColor: '#e5e5e5' }}></div>
                      <div style={{ padding: '16px' }}>
                        <div style={{ 
                          height: '16px', 
                          backgroundColor: '#e5e5e5', 
                          borderRadius: '4px', 
                          width: '75%', 
                          marginBottom: '8px'
                        }}></div>
                        <div style={{ 
                          height: '12px', 
                          backgroundColor: '#e5e5e5', 
                          borderRadius: '4px', 
                          width: '50%'
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      }>
        <CatalogoPerritos />
      </Suspense>
    </div>
  )
}