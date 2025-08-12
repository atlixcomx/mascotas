import { Resend } from 'resend'
import { emailTemplates } from './email-templates'

// Interface para el servicio de email
interface EmailOptions {
  to: string
  subject: string
  html: string
}

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Servicio de email con Resend
export class EmailService {
  static async send(options: EmailOptions): Promise<boolean> {
    try {
      // Verificar que tenemos la API key
      if (!process.env.RESEND_API_KEY) {
        console.error('❌ RESEND_API_KEY no está configurada')
        return false
      }

      // En sandbox, redirigir todos los emails a una dirección de prueba
      const recipientEmail = process.env.NODE_ENV === 'production' 
        ? options.to 
        : process.env.TEST_EMAIL || options.to

      // Agregar prefijo al asunto en modo sandbox
      const emailSubject = process.env.NODE_ENV === 'production'
        ? options.subject
        : `[TEST para: ${options.to}] ${options.subject}`

      // Enviar email con Resend
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'Centro de Adopción <onboarding@resend.dev>',
        to: recipientEmail,
        subject: emailSubject,
        html: options.html,
      })

      if (error) {
        console.error('Error al enviar email con Resend:', error)
        return false
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Email enviado exitosamente:')
        console.log('ID:', data?.id)
        console.log('De:', process.env.EMAIL_FROM || 'onboarding@resend.dev')
        console.log('Para (original):', options.to)
        console.log('Para (real):', recipientEmail)
        console.log('Asunto:', emailSubject)
        console.log('---')
      }

      return true
    } catch (error) {
      console.error('Error al enviar email:', error)
      return false
    }
  }

  // Método para enviar notificación de solicitud recibida
  static async sendSolicitudRecibida(data: {
    email: string
    nombreSolicitante: string
    nombrePerrito: string
    codigo: string
  }): Promise<boolean> {
    const template = emailTemplates.solicitudRecibida({
      nombreSolicitante: data.nombreSolicitante,
      nombrePerrito: data.nombrePerrito,
      codigo: data.codigo
    })

    return this.send({
      to: data.email,
      subject: template.subject,
      html: template.html
    })
  }

  // Método para enviar notificación de cambio de estado
  static async sendCambioEstado(data: {
    email: string
    nombreSolicitante: string
    nombrePerrito: string
    codigo: string
    nuevoEstado: string
    mensaje?: string
  }): Promise<boolean> {
    const template = emailTemplates.cambioEstado({
      nombreSolicitante: data.nombreSolicitante,
      nombrePerrito: data.nombrePerrito,
      codigo: data.codigo,
      nuevoEstado: data.nuevoEstado,
      mensaje: data.mensaje
    })

    return this.send({
      to: data.email,
      subject: template.subject,
      html: template.html
    })
  }

  // Método para enviar recordatorio de entrevista
  static async sendRecordatorioEntrevista(data: {
    email: string
    nombreSolicitante: string
    nombrePerrito: string
    fecha: string
    hora: string
  }): Promise<boolean> {
    const template = emailTemplates.recordatorioEntrevista({
      nombreSolicitante: data.nombreSolicitante,
      nombrePerrito: data.nombrePerrito,
      fecha: data.fecha,
      hora: data.hora
    })

    return this.send({
      to: data.email,
      subject: template.subject,
      html: template.html
    })
  }
}

// Función helper para formatear fechas en español
export function formatearFecha(fecha: Date): string {
  return fecha.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Función helper para formatear hora
export function formatearHora(fecha: Date): string {
  return fecha.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit'
  })
}