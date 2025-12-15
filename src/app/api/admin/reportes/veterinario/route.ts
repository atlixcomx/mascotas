import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Helper para obtener rango de fechas según período
function getDateRange(periodo: string): { desde: Date; hasta: Date } {
  const hasta = new Date()
  const desde = new Date()

  switch (periodo) {
    case 'mes_actual':
      desde.setDate(1)
      desde.setHours(0, 0, 0, 0)
      break
    case 'trimestre':
      desde.setMonth(desde.getMonth() - 3)
      break
    case 'semestre':
      desde.setMonth(desde.getMonth() - 6)
      break
    case 'año':
      desde.setFullYear(desde.getFullYear() - 1)
      break
    default:
      desde.setDate(1)
      desde.setHours(0, 0, 0, 0)
  }

  return { desde, hasta }
}

// Helper para obtener nombre del mes
function getNombreMes(fecha: Date): string {
  return fecha.toLocaleDateString('es-MX', { month: 'short' })
}

// Helper para obtener categoría de edad
function getCategoriaEdad(fechaNacimiento: Date | null): string {
  if (!fechaNacimiento) return 'Sin especificar'

  const hoy = new Date()
  const edad = (hoy.getTime() - fechaNacimiento.getTime()) / (1000 * 60 * 60 * 24 * 365)

  if (edad < 1) return 'Cachorros (0-1 año)'
  if (edad < 3) return 'Jóvenes (1-3 años)'
  if (edad < 7) return 'Adultos (3-7 años)'
  return 'Seniors (7+ años)'
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const periodo = searchParams.get('periodo') || 'mes_actual'

    const { desde, hasta } = getDateRange(periodo)

    // Obtener datos de perritos
    const perritos = await prisma.perrito.findMany({
      select: {
        id: true,
        vacunas: true,
        esterilizado: true,
        desparasitado: true,
        estado: true,
        fechaAdopcion: true,
        fechaIngreso: true,
        createdAt: true
      }
    })

    const totalMascotas = perritos.length

    // Calcular porcentaje de vacunación
    const vacunados = perritos.filter(p => p.vacunas).length
    const vacunacionPorcentaje = totalMascotas > 0
      ? Math.round((vacunados / totalMascotas) * 100)
      : 0

    // Calcular porcentaje de esterilización
    const esterilizados = perritos.filter(p => p.esterilizado).length
    const esterilizacionPorcentaje = totalMascotas > 0
      ? Math.round((esterilizados / totalMascotas) * 100)
      : 0

    // Calcular salud promedio (basado en vacunas, esterilización, desparasitación)
    const calcularSalud = (p: typeof perritos[0]): number => {
      let puntos = 5 // Base
      if (p.vacunas) puntos += 2
      if (p.esterilizado) puntos += 2
      if (p.desparasitado) puntos += 1
      return puntos
    }
    const saludPromedio = totalMascotas > 0
      ? Math.round((perritos.reduce((sum, p) => sum + calcularSalud(p), 0) / totalMascotas) * 10) / 10
      : 0

    // Obtener expedientes médicos en el período
    const expedientes = await prisma.expedienteMedico.findMany({
      where: {
        fecha: {
          gte: desde,
          lte: hasta
        }
      }
    })

    // Contar por tipo
    const vacunasAplicadas = expedientes.filter(e => e.tipo === 'vacuna').length
    const esterilizaciones = expedientes.filter(e => e.tipo === 'cirugia' &&
      (e.descripcion?.toLowerCase().includes('esteriliz') ||
       e.descripcion?.toLowerCase().includes('castra'))).length
    const emergencias = expedientes.filter(e =>
      e.descripcion?.toLowerCase().includes('emergencia') ||
      e.descripcion?.toLowerCase().includes('urgencia')).length
    const totalConsultas = expedientes.length

    // Tratamientos activos
    const tratamientosActivos = await prisma.expedienteMedico.count({
      where: {
        tipo: 'tratamiento',
        OR: [
          { descripcion: { contains: 'activo' } },
          { fechaVencimiento: { gte: new Date() } }
        ]
      }
    })

    // Adopciones en el período
    const adopciones = await prisma.solicitudAdopcion.count({
      where: {
        estado: 'aprobada',
        updatedAt: {
          gte: desde,
          lte: hasta
        }
      }
    })

    // Distribución por edad (usando fechaIngreso como proxy)
    const perritosConFecha = await prisma.perrito.findMany({
      select: {
        fechaIngreso: true
      }
    })

    const distribucionMap = new Map<string, number>()
    const categorias = ['Cachorros (0-1 año)', 'Jóvenes (1-3 años)', 'Adultos (3-7 años)', 'Seniors (7+ años)', 'Sin especificar']
    categorias.forEach(cat => distribucionMap.set(cat, 0))

    perritosConFecha.forEach(p => {
      // Usar fechaIngreso para estimar edad (asumiendo que entran relativamente jóvenes)
      const categoria = getCategoriaEdad(p.fechaIngreso)
      distribucionMap.set(categoria, (distribucionMap.get(categoria) || 0) + 1)
    })

    const distribucionEdad = categorias
      .filter(cat => (distribucionMap.get(cat) || 0) > 0)
      .map(cat => ({
        categoria: cat,
        cantidad: distribucionMap.get(cat) || 0,
        porcentaje: totalMascotas > 0
          ? Math.round(((distribucionMap.get(cat) || 0) / totalMascotas) * 100)
          : 0
      }))

    // Tendencia mensual (últimos 5 meses)
    const tendenciaMensual: Array<{
      mes: string
      consultas: number
      vacunas: number
      emergencias: number
    }> = []

    for (let i = 4; i >= 0; i--) {
      const mesInicio = new Date()
      mesInicio.setMonth(mesInicio.getMonth() - i)
      mesInicio.setDate(1)
      mesInicio.setHours(0, 0, 0, 0)

      const mesFin = new Date(mesInicio)
      mesFin.setMonth(mesFin.getMonth() + 1)
      mesFin.setDate(0)
      mesFin.setHours(23, 59, 59, 999)

      const expedientesMes = await prisma.expedienteMedico.findMany({
        where: {
          fecha: {
            gte: mesInicio,
            lte: mesFin
          }
        }
      })

      tendenciaMensual.push({
        mes: getNombreMes(mesInicio),
        consultas: expedientesMes.length,
        vacunas: expedientesMes.filter(e => e.tipo === 'vacuna').length,
        emergencias: expedientesMes.filter(e =>
          e.descripcion?.toLowerCase().includes('emergencia') ||
          e.descripcion?.toLowerCase().includes('urgencia')).length
      })
    }

    // Formatear nombre del período
    const nombrePeriodo = (() => {
      switch (periodo) {
        case 'mes_actual':
          return new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
        case 'trimestre':
          return 'Último trimestre'
        case 'semestre':
          return 'Último semestre'
        case 'año':
          return 'Último año'
        default:
          return periodo
      }
    })()

    return NextResponse.json({
      reporteActual: {
        periodo: nombrePeriodo,
        totalConsultas,
        vacunasAplicadas,
        esterilizaciones,
        emergencias,
        adopciones
      },
      estadisticas: {
        mascotasTotal: totalMascotas,
        consultasMes: totalConsultas,
        vacunacionPorcentaje,
        esterilizacionPorcentaje,
        saludPromedio,
        tratamientosActivos
      },
      distribucionEdad,
      tendenciaMensual
    })

  } catch (error) {
    console.error('Error fetching reportes:', error)
    return NextResponse.json(
      { error: 'Error al obtener reportes' },
      { status: 500 }
    )
  }
}
