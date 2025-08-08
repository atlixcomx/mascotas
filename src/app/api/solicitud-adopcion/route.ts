import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { EmailService } from '../../../lib/email'

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
    const requiredFields = [
      'nombre',
      'email',
      'telefono',
      'direccion',
      'ciudad',
      'codigoPostal',
      'edad',
      'tipoVivienda',
      'experiencia',
      'motivoAdopcion',
      'perritoId'
    ]

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `El campo ${field} es requerido` },
          { status: 400 }
        )
      }
    }
    
    // Validar que la edad sea un número válido
    const edad = parseInt(data.edad)
    if (isNaN(edad) || edad < 18 || edad > 100) {
      return NextResponse.json(
        { error: 'La edad debe ser un número válido entre 18 y 100 años' },
        { status: 400 }
      )
    }

    // Verificar que el perrito existe y está disponible
    const perrito = await prisma.perrito.findUnique({
      where: { id: data.perritoId }
    })

    if (!perrito) {
      return NextResponse.json(
        { error: 'El perrito no existe' },
        { status: 404 }
      )
    }

    if (perrito.estado !== 'disponible') {
      return NextResponse.json(
        { error: 'Este perrito no está disponible para adopción' },
        { status: 400 }
      )
    }

    // Verificar si ya existe una solicitud activa del mismo email para el mismo perrito
    const solicitudExistente = await prisma.solicitud.findFirst({
      where: {
        email: data.email,
        perritoId: data.perritoId,
        estado: {
          notIn: ['rechazada', 'cancelada']
        }
      }
    })

    if (solicitudExistente) {
      return NextResponse.json(
        { error: 'Ya tienes una solicitud activa para este perrito' },
        { status: 400 }
      )
    }

    // Crear la solicitud
    const codigo = generarCodigo()
    
    // Preparar datos para inserción en la base de datos
    const solicitudData = {
      codigo,
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      direccion: data.direccion,
      ciudad: data.ciudad,
      codigoPostal: data.codigoPostal,  
      edad: edad,
      tipoVivienda: data.tipoVivienda,
      tienePatio: data.tienePatio === true || data.tienePatio === 'true',
      experiencia: data.experiencia,
      otrasMascotas: data.otrasMascotas || '',
      motivoAdopcion: data.motivoAdopcion,
      estado: 'nueva',
      perritoId: data.perritoId
    }
    
    const solicitud = await prisma.solicitud.create({
      data: solicitudData,
      include: {
        perrito: true
      }
    })

    // Enviar email de confirmación
    await EmailService.sendSolicitudRecibida({
      email: solicitud.email,
      nombreSolicitante: solicitud.nombre,
      nombrePerrito: solicitud.perrito.nombre,
      codigo: solicitud.codigo
    })

    // También enviar notificación al admin (opcional)
    if (process.env.ADMIN_EMAIL) {
      await EmailService.send({
        to: process.env.ADMIN_EMAIL,
        subject: `Nueva solicitud de adopción - ${solicitud.perrito.nombre}`,
        html: `
          <h2>Nueva solicitud de adopción</h2>
          <p><strong>Código:</strong> ${solicitud.codigo}</p>
          <p><strong>Perrito:</strong> ${solicitud.perrito.nombre}</p>
          <p><strong>Solicitante:</strong> ${solicitud.nombre}</p>
          <p><strong>Email:</strong> ${solicitud.email}</p>
          <p><strong>Teléfono:</strong> ${solicitud.telefono}</p>
          <p><a href="${process.env.NEXTAUTH_URL}/admin/solicitudes/${solicitud.id}">Ver solicitud</a></p>
        `
      })
    }

    return NextResponse.json({
      success: true,
      codigo: solicitud.codigo,
      message: 'Tu solicitud ha sido enviada exitosamente. Revisa tu correo electrónico para más información.'
    })

  } catch (error) {
    console.error('Error al crear solicitud:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}