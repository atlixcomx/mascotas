'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { 
  Heart, Dog, Building2, Search, FileText, Home as HomeIcon, 
  HeartHandshake, Shield, Stethoscope, Star, Users, Phone,
  Mail, Clock, MapPin, ChevronRight, CheckCircle, Store,
  Coffee, Hotel, ShoppingBag, Trees, Sparkles, Activity,
  Baby, UserCheck, ClipboardCheck, Calendar, ArrowRight
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

// Componente contador animado
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000 // 2 segundos
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  // Formatear número con comas
  const formattedCount = count.toLocaleString('es-MX')

  return <span>{formattedCount}{suffix}</span>
}

export default function HomeNew() {
  const [perritosRecientes, setPerritosRecientes] = useState<Perrito[]>([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Cargar perritos
    fetch('/api/perritos?limit=3&orderBy=createdAt&order=desc')
      .then(res => res.json())
      .then(data => {
        if (data.perritos) {
          setPerritosRecientes(data.perritos)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))

    // Activar animaciones cuando sea visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('stats-section')
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [])

  return (
    <div>
      {/* Hero Section Mejorado */}
      <section style={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(60px, 15vw, 100px) 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Imagen de fondo */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url(/images/header-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }}
        />
        
        {/* Overlay con gradiente */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(14, 49, 45, 0.85) 0%, rgba(26, 74, 69, 0.85) 100%)',
          zIndex: 1
        }} />

        {/* Elementos decorativos del ecosistema */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          opacity: 0.2,
          zIndex: 1
        }}>
          <Sparkles size={200} color="#bfb591" />
        </div>
        
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Logo del Ayuntamiento + Pill como un solo bloque */}
          <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Image
              src="/ayuntamientoB.png"
              alt="H. Ayuntamiento de Atlixco"
              width={220}
              height={220}
              style={{
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
                opacity: 0.95
              }}
            />
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'rgba(191, 181, 145, 0.2)',
              padding: '8px 20px',
              borderRadius: '24px',
              marginTop: '4px'
            }}>
              <span style={{ color: '#bfb591', fontSize: '14px', fontWeight: '600' }}>
                GOBIERNO DE ATLIXCO 2024-2027
              </span>
            </div>
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
            Un compromiso del Gobierno Municipal con el bienestar animal, 
            rescatando vidas y transformando familias en nuestra comunidad
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
              <Dog size={20} /> Ver Catálogo de Adopción
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
              <Store size={20} /> Comercios Pet Friendly
            </Link>
          </div>
        </div>
      </section>

      {/* Nuestro Compromiso Gubernamental + Proceso Veterinario */}
      <section style={{
        backgroundColor: '#f8f9fa',
        padding: 'clamp(40px, 10vw, 100px) 20px'
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
            fontSize: 'clamp(18px, 3vw, 24px)',
            color: '#666',
            textAlign: 'center',
            marginBottom: 'clamp(32px, 8vw, 60px)',
            fontWeight: '300',
            padding: '0 16px'
          }}>
            Transformando Vidas con Protocolo Veterinario Certificado
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '40px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '24px 16px',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease'
            }}>
              <Shield size={36} style={{ color: '#dc2626', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0e312d', marginBottom: '8px' }}>
                Rescate responsable
              </h3>
              <p style={{ color: '#666', lineHeight: '1.4', fontSize: '14px' }}>
                Protocolos de rescate seguros y humanitarios
              </p>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '24px 16px',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease'
            }}>
              <Stethoscope size={36} style={{ color: '#0891b2', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0e312d', marginBottom: '8px' }}>
                Atención veterinaria integral
              </h3>
              <p style={{ color: '#666', lineHeight: '1.4', fontSize: '14px' }}>
                5 etapas de cuidado médico especializado
              </p>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '24px 16px',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease'
            }}>
              <HeartHandshake size={36} style={{ color: '#16a34a', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0e312d', marginBottom: '8px' }}>
                Adopciones transparentes
              </h3>
              <p style={{ color: '#666', lineHeight: '1.4', fontSize: '14px' }}>
                Proceso claro con seguimiento post-adopción
              </p>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '24px 16px',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease'
            }}>
              <Store size={36} style={{ color: '#9333ea', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0e312d', marginBottom: '8px' }}>
                Ciudad pet friendly
              </h3>
              <p style={{ color: '#666', lineHeight: '1.4', fontSize: '14px' }}>
                Red de comercios certificados para familias
              </p>
            </div>
          </div>

          {/* Texto de transición */}
          <p style={{
            fontSize: '18px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '40px',
            maxWidth: '800px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            Para lograr esto creamos un protocolo de bienestar animal que consta de las siguientes etapas
          </p>

          {/* Proceso Veterinario Detallado */}
          <div style={{
            backgroundColor: 'white',
            padding: 'clamp(24px, 4vw, 40px)',
            borderRadius: '20px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              fontSize: 'clamp(20px, 3vw, 28px)',
              fontWeight: '700',
              color: '#0e312d',
              marginBottom: 'clamp(24px, 3vw, 32px)',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <Stethoscope size={28} style={{ color: '#0891b2' }} />
              <span>Nuestro Protocolo Veterinario de 5 Etapas</span>
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 'clamp(8px, 2vw, 16px)'
            }}>
              {[
                { icon: Search, title: 'Evaluación inicial', desc: 'Diagnóstico completo' },
                { icon: Activity, title: 'Desparasitación', desc: 'Interna y externa' },
                { icon: Shield, title: 'Vacunación', desc: 'Esquema completo' },
                { icon: Heart, title: 'Esterilización', desc: 'Cirugía responsable' },
                { icon: CheckCircle, title: 'Alta médica', desc: 'Listo para adopción' }
              ].map((step, idx) => (
                <div key={idx} style={{
                  textAlign: 'center',
                  padding: 'clamp(12px, 2vw, 20px)'
                }}>
                  <div style={{
                    width: 'clamp(48px, 8vw, 60px)',
                    height: 'clamp(48px, 8vw, 60px)',
                    backgroundColor: '#e0f2fe',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto clamp(8px, 2vw, 16px)'
                  }}>
                    <step.icon size={24} color="#0891b2" />
                  </div>
                  <h4 style={{
                    fontSize: 'clamp(14px, 2vw, 16px)',
                    fontWeight: '600',
                    color: '#0e312d',
                    marginBottom: '4px'
                  }}>
                    {step.title}
                  </h4>
                  <p style={{
                    fontSize: 'clamp(12px, 1.5vw, 14px)',
                    color: '#666',
                    lineHeight: '1.3'
                  }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Proceso de Adopción Simplificado */}
      <section style={{
        backgroundColor: 'white',
        padding: 'clamp(40px, 10vw, 80px) 20px'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 42px)',
            fontWeight: '800',
            color: '#0e312d',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Tu Camino Hacia la Adopción
          </h2>
          
          <p style={{
            fontSize: '18px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '48px',
            maxWidth: '800px',
            margin: '0 auto 48px',
            lineHeight: '1.6'
          }}>
            Nuestro objetivo es que cada mascota encuentre un lugar seguro, 
            estos son los pasos que debes seguir para solicitar una mascota
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
            marginBottom: '48px'
          }}>
            {[
              { icon: Search, title: 'Explora', desc: 'Conoce a nuestros perritos en el catálogo' },
              { icon: UserCheck, title: 'Solicita', desc: 'Llena el formulario de adopción' },
              { icon: ClipboardCheck, title: 'Entrevista', desc: 'Plática con nuestro equipo' },
              { icon: Baby, title: 'Adopta', desc: '¡Lleva a tu nuevo amigo a casa!' }
            ].map((step, idx) => (
              <div key={idx} style={{
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 4px 12px rgba(251, 191, 36, 0.2)'
                }}>
                  <step.icon size={36} color="#f59e0b" />
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#0e312d',
                  marginBottom: '8px'
                }}>
                  {idx + 1}. {step.title}
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#666',
                  lineHeight: '1.5'
                }}>
                  {step.desc}
                </p>
                {idx < 3 && (
                  <ArrowRight 
                    size={24} 
                    style={{
                      position: 'absolute',
                      right: '-28px',
                      top: '40px',
                      color: '#e5e7eb',
                      display: 'none'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Integración de Conoce a Nuestros Rescatados */}
          <div style={{
            marginTop: '60px',
            borderTop: '2px solid #e5e7eb',
            paddingTop: '60px'
          }}>
            <h3 style={{
              fontSize: 'clamp(28px, 3.5vw, 36px)',
              fontWeight: '700',
              color: '#0e312d',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              Conoce a Nuestros Rescatados
            </h3>
            <p style={{
              fontSize: '18px',
              color: '#666',
              textAlign: 'center',
              marginBottom: '40px',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto 40px'
            }}>
              Cada uno con una historia de superación, esperando llenar tu hogar de amor
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              marginBottom: '40px'
            }}>
            {loading ? (
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
                      width: '40%'
                    }} />
                  </div>
                </div>
              ))
            ) : perritosRecientes.length > 0 ? (
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
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        DISPONIBLE
                      </div>
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
                        {perro.nombre}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                        {perro.sexo} • {perro.edad} • {perro.raza}
                      </p>
                      <p style={{
                        color: '#16a34a',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        Conocer más <ChevronRight size={16} />
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                color: '#666'
              }}>
                <Dog size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p>Pronto tendremos nuevos amigos disponibles</p>
              </div>
            )}
          </div>
          
            <div style={{ textAlign: 'center' }}>
              <Link href="/catalogo" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#0891b2',
                fontSize: '18px',
                fontWeight: '600',
                textDecoration: 'none'
              }}>
                Ver todos los perritos disponibles <ArrowRight size={20} />
              </Link>
            </div>
            
            {/* CTA Principal */}
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link href="/catalogo" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#f59e0b',
                color: 'white',
                padding: '16px 40px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '18px',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
              }}>
                Comenzar mi Adopción <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Red de Comercios Pet Friendly */}
      <section style={{
        backgroundColor: 'white',
        padding: 'clamp(40px, 10vw, 100px) 20px'
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
            fontSize: 'clamp(18px, 3vw, 24px)',
            color: '#666',
            textAlign: 'center',
            marginBottom: 'clamp(32px, 8vw, 60px)',
            fontWeight: '300',
            padding: '0 16px'
          }}>
            Espacios oficialmente verificados para ti y tu mascota
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
            gap: '24px',
            marginBottom: '60px'
          }}>
            <div style={{
              backgroundColor: '#fef3c7',
              padding: '32px',
              borderRadius: '16px',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}>
              <Coffee size={48} style={{ color: '#ea580c', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0e312d', marginBottom: '12px' }}>
                Cafeterías
              </h3>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Disfruta un café mientras tu mascota descansa
              </p>
            </div>
            
            <div style={{
              backgroundColor: '#dbeafe',
              padding: '32px',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <Hotel size={48} style={{ color: '#0891b2', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0e312d', marginBottom: '12px' }}>
                Hoteles
              </h3>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Hospedaje que acepta a toda tu familia
              </p>
            </div>
            
            <div style={{
              backgroundColor: '#f3e8ff',
              padding: '32px',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <ShoppingBag size={48} style={{ color: '#9333ea', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0e312d', marginBottom: '12px' }}>
                Tiendas
              </h3>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Compras con tu compañero peludo
              </p>
            </div>
            
            <div style={{
              backgroundColor: '#dcfce7',
              padding: '32px',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <Trees size={48} style={{ color: '#16a34a', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0e312d', marginBottom: '12px' }}>
                Parques
              </h3>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Espacios verdes para pasear y jugar
              </p>
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#f0fdf4',
            padding: '40px',
            borderRadius: '16px',
            marginTop: '40px',
            border: '1px solid #bbf7d0',
            textAlign: 'center'
          }}>
            <Store size={48} style={{ color: '#16a34a', marginBottom: '16px' }} />
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#0e312d',
              marginBottom: '16px'
            }}>
              Explora el Catálogo Completo
            </h3>
            <p style={{
              fontSize: '18px',
              color: '#666',
              marginBottom: '24px',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto 24px'
            }}>
              Más de 50 comercios certificados te esperan. Restaurantes, cafeterías, 
              hoteles y más espacios que aman a los animales tanto como tú.
            </p>
            <Link href="/comercios-friendly" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#16a34a',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '17px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)'
            }}>
              Ver Todos los Comercios <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Nuestro Impacto con Contadores Animados */}
      <section 
        id="stats-section"
        style={{
          backgroundColor: '#f8f9fa',
          padding: 'clamp(40px, 10vw, 100px) 20px'
        }}
      >
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
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '32px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <Heart size={40} style={{ color: '#dc2626', marginBottom: '16px' }} />
              <div style={{
                fontSize: 'clamp(36px, 8vw, 48px)',
                fontWeight: '700',
                color: '#0e312d'
              }}>
                {isVisible && <AnimatedCounter value={14774} />}
              </div>
              <p style={{ fontSize: '16px', color: '#666', marginTop: '8px' }}>
                Esterilizaciones
              </p>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '32px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <HeartHandshake size={40} style={{ color: '#16a34a', marginBottom: '16px' }} />
              <div style={{
                fontSize: 'clamp(36px, 8vw, 48px)',
                fontWeight: '700',
                color: '#0e312d'
              }}>
                {isVisible && <AnimatedCounter value={286} />}
              </div>
              <p style={{ fontSize: '16px', color: '#666', marginTop: '8px' }}>
                Adopciones exitosas
              </p>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '32px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <Stethoscope size={40} style={{ color: '#0891b2', marginBottom: '16px' }} />
              <div style={{
                fontSize: 'clamp(36px, 8vw, 48px)',
                fontWeight: '700',
                color: '#0e312d'
              }}>
                {isVisible && <AnimatedCounter value={70360} />}
              </div>
              <p style={{ fontSize: '16px', color: '#666', marginTop: '8px' }}>
                Vacunas antirrábicas
              </p>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '32px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <Activity size={40} style={{ color: '#9333ea', marginBottom: '16px' }} />
              <div style={{
                fontSize: 'clamp(36px, 8vw, 48px)',
                fontWeight: '700',
                color: '#0e312d'
              }}>
                {isVisible && <AnimatedCounter value={2207} />}
              </div>
              <p style={{ fontSize: '16px', color: '#666', marginTop: '8px' }}>
                Consultas veterinarias
              </p>
            </div>
          </div>

          {/* Botón Ver Detalles */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              onClick={() => setShowDetails(!showDetails)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'white',
                color: '#0e312d',
                padding: '14px 28px',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              {showDetails ? 'Ocultar detalles' : 'Ver detalles por año'}
              <ChevronRight
                size={20}
                style={{
                  transform: showDetails ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              />
            </button>
          </div>

          {/* Tabla de Resultados Detallados */}
          <div style={{
            marginTop: '24px',
            maxHeight: showDetails ? '2000px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.5s ease-in-out, opacity 0.3s ease',
            opacity: showDetails ? 1 : 0
          }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}>
            <div style={{
              backgroundColor: '#0e312d',
              padding: '20px 24px',
              textAlign: 'center'
            }}>
              <h3 style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: '700',
                margin: 0
              }}>
                Resultados del CEMA por Año
              </h3>
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                margin: '8px 0 0 0'
              }}>
                Jefatura de Bienestar Animal - Centro y Jornadas
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: '#0e312d', borderBottom: '2px solid #e5e7eb' }}>Descripción</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '600', color: '#0e312d', borderBottom: '2px solid #e5e7eb' }}>2022</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '600', color: '#0e312d', borderBottom: '2px solid #e5e7eb' }}>2023</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '600', color: '#0e312d', borderBottom: '2px solid #e5e7eb' }}>2024</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '600', color: '#0e312d', borderBottom: '2px solid #e5e7eb' }}>2025</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '700', color: '#0e312d', borderBottom: '2px solid #e5e7eb', backgroundColor: '#bfb591' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { desc: 'Esterilizaciones caninas y felinas', d2022: '4,868', d2023: '3,508', d2024: '3,963', d2025: '2,435', total: '14,774', highlight: true },
                    { desc: 'Consultas veterinarias', d2022: '480', d2023: '560', d2024: '720', d2025: '447', total: '2,207' },
                    { desc: 'Desparasitaciones', d2022: '0', d2023: '330', d2024: '390', d2025: '1,256', total: '1,976' },
                    { desc: 'Curaciones', d2022: '0', d2023: '11', d2024: '55', d2025: '123', total: '189' },
                    { desc: 'Sacrificios humanitarios', d2022: '0', d2023: '1', d2024: '41', d2025: '69', total: '111' },
                    { desc: 'Vacunas (Puppy, Cuádruple, Quíntuple)', d2022: '0', d2023: '1', d2024: '87', d2025: '362', total: '450' },
                    { desc: 'Otros procedimientos médicos', d2022: '0', d2023: '25', d2024: '34', d2025: '59', total: '118' },
                    { desc: 'Tratamiento médico', d2022: '0', d2023: '0', d2024: '20', d2025: '141', total: '161' },
                    { desc: 'Simparica', d2022: '0', d2023: '40', d2024: '300', d2025: '100', total: '440' },
                    { desc: 'Adopciones', d2022: '0', d2023: '45', d2024: '43', d2025: '198', total: '286', highlight: true },
                    { desc: 'Perros ingresados', d2022: '0', d2023: '60', d2024: '83', d2025: '447', total: '590' },
                    { desc: 'Perros reubicados', d2022: '0', d2023: '10', d2024: '15', d2025: '199', total: '224' },
                    { desc: 'Perros entregados a su dueño', d2022: '0', d2023: '0', d2024: '0', d2025: '33', total: '33' },
                    { desc: 'Perros en el CEMA', d2022: '0', d2023: '5', d2024: '27', d2025: '45', total: '77' },
                    { desc: 'Vacuna antirrábica', d2022: '0', d2023: '26,800', d2024: '21,700', d2025: '21,860', total: '70,360', highlight: true },
                  ].map((row, idx) => (
                    <tr key={idx} style={{ backgroundColor: row.highlight ? '#f0fdf4' : idx % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontWeight: row.highlight ? '600' : '400', color: '#1f2937' }}>{row.desc}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>{row.d2022}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>{row.d2023}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>{row.d2024}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>{row.d2025}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontWeight: '700', backgroundColor: row.highlight ? '#dcfce7' : '#fef9e7', color: '#0e312d' }}>{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{
              padding: '16px 24px',
              backgroundColor: '#f8f9fa',
              borderTop: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>
                Datos oficiales del Centro Municipal de Adopción y Bienestar Animal de Atlixco
              </p>
            </div>
          </div>
          </div>
        </div>
      </section>


      {/* CTA Final */}
      <section
        style={{
          backgroundColor: '#f5f3ed',
          padding: 'clamp(48px, 8vw, 80px) 20px',
          textAlign: 'center'
        }}
      >
        <div style={{
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: '700',
            marginBottom: '16px',
            color: '#0e312d',
            lineHeight: '1.2'
          }}>
            ¿Listo para cambiar una{' '}
            <span style={{ color: '#8b7355' }}>vida</span>?
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#666',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Cada adopción es una segunda oportunidad. Visita nuestro catálogo y encuentra a tu nuevo compañero.
          </p>
          <Link href="/catalogo" style={{
            backgroundColor: '#0e312d',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '17px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}>
            <Dog size={20} /> Ver Catálogo de Adopción
          </Link>
        </div>
      </section>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}