export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f8f8',
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          height: '8px',
          backgroundColor: '#af1731'
        }}></div>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '80px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #af1731, #840f31)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L3 7V11C3 16.5 6.8 21.7 12 23C17.2 21.7 21 16.5 21 11V7L12 2Z" />
                </svg>
              </div>
              <div>
                <h1 style={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  color: '#0e312d',
                  margin: 0
                }}>Centro de Adopción Atlixco</h1>
                <p style={{
                  fontSize: '12px',
                  color: '#666',
                  margin: 0
                }}>Gobierno Municipal de Atlixco | 2024</p>
              </div>
            </div>
            <nav style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px'
            }}>
              <a href="/" style={{
                color: '#4a4a4a',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Inicio
              </a>
              <a href="/perritos" style={{
                color: '#4a4a4a',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Perritos
              </a>
              <a href="#contacto" style={{
                color: '#4a4a4a',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Contacto
              </a>
              <a href="/admin" style={{
                backgroundColor: '#af1731',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Portal Administrativo
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0e312d, #246257, #3d9b84)',
        padding: '96px 20px',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '56px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '24px',
            lineHeight: '1.1',
            margin: '0 0 24px 0'
          }}>
            Dale una Segunda
            <span style={{ 
              display: 'block', 
              color: '#e2be96' 
            }}>Oportunidad</span>
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px'
          }}>
            En el Centro de Adopción de Atlixco, conectamos corazones con perritos que buscan un hogar lleno de amor y cuidado.
          </p>
          <a href="/perritos" style={{
            backgroundColor: '#af1731',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: '600',
            display: 'inline-block'
          }}>
            Ver Perritos Disponibles
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        backgroundColor: 'white',
        padding: '64px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#0e312d',
                marginBottom: '8px'
              }}>100+</div>
              <div style={{ color: '#666' }}>Perritos Rescatados</div>
            </div>
            <div>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#0e312d',
                marginBottom: '8px'
              }}>98%</div>
              <div style={{ color: '#666' }}>Tasa de Adopción Exitosa</div>
            </div>
            <div>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#0e312d',
                marginBottom: '8px'
              }}>140+</div>
              <div style={{ color: '#666' }}>Comercios Pet-Friendly</div>
            </div>
            <div>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#0e312d',
                marginBottom: '8px'
              }}>100%</div>
              <div style={{ color: '#666' }}>Seguimiento Post-Adopción</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" style={{
        backgroundColor: '#f8f8f8',
        padding: '64px 20px'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          padding: '48px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#0e312d',
            marginBottom: '32px',
            margin: '0 0 32px 0'
          }}>
            ¿Listo para cambiar una vida?
          </h2>
          <p style={{
            color: '#4a4a4a',
            marginBottom: '24px',
            fontSize: '16px'
          }}>
            Visita nuestro centro y conoce a tu nuevo mejor amigo
          </p>
          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: '#666', margin: '8px 0' }}>📍 Av. Hidalgo 123, Centro, Atlixco, Puebla</p>
            <p style={{ color: '#666', margin: '8px 0' }}>📞 (244) 445-0000</p>
          </div>
          <a href="/perritos" style={{
            backgroundColor: '#af1731',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            display: 'inline-block'
          }}>
            Ver Perritos Disponibles
          </a>
        </div>
      </section>
    </div>
  )
}