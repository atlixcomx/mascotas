'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  CheckCircleIcon, HeartIcon, DogIcon, ShareIcon, 
  HomeIcon, BirdIcon, FlowerIcon, WaveIcon, MountainIcon
} from '../../../components/icons/Icons'

const defaultDogImage = 'https://somosmaka.com/cdn/shop/articles/perro_mestizo.jpg?v=1697855331'

function GraciasContent() {
  const searchParams = useSearchParams()
  const dogName = searchParams.get('dog') || 'tu nuevo compañero'
  const dogImage = searchParams.get('image') || defaultDogImage
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const shareText = `¡Acabo de solicitar adoptar a ${dogName}! 🐕❤️ El Centro de Adopción y Bienestar Animal de Atlixco está haciendo un trabajo increíble rescatando vidas. ¡Conoce más perritos esperando un hogar!`
  const siteUrl = 'https://4tlixco.vercel.app'

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + siteUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}&quote=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(siteUrl)}`,
    copy: siteUrl
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl)
      alert('¡Enlace copiado al portapapeles!')
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0e312d 0%, #1a4a45 50%, #246257 100%)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      padding: '40px 20px',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.8s ease-out'
    }}>
      {/* Elementos decorativos del escudo de Atlixco */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)`
      }} />

      {/* Elementos de montaña y agua del escudo */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '40%',
        height: '40%',
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M100 20L40 180L160 180Z' fill='white'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom right',
        backgroundSize: 'contain'
      }} />

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        color: 'white'
      }}>
        {/* Icono de éxito */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '120px',
          height: '120px',
          background: 'rgba(34, 197, 94, 0.2)',
          border: '4px solid #22c55e',
          borderRadius: '50%',
          marginBottom: '32px',
          animation: 'scaleIn 0.6s ease-out 0.2s both'
        }}>
          <CheckCircleIcon size={60} color="#22c55e" />
        </div>

        {/* Título principal */}
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 56px)',
          fontWeight: '800',
          marginBottom: '16px',
          letterSpacing: '-2px',
          animation: 'slideInUp 0.8s ease-out 0.4s both'
        }}>
          ¡Gracias por Tu Gran Corazón!
        </h1>

        {/* Mensaje personalizado */}
        <p style={{
          fontSize: 'clamp(18px, 3vw, 24px)',
          opacity: 0.9,
          marginBottom: '32px',
          lineHeight: '1.6',
          animation: 'slideInUp 0.8s ease-out 0.6s both'
        }}>
          Tu solicitud para adoptar a <strong style={{ color: '#bfb591' }}>{dogName}</strong> ha sido enviada exitosamente.
          <br />Nuestro equipo se pondrá en contacto contigo muy pronto.
        </p>

        {/* Foto del perrito */}
        <div style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '4px solid rgba(255,255,255,0.3)',
          margin: '0 auto 40px',
          animation: 'scaleIn 0.8s ease-out 0.8s both'
        }}>
          <Image
            src={dogImage}
            alt={dogName}
            width={160}
            height={160}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* Mensaje motivacional */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '40px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          animation: 'slideInUp 0.8s ease-out 1s both'
        }}>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: '700',
            marginBottom: '16px',
            color: '#bfb591'
          }}>
            Estás Cambiando Una Vida
          </h2>
          <p style={{
            fontSize: '18px',
            lineHeight: '1.6',
            marginBottom: '24px',
            opacity: 0.9
          }}>
            Al elegir adoptar, no solo le das una segunda oportunidad a {dogName}, 
            sino que también haces espacio para que podamos rescatar y cuidar a otro animal necesitado.
          </p>

          {/* Íconos del escudo de Atlixco */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '20px',
            marginTop: '24px'
          }}>
            {[
              { Icon: MountainIcon, text: 'Fortaleza' },
              { Icon: BirdIcon, text: 'Vida Nueva' },
              { Icon: FlowerIcon, text: 'Esperanza' },
              { Icon: WaveIcon, text: 'Abundancia' }
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <item.Icon size={32} color="#bfb591" />
                <span style={{ fontSize: '14px', opacity: 0.8 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de compartir */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '40px',
          border: '1px solid rgba(255,255,255,0.1)',
          animation: 'slideInUp 0.8s ease-out 1.2s both'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <ShareIcon size={28} color="#bfb591" />
            Ayuda a Otros Perritos
          </h3>
          <p style={{
            fontSize: '16px',
            marginBottom: '24px',
            opacity: 0.9,
            lineHeight: '1.5'
          }}>
            Comparte nuestra misión y ayuda a que más familias encuentren a su mejor amigo
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 20px',
                background: '#25D366',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              📱 WhatsApp
            </a>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 20px',
                background: '#1877F2',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              👥 Facebook
            </a>
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 20px',
                background: '#1DA1F2',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              🐦 Twitter
            </a>
            <button
              onClick={handleCopyLink}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 20px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              📋 Copiar enlace
            </button>
          </div>
        </div>

        {/* Botones de navegación */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '16px',
          animation: 'slideInUp 0.8s ease-out 1.4s both'
        }}>
          <Link
            href="/catalogo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 32px',
              background: '#bfb591',
              color: '#0e312d',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '17px',
              fontWeight: '700',
              transition: 'all 0.3s',
              boxShadow: '0 4px 14px rgba(191, 181, 145, 0.3)'
            }}
          >
            <DogIcon size={20} color="#0e312d" />
            Ver Más Perritos
          </Link>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 32px',
              background: 'transparent',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '17px',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
          >
            <HomeIcon size={20} color="white" />
            Ir al Inicio
          </Link>
        </div>

        {/* Mensaje final */}
        <p style={{
          marginTop: '40px',
          fontSize: '16px',
          opacity: 0.7,
          fontStyle: 'italic',
          animation: 'fadeIn 0.8s ease-out 1.6s both'
        }}>
          "Salvar una vida de animal no cambiará el mundo, pero para ese animal, el mundo cambiará para siempre"
        </p>
      </div>

      {/* Animaciones CSS */}
      <style jsx>{`
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
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        button:hover, a:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        @media (max-width: 768px) {
          .share-buttons {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

export default function GraciasPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0e312d 0%, #1a4a45 50%, #246257 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTopColor: 'white',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }} />
          <p>Cargando...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    }>
      <GraciasContent />
    </Suspense>
  )
}