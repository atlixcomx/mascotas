import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Obtener detalle de una cita
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

    const cita = await prisma.citaVeterinaria.findUnique({
      where: { id },
      include: {
        perrito: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
            fotoPrincipal: true,
            edad: true,
            sexo: true,
            raza: true,
            adoptanteNombre: true,
            adoptanteTelefono: true,
            vacunas: true,
            esterilizado: true
          }
        }
      }
    })

    if (!cita) {
      return NextResponse.json(
        { error: 'Cita no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: cita.id,
      fecha: cita.fecha.toISOString().split('T')[0],
      hora: cita.hora,
      motivo: cita.motivo,
      descripcion: cita.descripcion,
      estado: cita.estado,
      veterinario: cita.veterinario,
      duenio: cita.duenio,
      telefono: cita.telefono,
      notas: cita.notas,
      perrito: cita.perrito,
      createdAt: cita.createdAt.toISOString(),
      updatedAt: cita.updatedAt.toISOString()
    })

  } catch (error) {
    console.error('Error fetching cita:', error)
    return NextResponse.json(
      { error: 'Error al obtener cita' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar cita
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
      fecha,
      hora,
      motivo,
      descripcion,
      estado,
      veterinario,
      duenio,
      telefono,
      notas
    } = body

    // Verificar que existe
    const citaActual = await prisma.citaVeterinaria.findUnique({
      where: { id }
    })

    if (!citaActual) {
      return NextResponse.json(
        { error: 'Cita no encontrada' },
        { status: 404 }
      )
    }

    // Actualizar
    const cita = await prisma.citaVeterinaria.update({
      where: { id },
      data: {
        fecha: fecha ? new Date(fecha) : citaActual.fecha,
        hora: hora || citaActual.hora,
        motivo: motivo || citaActual.motivo,
        descripcion: descripcion !== undefined ? descripcion : citaActual.descripcion,
        estado: estado || citaActual.estado,
        veterinario: veterinario !== undefined ? veterinario : citaActual.veterinario,
        duenio: duenio !== undefined ? duenio : citaActual.duenio,
        telefono: telefono !== undefined ? telefono : citaActual.telefono,
        notas: notas !== undefined ? notas : citaActual.notas
      },
      include: {
        perrito: {
          select: {
            nombre: true,
            codigo: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      cita,
      message: 'Cita actualizada exitosamente'
    })

  } catch (error) {
    console.error('Error updating cita:', error)
    return NextResponse.json(
      { error: 'Error al actualizar cita' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar cita
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
    const cita = await prisma.citaVeterinaria.findUnique({
      where: { id }
    })

    if (!cita) {
      return NextResponse.json(
        { error: 'Cita no encontrada' },
        { status: 404 }
      )
    }

    // Eliminar
    await prisma.citaVeterinaria.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Cita eliminada exitosamente'
    })

  } catch (error) {
    console.error('Error deleting cita:', error)
    return NextResponse.json(
      { error: 'Error al eliminar cita' },
      { status: 500 }
    )
  }
}
