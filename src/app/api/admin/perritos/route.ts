import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../lib/auth'
import { prisma } from '../../../../../lib/db'

// Función para generar slug único
function generateSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // remover caracteres especiales
    .replace(/\s+/g, '-') // reemplazar espacios con guiones
    .replace(/-+/g, '-') // remover guiones duplicados
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    
    const {
      nombre,
      codigo,
      raza,
      edad,
      sexo,
      tamano,
      peso,
      historia,
      tipoIngreso,
      procedencia,
      responsableIngreso,
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
      destacado
    } = body

    // Generar slug único
    let slug = generateSlug(nombre)
    let slugCounter = 1
    
    while (await prisma.perrito.findUnique({ where: { slug } })) {
      slug = `${generateSlug(nombre)}-${slugCounter}`
      slugCounter++
    }

    // Generar código único si no se proporciona
    let codigoFinal = codigo
    if (!codigoFinal) {
      const año = new Date().getFullYear()
      const mes = String(new Date().getMonth() + 1).padStart(2, '0')
      let contador = 1
      
      do {
        codigoFinal = `ATL-${año}${mes}-${contador.toString().padStart(3, '0')}`
        contador++
      } while (await prisma.perrito.findUnique({ where: { codigo: codigoFinal } }))
    }

    const perrito = await prisma.perrito.create({
      data: {
        nombre,
        codigo: codigoFinal,
        slug,
        raza,
        edad,
        sexo,
        tamano,
        peso: peso ? parseFloat(peso) : null,
        historia,
        fechaIngreso: new Date(),
        tipoIngreso: tipoIngreso || 'entrega_voluntaria',
        procedencia: procedencia || '',
        responsableIngreso: responsableIngreso || '',
        vacunas: Boolean(vacunas),
        esterilizado: Boolean(esterilizado),
        desparasitado: Boolean(desparasitado),
        saludNotas: saludNotas || '',
        energia,
        aptoNinos: Boolean(aptoNinos),
        aptoPerros: Boolean(aptoPerros),
        aptoGatos: Boolean(aptoGatos),
        caracter: JSON.stringify(caracter || []),
        fotoPrincipal: fotoPrincipal || '/placeholder-dog.jpg',
        fotos: JSON.stringify(fotos || [fotoPrincipal || '/placeholder-dog.jpg']),
        destacado: Boolean(destacado),
        estado: 'disponible'
      }
    })

    // Crear nota inicial
    await prisma.notaPerrito.create({
      data: {
        perritoId: perrito.id,
        contenido: `Perrito ${nombre} agregado al sistema`,
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
    console.error('Error creating perrito:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const estado = searchParams.get('estado') || ''
    const tamano = searchParams.get('tamano') || ''

    const where: {
      OR?: Array<{ nombre?: { contains: string; mode: 'insensitive' }; raza?: { contains: string; mode: 'insensitive' } }>
      estado?: string
      tamano?: string
    } = {}

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { raza: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (estado) {
      where.estado = estado
    }

    if (tamano) {
      where.tamano = tamano
    }

    const skip = (page - 1) * limit

    const [perritos, total] = await Promise.all([
      prisma.perrito.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          solicitudes: {
            select: {
              id: true,
              estado: true
            }
          },
          notas: {
            select: {
              id: true
            }
          }
        }
      }),
      prisma.perrito.count({ where })
    ])

    const perritosProcessed = perritos.map(perrito => ({
      ...perrito,
      fotos: perrito.fotos ? JSON.parse(perrito.fotos) : [],
      caracter: perrito.caracter ? JSON.parse(perrito.caracter) : [],
      solicitudesCount: perrito.solicitudes.length,
      notasCount: perrito.notas.length,
      solicitudesActivas: perrito.solicitudes.filter(s => 
        ['nueva', 'revision', 'entrevista', 'prueba'].includes(s.estado)
      ).length
    }))

    return NextResponse.json({
      perritos: perritosProcessed,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
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