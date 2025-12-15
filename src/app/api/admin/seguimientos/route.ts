import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Listar seguimientos con filtros y paginación
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const tipo = searchParams.get('tipo')
    const estado = searchParams.get('estado')
    const search = searchParams.get('search')
    const pendientes = searchParams.get('pendientes') === 'true'

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}

    if (tipo) {
      where.tipo = tipo
    }

    if (estado) {
      where.realizado = estado === 'completado'
    }

    if (pendientes) {
      where.realizado = false
      where.fecha = {
        lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Próximos 7 días
      }
    }

    if (search) {
      where.OR = [
        { perrito: { nombre: { contains: search, mode: 'insensitive' } } },
        { solicitud: { nombre: { contains: search, mode: 'insensitive' } } },
        { solicitud: { codigo: { contains: search, mode: 'insensitive' } } }
      ]
    }

    // Obtener seguimientos con relaciones
    const [seguimientos, total] = await Promise.all([
      prisma.seguimientoAdopcion.findMany({
        where,
        include: {
          perrito: {
            select: {
              id: true,
              nombre: true,
              codigo: true,
              fotoPrincipal: true,
              raza: true
            }
          },
          solicitud: {
            select: {
              id: true,
              codigo: true,
              nombre: true,
              telefono: true,
              email: true,
              direccion: true,
              ciudad: true,
              fechaAdopcion: true
            }
          }
        },
        orderBy: [
          { realizado: 'asc' },
          { fecha: 'asc' }
        ],
        skip,
        take: limit
      }),
      prisma.seguimientoAdopcion.count({ where })
    ])

    // Calcular métricas
    const [
      totalSeguimientos,
      pendientesCount,
      completadosCount,
      problemasCount
    ] = await Promise.all([
      prisma.seguimientoAdopcion.count(),
      prisma.seguimientoAdopcion.count({ where: { realizado: false } }),
      prisma.seguimientoAdopcion.count({ where: { realizado: true } }),
      prisma.seguimientoAdopcion.count({
        where: {
          estadoMascota: { in: ['regular', 'preocupante'] }
        }
      })
    ])

    // Contar por tipo
    const porTipo = await prisma.seguimientoAdopcion.groupBy({
      by: ['tipo'],
      _count: { id: true }
    })

    const tipoCount = porTipo.reduce((acc, item) => {
      acc[item.tipo] = item._count.id
      return acc
    }, {} as Record<string, number>)

    // Formatear respuesta
    const seguimientosFormateados = seguimientos.map(seg => ({
      id: seg.id,
      folio: `SEG-${seg.id.slice(-6).toUpperCase()}`,
      fechaSeguimiento: seg.fecha.toISOString(),
      tipoSeguimiento: seg.tipo,
      adopcion: seg.solicitud ? {
        id: seg.solicitud.id,
        folio: seg.solicitud.codigo,
        fechaAdopcion: seg.solicitud.fechaAdopcion?.toISOString()
      } : null,
      adoptante: seg.solicitud ? {
        nombre: seg.solicitud.nombre,
        telefono: seg.solicitud.telefono,
        email: seg.solicitud.email,
        direccion: `${seg.solicitud.direccion}, ${seg.solicitud.ciudad}`
      } : null,
      mascota: {
        id: seg.perrito.id,
        nombre: seg.perrito.nombre,
        codigo: seg.perrito.codigo,
        foto: seg.perrito.fotoPrincipal,
        raza: seg.perrito.raza
      },
      estado: seg.realizado ? 'completado' :
              seg.estadoMascota === 'preocupante' ? 'problema_detectado' :
              seg.estadoMascota === 'regular' ? 'requiere_atencion' : 'pendiente',
      estadoMascota: seg.estadoMascota || 'bueno',
      observaciones: seg.observaciones || '',
      problemas: seg.respuesta ? [seg.respuesta] : [],
      proximoSeguimiento: seg.proximoContacto?.toISOString(),
      responsable: seg.responsable || 'Sin asignar',
      contactado: seg.contactado,
      fotos: seg.fotos
    }))

    return NextResponse.json({
      seguimientos: seguimientosFormateados,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      metrics: {
        totalSeguimientos,
        seguimientosPendientes: pendientesCount,
        seguimientosCompletados: completadosCount,
        problemasDetectados: problemasCount,
        satisfaccionPromedio: 4.2, // TODO: calcular real
        porTipo: {
          inicial: tipoCount['inicial'] || 0,
          mensual: tipoCount['mensual'] || 0,
          semestral: tipoCount['semestral'] || 0,
          anual: tipoCount['anual'] || 0,
          problema: tipoCount['problema'] || 0
        }
      }
    })

  } catch (error) {
    console.error('Error fetching seguimientos:', error)
    return NextResponse.json(
      { error: 'Error al obtener seguimientos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo seguimiento
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      perritoId,
      solicitudId,
      tipo,
      fecha,
      observaciones,
      responsable
    } = body

    // Validaciones
    if (!perritoId) {
      return NextResponse.json(
        { error: 'El ID del perrito es requerido' },
        { status: 400 }
      )
    }

    if (!tipo) {
      return NextResponse.json(
        { error: 'El tipo de seguimiento es requerido' },
        { status: 400 }
      )
    }

    // Verificar que el perrito existe
    const perrito = await prisma.perrito.findUnique({
      where: { id: perritoId }
    })

    if (!perrito) {
      return NextResponse.json(
        { error: 'El perrito no existe' },
        { status: 404 }
      )
    }

    // Crear seguimiento
    const seguimiento = await prisma.seguimientoAdopcion.create({
      data: {
        perritoId,
        solicitudId: solicitudId || null,
        tipo,
        fecha: fecha ? new Date(fecha) : new Date(),
        realizado: false,
        observaciones: observaciones || null,
        responsable: responsable || session.user.name || 'Admin'
      },
      include: {
        perrito: {
          select: {
            id: true,
            nombre: true,
            codigo: true
          }
        },
        solicitud: {
          select: {
            id: true,
            codigo: true,
            nombre: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      seguimiento,
      message: 'Seguimiento creado exitosamente'
    })

  } catch (error) {
    console.error('Error creating seguimiento:', error)
    return NextResponse.json(
      { error: 'Error al crear seguimiento' },
      { status: 500 }
    )
  }
}
