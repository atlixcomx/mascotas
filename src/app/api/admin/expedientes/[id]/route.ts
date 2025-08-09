import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../../lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const expediente = await prisma.expedienteMedico.findUnique({
      where: { id: params.id },
      include: {
        perrito: true,
        veterinaria: true
      }
    })

    if (!expediente) {
      return NextResponse.json({ error: 'Expediente no encontrado' }, { status: 404 })
    }

    return NextResponse.json(expediente)

  } catch (error) {
    console.error('Error fetching expediente:', error)
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
      tipo,
      fecha,
      descripcion,
      tratamiento,
      medicamentos,
      veterinarioId,
      veterinariaId,
      proximaCita,
      observaciones,
      costo
    } = body

    const expediente = await prisma.expedienteMedico.update({
      where: { id: params.id },
      data: {
        tipo,
        fecha: new Date(fecha),
        descripcion,
        tratamiento,
        medicamentos,
        veterinarioId,
        veterinariaId,
        proximaCita: proximaCita ? new Date(proximaCita) : null,
        observaciones,
        costo: costo ? parseFloat(costo) : null
      },
      include: {
        perrito: true,
        veterinaria: true
      }
    })

    return NextResponse.json({
      success: true,
      expediente
    })

  } catch (error) {
    console.error('Error updating expediente:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await prisma.expedienteMedico.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting expediente:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}