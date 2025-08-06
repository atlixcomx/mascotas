const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash('Atlixco2024!', 10);
  
  // Crear usuario admin
  const admin = await prisma.usuario.create({
    data: {
      email: 'admin@atlixco.gob.mx',
      password: hashedPassword,
      nombre: 'Administrador',
      rol: 'admin',
      activo: true
    }
  });
  
  console.log('✅ Usuario admin creado:', admin.email);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });