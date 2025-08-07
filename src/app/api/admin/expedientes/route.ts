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

    const { searchParams } = new URL(request.url)
    const perritoId = searchParams.get('perritoId')
    const tipo = searchParams.get('tipo')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}
    if (perritoId) where.perritoId = perritoId
    if (tipo) where.tipo = tipo

    const skip = (page - 1) * limit

    const [expedientes, total] = await Promise.all([
      prisma.expedienteMedico.findMany({
        where,
        include: {
          perrito: {
            select: {
              id: true,
              nombre: true,
              codigo: true,
              fotoPrincipal: true
            }
          },
          veterinaria: true
        },
        orderBy: { fecha: 'desc' },
        skip,
        take: limit
      }),
      prisma.expedienteMedico.count({ where })
    ])

    return NextResponse.json({
      expedientes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching expedientes:', error)
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
      perritoId,
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

    const expediente = await prisma.expedienteMedico.create({
      data: {
        perritoId,
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

    // Actualizar estado de vacunación/esterilización si aplica
    if (tipo === 'vacunacion') {
      await prisma.perrito.update({
        where: { id: perritoId },
        data: { vacunas: true }
      })
    } else if (tipo === 'esterilizacion') {
      await prisma.perrito.update({
        where: { id: perritoId },
        data: { esterilizado: true }
      })
    }

    // Crear nota en el perrito
    await prisma.notaPerrito.create({
      data: {
        perritoId,
        contenido: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} realizada: ${descripcion}`,
        autor: session.user.name || 'Admin',
        tipo: 'medico'
      }
    })

    return NextResponse.json({
      success: true,
      expediente
    })

  } catch (error) {
    console.error('Error creating expediente:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}