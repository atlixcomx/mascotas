'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void>
  threshold?: number
  className?: string
}

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  className = ''
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      setTouchStart(e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStart || containerRef.current?.scrollTop !== 0) return

    const touchY = e.touches[0].clientY
    const distance = touchY - touchStart

    if (distance > 0) {
      e.preventDefault()
      // Aplicar resistencia al pull
      const adjustedDistance = Math.min(distance * 0.5, threshold * 1.5)
      setPullDistance(adjustedDistance)

      // Aplicar transformación visual
      if (contentRef.current) {
        contentRef.current.style.transform = `translateY(${adjustedDistance}px)`
      }
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      
      // Mantener el indicador visible durante el refresh
      if (contentRef.current) {
        contentRef.current.style.transition = 'transform 0.2s ease-out'
        contentRef.current.style.transform = `translateY(${threshold}px)`
      }

      try {
        await onRefresh()
      } catch (error) {
        console.error('Error during refresh:', error)
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
        
        // Resetear la posición
        if (contentRef.current) {
          contentRef.current.style.transform = 'translateY(0)'
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.style.transition = ''
            }
          }, 200)
        }
      }
    } else {
      // Regresar a la posición original
      setPullDistance(0)
      if (contentRef.current) {
        contentRef.current.style.transition = 'transform 0.2s ease-out'
        contentRef.current.style.transform = 'translateY(0)'
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.style.transition = ''
          }
        }, 200)
      }
    }
    
    setTouchStart(0)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [touchStart, pullDistance, isRefreshing])

  const pullPercentage = Math.min((pullDistance / threshold) * 100, 100)
  const iconRotation = pullPercentage * 1.8 // 180 grados al 100%

  return (
    <div ref={containerRef} className={`relative overflow-auto ${className}`}>
      {/* Indicador de Pull to Refresh */}
      <div
        className="absolute top-0 left-0 right-0 flex justify-center items-center pointer-events-none"
        style={{
          height: `${pullDistance}px`,
          opacity: pullDistance > 20 ? 1 : 0,
          transition: 'opacity 0.2s'
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <div
            className={`w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{
              transform: `rotate(${iconRotation}deg)`,
              transition: isRefreshing ? 'none' : 'transform 0.1s'
            }}
          >
            <svg
              className="w-6 h-6 text-puebla-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          
          <p className="mt-2 text-sm text-gray-600">
            {isRefreshing
              ? 'Actualizando...'
              : pullDistance >= threshold
              ? 'Suelta para actualizar'
              : 'Desliza hacia abajo para actualizar'}
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div ref={contentRef} className="relative bg-white">
        {children}
      </div>
    </div>
  )
}

// Componente de lista optimizada para móvil
interface MobileListItem {
  id: string
  title: string
  subtitle?: string
  image?: string
  badge?: string
}

interface MobileOptimizedListProps {
  items: MobileListItem[]
  onItemClick?: (item: MobileListItem) => void
  onRefresh?: () => Promise<void>
  loading?: boolean
  emptyMessage?: string
}

export function MobileOptimizedList({
  items,
  onItemClick,
  onRefresh,
  loading = false,
  emptyMessage = 'No hay elementos para mostrar'
}: MobileOptimizedListProps) {
  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh()
    }
  }

  const ListContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-puebla-primary" />
        </div>
      )
    }

    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p>{emptyMessage}</p>
        </div>
      )
    }

    return (
      <ul className="divide-y divide-gray-200">
        {items.map((item) => (
          <li
            key={item.id}
            className="relative touch-manipulation"
          >
            <button
              onClick={() => onItemClick?.(item)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              style={{ minHeight: '60px' }} // Touch target mínimo
            >
              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  loading="lazy"
                />
              )}
              
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-900 line-clamp-1">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {item.subtitle}
                  </p>
                )}
              </div>

              {item.badge && (
                <span className="flex-shrink-0 px-2 py-1 text-xs font-medium bg-puebla-primary text-white rounded-full">
                  {item.badge}
                </span>
              )}

              <svg
                className="w-5 h-5 text-gray-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    )
  }

  if (onRefresh) {
    return (
      <PullToRefresh onRefresh={handleRefresh} className="h-full">
        <ListContent />
      </PullToRefresh>
    )
  }

  return <ListContent />
}