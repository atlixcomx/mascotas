import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { EmailService } from '../../../../src/lib/email'
import { sendNotificationToAdmins } from '../../../../src/lib/notifications'
import { addActivityEvent, broadcastActivityEvent } from '../../../../src/lib/metrics'

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

    // Enviar email de confirmación
    await EmailService.sendSolicitudRecibida({
      email: solicitud.email,
      nombreSolicitante: solicitud.nombre,
      nombrePerrito: solicitud.perrito.nombre,
      codigo: solicitud.codigo
    })

    // Enviar notificación en tiempo real a administradores
    sendNotificationToAdmins({
      type: 'solicitud_nueva',
      title: `Nueva solicitud: ${solicitud.codigo}`,
      message: `${solicitud.nombre} quiere adoptar a ${solicitud.perrito.nombre}`,
      solicitudId: solicitud.id,
      data: {
        perrito: solicitud.perrito.nombre,
        solicitante: solicitud.nombre,
        origen: origenQR ? `QR ${origenQR}` : 'Web directa'
      }
    })

    // Registrar evento de actividad
    const activityEvent = {
      tipo: 'solicitud_nueva' as const,
      descripcion: `Nueva solicitud de ${solicitud.nombre} para adoptar a ${solicitud.perrito.nombre}`,
      usuario: solicitud.nombre,
      metadata: {
        solicitudId: solicitud.id,
        codigo: solicitud.codigo,
        perritoId: solicitud.perritoId
      }
    }
    addActivityEvent(activityEvent)
    broadcastActivityEvent({
      ...activityEvent,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    })

    // Notificar al admin por email
    if (process.env.ADMIN_EMAIL) {
      await EmailService.send({
        to: process.env.ADMIN_EMAIL,
        subject: `Nueva solicitud de adopción - ${solicitud.codigo}`,
        html: `
          <h2>Nueva solicitud de adopción</h2>
          <p><strong>Código:</strong> ${solicitud.codigo}</p>
          <p><strong>Perrito:</strong> ${solicitud.perrito.nombre}</p>
          <p><strong>Solicitante:</strong> ${solicitud.nombre}</p>
          <p><strong>Email:</strong> ${solicitud.email}</p>
          <p><strong>Teléfono:</strong> ${solicitud.telefono}</p>
          <p><strong>Ciudad:</strong> ${solicitud.ciudad}</p>
          <p><strong>Origen:</strong> ${origenQR ? `QR ${origenQR}` : 'Web directa'}</p>
          <p><a href="${process.env.NEXTAUTH_URL}/admin/solicitudes/${solicitud.id}">Ver solicitud</a></p>
        `
      })
    }

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