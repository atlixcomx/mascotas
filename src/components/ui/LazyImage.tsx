'use client'

import { useState, useRef, useEffect, ImgHTMLAttributes } from 'react'

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  placeholderSrc?: string
  aspectRatio?: '1:1' | '4:3' | '16:9' | '21:9' | 'auto'
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  priority?: boolean
  onLoadComplete?: () => void
  blurDataURL?: string
}

export function LazyImage({
  src,
  alt,
  placeholderSrc,
  aspectRatio = 'auto',
  objectFit = 'cover',
  priority = false,
  onLoadComplete,
  blurDataURL,
  className = '',
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Aspect ratio classes
  const aspectRatioClasses = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-4/3',
    '16:9': 'aspect-video',
    '21:9': 'aspect-[21/9]',
    'auto': ''
  }

  useEffect(() => {
    if (priority) {
      setIsInView(true)
      return
    }

    // Configurar Intersection Observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            // Desconectar una vez que está en vista
            if (observerRef.current && entry.target) {
              observerRef.current.unobserve(entry.target)
            }
          }
        })
      },
      {
        // Cargar imágenes 50px antes de que entren en el viewport
        rootMargin: '50px',
        threshold: 0.01
      }
    )

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [priority])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoadComplete?.()
  }

  const handleError = () => {
    setHasError(true)
  }

  // Placeholder mientras carga
  const placeholderElement = (
    <div
      className={`absolute inset-0 bg-gray-200 ${
        blurDataURL ? 'backdrop-blur-sm' : 'animate-pulse'
      }`}
      style={{
        backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    />
  )

  // Elemento de error
  const errorElement = (
    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
      <div className="text-center p-4">
        <svg
          className="w-12 h-12 text-gray-400 mx-auto mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm text-gray-500">Error al cargar imagen</p>
      </div>
    </div>
  )

  return (
    <div
      className={`relative overflow-hidden ${aspectRatioClasses[aspectRatio]} ${className}`}
    >
      {/* Placeholder o blur mientras carga */}
      {(!isLoaded || hasError) && !priority && placeholderElement}

      {/* Error state */}
      {hasError && errorElement}

      {/* Imagen real */}
      {isInView && !hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`
            w-full h-full
            object-${objectFit}
            transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          {...props}
        />
      )}

      {/* Imagen placeholder de baja calidad si se proporciona */}
      {placeholderSrc && !isLoaded && !hasError && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-${objectFit} blur-sm`}
        />
      )}
    </div>
  )
}

// Hook para precargar imágenes
export function useImagePreloader() {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (loadedImages.has(src)) {
        resolve()
        return
      }

      const img = new Image()
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(src))
        resolve()
      }
      img.onerror = reject
      img.src = src
    })
  }

  const preloadImages = async (srcs: string[]): Promise<void> => {
    await Promise.all(srcs.map(src => preloadImage(src)))
  }

  return { preloadImage, preloadImages, isLoaded: (src: string) => loadedImages.has(src) }
}

// Componente optimizado para galería de imágenes
interface OptimizedImageGalleryProps {
  images: Array<{
    src: string
    alt: string
    thumbnail?: string
  }>
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  onImageClick?: (index: number) => void
}

export function OptimizedImageGallery({
  images,
  columns = 3,
  gap = 'md',
  onImageClick
}: OptimizedImageGalleryProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  }

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4'
  }

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]}`}>
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => onImageClick?.(index)}
          className="relative group cursor-pointer overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-puebla-primary"
          aria-label={`Ver imagen: ${image.alt}`}
        >
          <LazyImage
            src={image.src}
            alt={image.alt}
            placeholderSrc={image.thumbnail}
            aspectRatio="1:1"
            className="transform transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
        </button>
      ))}
    </div>
  )
}

// Utilidad para generar blur data URLs
export async function generateBlurDataURL(imageSrc: string): Promise<string> {
  // Esta es una implementación simplificada
  // En producción, esto se haría en el servidor con sharp o similar
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <filter id="blur">
        <feGaussianBlur stdDeviation="20" />
      </filter>
      <rect width="100%" height="100%" fill="#e5e7eb" filter="url(#blur)" />
    </svg>
  `)}`
}