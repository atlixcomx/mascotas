import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '../../../../../../../lib/db'

interface Actividad {
  id: string
  tipo: 'estado' | 'comentario' | 'nota' | 'documento' | 'email'
  descripcion: string
  usuario: string
  fecha: string
  detalles?: any
}

// GET - Obtener historial de actividades
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener la solicitud con su historial
    const solicitud = await prisma.solicitud.findUnique({
      where: { id: params.id },
      include: {
        perrito: true,
        notas: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!solicitud) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    }

    // Construir historial de actividades basado en las fechas disponibles
    const actividades: Actividad[] = []

    // Solicitud creada
    actividades.push({
      id: `created-${solicitud.id}`,
      tipo: 'estado',
      descripcion: 'Solicitud recibida',
      usuario: solicitud.nombre,
      fecha: solicitud.createdAt.toISOString(),
      detalles: {
        estado: 'nueva',
        perrito: solicitud.perrito.nombre
      }
    })

    // Cambios de estado basados en fechas
    if (solicitud.fechaRevision) {
      actividades.push({
        id: `revision-${solicitud.id}`,
        tipo: 'estado',
        descripcion: 'Estado cambiado a En Revisión',
        usuario: 'Sistema',
        fecha: solicitud.fechaRevision.toISOString(),
        detalles: {
          estadoAnterior: 'nueva',
          estadoNuevo: 'revision'
        }
      })
    }

    if (solicitud.fechaEntrevista) {
      actividades.push({
        id: `entrevista-${solicitud.id}`,
        tipo: 'estado',
        descripcion: 'Entrevista programada',
        usuario: 'Sistema',
        fecha: solicitud.fechaEntrevista.toISOString(),
        detalles: {
          estadoAnterior: 'revision',
          estadoNuevo: 'entrevista'
        }
      })
    }

    if (solicitud.fechaPrueba) {
      actividades.push({
        id: `prueba-${solicitud.id}`,
        tipo: 'estado',
        descripcion: 'Período de prueba iniciado',
        usuario: 'Sistema',
        fecha: solicitud.fechaPrueba.toISOString(),
        detalles: {
          estadoAnterior: 'entrevista',
          estadoNuevo: 'prueba'
        }
      })
    }

    if (solicitud.fechaAdopcion) {
      actividades.push({
        id: `adopcion-${solicitud.id}`,
        tipo: 'estado',
        descripcion: 'Adopción completada',
        usuario: 'Sistema',
        fecha: solicitud.fechaAdopcion.toISOString(),
        detalles: {
          estadoAnterior: 'prueba',
          estadoNuevo: 'aprobada'
        }
      })
    }

    // Agregar todas las notas como actividades
    if (solicitud.notas && solicitud.notas.length > 0) {
      solicitud.notas.forEach((nota) => {
        actividades.push({
          id: nota.id,
          tipo: nota.tipo === 'cambio_estado' ? 'nota' : 'comentario' as any,
          descripcion: nota.tipo === 'cambio_estado' ? 'Nota agregada' : 'Comentario agregado',
          usuario: nota.autor,
          fecha: nota.createdAt.toISOString(),
          detalles: {
            contenido: nota.contenido
          }
        })
      })
    }

    // Simular algunas actividades de email
    if (solicitud.estado !== 'nueva') {
      actividades.push({
        id: `email-${solicitud.id}-1`,
        tipo: 'email',
        descripcion: 'Email de confirmación enviado',
        usuario: 'Sistema',
        fecha: solicitud.createdAt.toISOString(),
        detalles: {
          destinatario: solicitud.email,
          asunto: 'Solicitud recibida'
        }
      })
    }

    // Ordenar por fecha descendente
    actividades.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

    return NextResponse.json(actividades)

  } catch (error) {
    console.error('Error fetching actividades:', error)
    return NextResponse.json(
      { error: 'Error al obtener actividades' },
      { status: 500 }
    )
  }
}