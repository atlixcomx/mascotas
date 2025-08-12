'use client'

import { useState, useEffect } from 'react'

interface SkipLink {
  id: string
  text: string
  href: string
}

const defaultLinks: SkipLink[] = [
  { id: 'main', text: 'Ir al contenido principal', href: '#main-content' },
  { id: 'nav', text: 'Ir a la navegación', href: '#main-navigation' },
  { id: 'search', text: 'Ir a la búsqueda', href: '#search' },
  { id: 'footer', text: 'Ir al pie de página', href: '#footer' }
]

export function SkipLinks({ links = defaultLinks }: { links?: SkipLink[] }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('skip-link')) {
        setIsVisible(true)
      }
    }

    const handleBlur = () => {
      setIsVisible(false)
    }

    document.addEventListener('focusin', handleFocus)
    document.addEventListener('focusout', handleBlur)

    return () => {
      document.removeEventListener('focusin', handleFocus)
      document.removeEventListener('focusout', handleBlur)
    }
  }, [])

  return (
    <nav
      aria-label="Enlaces de salto"
      className={`
        fixed top-0 left-0 z-50
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        transition-transform duration-200
      `}
    >
      <ul className="bg-puebla-primary text-white p-4 space-x-4 flex">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              className="skip-link underline hover:no-underline focus:bg-white focus:text-puebla-primary px-2 py-1 rounded"
              onClick={(e) => {
                e.preventDefault()
                const target = document.querySelector(link.href)
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' })
                  ;(target as HTMLElement).focus()
                }
              }}
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// Componente para marcar las secciones principales
export function MainContent({ children, id = 'main-content' }: { children: React.ReactNode; id?: string }) {
  return (
    <main
      id={id}
      tabIndex={-1}
      className="focus:outline-none"
      aria-label="Contenido principal"
    >
      {children}
    </main>
  )
}

// Hook para gestionar el foco programáticamente
export function useSkipLinkTarget(id: string) {
  useEffect(() => {
    const element = document.getElementById(id)
    if (element) {
      element.setAttribute('tabindex', '-1')
      element.classList.add('focus:outline-none', 'focus:ring-2', 'focus:ring-puebla-primary')
    }
  }, [id])
}