import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')
    const certificado = searchParams.get('certificado')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Construir filtros
    const where: any = {}
    
    if (categoria) {
      where.categoria = categoria
    }
    
    if (certificado === 'true') {
      where.certificado = true
    }

    // Obtener comercios con paginación
    const [comercios, total] = await Promise.all([
      prisma.comercio.findMany({
        where,
        orderBy: [
          { certificado: 'desc' }, // Certificados primero
          { fechaCert: 'desc' },   // Más recientes primero
          { nombre: 'asc' }        // Alfabético
        ],
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          codigo: true,
          nombre: true,
          slug: true,
          categoria: true,
          descripcion: true,
          direccion: true,
          telefono: true,
          email: true,
          horarios: true,
          servicios: true,
          certificado: true,
          fechaCert: true,
          latitud: true,
          longitud: true
        }
      }),
      prisma.comercio.count({ where })
    ])

    // Procesar servicios (convertir JSON string a array)
    const comerciosFormatted = comercios.map(comercio => ({
      ...comercio,
      servicios: comercio.servicios ? 
        (typeof comercio.servicios === 'string' ? 
          JSON.parse(comercio.servicios) : 
          comercio.servicios
        ) : []
    }))

    // Calcular información de paginación
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return NextResponse.json({
      comercios: comerciosFormatted,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev
      },
      filters: {
        categoria: categoria || '',
        certificado: certificado === 'true',
        availableCategories: await prisma.comercio.findMany({
          select: { categoria: true },
          distinct: ['categoria']
        }).then(cats => cats.map(c => c.categoria))
      }
    })

  } catch (error) {
    console.error('Error fetching comercios:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener los comercios'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}