export default function Header() {
  return (
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
  );
}