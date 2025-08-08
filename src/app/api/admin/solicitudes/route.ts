import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../lib/auth'
import { prisma } from '../../../../../lib/db'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const estado = searchParams.get('estado') || ''
    const dias = searchParams.get('dias') || ''
    const fechaInicio = searchParams.get('fechaInicio') || ''
    const fechaFin = searchParams.get('fechaFin') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { codigo: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (estado) {
      where.estado = estado
    }

    // Filtro de fechas - priorizar rango de fechas sobre días
    if (fechaInicio && fechaFin) {
      where.createdAt = {
        gte: new Date(fechaInicio + 'T00:00:00.000Z'),
        lte: new Date(fechaFin + 'T23:59:59.999Z')
      }
    } else if (dias) {
      const diasNum = parseInt(dias)
      where.createdAt = {
        gte: new Date(Date.now() - diasNum * 24 * 60 * 60 * 1000)
      }
    }

    // Calcular offset para paginación
    const skip = (page - 1) * limit

    // Obtener el total de registros para paginación
    const total = await prisma.solicitud.count({ where })

    const solicitudes = await prisma.solicitud.findMany({
      where,
      include: {
        perrito: {
          select: {
            nombre: true,
            fotoPrincipal: true,
            raza: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    return NextResponse.json({ 
      solicitudes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })

  } catch (error) {
    console.error('Error fetching solicitudes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}