'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  ariaLabel?: string
  ariaDescribedBy?: string
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      loadingText = 'Cargando...',
      icon,
      iconPosition = 'left',
      fullWidth = false,
      ariaLabel,
      ariaDescribedBy,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      relative inline-flex items-center justify-center
      font-medium transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      touch-target
    `

    const variants = {
      primary: `
        bg-puebla-primary text-white
        hover:bg-puebla-secondary active:bg-burgundy
        focus:ring-puebla-primary
      `,
      secondary: `
        bg-gray-200 text-gray-900
        hover:bg-gray-300 active:bg-gray-400
        focus:ring-gray-500
      `,
      danger: `
        bg-red-600 text-white
        hover:bg-red-700 active:bg-red-800
        focus:ring-red-500
      `,
      outline: `
        border-2 border-puebla-primary text-puebla-primary
        hover:bg-puebla-primary hover:text-white
        active:bg-puebla-secondary active:border-puebla-secondary
        focus:ring-puebla-primary
      `,
      ghost: `
        text-gray-700 hover:bg-gray-100
        active:bg-gray-200 focus:ring-gray-500
      `
    }

    const sizes = {
      sm: 'min-h-[36px] px-3 py-1.5 text-sm gap-1.5',
      md: 'min-h-[44px] px-4 py-2 text-base gap-2',
      lg: 'min-h-[52px] px-6 py-3 text-lg gap-2.5'
    }

    const widthClass = fullWidth ? 'w-full' : ''

    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )

    const content = loading ? (
      <>
        <LoadingSpinner />
        <span className="ml-2">{loadingText}</span>
      </>
    ) : (
      <>
        {icon && iconPosition === 'left' && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        <span>{children}</span>
        {icon && iconPosition === 'right' && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
      </>
    )

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          widthClass,
          className
        )}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {content}
      </button>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'

// Ejemplo de uso con mejores prácticas
export const ButtonExamples = () => {
  return (
    <div className="space-y-4">
      {/* Botón con loading state */}
      <AccessibleButton
        loading={true}
        loadingText="Guardando cambios..."
        ariaLabel="Guardar formulario de adopción"
      >
        Guardar
      </AccessibleButton>

      {/* Botón con icono y descripción */}
      <AccessibleButton
        icon={<span>🐕</span>}
        ariaLabel="Ver lista de perritos disponibles"
        ariaDescribedBy="perritos-description"
      >
        Ver Perritos
      </AccessibleButton>
      <span id="perritos-description" className="sr-only">
        Muestra todos los perritos disponibles para adopción
      </span>

      {/* Botón de acción peligrosa */}
      <AccessibleButton
        variant="danger"
        ariaLabel="Eliminar solicitud de adopción"
        onClick={() => {
          if (confirm('¿Estás seguro de eliminar esta solicitud?')) {
            // Acción
          }
        }}
      >
        Eliminar Solicitud
      </AccessibleButton>
    </div>
  )
}