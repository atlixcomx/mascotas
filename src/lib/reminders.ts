import { prisma } from '../../lib/db'
import { EmailService } from './email'
import { sendNotificationToAdmins } from './notifications'

export interface ReminderRule {
  estado: string
  diasLimite: number
  mensaje: string
  tipo: 'urgente' | 'normal'
  requiereEmail: boolean
}

// Configuración de recordatorios por estado
export const REMINDER_RULES: ReminderRule[] = [
  {
    estado: 'nueva',
    diasLimite: 2,
    mensaje: 'Solicitud nueva sin revisar por más de 2 días',
    tipo: 'urgente',
    requiereEmail: true
  },
  {
    estado: 'revision',
    diasLimite: 5,
    mensaje: 'Solicitud en revisión por más de 5 días',
    tipo: 'normal',
    requiereEmail: false
  },
  {
    estado: 'entrevista',
    diasLimite: 3,
    mensaje: 'Entrevista pendiente por más de 3 días',
    tipo: 'urgente',
    requiereEmail: true
  },
  {
    estado: 'prueba',
    diasLimite: 14,
    mensaje: 'Período de prueba por más de 14 días',
    tipo: 'normal',
    requiereEmail: false
  }
]

export interface SolicitudVencida {
  id: string
  codigo: string
  nombre: string
  email: string
  estado: string
  diasVencidos: number
  perrito: {
    nombre: string
  }
  fechaUltimaActualizacion: Date
  regla: ReminderRule
}

export async function checkPendingReminders(): Promise<SolicitudVencida[]> {
  const solicitudesVencidas: SolicitudVencida[] = []
  const ahora = new Date()

  for (const regla of REMINDER_RULES) {
    const fechaLimite = new Date()
    fechaLimite.setDate(fechaLimite.getDate() - regla.diasLimite)

    // Buscar solicitudes en este estado que excedan el límite de tiempo
    const solicitudes = await prisma.solicitud.findMany({
      where: {
        estado: regla.estado,
        updatedAt: {
          lt: fechaLimite
        }
      },
      include: {
        perrito: {
          select: {
            nombre: true
          }
        }
      },
      orderBy: {
        updatedAt: 'asc'
      }
    })

    for (const solicitud of solicitudes) {
      const diasVencidos = Math.floor(
        (ahora.getTime() - solicitud.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
      )

      solicitudesVencidas.push({
        id: solicitud.id,
        codigo: solicitud.codigo,
        nombre: solicitud.nombre,
        email: solicitud.email,
        estado: solicitud.estado,
        diasVencidos,
        perrito: solicitud.perrito,
        fechaUltimaActualizacion: solicitud.updatedAt,
        regla
      })
    }
  }

  return solicitudesVencidas.sort((a, b) => {
    // Urgentes primero, luego por días vencidos
    if (a.regla.tipo === 'urgente' && b.regla.tipo !== 'urgente') return -1
    if (a.regla.tipo !== 'urgente' && b.regla.tipo === 'urgente') return 1
    return b.diasVencidos - a.diasVencidos
  })
}

export async function sendReminders() {
  const solicitudesVencidas = await checkPendingReminders()
  
  if (solicitudesVencidas.length === 0) {
    console.log('No hay solicitudes que requieran recordatorios')
    return
  }

  // Agrupar por tipo de urgencia
  const urgentes = solicitudesVencidas.filter(s => s.regla.tipo === 'urgente')
  const normales = solicitudesVencidas.filter(s => s.regla.tipo === 'normal')

  // Enviar notificaciones en tiempo real
  for (const solicitud of solicitudesVencidas) {
    const estadoLabels: { [key: string]: string } = {
      'nueva': 'Nueva',
      'revision': 'En Revisión',
      'entrevista': 'Entrevista',
      'prueba': 'Período de Prueba'
    }

    sendNotificationToAdmins({
      type: 'recordatorio',
      title: `Recordatorio: ${solicitud.codigo}`,
      message: `${solicitud.regla.mensaje}. Solicitud de ${solicitud.nombre} para adoptar a ${solicitud.perrito.nombre} (${solicitud.diasVencidos} días)`,
      solicitudId: solicitud.id,
      data: {
        tipo: solicitud.regla.tipo,
        diasVencidos: solicitud.diasVencidos,
        estado: estadoLabels[solicitud.estado],
        solicitante: solicitud.nombre,
        perrito: solicitud.perrito.nombre
      }
    })
  }

  // Enviar email resumen si hay solicitudes urgentes o más de 5 normales
  const requiereEmail = urgentes.length > 0 || normales.length > 5
  
  if (requiereEmail && process.env.ADMIN_EMAIL) {
    await sendReminderEmail(solicitudesVencidas, urgentes, normales)
  }

  console.log(`Recordatorios enviados: ${solicitudesVencidas.length} solicitudes (${urgentes.length} urgentes, ${normales.length} normales)`)
}

async function sendReminderEmail(
  todas: SolicitudVencida[],
  urgentes: SolicitudVencida[],
  normales: SolicitudVencida[]
) {
  const estadoLabels: { [key: string]: string } = {
    'nueva': 'Nueva',
    'revision': 'En Revisión',
    'entrevista': 'Entrevista',
    'prueba': 'Período de Prueba'
  }

  const urgentesHtml = urgentes.length > 0 ? `
    <div style="margin: 20px 0; padding: 15px; background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 6px;">
      <h3 style="color: #dc2626; margin: 0 0 15px 0;">🚨 Solicitudes Urgentes (${urgentes.length})</h3>
      ${urgentes.map(s => `
        <div style="margin: 10px 0; padding: 10px; background-color: white; border-radius: 4px;">
          <p style="margin: 0; font-weight: 600;">
            <a href="${process.env.NEXTAUTH_URL}/admin/solicitudes/${s.id}" style="color: #dc2626; text-decoration: none;">
              ${s.codigo} - ${s.perrito.nombre}
            </a>
          </p>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
            ${s.nombre} • ${estadoLabels[s.estado]} • <strong>${s.diasVencidos} días vencido</strong>
          </p>
          <p style="margin: 5px 0 0 0; font-size: 13px; color: #999;">
            ${s.regla.mensaje}
          </p>
        </div>
      `).join('')}
    </div>
  ` : ''

  const normalesHtml = normales.length > 0 ? `
    <div style="margin: 20px 0; padding: 15px; background-color: #fefbf3; border-left: 4px solid #f59e0b; border-radius: 6px;">
      <h3 style="color: #d97706; margin: 0 0 15px 0;">⏰ Recordatorios Normales (${normales.length})</h3>
      ${normales.slice(0, 10).map(s => `
        <div style="margin: 8px 0; padding: 8px; background-color: white; border-radius: 4px;">
          <p style="margin: 0;">
            <a href="${process.env.NEXTAUTH_URL}/admin/solicitudes/${s.id}" style="color: #d97706; text-decoration: none;">
              ${s.codigo} - ${s.perrito.nombre}
            </a>
          </p>
          <p style="margin: 3px 0 0 0; font-size: 13px; color: #666;">
            ${s.nombre} • ${estadoLabels[s.estado]} • ${s.diasVencidos} días
          </p>
        </div>
      `).join('')}
      ${normales.length > 10 ? `<p style="font-size: 13px; color: #999; margin: 10px 0 0 0;">... y ${normales.length - 10} más</p>` : ''}
    </div>
  ` : ''

  const resumenHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">📋 Resumen de Recordatorios</h1>
        <p style="color: #e0e7ff; margin: 10px 0 0 0;">Centro de Adopción - ${new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      <div style="padding: 20px; background-color: #f8fafc; border-radius: 0 0 8px 8px;">
        <div style="background: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin: 0 0 15px 0;">Solicitudes que Requieren Atención</h2>
          <div style="display: flex; gap: 20px; justify-content: space-around; margin: 20px 0;">
            <div style="text-align: center; padding: 15px; background-color: #fef2f2; border-radius: 8px; flex: 1;">
              <div style="font-size: 24px; font-weight: bold; color: #dc2626;">${urgentes.length}</div>
              <div style="font-size: 14px; color: #6b7280;">Urgentes</div>
            </div>
            <div style="text-align: center; padding: 15px; background-color: #fefbf3; border-radius: 8px; flex: 1;">
              <div style="font-size: 24px; font-weight: bold; color: #d97706;">${normales.length}</div>
              <div style="font-size: 14px; color: #6b7280;">Normales</div>
            </div>
            <div style="text-align: center; padding: 15px; background-color: #f0f9ff; border-radius: 8px; flex: 1;">
              <div style="font-size: 24px; font-weight: bold; color: #0369a1;">${todas.length}</div>
              <div style="font-size: 14px; color: #6b7280;">Total</div>
            </div>
          </div>
        </div>

        ${urgentesHtml}
        ${normalesHtml}

        <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 6px; text-align: center;">
          <p style="margin: 0 0 15px 0; color: #6b7280;">Accede al panel de administración para gestionar todas las solicitudes:</p>
          <a href="${process.env.NEXTAUTH_URL}/admin/solicitudes" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Ver Panel de Solicitudes
          </a>
        </div>
      </div>
    </div>
  `

  await EmailService.send({
    to: process.env.ADMIN_EMAIL!,
    subject: `📋 Recordatorios de Adopción - ${todas.length} solicitudes requieren atención`,
    html: resumenHtml
  })
}

// Función para obtener estadísticas de recordatorios
export async function getReminderStats() {
  const solicitudesVencidas = await checkPendingReminders()
  
  const stats = {
    total: solicitudesVencidas.length,
    urgentes: solicitudesVencidas.filter(s => s.regla.tipo === 'urgente').length,
    normales: solicitudesVencidas.filter(s => s.regla.tipo === 'normal').length,
    porEstado: {} as { [key: string]: number },
    promedioVencimiento: 0
  }

  // Contar por estado
  for (const solicitud of solicitudesVencidas) {
    stats.porEstado[solicitud.estado] = (stats.porEstado[solicitud.estado] || 0) + 1
  }

  // Calcular promedio de días vencidos
  if (solicitudesVencidas.length > 0) {
    const totalDias = solicitudesVencidas.reduce((sum, s) => sum + s.diasVencidos, 0)
    stats.promedioVencimiento = Math.round(totalDias / solicitudesVencidas.length)
  }

  return stats
}