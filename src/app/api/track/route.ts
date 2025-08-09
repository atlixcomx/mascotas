import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { utm_source, utm_medium, utm_campaign } = data

    if (!utm_source || !utm_campaign) {
      return NextResponse.json({ error: 'Faltan parámetros UTM' }, { status: 400 })
    }

    // Buscar la campaña correspondiente
    const campania = await prisma.campaniaDifusion.findFirst({
      where: {
        utm_source,
        utm_medium: utm_medium || 'qr_code',
        utm_campaign,
        activa: true
      }
    })

    if (!campania) {
      // Si no encontramos la campaña, no es un error, simplemente no registramos
      return NextResponse.json({ tracked: false })
    }

    // Obtener información del visitante
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || null

    // Registrar la visita
    await prisma.visitaCampania.create({
      data: {
        campaniaId: campania.id,
        ipAddress: ipAddress.split(',')[0].trim(), // Tomar solo la primera IP si hay varias
        userAgent,
        referer
      }
    })

    return NextResponse.json({ tracked: true, campaniaId: campania.id })
  } catch (error) {
    console.error('Error tracking visit:', error)
    // No devolvemos error para no afectar la experiencia del usuario
    return NextResponse.json({ tracked: false })
  }
}