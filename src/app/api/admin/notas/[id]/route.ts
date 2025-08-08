import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.notaPerrito.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Nota eliminada' })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la nota' },
      { status: 500 }
    )
  }
}