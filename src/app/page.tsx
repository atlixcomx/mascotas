'use client'

import Link from 'next/link'
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
  
  return <span>{count}{suffix}</span>
}

export default function HomeNew() {
  const [perritosRecientes, setPerritosRecientes] = useState<Perrito[]>([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

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
            backgroundImage: 'url(/images/centro/foto1.jpeg)',
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
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(191, 181, 145, 0.2)',
            padding: '8px 20px',
            borderRadius: '24px',
            marginBottom: '16px'
          }}>
            <span style={{ color: '#bfb591', fontSize: '14px', fontWeight: '600' }}>
              GOBIERNO DE ATLIXCO 2024-2027
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
            fontSize: '24px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '60px',
            fontWeight: '300'
          }}>
            Transformando Vidas con Protocolo Veterinario Certificado
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
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
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#0e312d',
              marginBottom: '32px',
              textAlign: 'center'
            }}>
              <Stethoscope size={32} style={{ display: 'inline', marginRight: '12px', color: '#0891b2' }} />
              Nuestro Protocolo Veterinario de 5 Etapas
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '16px'
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
                  padding: '20px'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#e0f2fe',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <step.icon size={28} color="#0891b2" />
                  </div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0e312d',
                    marginBottom: '4px'
                  }}>
                    {step.title}
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    color: '#666'
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
              gridTemplateColumns: 'repeat(3, 1fr)',
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
                {isVisible && <AnimatedCounter value={500} suffix="+" />}
              </div>
              <p style={{ fontSize: '16px', color: '#666', marginTop: '8px' }}>
                Animales rescatados
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
                {isVisible && <AnimatedCounter value={350} suffix="+" />}
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
              <Users size={40} style={{ color: '#0891b2', marginBottom: '16px' }} />
              <div style={{
                fontSize: 'clamp(36px, 8vw, 48px)',
                fontWeight: '700',
                color: '#0e312d'
              }}>
                {isVisible && <AnimatedCounter value={1200} suffix="+" />}
              </div>
              <p style={{ fontSize: '16px', color: '#666', marginTop: '8px' }}>
                Familias felices
              </p>
            </div>
            
            <div style={{ 
              textAlign: 'center',
              padding: '32px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <Store size={40} style={{ color: '#9333ea', marginBottom: '16px' }} />
              <div style={{
                fontSize: 'clamp(36px, 8vw, 48px)',
                fontWeight: '700',
                color: '#0e312d'
              }}>
                {isVisible && <AnimatedCounter value={50} />}
              </div>
              <p style={{ fontSize: '16px', color: '#666', marginTop: '8px' }}>
                Comercios pet friendly
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Centro Municipal - Contacto */}
      <section 
        id="contacto"
        style={{
          background: 'linear-gradient(135deg, #0e312d 0%, #1a4a45 100%)',
          padding: 'clamp(40px, 10vw, 100px) 20px',
          color: 'white'
        }}
      >
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
            Visítanos y Conoce Nuestro Trabajo
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
            gap: '32px',
            marginBottom: '60px'
          }}>
            <div>
              <MapPin size={32} style={{ marginBottom: '12px', color: '#bfb591' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Dirección</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                Boulevard Niños Héroes #1003<br />
                Col. Centro, Atlixco, Puebla
              </p>
            </div>
            
            <div>
              <Phone size={32} style={{ marginBottom: '12px', color: '#bfb591' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Teléfono</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '20px' }}>
                244-445-8765
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
              boxShadow: '0 4px 14px rgba(191, 181, 145, 0.3)'
            }}>
              <Dog size={20} /> Ver Catálogo de Adopción
            </Link>
            <Link href="/noticias" style={{
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
              Noticias y Eventos
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
              maxWidth: '700px',
              margin: '0 auto',
              fontStyle: 'italic'
            }}>
              El Centro Municipal de Adopción y Bienestar Animal es testimonio del compromiso 
              del Gobierno de Atlixco con el bienestar animal y la construcción de una comunidad 
              más compasiva e inclusiva. Juntos, transformamos vidas.
            </p>
          </div>
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