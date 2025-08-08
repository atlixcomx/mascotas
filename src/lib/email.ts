import { emailTemplates } from './email-templates'

// Interface para el servicio de email
interface EmailOptions {
  to: string
  subject: string
  html: string
}

// Servicio de email (puedes cambiar esto por SendGrid, AWS SES, etc.)
export class EmailService {
  static async send(options: EmailOptions): Promise<boolean> {
    try {
      // En producción, aquí irá la integración con tu servicio de email preferido
      // Por ejemplo, con SendGrid:
      // const sgMail = require('@sendgrid/mail')
      // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      // await sgMail.send({
      //   to: options.to,
      //   from: process.env.EMAIL_FROM,
      //   subject: options.subject,
      //   html: options.html
      // })

      // Por ahora, solo logueamos el email
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Email enviado:')
        console.log('Para:', options.to)
        console.log('Asunto:', options.subject)
        console.log('---')
      }

      // Simulamos el envío exitoso
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