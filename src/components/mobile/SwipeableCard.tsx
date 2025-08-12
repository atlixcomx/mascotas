'use client'

import { useState, useRef, useEffect, TouchEvent } from 'react'

interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  className?: string
  enableHaptic?: boolean
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className = '',
  enableHaptic = true
}: SwipeableCardProps) {
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const triggerHaptic = () => {
    if (enableHaptic && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }
  }

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    setStartX(touch.clientX)
    setStartY(touch.clientY)
    setCurrentX(touch.clientX)
    setCurrentY(touch.clientY)
    setIsDragging(true)
    triggerHaptic()
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return
    
    const touch = e.touches[0]
    setCurrentX(touch.clientX)
    setCurrentY(touch.clientY)

    if (cardRef.current) {
      const deltaX = touch.clientX - startX
      const deltaY = touch.clientY - startY
      
      // Aplicar transformación visual mientras arrastra
      cardRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${deltaX * 0.1}deg)`
      cardRef.current.style.opacity = `${1 - Math.abs(deltaX) / 300}`
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    
    const deltaX = currentX - startX
    const deltaY = currentY - startY
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Determinar la dirección del swipe
    if (absDeltaX > threshold || absDeltaY > threshold) {
      if (absDeltaX > absDeltaY) {
        // Swipe horizontal
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight()
          triggerHaptic()
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft()
          triggerHaptic()
        }
      } else {
        // Swipe vertical
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown()
          triggerHaptic()
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp()
          triggerHaptic()
        }
      }
    }

    // Resetear la posición
    if (cardRef.current) {
      cardRef.current.style.transition = 'all 0.3s ease-out'
      cardRef.current.style.transform = 'translate(0, 0) rotate(0deg)'
      cardRef.current.style.opacity = '1'
      
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transition = ''
        }
      }, 300)
    }

    setIsDragging(false)
  }

  return (
    <div
      ref={cardRef}
      className={`touch-manipulation select-none ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  )
}

// Componente de galería con swipe
interface SwipeableGalleryProps {
  images: Array<{ src: string; alt: string }>
  className?: string
}

export function SwipeableGallery({ images, className = '' }: SwipeableGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(0)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        ref={containerRef}
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>

      {/* Botones de navegación para accesibilidad */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
        disabled={currentIndex === 0}
        aria-label="Imagen anterior"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        onClick={() => setCurrentIndex(Math.min(images.length - 1, currentIndex + 1))}
        disabled={currentIndex === images.length - 1}
        aria-label="Imagen siguiente"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

// Hook para detectar gestos táctiles
export function useTouchGestures() {
  const [gesture, setGesture] = useState<string | null>(null)
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y
      const deltaTime = Date.now() - touchStartRef.current.time

      // Detectar diferentes gestos
      if (deltaTime < 300) {
        if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
          setGesture('tap')
        } else if (Math.abs(deltaX) > 50) {
          setGesture(deltaX > 0 ? 'swipe-right' : 'swipe-left')
        } else if (Math.abs(deltaY) > 50) {
          setGesture(deltaY > 0 ? 'swipe-down' : 'swipe-up')
        }
      }

      touchStartRef.current = null
    }

    document.addEventListener('touchstart', handleTouchStart as any)
    document.addEventListener('touchend', handleTouchEnd as any)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart as any)
      document.removeEventListener('touchend', handleTouchEnd as any)
    }
  }, [])

  return gesture
}