#!/usr/bin/env node

// Script personalizado para build sin generación estática
const { execSync } = require('child_process');

console.log('🚀 Iniciando build personalizado sin generación estática...');

// Variables de entorno para desactivar pre-renderizado
const env = {
  ...process.env,
  NEXT_EXPERIMENTAL_PARTIAL_PRERENDERING: 'false',
  NEXT_PRIVATE_MINIMAL_MODE: '1',
  NODE_OPTIONS: '--max-old-space-size=8192',
  // Forzar modo de producción pero sin optimizaciones
  NODE_ENV: 'production',
  SKIP_BUILD_STATIC_GENERATION: 'true',
};

try {
  // Ejecutar build con configuración especial
  execSync('next experimental-compile', {
    stdio: 'inherit',
    env,
  });
  
  console.log('✅ Build completado exitosamente');
} catch (error) {
  console.error('❌ Error durante el build:', error.message);
  process.exit(1);
}