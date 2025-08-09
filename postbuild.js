const fs = require('fs');
const path = require('path');

console.log('🔧 Restaurando páginas dinámicas después del build...');

const tempDir = '.temp-pages';

// Leer archivos del directorio temporal
if (fs.existsSync(tempDir)) {
  const files = fs.readdirSync(tempDir);
  
  files.forEach(file => {
    const tempPath = path.join(tempDir, file);
    const content = fs.readFileSync(tempPath, 'utf8');
    
    // Extraer la ruta original del comentario
    const match = content.match(/\/\/ Original path: (.+)\n/);
    if (match) {
      const originalPath = match[1];
      const fullPath = path.join(process.cwd(), originalPath);
      
      // Restaurar el contenido original (sin el comentario)
      const originalContent = content.replace(/\/\/ Original path: .+\n/, '');
      
      // Asegurar que el directorio existe
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      
      // Escribir el archivo
      fs.writeFileSync(fullPath, originalContent);
      
      console.log(`✓ Restaurado: ${originalPath}`);
    }
  });
  
  // Limpiar directorio temporal
  fs.rmSync(tempDir, { recursive: true, force: true });
}

console.log('✅ Páginas dinámicas restauradas');