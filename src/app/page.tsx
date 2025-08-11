'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { 
  Heart, Dog, Building2, Search, FileText, Home as HomeIcon, 
  HeartHandshake, Shield, Stethoscope, Star, Users, Phone,
  Mail, Clock, MapPin, ChevronRight, CheckCircle, Store,
  Coffee, Hotel, ShoppingBag, Trees
} from 'lucide-react'

interface Perrito {
  id: string
  nombre: string
  slug: string
  fotoPrincipal: string
  edad: string
  sexo: string
  raza: string
}

export default function Home() {
  const [perritosRecientes, setPerritosRecientes] = useState<Perrito[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/perritos?limit=3&orderBy=createdAt&order=desc')
      .then(res => res.json())
      .then(data => {
        if (data.perritos) {
          setPerritosRecientes(data.perritos)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        minHeight: '90vh',
        background: 'linear-gradient(135deg, #0e312d 0%, #1a4a45 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '40px 20px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          opacity: 0.03,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)`
        }} />
        
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(191, 181, 145, 0.2)',
            padding: '8px 20px',
            borderRadius: '24px',
            marginBottom: '16px'
          }}>
            <Building2 size={20} style={{ color: '#bfb591' }} />
            <span style={{ color: '#bfb591', fontSize: '14px', fontWeight: '600' }}>
              GOBIERNO DE ATLIXCO
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: '800',
            marginBottom: '16px',
            lineHeight: '1.1'
          }}>
            Centro Municipal de 
            <span style={{ 
              display: 'block', 
              color: '#bfb591',
              marginTop: '8px'
            }}>Adopción y Bienestar Animal</span>
          </h1>
          
          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 36px)',
            fontWeight: '300',
            marginBottom: '24px',
            color: '#bfb591'
          }}>
            Donde Cada Vida Encuentra Su Hogar
          </h2>
          
          <p style={{
            fontSize: 'clamp(18px, 2.5vw, 22px)',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '40px',
            lineHeight: '1.6',
            maxWidth: '800px',
            margin: '0 auto 40px'
          }}>
            Un compromiso del Gobierno Municipal con el bienestar animal y las familias de Atlixco
          </p>
          

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link href="/catalogo" style={{
              backgroundColor: '#bfb591',
              color: '#0e312d',
              padding: '16px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '17px',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(191, 181, 145, 0.3)',
              transition: 'all 0.3s ease'
            }}>
              <Dog size={20} /> Ver Perritos en Adopción
            </Link>
            <Link href="/comercios-friendly" style={{
              backgroundColor: 'transparent',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '17px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: '2px solid rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease'
            }}>
              <Store size={20} /> Conocer Comercios Pet Friendly
            </Link>
          </div>
        </div>
      </section>

      {/* Nuestro Compromiso Gubernamental */}
      <section style={{
        backgroundColor: '#f8f9fa',
        padding: '100px 20px'
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: '800',
            color: '#0e312d',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Nuestro Compromiso Gubernamental
          </h2>
          <p style={{
            fontSize: '24px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '60px',
            fontWeight: '300'
          }}>
            Transformando Vidas, Fortaleciendo Comunidades
          </p>
          
          <p style={{
            fontSize: '18px',
            color: '#666',
            lineHeight: '1.8',
            marginBottom: '40px',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto 40px'
          }}>
            Como parte de las políticas públicas de bienestar animal del Municipio de Atlixco, 
            nuestro centro representa el compromiso gubernamental con:
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease'
            }}>
              <Shield size={48} style={{ color: '#dc2626', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0e312d', marginBottom: '12px' }}>
                Rescate responsable
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                de animales en situación de calle
              </p>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease'
            }}>
              <Stethoscope size={48} style={{ color: '#0891b2', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0e312d', marginBottom: '12px' }}>
                Atención veterinaria integral
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                con protocolos certificados
              </p>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease'
            }}>
              <HeartHandshake size={48} style={{ color: '#16a34a', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0e312d', marginBottom: '12px' }}>
                Adopciones transparentes
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                que garantizan el bienestar animal
              </p>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease'
            }}>
              <Store size={48} style={{ color: '#9333ea', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0e312d', marginBottom: '12px' }}>
                Promoción de espacios pet friendly
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                para una ciudad más inclusiva
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Programa de Rescate Animal */}
      <section style={{
        backgroundColor: '#f8f9fa',
        padding: '100px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: '800',
            color: '#0e312d',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Programa de Rescate Animal
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '60px',
            lineHeight: '1.8',
            maxWidth: '800px',
            margin: '0 auto 60px'
          }}>
            Rescatamos y rehabilitamos perritos en situación de calle, brindándoles atención veterinaria 
            completa para prepararlos para una nueva familia.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '32px',
            marginBottom: '40px'
          }}>
            {loading ? (
              // Mostrar placeholders mientras carga
              [1, 2, 3].map((idx) => (
                <div key={idx} style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  <div style={{
                    height: '250px',
                    backgroundColor: '#e5e7eb',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }} />
                  <div style={{ padding: '24px' }}>
                    <div style={{
                      height: '24px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      marginBottom: '12px',
                      width: '60%'
                    }} />
                    <div style={{
                      height: '16px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '4px',
                      marginBottom: '8px',
                      width: '40%'
                    }} />
                    <div style={{
                      height: '16px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '4px',
                      width: '80%'
                    }} />
                  </div>
                </div>
              ))
            ) : perritosRecientes.length > 0 ? (
              // Mostrar perritos reales
              perritosRecientes.map((perro) => (
                <Link 
                  key={perro.id}
                  href={`/catalogo/${perro.slug}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block'
                  }}
                >
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
                  }}>
                    <div style={{
                      height: '250px',
                      backgroundColor: '#e5e7eb',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {perro.fotoPrincipal && (
                        <img 
                          src={perro.fotoPrincipal} 
                          alt={perro.nombre}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                    </div>
                    <div style={{ padding: '24px' }}>
                      <h3 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#0e312d',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <Dog size={20} /> {perro.nombre}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                        {perro.sexo} • {perro.edad}
                      </p>
                      <p style={{ color: '#666', lineHeight: '1.6', fontSize: '14px' }}>
                        {perro.raza}
                      </p>
                      <p style={{
                        color: '#16a34a',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginTop: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        Ver más información <ChevronRight size={16} />
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Mostrar mensaje si no hay perritos
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                color: '#666'
              }}>
                <Dog size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p>No hay perritos disponibles en este momento</p>
              </div>
            )}
          </div>
          
          <style jsx>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.8; }
            }
          `}</style>
          
          <div style={{ textAlign: 'center' }}>
            <Link href="/catalogo" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#0e312d',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '17px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}>
              Explorar Todos los Perritos Disponibles <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Red de Comercios Certificados */}
      <section style={{
        backgroundColor: 'white',
        padding: '100px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: '800',
            color: '#0e312d',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Red de Comercios Certificados Pet Friendly
          </h2>
          <p style={{
            fontSize: '24px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '60px',
            fontWeight: '300'
          }}>
            Espacios oficialmente verificados para ti y tu mascota
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '60px'
          }}>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '32px',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <Coffee size={48} style={{ color: '#ea580c', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0e312d', marginBottom: '12px' }}>
                CAFETERÍAS Y RESTAURANTES
              </h3>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Café Central, Restaurante Luna, Bistró del Parque
              </p>
            </div>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '32px',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <Hotel size={48} style={{ color: '#0891b2', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0e312d', marginBottom: '12px' }}>
                HOTELES Y HOSPEDAJE
              </h3>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Hotel Colonial, Posada Familiar, Casa de Huéspedes Villa
              </p>
            </div>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '32px',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <ShoppingBag size={48} style={{ color: '#9333ea', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0e312d', marginBottom: '12px' }}>
                TIENDAS Y SERVICIOS
              </h3>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Pet Store Atlixco, Veterinaria San José, Farmacia del Centro
              </p>
            </div>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '32px',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <Trees size={48} style={{ color: '#16a34a', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0e312d', marginBottom: '12px' }}>
                ESPACIOS RECREATIVOS
              </h3>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Parque Central, Plaza de Armas, Sendero Ecoturístico
              </p>
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#f0fdf4',
            padding: '32px',
            borderRadius: '16px',
            marginTop: '40px',
            border: '1px solid #bbf7d0'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#0e312d',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              Únete a la red oficial de comercios inclusivos del Municipio de Atlixco
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <Store size={32} style={{ color: '#16a34a', marginBottom: '12px' }} />
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#0e312d', marginBottom: '12px' }}>
                  Para el Público
                </h4>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
                  Descubre lugares pet friendly certificados
                </p>
                <Link href="/comercios-friendly" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}>
                  Ver Comercios <ChevronRight size={18} />
                </Link>
              </div>
              
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <CheckCircle size={32} style={{ color: '#16a34a', marginBottom: '12px' }} />
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#0e312d', marginBottom: '12px' }}>
                  Para Comerciantes
                </h4>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
                  Certifica tu negocio como pet friendly
                </p>
                <Link href="/comercios-friendly#certificar" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'transparent',
                  color: '#16a34a',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  border: '2px solid #16a34a',
                  transition: 'all 0.3s ease'
                }}>
                  Certificar Negocio <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Nuestro Impacto */}
      <section style={{
        backgroundColor: 'white',
        padding: '100px 20px'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 42px)',
            fontWeight: '700',
            color: '#0e312d',
            marginBottom: '60px',
            textAlign: 'center'
          }}>
            Nuestro Impacto en la Comunidad
          </h2>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '32px',
            marginBottom: '40px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#0e312d'
              }}>+500</span>
              <span style={{ fontSize: '14px', color: '#666', marginLeft: '8px' }}>Animales rescatados</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#0e312d'
              }}>+350</span>
              <span style={{ fontSize: '14px', color: '#666', marginLeft: '8px' }}>Adopciones exitosas</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#0e312d'
              }}>50</span>
              <span style={{ fontSize: '14px', color: '#666', marginLeft: '8px' }}>Comercios pet friendly</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#0e312d'
              }}>100%</span>
              <span style={{ fontSize: '14px', color: '#666', marginLeft: '8px' }}>Esterilización garantizada</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#0e312d'
              }}>24/7</span>
              <span style={{ fontSize: '14px', color: '#666', marginLeft: '8px' }}>Atención de emergencias</span>
            </div>
          </div>
        </div>
      </section>

      {/* Centro Municipal - Contacto */}
      <section style={{
        background: 'linear-gradient(135deg, #0e312d 0%, #1a4a45 100%)',
        padding: '100px 20px',
        color: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: '800',
            marginBottom: '16px'
          }}>
            Centro Municipal de Adopción
          </h2>
          <p style={{
            fontSize: '24px',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '60px',
            fontWeight: '300'
          }}>
            Visítanos en Nuestras Instalaciones
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px',
            marginBottom: '60px'
          }}>
            <div>
              <MapPin size={32} style={{ marginBottom: '12px', color: '#bfb591' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Dirección</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                [Dirección del centro municipal]
              </p>
            </div>
            
            <div>
              <Phone size={32} style={{ marginBottom: '12px', color: '#bfb591' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Teléfono</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '20px' }}>
                244-XXX-XXXX
              </p>
            </div>
            
            <div>
              <Mail size={32} style={{ marginBottom: '12px', color: '#bfb591' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Email</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                adopciones@atlixco.gob.mx
              </p>
            </div>
            
            <div>
              <Clock size={32} style={{ marginBottom: '12px', color: '#bfb591' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Horarios</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                Lunes a Domingo<br />
                9:00 - 17:00 horas
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '60px'
          }}>
            <Link href="/solicitud" style={{
              backgroundColor: '#bfb591',
              color: '#0e312d',
              padding: '16px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '17px',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(191, 181, 145, 0.3)'
            }}>
              Agendar Visita
            </Link>
            <Link href="/solicitud" style={{
              backgroundColor: 'transparent',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '17px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              Solicitar Adopción
            </Link>
            <Link href="/contacto" style={{
              backgroundColor: 'transparent',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '17px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              Reportar Rescate
            </Link>
          </div>
          
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '40px',
            marginTop: '40px'
          }}>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '16px',
              color: '#bfb591'
            }}>
              Un Gobierno que Cuida Cada Vida
            </h3>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: '1.8',
              maxWidth: '600px',
              margin: '0 auto 24px',
              fontStyle: 'italic'
            }}>
              El Centro Municipal de Adopción y Bienestar Animal es una iniciativa del Gobierno de Atlixco 
              comprometida con el bienestar animal y la construcción de una comunidad más compasiva e inclusiva.
            </p>
            <Link href="/programa-adopcion" style={{
              color: '#bfb591',
              textDecoration: 'underline',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              Conocer más sobre nuestros programas gubernamentales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}