'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Dog, 
  FileText, 
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Perritos', href: '/admin/perritos', icon: Dog },
  { name: 'Solicitudes', href: '/admin/solicitudes', icon: FileText },
  { name: 'Comercios', href: '/admin/comercios', icon: Building2 },
  { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/admin/login')
      return
    }

    if (session.user.role !== 'admin') {
      signOut({ callbackUrl: '/admin/login' })
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ opacity: 0.6 }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#af1731',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }}></div>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'admin') {
    return null
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          display: 'block'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(71, 85, 105, 0.5)'
          }} onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        width: '256px',
        backgroundColor: 'white',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 200ms ease-in-out'
      }}>
        
        {/* Sidebar header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
          padding: '0 24px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #af1731, #840f31)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>A</span>
            </div>
            <span style={{ fontWeight: '600', color: '#0e312d' }}>Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              display: 'block',
              padding: '4px',
              borderRadius: '6px',
              color: '#94a3b8',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: isActive ? 'rgba(175, 23, 49, 0.1)' : 'transparent',
                  color: isActive ? '#af1731' : '#475569',
                  borderRight: isActive ? '2px solid #af1731' : 'none'
                }}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon style={{ marginRight: '12px', width: '20px', height: '20px' }} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#cbd5e1',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
                {session.user.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#0e312d',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                margin: 0
              }}>
                {session.user.name}
              </p>
              <p style={{
                fontSize: '12px',
                color: '#64748b',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                margin: 0
              }}>
                {session.user.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#475569',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            <LogOut style={{ marginRight: '12px', width: '16px', height: '16px' }} />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ 
        marginLeft: '256px',
        transition: 'margin-left 200ms ease-in-out'
      }}>
        {/* Top bar */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  display: 'flex',
                  padding: '8px',
                  borderRadius: '6px',
                  color: '#94a3b8',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Menu style={{ width: '20px', height: '20px' }} />
              </button>
              <h1 style={{
                marginLeft: '0',
                fontSize: '18px',
                fontWeight: '600',
                color: '#0e312d',
                margin: 0
              }}>
                {navigation.find(item => item.href === pathname)?.name || 'Admin'}
              </h1>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button style={{
                padding: '8px',
                color: '#94a3b8',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                <Bell style={{ width: '20px', height: '20px' }} />
              </button>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#cbd5e1',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
                  {session.user.name?.charAt(0) || 'A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  )
}