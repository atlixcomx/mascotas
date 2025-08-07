'use client'

export const dynamic = 'force-dynamic'

export default function AdminLoginDirect() {
  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          height: 100% !important;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%) !important;
          color: #374151 !important;
        }
        body {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 20px !important;
          min-height: 100vh !important;
        }
      `}</style>
      
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        padding: '48px',
        maxWidth: '480px',
        width: '100%',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          width: '88px',
          height: '88px',
          background: 'linear-gradient(135deg, #7d2447 0%, #af1731 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          margin: '0 auto 24px',
          boxShadow: '0 8px 16px rgba(125, 36, 71, 0.3)'
        }}>
          🏛️
        </div>
        
        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#7d2447',
          textAlign: 'center',
          marginBottom: '8px',
          letterSpacing: '-1px'
        }}>
          GOBIERNO DE ATLIXCO
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          Portal Administrativo - Centro de Adopción
        </p>
        
        <div style={{
          background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
          border: '2px solid #16a34a',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            color: '#15803d',
            fontWeight: '700',
            fontSize: '18px',
            marginBottom: '4px'
          }}>
            ✅ SISTEMA OPERATIVO
          </div>
          <div style={{
            color: '#166534',
            fontSize: '14px'
          }}>
            Página renderizada correctamente - Layout independiente
          </div>
        </div>
        
        <form>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '15px',
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
                padding: '16px 20px',
                border: '2px solid #d1d5db',
                borderRadius: '10px',
                fontSize: '16px',
                background: '#ffffff',
                color: '#374151',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '15px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Contraseña
            </label>
            <input 
              type="password" 
              placeholder="••••••••••"
              defaultValue="Atlixco2024!"
              style={{
                width: '100%',
                padding: '16px 20px',
                border: '2px solid #d1d5db',
                borderRadius: '10px',
                fontSize: '16px',
                background: '#ffffff',
                color: '#374151',
                outline: 'none'
              }}
            />
          </div>
          
          <button 
            type="button" 
            onClick={() => alert('✅ Interfaz funcionando correctamente!\n\nEsta página se carga sin problemas, confirmando que Next.js funciona.\n\nEl problema original estaba en conflictos con el layout admin.')}
            style={{
              width: '100%',
              padding: '18px',
              background: 'linear-gradient(135deg, #7d2447 0%, #af1731 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              textAlign: 'center',
              boxShadow: '0 8px 16px rgba(125, 36, 71, 0.3)'
            }}
          >
            🔐 ACCEDER AL SISTEMA GUBERNAMENTAL
          </button>
        </form>
        
        <div style={{
          marginTop: '32px',
          padding: '20px',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: '1px solid #f59e0b',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '13px',
            color: '#92400e',
            fontWeight: '700',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Diagnóstico Técnico
          </div>
          <div style={{
            fontSize: '15px',
            color: '#78350f',
            lineHeight: '1.5'
          }}>
            Esta página usa un layout completamente independiente y demuestra que 
            el sistema de renderizado funciona correctamente.
          </div>
        </div>
        
        <div style={{
          marginTop: '32px',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '13px',
          lineHeight: '1.6'
        }}>
          Sistema de Gestión Municipal<br/>
          Gobierno de Atlixco, Puebla<br/>
          <strong>Soporte:</strong> soporte.ti@atlixco.gob.mx
        </div>
      </div>
    </>
  )
}