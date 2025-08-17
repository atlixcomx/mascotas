import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const noticia = await prisma.noticia.findUnique({
      where: { 
        id: params.id,
        publicada: true
      }
    })

    if (!noticia) {
      return NextResponse.json({ error: 'Noticia no encontrada' }, { status: 404 })
    }

    // Incrementar vistas
    await prisma.noticia.update({
      where: { id: params.id },
      data: { vistas: { increment: 1 } }
    })

    return NextResponse.json({ noticia })
  } catch (error) {
    console.error('Error fetching noticia:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}