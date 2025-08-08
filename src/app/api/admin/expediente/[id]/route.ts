import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../../lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.expedienteMedico.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Registro médico eliminado' })
  } catch (error) {
    console.error('Error deleting medical record:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el registro médico' },
      { status: 500 }
    )
  }
}