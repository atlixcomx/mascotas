'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Redirigir a la ubicación principal de expedientes
export default function ExpedientesRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/admin/veterinario/expedientes')
  }, [router])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      color: '#64748b'
    }}>
      Redirigiendo a Expedientes Médicos...
    </div>
  )
}
