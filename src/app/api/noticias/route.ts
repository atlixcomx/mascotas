import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const noticias = await prisma.noticia.findMany({
      where: { publicada: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ noticias })
  } catch (error) {
    console.error('Error fetching public noticias:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}