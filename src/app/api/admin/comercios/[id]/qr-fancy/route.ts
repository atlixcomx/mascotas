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

    // URL que contendrá el QR - dirigir al catálogo de adopción
    const qrUrl = `${process.env.NEXT_PUBLIC_URL || 'https://4tlixco.vercel.app'}/catalogo`
    
    // Configuración de colores basada en la categoría
    const categoryColors = {
      veterinaria: { dark: '#dc2626', light: '#fee2e2' },
      petshop: { dark: '#9333ea', light: '#fdf4ff' },
      hotel: { dark: '#0891b2', light: '#f0f9ff' },
      restaurante: { dark: '#ea580c', light: '#fff7ed' },
      cafe: { dark: '#84cc16', light: '#f7fee7' },
      parque: { dark: '#16a34a', light: '#f0fdf4' },
      otro: { dark: '#6b7280', light: '#f9fafb' }
    }

    const colors = categoryColors[comercio.categoria as keyof typeof categoryColors] || categoryColors.otro

    // Generar QR con módulos redondeados usando canvas personalizado
    const qrCanvas = await QRCode.toCanvas(qrUrl, {
      width: 400,
      margin: 4,
      color: {
        dark: colors.dark,
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H',
      rendererOpts: {
        quality: 1
      }
    })

    // Convertir canvas a data URL
    const qrDataUrl = qrCanvas.toDataURL('image/png')

    // SVG con diseño personalizado
    const qrSvgCustom = `
<svg width="420" height="500" xmlns="http://www.w3.org/2000/svg">
  <!-- Fondo con patrón de huellas -->
  <defs>
    <pattern id="paws" patternUnits="userSpaceOnUse" width="60" height="60">
      <path d="M15,20 Q15,15 20,15 Q25,15 25,20 Q25,25 20,25 Q15,25 15,20" fill="${colors.light}" opacity="0.5"/>
      <path d="M35,20 Q35,15 40,15 Q45,15 45,20 Q45,25 40,25 Q35,25 35,20" fill="${colors.light}" opacity="0.5"/>
      <path d="M15,40 Q15,35 20,35 Q25,35 25,40 Q25,45 20,45 Q15,45 15,40" fill="${colors.light}" opacity="0.5"/>
      <path d="M35,40 Q35,35 40,35 Q45,35 45,40 Q45,45 40,45 Q35,45 35,40" fill="${colors.light}" opacity="0.5"/>
      <ellipse cx="30" cy="30" rx="8" ry="10" fill="${colors.light}" opacity="0.5"/>
    </pattern>
  </defs>
  
  <!-- Fondo -->
  <rect width="420" height="500" fill="white"/>
  <rect width="420" height="500" fill="url(#paws)"/>
  
  <!-- Marco decorativo -->
  <rect x="10" y="10" width="400" height="400" rx="20" ry="20" fill="white" stroke="${colors.dark}" stroke-width="4"/>
  
  <!-- Placeholder para QR (se insertará el QR real aquí) -->
  <rect x="20" y="20" width="380" height="380" fill="${colors.light}"/>
  
  <!-- Texto inferior -->
  <text x="210" y="440" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${colors.dark}">
    ${comercio.nombre}
  </text>
  <text x="210" y="465" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">
    ¡Pet Friendly Atlixco!
  </text>
  
  <!-- Decoración de patitas -->
  <g transform="translate(160, 470)">
    <path d="M0,5 Q0,0 5,0 Q10,0 10,5 Q10,10 5,10 Q0,10 0,5" fill="${colors.dark}"/>
    <path d="M15,5 Q15,0 20,0 Q25,0 25,5 Q25,10 20,10 Q15,10 15,5" fill="${colors.dark}"/>
    <path d="M30,5 Q30,0 35,0 Q40,0 40,5 Q40,10 35,10 Q30,10 30,5" fill="${colors.dark}"/>
    <path d="M45,5 Q45,0 50,0 Q55,0 55,5 Q55,10 50,10 Q45,10 45,5" fill="${colors.dark}"/>
    <path d="M60,5 Q60,0 65,0 Q70,0 70,5 Q70,10 65,10 Q60,10 60,5" fill="${colors.dark}"/>
    <path d="M75,5 Q75,0 80,0 Q85,0 85,5 Q85,10 80,10 Q75,10 75,5" fill="${colors.dark}"/>
    <path d="M90,5 Q90,0 95,0 Q100,0 100,5 Q100,10 95,10 Q90,10 90,5" fill="${colors.dark}"/>
  </g>
</svg>`

    // Generar el QR estándar también
    const standardQr = await QRCode.toString(qrUrl, {
      type: 'svg',
      width: 380,
      margin: 0,
      color: {
        dark: colors.dark,
        light: 'transparent'
      },
      errorCorrectionLevel: 'H'
    })

    return NextResponse.json({
      comercio: {
        id: comercio.id,
        nombre: comercio.nombre,
        codigo: comercio.codigo,
        categoria: comercio.categoria,
        url: qrUrl
      },
      qr: {
        dataUrl: qrDataUrl,
        svg: qrSvgCustom,
        svgQrOnly: standardQr,
        colors: colors
      }
    })
  } catch (error) {
    console.error('Error generating fancy QR:', error)
    return NextResponse.json(
      { error: 'Error al generar QR personalizado' },
      { status: 500 }
    )
  }
}