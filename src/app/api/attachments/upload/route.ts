import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../lib/auth'
import { uploadFile, validateFile } from '../../../../lib/attachments'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const solicitudId = formData.get('solicitudId') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      )
    }

    if (!category) {
      return NextResponse.json(
        { error: 'La categoría es requerida' },
        { status: 400 }
      )
    }

    // Validar archivo
    const validation = validateFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Subir archivo
    const attachment = await uploadFile(
      file,
      {
        solicitudId,
        category,
        description
      },
      session.user.email || 'Usuario'
    )

    return NextResponse.json({
      success: true,
      attachment
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Error al subir el archivo' },
      { status: 500 }
    )
  }
}

// GET - Listar archivos adjuntos
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const solicitudId = searchParams.get('solicitudId')

    if (!solicitudId) {
      return NextResponse.json(
        { error: 'ID de solicitud requerido' },
        { status: 400 }
      )
    }

    // En producción, consultarías la base de datos
    // const attachments = await getAttachmentsBySolicitud(solicitudId)
    
    // Mock response
    const attachments = []

    return NextResponse.json({
      attachments
    })

  } catch (error) {
    console.error('Error fetching attachments:', error)
    return NextResponse.json(
      { error: 'Error al obtener archivos' },
      { status: 500 }
    )
  }
}