import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { crearPerritoSchema, filtrosPerritoSchema } from '../../../../../src/lib/validations/perrito'
import { z } from 'zod'

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
    
    // Log para depuración en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('Datos recibidos para crear perrito:', {
        nombre: body.nombre,
        fotoPrincipal: body.fotoPrincipal,
        fotos: body.fotos
      })
    }
    
    // Validar datos de entrada con Zod
    const datosValidados = crearPerritoSchema.parse(body)

    // Generar slug único
    let slug = generateSlug(datosValidados.nombre)
    let slugCounter = 1
    
    while (await prisma.perrito.findUnique({ where: { slug } })) {
      slug = `${generateSlug(datosValidados.nombre)}-${slugCounter}`
      slugCounter++
    }

    // Generar código único automáticamente (formato ATL-2024-XXX)
    const año = new Date().getFullYear()
    let contador = 1
    let codigoFinal = ''
    
    do {
      codigoFinal = `ATL-${año}-${contador.toString().padStart(3, '0')}`
      contador++
    } while (await prisma.perrito.findUnique({ where: { codigo: codigoFinal } }))

    const perrito = await prisma.perrito.create({
      data: {
        nombre: datosValidados.nombre,
        codigo: codigoFinal,
        slug,
        raza: datosValidados.raza,
        edad: datosValidados.edad,
        sexo: datosValidados.sexo,
        tamano: datosValidados.tamano,
        peso: datosValidados.peso || null,
        historia: datosValidados.historia,
        fechaIngreso: new Date(),
        tipoIngreso: datosValidados.tipoIngreso,
        procedencia: datosValidados.procedencia || '',
        responsableIngreso: datosValidados.responsableIngreso || '',
        vacunas: datosValidados.vacunas,
        esterilizado: datosValidados.esterilizado,
        desparasitado: datosValidados.desparasitado,
        saludNotas: datosValidados.saludNotas || '',
        energia: datosValidados.energia,
        aptoNinos: datosValidados.aptoNinos,
        aptoPerros: datosValidados.aptoPerros,
        aptoGatos: datosValidados.aptoGatos,
        caracter: JSON.stringify(datosValidados.caracter),
        fotoPrincipal: datosValidados.fotoPrincipal || '/placeholder-dog.jpg',
        fotos: JSON.stringify(datosValidados.fotos.length > 0 ? datosValidados.fotos : [datosValidados.fotoPrincipal || '/placeholder-dog.jpg']),
        destacado: datosValidados.destacado,
        estado: datosValidados.estado
      }
    })

    // Crear notas para información adicional
    const notasACrear = []
    
    // Nota inicial
    notasACrear.push({
      contenido: [
        `Perrito ${datosValidados.nombre} agregado al sistema`,
        `Código: ${codigoFinal}`,
        `Tipo de ingreso: ${datosValidados.tipoIngreso}`,
        datosValidados.procedencia ? `Procedencia: ${datosValidados.procedencia}` : '',
        datosValidados.responsableIngreso ? `Responsable: ${datosValidados.responsableIngreso}` : ''
      ].filter(Boolean).join('\n'),
      tipo: 'general'
    })

    // Procesar campos adicionales que vienen validados del esquema
    // Padecimientos
    if (datosValidados.padecimientos && datosValidados.padecimientos.length > 0) {
      notasACrear.push({
        contenido: `Padecimientos registrados: ${datosValidados.padecimientos.join(', ')}`,
        tipo: 'salud'
      })
    }

    // Alergias
    if (datosValidados.alergias && datosValidados.alergias.length > 0) {
      notasACrear.push({
        contenido: `Alergias registradas: ${datosValidados.alergias.join(', ')}`,
        tipo: 'salud'
      })
    }

    // Tratamientos
    if (datosValidados.tratamientos && datosValidados.tratamientos.length > 0) {
      notasACrear.push({
        contenido: `Tratamientos: ${datosValidados.tratamientos.map(t => `${t.descripcion} (${t.fechaInicio}${t.fechaFin ? ' - ' + t.fechaFin : ''})`).join(', ')}`,
        tipo: 'salud'
      })
    }

    // Vacunas detalladas
    if (datosValidados.vacunasDetalle && datosValidados.vacunasDetalle.length > 0) {
      notasACrear.push({
        contenido: `Vacunas aplicadas: ${datosValidados.vacunasDetalle.map(v => `${v.nombre} (${v.fecha}, Dr. ${v.veterinario})`).join(', ')}`,
        tipo: 'salud'
      })
    }

    // Crear todas las notas
    for (const nota of notasACrear) {
      await prisma.notaPerrito.create({
        data: {
          perritoId: perrito.id,
          contenido: nota.contenido,
          autor: session.user.name || 'Admin',
          tipo: nota.tipo
        }
      })
    }

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
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos inválidos',
          details: error.errors
        },
        { status: 400 }
      )
    }
    
    // Log más detalles del error
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    console.error('Error details:', errorMessage)
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
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
    
    // Validar parámetros de entrada
    const filtrosRaw = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      search: searchParams.get('search') || undefined,
      estado: searchParams.get('estado') || undefined,
      tamano: searchParams.get('tamano') || undefined,
      tipoIngreso: searchParams.get('tipoIngreso') || undefined,
      fechaInicio: searchParams.get('fechaInicio') || undefined,
      fechaFin: searchParams.get('fechaFin') || undefined,
      energia: searchParams.get('energia') || undefined,
      sexo: searchParams.get('sexo') || undefined,
      aptoNinos: searchParams.get('aptoNinos') ? searchParams.get('aptoNinos') === 'true' : undefined,
      aptoPerros: searchParams.get('aptoPerros') ? searchParams.get('aptoPerros') === 'true' : undefined,
      aptoGatos: searchParams.get('aptoGatos') ? searchParams.get('aptoGatos') === 'true' : undefined,
      vacunas: searchParams.get('vacunas') ? searchParams.get('vacunas') === 'true' : undefined,
      esterilizado: searchParams.get('esterilizado') ? searchParams.get('esterilizado') === 'true' : undefined,
      destacado: searchParams.get('destacado') ? searchParams.get('destacado') === 'true' : undefined
    }

    const filtros = filtrosPerritoSchema.parse(filtrosRaw)
    const { page, limit, search, ...otrosFiltros } = filtros

    // Construir condiciones where dinámicamente
    const where: any = {}

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { raza: { contains: search, mode: 'insensitive' } },
        { codigo: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Aplicar filtros directos
    Object.entries(otrosFiltros).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'fechaInicio' || key === 'fechaFin') {
          // Filtros de fecha para fechaIngreso
          if (!where.fechaIngreso) where.fechaIngreso = {}
          if (key === 'fechaInicio') {
            where.fechaIngreso.gte = new Date(value as string)
          } else {
            where.fechaIngreso.lte = new Date(value as string)
          }
        } else {
          where[key] = value
        }
      }
    })

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
      ).length,
      // Campos adicionales calculados
      diasEnRefugio: Math.floor((new Date().getTime() - perrito.fechaIngreso.getTime()) / (1000 * 60 * 60 * 24)),
      estadoSalud: {
        vacunas: perrito.vacunas,
        esterilizado: perrito.esterilizado,
        desparasitado: perrito.desparasitado
      }
    }))

    return NextResponse.json({
      perritos: perritosProcessed,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1
      },
      filtros: filtros,
      resumen: {
        disponibles: perritosProcessed.filter(p => p.estado === 'disponible').length,
        enProceso: perritosProcessed.filter(p => p.estado === 'proceso').length,
        adoptados: perritosProcessed.filter(p => p.estado === 'adoptado').length
      }
    })

  } catch (error) {
    console.error('Error fetching perritos:', error)
    
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