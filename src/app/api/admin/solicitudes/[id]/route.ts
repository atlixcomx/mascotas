import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { EmailService } from '@/lib/email'
import { sendNotificationToAdmins } from '@/lib/notifications'
import { addActivityEvent, broadcastActivityEvent } from '@/lib/metrics'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  console.log('=== GET /api/admin/solicitudes/[id] ===')
  console.log('Params received:', context.params)
  try {
    // Handle both Promise and non-Promise params (Next.js 15 compatibility)
    const resolvedParams = context.params instanceof Promise
      ? await context.params
      : context.params
    const { id } = resolvedParams
    console.log('Buscando solicitud con ID:', id)

    const session = await getServerSession(authOptions)
    console.log('Session:', session ? 'existe' : 'no existe', session?.user?.role)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const solicitud = await prisma.solicitud.findUnique({
      where: { id },
      include: {
        perrito: true
      }
    })

    console.log('Solicitud encontrada:', solicitud ? 'sí' : 'no')

    if (!solicitud) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    }

    // Si no tiene perrito asociado, crear un objeto placeholder
    if (!solicitud.perrito) {
      const solicitudConPlaceholder = {
        ...solicitud,
        perrito: {
          id: solicitud.perritoId || 'unknown',
          nombre: 'Perrito no disponible',
          fotoPrincipal: '/placeholder-dog.jpg',
          raza: 'Desconocida',
          edad: 'Desconocida',
          sexo: 'Desconocido',
          tamano: 'Desconocido',
          slug: 'unknown'
        }
      }
      return NextResponse.json(solicitudConPlaceholder)
    }

    return NextResponse.json(solicitud)

  } catch (error) {
    console.error('Error fetching solicitud:', error)
    console.error('Error details:', {
      message: (error as Error).message,
      stack: (error as Error).stack
    })
    return NextResponse.json(
      { error: 'Error interno del servidor', details: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and non-Promise params (Next.js 15 compatibility)
    const resolvedParams = context.params instanceof Promise
      ? await context.params
      : context.params
    const { id } = resolvedParams

    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      estado,
      notas,
      fechaRevision,
      fechaEntrevista,
      fechaPrueba,
      inicioPrueba,
      finPrueba,
      fechaAdopcion,
      copiaIneRecibida,
      copiaComprobanteRecibida
    } = body

    // Obtener la solicitud actual para comparar el estado
    const solicitudActual = await prisma.solicitud.findUnique({
      where: { id },
      include: {
        perrito: true
      }
    })

    if (!solicitudActual) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    }

    // Preparar datos para actualización
    const updateData: any = {
      estado,
      fechaRevision: fechaRevision ? new Date(fechaRevision) : undefined,
      fechaEntrevista: fechaEntrevista ? new Date(fechaEntrevista) : undefined,
      fechaPrueba: fechaPrueba ? new Date(fechaPrueba) : undefined,
      inicioPrueba: inicioPrueba ? new Date(inicioPrueba) : undefined,
      finPrueba: finPrueba ? new Date(finPrueba) : undefined,
      fechaAdopcion: fechaAdopcion ? new Date(fechaAdopcion) : undefined,
      copiaIneRecibida: copiaIneRecibida !== undefined ? copiaIneRecibida : undefined,
      copiaComprobanteRecibida: copiaComprobanteRecibida !== undefined ? copiaComprobanteRecibida : undefined
    }

    // Si se incluyen notas, crear una nueva nota relacionada
    if (notas && notas.trim() !== '') {
      updateData.notas = {
        create: {
          contenido: notas,
          autor: session.user.name || 'Admin',
          tipo: 'cambio_estado'
        }
      }
    }

    // Actualizar la solicitud
    const solicitud = await prisma.solicitud.update({
      where: { id },
      data: updateData,
      include: {
        perrito: true,
        notas: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    // Enviar email y notificación si el estado cambió
    if (solicitudActual.estado !== estado) {
      await EmailService.sendCambioEstado({
        email: solicitud.email,
        nombreSolicitante: solicitud.nombre,
        nombrePerrito: solicitud.perrito.nombre,
        codigo: solicitud.codigo,
        nuevoEstado: estado,
        mensaje: notas && notas.trim() !== '' ? notas : undefined
      })

      // Enviar notificación en tiempo real
      const stateLabels: { [key: string]: string } = {
        'nueva': 'Nueva',
        'revision': 'En Revisión',
        'entrevista': 'Entrevista',
        'prueba': 'Período de Prueba',
        'aprobada': 'Aprobada',
        'rechazada': 'Rechazada'
      }

      sendNotificationToAdmins({
        type: 'estado_cambiado',
        title: `Estado actualizado: ${solicitud.codigo}`,
        message: `La solicitud de ${solicitud.nombre} para adoptar a ${solicitud.perrito.nombre} cambió a "${stateLabels[estado]}"`,
        solicitudId: solicitud.id,
        data: {
          estadoAnterior: solicitudActual.estado,
          estadoNuevo: estado,
          perrito: solicitud.perrito.nombre,
          solicitante: solicitud.nombre
        }
      })

      // Registrar evento de actividad
      const activityEvent = {
        tipo: (estado === 'aprobada' ? 'adopcion_completada' : 'estado_cambiado') as const,
        descripcion: estado === 'aprobada' 
          ? `${solicitud.perrito.nombre} fue adoptado por ${solicitud.nombre}`
          : `Solicitud ${solicitud.codigo} cambió a ${stateLabels[estado]}`,
        usuario: session.user.name || 'Admin',
        metadata: {
          solicitudId: solicitud.id,
          codigo: solicitud.codigo,
          estadoAnterior: solicitudActual.estado,
          estadoNuevo: estado
        }
      }
      addActivityEvent(activityEvent)
      broadcastActivityEvent({
        ...activityEvent,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString()
      })

      // Si se aprueba la adopción, actualizar el estado del perrito y crear seguimiento inicial
      if (estado === 'aprobada') {
        // Actualizar estado del perrito
        await prisma.perrito.update({
          where: { id: solicitud.perritoId },
          data: {
            estado: 'adoptado',
            fechaAdopcion: new Date(),
            adoptanteNombre: solicitud.nombre,
            adoptanteTelefono: solicitud.telefono
          }
        })

        // Crear seguimiento inicial automático (7 días después de la adopción)
        const fechaSeguimientoInicial = new Date()
        fechaSeguimientoInicial.setDate(fechaSeguimientoInicial.getDate() + 7)

        await prisma.seguimientoAdopcion.create({
          data: {
            perritoId: solicitud.perritoId,
            solicitudId: solicitud.id,
            tipo: 'inicial',
            fecha: fechaSeguimientoInicial,
            realizado: false,
            responsable: session.user.name || 'Admin'
          }
        })

        console.log(`Seguimiento inicial creado para ${solicitud.perrito.nombre} - Fecha: ${fechaSeguimientoInicial.toISOString()}`)
      }

      // Notificar al admin
      if (process.env.ADMIN_EMAIL) {
        await EmailService.send({
          to: process.env.ADMIN_EMAIL,
          subject: `Cambio de estado en solicitud ${solicitud.codigo}`,
          html: `
            <h2>Cambio de estado en solicitud</h2>
            <p><strong>Código:</strong> ${solicitud.codigo}</p>
            <p><strong>Perrito:</strong> ${solicitud.perrito.nombre}</p>
            <p><strong>Solicitante:</strong> ${solicitud.nombre}</p>
            <p><strong>Estado anterior:</strong> ${solicitudActual.estado}</p>
            <p><strong>Nuevo estado:</strong> ${estado}</p>
            ${notas && notas.trim() !== '' ? `<p><strong>Notas:</strong> ${notas}</p>` : ''}
            <p><a href="${process.env.NEXTAUTH_URL}/admin/solicitudes/${solicitud.id}">Ver solicitud</a></p>
          `
        })
      }
    }

    return NextResponse.json({
      success: true,
      solicitud
    })

  } catch (error) {
    console.error('Error updating solicitud:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}