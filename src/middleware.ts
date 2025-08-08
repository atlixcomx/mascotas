import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Clonar la respuesta para poder modificar los headers
  const response = NextResponse.next()
  
  // CORS headers para API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Configurar CORS solo para rutas API
    const origin = request.headers.get('origin')
    const allowedOrigins = [
      process.env.NEXTAUTH_URL || 'http://localhost:3000',
      'https://atlixco.vercel.app', // Tu dominio de producción
      'https://adopciones-atlixco.vercel.app' // Otro posible dominio
    ].filter(Boolean)
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '86400')
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers })
    }
  }
  
  // Security headers para todas las rutas
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.vercel-insights.com https://va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https: http:;
    font-src 'self' data:;
    connect-src 'self' https://api.uploadthing.com https://uploadthing.com wss://uploadthing.com https://*.vercel-insights.com;
    media-src 'self';
    object-src 'none';
    child-src 'self';
    frame-src 'self';
    worker-src 'self' blob:;
    form-action 'self';
    base-uri 'self';
    manifest-src 'self';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()
  
  response.headers.set('Content-Security-Policy', cspHeader)
  
  // Strict Transport Security (solo en producción)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
  
  return response
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    // Ejecutar en todas las rutas excepto las estáticas
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}