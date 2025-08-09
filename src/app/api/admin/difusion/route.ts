import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

function generateCampaignCode() {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 5)
  return `CAMP-${timestamp}-${random}`.toUpperCase()
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const campanias = await prisma.campaniaDifusion.findMany({
      include: {
        visitas: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calcular estadísticas
    const campaniasConEstadisticas = campanias.map(campania => {
      const totalVisitas = campania.visitas.length
      
      // Para conversiones, buscaremos solicitudes que tengan el origenQR con los UTMs de esta campaña
      return {
        id: campania.id,
        codigo: campania.codigo,
        nombre: campania.nombre,
        ubicacion: campania.ubicacion,
        tipo: campania.tipo,
        utm_source: campania.utm_source,
        utm_medium: campania.utm_medium,
        utm_campaign: campania.utm_campaign,
        descripcion: campania.descripcion,
        activa: campania.activa,
        url: `${process.env.NEXT_PUBLIC_URL || 'https://4tlixco.vercel.app'}/catalogo?utm_source=${campania.utm_source}&utm_medium=${campania.utm_medium}&utm_campaign=${campania.utm_campaign}`,
        scans: totalVisitas,
        conversiones: 0, // Se actualizará cuando tengamos el tracking completo
        fechaCreacion: campania.createdAt
      }
    })

    return NextResponse.json(campaniasConEstadisticas)
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json({ error: 'Error al obtener campañas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await request.json()
    
    // Validar datos requeridos
    if (!data.nombre || !data.ubicacion || !data.tipo || !data.utm_source || !data.utm_campaign) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }

    // Generar código único
    const codigo = generateCampaignCode()

    const nuevaCampania = await prisma.campaniaDifusion.create({
      data: {
        codigo,
        nombre: data.nombre,
        ubicacion: data.ubicacion,
        tipo: data.tipo,
        utm_source: data.utm_source,
        utm_medium: data.utm_medium || 'qr_code',
        utm_campaign: data.utm_campaign,
        descripcion: data.descripcion,
        activa: true
      }
    })

    const url = `${process.env.NEXT_PUBLIC_URL || 'https://4tlixco.vercel.app'}/catalogo?utm_source=${nuevaCampania.utm_source}&utm_medium=${nuevaCampania.utm_medium}&utm_campaign=${nuevaCampania.utm_campaign}`

    return NextResponse.json({
      ...nuevaCampania,
      url,
      scans: 0,
      conversiones: 0
    })
  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json({ error: 'Error al crear campaña' }, { status: 500 })
  }
}