import Link from 'next/link'
import { 
  Heart, Dog, Building2, Search, FileText, Home as HomeIcon, 
  HeartHandshake, Shield, Stethoscope, Star, Users, Phone,
  Mail, Clock, MapPin, ChevronRight, CheckCircle, Store,
  Coffee, Hotel, ShoppingBag, Trees
} from 'lucide-react'

export default function Home() {

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
            marginBottom: '20px',
            lineHeight: '1.6',
            maxWidth: '800px',
            margin: '0 auto 20px'
          }}>
            Un compromiso del Gobierno Municipal con el bienestar animal y las familias de Atlixco
          </p>
          
          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '40px',
            lineHeight: '1.8',
            maxWidth: '700px',
            margin: '0 auto 40px'
          }}>
            Somos el centro oficial del municipio dedicado al rescate, rehabilitación y adopción responsable 
            de perros en situación vulnerable. Cada rescate es una promesa de vida digna, respaldada por 
            protocolos veterinarios certificados y el compromiso del gobierno local.
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px'
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

      {/* Tu Camino Hacia una Nueva Amistad */}
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
            Tu Camino Hacia una Nueva Amistad
          </h2>
          <p style={{
            fontSize: '24px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '60px',
            fontWeight: '300'
          }}>
            Proceso de Adopción Municipal Certificado
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#f0f9ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <Search size={40} style={{ color: '#0891b2' }} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#0e312d', marginBottom: '12px' }}>
                🔍 EXPLORA
              </h3>
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#0891b2', marginBottom: '12px' }}>
                Navega nuestro catálogo oficial
              </h4>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Utiliza nuestros filtros inteligentes para encontrar al compañero 
                perfecto según tu estilo de vida y preferencias.
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#f0fdf4',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <FileText size={40} style={{ color: '#16a34a' }} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#0e312d', marginBottom: '12px' }}>
                📋 SOLICITA
              </h3>
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#16a34a', marginBottom: '12px' }}>
                Inicia tu proceso de adopción
              </h4>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Completa la solicitud municipal. Nuestro equipo te acompañará 
                para garantizar el match perfecto entre mascota y familia.
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#fef3c7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <HomeIcon size={40} style={{ color: '#f59e0b' }} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#0e312d', marginBottom: '12px' }}>
                🏠 VISITA
              </h3>
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#f59e0b', marginBottom: '12px' }}>
                Conoce a tu elegido en persona
              </h4>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Ven a nuestras instalaciones municipales y crea el primer 
                vínculo con tu futuro compañero de vida.
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#fee2e2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <Heart size={40} style={{ color: '#dc2626' }} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#0e312d', marginBottom: '12px' }}>
                ❤️ ADOPTA
              </h3>
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#dc2626', marginBottom: '12px' }}>
                Llévalo a casa con apoyo continuo
              </h4>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Recibe seguimiento post-adopción y apoyo veterinario 
                del programa municipal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Algunos de Nuestros Cachorros */}
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
            Algunos de Nuestros Cachorros en Adopción
          </h2>
          <p style={{
            fontSize: '24px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '60px',
            fontWeight: '300'
          }}>
            Listos para encontrar su hogar para siempre
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginBottom: '40px'
          }}>
            {[
              { nombre: 'LUNA', desc: 'Cariñosa y juguetona, ideal para familias con niños', edad: 'Hembra, 2 años' },
              { nombre: 'MAX', desc: 'Energético y leal, perfecto para personas activas', edad: 'Macho, 1 año' },
              { nombre: 'BELLA', desc: 'Tranquila y protectora, excelente para departamentos', edad: 'Hembra, 3 años' },
              { nombre: 'ROCKY', desc: 'Cachorro sociable, se adapta fácilmente a nuevos entornos', edad: 'Macho, 6 meses' },
              { nombre: 'COCO', desc: 'Madura y calmada, ideal para adultos mayores', edad: 'Hembra, 4 años' },
              { nombre: 'ZEUS', desc: 'Guardián natural, perfecto para casas con patio', edad: 'Macho, 2 años' }
            ].map((perro, idx) => (
              <div key={idx} style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  height: '200px',
                  backgroundColor: '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px'
                }}>
                  🐕
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
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px', fontStyle: 'italic' }}>
                    {perro.edad}
                  </p>
                  <p style={{ color: '#666', lineHeight: '1.6' }}>
                    {perro.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <p style={{
            textAlign: 'center',
            fontSize: '16px',
            color: '#666',
            marginBottom: '32px',
            fontStyle: 'italic'
          }}>
            Todos vacunados, esterilizados y con certificación veterinaria municipal
          </p>
          
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
                🏪 CAFETERÍAS Y RESTAURANTES
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
                🏨 HOTELES Y HOSPEDAJE
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
                🛍️ TIENDAS Y SERVICIOS
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
                🌳 ESPACIOS RECREATIVOS
              </h3>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Parque Central, Plaza de Armas, Sendero Ecoturístico
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <div>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '16px' }}>Para el Público:</p>
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
                fontWeight: '600'
              }}>
                Ver Todos los Comercios Certificados <ChevronRight size={20} />
              </Link>
            </div>
            
            <div>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '16px' }}>Para Comerciantes:</p>
              <Link href="/comercios-friendly#certificar" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'transparent',
                color: '#16a34a',
                padding: '14px 28px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600',
                border: '2px solid #16a34a'
              }}>
                Certificar Mi Negocio como Pet Friendly <ChevronRight size={20} />
              </Link>
            </div>
          </div>
          
          <p style={{
            textAlign: 'center',
            fontSize: '16px',
            color: '#666',
            marginTop: '32px',
            fontStyle: 'italic'
          }}>
            Únete a la red oficial de comercios inclusivos del Municipio de Atlixco
          </p>
        </div>
      </section>

      {/* Protocolo Veterinario */}
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
            Protocolo Veterinario Municipal Certificado
          </h2>
          <p style={{
            fontSize: '24px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '60px',
            fontWeight: '300'
          }}>
            Cada Rescate es una Promesa de Vida Digna
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
            Nuestro compromiso gubernamental incluye un protocolo veterinario integral ejecutado 
            por profesionales de planta, garantizando que cada animal reciba la atención médica necesaria:
          </p>
          
          <div style={{
            display: 'grid',
            gap: '24px',
            maxWidth: '800px',
            margin: '0 auto 40px'
          }}>
            {[
              { num: '1', title: 'RECEPCIÓN Y EVALUACIÓN', desc: 'Evaluación veterinaria completa y plan de atención personalizado' },
              { num: '2', title: 'PROTOCOLO DE VACUNACIÓN', desc: 'Esquema completo: séxtuple y antirrábica, más desparasitación integral' },
              { num: '3', title: 'ESTERILIZACIÓN RESPONSABLE', desc: 'Control poblacional y mejora en calidad de vida' },
              { num: '4', title: 'TRATAMIENTOS ESPECIALIZADOS', desc: 'Atención de sarna, TVT, ehrlichia y condiciones dermatológicas' },
              { num: '5', title: 'REHABILITACIÓN Y SOCIALIZACIÓN', desc: 'Preparación conductual para la nueva vida familiar' }
            ].map((paso, idx) => (
              <div key={idx} style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#bfb591',
                  color: '#0e312d',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '20px',
                  flexShrink: 0
                }}>
                  {paso.num}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0e312d', marginBottom: '8px' }}>
                    {paso.title}
                  </h3>
                  <p style={{ color: '#666', lineHeight: '1.6' }}>
                    {paso.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{
            backgroundColor: '#16a34a',
            color: 'white',
            padding: '32px',
            borderRadius: '16px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <CheckCircle size={48} style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
              ✅ Garantía Municipal
            </h3>
            <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
              Cada adoptado sale con cartilla de vacunación completa y certificación veterinaria municipal.
            </p>
          </div>
        </div>
      </section>

      {/* Nuestro Impacto */}
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
            Nuestro Impacto en la Comunidad
          </h2>
          <p style={{
            fontSize: '24px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '60px',
            fontWeight: '300'
          }}>
            Una Política Pública que Transforma Vidas
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '60px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '56px',
                fontWeight: '900',
                color: '#dc2626',
                marginBottom: '8px'
              }}>+500</div>
              <div style={{ fontSize: '18px', color: '#666' }}>animales rescatados y rehabilitados</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '56px',
                fontWeight: '900',
                color: '#16a34a',
                marginBottom: '8px'
              }}>+350</div>
              <div style={{ fontSize: '18px', color: '#666' }}>adopciones exitosas realizadas</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '56px',
                fontWeight: '900',
                color: '#9333ea',
                marginBottom: '8px'
              }}>50</div>
              <div style={{ fontSize: '18px', color: '#666' }}>comercios certificados pet friendly</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '56px',
                fontWeight: '900',
                color: '#0891b2',
                marginBottom: '8px'
              }}>100%</div>
              <div style={{ fontSize: '18px', color: '#666' }}>de animales esterilizados antes de la adopción</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '56px',
                fontWeight: '900',
                color: '#f59e0b',
                marginBottom: '8px'
              }}>24/7</div>
              <div style={{ fontSize: '18px', color: '#666' }}>disponibilidad para emergencias de rescate</div>
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
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>📍 Dirección</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                [Dirección del centro municipal]
              </p>
            </div>
            
            <div>
              <Phone size={32} style={{ marginBottom: '12px', color: '#bfb591' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>📞 Teléfono</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '20px' }}>
                244-XXX-XXXX
              </p>
            </div>
            
            <div>
              <Mail size={32} style={{ marginBottom: '12px', color: '#bfb591' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>📧 Email</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                adopciones@atlixco.gob.mx
              </p>
            </div>
            
            <div>
              <Clock size={32} style={{ marginBottom: '12px', color: '#bfb591' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>🕒 Horarios</h3>
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