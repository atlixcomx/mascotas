'use client'

import Link from 'next/link'
import { Heart, Shield, Home, Users, PawPrint, Phone } from 'lucide-react'

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f8f8',
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      {/* Header Oficial */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #af1731, #840f31)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <PawPrint style={{ color: 'white', width: '28px', height: '28px' }} />
              </div>
              <div>
                <h1 style={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  color: '#0e312d',
                  margin: 0
                }}>Centro de Adopción Atlixco</h1>
                <p style={{
                  fontSize: '12px',
                  color: '#666',
                  margin: 0
                }}>Gobierno Municipal de Atlixco | 2024</p>
              </div>
            </div>
            <nav style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px'
            }}>
              <Link href="/" style={{
                color: '#4a4a4a',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}>
                Inicio
              </Link>
              <Link href="/perritos" style={{
                color: '#4a4a4a',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}>
                Perritos
              </Link>
              <Link href="/perritos" style={{
                color: '#4a4a4a',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}>
                Adoptar
              </Link>
              <a href="#contacto" style={{
                color: '#4a4a4a',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}>
                Contacto
              </a>
              <Link href="/admin" style={{
                backgroundColor: '#af1731',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}>
                Portal Administrativo
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0e312d, #246257, #3d9b84)',
        padding: '96px 20px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.1)'
        }}></div>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '48px',
            alignItems: 'center'
          }}>
            <div>
              <h1 style={{
                fontSize: '56px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '24px',
                lineHeight: '1.1',
                margin: 0
              }}>
                Dale una Segunda
                <span style={{ 
                  display: 'block', 
                  color: '#e2be96' 
                }}>Oportunidad</span>
              </h1>
              <p style={{
                fontSize: '20px',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '32px',
                lineHeight: '1.6'
              }}>
                En el Centro de Adopción de Atlixco, conectamos corazones con perritos que buscan un hogar lleno de amor y cuidado. Forma parte de nuestra misión social.
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <Link href="/perritos" style={{
                  backgroundColor: '#af1731',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: '600',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  display: 'inline-block'
                }}>
                  Ver Perritos Disponibles
                </Link>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{
                background: 'linear-gradient(135deg, #c79b66, #e2be96)',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
              }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '24px'
                }}>
                  <h3 style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#0e312d',
                    marginBottom: '16px',
                    margin: 0
                  }}>¿Por qué adoptar?</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <Heart style={{ 
                        width: '24px', 
                        height: '24px', 
                        color: '#af1731',
                        marginTop: '4px',
                        flexShrink: 0
                      }} />
                      <span style={{ color: '#4a4a4a' }}>Salvas una vida y ganas un compañero leal</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <Shield style={{ 
                        width: '24px', 
                        height: '24px', 
                        color: '#af1731',
                        marginTop: '4px',
                        flexShrink: 0
                      }} />
                      <span style={{ color: '#4a4a4a' }}>Todos nuestros perritos están vacunados y esterilizados</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <Home style={{ 
                        width: '24px', 
                        height: '24px', 
                        color: '#af1731',
                        marginTop: '4px',
                        flexShrink: 0
                      }} />
                      <span style={{ color: '#4a4a4a' }}>Apoyo continuo durante el proceso de adaptación</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        backgroundColor: 'white',
        padding: '64px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(61, 155, 132, 0.1)',
                borderRadius: '50%',
                marginBottom: '16px'
              }}>
                <Heart style={{ width: '32px', height: '32px', color: '#3d9b84' }} />
              </div>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#0e312d',
                marginBottom: '8px'
              }}>100+</div>
              <div style={{ color: '#666' }}>Perritos Rescatados</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(175, 23, 49, 0.1)',
                borderRadius: '50%',
                marginBottom: '16px'
              }}>
                <Home style={{ width: '32px', height: '32px', color: '#af1731' }} />
              </div>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#0e312d',
                marginBottom: '8px'
              }}>98%</div>
              <div style={{ color: '#666' }}>Tasa de Adopción Exitosa</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(199, 155, 102, 0.2)',
                borderRadius: '50%',
                marginBottom: '16px'
              }}>
                <Users style={{ width: '32px', height: '32px', color: '#c79b66' }} />
              </div>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#0e312d',
                marginBottom: '8px'
              }}>140+</div>
              <div style={{ color: '#666' }}>Comercios Pet-Friendly</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(36, 98, 87, 0.1)',
                borderRadius: '50%',
                marginBottom: '16px'
              }}>
                <Shield style={{ width: '32px', height: '32px', color: '#246257' }} />
              </div>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#0e312d',
                marginBottom: '8px'
              }}>100%</div>
              <div style={{ color: '#666' }}>Seguimiento Post-Adopción</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" style={{
        backgroundColor: '#f8f8f8',
        padding: '64px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            padding: '48px'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#0e312d',
              marginBottom: '32px',
              textAlign: 'center',
              margin: '0 0 32px 0'
            }}>
              ¿Listo para cambiar una vida?
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#0e312d',
                  marginBottom: '16px',
                  margin: '0 0 16px 0'
                }}>Información de Contacto</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Phone style={{ width: '20px', height: '20px', color: '#af1731' }} />
                    <span style={{ color: '#4a4a4a' }}>(244) 445-0000</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Home style={{ width: '20px', height: '20px', color: '#af1731' }} />
                    <span style={{ color: '#4a4a4a' }}>Av. Hidalgo 123, Centro, Atlixco, Puebla</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{
                  color: '#4a4a4a',
                  marginBottom: '24px',
                  fontSize: '16px'
                }}>
                  Visita nuestro centro y conoce a tu nuevo mejor amigo
                </p>
                <Link href="/perritos" style={{
                  backgroundColor: '#af1731',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'inline-block',
                  transition: 'all 0.2s'
                }}>
                  Ver Perritos Disponibles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
// Force redeploy Wed Aug  6 15:33:21 CST 2025
