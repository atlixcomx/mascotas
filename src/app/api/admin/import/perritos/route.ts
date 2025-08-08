import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../../lib/auth'
import { prisma } from '../../../../../../lib/db'
import { analytics } from '../../../../../lib/analytics'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { perritos } = await request.json()
    
    if (!Array.isArray(perritos) || perritos.length === 0) {
      return NextResponse.json({ error: 'No se proporcionaron datos válidos' }, { status: 400 })
    }

    let imported = 0
    let errors = []

    for (const perrito of perritos) {
      try {
        // Validar campos requeridos
        if (!perrito.nombre || !perrito.edad || !perrito.sexo || !perrito.tamaño) {
          errors.push(`Faltan campos requeridos para: ${perrito.nombre || 'sin nombre'}`)
          continue
        }

        // Procesar datos
        const edadNumero = parseInt(perrito.edad.match(/\d+/)?.[0] || '0')
        const edadUnidad = perrito.edad.includes('mes') ? 'meses' : 'años'

        await prisma.perrito.create({
          data: {
            nombre: perrito.nombre.trim(),
            edad: edadNumero,
            edadUnidad: edadUnidad,
            sexo: perrito.sexo.toLowerCase() as 'macho' | 'hembra',
            tamaño: perrito.tamaño.toLowerCase() as 'pequeño' | 'mediano' | 'grande',
            raza: perrito.raza?.trim() || 'Mestizo',
            descripcion: perrito.descripcion?.trim() || '',
            personalidad: perrito.personalidad?.split(',').map((p: string) => p.trim()) || [],
            salud: perrito.salud?.split(',').map((s: string) => s.trim()) || [],
            estado: (perrito.estado?.toLowerCase() || 'disponible') as 'disponible' | 'adoptado' | 'reservado'
          }
        })

        imported++
      } catch (error) {
        errors.push(`Error con ${perrito.nombre}: ${error instanceof Error ? error.message : 'Error desconocido'}`)
      }
    }

    // Registrar evento
    analytics.track('csv_import_completed', {
      type: 'perritos',
      total: perritos.length,
      imported,
      errors: errors.length
    })

    return NextResponse.json({ 
      count: imported,
      total: perritos.length,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('Error importing perritos:', error)
    analytics.error('csv_import_failed', { type: 'perritos', error: error instanceof Error ? error.message : 'Unknown error' })
    return NextResponse.json(
      { error: 'Error al importar perritos' },
      { status: 500 }
    )
  }
}