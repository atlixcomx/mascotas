import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '../../../../../../../../lib/db'
import { eliminarFotoSchema } from '../../../../../../../../src/lib/validations/perrito'
import { z } from 'zod'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

interface RouteParams {
  params: { 
    id: string
    fotoId: string 
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo') || 'galeria'

    // Validar parámetros
    const datosValidados = eliminarFotoSchema.parse({
      fotoId: params.fotoId,
      tipo
    })

    // Verificar que el perrito existe
    const perrito = await prisma.perrito.findUnique({
      where: { id: params.id },
      include: {
        notas: {
          where: {
            contenido: {
              contains: 'Foto interna subida:'
            }
          }
        }
      }
    })

    if (!perrito) {
      return NextResponse.json({ error: 'Perrito no encontrado' }, { status: 404 })
    }

    const rutaArchivo = join(process.cwd(), 'public', 'uploads', 'perritos', params.id, params.fotoId)
    const urlFoto = `/uploads/perritos/${params.id}/${params.fotoId}`

    // Verificar si la foto existe en el sistema de archivos
    const archivoExiste = existsSync(rutaArchivo)

    let fotoEliminada = false
    let perritoActualizado = perrito

    switch (datosValidados.tipo) {
      case 'principal':
        if (perrito.fotoPrincipal === urlFoto) {
          // Buscar otra foto para asignar como principal
          const fotosGaleria = JSON.parse(perrito.fotos || '[]')
          const otraFoto = fotosGaleria.find((foto: string) => foto !== urlFoto)
          
          perritoActualizado = await prisma.perrito.update({
            where: { id: params.id },
            data: {
              fotoPrincipal: otraFoto || '/placeholder-dog.jpg'
            }
          })
          
          fotoEliminada = true
        } else {
          return NextResponse.json({ 
            error: 'La foto especificada no es la foto principal actual' 
          }, { status: 400 })
        }
        break

      case 'galeria':
      case 'catalogo':
        const fotosActuales = JSON.parse(perrito.fotos || '[]')
        if (fotosActuales.includes(urlFoto)) {
          const fotosActualizadas = fotosActuales.filter((foto: string) => foto !== urlFoto)
          
          let campoActualizar: any = {
            fotos: JSON.stringify(fotosActualizadas)
          }

          // Si era la foto principal, cambiarla
          if (perrito.fotoPrincipal === urlFoto) {
            campoActualizar.fotoPrincipal = fotosActualizadas[0] || '/placeholder-dog.jpg'
          }

          perritoActualizado = await prisma.perrito.update({
            where: { id: params.id },
            data: campoActualizar
          })
          
          fotoEliminada = true
        } else {
          return NextResponse.json({ 
            error: 'La foto no se encuentra en la galería del perrito' 
          }, { status: 404 })
        }
        break

      case 'interna':
        // Buscar en notas
        const notaConFoto = perrito.notas.find(nota => 
          nota.contenido.includes(urlFoto)
        )
        
        if (notaConFoto) {
          // Marcar la nota como eliminada en lugar de borrarla
          await prisma.notaPerrito.update({
            where: { id: notaConFoto.id },
            data: {
              contenido: `[FOTO ELIMINADA] ${notaConFoto.contenido}`
            }
          })
          
          fotoEliminada = true
        } else {
          return NextResponse.json({ 
            error: 'La foto interna no se encuentra' 
          }, { status: 404 })
        }
        break

      default:
        return NextResponse.json({ 
          error: 'Tipo de foto no válido' 
        }, { status: 400 })
    }

    // Eliminar archivo físico si existe
    if (archivoExiste) {
      try {
        await unlink(rutaArchivo)
      } catch (fileError) {
        console.error('Error eliminando archivo físico:', fileError)
        // No fallar si no se puede eliminar el archivo físico
      }
    }

    if (fotoEliminada) {
      // Crear nota de eliminación
      await prisma.notaPerrito.create({
        data: {
          perritoId: params.id,
          contenido: `Foto ${datosValidados.tipo} eliminada por ${session.user.name}: ${params.fotoId}`,
          autor: session.user.name || 'Admin',
          tipo: 'general'
        }
      })

      return NextResponse.json({
        success: true,
        message: `Foto ${datosValidados.tipo} eliminada correctamente`,
        fotoEliminada: {
          id: params.fotoId,
          url: urlFoto,
          tipo: datosValidados.tipo
        },
        perrito: {
          ...perritoActualizado,
          fotos: JSON.parse(perritoActualizado.fotos || '[]'),
          caracter: JSON.parse(perritoActualizado.caracter || '[]')
        }
      })
    } else {
      return NextResponse.json({ 
        error: 'No se pudo eliminar la foto' 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error deleting photo:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Parámetros inválidos',
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

// GET - Obtener información de una foto específica
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
          }
        }
      }
    })

    if (!perrito) {
      return NextResponse.json({ error: 'Perrito no encontrado' }, { status: 404 })
    }

    const urlFoto = `/uploads/perritos/${params.id}/${params.fotoId}`
    const rutaArchivo = join(process.cwd(), 'public', 'uploads', 'perritos', params.id, params.fotoId)
    
    let fotoInfo: any = {
      id: params.fotoId,
      url: urlFoto,
      existe: existsSync(rutaArchivo)
    }

    // Determinar tipo de foto
    const fotosGaleria = JSON.parse(perrito.fotos || '[]')
    
    if (perrito.fotoPrincipal === urlFoto) {
      fotoInfo.tipo = 'principal'
      fotoInfo.esPrincipal = true
    } else if (fotosGaleria.includes(urlFoto)) {
      fotoInfo.tipo = 'galeria'
    } else {
      // Buscar en fotos internas
      const notaFotoInterna = perrito.notas.find(nota => 
        nota.contenido.includes(urlFoto)
      )
      
      if (notaFotoInterna) {
        fotoInfo.tipo = 'interna'
        fotoInfo.fechaSubida = notaFotoInterna.createdAt
        fotoInfo.descripcion = notaFotoInterna.contenido.split(' - ')[1] || ''
      } else {
        return NextResponse.json({ 
          error: 'Foto no encontrada' 
        }, { status: 404 })
      }
    }

    // Obtener estadísticas de uso
    const notasRelacionadas = perrito.notas.filter(nota => 
      nota.contenido.includes(params.fotoId)
    )

    fotoInfo.historial = notasRelacionadas.map(nota => ({
      fecha: nota.createdAt,
      accion: nota.contenido,
      autor: nota.autor
    }))

    return NextResponse.json(fotoInfo)

  } catch (error) {
    console.error('Error fetching photo info:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}