import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../../../lib/auth'
import { prisma } from '../../../../../../../lib/db'
import { subirFotoSchema } from '../../../../../../../src/lib/validations/perrito'
import { z } from 'zod'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

interface RouteParams {
  params: { id: string }
}

// Función para generar nombre único de archivo
function generarNombreArchivo(originalName: string): string {
  const extension = originalName.split('.').pop() || 'jpg'
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${timestamp}_${random}.${extension}`
}

// Función para crear directorio si no existe
async function crearDirectorio(ruta: string) {
  if (!existsSync(ruta)) {
    await mkdir(ruta, { recursive: true })
  }
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

    const formData = await request.formData()
    const archivo = formData.get('archivo') as File
    const tipo = formData.get('tipo') as string
    const descripcion = formData.get('descripcion') as string

    if (!archivo) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    // Validar tipo de archivo
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!tiposPermitidos.includes(archivo.type)) {
      return NextResponse.json({ 
        error: 'Tipo de archivo no permitido. Solo se permiten JPG, PNG y WebP' 
      }, { status: 400 })
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (archivo.size > maxSize) {
      return NextResponse.json({ 
        error: 'El archivo es muy grande. Tamaño máximo: 5MB' 
      }, { status: 400 })
    }

    // Validar datos con Zod (simplificado porque File no es validable directamente)
    const tipoValidado = z.enum(['principal', 'galeria', 'interna', 'catalogo']).parse(tipo)

    // Crear directorio para las fotos
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'perritos', params.id)
    await crearDirectorio(uploadDir)

    // Generar nombre único
    const nombreArchivo = generarNombreArchivo(archivo.name)
    const rutaArchivo = join(uploadDir, nombreArchivo)
    const urlPublica = `/uploads/perritos/${params.id}/${nombreArchivo}`

    // Guardar archivo
    const bytes = await archivo.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(rutaArchivo, buffer)

    // Obtener fotos actuales del perrito
    const fotosActuales = JSON.parse(perrito.fotos || '[]')
    let fotosActualizadas = [...fotosActuales]

    // Actualizar perrito según el tipo de foto
    let campoActualizar: any = {}

    switch (tipoValidado) {
      case 'principal':
        campoActualizar.fotoPrincipal = urlPublica
        // También agregar a fotos generales si no está
        if (!fotosActualizadas.includes(urlPublica)) {
          fotosActualizadas.unshift(urlPublica)
        }
        campoActualizar.fotos = JSON.stringify(fotosActualizadas)
        break
      
      case 'galeria':
        if (!fotosActualizadas.includes(urlPublica)) {
          fotosActualizadas.push(urlPublica)
        }
        campoActualizar.fotos = JSON.stringify(fotosActualizadas)
        break
      
      case 'interna':
        // Para fotos internas, usaremos una nota especial
        await prisma.notaPerrito.create({
          data: {
            perritoId: params.id,
            contenido: `Foto interna subida: ${urlPublica}${descripcion ? ` - ${descripcion}` : ''}`,
            autor: session.user.name || 'Admin',
            tipo: 'general'
          }
        })
        break
      
      case 'catalogo':
        // Para fotos de catálogo, las agregamos tanto a fotos como marcamos especialmente
        if (!fotosActualizadas.includes(urlPublica)) {
          fotosActualizadas.push(urlPublica)
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
        contenido: `Foto ${tipoValidado} subida por ${session.user.name}: ${nombreArchivo}${descripcion ? ` - ${descripcion}` : ''}`,
        autor: session.user.name || 'Admin',
        tipo: 'general'
      }
    })

    return NextResponse.json({
      success: true,
      foto: {
        id: nombreArchivo,
        url: urlPublica,
        tipo: tipoValidado,
        descripcion: descripcion || '',
        fechaSubida: new Date(),
        tamaño: archivo.size,
        tipoArchivo: archivo.type
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