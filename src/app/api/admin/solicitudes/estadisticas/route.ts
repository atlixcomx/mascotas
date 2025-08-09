import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../../lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const periodo = searchParams.get('periodo') || '6meses'
    
    // Calcular fecha de inicio según el periodo
    const now = new Date()
    let startDate = new Date()
    
    switch (periodo) {
      case '1mes':
        startDate.setMonth(now.getMonth() - 1)
        break
      case '3meses':
        startDate.setMonth(now.getMonth() - 3)
        break
      case '6meses':
        startDate.setMonth(now.getMonth() - 6)
        break
      case '1año':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setMonth(now.getMonth() - 6)
    }

    // Obtener todas las solicitudes del periodo
    const solicitudes = await prisma.solicitud.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      include: {
        perrito: {
          select: {
            id: true,
            nombre: true,
            fotoPrincipal: true,
            estado: true
          }
        }
      }
    })

    // Calcular totales
    const totales = {
      total: solicitudes.length,
      aprobadas: solicitudes.filter(s => s.estado === 'aprobada').length,
      rechazadas: solicitudes.filter(s => s.estado === 'rechazada').length,
      enProceso: solicitudes.filter(s => !['aprobada', 'rechazada', 'cancelada'].includes(s.estado)).length,
      tasaAprobacion: 0,
      tiempoPromedio: 0
    }

    // Calcular tasa de aprobación
    const solicitudesFinalizadas = totales.aprobadas + totales.rechazadas
    if (solicitudesFinalizadas > 0) {
      totales.tasaAprobacion = Math.round((totales.aprobadas / solicitudesFinalizadas) * 100)
    }

    // Calcular tiempo promedio de adopción
    const solicitudesAprobadas = solicitudes.filter(s => s.estado === 'aprobada' && s.fechaAdopcion)
    if (solicitudesAprobadas.length > 0) {
      const tiempos = solicitudesAprobadas.map(s => {
        const inicio = new Date(s.createdAt)
        const fin = new Date(s.fechaAdopcion!)
        return Math.floor((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
      })
      totales.tiempoPromedio = Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length)
    }

    // Solicitudes por mes
    const porMes: any[] = []
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date()
      fecha.setMonth(fecha.getMonth() - i)
      const mes = meses[fecha.getMonth()]
      
      const solicitudesMes = solicitudes.filter(s => {
        const fechaSolicitud = new Date(s.createdAt)
        return fechaSolicitud.getMonth() === fecha.getMonth() && 
               fechaSolicitud.getFullYear() === fecha.getFullYear()
      })
      
      porMes.push({
        mes,
        total: solicitudesMes.length,
        aprobadas: solicitudesMes.filter(s => s.estado === 'aprobada').length,
        rechazadas: solicitudesMes.filter(s => s.estado === 'rechazada').length
      })
    }

    // Distribución por estado
    const estados = ['nueva', 'revision', 'entrevista', 'prueba', 'aprobada', 'rechazada', 'cancelada']
    const porEstado = estados.map(estado => {
      const cantidad = solicitudes.filter(s => s.estado === estado).length
      return {
        estado,
        cantidad,
        porcentaje: solicitudes.length > 0 ? Math.round((cantidad / solicitudes.length) * 100) : 0
      }
    }).filter(e => e.cantidad > 0)

    // Perritos más solicitados
    const perritosSolicitudes = new Map<string, any>()
    
    solicitudes.forEach(s => {
      if (s.perrito) {
        const key = s.perrito.id
        if (!perritosSolicitudes.has(key)) {
          perritosSolicitudes.set(key, {
            id: s.perrito.id,
            nombre: s.perrito.nombre,
            fotoPrincipal: s.perrito.fotoPrincipal,
            solicitudes: 0,
            estado: s.perrito.estado
          })
        }
        const perrito = perritosSolicitudes.get(key)
        perrito.solicitudes++
      }
    })
    
    const perritos = Array.from(perritosSolicitudes.values())
      .sort((a, b) => b.solicitudes - a.solicitudes)
      .slice(0, 10)

    // Tendencias
    const mesActual = new Date()
    const mesAnterior = new Date()
    mesAnterior.setMonth(mesAnterior.getMonth() - 1)
    
    const solicitudesEsteMes = solicitudes.filter(s => {
      const fecha = new Date(s.createdAt)
      return fecha.getMonth() === mesActual.getMonth() && 
             fecha.getFullYear() === mesActual.getFullYear()
    }).length
    
    const solicitudesMesAnterior = await prisma.solicitud.count({
      where: {
        createdAt: {
          gte: new Date(mesAnterior.getFullYear(), mesAnterior.getMonth(), 1),
          lt: new Date(mesActual.getFullYear(), mesActual.getMonth(), 1)
        }
      }
    })
    
    let cambio = 0
    let tendencia: 'up' | 'down' | 'stable' = 'stable'
    
    if (solicitudesMesAnterior > 0) {
      cambio = Math.round(((solicitudesEsteMes - solicitudesMesAnterior) / solicitudesMesAnterior) * 100)
      tendencia = cambio > 0 ? 'up' : cambio < 0 ? 'down' : 'stable'
    } else if (solicitudesEsteMes > 0) {
      cambio = 100
      tendencia = 'up'
    }

    return NextResponse.json({
      totales,
      porMes,
      porEstado,
      perritos,
      tendencias: {
        solicitudesEsteMes,
        solicitudesMesAnterior,
        cambio: Math.abs(cambio),
        tendencia
      }
    })

  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}