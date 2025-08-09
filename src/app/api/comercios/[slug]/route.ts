import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const comercio = await prisma.comercio.findUnique({
      where: {
        slug: params.slug
      },
      select: {
        id: true,
        nombre: true,
        slug: true,
        categoria: true,
        logo: true,
        descripcion: true,
        direccion: true,
        telefono: true,
        email: true,
        website: true,
        horarios: true,
        servicios: true,
        restricciones: true,
        certificado: true,
        fechaCert: true,
        latitud: true,
        longitud: true
      }
    })

    if (!comercio) {
      return NextResponse.json(
        { error: 'Comercio no encontrado' },
        { status: 404 }
      )
    }

    // Procesar servicios si es necesario
    let serviciosProcessed = comercio.servicios
    if (comercio.servicios && typeof comercio.servicios === 'string') {
      try {
        if (comercio.servicios.startsWith('[')) {
          serviciosProcessed = JSON.parse(comercio.servicios)
        }
      } catch (e) {
        // Si no se puede parsear, mantener como string
      }
    }

    return NextResponse.json({
      ...comercio,
      servicios: serviciosProcessed
    })

  } catch (error) {
    console.error('Error fetching comercio:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        message: 'No se pudo obtener el comercio'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}