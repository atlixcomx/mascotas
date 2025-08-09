import Image from 'next/image'
import { 
  LocationIcon, PhoneIcon, MailIcon, ClockIcon,
  ArrowRightIcon, FacebookIcon, InstagramIcon, WhatsAppIcon
} from '../icons/Icons'

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#0e312d',
      color: 'white',
      padding: '40px 20px 24px',
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
          gap: '24px',
          marginBottom: '24px'
        }}>

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
              <a href="/catalogo" style={{
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
          paddingTop: '24px',
          marginTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}>
          {/* Logos del Ayuntamiento y Mi Casa */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {/* Logo del Ayuntamiento */}
            <div style={{
              width: '280px',
              height: '280px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Image 
                src="/ayuntamientoB.png" 
                alt="H. Ayuntamiento de Atlixco"
                width={280}
                height={280}
                style={{ objectFit: 'contain' }}
              />
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