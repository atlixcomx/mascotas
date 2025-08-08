import { NextRequest, NextResponse } from 'next/server'
import { sendReminders } from '../../../../lib/reminders'

// GET endpoint para ejecutar recordatorios automáticos
// Este endpoint puede ser llamado por servicios externos como cron jobs
export async function GET(request: NextRequest) {
  try {
    // Verificar que la petición incluye el token de autorización correcto
    const authHeader = request.headers.get('authorization')
    const cronToken = process.env.CRON_SECRET_TOKEN
    
    if (!cronToken) {
      console.error('CRON_SECRET_TOKEN no configurado en variables de entorno')
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta' },
        { status: 500 }
      )
    }
    
    if (!authHeader || authHeader !== `Bearer ${cronToken}`) {
      console.error('Token de autorización inválido para cron job')
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    console.log('Ejecutando envío automático de recordatorios...')
    await sendReminders()
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Recordatorios enviados exitosamente'
    })

  } catch (error) {
    console.error('Error en cron job de recordatorios:', error)
    return NextResponse.json(
      { 
        error: 'Error al ejecutar recordatorios automáticos',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// POST endpoint alternativo
export async function POST(request: NextRequest) {
  return GET(request)
}