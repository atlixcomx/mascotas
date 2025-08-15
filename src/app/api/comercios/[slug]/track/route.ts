import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    // Buscar el comercio por slug
    const comercio = await prisma.comercio.findUnique({
      where: { slug }
    })

    if (!comercio) {
      return NextResponse.json({ error: 'Comercio no encontrado' }, { status: 404 })
    }

    // Obtener información del visitante
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || null

    // Incrementar contador de escaneos QR
    await prisma.comercio.update({
      where: { id: comercio.id },
      data: {
        qrEscaneos: {
          increment: 1
        }
      }
    })

    // Registrar el escaneo para analytics
    await prisma.qrScan.create({
      data: {
        comercioId: comercio.id,
        ipAddress: ipAddress.split(',')[0].trim(),
        userAgent,
        referer,
        timestamp: new Date()
      }
    })

    return NextResponse.json({ 
      success: true, 
      comercioId: comercio.id,
      escaneos: comercio.qrEscaneos + 1
    })
  } catch (error) {
    console.error('Error tracking QR scan:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}