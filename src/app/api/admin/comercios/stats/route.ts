import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Obtener estadísticas reales de los comercios
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener estadísticas reales de la base de datos
    const comercios = await prisma.comercio.findMany({
      select: {
        id: true,
        codigo: true,
        nombre: true,
        qrEscaneos: true,
        conversiones: true,
        _count: {
          select: {
            qrScans: true
          }
        }
      },
      orderBy: { codigo: 'asc' }
    })

    // También obtener el total de escaneos desde la tabla QrScan para verificar consistencia
    const totalScansFromTable = await prisma.qrScan.count()

    return NextResponse.json({
      comercios,
      totalScansFromTable,
      message: 'Estadísticas reales desde la base de datos'
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}

// POST - Resetear estadísticas (solo para desarrollo/testing)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { action, comercioId } = body

    if (action === 'reset_all') {
      // Resetear todas las estadísticas
      await prisma.qrScan.deleteMany({})
      await prisma.comercio.updateMany({
        data: {
          qrEscaneos: 0,
          conversiones: 0
        }
      })
      
      return NextResponse.json({ 
        message: 'Todas las estadísticas han sido reseteadas',
        resetAll: true
      })
    }

    if (action === 'reset_comercio' && comercioId) {
      // Resetear estadísticas de un comercio específico
      await prisma.qrScan.deleteMany({
        where: { comercioId }
      })
      await prisma.comercio.update({
        where: { id: comercioId },
        data: {
          qrEscaneos: 0,
          conversiones: 0
        }
      })
      
      return NextResponse.json({ 
        message: 'Estadísticas del comercio reseteadas',
        comercioId
      })
    }

    return NextResponse.json(
      { error: 'Acción no válida' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error resetting stats:', error)
    return NextResponse.json(
      { error: 'Error al resetear estadísticas' },
      { status: 500 }
    )
  }
}