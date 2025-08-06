'use client'

import { ReactNode, HTMLAttributes } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Calendar, MapPin } from 'lucide-react'
import Button from './Button'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  children: ReactNode
}

export interface PerritoCardProps {
  perrito: {
    id: string
    nombre: string
    raza: string
    edad: string
    sexo: string
    tamano: string
    energia: string
    estado: 'disponible' | 'proceso' | 'adoptado'
    aptoNinos: boolean
    fotoPrincipal: string
    slug: string
    fechaIngreso?: string
    ubicacion?: string
    esNuevo?: boolean
    destacado?: boolean
    descripcionCorta?: string
  }
  onFavoriteToggle?: (perritoId: string) => void
  isFavorite?: boolean
  showFavoriteButton?: boolean
  size?: 'sm' | 'md' | 'lg'
}

// Componente Card base
export default function Card({
  variant = 'default',
  padding = 'md',
  children,
  className,
  style,
  ...props
}: CardProps) {
  const getVariantStyles = () => {
    const baseStyles = {
      backgroundColor: 'white',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      overflow: 'hidden' as const,
    }

    const variants = {
      default: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        ':hover': {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          transform: 'translateY(-2px)'
        }
      },
      elevated: {
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        ':hover': {
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          transform: 'translateY(-4px)'
        }
      },
      outlined: {
        border: '1px solid #e5e7eb',
        boxShadow: 'none',
        ':hover': {
          borderColor: '#af1731',
          boxShadow: '0 4px 6px -1px rgba(175, 23, 49, 0.1)'
        }
      },
      flat: {
        boxShadow: 'none',
        ':hover': {
          backgroundColor: '#f9fafb'
        }
      }
    }

    return { ...baseStyles, ...variants[variant] }
  }

  const getPaddingStyles = () => {
    const paddings = {
      none: { padding: '0' },
      sm: { padding: '12px' },
      md: { padding: '16px' },
      lg: { padding: '24px' }
    }

    return paddings[padding]
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const variantStyles = getVariantStyles()
    const hoverStyles = (variantStyles as any)[':hover']
    
    if (hoverStyles && !card.dataset.noHover) {
      Object.assign(card.style, hoverStyles)
    }
    
    props.onMouseEnter?.(e)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const variantStyles = getVariantStyles()
    
    // Reset to base styles
    Object.assign(card.style, {
      ...variantStyles,
      ...getPaddingStyles(),
      transform: 'none'
    })
    
    props.onMouseLeave?.(e)
  }

  return (
    <div
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...getVariantStyles(),
        ...getPaddingStyles(),
        ...style
      }}
      className={className}
    >
      {children}
    </div>
  )
}

// Componente especializado para cards de perritos
export function PerritoCard({
  perrito,
  onFavoriteToggle,
  isFavorite = false,
  showFavoriteButton = true,
  size = 'md'
}: PerritoCardProps) {
  const getSizeStyles = () => {
    const sizes = {
      sm: {
        imageHeight: '160px',
        titleSize: '16px',
        textSize: '12px',
        padding: '12px',
        buttonPadding: '8px 12px',
        buttonFontSize: '12px'
      },
      md: {
        imageHeight: '192px',
        titleSize: '18px',
        textSize: '14px',
        padding: '16px',
        buttonPadding: '12px 16px',
        buttonFontSize: '14px'
      },
      lg: {
        imageHeight: '224px',
        titleSize: '20px',
        textSize: '16px',
        padding: '20px',
        buttonPadding: '14px 20px',
        buttonFontSize: '16px'
      }
    }

    return sizes[size]
  }

  const sizeStyles = getSizeStyles()

  const getEstadoStyles = (estado: string) => {
    const estados = {
      disponible: {
        backgroundColor: 'rgba(61, 155, 132, 0.1)',
        color: '#246257',
        border: '1px solid rgba(61, 155, 132, 0.3)'
      },
      proceso: {
        backgroundColor: 'rgba(199, 155, 102, 0.1)',
        color: '#8b6638',
        border: '1px solid rgba(199, 155, 102, 0.3)'
      },
      adoptado: {
        backgroundColor: 'rgba(178, 178, 177, 0.1)',
        color: '#4a4a4a',
        border: '1px solid rgba(178, 178, 177, 0.3)'
      }
    }

    return estados[estado as keyof typeof estados] || estados.disponible
  }

  return (
    <Card padding="none" className="perrito-card">
      <div style={{ position: 'relative' }}>
        <Image
          src={perrito.fotoPrincipal}
          alt={`${perrito.nombre} - ${perrito.raza}`}
          width={400}
          height={300}
          style={{
            width: '100%',
            height: sizeStyles.imageHeight,
            objectFit: 'cover',
            transition: 'transform 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        />
        
        {/* Badges */}
        <div style={{ 
          position: 'absolute', 
          top: '8px', 
          left: '8px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '4px'
        }}>
          {perrito.esNuevo && (
            <span style={{
              backgroundColor: '#af1731',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              Nuevo
            </span>
          )}
          {perrito.destacado && (
            <span style={{
              backgroundColor: '#eab308',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              ⭐ Destacado
            </span>
          )}
        </div>

        {/* Botón favorito */}
        {showFavoriteButton && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onFavoriteToggle?.(perrito.id)
            }}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              padding: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'white'
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
            aria-label={isFavorite ? `Quitar ${perrito.nombre} de favoritos` : `Agregar ${perrito.nombre} a favoritos`}
          >
            <Heart
              style={{
                width: '16px',
                height: '16px',
                color: isFavorite ? '#ef4444' : '#666',
                fill: isFavorite ? '#ef4444' : 'none',
                transition: 'all 0.2s'
              }}
            />
          </button>
        )}
      </div>

      <div style={{ padding: sizeStyles.padding }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          marginBottom: '8px'
        }}>
          <h3 style={{ 
            fontWeight: '600', 
            fontSize: sizeStyles.titleSize, 
            color: '#1a1a1a',
            margin: 0,
            lineHeight: '1.2'
          }}>
            {perrito.nombre}
          </h3>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
            ...getEstadoStyles(perrito.estado)
          }}>
            {perrito.estado}
          </span>
        </div>

        <p style={{ 
          color: '#666', 
          fontSize: sizeStyles.textSize, 
          marginBottom: '12px',
          margin: '0 0 12px 0',
          lineHeight: '1.4'
        }}>
          {perrito.raza} • {perrito.sexo} • {perrito.edad}
        </p>

        {perrito.descripcionCorta && (
          <p style={{ 
            color: '#666', 
            fontSize: sizeStyles.textSize, 
            marginBottom: '12px',
            margin: '0 0 12px 0',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {perrito.descripcionCorta}
          </p>
        )}

        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '4px', 
          marginBottom: '12px'
        }}>
          <span style={{
            padding: '4px 8px',
            backgroundColor: '#f1f1f1',
            color: '#4a4a4a',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            {perrito.tamano}
          </span>
          <span style={{
            padding: '4px 8px',
            backgroundColor: '#f1f1f1',
            color: '#4a4a4a',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            Energía {perrito.energia}
          </span>
          {perrito.aptoNinos && (
            <span style={{
              padding: '4px 8px',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              color: '#15803d',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
              ✓ Niños
            </span>
          )}
        </div>

        {/* Info adicional */}
        {(perrito.fechaIngreso || perrito.ubicacion) && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
            fontSize: '12px',
            color: '#666'
          }}>
            {perrito.fechaIngreso && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar style={{ width: '12px', height: '12px' }} />
                <span>Ingreso: {perrito.fechaIngreso}</span>
              </div>
            )}
            {perrito.ubicacion && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin style={{ width: '12px', height: '12px' }} />
                <span>{perrito.ubicacion}</span>
              </div>
            )}
          </div>
        )}

        <Link href={`/perritos/${perrito.slug}`} passHref>
          <Button 
            variant="primary" 
            size={size === 'sm' ? 'sm' : 'md'}
            className="perrito-card-button"
            style={{ 
              width: '100%',
              fontSize: sizeStyles.buttonFontSize,
              padding: sizeStyles.buttonPadding,
              minHeight: '44px'
            }}
            aria-label={`Ver detalles de ${perrito.nombre}`}
          >
            Ver Detalles
          </Button>
        </Link>
      </div>

      {/* Estilos responsive para el PerritoCard */}
      <style jsx>{`
        :global(.perrito-card-button) {
          transition: all 0.2s ease;
          touch-action: manipulation;
        }

        :global(.perrito-card-button):active {
          transform: scale(0.98);
        }

        /* Móvil */
        @media (max-width: 768px) {
          :global(.perrito-card-button) {
            min-height: 48px !important;
            font-size: 14px !important;
            padding: 12px 16px !important;
            font-weight: 600 !important;
          }
        }

        /* Móvil pequeño */
        @media (max-width: 480px) {
          :global(.perrito-card-button) {
            min-height: 50px !important;
            font-size: 15px !important;
            padding: 14px 18px !important;
          }
        }

        /* Touch optimizations */
        @media (hover: none) and (pointer: coarse) {
          :global(.perrito-card-button) {
            min-height: 48px !important;
            padding: 14px 20px !important;
          }
        }
      `}</style>
    </Card>
  )
}