const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🐕 Agregando perritos de prueba...');
  
  // Crear perritos de prueba
  const perritos = [
    {
      nombre: 'Max',
      slug: 'max-labrador',
      fotos: JSON.stringify(['/perrito1.jpg']),
      fotoPrincipal: '/perrito1.jpg',
      edad: '2 años',
      tamano: 'grande',
      raza: 'Labrador',
      sexo: 'macho',
      peso: 30,
      historia: 'Max es un labrador muy cariñoso que fue rescatado de la calle. Le encanta jugar y es muy bueno con los niños.',
      fechaIngreso: new Date('2024-01-15'),
      procedencia: 'Rescate de la calle',
      vacunas: true,
      esterilizado: true,
      desparasitado: true,
      energia: 'alta',
      aptoNinos: true,
      aptoPerros: true,
      aptoGatos: false,
      caracter: JSON.stringify(['Juguetón', 'Cariñoso', 'Protector']),
      estado: 'disponible',
      destacado: true,
      vistas: 150
    },
    {
      nombre: 'Luna',
      slug: 'luna-mestiza',
      fotos: JSON.stringify(['/perrito2.jpg']),
      fotoPrincipal: '/perrito2.jpg',
      edad: '1 año',
      tamano: 'mediano',
      raza: 'Mestiza',
      sexo: 'hembra',
      peso: 15,
      historia: 'Luna es una perrita muy tranquila que busca un hogar donde pueda recibir mucho amor.',
      fechaIngreso: new Date('2024-02-20'),
      procedencia: 'Entregada por su familia',
      vacunas: true,
      esterilizado: true,
      desparasitado: true,
      energia: 'media',
      aptoNinos: true,
      aptoPerros: true,
      aptoGatos: true,
      caracter: JSON.stringify(['Tranquila', 'Cariñosa', 'Obediente']),
      estado: 'disponible',
      destacado: true,
      vistas: 89
    },
    {
      nombre: 'Rocky',
      slug: 'rocky-pitbull',
      fotos: JSON.stringify(['/perrito3.jpg']),
      fotoPrincipal: '/perrito3.jpg',
      edad: '3 años',
      tamano: 'grande',
      raza: 'Pitbull',
      sexo: 'macho',
      peso: 35,
      historia: 'Rocky es un perro muy noble que necesita un dueño con experiencia. Es muy leal y protector.',
      fechaIngreso: new Date('2024-03-10'),
      procedencia: 'Centro de control animal',
      vacunas: true,
      esterilizado: true,
      desparasitado: true,
      energia: 'alta',
      aptoNinos: false,
      aptoPerros: false,
      aptoGatos: false,
      caracter: JSON.stringify(['Leal', 'Protector', 'Enérgico']),
      estado: 'disponible',
      destacado: false,
      vistas: 45
    }
  ];

  for (const perrito of perritos) {
    try {
      await prisma.perrito.create({ data: perrito });
      console.log(`✅ Creado: ${perrito.nombre}`);
    } catch (error) {
      console.log(`⚠️  ${perrito.nombre} ya existe o error:`, error.message);
    }
  }

  // Crear algunos comercios de prueba
  const comercios = [
    {
      codigo: 'COM001',
      nombre: 'Café Pet Friendly Atlixco',
      slug: 'cafe-pet-friendly',
      categoria: 'cafe',
      descripcion: 'Cafetería con área especial para mascotas',
      direccion: 'Centro de Atlixco, Puebla',
      telefono: '2221234567',
      email: 'info@cafepet.mx',
      horarios: 'Lun-Dom 8:00-20:00',
      servicios: JSON.stringify(['Agua para mascotas', 'Área de juegos', 'Treats gratis']),
      certificado: true,
      activo: true
    }
  ];

  for (const comercio of comercios) {
    try {
      await prisma.comercio.create({ data: comercio });
      console.log(`✅ Comercio creado: ${comercio.nombre}`);
    } catch (error) {
      console.log(`⚠️  Comercio ya existe o error:`, error.message);
    }
  }

  console.log('\n✅ Datos de prueba agregados exitosamente');
  console.log('📌 Puedes ver los perritos en: https://4tlixco.vercel.app/perritos');
  console.log('📌 Página de prueba UI: https://4tlixco.vercel.app/ui-test');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });