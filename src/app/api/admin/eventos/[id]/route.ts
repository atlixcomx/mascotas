import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Obtener detalle de un evento
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const resolvedParams = context.params instanceof Promise
      ? await context.params
      : context.params
    const { id } = resolvedParams

    const evento = await prisma.evento.findUnique({
      where: { id }
    })

    if (!evento) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    // Obtener perritos asociados si hay
    let perritos = []
    if (evento.perritosIds) {
      const perritosIds = JSON.parse(evento.perritosIds)
      if (perritosIds.length > 0) {
        perritos = await prisma.perrito.findMany({
          where: { id: { in: perritosIds } },
          select: {
            id: true,
            nombre: true,
            codigo: true,
            fotoPrincipal: true,
            estado: true
          }
        })
      }
    }

    return NextResponse.json({
      ...evento,
      fecha: evento.fecha.toISOString(),
      perritosIds: evento.perritosIds ? JSON.parse(evento.perritosIds) : [],
      perritos,
      createdAt: evento.createdAt.toISOString(),
      updatedAt: evento.updatedAt.toISOString()
    })

  } catch (error) {
    console.error('Error fetching evento:', error)
    return NextResponse.json(
      { error: 'Error al obtener evento' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar evento
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const resolvedParams = context.params instanceof Promise
      ? await context.params
      : context.params
    const { id } = resolvedParams

    const body = await request.json()
    const {
      nombre,
      tipo,
      descripcion,
      fecha,
      horaInicio,
      horaFin,
      lugar,
      direccion,
      estado,
      asistentes,
      adopciones,
      perritosIds
    } = body

    // Verificar que existe
    const eventoActual = await prisma.evento.findUnique({
      where: { id }
    })

    if (!eventoActual) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    // Actualizar
    const evento = await prisma.evento.update({
      where: { id },
      data: {
        nombre: nombre || eventoActual.nombre,
        tipo: tipo || eventoActual.tipo,
        descripcion: descripcion !== undefined ? descripcion : eventoActual.descripcion,
        fecha: fecha ? new Date(fecha) : eventoActual.fecha,
        horaInicio: horaInicio || eventoActual.horaInicio,
        horaFin: horaFin || eventoActual.horaFin,
        lugar: lugar || eventoActual.lugar,
        direccion: direccion || eventoActual.direccion,
        estado: estado || eventoActual.estado,
        asistentes: asistentes !== undefined ? asistentes : eventoActual.asistentes,
        adopciones: adopciones !== undefined ? adopciones : eventoActual.adopciones,
        perritosIds: perritosIds !== undefined ? JSON.stringify(perritosIds) : eventoActual.perritosIds
      }
    })

    return NextResponse.json({
      success: true,
      evento,
      message: 'Evento actualizado exitosamente'
    })

  } catch (error) {
    console.error('Error updating evento:', error)
    return NextResponse.json(
      { error: 'Error al actualizar evento' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar evento
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const resolvedParams = context.params instanceof Promise
      ? await context.params
      : context.params
    const { id } = resolvedParams

    // Verificar que existe
    const evento = await prisma.evento.findUnique({
      where: { id }
    })

    if (!evento) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    // Eliminar
    await prisma.evento.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Evento eliminado exitosamente'
    })

  } catch (error) {
    console.error('Error deleting evento:', error)
    return NextResponse.json(
      { error: 'Error al eliminar evento' },
      { status: 500 }
    )
  }
}
