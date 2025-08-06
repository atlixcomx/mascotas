import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parámetros de filtro
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const tamano = searchParams.get('tamano') || ''
    const edad = searchParams.get('edad') || ''
    const energia = searchParams.get('energia') || ''
    const aptoNinos = searchParams.get('aptoNinos') === 'true'
    const orderBy = searchParams.get('orderBy') || 'createdAt'
    const order = searchParams.get('order') || 'desc'
    const destacados = searchParams.get('destacados') === 'true'

    // Construir filtros
    const where: any = {
      estado: 'disponible',
    }

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { raza: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (tamano) {
      where.tamano = tamano
    }

    if (edad) {
      where.edad = { contains: edad }
    }

    if (energia) {
      where.energia = energia
    }

    if (aptoNinos) {
      where.aptoNinos = true
    }

    if (destacados) {
      where.destacado = true
    }

    // Calcular offset
    const skip = (page - 1) * limit

    // Obtener perritos con paginación
    const [perritos, total] = await Promise.all([
      prisma.perrito.findMany({
        where,
        select: {
          id: true,
          nombre: true,
          slug: true,
          fotoPrincipal: true,
          edad: true,
          tamano: true,
          raza: true,
          sexo: true,
          energia: true,
          aptoNinos: true,
          aptoPerros: true,
          aptoGatos: true,
          destacado: true,
          fechaIngreso: true,
          estado: true,
          caracter: true,
        },
        orderBy: {
          [orderBy]: order
        },
        skip,
        take: limit,
      }),
      prisma.perrito.count({ where })
    ])

    // Procesar carácter (JSON string a array)
    const perritosProcessed = perritos.map(perrito => ({
      ...perrito,
      caracter: perrito.caracter ? JSON.parse(perrito.caracter) : [],
      esNuevo: new Date().getTime() - perrito.fechaIngreso.getTime() < 7 * 24 * 60 * 60 * 1000 // 7 días
    }))

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      perritos: perritosProcessed,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        search,
        tamano,
        edad,
        energia,
        aptoNinos,
        destacados
      }
    })

  } catch (error) {
    console.error('Error fetching perritos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}