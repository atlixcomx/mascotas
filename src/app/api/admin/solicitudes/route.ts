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

    if (dias) {
      const diasNum = parseInt(dias)
      where.createdAt = {
        gte: new Date(Date.now() - diasNum * 24 * 60 * 60 * 1000)
      }
    }

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
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ solicitudes })

  } catch (error) {
    console.error('Error fetching solicitudes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}