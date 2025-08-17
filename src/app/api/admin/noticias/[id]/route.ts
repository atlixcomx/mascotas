import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const noticia = await prisma.noticia.findUnique({
      where: { id: params.id }
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

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    
    const dataToUpdate: any = {}
    
    if (body.titulo !== undefined) dataToUpdate.titulo = body.titulo
    if (body.resumen !== undefined) dataToUpdate.resumen = body.resumen
    if (body.contenido !== undefined) dataToUpdate.contenido = body.contenido
    if (body.imagen !== undefined) dataToUpdate.imagen = body.imagen
    if (body.categoria !== undefined) dataToUpdate.categoria = body.categoria
    if (body.ubicacion !== undefined) dataToUpdate.ubicacion = body.ubicacion
    if (body.hora !== undefined) dataToUpdate.hora = body.hora
    if (body.aforo !== undefined) dataToUpdate.aforo = body.aforo
    if (body.publicada !== undefined) dataToUpdate.publicada = body.publicada
    if (body.destacada !== undefined) dataToUpdate.destacada = body.destacada
    
    const noticia = await prisma.noticia.update({
      where: { id: params.id },
      data: dataToUpdate
    })

    return NextResponse.json({ noticia })
  } catch (error) {
    console.error('Error updating noticia:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await prisma.noticia.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting noticia:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}