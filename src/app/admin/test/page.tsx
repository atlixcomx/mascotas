export const dynamic = 'force-dynamic'

export default function AdminTest() {
  return (
    <html>
      <head>
        <title>Test Admin Route</title>
        <style dangerouslySetInnerHTML={{
          __html: `
            body { 
              margin: 0; 
              padding: 0; 
              background: #10b981 !important; 
              color: white !important;
              font-family: monospace;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
          `
        }} />
      </head>
      <body>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: '#065f46',
          borderRadius: '12px',
          border: '3px solid #ffffff'
        }}>
          <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
            ✅ ROUTING TEST SUCCESS
          </h1>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>
            Admin route is working correctly
          </p>
          <p style={{ fontSize: '14px', opacity: '0.8' }}>
            URL: /admin/test
          </p>
          <p style={{ fontSize: '14px', marginTop: '20px' }}>
            If you see this green page, the admin routing is functional.
          </p>
        </div>
      </body>
    </html>
  )
}