import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

// Función para generar código único ADPX-XXXX
function generateSolicitudCode(): string {
  const timestamp = Date.now().toString().slice(-4)
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
  return `ADPX-${timestamp}${random}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      perritoId,
      nombre,
      edad,
      telefono,
      email,
      direccion,
      ciudad,
      codigoPostal,
      tipoVivienda,
      tienePatio,
      experiencia,
      otrasMascotas,
      motivoAdopcion,
      origenQR
    } = body

    // Validar que el perrito existe y está disponible
    const perrito = await prisma.perrito.findUnique({
      where: { id: perritoId }
    })

    if (!perrito) {
      return NextResponse.json(
        { error: 'Perrito no encontrado' },
        { status: 404 }
      )
    }

    if (perrito.estado !== 'disponible') {
      return NextResponse.json(
        { error: 'Este perrito ya no está disponible para adopción' },
        { status: 400 }
      )
    }

    // Verificar si ya existe una solicitud activa para este perrito y email
    const solicitudExistente = await prisma.solicitud.findFirst({
      where: {
        perritoId,
        email,
        estado: {
          in: ['nueva', 'revision', 'entrevista', 'prueba']
        }
      }
    })

    if (solicitudExistente) {
      return NextResponse.json(
        { error: 'Ya tienes una solicitud activa para este perrito' },
        { status: 400 }
      )
    }

    // Generar código único
    let codigo: string
    let codigoExists: boolean
    do {
      codigo = generateSolicitudCode()
      const existingCode = await prisma.solicitud.findUnique({
        where: { codigo }
      })
      codigoExists = !!existingCode
    } while (codigoExists)

    // Crear la solicitud
    const solicitud = await prisma.solicitud.create({
      data: {
        codigo,
        perritoId,
        nombre,
        edad: parseInt(edad),
        telefono,
        email,
        direccion,
        ciudad,
        codigoPostal,
        tipoVivienda,
        tienePatio,
        experiencia,
        otrasMascotas: otrasMascotas || '',
        motivoAdopcion,
        origenQR: origenQR || null,
        estado: 'nueva'
      },
      include: {
        perrito: {
          select: {
            nombre: true,
            fotoPrincipal: true,
            raza: true,
            edad: true
          }
        }
      }
    })

    // Crear nota inicial
    await prisma.notaSolicitud.create({
      data: {
        solicitudId: solicitud.id,
        contenido: `Solicitud creada. Origen: ${origenQR ? `QR ${origenQR}` : 'Web directa'}`,
        autor: 'Sistema',
        tipo: 'interna'
      }
    })

    // Cambiar estado del perrito a "proceso" si es la primera solicitud
    const solicitudesCount = await prisma.solicitud.count({
      where: {
        perritoId,
        estado: {
          in: ['nueva', 'revision', 'entrevista', 'prueba']
        }
      }
    })

    if (solicitudesCount === 1) {
      await prisma.perrito.update({
        where: { id: perritoId },
        data: { estado: 'proceso' }
      })
    }

    // TODO: Enviar email de confirmación (cuando se configure Resend)
    // await enviarEmailConfirmacion(solicitud)
    
    // TODO: Notificar al admin por email
    // await notificarAdminNuevaSolicitud(solicitud)

    return NextResponse.json({
      success: true,
      solicitud: {
        id: solicitud.id,
        codigo: solicitud.codigo,
        perrito: solicitud.perrito,
        estado: solicitud.estado,
        createdAt: solicitud.createdAt
      },
      message: `¡Solicitud enviada exitosamente! Tu código de seguimiento es: ${codigo}`
    })

  } catch (error) {
    console.error('Error creating solicitud:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const estado = searchParams.get('estado') || ''
    const perritoId = searchParams.get('perritoId') || ''
    
    const where: any = {}
    
    if (estado) {
      where.estado = estado
    }
    
    if (perritoId) {
      where.perritoId = perritoId
    }

    const skip = (page - 1) * limit

    const [solicitudes, total] = await Promise.all([
      prisma.solicitud.findMany({
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
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit,
      }),
      prisma.solicitud.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      solicitudes,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Error fetching solicitudes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}