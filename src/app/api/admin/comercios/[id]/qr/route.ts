import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Obtener el comercio
    const comercio = await prisma.comercio.findUnique({
      where: { id: params.id }
    })

    if (!comercio) {
      return NextResponse.json(
        { error: 'Comercio no encontrado' },
        { status: 404 }
      )
    }

    // URL que contendrá el QR - puede ser la página del comercio o una URL especial
    const qrUrl = `${process.env.NEXT_PUBLIC_URL || 'https://4tlixco.vercel.app'}/comercios/${comercio.slug}`
    
    // Generar QR en formato base64
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H' // Alto nivel de corrección de errores
    })

    // También podemos generar el QR como SVG para mejor calidad
    const qrSvg = await QRCode.toString(qrUrl, {
      type: 'svg',
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })

    return NextResponse.json({
      comercio: {
        id: comercio.id,
        nombre: comercio.nombre,
        codigo: comercio.codigo,
        url: qrUrl
      },
      qr: {
        dataUrl: qrDataUrl,
        svg: qrSvg
      }
    })
  } catch (error) {
    console.error('Error generating QR:', error)
    return NextResponse.json(
      { error: 'Error al generar QR' },
      { status: 500 }
    )
  }
}