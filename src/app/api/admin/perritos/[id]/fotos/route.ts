import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '../../../../../../../lib/db'
import { z } from 'zod'

interface RouteParams {
  params: { id: string }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que el perrito existe
    const perrito = await prisma.perrito.findUnique({
      where: { id: params.id }
    })

    if (!perrito) {
      return NextResponse.json({ error: 'Perrito no encontrado' }, { status: 404 })
    }

    // Recibir la URL de la imagen subida por Uploadthing
    const body = await request.json()
    const { url, tipo = 'galeria' } = body

    if (!url) {
      return NextResponse.json({ error: 'No se proporcionó URL de imagen' }, { status: 400 })
    }

    // Validar tipo
    const tipoValidado = z.enum(['principal', 'galeria', 'interna', 'catalogo']).parse(tipo)

    // Obtener fotos actuales del perrito
    const fotosActuales = JSON.parse(perrito.fotos || '[]')
    let fotosActualizadas = [...fotosActuales]

    // Actualizar perrito según el tipo de foto
    let campoActualizar: any = {}

    switch (tipoValidado) {
      case 'principal':
        campoActualizar.fotoPrincipal = url
        // También agregar a fotos generales si no está
        if (!fotosActualizadas.includes(url)) {
          fotosActualizadas.unshift(url)
        }
        campoActualizar.fotos = JSON.stringify(fotosActualizadas)
        break
      
      case 'galeria':
        if (!fotosActualizadas.includes(url)) {
          fotosActualizadas.push(url)
        }
        campoActualizar.fotos = JSON.stringify(fotosActualizadas)
        break
      
      case 'interna':
        // Para fotos internas, usaremos una nota especial
        await prisma.notaPerrito.create({
          data: {
            perritoId: params.id,
            contenido: `Foto interna subida: ${url}`,
            autor: session.user.name || 'Admin',
            tipo: 'general'
          }
        })
        break
      
      case 'catalogo':
        // Para fotos de catálogo, las agregamos tanto a fotos como marcamos especialmente
        if (!fotosActualizadas.includes(url)) {
          fotosActualizadas.push(url)
        }
        campoActualizar.fotos = JSON.stringify(fotosActualizadas)
        break
    }

    // Actualizar perrito con nueva foto
    const perritoActualizado = await prisma.perrito.update({
      where: { id: params.id },
      data: campoActualizar
    })

    // Crear nota de la subida
    await prisma.notaPerrito.create({
      data: {
        perritoId: params.id,
        contenido: `Foto ${tipoValidado} subida por ${session.user.name}`,
        autor: session.user.name || 'Admin',
        tipo: 'general'
      }
    })

    return NextResponse.json({
      success: true,
      foto: {
        url: url,
        tipo: tipoValidado,
        fechaSubida: new Date()
      },
      perrito: {
        ...perritoActualizado,
        fotos: JSON.parse(perritoActualizado.fotos || '[]'),
        caracter: JSON.parse(perritoActualizado.caracter || '[]')
      }
    })

  } catch (error) {
    console.error('Error uploading photo:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Tipo de foto inválido',
          details: error.errors
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET - Listar fotos del perrito
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const perrito = await prisma.perrito.findUnique({
      where: { id: params.id },
      include: {
        notas: {
          where: {
            contenido: {
              contains: 'Foto'
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!perrito) {
      return NextResponse.json({ error: 'Perrito no encontrado' }, { status: 404 })
    }

    const fotosGaleria = JSON.parse(perrito.fotos || '[]')
    
    // Extraer fotos internas de las notas
    const fotosInternas = perrito.notas
      .filter(nota => nota.contenido.includes('Foto interna subida:'))
      .map(nota => {
        const match = nota.contenido.match(/Foto interna subida: (\/uploads\/perritos\/[^\\s]+)/)
        if (match) {
          return {
            id: match[1].split('/').pop(),
            url: match[1],
            tipo: 'interna',
            fechaSubida: nota.createdAt,
            descripcion: nota.contenido.split(' - ')[1] || ''
          }
        }
        return null
      })
      .filter(Boolean)

    return NextResponse.json({
      perritoId: params.id,
      fotoPrincipal: perrito.fotoPrincipal,
      fotos: {
        principal: perrito.fotoPrincipal ? [{
          id: perrito.fotoPrincipal.split('/').pop(),
          url: perrito.fotoPrincipal,
          tipo: 'principal'
        }] : [],
        galeria: fotosGaleria.map((url: string) => ({
          id: url.split('/').pop(),
          url,
          tipo: url === perrito.fotoPrincipal ? 'principal' : 'galeria'
        })),
        internas: fotosInternas,
        catalogo: fotosGaleria.map((url: string) => ({
          id: url.split('/').pop(),
          url,
          tipo: 'catalogo'
        }))
      },
      total: fotosGaleria.length + fotosInternas.length
    })

  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}