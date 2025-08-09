import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '../../../../../../../lib/db'
import { sendNotificationToAdmins } from '../../../../../../../src/lib/notifications'

// GET - Obtener comentarios de una solicitud
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Por ahora devolvemos un array vacío ya que necesitaríamos actualizar el schema de Prisma
    // En producción, esto consultaría la tabla de comentarios
    const comentarios = []

    return NextResponse.json(comentarios)

  } catch (error) {
    console.error('Error fetching comentarios:', error)
    return NextResponse.json(
      { error: 'Error al obtener comentarios' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo comentario
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { contenido } = body

    if (!contenido || contenido.trim() === '') {
      return NextResponse.json(
        { error: 'El comentario no puede estar vacío' },
        { status: 400 }
      )
    }

    // Verificar que la solicitud existe
    const solicitudExiste = await prisma.solicitud.findUnique({
      where: { id: params.id }
    })

    if (!solicitudExiste) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      )
    }

    // Crear una nueva nota en la solicitud
    const notaCreada = await prisma.notaSolicitud.create({
      data: {
        solicitudId: params.id,
        contenido: contenido.trim(),
        autor: session.user.name || session.user.email || 'Admin',
        tipo: 'comentario'
      }
    })

    // Obtener información de la solicitud para la notificación
    const solicitud = await prisma.solicitud.findUnique({
      where: { id: params.id },
      include: {
        perrito: {
          select: { nombre: true }
        }
      }
    })

    // Enviar notificación en tiempo real (manejar errores sin fallar)
    if (solicitud) {
      try {
        sendNotificationToAdmins({
          type: 'comentario_nuevo',
          title: `Nuevo comentario: ${solicitud.codigo}`,
          message: `${session.user.name || 'Admin'} agregó un comentario a la solicitud de ${solicitud.nombre} para adoptar a ${solicitud.perrito.nombre}`,
          solicitudId: solicitud.id,
          data: {
            autor: session.user.name || 'Admin',
            perrito: solicitud.perrito.nombre,
            solicitante: solicitud.nombre,
            comentario: contenido.substring(0, 100) + (contenido.length > 100 ? '...' : '')
          }
        })
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError)
        // No fallar la operación si la notificación falla
      }
    }

    return NextResponse.json({
      success: true,
      comentario: {
        id: notaCreada.id,
        solicitudId: notaCreada.solicitudId,
        contenido: notaCreada.contenido,
        autor: notaCreada.autor,
        tipo: notaCreada.tipo,
        createdAt: notaCreada.createdAt.toISOString()
      }
    })

  } catch (error) {
    console.error('Error creating comentario - Details:', error)
    
    // Devolver más información sobre el error
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Error al crear comentario',
          details: error.message,
          type: error.name
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error desconocido al crear comentario' },
      { status: 500 }
    )
  }
}