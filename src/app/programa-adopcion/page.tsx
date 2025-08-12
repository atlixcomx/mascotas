'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProgramaAdopcion() {
  const router = useRouter()

  useEffect(() => {
    // Redireccionar a la página de inicio con la sección específica
    router.replace('/#proceso-adopcion')
  }, [router])

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <p>Redirigiendo...</p>
    </div>
  )
}