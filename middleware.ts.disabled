import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Verificar si el usuario tiene rol admin
    const token = req.nextauth.token
    
    if (req.nextUrl.pathname.startsWith('/admin') && 
        !req.nextUrl.pathname.startsWith('/admin/login')) {
      
      if (!token || token.role !== 'admin') {
        const loginUrl = new URL('/admin/login', req.url)
        loginUrl.searchParams.set('callbackUrl', req.url)
        return NextResponse.redirect(loginUrl)
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permitir acceso al login sin autenticación
        if (req.nextUrl.pathname === '/admin/login') {
          return true
        }
        
        // Para rutas admin, requerir token
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token
        }
        
        // Permitir otras rutas
        return true
      }
    }
  }
)

export const config = {
  matcher: ['/admin/:path*']
}