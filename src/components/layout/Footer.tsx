import Image from 'next/image'
import Link from 'next/link'
import {
  LocationIcon, PhoneIcon, MailIcon,
  FacebookIcon, InstagramIcon, WhatsAppIcon
} from '../icons/Icons'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{
      backgroundColor: '#0e312d',
      color: 'white'
    }}>
      {/* Sección principal */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '48px 20px 32px'
      }}>
        {/* Logos lado a lado */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '48px',
          marginBottom: '32px',
          flexWrap: 'wrap'
        }}>
          <Image
            src="/centroB.png"
            alt="Centro Municipal de Adopción y Bienestar Animal"
            width={160}
            height={56}
            style={{ objectFit: 'contain' }}
          />
          <div style={{
            width: '1px',
            height: '48px',
            backgroundColor: 'rgba(255,255,255,0.2)'
          }} />
          <Image
            src="/ayuntamientoB.png"
            alt="H. Ayuntamiento de Atlixco"
            width={140}
            height={140}
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Info compacta en una línea */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '32px',
          flexWrap: 'wrap',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '14px'
          }}>
            <LocationIcon size={16} color="rgba(255,255,255,0.6)" />
            <span>Blvd. Niños Héroes #1003</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '14px'
          }}>
            <PhoneIcon size={16} color="rgba(255,255,255,0.6)" />
            <span>244-761-9323</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '14px'
          }}>
            <MailIcon size={16} color="rgba(255,255,255,0.6)" />
            <span>adopciones@atlixco.gob.mx</span>
          </div>
        </div>

        {/* Links de navegación */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          marginBottom: '24px'
        }}>
          {[
            { href: '/catalogo', label: 'Catálogo' },
            { href: '/comercios-friendly', label: 'Comercios Pet Friendly' },
            { href: '/noticias', label: 'Noticias' }
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.2s'
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Redes sociales */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {[
            { icon: FacebookIcon, href: '#', label: 'Facebook' },
            { icon: InstagramIcon, href: '#', label: 'Instagram' },
            { icon: WhatsAppIcon, href: '#', label: 'WhatsApp' }
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
            >
              <social.icon size={18} color="rgba(255,255,255,0.8)" />
            </a>
          ))}
        </div>
      </div>

      {/* Barra inferior */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 20px',
        backgroundColor: 'rgba(0,0,0,0.2)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '13px',
            margin: 0
          }}>
            © {currentYear} Centro de Adopción y Bienestar Animal de Atlixco
          </p>
          <p style={{
            color: '#bfb591',
            fontSize: '13px',
            margin: 0,
            fontWeight: '500'
          }}>
            Gobierno Municipal 2024-2027
          </p>
        </div>
      </div>
    </footer>
  )
}