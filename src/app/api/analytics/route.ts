import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // En producción, enviar a servicio de analytics
    if (process.env.NODE_ENV === 'production') {
      // Aquí podrías integrar con:
      // - Google Analytics 4
      // - Vercel Analytics (ya está en el proyecto)
      // - Mixpanel, Amplitude, PostHog, etc.
      
      // Por ahora, solo logueamos en producción
      console.log('[Analytics Event]', {
        event: data.event,
        properties: data.properties,
        timestamp: data.timestamp,
        url: data.url,
        referrer: data.referrer
      })
      
      // Si usas Vercel Analytics (recomendado)
      // Ya está integrado automáticamente con el paquete @vercel/analytics
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics error:', error)
    // No queremos que los errores de analytics afecten la experiencia del usuario
    return NextResponse.json({ success: false })
  }
}