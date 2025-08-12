'use client'

import { useState, useEffect } from 'react'
import { 
  DogIcon, HeartIcon, SearchIcon, FormIcon, HomeIcon, HandshakeIcon,
  HospitalIcon, VaccineIcon, ScissorsIcon, StethoscopeIcon, DoctorIcon,
  ClipboardIcon, CheckCircleIcon, MountainIcon, BirdIcon, FlowerIcon, WaveIcon,
  LocationIcon, PhoneIcon, MailIcon, ClockIcon
} from '../../components/icons/Icons'

export default function ProgramaAdopcion() {
  const [stats, setStats] = useState({
    familias: 0,
    rescates: 0,
    exito: 0,
    dias: 0
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
      familias: 500,
      rescates: 50,
      exito: 90,
      dias: 40
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        familias: Math.floor(targets.familias * progress),
        rescates: Math.floor(targets.rescates * progress),
        exito: Math.floor(targets.exito * progress),
        dias: Math.floor(targets.dias * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ 
      opacity: isVisible ? 1 : 0, 
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)', 
      transition: 'all 0.8s ease-out' 
    }}>
      {/* Hero Section */}
      <section style={{
        minHeight: 'clamp(70vh, 85vh, 90vh)',
        background: 'linear-gradient(135deg, #0e312d 0%, #1a4a45 50%, #246257 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(20px, 8vw, 80px) clamp(16px, 5vw, 20px)'
      }}>
        {/* Elementos decorativos - solo en desktop */}
        <div 
          className="decorative-elements"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '60%',
            height: '60%',
            opacity: 0.05,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M100 20L40 180L160 180Z' fill='white'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom right',
            backgroundSize: 'contain'
          }} 
        />

        {/* Patrón de agua - solo en desktop */}
        <div 
          className="water-pattern"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '200px',
            opacity: 0.1,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
          }} 
        />

        <div className="hero-content" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(24px, 8vw, 60px)',
          alignItems: 'center'
        }}>
          <div style={{
            animation: 'slideInLeft 1s ease-out 0.2s both'
          }}>
            <h1 style={{
              fontSize: 'clamp(42px, 5vw, 72px)',
              fontWeight: '800',
              color: 'white',
              marginBottom: '24px',
              lineHeight: '1.1',
              letterSpacing: '-2px'
            }}>
              Donde Cada Vida
              <span style={{ 
                display: 'block', 
                color: '#bfb591',
                marginTop: '8px'
              }}>Encuentra Su Hogar</span>
            </h1>
            <p style={{
              fontSize: 'clamp(18px, 2vw, 22px)',
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '48px',
              lineHeight: '1.6',
              maxWidth: '600px'
            }}>
              En el Centro Municipal de Adopción y Bienestar Animal de Atlixco, 
              transformamos rescates en nuevos comienzos con amor, cuidado profesional 
              y el compromiso de encontrar la familia perfecta para cada uno.
            </p>
            <div style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <a href="/catalogo" style={{
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
                <DogIcon size={20} color="#0e312d" /> Conoce a Tu Nuevo Mejor Amigo
              </a>
              <a href="#proceso-veterinario" style={{
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
                <HeartIcon size={20} color="white" /> Nuestro Proceso de Cuidado
              </a>
            </div>
          </div>

          {/* Ecosistema visual - oculto en móvil */}
          <div className="ecosystem-grid" style={{
            animation: 'slideInRight 1s ease-out 0.4s both',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 'clamp(16px, 4vw, 24px)'
          }}>
            {[
              { Icon: MountainIcon, title: 'Fortaleza', desc: 'Popocatépetl representa nuestra solidez institucional' },
              { Icon: BirdIcon, title: 'Vida', desc: 'El colibrí simboliza la delicadeza del cuidado' },
              { Icon: FlowerIcon, title: 'Renacimiento', desc: 'La flor de cinco pétalos, nueva oportunidad' },
              { Icon: WaveIcon, title: 'Abundancia', desc: 'El agua, flujo constante de amor y cuidado' }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <item.Icon size={36} color="#bfb591" />
                </div>
                <h3 style={{
                  color: '#bfb591',
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '8px'
                }}>{item.title}</h3>
                <p style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Numeralia */}
      <section style={{
        backgroundColor: '#f8f9fa',
        padding: 'clamp(40px, 10vw, 80px) 20px',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: '800',
            color: '#0e312d',
            textAlign: 'center',
            marginBottom: '64px',
            letterSpacing: '-1px'
          }}>
            Nuestro Impacto en la Comunidad
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px'
          }}>
            {[
              { number: `+${stats.familias}`, label: 'Familias Completas', desc: 'Desde nuestra apertura' },
              { number: stats.rescates, label: 'Rescates Mensuales', desc: 'Promedio de atención' },
              { number: `${stats.exito}%`, label: 'Adopciones Exitosas', desc: 'Con seguimiento continuo' },
              { number: `${stats.dias} Días`, label: 'Promedio', desc: 'Hasta encontrar hogar' }
            ].map((stat, idx) => (
              <div key={idx} style={{
                textAlign: 'center',
                padding: '32px',
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'all 0.3s',
                cursor: 'default'
              }}>
                <div style={{
                  fontSize: 'clamp(36px, 4vw, 56px)',
                  fontWeight: '900',
                  color: '#0e312d',
                  marginBottom: '8px',
                  letterSpacing: '-2px'
                }}>{stat.number}</div>
                <div style={{ 
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1a4a45',
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

      {/* Proceso de Adopción */}
      <section id="adoptar" style={{
        backgroundColor: 'white',
        padding: 'clamp(40px, 10vw, 80px) 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: '800',
              color: '#0e312d',
              marginBottom: '16px',
              letterSpacing: '-1px'
            }}>
              Tu Camino Hacia una Nueva Amistad
            </h2>
            <p style={{
              fontSize: '20px',
              color: '#666',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Un proceso transparente y acompañado, diseñado para garantizar el bienestar 
              de nuestros rescatados y la felicidad de tu familia
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(16px, 4vw, 32px)'
          }}>
            {[
              {
                Icon: SearchIcon,
                title: 'EXPLORA',
                subtitle: 'Navega',
                desc: 'Explora nuestro catálogo con filtros inteligentes.'
              },
              {
                Icon: FormIcon,
                title: 'SOLICITA',
                subtitle: 'Inicia',
                desc: 'Completa la solicitud para encontrar el match perfecto.'
              },
              {
                Icon: HomeIcon,
                title: 'VISITA',
                subtitle: 'Conoce',
                desc: 'Ven a conocer a tu elegido en persona.'
              },
              {
                Icon: HeartIcon,
                title: 'ADOPTA',
                subtitle: 'Llévalo',
                desc: 'Recibe apoyo continuo post-adopción.'
              }
            ].map((step, idx) => (
              <div key={idx} style={{
                position: 'relative',
                padding: '24px 20px',
                background: '#f8f9fa',
                borderRadius: '16px',
                border: '2px solid #e9ecef',
                transition: 'all 0.3s',
                textAlign: 'center'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '36px',
                  height: '36px',
                  background: '#6b3838',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '16px'
                }}>{idx + 1}</div>
                <div style={{ marginBottom: '16px' }}>
                  <step.Icon size={40} color="#bfb591" />
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#0e312d',
                  marginBottom: '4px'
                }}>{step.title}</h3>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#bfb591',
                  marginBottom: '16px'
                }}>{step.subtitle}</p>
                <p style={{
                  color: '#666',
                  lineHeight: '1.6',
                  fontSize: '15px'
                }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso de Cuidado Veterinario */}
      <section id="proceso-veterinario" style={{
        backgroundColor: '#f8f9fa',
        padding: 'clamp(40px, 10vw, 80px) 20px',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: '800',
              color: '#0e312d',
              marginBottom: '16px',
              letterSpacing: '-1px'
            }}>
              Cada Rescate es una Promesa de Vida Digna
            </h2>
            <p style={{
              fontSize: '20px',
              color: '#666',
              maxWidth: '900px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Nuestro protocolo veterinario integral, ejecutado por profesionales de planta, 
              garantiza que cada animal reciba la atención médica necesaria para iniciar 
              una nueva vida saludable y feliz.
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: 'clamp(24px, 6vw, 48px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: 'clamp(16px, 4vw, 32px)'
          }}>
            {[
              {
                Icon: HospitalIcon,
                title: 'RECEPCIÓN Y EVALUACIÓN',
                desc: 'Cada rescatado recibe una evaluación veterinaria completa al momento de su llegada. Documentamos su estado de salud y creamos un plan de atención personalizado.'
              },
              {
                Icon: VaccineIcon,
                title: 'PROTOCOLO DE VACUNACIÓN',
                desc: 'Aplicamos esquema completo: vacuna séxtuple (moquillo, parvovirus, hepatitis, parainfluenza, leptospirosis) y antirrábica. Incluye desparasitación integral.'
              },
              {
                Icon: ScissorsIcon,
                title: 'ESTERILIZACIÓN RESPONSABLE',
                desc: 'Todos nuestros animales son esterilizados por nuestro equipo veterinario, contribuyendo al control poblacional y mejorando su calidad de vida.'
              },
              {
                Icon: StethoscopeIcon,
                title: 'TRATAMIENTOS ESPECIALIZADOS',
                desc: 'Atendemos condiciones específicas: sarna, TVT, ehrlichia, problemas dermatológicos o cualquier padecimiento. No descansamos hasta verlos sanos.'
              },
              {
                Icon: HomeIcon,
                title: 'REHABILITACIÓN Y SOCIALIZACIÓN',
                desc: 'Trabajamos el comportamiento y socialización. Cada animal recibe atención personalizada para superar traumas y prepararse para su nueva vida.'
              }
            ].map((step, idx) => (
              <div key={idx} className="process-card" style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'clamp(16px, 4vw, 20px)',
                padding: 'clamp(16px, 4vw, 24px)',
                background: '#f8f9fa',
                borderRadius: '16px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{
                  minWidth: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #fef5f5 0%, #fde7e7 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <step.Icon size={28} color="#6b3838" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#0e312d',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <span style={{
                      background: '#6b3838',
                      color: 'white',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '700'
                    }}>{idx + 1}</span>
                    {step.title}
                  </h3>
                  <p style={{
                    color: '#666',
                    lineHeight: '1.6',
                    fontSize: '16px'
                  }}>{step.desc}</p>
                </div>
              </div>
            ))}

            <div style={{
              gridColumn: '1 / -1',
              marginTop: '16px',
              padding: '32px',
              background: 'linear-gradient(135deg, #6b3838 0%, #8b4848 100%)',
              borderRadius: '16px',
              textAlign: 'center',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px'
            }}>
              <CheckCircleIcon size={48} color="white" />
              <div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  marginBottom: '4px'
                }}>Protocolo Veterinario Certificado</h3>
                <p style={{
                  fontSize: '16px',
                  opacity: 0.9,
                  margin: 0
                }}>Cada adoptado sale con cartilla de vacunación completa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestro Compromiso Contigo */}
      <section id="proceso" style={{
        backgroundColor: 'white',
        padding: 'clamp(40px, 10vw, 80px) 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: '800',
            color: '#0e312d',
            textAlign: 'center',
            marginBottom: '64px',
            letterSpacing: '-1px'
          }}>
            Nuestro Compromiso Contigo
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px'
          }}>
            {[
              {
                Icon: DoctorIcon,
                title: 'Veterinarios de Planta',
                desc: 'Equipo médico profesional disponible todos los días para garantizar el bienestar de nuestros rescatados.'
              },
              {
                Icon: VaccineIcon,
                title: 'Vacunas Gratuitas Post-Adopción',
                desc: 'Continuamos con el esquema de vacunación sin costo durante el primer año de adopción.'
              },
              {
                Icon: ClipboardIcon,
                title: 'Seguimiento Continuo',
                desc: 'Acompañamiento permanente con visitas de seguimiento y asesoría conductual cuando lo necesites.'
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                textAlign: 'center',
                padding: '40px',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '120px',
                  height: '120px',
                  background: 'rgba(191, 181, 145, 0.1)',
                  borderRadius: '50%'
                }} />
                <div style={{ marginBottom: '24px' }}>
                  <item.Icon size={48} color="#bfb591" />
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#0e312d',
                  marginBottom: '16px'
                }}>{item.title}</h3>
                <p style={{
                  color: '#666',
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Sé Parte del Cambio */}
      <section id="voluntariado" style={{
        background: 'linear-gradient(135deg, #0e312d 0%, #1a4a45 100%)',
        padding: 'clamp(40px, 10vw, 80px) 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Patrón decorativo */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
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
          <h2 style={{
            fontSize: 'clamp(36px, 4vw, 56px)',
            fontWeight: '800',
            color: 'white',
            marginBottom: '16px',
            letterSpacing: '-1px'
          }}>
            Sé Parte del Cambio
          </h2>
          <p style={{
            fontSize: '22px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '64px',
            maxWidth: '600px',
            margin: '0 auto 64px'
          }}>
            Hay muchas formas de ayudarnos a continuar salvando vidas
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            marginBottom: '48px'
          }}>
            {[
              {
                Icon: HomeIcon,
                title: 'ADOPTA',
                desc: 'Dale una segunda oportunidad a quien más lo necesita',
                link: '/catalogo'
              },
              {
                Icon: HandshakeIcon,
                title: 'SÉ VOLUNTARIO',
                desc: 'Dona tu tiempo y amor a nuestros rescatados',
                link: '#contacto'
              },
              {
                Icon: HeartIcon,
                title: 'APADRINA',
                desc: 'Apoya el cuidado mensual de un rescatado',
                link: '#contacto'
              }
            ].map((action, idx) => (
              <a key={idx} href={action.link} style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '20px',
                padding: '40px 32px',
                textDecoration: 'none',
                border: '2px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s',
                display: 'block',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ marginBottom: '24px' }}>
                  <action.Icon size={48} color="#bfb591" />
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#bfb591',
                  marginBottom: '12px'
                }}>{action.title}</h3>
                <p style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '16px',
                  lineHeight: '1.5'
                }}>{action.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Contacto */}
      <section id="contacto" style={{
        backgroundColor: '#f8f9fa',
        padding: 'clamp(40px, 10vw, 80px) 20px'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
          padding: '48px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: '800',
            color: '#0e312d',
            marginBottom: '32px'
          }}>
            Visítanos
          </h2>
          <p style={{
            color: '#666',
            marginBottom: '32px',
            fontSize: '18px',
            lineHeight: '1.6'
          }}>
            Ven a conocer a nuestros rescatados y encuentra a tu nuevo mejor amigo
          </p>
          <div style={{ 
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            alignItems: 'center'
          }}>
            <p style={{ color: '#666', margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <LocationIcon size={18} color="#666" /> [Dirección del centro]
            </p>
            <p style={{ color: '#666', margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <PhoneIcon size={18} color="#666" /> Tel: 244-XXX-XXXX
            </p>
            <p style={{ color: '#666', margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <MailIcon size={18} color="#666" /> adopciones@atlixco.gob.mx
            </p>
            <p style={{ color: '#666', margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <ClockIcon size={18} color="#666" /> Lun-Dom: 9:00 - 17:00
            </p>
          </div>
          <a href="/catalogo" style={{
            backgroundColor: '#0e312d',
            color: 'white',
            padding: '16px 40px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '17px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s',
            boxShadow: '0 4px 14px rgba(14, 49, 45, 0.2)'
          }}>
            <DogIcon size={20} color="white" /> Ver Catálogo de Adopción
          </a>
        </div>
      </section>
      
      {/* Animaciones CSS */}
      <style jsx>{`
        /* Responsive para móvil */
        @media (max-width: 768px) {
          .decorative-elements,
          .water-pattern,
          .ecosystem-grid {
            display: none !important;
          }
          
          .hero-content {
            grid-template-columns: 1fr !important;
            text-align: center !important;
            max-width: 100% !important;
            padding: 0 16px !important;
          }
          
          .process-card {
            flex-direction: column !important;
            text-align: center !important;
            align-items: center !important;
          }
          
          .process-card > div:first-child {
            margin-bottom: 16px !important;
          }
        }
        
        @media (max-width: 480px) {
          .hero-content {
            gap: 20px !important;
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        /* Animaciones para elementos */
        section:nth-child(2) > div {
          animation: fadeInUp 0.8s ease-out 0.8s both;
        }
        
        section:nth-child(3) > div > div:nth-child(2) > div {
          animation: scaleIn 0.6s ease-out calc(1s + var(--delay, 0s)) both;
        }
        
        section:nth-child(3) > div > div:nth-child(2) > div:nth-child(1) { --delay: 0s; }
        section:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) { --delay: 0.1s; }
        section:nth-child(3) > div > div:nth-child(2) > div:nth-child(3) { --delay: 0.2s; }
        section:nth-child(3) > div > div:nth-child(2) > div:nth-child(4) { --delay: 0.3s; }
        
        section:nth-child(4) > div > div:nth-child(2) > div {
          animation: fadeInUp 0.6s ease-out calc(1.2s + var(--step-delay, 0s)) both;
        }
        
        section:nth-child(4) > div > div:nth-child(2) > div:nth-child(1) { --step-delay: 0s; }
        section:nth-child(4) > div > div:nth-child(2) > div:nth-child(2) { --step-delay: 0.1s; }
        section:nth-child(4) > div > div:nth-child(2) > div:nth-child(3) { --step-delay: 0.2s; }
        section:nth-child(4) > div > div:nth-child(2) > div:nth-child(4) { --step-delay: 0.3s; }
        
        /* Hover animations */
        div[style*="cursor: default"]:hover {
          animation: float 2s ease-in-out infinite;
        }
        
        button:hover, a[style*="backgroundColor"]:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        /* Parallax effect on scroll */
        @media (prefers-reduced-motion: no-preference) {
          section:first-child {
            will-change: transform;
          }
        }
      `}</style>
    </div>
  );
}