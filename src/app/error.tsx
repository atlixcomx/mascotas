'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Error en la aplicación</h2>
      <p style={{ color: 'red' }}>
        {error.message || 'Ocurrió un error inesperado'}
      </p>
      <details style={{ marginTop: '20px' }}>
        <summary>Detalles del error</summary>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', overflow: 'auto' }}>
          {error.stack}
        </pre>
      </details>
      <button
        onClick={() => reset()}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Intentar de nuevo
      </button>
    </div>
  )
}