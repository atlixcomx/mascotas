export const dynamic = 'force-dynamic'

export default function AdminLogin() {
  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          background-color: #f3f4f6 !important;
          color: #374151 !important;
          font-family: system-ui, -apple-system, sans-serif;
          height: 100%;
          overflow-x: hidden;
        }
        @media (prefers-color-scheme: dark) {
          html, body {
            background-color: #f3f4f6 !important;
            color: #374151 !important;
          }
        }
      `}</style>
      
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        zIndex: 9999
      }}>
        {/* Test Content */}
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#7d2447',
            marginBottom: '16px'
          }}>
            🏛️ GOBIERNO DE ATLIXCO
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            marginBottom: '24px'
          }}>
            Portal Administrativo - Centro de Adopción
          </p>
          
          <div style={{
            padding: '16px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#059669',
              fontWeight: '600'
            }}>
              ✅ Página cargada correctamente
            </p>
          </div>
          
          <form style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Email
              </label>
              <input
                type="email"
                placeholder="admin@atlixco.gob.mx"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <button
              type="button"
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#7d2447',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🔐 ACCEDER AL SISTEMA
            </button>
          </form>
        </div>
      </div>
    </>
  )
}