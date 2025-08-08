// Analytics simple sin dependencias externas
export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    if (typeof window === 'undefined') return
    
    // En desarrollo, solo log
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event, properties)
      return
    }
    
    // En producción, enviar a tu endpoint
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        properties,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer
      })
    }).catch(() => {
      // Silently fail - no queremos interrumpir la experiencia del usuario
    })
  },
  
  // Eventos predefinidos
  pageView: (page: string) => {
    analytics.track('page_view', { page })
  },
  
  adoptionFormStarted: (perritoId: string) => {
    analytics.track('adoption_form_started', { perritoId })
  },
  
  adoptionFormCompleted: (perritoId: string) => {
    analytics.track('adoption_form_completed', { perritoId })
  },
  
  error: (error: string, context?: any) => {
    analytics.track('error', { error, context })
  }
}