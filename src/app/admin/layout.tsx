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
  Bell,
  Shield,
  Crown,
  Sparkles,
  ChevronRight
} from 'lucide-react'

const navigation = [
  { name: 'Panel Principal', href: '/admin', icon: LayoutDashboard },
  { name: 'Gestión de Mascotas', href: '/admin/perritos', icon: Dog },
  { name: 'Solicitudes de Adopción', href: '/admin/solicitudes', icon: FileText },
  { name: 'Comercios Aliados', href: '/admin/comercios', icon: Building2 },
  { name: 'Configuración del Sistema', href: '/admin/configuracion', icon: Settings },
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
      <div className="admin-loading-screen">
        <div className="admin-loading-content">
          <div className="admin-loading-logo">
            <Shield className="loading-shield-icon" />
            <Crown className="loading-crown-icon" />
          </div>
          <div className="admin-loading-spinner"></div>
          <p className="admin-loading-text">INICIALIZANDO SISTEMA GUBERNAMENTAL</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'admin') {
    return null
  }

  return (
    <div className="admin-dashboard-container">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="admin-mobile-overlay" onClick={() => setSidebarOpen(false)}>
          <div className="admin-overlay-backdrop" />
        </div>
      )}

      {/* Sidebar Gubernamental */}
      <div className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : ''}`}>
        {/* Header gubernamental del sidebar */}
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <div className="admin-sidebar-shield">
              <Shield className="sidebar-shield-icon" />
              <Crown className="sidebar-crown-icon" />
            </div>
            <div className="admin-sidebar-title">
              <h2 className="sidebar-main-title">GOBIERNO</h2>
              <p className="sidebar-subtitle">Centro de Adopción</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="admin-sidebar-close"
          >
            <X className="close-icon" />
          </button>
        </div>

        {/* Navegación principal */}
        <nav className="admin-navigation">
          <div className="admin-nav-section">
            <h3 className="admin-nav-header">GESTIÓN ADMINISTRATIVA</h3>
            <div className="admin-nav-items">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`admin-nav-item ${isActive ? 'admin-nav-item-active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="admin-nav-icon">
                      <item.icon className="nav-icon" />
                    </div>
                    <span className="admin-nav-text">{item.name}</span>
                    {isActive && <ChevronRight className="admin-nav-arrow" />}
                    <div className="admin-nav-glow"></div>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Sección de usuario */}
        <div className="admin-user-section">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              <span className="user-initial">
                {session.user.name?.charAt(0) || 'A'}
              </span>
              <div className="admin-user-status"></div>
            </div>
            <div className="admin-user-details">
              <p className="admin-user-name">{session.user.name}</p>
              <p className="admin-user-email">{session.user.email}</p>
              <p className="admin-user-role">ADMINISTRADOR DEL SISTEMA</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="admin-logout-button"
          >
            <LogOut className="logout-icon" />
            <span>CERRAR SESIÓN SEGURA</span>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="admin-main-content">
        {/* Barra superior gubernamental */}
        <header className="admin-top-bar">
          <div className="admin-top-bar-left">
            <button
              onClick={() => setSidebarOpen(true)}
              className="admin-menu-button"
            >
              <Menu className="menu-icon" />
            </button>
            <div className="admin-breadcrumb">
              <div className="breadcrumb-shield">
                <Shield className="breadcrumb-icon" />
              </div>
              <h1 className="admin-page-title">
                {navigation.find(item => item.href === pathname)?.name || 'Panel Administrativo'}
              </h1>
            </div>
          </div>
          
          <div className="admin-top-bar-right">
            <div className="admin-system-status">
              <div className="system-status-indicator"></div>
              <span className="system-status-text">SISTEMA OPERATIVO</span>
            </div>
            <button className="admin-notifications">
              <Bell className="notification-icon" />
              <div className="notification-badge">3</div>
            </button>
            <div className="admin-user-avatar-small">
              <span className="user-initial-small">
                {session.user.name?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="admin-page-content">
          <div className="admin-content-wrapper">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}