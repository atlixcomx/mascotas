'use client'

import { Suspense, useEffect, useState } from 'react'
import { Building2, MapPin, Phone, Clock, Award } from 'lucide-react'

interface Comercio {
  id: string
  codigo: string
  nombre: string
  slug: string
  categoria: string
  descripcion: string
  direccion: string
  telefono?: string
  email?: string
  horarios?: string
  servicios: string[]
  certificado: boolean
  fechaCert?: string
  latitud?: number
  longitud?: number
}

function ComerciosGrid() {
  const [comercios, setComercios] = useState<Comercio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchComercios() {
      try {
        const response = await fetch('/api/comercios')
        if (!response.ok) {
          throw new Error('Error al cargar comercios')
        }
        const data = await response.json()
        setComercios(data.comercios || data || [])
      } catch (error) {
        console.error('Error:', error)
        setError('No se pudieron cargar los comercios')
      } finally {
        setLoading(false)
      }
    }

    fetchComercios()
  }, [])

  if (loading) {
    return (
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '48px 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              padding: '24px'
            }}>
              <div style={{
                height: '20px',
                background: '#f0f0f0',
                borderRadius: '4px',
                width: '70%',
                marginBottom: '12px'
              }} />
              <div style={{
                height: '14px',
                background: '#f0f0f0',
                borderRadius: '4px',
                width: '90%',
                marginBottom: '16px'
              }} />
              <div style={{
                height: '14px',
                background: '#f0f0f0',
                borderRadius: '4px',
                width: '60%'
              }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '48px 20px',
        textAlign: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '48px 24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <Building2 size={48} style={{ color: '#6b7280', margin: '0 auto 16px' }} />
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>
            {error}
          </h3>
          <p style={{ color: '#6b7280' }}>
            Intenta recargar la página o contacta con soporte
          </p>
        </div>
      </div>
    )
  }

  if (comercios.length === 0) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '48px 20px',
        textAlign: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '48px 24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <Building2 size={48} style={{ color: '#6b7280', margin: '0 auto 16px' }} />
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Próximamente
          </h3>
          <p style={{ color: '#6b7280' }}>
            Estamos trabajando en agregar comercios pet-friendly a nuestro directorio
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '48px 20px'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {comercios.map((comercio) => (
          <div key={comercio.id} style={{
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <div style={{ padding: '24px' }}>
              {/* Header con certificación */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>
                    {comercio.nombre}
                  </h3>
                  <div style={{
                    display: 'inline-block',
                    background: '#dcfce7',
                    color: '#166534',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {comercio.categoria}
                  </div>
                </div>
                {comercio.certificado && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#dbeafe',
                    color: '#1d4ed8',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    <Award size={14} style={{ marginRight: '4px' }} />
                    Certificado
                  </div>
                )}
              </div>

              {/* Descripción */}
              <p style={{
                color: '#6b7280',
                lineHeight: '1.5',
                marginBottom: '20px'
              }}>
                {comercio.descripcion}
              </p>

              {/* Información de contacto */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <MapPin size={16} style={{ color: '#6b7280', marginRight: '8px' }} />
                  <span style={{
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {comercio.direccion}
                  </span>
                </div>

                {comercio.telefono && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <Phone size={16} style={{ color: '#6b7280', marginRight: '8px' }} />
                    <span style={{
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      {comercio.telefono}
                    </span>
                  </div>
                )}

                {comercio.horarios && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Clock size={16} style={{ color: '#6b7280', marginRight: '8px' }} />
                    <span style={{
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      {comercio.horarios}
                    </span>
                  </div>
                )}
              </div>

              {/* Servicios */}
              {comercio.servicios && comercio.servicios.length > 0 && (
                <div>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Servicios Pet-Friendly:
                  </h4>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px'
                  }}>
                    {comercio.servicios.map((servicio, index) => (
                      <span key={index} style={{
                        background: '#f3f4f6',
                        color: '#374151',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}>
                        {servicio}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ComerciosPage() {
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
              <Building2 size={40} color="white" />
            </div>
            <h1 style={{ 
              fontSize: 'clamp(36px, 5vw, 56px)', 
              fontWeight: '800', 
              marginBottom: '16px',
              letterSpacing: '-1px'
            }}>
              Comercios Pet-Friendly
            </h1>
            <p style={{ 
              fontSize: '20px', 
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Descubre lugares donde tú y tu mascota son bienvenidos. 
              Comercios certificados que aman a las mascotas tanto como tú.
            </p>
          </div>
        </div>
      </div>

      {/* Comercios Grid */}
      <Suspense fallback={
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '48px 20px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                padding: '24px'
              }}>
                <div style={{
                  height: '20px',
                  background: '#f0f0f0',
                  borderRadius: '4px',
                  width: '70%',
                  marginBottom: '12px'
                }} />
                <div style={{
                  height: '14px',
                  background: '#f0f0f0',
                  borderRadius: '4px',
                  width: '90%',
                  marginBottom: '16px'
                }} />
                <div style={{
                  height: '14px',
                  background: '#f0f0f0',
                  borderRadius: '4px',
                  width: '60%'
                }} />
              </div>
            ))}
          </div>
        </div>
      }>
        <ComerciosGrid />
      </Suspense>
    </div>
  )
}