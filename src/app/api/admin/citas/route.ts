import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Listar citas con filtros
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const fecha = searchParams.get('fecha')
    const estado = searchParams.get('estado')
    const perritoId = searchParams.get('perritoId')
    const desde = searchParams.get('desde')
    const hasta = searchParams.get('hasta')

    // Construir filtros
    const where: any = {}

    if (fecha) {
      // Filtrar por fecha específica
      const fechaInicio = new Date(fecha)
      fechaInicio.setHours(0, 0, 0, 0)
      const fechaFin = new Date(fecha)
      fechaFin.setHours(23, 59, 59, 999)
      where.fecha = {
        gte: fechaInicio,
        lte: fechaFin
      }
    } else if (desde || hasta) {
      where.fecha = {}
      if (desde) {
        where.fecha.gte = new Date(desde)
      }
      if (hasta) {
        where.fecha.lte = new Date(hasta)
      }
    }

    if (estado && estado !== 'todas') {
      where.estado = estado
    }

    if (perritoId) {
      where.perritoId = perritoId
    }

    // Obtener citas con información del perrito
    const citas = await prisma.citaVeterinaria.findMany({
      where,
      include: {
        perrito: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
            fotoPrincipal: true,
            adoptanteNombre: true,
            adoptanteTelefono: true
          }
        }
      },
      orderBy: [
        { fecha: 'asc' },
        { hora: 'asc' }
      ]
    })

    // Formatear citas
    const citasFormateadas = citas.map(cita => ({
      id: cita.id,
      fecha: cita.fecha.toISOString().split('T')[0],
      hora: cita.hora,
      mascotaId: cita.perritoId,
      mascotaNombre: cita.perrito.nombre,
      mascotaCodigo: cita.perrito.codigo,
      mascotaFoto: cita.perrito.fotoPrincipal,
      duenio: cita.duenio || cita.perrito.adoptanteNombre || 'Sin asignar',
      telefono: cita.telefono || cita.perrito.adoptanteTelefono,
      motivo: cita.motivo,
      descripcion: cita.descripcion,
      estado: cita.estado,
      veterinario: cita.veterinario,
      notas: cita.notas,
      createdAt: cita.createdAt.toISOString(),
      updatedAt: cita.updatedAt.toISOString()
    }))

    // Estadísticas del día actual
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const finHoy = new Date()
    finHoy.setHours(23, 59, 59, 999)

    const [citasHoy, programadas, confirmadas, completadas, canceladas] = await Promise.all([
      prisma.citaVeterinaria.count({
        where: {
          fecha: { gte: hoy, lte: finHoy }
        }
      }),
      prisma.citaVeterinaria.count({ where: { estado: 'programada' } }),
      prisma.citaVeterinaria.count({ where: { estado: 'confirmada' } }),
      prisma.citaVeterinaria.count({ where: { estado: 'completada' } }),
      prisma.citaVeterinaria.count({ where: { estado: 'cancelada' } })
    ])

    return NextResponse.json({
      citas: citasFormateadas,
      stats: {
        citasHoy,
        programadas,
        confirmadas,
        completadas,
        canceladas,
        total: programadas + confirmadas + completadas + canceladas
      }
    })

  } catch (error) {
    console.error('Error fetching citas:', error)
    return NextResponse.json(
      { error: 'Error al obtener citas' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva cita
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      perritoId,
      fecha,
      hora,
      motivo,
      descripcion,
      veterinario,
      duenio,
      telefono,
      notas
    } = body

    // Validaciones
    if (!perritoId) {
      return NextResponse.json(
        { error: 'El perrito es requerido' },
        { status: 400 }
      )
    }

    if (!fecha) {
      return NextResponse.json(
        { error: 'La fecha es requerida' },
        { status: 400 }
      )
    }

    if (!hora) {
      return NextResponse.json(
        { error: 'La hora es requerida' },
        { status: 400 }
      )
    }

    if (!motivo) {
      return NextResponse.json(
        { error: 'El motivo es requerido' },
        { status: 400 }
      )
    }

    // Verificar que el perrito existe
    const perrito = await prisma.perrito.findUnique({
      where: { id: perritoId }
    })

    if (!perrito) {
      return NextResponse.json(
        { error: 'Perrito no encontrado' },
        { status: 404 }
      )
    }

    // Crear la cita
    const cita = await prisma.citaVeterinaria.create({
      data: {
        perritoId,
        fecha: new Date(fecha),
        hora,
        motivo,
        descripcion: descripcion || '',
        estado: 'programada',
        veterinario: veterinario || session.user.name,
        duenio: duenio || perrito.adoptanteNombre,
        telefono: telefono || perrito.adoptanteTelefono,
        notas
      },
      include: {
        perrito: {
          select: {
            nombre: true,
            codigo: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      cita: {
        ...cita,
        mascotaNombre: cita.perrito.nombre,
        mascotaCodigo: cita.perrito.codigo
      },
      message: 'Cita creada exitosamente'
    })

  } catch (error) {
    console.error('Error creating cita:', error)
    return NextResponse.json(
      { error: 'Error al crear cita' },
      { status: 500 }
    )
  }
}
