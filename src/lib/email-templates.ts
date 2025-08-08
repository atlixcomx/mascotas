export const emailTemplates = {
  solicitudRecibida: (data: {
    nombreSolicitante: string
    nombrePerrito: string
    codigo: string
  }) => ({
    subject: `Solicitud de adopción recibida - ${data.nombrePerrito}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #af1731;
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background-color: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #af1731;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .info-box {
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border: 1px solid #e2e8f0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>¡Gracias por tu solicitud!</h1>
          </div>
          <div class="content">
            <p>Hola ${data.nombreSolicitante},</p>
            
            <p>Hemos recibido tu solicitud de adopción para <strong>${data.nombrePerrito}</strong>. 
            Estamos muy emocionados de que quieras darle un hogar lleno de amor.</p>
            
            <div class="info-box">
              <h3>Detalles de tu solicitud:</h3>
              <p><strong>Código de solicitud:</strong> ${data.codigo}</p>
              <p><strong>Mascota solicitada:</strong> ${data.nombrePerrito}</p>
              <p><strong>Estado actual:</strong> En revisión</p>
            </div>
            
            <h3>¿Qué sigue?</h3>
            <ol>
              <li>Revisaremos tu solicitud en las próximas 48 horas</li>
              <li>Te contactaremos para agendar una entrevista</li>
              <li>Si todo va bien, coordinaremos una visita para que conozcas a ${data.nombrePerrito}</li>
              <li>Período de prueba de 7 días</li>
              <li>¡Adopción completada!</li>
            </ol>
            
            <p>Te mantendremos informado sobre el progreso de tu solicitud por correo electrónico.</p>
            
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            
            <p>¡Gracias por elegir adoptar!</p>
          </div>
          <div class="footer">
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            <p>&copy; 2024 Refugio Atlixco. Todos los derechos reservados.</p>
          </div>
        </body>
      </html>
    `
  }),

  cambioEstado: (data: {
    nombreSolicitante: string
    nombrePerrito: string
    codigo: string
    nuevoEstado: string
    mensaje?: string
  }) => {
    const estados = {
      revision: {
        titulo: 'Tu solicitud está en revisión',
        mensaje: 'Nuestro equipo está revisando tu solicitud. Te contactaremos pronto.',
        color: '#f59e0b'
      },
      entrevista: {
        titulo: '¡Es hora de conocernos!',
        mensaje: 'Tu solicitud ha sido pre-aprobada. Nos pondremos en contacto contigo para agendar una entrevista.',
        color: '#8b5cf6'
      },
      prueba: {
        titulo: '¡Período de prueba iniciado!',
        mensaje: `¡Felicidades! ${data.nombrePerrito} está listo para ir a casa contigo por un período de prueba de 7 días.`,
        color: '#f97316'
      },
      aprobada: {
        titulo: '¡Adopción completada!',
        mensaje: `¡Felicidades! ${data.nombrePerrito} ahora es oficialmente parte de tu familia. Gracias por darle un hogar lleno de amor.`,
        color: '#10b981'
      },
      rechazada: {
        titulo: 'Actualización de tu solicitud',
        mensaje: 'Lamentablemente, no podemos proceder con tu solicitud en este momento. No te desanimes, hay muchos otros perritos esperando un hogar.',
        color: '#ef4444'
      }
    }

    const estadoInfo = estados[data.nuevoEstado as keyof typeof estados] || estados.revision

    return {
      subject: `Actualización de tu solicitud - ${data.nombrePerrito}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background-color: ${estadoInfo.color};
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background-color: #f8f9fa;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .status-box {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border: 2px solid ${estadoInfo.color};
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: ${estadoInfo.color};
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${estadoInfo.titulo}</h1>
            </div>
            <div class="content">
              <p>Hola ${data.nombreSolicitante},</p>
              
              <p>Tenemos una actualización sobre tu solicitud de adopción.</p>
              
              <div class="status-box">
                <h3>Estado de tu solicitud:</h3>
                <p><strong>Código:</strong> ${data.codigo}</p>
                <p><strong>Mascota:</strong> ${data.nombrePerrito}</p>
                <p><strong>Nuevo estado:</strong> ${estadoInfo.titulo}</p>
              </div>
              
              <p>${estadoInfo.mensaje}</p>
              
              ${data.mensaje ? `<p><strong>Nota adicional:</strong> ${data.mensaje}</p>` : ''}
              
              ${data.nuevoEstado === 'entrevista' ? `
                <h3>Prepárate para la entrevista:</h3>
                <ul>
                  <li>Ten a mano información sobre tu vivienda</li>
                  <li>Piensa en tu rutina diaria y cómo incluirías a ${data.nombrePerrito}</li>
                  <li>Prepara cualquier pregunta que tengas sobre el cuidado de ${data.nombrePerrito}</li>
                </ul>
              ` : ''}
              
              ${data.nuevoEstado === 'prueba' ? `
                <h3>Consejos para el período de prueba:</h3>
                <ul>
                  <li>Dale tiempo a ${data.nombrePerrito} para adaptarse</li>
                  <li>Mantén una rutina consistente</li>
                  <li>Observa su comportamiento y anota cualquier pregunta</li>
                  <li>Disfruta conociendo a tu nuevo amigo</li>
                </ul>
              ` : ''}
              
              ${data.nuevoEstado === 'aprobada' ? `
                <h3>¡Bienvenido a la familia!</h3>
                <p>Nos encanta saber que ${data.nombrePerrito} ha encontrado un hogar amoroso. 
                Recuerda que siempre estaremos aquí para apoyarte en este hermoso viaje.</p>
                
                <h3>Recursos útiles:</h3>
                <ul>
                  <li>Guía de cuidados básicos</li>
                  <li>Contactos de veterinarios recomendados</li>
                  <li>Grupos de apoyo para adoptantes</li>
                </ul>
              ` : ''}
              
              <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            </div>
            <div class="footer">
              <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
              <p>&copy; 2024 Refugio Atlixco. Todos los derechos reservados.</p>
            </div>
          </body>
        </html>
      `
    }
  },

  recordatorioEntrevista: (data: {
    nombreSolicitante: string
    nombrePerrito: string
    fecha: string
    hora: string
  }) => ({
    subject: `Recordatorio: Entrevista de adopción - ${data.nombrePerrito}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #8b5cf6;
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background-color: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .appointment-box {
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border: 2px solid #8b5cf6;
              text-align: center;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Recordatorio de Entrevista</h1>
          </div>
          <div class="content">
            <p>Hola ${data.nombreSolicitante},</p>
            
            <p>Te recordamos que tienes una entrevista programada para la adopción de <strong>${data.nombrePerrito}</strong>.</p>
            
            <div class="appointment-box">
              <h2>📅 ${data.fecha}</h2>
              <h2>🕐 ${data.hora}</h2>
              <p>Refugio Atlixco</p>
            </div>
            
            <h3>Qué traer:</h3>
            <ul>
              <li>Identificación oficial</li>
              <li>Comprobante de domicilio</li>
              <li>Referencias (si las tienes)</li>
              <li>¡Muchas ganas de conocer a ${data.nombrePerrito}!</li>
            </ul>
            
            <p>Si necesitas reagendar, por favor contáctanos lo antes posible.</p>
            
            <p>¡Nos vemos pronto!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Refugio Atlixco. Todos los derechos reservados.</p>
          </div>
        </body>
      </html>
    `
  })
}