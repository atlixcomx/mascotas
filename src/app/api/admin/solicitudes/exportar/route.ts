import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../../lib/auth'
import { prisma } from '../../../../../../lib/db'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const formato = searchParams.get('formato') || 'csv'
    const periodo = searchParams.get('periodo') || 'todos'
    
    // Calcular fecha de inicio según el periodo
    let whereClause: any = {}
    if (periodo !== 'todos') {
      const now = new Date()
      let startDate = new Date()
      
      switch (periodo) {
        case '1mes':
          startDate.setMonth(now.getMonth() - 1)
          break
        case '3meses':
          startDate.setMonth(now.getMonth() - 3)
          break
        case '6meses':
          startDate.setMonth(now.getMonth() - 6)
          break
        case '1año':
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }
      
      whereClause.createdAt = { gte: startDate }
    }

    // Obtener solicitudes con todos los datos
    const solicitudes = await prisma.solicitud.findMany({
      where: whereClause,
      include: {
        perrito: {
          select: {
            nombre: true,
            raza: true,
            edad: true,
            sexo: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (formato === 'csv') {
      // Generar CSV
      const headers = [
        'Código',
        'Fecha',
        'Estado',
        'Nombre Solicitante',
        'Email',
        'Teléfono',
        'Dirección',
        'Tipo Vivienda',
        'Mascota Solicitada',
        'Raza',
        'Edad',
        'Sexo',
        'Experiencia',
        'Otras Mascotas',
        'Motivo Adopción',
        'Compromisos',
        'Fecha Revisión',
        'Fecha Entrevista',
        'Fecha Prueba',
        'Fecha Adopción',
        'Notas'
      ]
      
      const rows = solicitudes.map(s => [
        s.codigo,
        new Date(s.createdAt).toLocaleDateString('es-MX'),
        s.estado,
        s.nombre,
        s.email,
        s.telefono,
        s.direccion,
        s.tipoVivienda,
        s.perrito?.nombre || 'N/A',
        s.perrito?.raza || 'N/A',
        s.perrito?.edad || 'N/A',
        s.perrito?.sexo || 'N/A',
        `"${s.experiencia.replace(/"/g, '""')}"`,
        `"${(s.otrasMascotas || '').replace(/"/g, '""')}"`,
        `"${s.motivoAdopcion.replace(/"/g, '""')}"`,
        `"${(s.notas || '').replace(/"/g, '""')}"`,
        s.fechaRevision ? new Date(s.fechaRevision).toLocaleDateString('es-MX') : '',
        s.fechaEntrevista ? new Date(s.fechaEntrevista).toLocaleDateString('es-MX') : '',
        s.fechaPrueba ? new Date(s.fechaPrueba).toLocaleDateString('es-MX') : '',
        s.fechaAdopcion ? new Date(s.fechaAdopcion).toLocaleDateString('es-MX') : '',
        s.notas ? `"${s.notas.replace(/"/g, '""')}"` : ''
      ])
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n')
      
      // Agregar BOM para UTF-8
      const bom = '\uFEFF'
      const csvWithBom = bom + csvContent
      
      return new NextResponse(csvWithBom, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="solicitudes_adopcion_${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    } else {
      // Generar JSON
      const jsonData = {
        generado: new Date().toISOString(),
        periodo: periodo,
        totalSolicitudes: solicitudes.length,
        estadisticas: {
          aprobadas: solicitudes.filter(s => s.estado === 'aprobada').length,
          rechazadas: solicitudes.filter(s => s.estado === 'rechazada').length,
          enProceso: solicitudes.filter(s => !['aprobada', 'rechazada', 'cancelada'].includes(s.estado)).length
        },
        solicitudes: solicitudes.map(s => ({
          codigo: s.codigo,
          fecha: s.createdAt,
          estado: s.estado,
          solicitante: {
            nombre: s.nombre,
            email: s.email,
            telefono: s.telefono,
            direccion: s.direccion,
            tipoVivienda: s.tipoVivienda
          },
          mascota: {
            nombre: s.perrito?.nombre || 'N/A',
            raza: s.perrito?.raza || 'N/A',
            edad: s.perrito?.edad || 'N/A',
            sexo: s.perrito?.sexo || 'N/A'
          },
          informacion: {
            experiencia: s.experiencia,
            otrosMascotas: s.otrasMascotas || '',
            motivoAdopcion: s.motivoAdopcion,
            compromisos: s.notas || ''
          },
          fechas: {
            revision: s.fechaRevision,
            entrevista: s.fechaEntrevista,
            prueba: s.fechaPrueba,
            adopcion: s.fechaAdopcion
          },
          notas: s.notas
        }))
      }
      
      return new NextResponse(JSON.stringify(jsonData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="solicitudes_adopcion_${new Date().toISOString().split('T')[0]}.json"`
        }
      })
    }

  } catch (error) {
    console.error('Error al exportar solicitudes:', error)
    return NextResponse.json(
      { error: 'Error al exportar solicitudes' },
      { status: 500 }
    )
  }
}