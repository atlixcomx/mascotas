import { 
  CentroAdopcionLogo, LocationIcon, PhoneIcon, MailIcon, ClockIcon,
  ArrowRightIcon, FacebookIcon, InstagramIcon, WhatsAppIcon
} from '../icons/Icons'

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#0e312d',
      color: 'white',
      padding: '64px 20px 32px',
      position: 'relative'
    }}>
      {/* Patrón decorativo sutil */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.03,
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)`
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '48px',
          marginBottom: '48px'
        }}>
          {/* Sección 1 - Identidad */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {/* Logo del Centro */}
              <div style={{
                width: '56px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(191, 181, 145, 0.1)',
                borderRadius: '12px',
                border: '2px solid rgba(191, 181, 145, 0.3)'
              }}>
                <svg width="40" height="40" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26 12C20 12 15 17 15 23C15 25 15.5 27 16.5 28.5L26 38L35.5 28.5C36.5 27 37 25 37 23C37 17 32 12 26 12Z" 
                        fill="none" stroke="#bfb591" strokeWidth="2.5"/>
                  <circle cx="22" cy="22" r="1.5" fill="#bfb591"/>
                  <circle cx="30" cy="22" r="1.5" fill="#bfb591"/>
                  <path d="M24 25Q26 27 28 25" stroke="#bfb591" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              <div>
                <h3 style={{
                  fontWeight: '700',
                  fontSize: '20px',
                  margin: 0,
                  marginBottom: '4px'
                }}>Centro de Adopción</h3>
                <p style={{
                  fontSize: '14px',
                  margin: 0,
                  color: 'rgba(255,255,255,0.7)'
                }}>H. Ayuntamiento de Atlixco</p>
              </div>
            </div>
            <p style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '15px',
              lineHeight: '1.6',
              margin: 0
            }}>
              Transformando vidas, creando familias
            </p>
          </div>

          {/* Sección 2 - Enlaces Rápidos */}
          <div>
            <h4 style={{
              fontWeight: '600',
              fontSize: '16px',
              marginBottom: '20px',
              color: '#bfb591',
              letterSpacing: '0.5px'
            }}>Enlaces Rápidos</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="/perritos" style={{
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                fontSize: '15px',
                transition: 'color 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ArrowRightIcon size={16} color="rgba(255,255,255,0.8)" /> Catálogo de Adopción
              </a>
              <a href="#adoptar" style={{
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                fontSize: '15px',
                transition: 'color 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ArrowRightIcon size={16} color="rgba(255,255,255,0.8)" /> Proceso de Adopción
              </a>
              <a href="#voluntariado" style={{
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                fontSize: '15px',
                transition: 'color 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ArrowRightIcon size={16} color="rgba(255,255,255,0.8)" /> Voluntariado
              </a>
              <a href="#contacto" style={{
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                fontSize: '15px',
                transition: 'color 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ArrowRightIcon size={16} color="rgba(255,255,255,0.8)" /> Donaciones
              </a>
            </div>
          </div>

          {/* Sección 3 - Contacto */}
          <div>
            <h4 style={{
              fontWeight: '600',
              fontSize: '16px',
              marginBottom: '20px',
              color: '#bfb591',
              letterSpacing: '0.5px'
            }}>Contacto</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '15px',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <LocationIcon size={18} color="rgba(255,255,255,0.8)" /> [Dirección del centro]
              </p>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '15px',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <PhoneIcon size={18} color="rgba(255,255,255,0.8)" /> Tel: 244-XXX-XXXX
              </p>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '15px',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <MailIcon size={18} color="rgba(255,255,255,0.8)" /> adopciones@atlixco.gob.mx
              </p>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '15px',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ClockIcon size={18} color="rgba(255,255,255,0.8)" /> Lun-Dom: 9:00 - 17:00
              </p>
            </div>
          </div>

          {/* Sección 4 - Redes Sociales */}
          <div>
            <h4 style={{
              fontWeight: '600',
              fontSize: '16px',
              marginBottom: '20px',
              color: '#bfb591',
              letterSpacing: '0.5px'
            }}>Redes Sociales</h4>
            <p style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '15px',
              marginBottom: '20px',
              lineHeight: '1.6'
            }}>
              Síguenos para conocer más historias de amor y segundas oportunidades
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#" style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <FacebookIcon size={20} color="rgba(255,255,255,0.8)" />
              </a>
              <a href="#" style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <InstagramIcon size={20} color="rgba(255,255,255,0.8)" />
              </a>
              <a href="#" style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <WhatsAppIcon size={20} color="rgba(255,255,255,0.8)" />
              </a>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '32px',
          marginTop: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}>
          {/* Logo del Ayuntamiento */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {/* Escudo de Atlixco simplificado */}
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.7">
                {/* Volcán */}
                <path d="M50 20L30 60L70 60Z" fill="#bfb591" opacity="0.5"/>
                {/* Agua */}
                <path d="M25 65C25 65 35 70 50 70C65 70 75 65 75 65" stroke="#bfb591" strokeWidth="2" fill="none"/>
                <path d="M25 72C25 72 35 77 50 77C65 77 75 72 75 72" stroke="#bfb591" strokeWidth="2" fill="none"/>
                {/* Flor */}
                <circle cx="50" cy="45" r="8" fill="none" stroke="#bfb591" strokeWidth="1.5"/>
                <circle cx="50" cy="45" r="3" fill="#bfb591"/>
                {/* Colibrí */}
                <path d="M20 40Q25 35 30 40" stroke="#bfb591" strokeWidth="1.5" fill="none"/>
                <circle cx="25" cy="38" r="2" fill="#bfb591"/>
              </g>
            </svg>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                color: '#bfb591',
                fontSize: '16px',
                margin: 0,
                fontWeight: '600',
                letterSpacing: '1px'
              }}>
                AYUNTAMIENTO DE
              </p>
              <p style={{
                color: '#bfb591',
                fontSize: '24px',
                margin: 0,
                fontWeight: '700',
                letterSpacing: '2px'
              }}>
                ATLIXCO
              </p>
            </div>
          </div>

          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '14px',
            margin: 0,
            textAlign: 'center'
          }}>
            © 2025 Centro de Adopción y Bienestar Animal de Atlixco. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}