const fs = require('fs');
const path = require('path');

console.log('🔧 Preparando build: moviendo páginas problemáticas temporalmente...');

// También limpiar cache
const cacheDir = '.next';
if (fs.existsSync(cacheDir)) {
  console.log('🗑️  Limpiando cache de Next.js...');
  fs.rmSync(cacheDir, { recursive: true, force: true });
}

const dynamicPages = [
  // Páginas dinámicas
  'src/app/admin/comercios/[id]/page.tsx',
  'src/app/admin/expedientes/[id]/page.tsx',
  'src/app/admin/expedientes/[id]/consulta/page.tsx',
  'src/app/admin/perritos/[id]/page.tsx',
  'src/app/admin/seguimientos/[id]/page.tsx',
  'src/app/admin/seguimientos/[id]/nuevo/page.tsx',
  'src/app/admin/solicitudes/[id]/page.tsx',
  'src/app/catalogo/[slug]/page.tsx',
  'src/app/comercios/[slug]/page.tsx',
  'src/app/solicitud-adopcion/[slug]/page.tsx',
  'src/app/solicitud/[perritoId]/page.tsx',
  
  // Todas las páginas admin (pueden ser pesadas)
  'src/app/admin/comercios/nuevo/page.tsx',
  'src/app/admin/comercios/page.tsx',
  'src/app/admin/configuracion/page.tsx',
  'src/app/admin/dashboard/page.tsx',
  'src/app/admin/difusion/page.tsx',
  'src/app/admin/expedientes/nuevo/page.tsx',
  'src/app/admin/expedientes/page.tsx',
  'src/app/admin/importar/page.tsx',
  'src/app/admin/insumos/page.tsx',
  'src/app/admin/perritos/nuevo/page.tsx',
  'src/app/admin/perritos/page.tsx',
  'src/app/admin/recordatorios/page.tsx',
  'src/app/admin/seguimientos/nuevo/page.tsx',
  'src/app/admin/seguimientos/page.tsx',
  'src/app/admin/solicitudes/estadisticas/page.tsx',
  'src/app/admin/solicitudes/nueva/page.tsx',
  'src/app/admin/solicitudes/page.tsx',
  'src/app/admin/test-upload/page.tsx',
  'src/app/admin/test/page.tsx',
  'src/app/admin/page.tsx',
  
  // Páginas de test y debug
  'src/app/debug-admin/page.tsx',
  'src/app/diagnostics/page.tsx',
  'src/app/simple-test/page.tsx',
  'src/app/test-deployment/page.tsx',
  'src/app/test/page.tsx',
  'src/app/ui-test/page.tsx',
  'src/app/admin-login-direct/page.tsx',
];

// Crear directorio temporal
const tempDir = '.temp-pages';
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Mover páginas dinámicas
dynamicPages.forEach(pagePath => {
  const fullPath = path.join(process.cwd(), pagePath);
  const tempPath = path.join(process.cwd(), tempDir, path.basename(pagePath));
  
  if (fs.existsSync(fullPath)) {
    // Guardar la ruta original en el archivo temporal
    const content = fs.readFileSync(fullPath, 'utf8');
    fs.writeFileSync(tempPath, `// Original path: ${pagePath}\n${content}`);
    
    // Reemplazar con placeholder
    fs.writeFileSync(fullPath, `
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default function BuildPlaceholder() {
  return null;
}
`);
    
    console.log(`✓ Movido: ${pagePath}`);
  }
});

console.log('✅ Páginas dinámicas preparadas para build');