import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getFile } from '../../../../../lib/attachments'

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string; fileName: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const file = await getFile(params.fileId)
    if (!file) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 })
    }

    // Configurar headers según el tipo de archivo
    const headers = new Headers()
    headers.set('Content-Type', file.metadata.fileType)
    headers.set('Content-Length', file.metadata.fileSize.toString())
    
    // Para PDFs y documentos, permitir visualización en el navegador
    if (file.metadata.fileType.includes('pdf') || file.metadata.fileType.includes('image')) {
      headers.set('Content-Disposition', `inline; filename="${file.metadata.fileName}"`)
    } else {
      // Para otros archivos, forzar descarga
      headers.set('Content-Disposition', `attachment; filename="${file.metadata.fileName}"`)
    }

    // Cache de archivos por 1 hora
    headers.set('Cache-Control', 'private, max-age=3600')

    return new NextResponse(file.data, {
      status: 200,
      headers
    })

  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json(
      { error: 'Error al obtener el archivo' },
      { status: 500 }
    )
  }
}