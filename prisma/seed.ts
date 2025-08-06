import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Crear admin por defecto
  const hashedPassword = await bcrypt.hash('Atlixco2024!', 10)
  
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@atlixco.gob.mx' },
    update: {},
    create: {
      email: 'admin@atlixco.gob.mx',
      nombre: 'Administrador Atlixco',
      password: hashedPassword,
      rol: 'admin',
      activo: true
    }
  })

  console.log('✅ Admin user created:', admin.email)

  // Crear perritos de ejemplo
  const perritosData = [
    {
      nombre: 'Max',
      slug: 'max',
      fotoPrincipal: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400',
      fotos: JSON.stringify(['https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400']),
      edad: '2 años',
      tamano: 'mediano',
      raza: 'Mestizo',
      sexo: 'macho',
      peso: 15.5,
      historia: 'Max fue rescatado de las calles de Atlixco. Es un perrito muy cariñoso y juguetón que busca una familia que le dé mucho amor.',
      fechaIngreso: new Date('2024-01-15'),
      procedencia: 'Rescate callejero',
      vacunas: true,
      esterilizado: true,
      desparasitado: true,
      energia: 'media',
      aptoNinos: true,
      aptoPerros: true,
      aptoGatos: false,
      caracter: JSON.stringify(['Juguetón', 'Cariñoso', 'Protector']),
      destacado: true
    },
    {
      nombre: 'Luna',
      slug: 'luna',
      fotoPrincipal: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
      fotos: JSON.stringify(['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400']),
      edad: '1 año',
      tamano: 'chico',
      raza: 'Chihuahua mix',
      sexo: 'hembra',
      peso: 4.2,
      historia: 'Luna es una perrita muy dulce y tranquila. Le gusta estar en brazos y es perfecta para familias que buscan una compañera tranquila.',
      fechaIngreso: new Date('2024-02-01'),
      procedencia: 'Entrega voluntaria',
      vacunas: true,
      esterilizado: true,
      desparasitado: true,
      energia: 'baja',
      aptoNinos: true,
      aptoPerros: false,
      aptoGatos: true,
      caracter: JSON.stringify(['Tranquila', 'Cariñosa', 'Tímida']),
      destacado: true
    },
    {
      nombre: 'Rocky',
      slug: 'rocky',
      fotoPrincipal: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400',
      fotos: JSON.stringify(['https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400']),
      edad: '3 años',
      tamano: 'grande',
      raza: 'Pastor Alemán mix',
      sexo: 'macho',
      peso: 28.0,
      historia: 'Rocky es un guardián nato pero muy noble. Necesita una familia con experiencia en perros grandes y con espacio suficiente.',
      fechaIngreso: new Date('2024-01-20'),
      procedencia: 'Abandono',
      vacunas: true,
      esterilizado: true,
      desparasitado: true,
      energia: 'alta',
      aptoNinos: false,
      aptoPerros: true,
      aptoGatos: false,
      caracter: JSON.stringify(['Protector', 'Leal', 'Energético']),
      destacado: false
    },
    {
      nombre: 'Bella',
      slug: 'bella',
      fotoPrincipal: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
      fotos: JSON.stringify(['https://images.unsplash.com/photo-1552053831-71594a27632d?w=400']),
      edad: '5 años',
      tamano: 'mediano',
      raza: 'Labrador mix',
      sexo: 'hembra',
      peso: 18.3,
      historia: 'Bella es una perra muy equilibrada y perfecta para familias. Es cariñosa, obediente y le encanta jugar con niños.',
      fechaIngreso: new Date('2024-01-10'),
      procedencia: 'Rescate',
      vacunas: true,
      esterilizado: true,
      desparasitado: true,
      energia: 'media',
      aptoNinos: true,
      aptoPerros: true,
      aptoGatos: true,
      caracter: JSON.stringify(['Equilibrada', 'Obediente', 'Familiar']),
      destacado: true
    }
  ]

  for (const perritoData of perritosData) {
    const perrito = await prisma.perrito.upsert({
      where: { slug: perritoData.slug },
      update: {},
      create: perritoData
    })
    console.log(`✅ Perrito created: ${perrito.nombre}`)
  }

  // Crear comercios de ejemplo
  const comerciosData = [
    {
      codigo: 'REST001',
      nombre: 'Café Central Atlixco',
      slug: 'cafe-central-atlixco',
      categoria: 'cafe',
      descripcion: 'Café acogedor en el centro histórico de Atlixco que recibe mascotas en su terraza.',
      direccion: 'Av. Hidalgo 123, Centro, Atlixco',
      telefono: '244-123-4567',
      email: 'contacto@cafecentral.com',
      horarios: 'Lun-Dom 8:00-22:00',
      servicios: JSON.stringify(['Terraza pet-friendly', 'Bowls de agua', 'Treats para mascotas']),
      certificado: true,
      fechaCert: new Date('2024-01-01'),
      latitud: 18.9065,
      longitud: -98.4265
    },
    {
      codigo: 'HOT001',
      nombre: 'Hotel Jardín Atlixco',
      slug: 'hotel-jardin-atlixco',
      categoria: 'hotel',
      descripcion: 'Hotel boutique que acepta huéspedes con mascotas en habitaciones especiales.',
      direccion: 'Calle 2 Norte 456, Atlixco',
      telefono: '244-987-6543',
      horarios: '24 horas',
      servicios: JSON.stringify(['Habitaciones pet-friendly', 'Área de paseo', 'Servicio de cuidado']),
      certificado: true,
      fechaCert: new Date('2024-01-15'),
      latitud: 18.9075,
      longitud: -98.4275
    }
  ]

  for (const comercioData of comerciosData) {
    const comercio = await prisma.comercio.upsert({
      where: { codigo: comercioData.codigo },
      update: {},
      create: comercioData
    })
    console.log(`✅ Comercio created: ${comercio.nombre}`)
  }

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })