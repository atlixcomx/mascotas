'use client'

export const dynamic = 'force-dynamic'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState, useRef, KeyboardEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import './admin-global.css'
import './admin-layout-professional.css'
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
  ChevronRight,
  Activity,
  Share2,
  Stethoscope,
  Newspaper,
  PlusCircle,
  FolderOpen,
  Calendar,
  ClipboardCheck,
  PartyPopper
} from 'lucide-react'
import { NotificationPanel } from '../../components/ui/NotificationPanel'

// Navegación organizada por grupos de procesos
const navigationGroups = [
  {
    title: 'Mascotas',
    items: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: Activity },
      { name: 'Gestión de Mascotas', href: '/admin/perritos', icon: Dog },
      { name: 'Nuevo Ingreso', href: '/admin/veterinario/nuevo-ingreso', icon: PlusCircle },
      { name: 'Expedientes Médicos', href: '/admin/veterinario/expedientes', icon: FolderOpen },
      { name: 'Calendario Citas', href: '/admin/veterinario/calendario', icon: Calendar },
    ]
  },
  {
    title: 'Adopción',
    items: [
      { name: 'Solicitudes', href: '/admin/solicitudes', icon: FileText },
      { name: 'Seguimientos', href: '/admin/seguimientos', icon: ClipboardCheck },
    ]
  },
  {
    title: 'Difusión',
    items: [
      { name: 'Eventos', href: '/admin/eventos', icon: PartyPopper },
      { name: 'Noticias', href: '/admin/noticias', icon: Newspaper },
      { name: 'Comercios Aliados', href: '/admin/comercios', icon: Building2 },
    ]
  },
  {
    title: 'Sistema',
    items: [
      { name: 'Recordatorios', href: '/admin/recordatorios', icon: Bell },
      { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
    ]
  }
]

// Flatten para keyboard navigation
const navigation = navigationGroups.flatMap(group => group.items)

export default function KeyboardNavigableLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sessionResult = useSession()
  const session = sessionResult?.data || null
  const status = sessionResult?.status || 'loading'
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const logoutRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setIsClient(true)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (status === 'loading') return
    
    // Si estamos en login, no hacer redirecciones
    if (pathname === '/admin/login') return
    
    if (!session) {
      router.push('/admin/login')
      return
    }

    // Permitir cualquier usuario autenticado (la verificación se hará en las APIs)
    if (!session?.user) {
      signOut({ callbackUrl: '/admin/login' })
      return
    }
  }, [session, status, router, pathname])

  // Keyboard navigation handler
  const handleNavKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const totalItems = navigation.length + 1 // +1 for logout button
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => {
          const next = prev + 1
          if (next >= totalItems) return 0
          return next
        })
        break
        
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => {
          const next = prev - 1
          if (next < 0) return totalItems - 1
          return next
        })
        break
        
      case 'Home':
        e.preventDefault()
        setFocusedIndex(0)
        break
        
      case 'End':
        e.preventDefault()
        setFocusedIndex(totalItems - 1)
        break
        
      case 'Escape':
        e.preventDefault()
        setSidebarOpen(false)
        setFocusedIndex(-1)
        break
    }
  }

  // Focus management
  useEffect(() => {
    if (focusedIndex >= 0 && focusedIndex < navigation.length) {
      navRefs.current[focusedIndex]?.focus()
    } else if (focusedIndex === navigation.length) {
      logoutRef.current?.focus()
    }
  }, [focusedIndex])

  // Prevent hydration mismatch
  if (!mounted || status === 'loading') {
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

  // Si estamos en login, no aplicar este layout
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!session || !session?.user) {
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
      <aside 
        className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : ''}`}
        role="navigation"
        aria-label="Navegación principal"
        onKeyDown={handleNavKeyDown}
      >
        {/* Header gubernamental del sidebar */}
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <Image
              src="/ayuntamientoB.png"
              alt="Ayuntamiento de Atlixco"
              width={180}
              height={60}
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="admin-sidebar-close"
            aria-label="Cerrar menú de navegación"
          >
            <X className="close-icon" />
          </button>
        </div>

        {/* Navegación principal por grupos */}
        <nav className="admin-navigation" role="menubar">
          {navigationGroups.map((group, groupIndex) => {
            // Calcular el índice base para keyboard navigation
            const baseIndex = navigationGroups
              .slice(0, groupIndex)
              .reduce((acc, g) => acc + g.items.length, 0)

            return (
              <div key={group.title} className="admin-nav-section">
                <h3 className="admin-nav-header" id={`nav-heading-${groupIndex}`}>
                  {group.title}
                </h3>
                <div className="admin-nav-items" role="group" aria-labelledby={`nav-heading-${groupIndex}`}>
                  {group.items.map((item, itemIndex) => {
                    const globalIndex = baseIndex + itemIndex
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        ref={el => navRefs.current[globalIndex] = el}
                        className={`admin-nav-item ${isActive ? 'admin-nav-item-active' : ''}`}
                        onClick={() => setSidebarOpen(false)}
                        role="menuitem"
                        tabIndex={focusedIndex === globalIndex ? 0 : -1}
                        aria-current={isActive ? 'page' : undefined}
                        onFocus={() => setFocusedIndex(globalIndex)}
                      >
                        <div className="admin-nav-icon" aria-hidden="true">
                          <item.icon className="nav-icon" />
                        </div>
                        <span className="admin-nav-text">{item.name}</span>
                        {isActive && <ChevronRight className="admin-nav-arrow" aria-hidden="true" />}
                        <div className="admin-nav-glow"></div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>

        {/* Sección de usuario */}
        <div className="admin-user-section">
          <div className="admin-user-info">
            <div className="admin-user-avatar" aria-hidden="true">
              <span className="user-initial">
                {session?.user?.name?.charAt(0) || 'A'}
              </span>
              <div className="admin-user-status"></div>
            </div>
            <div className="admin-user-details">
              <p className="admin-user-name">{session?.user?.name}</p>
              <p className="admin-user-email">{session?.user?.email}</p>
              <p className="admin-user-role">Administrador del Sistema</p>
            </div>
          </div>
          <button
            ref={logoutRef}
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="admin-logout-button"
            tabIndex={focusedIndex === navigation.length ? 0 : -1}
            onFocus={() => setFocusedIndex(navigation.length)}
            aria-label="Cerrar sesión del sistema"
          >
            <LogOut className="logout-icon" aria-hidden="true" />
            <span>Cerrar Sesión Segura</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="admin-main-content">
        {/* Barra superior gubernamental */}
        <header className="admin-top-bar" role="banner">
          <div className="admin-top-bar-left">
            <button
              onClick={() => setSidebarOpen(true)}
              className="admin-menu-button"
              aria-label="Abrir menú de navegación"
              aria-expanded={sidebarOpen}
              aria-controls="admin-sidebar"
            >
              <Menu className="menu-icon" />
            </button>
            <nav className="admin-breadcrumb" aria-label="Breadcrumb">
              <div className="breadcrumb-shield" aria-hidden="true">
                <Shield className="breadcrumb-icon" />
              </div>
              <h1 className="admin-page-title">
                {navigation.find(item => item.href === pathname)?.name || 'Panel Administrativo'}
              </h1>
            </nav>
          </div>
          
          <div className="admin-top-bar-right">
            <div className="admin-system-status" role="status" aria-live="polite">
              <div className="system-status-indicator" aria-hidden="true"></div>
              <span className="system-status-text">SISTEMA OPERATIVO</span>
            </div>
            <NotificationPanel />
            <div className="admin-user-avatar-small" aria-hidden="true">
              <span className="user-initial-small">
                {session?.user?.name?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="admin-page-content" role="main">
          <div className="admin-content-wrapper">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}