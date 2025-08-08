import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanMockPerritos() {
  try {
    // Nombres de perritos mock a eliminar
    const mockNames = ['Max', 'Luna', 'Rocky', 'Bella', 'Charlie', 'Daisy', 'Cooper']
    
    console.log('Buscando perritos mock en la base de datos...')
    
    // Buscar perritos con estos nombres
    const mockPerritos = await prisma.perrito.findMany({
      where: {
        nombre: {
          in: mockNames
        }
      },
      select: {
        id: true,
        nombre: true,
        slug: true
      }
    })
    
    if (mockPerritos.length === 0) {
      console.log('No se encontraron perritos mock en la base de datos.')
      return
    }
    
    console.log(`Se encontraron ${mockPerritos.length} perritos mock:`)
    mockPerritos.forEach(p => console.log(`- ${p.nombre} (${p.slug})`))
    
    // Eliminar relaciones primero si existen
    console.log('\nEliminando datos relacionados...')
    
    for (const perrito of mockPerritos) {
      try {
        // Verificar si el modelo existe antes de intentar eliminar
        if (prisma.notaPerrito) {
          await prisma.notaPerrito.deleteMany({
            where: { perritoId: perrito.id }
          })
        }
        
        if (prisma.expedienteMedico) {
          await prisma.expedienteMedico.deleteMany({
            where: { perritoId: perrito.id }
          })
        }
        
        if (prisma.seguimientoAdopcion) {
          await prisma.seguimientoAdopcion.deleteMany({
            where: { perritoId: perrito.id }
          })
        }
      } catch (err) {
        console.log(`Nota: No se pudieron eliminar todas las relaciones para ${perrito.nombre}`)
      }
    }
    
    // Eliminar perritos
    console.log('Eliminando perritos mock...')
    const result = await prisma.perrito.deleteMany({
      where: {
        nombre: {
          in: mockNames
        }
      }
    })
    
    console.log(`\n✅ Se eliminaron ${result.count} perritos mock exitosamente.`)
    console.log('El catálogo ahora está vacío.')
    
  } catch (error) {
    console.error('Error al eliminar perritos mock:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanMockPerritos()