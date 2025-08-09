import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import QRCode from 'qrcode'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const campania = await prisma.campaniaDifusion.findUnique({
      where: { id: params.id }
    })

    if (!campania) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 })
    }

    // Construir URL con UTMs
    const qrUrl = `${process.env.NEXT_PUBLIC_URL || 'https://4tlixco.vercel.app'}/catalogo?utm_source=${campania.utm_source}&utm_medium=${campania.utm_medium}&utm_campaign=${campania.utm_campaign}`

    // Generar QR con alta calidad
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 512,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    return NextResponse.json({ 
      qrCode: qrDataUrl,
      url: qrUrl,
      campania: {
        nombre: campania.nombre,
        ubicacion: campania.ubicacion,
        tipo: campania.tipo
      }
    })
  } catch (error) {
    console.error('Error generating QR:', error)
    return NextResponse.json({ error: 'Error al generar QR' }, { status: 500 })
  }
}