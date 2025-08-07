export default function AdminLogin() {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      margin: 0,
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Main Login Card */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '450px',
        width: '100%',
        border: '1px solid #e5e7eb'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#7d2447',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px'
          }}>
            🏛️
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#7d2447',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>
            GOBIERNO DE ATLIXCO
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: '0'
          }}>
            Portal Administrativo - Centro de Adopción
          </p>
        </div>

        {/* Status Indicator */}
        <div style={{
          padding: '16px',
          backgroundColor: '#dcfce7',
          border: '2px solid #16a34a',
          borderRadius: '8px',
          marginBottom: '32px'
        }}>
          <p style={{
            fontSize: '16px',
            color: '#16a34a',
            fontWeight: '600',
            margin: '0'
          }}>
            ✅ Sistema operativo - Página cargada correctamente
          </p>
        </div>
        
        {/* Login Form */}
        <div style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="admin@atlixco.gob.mx"
              defaultValue="admin@atlixco.gob.mx"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: '#ffffff',
                color: '#374151',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              defaultValue="Atlixco2024!"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: '#ffffff',
                color: '#374151',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <button
            type="button"
            onClick={() => {
              alert('Funcionalidad de login será restaurada una vez confirmado que la interfaz funciona correctamente.')
            }}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#7d2447',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#8b2750'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#7d2447'
              e.currentTarget.style.transform = 'translateY(0px)'
            }}
          >
            🔐 ACCEDER AL SISTEMA GUBERNAMENTAL
          </button>
        </div>

        {/* Development Notice */}
        <div style={{
          marginTop: '32px',
          padding: '16px',
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#92400e',
            fontWeight: '600',
            marginBottom: '4px',
            margin: '0 0 4px 0'
          }}>
            MODO DIAGNÓSTICO
          </p>
          <p style={{
            fontSize: '14px',
            color: '#78350f',
            margin: '0'
          }}>
            Verificando funcionamiento del sistema de autenticación
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '24px',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '12px'
      }}>
        <p style={{ margin: '0' }}>
          Sistema de Gestión Municipal | Gobierno de Atlixco, Puebla
        </p>
        <p style={{ margin: '4px 0 0 0' }}>
          Soporte técnico: soporte.ti@atlixco.gob.mx
        </p>
      </div>
    </div>
  )
}