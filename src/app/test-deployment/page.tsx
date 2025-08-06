'use client'

export default function TestDeployment() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f8f8',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '48px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#0e312d',
          marginBottom: '16px'
        }}>
          ✅ Deployment Exitoso
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '24px'
        }}>
          Esta página fue creada el 6 de agosto de 2025 a las 15:40
        </p>
        <p style={{
          fontSize: '16px',
          color: '#4a4a4a'
        }}>
          Si puedes ver esta página, significa que el deployment más reciente se completó correctamente.
        </p>
        <div style={{
          marginTop: '32px',
          padding: '16px',
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
          border: '1px solid #3d9b84'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#3d9b84',
            margin: 0
          }}>
            La página principal debería mostrar el contenido completo con header, hero section, estadísticas y contacto.
          </p>
        </div>
      </div>
    </div>
  )
}