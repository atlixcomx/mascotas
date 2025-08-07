'use client'

export const dynamic = 'force-dynamic'

export default function DebugAdmin() {
  return (
    <>
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { 
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important; 
          color: white !important;
          font-family: system-ui, -apple-system, sans-serif;
          min-height: 100vh;
        }
        body {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
      `}</style>
      
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '16px',
        border: '2px solid rgba(255,255,255,0.3)',
        backdropFilter: 'blur(10px)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          fontSize: '36px', 
          marginBottom: '24px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🟢 ROUTING DIAGNOSTIC SUCCESS
        </h1>
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <p style={{ fontSize: '18px', marginBottom: '12px', fontWeight: '600' }}>
            ✅ Next.js routing is functional
          </p>
          <p style={{ fontSize: '16px', opacity: '0.9' }}>
            This page loads outside admin layout restrictions
          </p>
        </div>
        
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'left',
          fontSize: '14px',
          fontFamily: 'monospace'
        }}>
          <p><strong>Current URL:</strong> /debug-admin</p>
          <p><strong>Status:</strong> No admin layout interference</p>
          <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
        </div>
        
        <div style={{ marginTop: '24px' }}>
          <p style={{ fontSize: '14px', opacity: '0.8' }}>
            If you can see this green page, the core Next.js system is working.
            <br />
            The admin login issue is likely caused by layout or CSS conflicts.
          </p>
        </div>
        
        <button 
          onClick={() => window.location.href = '/admin/login'}
          style={{
            marginTop: '24px',
            padding: '12px 24px',
            backgroundColor: '#ffffff',
            color: '#059669',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          → Test Admin Login
        </button>
      </div>
    </>
  )
}