import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const noticias = await prisma.noticia.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ noticias })
  } catch (error) {
    console.error('Error fetching noticias:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    
    const noticia = await prisma.noticia.create({
      data: {
        titulo: body.titulo,
        resumen: body.resumen,
        contenido: body.contenido,
        imagen: body.imagen,
        categoria: body.categoria,
        ubicacion: body.ubicacion || null,
        hora: body.hora || null,
        aforo: body.aforo || null,
        autor: body.autor || session.user.name || 'Admin',
        publicada: body.publicada ?? true,
        destacada: body.destacada ?? false
      }
    })

    return NextResponse.json({ noticia })
  } catch (error) {
    console.error('Error creating noticia:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}