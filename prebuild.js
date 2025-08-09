const fs = require('fs');
const path = require('path');

console.log('🔧 Preparando build: moviendo páginas dinámicas temporalmente...');

const dynamicPages = [
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