import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { analytics } from '../../../../../lib/analytics'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { solicitudes } = await request.json()
    
    if (!Array.isArray(solicitudes) || solicitudes.length === 0) {
      return NextResponse.json({ error: 'No se proporcionaron datos válidos' }, { status: 400 })
    }

    let imported = 0
    let errors = []

    for (const solicitud of solicitudes) {
      try {
        // Validar campos requeridos
        if (!solicitud.nombre || !solicitud.email || !solicitud.telefono || !solicitud.perritoNombre) {
          errors.push(`Faltan campos requeridos para: ${solicitud.nombre || 'sin nombre'}`)
          continue
        }

        // Buscar el perrito por nombre
        const perrito = await prisma.perrito.findFirst({
          where: { 
            nombre: {
              equals: solicitud.perritoNombre.trim(),
              mode: 'insensitive'
            }
          }
        })

        if (!perrito) {
          errors.push(`No se encontró el perrito: ${solicitud.perritoNombre}`)
          continue
        }

        // Crear la solicitud
        await prisma.solicitudAdopcion.create({
          data: {
            nombre: solicitud.nombre.trim(),
            email: solicitud.email.trim().toLowerCase(),
            telefono: solicitud.telefono.trim(),
            direccion: solicitud.direccion?.trim() || '',
            ciudad: solicitud.ciudad?.trim() || 'Atlixco',
            codigoPostal: solicitud.codigoPostal?.trim() || '74200',
            perritoId: perrito.id,
            estado: (solicitud.estado?.toLowerCase() || 'nueva') as any,
            fechaSolicitud: solicitud.fecha ? new Date(solicitud.fecha) : new Date(),
            tipoVivienda: 'casa',
            experienciaPerros: 'si',
            otrosAnimales: 'no',
            personasEnCasa: 2,
            razonAdopcion: 'Importado desde CSV',
            compromisoEsterilizacion: true,
            compromisoSeguimiento: true
          }
        })

        imported++
      } catch (error) {
        errors.push(`Error con ${solicitud.nombre}: ${error instanceof Error ? error.message : 'Error desconocido'}`)
      }
    }

    // Registrar evento
    analytics.track('csv_import_completed', {
      type: 'solicitudes',
      total: solicitudes.length,
      imported,
      errors: errors.length
    })

    return NextResponse.json({ 
      count: imported,
      total: solicitudes.length,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('Error importing solicitudes:', error)
    analytics.error('csv_import_failed', { type: 'solicitudes', error: error instanceof Error ? error.message : 'Unknown error' })
    return NextResponse.json(
      { error: 'Error al importar solicitudes' },
      { status: 500 }
    )
  }
}