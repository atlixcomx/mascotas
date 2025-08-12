'use client'

import DiagnosticPanel from '../../components/DiagnosticPanel'

export default function DiagnosticsPage() {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV || 'not set',
    DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'not set',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing',
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      <DiagnosticPanel />
      
      {/* Panel adicional con info del entorno */}
      <div style={{
        maxWidth: '800px',
        margin: '32px auto 0',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '32px'
      }}>
        <h2 style={{ 
          color: '#af1731', 
          marginBottom: '20px',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          Información del Entorno
        </h2>
        
        <div style={{ 
          backgroundColor: '#f8fafc', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#374151', marginBottom: '15px', fontSize: '16px' }}>
            Variables de Entorno
          </h3>
          <pre style={{ 
            backgroundColor: 'white', 
            padding: '15px', 
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            border: '1px solid #e5e7eb'
          }}>
{JSON.stringify(envVars, null, 2)}
          </pre>
        </div>

        <div style={{ 
          backgroundColor: '#f0fdf4', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #d1fae5'
        }}>
          <h3 style={{ color: '#15803d', marginBottom: '15px', fontSize: '16px' }}>
            Estado del Deployment
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>✅</span>
              <span style={{ fontSize: '14px' }}>Esta página cargó correctamente</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>✅</span>
              <span style={{ fontSize: '14px' }}>Next.js está funcionando</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>✅</span>
              <span style={{ fontSize: '14px' }}>El servidor responde</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}