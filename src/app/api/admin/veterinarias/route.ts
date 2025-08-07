import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../lib/auth'
import { prisma } from '../../../../../lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const veterinarias = await prisma.veterinaria.findMany({
      orderBy: { nombre: 'asc' }
    })

    return NextResponse.json({ veterinarias })

  } catch (error) {
    console.error('Error fetching veterinarias:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      nombre,
      direccion,
      telefono,
      email,
      servicios,
      horario,
      convenio
    } = body

    const veterinaria = await prisma.veterinaria.create({
      data: {
        nombre,
        direccion,
        telefono,
        email,
        servicios: servicios || [],
        horario,
        convenio: Boolean(convenio)
      }
    })

    return NextResponse.json({
      success: true,
      veterinaria
    })

  } catch (error) {
    console.error('Error creating veterinaria:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}