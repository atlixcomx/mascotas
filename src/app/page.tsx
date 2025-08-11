import Link from 'next/link'
import { Heart, Dog, Building2 } from 'lucide-react'

export default function Home() {

  return (
    <div>
      {/* Hero Section Mínimo */}
      <section style={{
        minHeight: '80vh',
        background: 'linear-gradient(135deg, #0e312d 0%, #1a4a45 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '40px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          color: 'white'
        }}>
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
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: '800',
            marginBottom: '24px',
            lineHeight: '1.1'
          }}>
            Centro Municipal de 
            <span style={{ 
              display: 'block', 
              color: '#bfb591',
              marginTop: '8px'
            }}>Adopción y Bienestar Animal</span>
          </h1>
          
          <p style={{
            fontSize: 'clamp(18px, 2.5vw, 22px)',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '40px',
            lineHeight: '1.6',
            maxWidth: '700px',
            margin: '0 auto 40px'
          }}>
            Un espacio dedicado al rescate, rehabilitación y adopción responsable, 
            donde cada vida importa y cada historia tiene un final feliz.
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
              gap: '8px'
            }}>
              <Dog size={20} /> Ver Catálogo de Adopción
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
              <Heart size={20} /> Adoptar Ahora
            </Link>
          </div>
        </div>
      </section>

      {/* Sección Simple de Información */}
      <section style={{
        backgroundColor: 'white',
        padding: '80px 20px'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: '800',
            color: '#0e312d',
            marginBottom: '24px'
          }}>
            Rescate, Rehabilitación, Adopción
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#666',
            lineHeight: '1.6',
            marginBottom: '40px'
          }}>
            El Centro Municipal representa el compromiso del H. Ayuntamiento de Atlixco 
            con el bienestar animal, ofreciendo servicios integrales desde el rescate 
            hasta la adopción responsable.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginTop: '60px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '48px',
                fontWeight: '900',
                color: '#dc2626',
                marginBottom: '8px'
              }}>500+</div>
              <div style={{ fontSize: '16px', color: '#666' }}>Rescatados</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '48px',
                fontWeight: '900',
                color: '#16a34a',
                marginBottom: '8px'
              }}>350+</div>
              <div style={{ fontSize: '16px', color: '#666' }}>Adoptados</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '48px',
                fontWeight: '900',
                color: '#0891b2',
                marginBottom: '8px'
              }}>100%</div>
              <div style={{ fontSize: '16px', color: '#666' }}>Esterilizados</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}