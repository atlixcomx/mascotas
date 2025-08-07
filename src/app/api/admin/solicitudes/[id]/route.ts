import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../../lib/auth'
import { prisma } from '../../../../../../lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const solicitud = await prisma.solicitud.findUnique({
      where: { id: params.id },
      include: {
        perrito: true
      }
    })

    if (!solicitud) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    }

    return NextResponse.json(solicitud)

  } catch (error) {
    console.error('Error fetching solicitud:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      estado,
      notas,
      fechaRevision,
      fechaEntrevista,
      fechaPrueba,
      fechaAdopcion
    } = body

    const solicitud = await prisma.solicitud.update({
      where: { id: params.id },
      data: {
        estado,
        notas,
        fechaRevision: fechaRevision ? new Date(fechaRevision) : undefined,
        fechaEntrevista: fechaEntrevista ? new Date(fechaEntrevista) : undefined,
        fechaAdopcion: fechaAdopcion ? new Date(fechaAdopcion) : undefined
      },
      include: {
        perrito: true
      }
    })

    // Crear notificación según el cambio de estado
    let mensajeNotificacion = ''
    switch (estado) {
      case 'revision':
        mensajeNotificacion = 'Tu solicitud está siendo revisada'
        break
      case 'entrevista':
        mensajeNotificacion = 'Te contactaremos pronto para una entrevista'
        break
      case 'prueba':
        mensajeNotificacion = 'Has sido aprobado para el período de prueba'
        break
      case 'aprobada':
        mensajeNotificacion = '¡Felicidades! Tu solicitud ha sido aprobada'
        break
      case 'rechazada':
        mensajeNotificacion = 'Lo sentimos, tu solicitud no ha sido aprobada'
        break
    }

    if (mensajeNotificacion) {
      // Aquí podrías enviar un email o crear una notificación en la base de datos
      console.log(`Notificación para ${solicitud.email}: ${mensajeNotificacion}`)
    }

    return NextResponse.json({
      success: true,
      solicitud
    })

  } catch (error) {
    console.error('Error updating solicitud:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}