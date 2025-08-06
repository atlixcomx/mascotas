export default function UITestPage() {
  const routes = [
    { name: 'Inicio', path: '/', description: 'Página principal con perritos destacados' },
    { name: 'Catálogo de Perritos', path: '/perritos', description: 'Lista completa de perritos disponibles' },
    { name: 'Perrito Individual', path: '/perritos/max-labrador', description: 'Ejemplo de página de perrito' },
    { name: 'Formulario de Adopción', path: '/solicitud/test-id', description: 'Formulario para solicitar adopción' },
    { name: 'Panel Admin - Login', path: '/admin/login', description: 'Acceso al panel administrativo' },
    { name: 'Panel Admin - Dashboard', path: '/admin', description: 'Dashboard administrativo (requiere login)' },
    { name: 'Panel Admin - Perritos', path: '/admin/perritos', description: 'Gestión de perritos (requiere login)' },
    { name: 'Panel Admin - Solicitudes', path: '/admin/solicitudes', description: 'Gestión de solicitudes (requiere login)' },
    { name: 'Panel Admin - Comercios', path: '/admin/comercios', description: 'Gestión de comercios (requiere login)' },
  ];

  const testData = {
    database: process.env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada',
    nextauth: process.env.NEXTAUTH_URL ? '✅ Configurada' : '❌ No configurada',
    secret: process.env.NEXTAUTH_SECRET ? '✅ Configurada' : '❌ No configurada',
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1 style={{ color: '#af1731', marginBottom: '30px', fontSize: '32px' }}>
        🧪 Página de Prueba UI/UX - Atlixco
      </h1>

      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ color: '#246257', marginBottom: '15px' }}>Estado del Sistema</h2>
        <ul style={{ listStyle: 'none', lineHeight: '2' }}>
          <li>Base de datos: {testData.database}</li>
          <li>NextAuth URL: {testData.nextauth}</li>
          <li>NextAuth Secret: {testData.secret}</li>
        </ul>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#246257', marginBottom: '20px' }}>Rutas Disponibles</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Haz clic en cualquier enlace para probar la UI de cada sección:
        </p>
        
        <div style={{ display: 'grid', gap: '15px' }}>
          {routes.map((route) => (
            <div key={route.path} style={{ 
              padding: '15px', 
              backgroundColor: '#f9f9f9', 
              borderRadius: '6px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: '#af1731', marginBottom: '5px' }}>{route.name}</h3>
                  <p style={{ color: '#666', fontSize: '14px' }}>{route.description}</p>
                  <code style={{ 
                    backgroundColor: '#e2be96', 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#246257'
                  }}>
                    {route.path}
                  </code>
                </div>
                <a 
                  href={route.path} 
                  style={{ 
                    backgroundColor: '#3d9b84',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Probar →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fef3e7', borderRadius: '8px' }}>
        <h3 style={{ color: '#840f31', marginBottom: '10px' }}>🔑 Credenciales de Prueba</h3>
        <p><strong>Email:</strong> admin@atlixco.gob.mx</p>
        <p><strong>Password:</strong> Atlixco2024!</p>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
        <p>Centro de Adopción Atlixco - Sistema de Pruebas UI/UX</p>
      </div>
    </div>
  );
}