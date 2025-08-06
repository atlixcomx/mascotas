import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/db'

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const solicitud = await prisma.solicitud.findUnique({
      where: { id: params.id },
      include: {
        perrito: {
          select: {
            nombre: true,
            fotoPrincipal: true,
            raza: true,
            edad: true,
            slug: true
          }
        },
        notas: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!solicitud) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      )
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

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    const { estado, motivoRechazo, notas } = body

    const solicitud = await prisma.solicitud.findUnique({
      where: { id: params.id }
    })

    if (!solicitud) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      )
    }

    // Actualizar solicitud
    const updatedSolicitud = await prisma.solicitud.update({
      where: { id: params.id },
      data: {
        estado: estado || solicitud.estado,
        motivoRechazo: motivoRechazo || solicitud.motivoRechazo,
        updatedAt: new Date()
      },
      include: {
        perrito: {
          select: {
            nombre: true,
            fotoPrincipal: true,
            raza: true,
            edad: true
          }
        }
      }
    })

    // Si se proporciona una nota, crearla
    if (notas) {
      await prisma.notaSolicitud.create({
        data: {
          solicitudId: params.id,
          contenido: notas,
          autor: 'Admin', // TODO: obtener del usuario autenticado
          tipo: 'interna'
        }
      })
    }

    // Si la solicitud fue aprobada, cambiar estado del perrito
    if (estado === 'aprobada') {
      await prisma.perrito.update({
        where: { id: solicitud.perritoId },
        data: { estado: 'adoptado' }
      })
    }

    // TODO: Enviar email de notificación del cambio de estado
    // await enviarEmailCambioEstado(updatedSolicitud, estado)

    return NextResponse.json(updatedSolicitud)

  } catch (error) {
    console.error('Error updating solicitud:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}