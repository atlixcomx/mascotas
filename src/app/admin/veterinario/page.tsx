'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// El módulo veterinario ahora tiene acceso directo desde el sidebar
// Redirigir a expedientes médicos como página principal
export default function VeterinarioRedirect() {
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
