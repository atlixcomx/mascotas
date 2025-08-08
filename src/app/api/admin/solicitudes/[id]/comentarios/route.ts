import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../../../lib/auth'
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
    const { contenido, tipo = 'comentario' } = body

    if (!contenido) {
      return NextResponse.json(
        { error: 'El comentario no puede estar vacío' },
        { status: 400 }
      )
    }

    // En producción, esto crearía un nuevo comentario en la base de datos
    // Por ahora simulamos la respuesta
    const nuevoComentario = {
      id: Date.now().toString(),
      solicitudId: params.id,
      usuarioId: session.user.id,
      usuario: {
        nombre: session.user.name,
        email: session.user.email
      },
      contenido,
      tipo,
      createdAt: new Date().toISOString()
    }

    // Obtener información de la solicitud para la notificación
    const solicitud = await prisma.solicitud.findUnique({
      where: { id: params.id },
      include: {
        perrito: {
          select: { nombre: true }
        }
      }
    })

    // Crear una nueva nota en la solicitud
    await prisma.solicitud.update({
      where: { id: params.id },
      data: {
        notas: {
          create: {
            contenido: contenido,
            autor: session.user.name || 'Admin',
            tipo: tipo
          }
        }
      }
    })

    // Enviar notificación en tiempo real (no notificar al usuario que creó el comentario)
    if (solicitud) {
      sendNotificationToAdmins({
        type: 'comentario_nuevo',
        title: `Nuevo comentario: ${solicitud.codigo}`,
        message: `${session.user.name} agregó un comentario a la solicitud de ${solicitud.nombre} para adoptar a ${solicitud.perrito.nombre}`,
        solicitudId: solicitud.id,
        data: {
          autor: session.user.name,
          perrito: solicitud.perrito.nombre,
          solicitante: solicitud.nombre,
          comentario: contenido.substring(0, 100) + (contenido.length > 100 ? '...' : '')
        }
      })
    }

    return NextResponse.json({
      success: true,
      comentario: nuevoComentario
    })

  } catch (error) {
    console.error('Error creating comentario:', error)
    return NextResponse.json(
      { error: 'Error al crear comentario' },
      { status: 500 }
    )
  }
}