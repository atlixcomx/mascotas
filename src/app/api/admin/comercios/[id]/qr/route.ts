import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { prisma } from '@/lib/db'

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

    // URL que contendrá el QR - página de certificación del comercio
    const qrUrl = `${process.env.NEXT_PUBLIC_URL || 'https://4tlixco.vercel.app'}/comercios/${comercio.slug}`
    
    // Configuración de colores basada en la categoría
    const categoryColors = {
      veterinaria: { dark: '#dc2626', light: '#fef2f2' },
      petshop: { dark: '#9333ea', light: '#fdf4ff' },
      hotel: { dark: '#0891b2', light: '#f0f9ff' },
      restaurante: { dark: '#ea580c', light: '#fff7ed' },
      cafe: { dark: '#84cc16', light: '#f7fee7' },
      parque: { dark: '#16a34a', light: '#f0fdf4' },
      otro: { dark: '#6b7280', light: '#f9fafb' }
    }

    const colors = categoryColors[comercio.categoria as keyof typeof categoryColors] || categoryColors.otro

    // Generar QR en formato base64 con estilo personalizado
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: colors.dark,
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H', // Alto nivel de corrección de errores para permitir logo
      type: 'image/png',
      rendererOpts: {
        quality: 1
      }
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