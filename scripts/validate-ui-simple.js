const https = require('https');
const fs = require('fs');

const BASE_URL = 'https://4tlixco.vercel.app';

const routes = [
  { path: '/', name: 'Homepage' },
  { path: '/ui-test', name: 'UI Test Page' },
  { path: '/diagnostics', name: 'Diagnostics' },
  { path: '/perritos', name: 'Catálogo de Perritos' },
  { path: '/perritos/max-labrador', name: 'Perrito Max' },
  { path: '/perritos/luna-mestiza', name: 'Perrito Luna' },
  { path: '/solicitud/test-id', name: 'Formulario de Adopción' },
  { path: '/admin/login', name: 'Admin Login' },
  { path: '/admin', name: 'Admin Dashboard' },
];

async function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function validateUI() {
  console.log('🔍 Validación detallada de UI/UX\n');
  
  const results = [];
  
  for (const route of routes) {
    const url = `${BASE_URL}${route.path}`;
    console.log(`\n📍 Validando: ${route.name}`);
    console.log(`   URL: ${url}`);
    
    try {
      const { status, data } = await fetchPage(url);
      
      const result = {
        name: route.name,
        path: route.path,
        status,
        hasContent: data.length > 1000,
        hasStyles: data.includes('style') || data.includes('css'),
        hasScripts: data.includes('script'),
        issues: []
      };
      
      // Análisis de contenido
      console.log(`   ├─ Status: ${status === 200 ? '✅' : '❌'} ${status}`);
      console.log(`   ├─ Tamaño: ${data.length} bytes`);
      
      if (status === 500) {
        result.issues.push('Error 500 - Error interno del servidor');
        
        // Buscar mensajes de error
        if (data.includes('PrismaClientKnownRequestError')) {
          result.issues.push('Error de Prisma/Base de datos');
        }
        if (data.includes('DATABASE_URL')) {
          result.issues.push('Posible problema con DATABASE_URL');
        }
      }
      
      // Verificar elementos UI específicos
      const uiChecks = {
        'Tiene header/nav': data.includes('<nav') || data.includes('header'),
        'Tiene estilos CSS': result.hasStyles,
        'Tiene contenido': result.hasContent,
        'Tiene meta tags': data.includes('<meta'),
        'Usa componentes React': data.includes('__next'),
      };
      
      console.log(`   ├─ Checks UI:`);
      for (const [check, passed] of Object.entries(uiChecks)) {
        console.log(`   │  ${passed ? '✓' : '✗'} ${check}`);
        if (!passed) result.issues.push(`Falta: ${check}`);
      }
      
      // Verificar contenido específico por ruta
      if (route.path === '/perritos' && !data.includes('perrito')) {
        result.issues.push('No se encontró contenido de perritos');
      }
      
      if (route.path === '/admin/login' && !data.includes('login') && !data.includes('sesión')) {
        result.issues.push('No se encontró formulario de login');
      }
      
      results.push(result);
      
    } catch (error) {
      console.log(`   └─ ❌ Error: ${error.message}`);
      results.push({
        name: route.name,
        path: route.path,
        status: 'error',
        error: error.message,
        issues: ['No se pudo cargar la página']
      });
    }
  }
  
  // Resumen final
  console.log('\n' + '='.repeat(80));
  console.log('📊 RESUMEN DE VALIDACIÓN UI/UX');
  console.log('='.repeat(80));
  
  const summary = {
    total: results.length,
    exitosas: results.filter(r => r.status === 200).length,
    conErrores: results.filter(r => r.status !== 200).length,
    sinEstilos: results.filter(r => !r.hasStyles).length,
    sinContenido: results.filter(r => !r.hasContent).length,
  };
  
  console.log(`\nEstadísticas:`);
  console.log(`├─ Total páginas: ${summary.total}`);
  console.log(`├─ Páginas OK: ${summary.exitosas} (${Math.round(summary.exitosas/summary.total*100)}%)`);
  console.log(`├─ Con errores: ${summary.conErrores}`);
  console.log(`├─ Sin estilos: ${summary.sinEstilos}`);
  console.log(`└─ Sin contenido: ${summary.sinContenido}`);
  
  console.log(`\n❌ Problemas encontrados:`);
  for (const result of results) {
    if (result.issues.length > 0) {
      console.log(`\n${result.name} (${result.path}):`);
      result.issues.forEach(issue => console.log(`  - ${issue}`));
    }
  }
  
  // Guardar reporte
  fs.writeFileSync('ui-validation-detailed.json', JSON.stringify(results, null, 2));
  console.log('\n💾 Reporte detallado guardado en: ui-validation-detailed.json');
  
  return results;
}

// Ejecutar validación
validateUI()
  .then(() => console.log('\n✅ Validación completada'))
  .catch(error => console.error('\n❌ Error:', error));