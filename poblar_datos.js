// 📊 SCRIPT PARA POBLAR LA BASE DE DATOS AUTOMÁTICAMENTE
// Ejecutar con: node poblar_datos.js

const perritos = [
  {
    nombre: "Max",
    raza: "Mestizo",
    edad: "2 años", 
    sexo: "macho",
    tamano: "mediano",
    peso: 15.5,
    historia: "Max fue rescatado de las calles de Atlixco. Es un perrito muy cariñoso y juguetón que busca una familia que le dé mucho amor y espacio para correr.",
    procedencia: "Rescate callejero",
    vacunas: true,
    esterilizado: true, 
    desparasitado: true,
    energia: "media",
    aptoNinos: true,
    aptoPerros: true,
    aptoGatos: false,
    caracter: ["Cariñoso", "Juguetón", "Protector"],
    fotoPrincipal: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400",
    fotos: ["https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400"],
    destacado: true
  },
  {
    nombre: "Luna",
    raza: "Chihuahua mix", 
    edad: "1 año",
    sexo: "hembra",
    tamano: "chico", 
    peso: 4.2,
    historia: "Luna es una perrita muy dulce y tranquila. Le gusta estar en brazos y es perfecta para familias que buscan una compañera tranquila y cariñosa.",
    procedencia: "Entrega voluntaria",
    vacunas: true,
    esterilizado: true,
    desparasitado: true, 
    energia: "baja",
    aptoNinos: true,
    aptoPerros: false,
    aptoGatos: true,
    caracter: ["Tranquila", "Cariñosa", "Tímida"],
    fotoPrincipal: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    fotos: ["https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400"],
    destacado: true
  },
  {
    nombre: "Rocky", 
    raza: "Pastor Alemán mix",
    edad: "3 años",
    sexo: "macho",
    tamano: "grande",
    peso: 28.0,
    historia: "Rocky es un guardián nato pero muy noble. Necesita una familia con experiencia en perros grandes y con espacio suficiente para que pueda ejercitarse.",
    procedencia: "Abandono",
    vacunas: true, 
    esterilizado: true,
    desparasitado: true,
    energia: "alta",
    aptoNinos: false,
    aptoPerros: true,
    aptoGatos: false,
    caracter: ["Protector", "Leal", "Energético"],
    fotoPrincipal: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400",
    fotos: ["https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400"],
    destacado: false
  },
  {
    nombre: "Bella",
    raza: "Labrador mix",
    edad: "5 años", 
    sexo: "hembra",
    tamano: "mediano",
    peso: 18.3,
    historia: "Bella es una perra muy equilibrada y perfecta para familias. Es cariñosa, obediente y le encanta jugar con niños. Una compañera ideal.",
    procedencia: "Rescate",
    vacunas: true,
    esterilizado: true,
    desparasitado: true,
    energia: "media",
    aptoNinos: true,
    aptoPerros: true, 
    aptoGatos: true,
    caracter: ["Equilibrada", "Obediente", "Familiar"],
    fotoPrincipal: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
    fotos: ["https://images.unsplash.com/photo-1552053831-71594a27632d?w=400"],
    destacado: true
  }
];

async function poblarPerritos() {
  console.log('🚀 Poblando base de datos con perritos de ejemplo...');
  
  const baseUrl = 'https://atlixco.vercel.app'; // Cambiar por tu URL
  
  // Primero necesitamos hacer login para obtener la sesión
  console.log('🔐 Nota: Debes estar logueado como admin en el navegador');
  console.log('📝 Alternativa: Usar el admin panel para crear los perritos manualmente');
  console.log('');
  console.log('📊 Datos a crear:');
  
  perritos.forEach((perrito, index) => {
    console.log(`\n${index + 1}. ${perrito.nombre}`);
    console.log(`   Raza: ${perrito.raza}`);
    console.log(`   Edad: ${perrito.edad}`); 
    console.log(`   Tamaño: ${perrito.tamano}`);
    console.log(`   Características: ${perrito.caracter.join(', ')}`);
    console.log(`   Foto: ${perrito.fotoPrincipal}`);
    console.log(`   Destacado: ${perrito.destacado ? 'Sí' : 'No'}`);
  });
  
  console.log('\n📋 INSTRUCCIONES PARA POBLAR:');
  console.log('1. Ir a: https://atlixco.vercel.app/admin/login');
  console.log('2. Login: admin@atlixco.gob.mx / Atlixco2024!');
  console.log('3. Ir a: Admin > Perritos > Agregar Perrito');
  console.log('4. Copiar y pegar los datos de arriba para cada perrito');
  console.log('5. ¡Listo! El sistema tendrá datos de ejemplo');
}

poblarPerritos();