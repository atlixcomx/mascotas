import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { EmailService } from '@/lib/email'

// Número de WhatsApp del centro (configurar en .env)
const WHATSAPP_CENTRO = process.env.WHATSAPP_CENTRO || '5215549125610'

// Email del centro para notificaciones
const EMAIL_CENTRO = process.env.EMAIL_CENTRO || 'jalcazaro4@gmail.com'

// Generar código único para la solicitud
function generarCodigo(): string {
  const fecha = new Date()
  const año = fecha.getFullYear().toString().slice(-2)
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `SOL${año}${mes}${random}`
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validar datos requeridos
    if (!data.nombre?.trim()) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      )
    }

    if (!data.apellido?.trim()) {
      return NextResponse.json(
        { error: 'El apellido es requerido' },
        { status: 400 }
      )
    }

    if (!data.whatsapp?.trim()) {
      return NextResponse.json(
        { error: 'El número de WhatsApp es requerido' },
        { status: 400 }
      )
    }

    // Validar formato de teléfono (exactamente 10 dígitos)
    const telefonoLimpio = data.whatsapp.replace(/\D/g, '')
    if (telefonoLimpio.length !== 10) {
      return NextResponse.json(
        { error: 'El número de WhatsApp debe tener exactamente 10 dígitos' },
        { status: 400 }
      )
    }

    if (!data.perritoId) {
      return NextResponse.json(
        { error: 'El ID del perrito es requerido' },
        { status: 400 }
      )
    }

    // Verificar que el perrito existe
    const perrito = await prisma.perrito.findUnique({
      where: { id: data.perritoId }
    })

    if (!perrito) {
      return NextResponse.json(
        { error: 'El perrito no existe' },
        { status: 404 }
      )
    }

    // Nombre completo
    const nombreCompleto = `${data.nombre.trim()} ${data.apellido.trim()}`

    // Crear solicitud usando la tabla existente con valores por defecto
    const solicitud = await prisma.solicitud.create({
      data: {
        codigo: generarCodigo(),
        perritoId: data.perritoId,
        nombre: nombreCompleto,
        telefono: telefonoLimpio,
        email: data.email?.trim() || 'no-proporcionado@temporal.com',
        edad: 18, // Valor por defecto
        direccion: 'Pendiente de confirmar',
        ciudad: 'Atlixco',
        codigoPostal: '74200',
        tipoVivienda: 'Pendiente',
        tienePatio: false,
        experiencia: 'Pendiente de entrevista',
        motivoAdopcion: 'Solicitud rápida - contactar por WhatsApp',
        estado: 'nueva'
      },
      include: {
        perrito: true
      }
    })

    // Construir mensaje para WhatsApp del centro
    const mensaje = `🐕 *Nueva solicitud de adopción*

*Código:* ${solicitud.codigo}
*Perrito:* ${perrito.nombre} (${perrito.codigo})

*Datos del interesado:*
• Nombre: ${nombreCompleto}
• WhatsApp: ${telefonoLimpio}${data.email ? `\n• Email: ${data.email}` : ''}

*Fecha:* ${new Date().toLocaleDateString('es-MX', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

Por favor contactar al interesado a la brevedad.`

    // URL de WhatsApp para el centro (backup)
    const whatsappUrl = `https://wa.me/${WHATSAPP_CENTRO}?text=${encodeURIComponent(mensaje)}`

    // Enviar email de notificación al centro automáticamente
    try {
      await EmailService.send({
        to: EMAIL_CENTRO,
        subject: `🐕 Nueva solicitud de adopción - ${perrito.nombre} (${solicitud.codigo})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0e312d 0%, #1a4a45 100%); padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Nueva Solicitud de Adopción</h1>
            </div>

            <div style="background: #f8f9fa; padding: 24px; border: 1px solid #e5e7eb;">
              <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 16px;">
                <h2 style="color: #0e312d; margin: 0 0 16px 0; font-size: 18px;">📋 Datos de la Solicitud</h2>
                <p style="margin: 8px 0;"><strong>Código:</strong> ${solicitud.codigo}</p>
                <p style="margin: 8px 0;"><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>

              <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 16px;">
                <h2 style="color: #0e312d; margin: 0 0 16px 0; font-size: 18px;">🐕 Perrito Solicitado</h2>
                <p style="margin: 8px 0;"><strong>Nombre:</strong> ${perrito.nombre}</p>
                <p style="margin: 8px 0;"><strong>Código:</strong> ${perrito.codigo}</p>
              </div>

              <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 16px;">
                <h2 style="color: #0e312d; margin: 0 0 16px 0; font-size: 18px;">👤 Datos del Interesado</h2>
                <p style="margin: 8px 0;"><strong>Nombre:</strong> ${nombreCompleto}</p>
                <p style="margin: 8px 0;"><strong>WhatsApp:</strong> <a href="https://wa.me/52${telefonoLimpio}" style="color: #25D366;">${telefonoLimpio}</a></p>
                ${data.email ? `<p style="margin: 8px 0;"><strong>Email:</strong> ${data.email}</p>` : ''}
              </div>

              <div style="text-align: center; margin-top: 24px;">
                <a href="https://wa.me/52${telefonoLimpio}" style="display: inline-block; background: #25D366; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-right: 8px;">
                  💬 Contactar por WhatsApp
                </a>
              </div>
            </div>

            <div style="background: #0e312d; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 12px;">
                Centro Municipal de Adopción y Bienestar Animal de Atlixco
              </p>
            </div>
          </div>
        `
      })
      console.log('Email de notificación enviado a:', EMAIL_CENTRO)
    } catch (emailError) {
      console.error('Error al enviar email de notificación:', emailError)
      // No fallamos la solicitud si el email falla
    }

    return NextResponse.json({
      success: true,
      codigo: solicitud.codigo,
      perritoNombre: perrito.nombre,
      whatsappUrl,
      message: '¡Gracias por tu interés! El centro se pondrá en contacto contigo pronto.'
    })

  } catch (error) {
    console.error('Error al crear solicitud de adopción:', error)

    return NextResponse.json(
      { error: 'Error al procesar la solicitud. Por favor intenta nuevamente.' },
      { status: 500 }
    )
  }
}
