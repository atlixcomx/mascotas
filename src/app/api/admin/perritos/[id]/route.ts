import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../../lib/auth'
import { prisma } from '../../../../../../lib/db'

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
        }
      }
    })

    if (!perrito) {
      return NextResponse.json({ error: 'Perrito no encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      ...perrito,
      fotos: perrito.fotos ? JSON.parse(perrito.fotos) : [],
      caracter: perrito.caracter ? JSON.parse(perrito.caracter) : []
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
    const {
      nombre,
      raza,
      edad,
      sexo,
      tamano,
      peso,
      historia,
      procedencia,
      vacunas,
      esterilizado,
      desparasitado,
      saludNotas,
      energia,
      aptoNinos,
      aptoPerros,
      aptoGatos,
      caracter,
      fotoPrincipal,
      fotos,
      destacado,
      estado
    } = body

    const perritoExistente = await prisma.perrito.findUnique({
      where: { id: params.id }
    })

    if (!perritoExistente) {
      return NextResponse.json({ error: 'Perrito no encontrado' }, { status: 404 })
    }

    const perrito = await prisma.perrito.update({
      where: { id: params.id },
      data: {
        nombre,
        raza,
        edad,
        sexo,
        tamano,
        peso: peso ? parseFloat(peso) : null,
        historia,
        procedencia: procedencia || '',
        vacunas: Boolean(vacunas),
        esterilizado: Boolean(esterilizado),
        desparasitado: Boolean(desparasitado),
        saludNotas: saludNotas || '',
        energia,
        aptoNinos: Boolean(aptoNinos),
        aptoPerros: Boolean(aptoPerros),
        aptoGatos: Boolean(aptoGatos),
        caracter: JSON.stringify(caracter || []),
        fotoPrincipal: fotoPrincipal || perritoExistente.fotoPrincipal,
        fotos: JSON.stringify(fotos || [fotoPrincipal || perritoExistente.fotoPrincipal]),
        destacado: Boolean(destacado),
        estado: estado || perritoExistente.estado
      }
    })

    // Crear nota de actualización
    await prisma.notaPerrito.create({
      data: {
        perritoId: perrito.id,
        contenido: `Información actualizada por ${session.user.name}`,
        autor: session.user.name || 'Admin',
        tipo: 'general'
      }
    })

    return NextResponse.json({
      success: true,
      perrito: {
        ...perrito,
        fotos: JSON.parse(perrito.fotos),
        caracter: JSON.parse(perrito.caracter)
      }
    })

  } catch (error) {
    console.error('Error updating perrito:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

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

    if (solicitudesActivas.length > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar un perrito con solicitudes activas' },
        { status: 400 }
      )
    }

    // Eliminar notas primero (relación)
    await prisma.notaPerrito.deleteMany({
      where: { perritoId: params.id }
    })

    // Eliminar perrito
    await prisma.perrito.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting perrito:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}