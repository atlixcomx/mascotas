import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkPendingReminders, sendReminders, getReminderStats } from '../../../../lib/reminders'

// GET - Obtener recordatorios pendientes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'list'

    if (action === 'stats') {
      const stats = await getReminderStats()
      return NextResponse.json(stats)
    }

    const recordatorios = await checkPendingReminders()
    
    return NextResponse.json({
      recordatorios,
      resumen: {
        total: recordatorios.length,
        urgentes: recordatorios.filter(r => r.regla.tipo === 'urgente').length,
        normales: recordatorios.filter(r => r.regla.tipo === 'normal').length
      }
    })

  } catch (error) {
    console.error('Error fetching recordatorios:', error)
    return NextResponse.json(
      { error: 'Error al obtener recordatorios' },
      { status: 500 }
    )
  }
}

// POST - Ejecutar envío de recordatorios
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    if (action === 'send') {
      await sendReminders()
      
      return NextResponse.json({
        success: true,
        message: 'Recordatorios enviados exitosamente'
      })
    }

    return NextResponse.json(
      { error: 'Acción no válida' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error sending recordatorios:', error)
    return NextResponse.json(
      { error: 'Error al enviar recordatorios' },
      { status: 500 }
    )
  }
}