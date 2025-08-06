export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#0e312d',
      color: 'white',
      padding: '48px 20px 24px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px',
          marginBottom: '32px'
        }}>
          {/* Logo y descripción */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #af1731, #840f31)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L3 7V11C3 16.5 6.8 21.7 12 23C17.2 21.7 21 16.5 21 11V7L12 2Z" />
                </svg>
              </div>
              <h3 style={{
                fontWeight: 'bold',
                fontSize: '18px',
                margin: 0
              }}>Centro de Adopción Atlixco</h3>
            </div>
            <p style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '14px',
              lineHeight: '1.5',
              margin: 0
            }}>
              Conectamos corazones con perritos que buscan un hogar lleno de amor y cuidado en Atlixco, Puebla.
            </p>
          </div>

          {/* Información de contacto */}
          <div>
            <h4 style={{
              fontWeight: '600',
              fontSize: '16px',
              marginBottom: '16px',
              color: '#e2be96'
            }}>Contacto</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px',
                margin: 0
              }}>📍 Av. Hidalgo 123, Centro</p>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px',
                margin: 0
              }}>📞 (244) 445-0000</p>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px',
                margin: 0
              }}>✉️ adopcion@atlixco.gob.mx</p>
            </div>
          </div>

          {/* Horarios */}
          <div>
            <h4 style={{
              fontWeight: '600',
              fontSize: '16px',
              marginBottom: '16px',
              color: '#e2be96'
            }}>Horarios de Atención</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px',
                margin: 0
              }}>Lunes a Viernes: 9:00 - 17:00</p>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px',
                margin: 0
              }}>Sábados: 9:00 - 14:00</p>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px',
                margin: 0
              }}>Domingos: Cerrado</p>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 style={{
              fontWeight: '600',
              fontSize: '16px',
              marginBottom: '16px',
              color: '#e2be96'
            }}>Enlaces Rápidos</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="/" style={{
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                fontSize: '14px'
              }}>Inicio</a>
              <a href="/perritos" style={{
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                fontSize: '14px'
              }}>Ver Perritos</a>
              <a href="/admin" style={{
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                fontSize: '14px'
              }}>Portal Administrativo</a>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.2)',
          paddingTop: '24px',
          textAlign: 'center'
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '14px',
            margin: 0
          }}>
            © 2024 Gobierno Municipal de Atlixco. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}