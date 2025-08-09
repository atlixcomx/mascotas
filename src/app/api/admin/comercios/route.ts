import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../lib/auth'
import { prisma } from '@/lib/db'

// GET - Obtener todos los comercios
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const comercios = await prisma.comercio.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(comercios)
  } catch (error) {
    console.error('Error fetching comercios:', error)
    return NextResponse.json(
      { error: 'Error al obtener comercios' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo comercio
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
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
      latitud,
      longitud
    } = body

    // Validaciones básicas
    if (!nombre || !categoria || !descripcion || !direccion || !telefono || !horarios || !servicios) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Generar slug único
    const baseSlug = nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    let slug = baseSlug
    let counter = 1
    while (await prisma.comercio.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Generar código único
    const comercioCount = await prisma.comercio.count()
    const codigo = `COM${String(comercioCount + 1).padStart(4, '0')}`

    // Crear comercio
    const comercio = await prisma.comercio.create({
      data: {
        codigo,
        nombre,
        slug,
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
        latitud: latitud ? parseFloat(latitud) : null,
        longitud: longitud ? parseFloat(longitud) : null
      }
    })

    return NextResponse.json(comercio)
  } catch (error) {
    console.error('Error creating comercio:', error)
    return NextResponse.json(
      { error: 'Error al crear comercio' },
      { status: 500 }
    )
  }
}