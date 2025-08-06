'use client'

import { SessionProvider } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Evitar errores de hidratación
  if (!mounted) {
    return <>{children}</>
  }

  try {
    return <SessionProvider>{children}</SessionProvider>
  } catch (error) {
    console.error('AuthProvider error:', error)
    // En caso de error, renderizar sin autenticación
    return <>{children}</>
  }
}