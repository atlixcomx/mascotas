import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const perritoId = params.id
    const body = await request.json()

    const expediente = await prisma.expedienteMedico.create({
      data: {
        perritoId,
        tipo: body.tipo,
        descripcion: body.descripcion,
        fecha: new Date(body.fecha),
        veterinario: body.veterinario,
        vacunaTipo: body.vacunaTipo,
        proximaDosis: body.proximaDosis ? new Date(body.proximaDosis) : null,
        medicamento: body.medicamento,
        dosis: body.dosis,
        duracion: body.duracion,
        costo: body.costo ? parseFloat(body.costo) : null,
        notas: body.notas
      }
    })

    return NextResponse.json(expediente)
  } catch (error) {
    console.error('Error creating medical record:', error)
    return NextResponse.json(
      { error: 'Error al crear el registro médico' },
      { status: 500 }
    )
  }
}