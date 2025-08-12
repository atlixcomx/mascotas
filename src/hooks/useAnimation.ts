import { useState, useEffect, useRef, useCallback } from 'react'

type AnimationType = 
  | 'fadeIn' 
  | 'fadeOut'
  | 'slideInUp' 
  | 'slideInDown'
  | 'slideInLeft'
  | 'slideInRight'
  | 'scaleIn'
  | 'scaleOut'
  | 'bounce'
  | 'shake'
  | 'pulse'

interface UseAnimationOptions {
  duration?: number
  delay?: number
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both'
  iterationCount?: number | 'infinite'
  playOnMount?: boolean
  respectReducedMotion?: boolean
}

export function useAnimation(
  animation: AnimationType,
  options: UseAnimationOptions = {}
) {
  const {
    duration = 300,
    delay = 0,
    easing = 'ease-out',
    fillMode = 'both',
    iterationCount = 1,
    playOnMount = true,
    respectReducedMotion = true
  } = options

  const [isPlaying, setIsPlaying] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const elementRef = useRef<HTMLElement>(null)
  const animationRef = useRef<Animation | null>(null)

  // Detectar preferencia de reduced motion
  const prefersReducedMotion = useRef(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.current = mediaQuery.matches
    
    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Definir keyframes para cada animación
  const getKeyframes = (type: AnimationType): Keyframe[] => {
    const keyframes: Record<AnimationType, Keyframe[]> = {
      fadeIn: [
        { opacity: 0 },
        { opacity: 1 }
      ],
      fadeOut: [
        { opacity: 1 },
        { opacity: 0 }
      ],
      slideInUp: [
        { opacity: 0, transform: 'translateY(30px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      slideInDown: [
        { opacity: 0, transform: 'translateY(-30px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      slideInLeft: [
        { opacity: 0, transform: 'translateX(-30px)' },
        { opacity: 1, transform: 'translateX(0)' }
      ],
      slideInRight: [
        { opacity: 0, transform: 'translateX(30px)' },
        { opacity: 1, transform: 'translateX(0)' }
      ],
      scaleIn: [
        { opacity: 0, transform: 'scale(0.9)' },
        { opacity: 1, transform: 'scale(1)' }
      ],
      scaleOut: [
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(0.9)' }
      ],
      bounce: [
        { transform: 'translateY(0)' },
        { transform: 'translateY(-25%)' },
        { transform: 'translateY(0)' }
      ],
      shake: [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(0)' }
      ],
      pulse: [
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0.8, transform: 'scale(1.05)' },
        { opacity: 1, transform: 'scale(1)' }
      ]
    }
    
    return keyframes[type]
  }

  const play = useCallback(() => {
    if (!elementRef.current) return
    
    // Respetar reduced motion si está habilitado
    if (respectReducedMotion && prefersReducedMotion.current) {
      setHasPlayed(true)
      return
    }

    // Cancelar animación anterior si existe
    if (animationRef.current) {
      animationRef.current.cancel()
    }

    const keyframes = getKeyframes(animation)
    const timing: KeyframeAnimationOptions = {
      duration,
      delay,
      easing,
      fill: fillMode,
      iterations: iterationCount === 'infinite' ? Infinity : iterationCount
    }

    animationRef.current = elementRef.current.animate(keyframes, timing)
    setIsPlaying(true)

    animationRef.current.onfinish = () => {
      setIsPlaying(false)
      setHasPlayed(true)
    }

    animationRef.current.oncancel = () => {
      setIsPlaying(false)
    }
  }, [animation, duration, delay, easing, fillMode, iterationCount, respectReducedMotion])

  const pause = useCallback(() => {
    if (animationRef.current && animationRef.current.playState === 'running') {
      animationRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  const resume = useCallback(() => {
    if (animationRef.current && animationRef.current.playState === 'paused') {
      animationRef.current.play()
      setIsPlaying(true)
    }
  }, [])

  const reset = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.cancel()
      animationRef.current = null
    }
    setIsPlaying(false)
    setHasPlayed(false)
  }, [])

  const reverse = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.reverse()
    }
  }, [])

  // Auto-play en montaje si está habilitado
  useEffect(() => {
    if (playOnMount && elementRef.current) {
      play()
    }
  }, [playOnMount, play])

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.cancel()
      }
    }
  }, [])

  return {
    ref: elementRef,
    play,
    pause,
    resume,
    reset,
    reverse,
    isPlaying,
    hasPlayed,
    animationRef: animationRef.current
  }
}

// Hook para animaciones en scroll
export function useScrollAnimation(
  animation: AnimationType,
  options: UseAnimationOptions & { threshold?: number } = {}
) {
  const { threshold = 0.1, ...animationOptions } = options
  const [isInView, setIsInView] = useState(false)
  const animationHook = useAnimation(animation, {
    ...animationOptions,
    playOnMount: false
  })

  useEffect(() => {
    const element = animationHook.ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animationHook.hasPlayed) {
            setIsInView(true)
            animationHook.play()
          }
        })
      },
      { threshold }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [animationHook, threshold])

  return {
    ...animationHook,
    isInView
  }
}

// Hook para animaciones secuenciales
export function useSequentialAnimation(
  animations: Array<{
    animation: AnimationType
    options?: UseAnimationOptions
  }>
) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const animationRefs = useRef<Animation[]>([])

  const playSequence = useCallback(async () => {
    setIsPlaying(true)
    
    for (let i = 0; i < animations.length; i++) {
      setCurrentIndex(i)
      const { animation, options = {} } = animations[i]
      
      // Crear y ejecutar animación
      await new Promise<void>((resolve) => {
        // Implementación simplificada
        setTimeout(resolve, options.duration || 300)
      })
    }
    
    setIsPlaying(false)
    setCurrentIndex(0)
  }, [animations])

  const stop = useCallback(() => {
    animationRefs.current.forEach(anim => anim.cancel())
    setIsPlaying(false)
    setCurrentIndex(0)
  }, [])

  return {
    playSequence,
    stop,
    isPlaying,
    currentIndex
  }
}

// Hook para animaciones con gestos
export function useGestureAnimation() {
  const [gesture, setGesture] = useState<string | null>(null)
  const animationHook = useAnimation('pulse', { playOnMount: false })

  const triggerGestureAnimation = useCallback((gestureType: string) => {
    setGesture(gestureType)
    
    // Mapear gestos a animaciones
    const gestureAnimations: Record<string, AnimationType> = {
      swipeLeft: 'slideInLeft',
      swipeRight: 'slideInRight',
      tap: 'pulse',
      longPress: 'scaleIn',
      pinch: 'scaleOut'
    }

    if (gestureAnimations[gestureType]) {
      animationHook.play()
    }
  }, [animationHook])

  return {
    ...animationHook,
    gesture,
    triggerGestureAnimation
  }
}