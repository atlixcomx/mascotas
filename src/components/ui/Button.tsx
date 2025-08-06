'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  className,
  style,
  ...props
}: ButtonProps) {
  const getVariantStyles = () => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
      borderRadius: '6px',
      transition: 'all 0.2s ease',
      border: 'none',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      textDecoration: 'none',
      outline: 'none',
      position: 'relative' as const,
      opacity: disabled || isLoading ? 0.6 : 1,
    }

    const variants = {
      primary: {
        backgroundColor: '#af1731',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        ':hover': {
          backgroundColor: '#840f31',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
        },
        ':focus': {
          boxShadow: '0 0 0 3px rgba(175, 23, 49, 0.3)'
        }
      },
      secondary: {
        border: '2px solid #c79b66',
        color: '#840f31',
        backgroundColor: 'transparent',
        ':hover': {
          backgroundColor: '#c79b66',
          color: 'white',
          borderColor: '#c79b66'
        },
        ':focus': {
          boxShadow: '0 0 0 3px rgba(199, 155, 102, 0.3)'
        }
      },
      danger: {
        backgroundColor: '#dc2626',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        ':hover': {
          backgroundColor: '#b91c1c',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
        },
        ':focus': {
          boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.3)'
        }
      },
      outline: {
        border: '2px solid #af1731',
        color: '#af1731',
        backgroundColor: 'transparent',
        ':hover': {
          backgroundColor: '#af1731',
          color: 'white'
        },
        ':focus': {
          boxShadow: '0 0 0 3px rgba(175, 23, 49, 0.3)'
        }
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '#0e312d',
        ':hover': {
          backgroundColor: 'rgba(175, 23, 49, 0.1)',
          color: '#af1731'
        },
        ':focus': {
          boxShadow: '0 0 0 3px rgba(175, 23, 49, 0.3)'
        }
      }
    }

    return { ...baseStyles, ...variants[variant] }
  }

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        padding: '8px 16px',
        fontSize: '14px',
        gap: '6px'
      },
      md: {
        padding: '12px 24px',
        fontSize: '16px',
        gap: '8px'
      },
      lg: {
        padding: '16px 32px',
        fontSize: '18px',
        gap: '10px'
      }
    }

    return sizes[size]
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) {
      e.preventDefault()
      return
    }
    props.onClick?.(e)
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return
    
    const button = e.currentTarget
    const variantStyles = getVariantStyles()
    const hoverStyles = (variantStyles as any)[':hover']
    
    if (hoverStyles) {
      Object.assign(button.style, hoverStyles)
    }
    
    props.onMouseEnter?.(e)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return
    
    const button = e.currentTarget
    const variantStyles = getVariantStyles()
    
    // Reset to base styles
    Object.assign(button.style, {
      ...variantStyles,
      ...getSizeStyles(),
      transform: 'none'
    })
    
    props.onMouseLeave?.(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return
    
    const button = e.currentTarget
    const variantStyles = getVariantStyles()
    const focusStyles = (variantStyles as any)[':focus']
    
    if (focusStyles) {
      Object.assign(button.style, focusStyles)
    }
    
    props.onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    const variantStyles = getVariantStyles()
    
    // Reset focus styles
    Object.assign(button.style, {
      ...variantStyles,
      ...getSizeStyles()
    })
    
    props.onBlur?.(e)
  }

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style
      }}
      className={className}
      aria-label={props['aria-label'] || (typeof children === 'string' ? children : undefined)}
      aria-disabled={disabled || isLoading}
    >
      {isLoading && (
        <div
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderRadius: '50%',
            borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite',
            marginRight: children ? '8px' : '0'
          }}
        />
      )}
      {leftIcon && !isLoading && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {leftIcon}
        </span>
      )}
      {children}
      {rightIcon && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {rightIcon}
        </span>
      )}
    </button>
  )
}

// Añadir keyframes para la animación de loading
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `
  document.head.appendChild(styleSheet)
}