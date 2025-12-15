import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Tipos de eventos
const TIPOS_EVENTO = [
  'feria_adopcion',
  'campana_esterilizacion',
  'jornada_vacunacion',
  'capacitacion',
  'evento_comunitario',
  'otro'
]

// GET - Listar eventos con filtros
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
    const proximos = searchParams.get('proximos') === 'true'

    const skip = (page - 1) * limit
    const now = new Date()

    // Construir filtros
    const where: any = {}

    if (tipo) {
      where.tipo = tipo
    }

    if (estado) {
      where.estado = estado
    }

    if (proximos) {
      where.fecha = { gte: now }
      where.estado = { not: 'cancelado' }
    }

    // Obtener eventos
    const [eventos, total] = await Promise.all([
      prisma.evento.findMany({
        where,
        orderBy: { fecha: proximos ? 'asc' : 'desc' },
        skip,
        take: limit
      }),
      prisma.evento.count({ where })
    ])

    // Estadísticas
    const [
      totalEventos,
      programados,
      completados,
      cancelados,
      totalAdopciones,
      totalAsistentes
    ] = await Promise.all([
      prisma.evento.count(),
      prisma.evento.count({ where: { estado: 'programado' } }),
      prisma.evento.count({ where: { estado: 'completado' } }),
      prisma.evento.count({ where: { estado: 'cancelado' } }),
      prisma.evento.aggregate({ _sum: { adopciones: true } }),
      prisma.evento.aggregate({ _sum: { asistentes: true } })
    ])

    // Formatear eventos
    const eventosFormateados = eventos.map(evento => ({
      id: evento.id,
      nombre: evento.nombre,
      tipo: evento.tipo,
      tipoLabel: getTipoLabel(evento.tipo),
      descripcion: evento.descripcion,
      fecha: evento.fecha.toISOString(),
      horaInicio: evento.horaInicio,
      horaFin: evento.horaFin,
      lugar: evento.lugar,
      direccion: evento.direccion,
      estado: evento.estado,
      asistentes: evento.asistentes || 0,
      adopciones: evento.adopciones || 0,
      perritosIds: evento.perritosIds ? JSON.parse(evento.perritosIds) : [],
      createdAt: evento.createdAt.toISOString(),
      updatedAt: evento.updatedAt.toISOString()
    }))

    return NextResponse.json({
      eventos: eventosFormateados,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        total: totalEventos,
        programados,
        completados,
        cancelados,
        totalAdopciones: totalAdopciones._sum.adopciones || 0,
        totalAsistentes: totalAsistentes._sum.asistentes || 0
      },
      tiposEvento: TIPOS_EVENTO.map(t => ({ value: t, label: getTipoLabel(t) }))
    })

  } catch (error) {
    console.error('Error fetching eventos:', error)
    return NextResponse.json(
      { error: 'Error al obtener eventos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo evento
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      nombre,
      tipo,
      descripcion,
      fecha,
      horaInicio,
      horaFin,
      lugar,
      direccion,
      perritosIds
    } = body

    // Validaciones
    if (!nombre) {
      return NextResponse.json(
        { error: 'El nombre del evento es requerido' },
        { status: 400 }
      )
    }

    if (!fecha) {
      return NextResponse.json(
        { error: 'La fecha del evento es requerida' },
        { status: 400 }
      )
    }

    // Crear evento
    const evento = await prisma.evento.create({
      data: {
        nombre,
        tipo: tipo || 'otro',
        descripcion: descripcion || '',
        fecha: new Date(fecha),
        horaInicio: horaInicio || '09:00',
        horaFin: horaFin || '17:00',
        lugar: lugar || 'Centro Municipal de Adopción',
        direccion: direccion || 'Blvd. Niños Héroes #1003, Atlixco',
        estado: 'programado',
        asistentes: 0,
        adopciones: 0,
        perritosIds: perritosIds ? JSON.stringify(perritosIds) : null
      }
    })

    return NextResponse.json({
      success: true,
      evento: {
        ...evento,
        tipoLabel: getTipoLabel(evento.tipo)
      },
      message: 'Evento creado exitosamente'
    })

  } catch (error) {
    console.error('Error creating evento:', error)
    return NextResponse.json(
      { error: 'Error al crear evento' },
      { status: 500 }
    )
  }
}

// Helper para obtener etiqueta del tipo
function getTipoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    'feria_adopcion': 'Feria de Adopción',
    'campana_esterilizacion': 'Campaña de Esterilización',
    'jornada_vacunacion': 'Jornada de Vacunación',
    'capacitacion': 'Capacitación',
    'evento_comunitario': 'Evento Comunitario',
    'otro': 'Otro'
  }
  return labels[tipo] || tipo
}
