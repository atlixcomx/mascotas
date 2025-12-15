// Configuración centralizada de navegación
export interface NavigationItem {
  id: string
  label: string
  href: string
  iconName?: 'home' | 'dog' | 'store' | 'newspaper'
  highlight?: boolean
  external?: boolean
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Inicio',
    href: '/',
    iconName: 'home'
  },
  {
    id: 'catalog',
    label: 'Catálogo Adopción',
    href: '/catalogo',
    iconName: 'dog',
    highlight: true // CTA principal
  },
  {
    id: 'pet-friendly',
    label: 'Comercios Friendly',
    href: '/comercios-friendly',
    iconName: 'store'
  },
  {
    id: 'news',
    label: 'Noticias',
    href: '/noticias',
    iconName: 'newspaper'
  }
]

// Configuración de estilos del header
export const headerConfig = {
  height: {
    desktop: 72,
    mobile: 64
  },
  logo: {
    desktop: { width: 140, height: 48 },
    mobile: { width: 120, height: 40 }
  },
  breakpoint: 768,
  animation: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
}