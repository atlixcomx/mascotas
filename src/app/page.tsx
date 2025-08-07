'use client'

import { useState, useEffect } from 'react'
import { Heart, Shield, Users, Calendar, CheckCircle, Activity, Home, FileText, UserCheck, Stethoscope, Syringe, Scissors, Brain, HousePlus } from 'lucide-react'

export default function Home() {
  const [stats, setStats] = useState({
    familias: 0,
    rescates: 0,
    exito: 0,
    dias: 0
  })

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
    <div>
      {/* Hero Section */}
      <section style={{
        minHeight: '85vh',
        background: 'linear-gradient(135deg, #0e312d 0%, #1a4a45 50%, #246257 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '80px 20px'
      }}>
        {/* Elementos decorativos del escudo - Popocatépetl */}
        <div style={{
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
        }} />

        {/* Patrón de agua */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '200px',
          opacity: 0.1,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '60px',
          alignItems: 'center'
        }}>
          <div>
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
              <a href="/perritos" style={{
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
                🐕 Conoce a Tu Nuevo Mejor Amigo
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
                💚 Nuestro Proceso de Cuidado
              </a>
            </div>
          </div>

          {/* Ecosistema visual */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px'
          }}>
            {[
              { icon: '🏔️', title: 'Fortaleza', desc: 'Popocatépetl representa nuestra solidez institucional' },
              { icon: '🦜', title: 'Vida', desc: 'El colibrí simboliza la delicadeza del cuidado' },
              { icon: '🌺', title: 'Renacimiento', desc: 'La flor de cinco pétalos, nueva oportunidad' },
              { icon: '〰️', title: 'Abundancia', desc: 'El agua, flujo constante de amor y cuidado' }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
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
        padding: '80px 20px',
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
        padding: '80px 20px'
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
            gap: '32px'
          }}>
            {[
              {
                icon: '🔍',
                title: 'EXPLORA',
                subtitle: 'Navega el Catálogo',
                desc: 'Navega nuestro catálogo digital con filtros inteligentes. Conoce la historia, personalidad y necesidades de cada uno de nuestros rescatados.'
              },
              {
                icon: '📝',
                title: 'SOLICITA',
                subtitle: 'Inicia tu Adopción',
                desc: 'Completa nuestra solicitud de adopción. Nuestro equipo evaluará tu perfil para encontrar el match perfecto entre tu familia y tu nuevo compañero.'
              },
              {
                icon: '🏠',
                title: 'VISITA',
                subtitle: 'Conoce en Persona',
                desc: 'Ven a nuestras instalaciones para conocer a tu elegido. Interactúa en un ambiente seguro y recibe orientación de nuestros especialistas.'
              },
              {
                icon: '💝',
                title: 'ACOMPAÑA',
                subtitle: 'Seguimiento Continuo',
                desc: 'Recibe seguimiento veterinario gratuito, apoyo en la adaptación y acceso a nuestra comunidad de adoptantes responsables.'
              }
            ].map((step, idx) => (
              <div key={idx} style={{
                position: 'relative',
                padding: '32px',
                background: '#f8f9fa',
                borderRadius: '20px',
                border: '2px solid #e9ecef',
                transition: 'all 0.3s'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '32px',
                  width: '40px',
                  height: '40px',
                  background: '#0e312d',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '18px'
                }}>{idx + 1}</div>
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{step.icon}</div>
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
        padding: '80px 20px',
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
            padding: '48px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
          }}>
            {[
              {
                icon: '🏥',
                title: 'RECEPCIÓN Y EVALUACIÓN',
                desc: 'Cada rescatado recibe una evaluación veterinaria completa al momento de su llegada. Documentamos su estado de salud y creamos un plan de atención personalizado.'
              },
              {
                icon: '💉',
                title: 'PROTOCOLO DE VACUNACIÓN',
                desc: 'Aplicamos esquema completo: vacuna séxtuple (moquillo, parvovirus, hepatitis, parainfluenza, leptospirosis) y antirrábica. Incluye desparasitación integral.'
              },
              {
                icon: '✂️',
                title: 'ESTERILIZACIÓN RESPONSABLE',
                desc: 'Todos nuestros animales son esterilizados por nuestro equipo veterinario, contribuyendo al control poblacional y mejorando su calidad de vida.'
              },
              {
                icon: '🩺',
                title: 'TRATAMIENTOS ESPECIALIZADOS',
                desc: 'Atendemos condiciones específicas: sarna, TVT, ehrlichia, problemas dermatológicos o cualquier padecimiento. No descansamos hasta verlos sanos.'
              },
              {
                icon: '🏡',
                title: 'REHABILITACIÓN Y SOCIALIZACIÓN',
                desc: 'Trabajamos el comportamiento y socialización. Cada animal recibe atención personalizada para superar traumas y prepararse para su nueva vida.'
              }
            ].map((step, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '24px',
                padding: '24px',
                borderBottom: idx < 4 ? '1px solid #e9ecef' : 'none'
              }}>
                <div style={{
                  minWidth: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #e8f5f2 0%, #d4ede7 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px'
                }}>{step.icon}</div>
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
                      background: '#bfb591',
                      color: 'white',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
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
              marginTop: '48px',
              padding: '32px',
              background: 'linear-gradient(135deg, #0e312d 0%, #1a4a45 100%)',
              borderRadius: '16px',
              textAlign: 'center',
              color: 'white'
            }}>
              <CheckCircle style={{ width: '48px', height: '48px', marginBottom: '16px' }} />
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '8px'
              }}>✓ Protocolo Veterinario Certificado</h3>
              <p style={{
                fontSize: '18px',
                opacity: 0.9
              }}>Cada adoptado sale con cartilla de vacunación completa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestro Compromiso Contigo */}
      <section id="proceso" style={{
        backgroundColor: 'white',
        padding: '80px 20px'
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
                icon: '👨‍⚕️',
                title: 'Veterinarios de Planta',
                desc: 'Equipo médico profesional disponible todos los días para garantizar el bienestar de nuestros rescatados.'
              },
              {
                icon: '💉',
                title: 'Vacunas Gratuitas Post-Adopción',
                desc: 'Continuamos con el esquema de vacunación sin costo durante el primer año de adopción.'
              },
              {
                icon: '📋',
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
                <div style={{ fontSize: '48px', marginBottom: '24px' }}>{item.icon}</div>
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
        padding: '80px 20px',
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
                icon: '🏠',
                title: 'ADOPTA',
                desc: 'Dale una segunda oportunidad a quien más lo necesita',
                link: '/perritos'
              },
              {
                icon: '🤝',
                title: 'SÉ VOLUNTARIO',
                desc: 'Dona tu tiempo y amor a nuestros rescatados',
                link: '#contacto'
              },
              {
                icon: '💝',
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
                <div style={{ fontSize: '48px', marginBottom: '24px' }}>{action.icon}</div>
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
        padding: '80px 20px'
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
            <p style={{ color: '#666', margin: 0, fontSize: '16px' }}>
              📍 [Dirección del centro]
            </p>
            <p style={{ color: '#666', margin: 0, fontSize: '16px' }}>
              📞 Tel: 244-XXX-XXXX
            </p>
            <p style={{ color: '#666', margin: 0, fontSize: '16px' }}>
              📧 adopciones@atlixco.gob.mx
            </p>
            <p style={{ color: '#666', margin: 0, fontSize: '16px' }}>
              ⏰ Lun-Dom: 9:00 - 17:00
            </p>
          </div>
          <a href="/perritos" style={{
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
            🐕 Ver Catálogo de Adopción
          </a>
        </div>
      </section>
    </div>
  );
}