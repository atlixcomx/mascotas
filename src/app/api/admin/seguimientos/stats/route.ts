import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Obtener estadísticas de seguimientos
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const now = new Date()
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1)
    const inicioSemana = new Date(now.setDate(now.getDate() - now.getDay()))
    const proximaSemana = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    // Estadísticas generales
    const [
      total,
      pendientes,
      completados,
      vencidos,
      proximosVencer,
      esteMes,
      problemasDetectados
    ] = await Promise.all([
      prisma.seguimientoAdopcion.count(),
      prisma.seguimientoAdopcion.count({ where: { realizado: false } }),
      prisma.seguimientoAdopcion.count({ where: { realizado: true } }),
      prisma.seguimientoAdopcion.count({
        where: {
          realizado: false,
          fecha: { lt: new Date() }
        }
      }),
      prisma.seguimientoAdopcion.count({
        where: {
          realizado: false,
          fecha: {
            gte: new Date(),
            lte: proximaSemana
          }
        }
      }),
      prisma.seguimientoAdopcion.count({
        where: {
          createdAt: { gte: inicioMes }
        }
      }),
      prisma.seguimientoAdopcion.count({
        where: {
          estadoMascota: { in: ['regular', 'preocupante'] }
        }
      })
    ])

    // Por tipo
    const porTipo = await prisma.seguimientoAdopcion.groupBy({
      by: ['tipo'],
      _count: { id: true }
    })

    // Por estado de mascota
    const porEstadoMascota = await prisma.seguimientoAdopcion.groupBy({
      by: ['estadoMascota'],
      where: { estadoMascota: { not: null } },
      _count: { id: true }
    })

    // Seguimientos pendientes próximos (para alertas)
    const proximosPendientes = await prisma.seguimientoAdopcion.findMany({
      where: {
        realizado: false,
        fecha: { lte: proximaSemana }
      },
      include: {
        perrito: {
          select: { nombre: true, codigo: true }
        },
        solicitud: {
          select: { nombre: true, telefono: true }
        }
      },
      orderBy: { fecha: 'asc' },
      take: 10
    })

    // Tasa de cumplimiento (últimos 30 días)
    const hace30Dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const [completadosRecientes, totalRecientes] = await Promise.all([
      prisma.seguimientoAdopcion.count({
        where: {
          fecha: { gte: hace30Dias },
          realizado: true
        }
      }),
      prisma.seguimientoAdopcion.count({
        where: {
          fecha: { gte: hace30Dias }
        }
      })
    ])

    const tasaCumplimiento = totalRecientes > 0
      ? Math.round((completadosRecientes / totalRecientes) * 100)
      : 0

    return NextResponse.json({
      resumen: {
        total,
        pendientes,
        completados,
        vencidos,
        proximosVencer,
        esteMes,
        problemasDetectados,
        tasaCumplimiento
      },
      porTipo: porTipo.reduce((acc, item) => {
        acc[item.tipo] = item._count.id
        return acc
      }, {} as Record<string, number>),
      porEstadoMascota: porEstadoMascota.reduce((acc, item) => {
        if (item.estadoMascota) {
          acc[item.estadoMascota] = item._count.id
        }
        return acc
      }, {} as Record<string, number>),
      alertas: {
        vencidos,
        proximosVencer,
        problemasDetectados
      },
      proximosPendientes: proximosPendientes.map(seg => ({
        id: seg.id,
        tipo: seg.tipo,
        fecha: seg.fecha.toISOString(),
        perrito: seg.perrito.nombre,
        codigo: seg.perrito.codigo,
        adoptante: seg.solicitud?.nombre || 'N/A',
        telefono: seg.solicitud?.telefono || 'N/A',
        diasRestantes: Math.ceil((seg.fecha.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      }))
    })

  } catch (error) {
    console.error('Error fetching seguimientos stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}
