import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Obtener detalle de un seguimiento
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

    const seguimiento = await prisma.seguimientoAdopcion.findUnique({
      where: { id },
      include: {
        perrito: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
            fotoPrincipal: true,
            fotos: true,
            raza: true,
            edad: true,
            sexo: true,
            estado: true,
            fechaAdopcion: true,
            adoptanteNombre: true,
            adoptanteTelefono: true
          }
        },
        solicitud: {
          select: {
            id: true,
            codigo: true,
            nombre: true,
            telefono: true,
            email: true,
            direccion: true,
            ciudad: true,
            codigoPostal: true,
            fechaAdopcion: true,
            estado: true
          }
        }
      }
    })

    if (!seguimiento) {
      return NextResponse.json(
        { error: 'Seguimiento no encontrado' },
        { status: 404 }
      )
    }

    // Obtener historial de seguimientos del mismo perrito
    const historial = await prisma.seguimientoAdopcion.findMany({
      where: {
        perritoId: seguimiento.perritoId,
        id: { not: id }
      },
      orderBy: { fecha: 'desc' },
      take: 5,
      select: {
        id: true,
        tipo: true,
        fecha: true,
        realizado: true,
        estadoMascota: true,
        observaciones: true
      }
    })

    // Formatear respuesta
    const response = {
      id: seguimiento.id,
      folio: `SEG-${seguimiento.id.slice(-6).toUpperCase()}`,
      tipo: seguimiento.tipo,
      fecha: seguimiento.fecha.toISOString(),
      realizado: seguimiento.realizado,
      contactado: seguimiento.contactado,
      estadoMascota: seguimiento.estadoMascota,
      observaciones: seguimiento.observaciones,
      respuesta: seguimiento.respuesta,
      fotos: seguimiento.fotos,
      responsable: seguimiento.responsable,
      proximoContacto: seguimiento.proximoContacto?.toISOString(),
      createdAt: seguimiento.createdAt.toISOString(),
      updatedAt: seguimiento.updatedAt.toISOString(),
      perrito: seguimiento.perrito,
      solicitud: seguimiento.solicitud,
      adoptante: seguimiento.solicitud ? {
        nombre: seguimiento.solicitud.nombre,
        telefono: seguimiento.solicitud.telefono,
        email: seguimiento.solicitud.email,
        direccion: `${seguimiento.solicitud.direccion}, ${seguimiento.solicitud.ciudad} ${seguimiento.solicitud.codigoPostal}`
      } : seguimiento.perrito.adoptanteNombre ? {
        nombre: seguimiento.perrito.adoptanteNombre,
        telefono: seguimiento.perrito.adoptanteTelefono,
        email: null,
        direccion: null
      } : null,
      historial
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error fetching seguimiento:', error)
    return NextResponse.json(
      { error: 'Error al obtener seguimiento' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar seguimiento
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
      realizado,
      contactado,
      estadoMascota,
      observaciones,
      respuesta,
      fotos,
      responsable,
      proximoContacto,
      crearProximoSeguimiento
    } = body

    // Verificar que existe
    const seguimientoActual = await prisma.seguimientoAdopcion.findUnique({
      where: { id },
      include: { perrito: true, solicitud: true }
    })

    if (!seguimientoActual) {
      return NextResponse.json(
        { error: 'Seguimiento no encontrado' },
        { status: 404 }
      )
    }

    // Actualizar seguimiento
    const seguimiento = await prisma.seguimientoAdopcion.update({
      where: { id },
      data: {
        realizado: realizado !== undefined ? realizado : seguimientoActual.realizado,
        contactado: contactado !== undefined ? contactado : seguimientoActual.contactado,
        estadoMascota: estadoMascota || seguimientoActual.estadoMascota,
        observaciones: observaciones !== undefined ? observaciones : seguimientoActual.observaciones,
        respuesta: respuesta !== undefined ? respuesta : seguimientoActual.respuesta,
        fotos: fotos !== undefined ? fotos : seguimientoActual.fotos,
        responsable: responsable || seguimientoActual.responsable,
        proximoContacto: proximoContacto ? new Date(proximoContacto) : seguimientoActual.proximoContacto
      },
      include: {
        perrito: {
          select: {
            id: true,
            nombre: true,
            codigo: true
          }
        },
        solicitud: {
          select: {
            id: true,
            codigo: true,
            nombre: true
          }
        }
      }
    })

    // Si se completa y se solicita crear próximo seguimiento
    if (realizado && crearProximoSeguimiento && proximoContacto) {
      const tipoSiguiente = calcularSiguienteTipo(seguimientoActual.tipo)

      await prisma.seguimientoAdopcion.create({
        data: {
          perritoId: seguimientoActual.perritoId,
          solicitudId: seguimientoActual.solicitudId,
          tipo: tipoSiguiente,
          fecha: new Date(proximoContacto),
          realizado: false,
          responsable: responsable || session.user.name || 'Admin'
        }
      })
    }

    return NextResponse.json({
      success: true,
      seguimiento,
      message: 'Seguimiento actualizado exitosamente'
    })

  } catch (error) {
    console.error('Error updating seguimiento:', error)
    return NextResponse.json(
      { error: 'Error al actualizar seguimiento' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar seguimiento
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
    const seguimiento = await prisma.seguimientoAdopcion.findUnique({
      where: { id }
    })

    if (!seguimiento) {
      return NextResponse.json(
        { error: 'Seguimiento no encontrado' },
        { status: 404 }
      )
    }

    // Eliminar
    await prisma.seguimientoAdopcion.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Seguimiento eliminado exitosamente'
    })

  } catch (error) {
    console.error('Error deleting seguimiento:', error)
    return NextResponse.json(
      { error: 'Error al eliminar seguimiento' },
      { status: 500 }
    )
  }
}

// Helper para calcular el siguiente tipo de seguimiento
function calcularSiguienteTipo(tipoActual: string): string {
  const secuencia: Record<string, string> = {
    'inicial': 'mensual',
    'mensual': 'semestral',
    'semestral': 'anual',
    'anual': 'anual',
    'problema': 'mensual'
  }
  return secuencia[tipoActual] || 'mensual'
}
