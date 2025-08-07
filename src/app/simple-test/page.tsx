'use client'

export default function SimpleTest() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#22c55e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      fontSize: '24px',
      color: 'white',
      zIndex: 99999
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: '12px'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
          ✅ SUCCESS
        </h1>
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>
          Next.js is working correctly
        </p>
        <p style={{ fontSize: '16px', opacity: 0.8 }}>
          /simple-test route functional
        </p>
        <div style={{ 
          marginTop: '20px', 
          padding: '10px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          If you see this green screen, the server is working fine.
        </div>
      </div>
    </div>
  )
}