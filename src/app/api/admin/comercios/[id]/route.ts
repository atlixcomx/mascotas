import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Obtener un comercio específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const comercio = await prisma.comercio.findUnique({
      where: { id: params.id }
    })

    if (!comercio) {
      return NextResponse.json({ error: 'Comercio no encontrado' }, { status: 404 })
    }

    return NextResponse.json(comercio)
  } catch (error) {
    console.error('Error fetching comercio:', error)
    return NextResponse.json(
      { error: 'Error al obtener comercio' },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar comercio
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()

    // Si solo se está actualizando el estado activo
    if (Object.keys(body).length === 1 && 'activo' in body) {
      const comercio = await prisma.comercio.update({
        where: { id: params.id },
        data: { activo: body.activo }
      })
      return NextResponse.json(comercio)
    }

    // Actualización completa
    const {
      nombre,
      categoria,
      logo,
      descripcion,
      direccion,
      telefono,
      email,
      website,
      horarios,
      servicios,
      restricciones,
      certificado,
      fechaCert,
      latitud,
      longitud,
      activo
    } = body

    // Si se cambia el nombre, actualizar el slug
    let updateData: any = {
      nombre,
      categoria,
      logo,
      descripcion,
      direccion,
      telefono,
      email,
      website,
      horarios,
      servicios,
      restricciones,
      certificado,
      fechaCert: fechaCert ? new Date(fechaCert) : null,
      latitud: latitud ? parseFloat(latitud) : null,
      longitud: longitud ? parseFloat(longitud) : null,
      activo
    }

    // Si se cambia el nombre, generar nuevo slug
    if (nombre) {
      const comercioActual = await prisma.comercio.findUnique({
        where: { id: params.id }
      })

      if (comercioActual && comercioActual.nombre !== nombre) {
        const baseSlug = nombre
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')

        let slug = baseSlug
        let counter = 1
        
        // Verificar que el slug no esté en uso por otro comercio
        let existingComercio = await prisma.comercio.findUnique({ where: { slug } })
        while (existingComercio && existingComercio.id !== params.id) {
          slug = `${baseSlug}-${counter}`
          counter++
          existingComercio = await prisma.comercio.findUnique({ where: { slug } })
        }

        updateData.slug = slug
      }
    }

    const comercio = await prisma.comercio.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json(comercio)
  } catch (error) {
    console.error('Error updating comercio:', error)
    return NextResponse.json(
      { error: 'Error al actualizar comercio' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar comercio
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await prisma.comercio.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting comercio:', error)
    return NextResponse.json(
      { error: 'Error al eliminar comercio' },
      { status: 500 }
    )
  }
}