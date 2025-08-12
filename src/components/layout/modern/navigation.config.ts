// Configuración centralizada de navegación
export interface NavigationItem {
  id: string
  label: string
  href: string
  icon?: string
  highlight?: boolean
  external?: boolean
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Inicio',
    href: '/',
    icon: '🏠'
  },
  {
    id: 'animal-welfare',
    label: 'Bienestar Animal',
    href: '/programa-adopcion',
    icon: '❤️'
  },
  {
    id: 'catalog',
    label: 'Catálogo Adopción',
    href: '/catalogo',
    icon: '🐕',
    highlight: true // CTA principal
  },
  {
    id: 'pet-friendly',
    label: 'Comercios Friendly',
    href: '/comercios-friendly',
    icon: '🏪'
  },
  {
    id: 'news',
    label: 'Noticias',
    href: '/noticias',
    icon: '📰'
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