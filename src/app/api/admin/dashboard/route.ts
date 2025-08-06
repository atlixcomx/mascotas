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

    const [
      totalPerritos,
      perritosDisponibles,
      perritosEnProceso,
      perritosAdoptados,
      totalSolicitudes,
      solicitudesPendientes,
      solicitudesRecientes,
      adopcionesEsteMes
    ] = await Promise.all([
      // Conteos de perritos
      prisma.perrito.count(),
      prisma.perrito.count({ where: { estado: 'disponible' } }),
      prisma.perrito.count({ where: { estado: 'proceso' } }),
      prisma.perrito.count({ where: { estado: 'adoptado' } }),
      
      // Conteos de solicitudes
      prisma.solicitud.count(),
      prisma.solicitud.count({ where: { estado: { in: ['nueva', 'revision'] } } }),
      
      // Solicitudes recientes (últimos 7 días)
      prisma.solicitud.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
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
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      }),
      
      // Adopciones este mes
      prisma.solicitud.count({
        where: {
          estado: 'aprobada',
          updatedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ])

    return NextResponse.json({
      perritos: {
        total: totalPerritos,
        disponibles: perritosDisponibles,
        enProceso: perritosEnProceso,
        adoptados: perritosAdoptados
      },
      solicitudes: {
        total: totalSolicitudes,
        pendientes: solicitudesPendientes,
        recientes: solicitudesRecientes,
        adopcionesEsteMes
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { 
        perritos: { total: 0, disponibles: 0, enProceso: 0, adoptados: 0 },
        solicitudes: { total: 0, pendientes: 0, recientes: [], adopcionesEsteMes: 0 }
      },
      { status: 200 }
    )
  }
}