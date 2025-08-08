import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const perritoId = params.id
    const body = await request.json()

    const nota = await prisma.notaPerrito.create({
      data: {
        perritoId,
        contenido: body.contenido,
        tipo: body.tipo,
        autor: 'Admin' // TODO: Get from session
      }
    })

    return NextResponse.json(nota)
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Error al crear la nota' },
      { status: 500 }
    )
  }
}