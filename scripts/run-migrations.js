const { execSync } = require('child_process');

console.log('Starting database migrations...');

try {
  // Ejecutar migraciones con un timeout más largo
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    timeout: 60000 // 60 segundos
  });
  console.log('Migrations completed successfully');
} catch (error) {
  console.error('Migration failed:', error.message);
  // No fallar el build si las migraciones fallan
  console.log('Continuing with build despite migration failure...');
}