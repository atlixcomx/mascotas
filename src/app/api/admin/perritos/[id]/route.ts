import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../../lib/auth'
import { prisma } from '../../../../../../lib/db'
import { actualizarPerritoSchema } from '../../../../../../src/lib/validations/perrito'
import { z } from 'zod'

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

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const perrito = await prisma.perrito.findUnique({
      where: { id: params.id },
    include: {
        solicitudes: {
          select: {
            id: true,
            codigo: true,
            nombre: true,
            email: true,
            telefono: true,
            estado: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        },
        notas: {
          orderBy: { createdAt: 'desc' }
        },
        expedienteMedico: {
          orderBy: { fecha: 'desc' },
          take: 10
        }
      }
    })

    if (!perrito) {
      return NextResponse.json({ error: 'Perrito no encontrado' }, { status: 404 })
    }

    // Procesar datos adicionales desde las notas
    const notasSalud = perrito.notas.filter(n => n.tipo === 'salud')
    const padecimientos: string[] = []
    const alergias: string[] = []
    const tratamientos: any[] = []
    
    notasSalud.forEach(nota => {
      if (nota.contenido.includes('Padecimientos registrados:')) {
        const items = nota.contenido.replace('Padecimientos registrados: ', '').split(', ')
        padecimientos.push(...items)
      }
      if (nota.contenido.includes('Alergias registradas:')) {
        const items = nota.contenido.replace('Alergias registradas: ', '').split(', ')
        alergias.push(...items)
      }
      if (nota.contenido.includes('Tratamientos:')) {
        // Extraer tratamientos (simplificado)
        const tratamientoTexto = nota.contenido.replace('Tratamientos: ', '')
        tratamientos.push({ descripcion: tratamientoTexto, fechaInicio: nota.createdAt })
      }
    })

    // Procesar vacunas desde expediente médico
    const vacunasDetalle = perrito.expedienteMedico
      .filter(exp => exp.tipo === 'vacuna')
      .map(exp => ({
        nombre: exp.vacunaTipo || exp.descripcion,
        fecha: exp.fecha,
        veterinario: exp.veterinario || 'No especificado'
      }))

    // Mock data for change history - in production, this would come from an audit table
    const historialCambios = [
      {
        id: '1',
        campo: 'estado',
        valorAnterior: 'tratamiento',
        valorNuevo: 'disponible',
        usuario: 'Admin',
        fecha: new Date().toISOString()
      }
    ]

    return NextResponse.json({
      perrito: {
        ...perrito,
        fotos: parsePhotosField(perrito.fotos),
        caracter: perrito.caracter ? JSON.parse(perrito.caracter) : []
      },
      expedienteMedico: perrito.expedienteMedico || [],
      notas: perrito.notas || [],
      historialCambios
    })

  } catch (error) {
    console.error('Error fetching perrito:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validar datos de entrada con Zod
    const datosValidados = actualizarPerritoSchema.parse(body)

    const perritoExistente = await prisma.perrito.findUnique({
      where: { id: params.id }
    })

    if (!perritoExistente) {
      return NextResponse.json({ error: 'Perrito no encontrado' }, { status: 404 })
    }

    // Preparar datos de actualización (solo los campos que se proporcionaron)
    const datosActualizacion: any = {}
    
    if (datosValidados.nombre !== undefined) datosActualizacion.nombre = datosValidados.nombre
    if (datosValidados.raza !== undefined) datosActualizacion.raza = datosValidados.raza
    if (datosValidados.edad !== undefined) datosActualizacion.edad = datosValidados.edad
    if (datosValidados.sexo !== undefined) datosActualizacion.sexo = datosValidados.sexo
    if (datosValidados.tamano !== undefined) datosActualizacion.tamano = datosValidados.tamano
    if (datosValidados.peso !== undefined) datosActualizacion.peso = datosValidados.peso
    if (datosValidados.historia !== undefined) datosActualizacion.historia = datosValidados.historia
    if (datosValidados.tipoIngreso !== undefined) datosActualizacion.tipoIngreso = datosValidados.tipoIngreso
    if (datosValidados.procedencia !== undefined) datosActualizacion.procedencia = datosValidados.procedencia
    if (datosValidados.responsableIngreso !== undefined) datosActualizacion.responsableIngreso = datosValidados.responsableIngreso
    if (datosValidados.vacunas !== undefined) datosActualizacion.vacunas = datosValidados.vacunas
    if (datosValidados.esterilizado !== undefined) datosActualizacion.esterilizado = datosValidados.esterilizado
    if (datosValidados.desparasitado !== undefined) datosActualizacion.desparasitado = datosValidados.desparasitado
    if (datosValidados.saludNotas !== undefined) datosActualizacion.saludNotas = datosValidados.saludNotas
    if (datosValidados.energia !== undefined) datosActualizacion.energia = datosValidados.energia
    if (datosValidados.aptoNinos !== undefined) datosActualizacion.aptoNinos = datosValidados.aptoNinos
    if (datosValidados.aptoPerros !== undefined) datosActualizacion.aptoPerros = datosValidados.aptoPerros
    if (datosValidados.aptoGatos !== undefined) datosActualizacion.aptoGatos = datosValidados.aptoGatos
    if (datosValidados.caracter !== undefined) datosActualizacion.caracter = JSON.stringify(datosValidados.caracter)
    if (datosValidados.fotoPrincipal !== undefined) datosActualizacion.fotoPrincipal = datosValidados.fotoPrincipal
    if (datosValidados.fotos !== undefined) datosActualizacion.fotos = JSON.stringify(datosValidados.fotos)
    if (datosValidados.destacado !== undefined) datosActualizacion.destacado = datosValidados.destacado
    if (datosValidados.estado !== undefined) datosActualizacion.estado = datosValidados.estado

    const perrito = await prisma.perrito.update({
      where: { id: params.id },
      data: datosActualizacion
    })

    // Crear nota de actualización detallada
    const camposActualizados = Object.keys(datosActualizacion).join(', ')
    await prisma.notaPerrito.create({
      data: {
        perritoId: perrito.id,
        contenido: `Información actualizada por ${session.user.name}. Campos modificados: ${camposActualizados}`,
        autor: session.user.name || 'Admin',
        tipo: 'general'
      }
    })

    // Actualizar notas especiales si se proporcionaron
    if (datosValidados.padecimientos && datosValidados.padecimientos.length > 0) {
      await prisma.notaPerrito.create({
        data: {
          perritoId: perrito.id,
          contenido: `Padecimientos actualizados: ${datosValidados.padecimientos.join(', ')}`,
          autor: session.user.name || 'Admin',
          tipo: 'salud'
        }
      })
    }

    if (datosValidados.alergias && datosValidados.alergias.length > 0) {
      await prisma.notaPerrito.create({
        data: {
          perritoId: perrito.id,
          contenido: `Alergias actualizadas: ${datosValidados.alergias.join(', ')}`,
          autor: session.user.name || 'Admin',
          tipo: 'salud'
        }
      })
    }

    if (datosValidados.tratamientos && datosValidados.tratamientos.length > 0) {
      await prisma.notaPerrito.create({
        data: {
          perritoId: perrito.id,
          contenido: `Tratamientos actualizados: ${datosValidados.tratamientos.map(t => `${t.descripcion} (${t.fechaInicio}${t.fechaFin ? ' - ' + t.fechaFin : ''})`).join(', ')}`,
          autor: session.user.name || 'Admin',
          tipo: 'salud'
        }
      })
    }

    return NextResponse.json({
      success: true,
      perrito: {
        ...perrito,
        fotos: parsePhotosField(perrito.fotos),
        caracter: JSON.parse(perrito.caracter || '[]'),
        // Campos adicionales
        padecimientos: datosValidados.padecimientos || [],
        vacunasDetalle: datosValidados.vacunasDetalle || [],
        tratamientos: datosValidados.tratamientos || [],
        alergias: datosValidados.alergias || [],
        fotosInternas: datosValidados.fotosInternas || [],
        fotosCatalogo: datosValidados.fotosCatalogo || []
      }
    })

  } catch (error) {
    console.error('Error updating perrito:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos inválidos',
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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const forceDelete = searchParams.get('force') === 'true'

    const perrito = await prisma.perrito.findUnique({
      where: { id: params.id },
      include: {
        solicitudes: {
          select: { id: true, estado: true }
        }
      }
    })

    if (!perrito) {
      return NextResponse.json({ error: 'Perrito no encontrado' }, { status: 404 })
    }

    // Verificar si tiene solicitudes activas
    const solicitudesActivas = perrito.solicitudes.filter(s => 
      ['nueva', 'revision', 'entrevista', 'prueba'].includes(s.estado)
    )

    if (solicitudesActivas.length > 0 && !forceDelete) {
      return NextResponse.json(
        { error: 'No se puede eliminar un perrito con solicitudes activas. Use force=true para eliminación forzada.' },
        { status: 400 }
      )
    }

    if (forceDelete) {
      // Eliminación completa (hard delete)
      await prisma.notaPerrito.deleteMany({
        where: { perritoId: params.id }
      })

      await prisma.expedienteMedico.deleteMany({
        where: { perritoId: params.id }
      })

      await prisma.seguimientoAdopcion.deleteMany({
        where: { perritoId: params.id }
      })

      // Las solicitudes se mantienen para historial
      await prisma.perrito.delete({
        where: { id: params.id }
      })

      await prisma.notaPerrito.create({
        data: {
          perritoId: params.id,
          contenido: `Perrito ${perrito.nombre} eliminado permanentemente por ${session.user.name}`,
          autor: session.user.name || 'Admin',
          tipo: 'general'
        }
      })

      return NextResponse.json({ 
        success: true, 
        message: 'Perrito eliminado permanentemente',
        type: 'hard_delete'
      })
    } else {
      // Soft delete - cambiar estado a "eliminado"
      const perritoActualizado = await prisma.perrito.update({
        where: { id: params.id },
        data: {
          estado: 'eliminado',
          nombre: `[ELIMINADO] ${perrito.nombre}`,
          updatedAt: new Date()
        }
      })

      // Crear nota de eliminación
      await prisma.notaPerrito.create({
        data: {
          perritoId: params.id,
          contenido: `Perrito marcado como eliminado por ${session.user.name}. Razón: Eliminación por administrador`,
          autor: session.user.name || 'Admin',
          tipo: 'general'
        }
      })

      return NextResponse.json({ 
        success: true, 
        message: 'Perrito marcado como eliminado',
        type: 'soft_delete',
        perrito: {
          ...perritoActualizado,
          fotos: parsePhotosField(perritoActualizado.fotos),
          caracter: JSON.parse(perritoActualizado.caracter || '[]')
        }
      })
    }

  } catch (error) {
    console.error('Error deleting perrito:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}