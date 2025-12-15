import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Tipos de vacunas estándar
const TIPOS_VACUNA = [
  'Antirrábica',
  'DHPP (Quíntuple)',
  'Parvovirus',
  'Moquillo',
  'Hepatitis',
  'Parainfluenza',
  'Bordetella',
  'Leptospirosis'
]

// GET - Listar vacunaciones con filtros
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const estado = searchParams.get('estado') // pendiente, aplicada, vencida, proxima
    const tipoVacuna = searchParams.get('tipoVacuna')
    const search = searchParams.get('search')
    const pendientesOnly = searchParams.get('pendientes') === 'true'

    const skip = (page - 1) * limit
    const now = new Date()
    const proximaSemana = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const proximo15Dias = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)

    // Construir filtros para ExpedienteMedico
    const where: any = {
      tipo: 'vacuna'
    }

    if (tipoVacuna && tipoVacuna !== 'todas') {
      where.vacunaTipo = tipoVacuna
    }

    if (search) {
      where.perrito = {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { codigo: { contains: search, mode: 'insensitive' } }
        ]
      }
    }

    // Obtener todas las vacunas
    const vacunas = await prisma.expedienteMedico.findMany({
      where,
      include: {
        perrito: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
            fotoPrincipal: true,
            estado: true
          }
        },
        veterinaria: {
          select: {
            id: true,
            nombre: true
          }
        }
      },
      orderBy: [
        { proximaDosis: 'asc' },
        { fecha: 'desc' }
      ]
    })

    // Procesar y clasificar vacunas
    const vacunacionesFormateadas = vacunas.map(vac => {
      let estadoVacuna = 'aplicada'

      if (vac.proximaDosis) {
        const fechaProxima = new Date(vac.proximaDosis)
        if (fechaProxima < now) {
          estadoVacuna = 'vencida'
        } else if (fechaProxima <= proximo15Dias) {
          estadoVacuna = 'proxima'
        } else {
          estadoVacuna = 'aplicada'
        }
      }

      return {
        id: vac.id,
        mascotaId: vac.perritoId,
        mascotaNombre: vac.perrito.nombre,
        mascotaCodigo: vac.perrito.codigo,
        mascotaFoto: vac.perrito.fotoPrincipal,
        mascotaEstado: vac.perrito.estado,
        tipoVacuna: vac.vacunaTipo || 'Sin especificar',
        fechaAplicacion: vac.fecha.toISOString(),
        fechaVencimiento: vac.proximaDosis?.toISOString() || null,
        estado: estadoVacuna,
        lote: vac.notas || null,
        veterinario: vac.veterinario || null,
        veterinaria: vac.veterinaria?.nombre || null,
        costo: vac.costo,
        notas: vac.descripcion
      }
    })

    // Filtrar por estado si se especifica
    let vacunacionesFiltradas = vacunacionesFormateadas
    if (estado && estado !== 'todas') {
      vacunacionesFiltradas = vacunacionesFormateadas.filter(v => v.estado === estado)
    }
    if (pendientesOnly) {
      vacunacionesFiltradas = vacunacionesFormateadas.filter(v =>
        v.estado === 'vencida' || v.estado === 'proxima'
      )
    }

    // Paginar
    const total = vacunacionesFiltradas.length
    const paginadas = vacunacionesFiltradas.slice(skip, skip + limit)

    // Calcular estadísticas
    const stats = {
      totalMascotas: await prisma.perrito.count({ where: { estado: { not: 'adoptado' } } }),
      alDia: vacunacionesFormateadas.filter(v => v.estado === 'aplicada').length,
      pendientes: vacunacionesFormateadas.filter(v => v.estado === 'proxima').length,
      vencidas: vacunacionesFormateadas.filter(v => v.estado === 'vencida').length,
      proximasVencer: vacunacionesFormateadas.filter(v => v.estado === 'proxima').length
    }

    // Agrupar por tipo de vacuna
    const porTipoVacuna: Record<string, number> = {}
    vacunacionesFormateadas.forEach(v => {
      porTipoVacuna[v.tipoVacuna] = (porTipoVacuna[v.tipoVacuna] || 0) + 1
    })

    return NextResponse.json({
      vacunaciones: paginadas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats,
      porTipoVacuna,
      tiposVacuna: TIPOS_VACUNA
    })

  } catch (error) {
    console.error('Error fetching vacunaciones:', error)
    return NextResponse.json(
      { error: 'Error al obtener vacunaciones' },
      { status: 500 }
    )
  }
}

// POST - Registrar nueva vacunación
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      perritoId,
      tipoVacuna,
      fechaAplicacion,
      proximaDosis,
      veterinario,
      veterinariaId,
      lote,
      costo,
      notas
    } = body

    // Validaciones
    if (!perritoId) {
      return NextResponse.json(
        { error: 'El ID del perrito es requerido' },
        { status: 400 }
      )
    }

    if (!tipoVacuna) {
      return NextResponse.json(
        { error: 'El tipo de vacuna es requerido' },
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

    // Crear expediente médico de tipo vacuna
    const vacunacion = await prisma.expedienteMedico.create({
      data: {
        perritoId,
        tipo: 'vacuna',
        vacunaTipo: tipoVacuna,
        descripcion: notas || `Aplicación de vacuna ${tipoVacuna}`,
        fecha: fechaAplicacion ? new Date(fechaAplicacion) : new Date(),
        proximaDosis: proximaDosis ? new Date(proximaDosis) : null,
        veterinario: veterinario || session.user.name || 'Admin',
        veterinariaId: veterinariaId || null,
        notas: lote || null,
        costo: costo ? parseFloat(costo) : null
      },
      include: {
        perrito: {
          select: {
            id: true,
            nombre: true,
            codigo: true
          }
        }
      }
    })

    // Actualizar estado de vacunas del perrito si es necesario
    if (tipoVacuna.toLowerCase().includes('antirr') || tipoVacuna.toLowerCase().includes('rabica')) {
      await prisma.perrito.update({
        where: { id: perritoId },
        data: { vacunas: true }
      })
    }

    return NextResponse.json({
      success: true,
      vacunacion,
      message: `Vacuna ${tipoVacuna} registrada para ${perrito.nombre}`
    })

  } catch (error) {
    console.error('Error creating vacunacion:', error)
    return NextResponse.json(
      { error: 'Error al registrar vacunación' },
      { status: 500 }
    )
  }
}
