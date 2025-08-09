'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Heart, Shield, Users, Award, Building2, Stethoscope,
  Home, HandHeart, GraduationCap, Calendar, MapPin,
  Phone, Mail, Clock, ArrowRight, CheckCircle2, 
  Dog, Cat, Sparkles, ChevronRight, Store, ShoppingBag,
  Hotel, Utensils, Coffee, Trees, Building
} from 'lucide-react'

export default function Home() {
  const [stats, setStats] = useState({
    rescatados: 0,
    adoptados: 0,
    comercios: 0,
    voluntarios: 0
  })
  const [isVisible, setIsVisible] = useState(false)

  // Animación de entrada
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Animación de contadores
  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;

    const targets = {
      rescatados: 500,
      adoptados: 350,
      comercios: 50,
      voluntarios: 150
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        rescatados: Math.floor(targets.rescatados * progress),
        adoptados: Math.floor(targets.adoptados * progress),
        comercios: Math.floor(targets.comercios * progress),
        voluntarios: Math.floor(targets.voluntarios * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const categoriaIconos = {
    veterinaria: { icon: Stethoscope, color: '#dc2626' },
    petshop: { icon: ShoppingBag, color: '#9333ea' },
    hotel: { icon: Hotel, color: '#0891b2' },
    restaurante: { icon: Utensils, color: '#ea580c' },
    cafe: { icon: Coffee, color: '#84cc16' },
    parque: { icon: Trees, color: '#16a34a' },
    otro: { icon: Store, color: '#6b7280' }
  }

  return (
    <div style={{ 
      opacity: isVisible ? 1 : 0, 
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)', 
      transition: 'all 0.8s ease-out' 
    }}>
      {/* Hero Section Institucional */}
      <section style={{
        minHeight: '90vh',
        background: 'linear-gradient(135deg, #0e312d 0%, #1a4a45 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Patrón decorativo */}
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
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '80px 20px',
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '80px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'rgba(191, 181, 145, 0.2)',
              padding: '8px 20px',
              borderRadius: '24px',
              marginBottom: '24px'
            }}>
              <Building2 size={20} style={{ color: '#bfb591' }} />
              <span style={{ color: '#bfb591', fontSize: '14px', fontWeight: '600' }}>
                H. AYUNTAMIENTO DE ATLIXCO
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(48px, 6vw, 72px)',
              fontWeight: '800',
              color: 'white',
              marginBottom: '24px',
              lineHeight: '1.1',
              letterSpacing: '-2px'
            }}>
              Centro Municipal de 
              <span style={{ 
                display: 'block', 
                color: '#bfb591',
                marginTop: '8px'
              }}>Adopción y Bienestar Animal</span>
            </h1>
            
            <p style={{
              fontSize: 'clamp(20px, 2.5vw, 24px)',
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '32px',
              lineHeight: '1.6',
              maxWidth: '600px'
            }}>
              Un espacio dedicado al rescate, rehabilitación y adopción responsable, 
              donde cada vida importa y cada historia tiene un final feliz.
            </p>

            <p style={{
              fontSize: '18px',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '48px',
              lineHeight: '1.8'
            }}>
              El municipio de Atlixco reafirma su compromiso con el bienestar animal 
              a través de instalaciones modernas, personal especializado y programas 
              integrales que transforman vidas cada día.
            </p>

            <div style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <Link href="/programa-adopcion" style={{
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
                transition: 'all 0.3s',
                boxShadow: '0 4px 14px rgba(191, 181, 145, 0.3)'
              }}>
                <Heart size={20} /> Conoce Nuestro Programa
              </Link>
              <Link href="/catalogo" style={{
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
                transition: 'all 0.3s'
              }}>
                <Dog size={20} /> Ver Catálogo de Adopción
              </Link>
            </div>
          </div>

          {/* Grid de fotos del centro */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            height: '500px'
          }}>
            <div style={{
              gridRow: 'span 2',
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#f3f4f6'
            }}>
              <Image
                src="/centro-principal.jpg"
                alt="Centro Municipal de Adopción"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                padding: '24px',
                color: 'white'
              }}>
                <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>
                  Instalaciones Modernas
                </p>
              </div>
            </div>
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#f3f4f6'
            }}>
              <Image
                src="/veterinario.jpg"
                alt="Atención Veterinaria"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#f3f4f6'
            }}>
              <Image
                src="/adopcion.jpg"
                alt="Proceso de Adopción"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Compromiso Municipal */}
      <section style={{
        backgroundColor: 'white',
        padding: '100px 20px',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '80px'
          }}>
            <h2 style={{
              fontSize: 'clamp(36px, 4vw, 56px)',
              fontWeight: '800',
              color: '#0e312d',
              marginBottom: '24px',
              letterSpacing: '-1px'
            }}>
              Un Municipio que Cuida de sus Animales
            </h2>
            <p style={{
              fontSize: '20px',
              color: '#666',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.8'
            }}>
              El Centro Municipal representa el compromiso del H. Ayuntamiento de Atlixco 
              con el bienestar animal, ofreciendo servicios integrales que van desde el 
              rescate hasta la adopción responsable.
            </p>
          </div>

          {/* Servicios principales */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            marginBottom: '80px'
          }}>
            {[
              {
                icon: Shield,
                title: 'Rescate y Refugio',
                desc: 'Rescatamos animales en situación de calle, brindándoles refugio temporal seguro con instalaciones dignas y personal capacitado.',
                color: '#dc2626'
              },
              {
                icon: Stethoscope,
                title: 'Atención Veterinaria',
                desc: 'Servicios médicos completos: vacunación, esterilización, desparasitación y tratamientos especializados sin costo.',
                color: '#0891b2'
              },
              {
                icon: HandHeart,
                title: 'Rehabilitación',
                desc: 'Programas de socialización y terapia conductual para preparar a cada rescatado para su nueva vida en familia.',
                color: '#16a34a'
              },
              {
                icon: Home,
                title: 'Adopción Responsable',
                desc: 'Proceso estructurado con seguimiento post-adopción, garantizando el bienestar continuo de nuestros graduados.',
                color: '#9333ea'
              }
            ].map((service, idx) => (
              <div key={idx} style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center',
                transition: 'all 0.3s',
                cursor: 'pointer',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = service.color;
                e.currentTarget.style.boxShadow = `0 20px 40px ${service.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: `${service.color}15`,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <service.icon size={40} style={{ color: service.color }} />
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#0e312d',
                  marginBottom: '16px'
                }}>{service.title}</h3>
                <p style={{
                  color: '#666',
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}>{service.desc}</p>
              </div>
            ))}
          </div>

          {/* Imagen de instalaciones */}
          <div style={{
            borderRadius: '24px',
            overflow: 'hidden',
            height: '400px',
            position: 'relative',
            backgroundColor: '#f3f4f6'
          }}>
            <Image
              src="/instalaciones-centro.jpg"
              alt="Instalaciones del Centro Municipal"
              fill
              style={{ objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(14, 49, 45, 0.9), transparent)',
              padding: '48px',
              color: 'white'
            }}>
              <h3 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
                Instalaciones de Primera Clase
              </h3>
              <p style={{ fontSize: '18px', maxWidth: '600px' }}>
                Áreas especializadas para cada etapa del proceso: cuarentena, 
                hospitalización, socialización y espacios de adopción.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas de Impacto */}
      <section style={{
        backgroundColor: '#f8f9fa',
        padding: '100px 20px',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: 'clamp(36px, 4vw, 56px)',
            fontWeight: '800',
            color: '#0e312d',
            textAlign: 'center',
            marginBottom: '80px',
            letterSpacing: '-1px'
          }}>
            Nuestro Impacto en Números
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px'
          }}>
            {[
              { 
                number: `${stats.rescatados}+`, 
                label: 'Animales Rescatados', 
                desc: 'De las calles a un hogar seguro',
                icon: Shield,
                color: '#dc2626'
              },
              { 
                number: `${stats.adoptados}+`, 
                label: 'Adopciones Exitosas', 
                desc: 'Familias completas y felices',
                icon: Home,
                color: '#16a34a'
              },
              { 
                number: '100%', 
                label: 'Esterilizados', 
                desc: 'Control poblacional responsable',
                icon: CheckCircle2,
                color: '#0891b2'
              },
              { 
                number: `${stats.comercios}+`, 
                label: 'Comercios Pet Friendly', 
                desc: 'Red de establecimientos certificados',
                icon: Store,
                color: '#9333ea'
              }
            ].map((stat, idx) => (
              <div key={idx} style={{
                textAlign: 'center',
                padding: '40px',
                background: 'white',
                borderRadius: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'all 0.3s',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '80px',
                  height: '80px',
                  background: `${stat.color}10`,
                  borderRadius: '50%'
                }} />
                
                <stat.icon size={32} style={{ 
                  color: stat.color, 
                  marginBottom: '16px',
                  position: 'relative',
                  zIndex: 1
                }} />
                
                <div style={{
                  fontSize: 'clamp(40px, 5vw, 64px)',
                  fontWeight: '900',
                  color: stat.color,
                  marginBottom: '8px',
                  letterSpacing: '-2px'
                }}>{stat.number}</div>
                
                <div style={{ 
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#0e312d',
                  marginBottom: '8px'
                }}>{stat.label}</div>
                
                <div style={{ 
                  color: '#666',
                  fontSize: '15px'
                }}>{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Comercios Pet Friendly */}
      <section style={{
        backgroundColor: 'white',
        padding: '100px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '80px',
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#16a34a15',
                padding: '8px 20px',
                borderRadius: '24px',
                marginBottom: '24px'
              }}>
                <Award size={20} style={{ color: '#16a34a' }} />
                <span style={{ color: '#16a34a', fontSize: '14px', fontWeight: '600' }}>
                  PROGRAMA DE CERTIFICACIÓN
                </span>
              </div>
              
              <h2 style={{
                fontSize: 'clamp(36px, 4vw, 48px)',
                fontWeight: '800',
                color: '#0e312d',
                marginBottom: '24px',
                letterSpacing: '-1px'
              }}>
                Una Ciudad Amigable con las Mascotas
              </h2>
              
              <p style={{
                fontSize: '18px',
                color: '#666',
                marginBottom: '32px',
                lineHeight: '1.8'
              }}>
                Trabajamos con comercios locales para crear espacios inclusivos donde 
                las mascotas son bienvenidas. Nuestro programa de certificación garantiza 
                estándares de calidad y seguridad.
              </p>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '40px'
              }}>
                {[
                  'Evaluación personalizada de instalaciones',
                  'Capacitación en manejo y bienestar animal',
                  'Certificación oficial del municipio',
                  'Promoción en canales oficiales'
                ].map((benefit, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <CheckCircle2 size={20} style={{ color: '#16a34a', flexShrink: 0 }} />
                    <span style={{ color: '#374151', fontSize: '16px' }}>{benefit}</span>
                  </div>
                ))}
              </div>

              <Link href="/comercios-friendly" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#16a34a',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}>
                Ver Directorio Completo
                <ArrowRight size={20} />
              </Link>
            </div>

            {/* Preview de comercios */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              {[
                { tipo: 'veterinaria', nombre: 'Veterinarias', cantidad: 12 },
                { tipo: 'petshop', nombre: 'Pet Shops', cantidad: 8 },
                { tipo: 'restaurante', nombre: 'Restaurantes', cantidad: 15 },
                { tipo: 'cafe', nombre: 'Cafeterías', cantidad: 10 }
              ].map((cat, idx) => {
                const IconComponent = categoriaIconos[cat.tipo].icon;
                const color = categoriaIconos[cat.tipo].color;
                
                return (
                  <div key={idx} style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '16px',
                    padding: '24px',
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    border: '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = color;
                    e.currentTarget.style.backgroundColor = `${color}08`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}>
                    <IconComponent size={32} style={{ color, marginBottom: '12px' }} />
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#0e312d',
                      marginBottom: '4px'
                    }}>{cat.nombre}</h4>
                    <p style={{
                      color: color,
                      fontSize: '24px',
                      fontWeight: '800'
                    }}>{cat.cantidad}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Testimonios/Historias */}
      <section style={{
        backgroundColor: '#f8f9fa',
        padding: '100px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: 'clamp(36px, 4vw, 56px)',
            fontWeight: '800',
            color: '#0e312d',
            textAlign: 'center',
            marginBottom: '24px',
            letterSpacing: '-1px'
          }}>
            Historias que Transforman Vidas
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '80px',
            maxWidth: '600px',
            margin: '0 auto 80px'
          }}>
            Cada adopción es una historia de amor y segundas oportunidades
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '32px'
          }}>
            {[
              {
                nombre: 'Luna',
                historia: 'Rescatada de las calles, hoy Luna es la compañera inseparable de una familia que la adora.',
                tiempo: 'Adoptada hace 3 meses',
                imagen: '/historia-luna.jpg'
              },
              {
                nombre: 'Max',
                historia: 'Después de meses de rehabilitación, Max encontró un hogar donde es el rey de la casa.',
                tiempo: 'Adoptado hace 6 meses',
                imagen: '/historia-max.jpg'
              },
              {
                nombre: 'Bella',
                historia: 'De cachorrita abandonada a estrella de Instagram, Bella inspira adopciones responsables.',
                tiempo: 'Adoptada hace 1 año',
                imagen: '/historia-bella.jpg'
              }
            ].map((historia, idx) => (
              <div key={idx} style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}>
                <div style={{
                  height: '200px',
                  backgroundColor: '#f3f4f6',
                  position: 'relative'
                }}>
                  {/* Aquí iría la imagen */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Heart size={16} />
                    Historia de Éxito
                  </div>
                </div>
                <div style={{ padding: '32px' }}>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#0e312d',
                    marginBottom: '12px'
                  }}>{historia.nombre}</h3>
                  <p style={{
                    color: '#666',
                    lineHeight: '1.6',
                    marginBottom: '16px'
                  }}>{historia.historia}</p>
                  <p style={{
                    color: '#16a34a',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Calendar size={16} />
                    {historia.tiempo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{
        background: 'linear-gradient(135deg, #0e312d 0%, #1a4a45 100%)',
        padding: '100px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
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
          maxWidth: '1000px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <Sparkles size={48} style={{ color: '#bfb591', marginBottom: '24px' }} />
          
          <h2 style={{
            fontSize: 'clamp(40px, 5vw, 64px)',
            fontWeight: '800',
            color: 'white',
            marginBottom: '24px',
            letterSpacing: '-1px'
          }}>
            Juntos Construimos una
            <span style={{ display: 'block', color: '#bfb591' }}>
              Ciudad más Compasiva
            </span>
          </h2>
          
          <p style={{
            fontSize: '22px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '48px',
            maxWidth: '600px',
            margin: '0 auto 48px',
            lineHeight: '1.6'
          }}>
            Únete a nuestra misión de crear un Atlixco donde cada animal 
            tenga la oportunidad de una vida digna y feliz
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link href="/solicitud" style={{
              backgroundColor: '#bfb591',
              color: '#0e312d',
              padding: '16px 40px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s',
              boxShadow: '0 4px 14px rgba(191, 181, 145, 0.3)'
            }}>
              <Heart size={20} />
              Inicia tu Proceso de Adopción
            </Link>
            <Link href="/catalogo" style={{
              backgroundColor: 'transparent',
              color: 'white',
              padding: '16px 40px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: '2px solid rgba(255,255,255,0.3)',
              transition: 'all 0.3s'
            }}>
              <Dog size={20} />
              Conoce a Nuestros Peluditos
            </Link>
          </div>

          {/* Info de contacto */}
          <div style={{
            marginTop: '80px',
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'rgba(255,255,255,0.8)'
            }}>
              <MapPin size={20} />
              <span>[Dirección del centro]</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'rgba(255,255,255,0.8)'
            }}>
              <Phone size={20} />
              <span>244-XXX-XXXX</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'rgba(255,255,255,0.8)'
            }}>
              <Clock size={20} />
              <span>Lun-Dom: 9:00 - 17:00</span>
            </div>
          </div>
        </div>
      </section>

      {/* Estilos CSS simplificados */}
      <style jsx>{`
        @media (max-width: 768px) {
          section > div > div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}