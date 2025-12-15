import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

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
      veterinario,
      veterinariaId,
      vacunaTipo,
      proximaDosis,
      medicamento,
      dosis,
      duracion,
      costo,
      notas
    } = body

    // Validaciones básicas
    if (!perritoId || !tipo || !descripcion) {
      return NextResponse.json(
        { error: 'Campos requeridos: perritoId, tipo, descripcion' },
        { status: 400 }
      )
    }

    const expediente = await prisma.expedienteMedico.create({
      data: {
        perritoId,
        tipo,
        fecha: fecha ? new Date(fecha) : new Date(),
        descripcion,
        veterinario: veterinario || session.user.name,
        veterinariaId: veterinariaId || null,
        vacunaTipo: vacunaTipo || null,
        proximaDosis: proximaDosis ? new Date(proximaDosis) : null,
        medicamento: medicamento || null,
        dosis: dosis || null,
        duracion: duracion || null,
        costo: costo ? parseFloat(costo) : null,
        notas: notas || null
      },
      include: {
        perrito: true,
        veterinaria: true
      }
    })

    // Actualizar estado de vacunación/esterilización/desparasitación si aplica
    if (tipo === 'vacuna' || tipo === 'vacunacion') {
      await prisma.perrito.update({
        where: { id: perritoId },
        data: { vacunas: true }
      })
    } else if (tipo === 'cirugia' && descripcion?.toLowerCase().includes('esteriliz')) {
      await prisma.perrito.update({
        where: { id: perritoId },
        data: { esterilizado: true }
      })
    } else if (tipo === 'desparasitacion') {
      await prisma.perrito.update({
        where: { id: perritoId },
        data: { desparasitado: true }
      })
    }

    // Crear nota en el perrito
    await prisma.notaPerrito.create({
      data: {
        perritoId,
        contenido: `Expediente médico: ${tipo} - ${descripcion.substring(0, 100)}`,
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