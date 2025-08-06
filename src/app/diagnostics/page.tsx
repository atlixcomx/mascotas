export default function DiagnosticsPage() {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV || 'not set',
    DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'not set',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing',
  };

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#af1731', marginBottom: '30px' }}>
        🔧 Diagnóstico del Sistema
      </h1>
      
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#246257', marginBottom: '15px' }}>
          Variables de Entorno
        </h2>
        <pre style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '4px',
          overflow: 'auto'
        }}>
{JSON.stringify(envVars, null, 2)}
        </pre>
      </div>

      <div style={{ 
        backgroundColor: '#e8f5e9', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#246257', marginBottom: '15px' }}>
          Estado del Deployment
        </h2>
        <p>✅ Esta página cargó correctamente</p>
        <p>✅ Next.js está funcionando</p>
        <p>✅ El servidor responde</p>
      </div>

      <div style={{ 
        backgroundColor: '#fff3e0', 
        padding: '20px', 
        borderRadius: '8px'
      }}>
        <h2 style={{ color: '#246257', marginBottom: '15px' }}>
          Páginas de Prueba (Sin Base de Datos)
        </h2>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <a href="/ui-test" style={{ color: '#3d9b84' }}>
              /ui-test - Página de prueba UI
            </a>
          </li>
          <li>
            <a href="/test" style={{ color: '#3d9b84' }}>
              /test - Página de test
            </a>
          </li>
        </ul>
      </div>

      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#ffebee',
        borderRadius: '8px'
      }}>
        <p style={{ margin: 0 }}>
          <strong>Nota:</strong> Esta página no requiere base de datos ni autenticación.
        </p>
      </div>
    </div>
  );
}