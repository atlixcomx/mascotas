import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Helper function to safely parse photos field
function parsePhotosField(fotos: string | null): string[] {
  if (!fotos || fotos === '[]') return []
  
  try {
    const parsed = JSON.parse(fotos)
    return Array.isArray(parsed) ? parsed : [fotos]
  } catch (error) {
    // If it's not valid JSON, treat as single URL
    return [fotos]
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const perrito = await prisma.perrito.findUnique({
      where: { slug: params.slug },
      include: {
        notas: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    if (!perrito) {
      return NextResponse.json({ error: 'Perrito no encontrado' }, { status: 404 })
    }

    // Incrementar vistas
    await prisma.perrito.update({
      where: { id: perrito.id },
      data: { vistas: { increment: 1 } }
    })

    // Get similar perritos
    const similares = await prisma.perrito.findMany({
      where: {
        id: { not: perrito.id },
        estado: 'disponible',
        OR: [
          { tamano: perrito.tamano },
          { energia: perrito.energia }
        ]
      },
      select: {
        id: true,
        nombre: true,
        slug: true,
        fotoPrincipal: true,
        edad: true,
        raza: true,
        tamano: true
      },
      take: 3
    })

    console.log('Perrito data from DB:', {
      nombre: perrito.nombre,
      fotoPrincipal: perrito.fotoPrincipal,
      fotos: perrito.fotos,
      fotosType: typeof perrito.fotos
    })
    
    const response = {
      ...perrito,
      fotos: parsePhotosField(perrito.fotos) || [],
      caracter: perrito.caracter ? JSON.parse(perrito.caracter) : [],
      esNuevo: new Date().getTime() - perrito.fechaIngreso.getTime() < 7 * 24 * 60 * 60 * 1000,
      similares
    }
    
    console.log('Response fotos:', response.fotos)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching perrito:', error)
    return NextResponse.json(
      { error: 'Error al obtener el perrito' },
      { status: 500 }
    )
  }
}