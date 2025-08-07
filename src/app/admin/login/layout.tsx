import React from 'react'

export const dynamic = 'force-dynamic'

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#f3f4f6',
      zIndex: 999999,
      overflow: 'auto'
    }}>
      {children}
    </div>
  )
}