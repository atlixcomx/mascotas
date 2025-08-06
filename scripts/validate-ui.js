const puppeteer = require('puppeteer');

// Rutas a validar
const routes = [
  { path: '/', name: 'Homepage', expectedContent: ['Centro de Adopción', 'Encuentra tu compañero'] },
  { path: '/ui-test', name: 'UI Test Page', expectedContent: ['Página de Prueba UI/UX'] },
  { path: '/diagnostics', name: 'Diagnostics', expectedContent: ['Diagnóstico del Sistema'] },
  { path: '/perritos', name: 'Catálogo de Perritos', expectedContent: ['perritos', 'adopción'] },
  { path: '/perritos/max-labrador', name: 'Perrito Max', expectedContent: ['Max', 'Labrador'] },
  { path: '/perritos/luna-mestiza', name: 'Perrito Luna', expectedContent: ['Luna', 'Mestiza'] },
  { path: '/solicitud/test-id', name: 'Formulario de Adopción', expectedContent: ['Solicitud de Adopción'] },
  { path: '/admin/login', name: 'Admin Login', expectedContent: ['Iniciar', 'sesión'] },
  { path: '/admin', name: 'Admin Dashboard', expectedContent: ['Dashboard', 'admin'] },
  { path: '/test', name: 'Test Page', expectedContent: ['test'] }
];

const BASE_URL = 'https://4tlixco.vercel.app';

async function validateUI() {
  console.log('🚀 Iniciando validación de UI con Puppeteer...\n');
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const results = [];
  
  for (const route of routes) {
    const page = await browser.newPage();
    const url = `${BASE_URL}${route.path}`;
    const result = {
      name: route.name,
      path: route.path,
      url: url,
      status: 'unknown',
      loadTime: 0,
      errors: [],
      warnings: [],
      styles: {},
      content: {}
    };
    
    try {
      console.log(`\n📍 Validando: ${route.name} (${route.path})`);
      console.log(`   URL: ${url}`);
      
      // Capturar errores de consola
      page.on('console', msg => {
        if (msg.type() === 'error') {
          result.errors.push(`Console Error: ${msg.text()}`);
        }
      });
      
      page.on('pageerror', error => {
        result.errors.push(`Page Error: ${error.message}`);
      });
      
      // Intentar navegar a la página
      const startTime = Date.now();
      const response = await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      result.loadTime = Date.now() - startTime;
      
      // Verificar código de respuesta
      result.status = response.status();
      console.log(`   ├─ Status: ${result.status}`);
      console.log(`   ├─ Tiempo de carga: ${result.loadTime}ms`);
      
      if (result.status !== 200) {
        result.errors.push(`HTTP ${result.status}`);
        if (result.status === 500) {
          result.errors.push('Error interno del servidor');
        }
      }
      
      // Esperar un poco para que se cargue el contenido
      await page.waitForTimeout(2000);
      
      // Verificar contenido esperado
      const pageContent = await page.content();
      const textContent = await page.evaluate(() => document.body.innerText);
      
      for (const expected of route.expectedContent) {
        const found = textContent.toLowerCase().includes(expected.toLowerCase());
        result.content[expected] = found;
        if (!found) {
          result.warnings.push(`Contenido esperado no encontrado: "${expected}"`);
        }
      }
      
      // Verificar estilos CSS
      const styles = await page.evaluate(() => {
        const computedStyles = window.getComputedStyle(document.body);
        return {
          backgroundColor: computedStyles.backgroundColor,
          color: computedStyles.color,
          fontFamily: computedStyles.fontFamily,
          hasCustomStyles: document.styleSheets.length > 0,
          styleSheetCount: document.styleSheets.length
        };
      });
      result.styles = styles;
      
      // Verificar si hay estilos aplicados
      if (styles.backgroundColor === 'rgba(0, 0, 0, 0)' || 
          styles.backgroundColor === 'transparent' ||
          styles.styleSheetCount === 0) {
        result.warnings.push('No se detectaron estilos CSS aplicados');
      }
      
      // Verificar elementos específicos de UI
      const uiElements = await page.evaluate(() => {
        return {
          hasButtons: document.querySelectorAll('button, a[href]').length > 0,
          hasImages: document.querySelectorAll('img').length > 0,
          hasHeaders: document.querySelectorAll('h1, h2, h3').length > 0,
          hasForms: document.querySelectorAll('form').length > 0,
          visibleText: document.body.innerText.trim().length > 50
        };
      });
      
      if (!uiElements.visibleText) {
        result.errors.push('Página sin contenido visible o muy poco contenido');
      }
      
      // Capturar screenshot
      await page.screenshot({ 
        path: `validation-screenshots/${route.path.replace(/\//g, '-') || 'home'}.png`,
        fullPage: true 
      });
      
      // Resumen
      if (result.status === 200 && result.errors.length === 0) {
        console.log(`   ├─ ✅ Página funcional`);
      } else {
        console.log(`   ├─ ❌ Problemas encontrados: ${result.errors.length} errores`);
      }
      
      if (result.warnings.length > 0) {
        console.log(`   └─ ⚠️  Advertencias: ${result.warnings.length}`);
      }
      
    } catch (error) {
      result.status = 'error';
      result.errors.push(error.message);
      console.log(`   └─ ❌ Error al cargar: ${error.message}`);
    }
    
    results.push(result);
    await page.close();
  }
  
  await browser.close();
  
  // Generar reporte
  console.log('\n' + '='.repeat(80));
  console.log('📊 REPORTE DE VALIDACIÓN UI/UX');
  console.log('='.repeat(80));
  
  const summary = {
    total: results.length,
    successful: results.filter(r => r.status === 200 && r.errors.length === 0).length,
    withErrors: results.filter(r => r.errors.length > 0).length,
    withWarnings: results.filter(r => r.warnings.length > 0).length,
    status500: results.filter(r => r.status === 500).length
  };
  
  console.log(`\n📈 Resumen:`);
  console.log(`   ├─ Total de páginas: ${summary.total}`);
  console.log(`   ├─ Páginas funcionales: ${summary.successful} (${Math.round(summary.successful/summary.total*100)}%)`);
  console.log(`   ├─ Con errores: ${summary.withErrors} (${Math.round(summary.withErrors/summary.total*100)}%)`);
  console.log(`   ├─ Con advertencias: ${summary.withWarnings}`);
  console.log(`   └─ Error 500: ${summary.status500}`);
  
  console.log(`\n📋 Detalle por página:`);
  console.log('-'.repeat(80));
  
  for (const result of results) {
    const status = result.errors.length === 0 ? '✅' : '❌';
    console.log(`\n${status} ${result.name} (${result.path})`);
    console.log(`   Status HTTP: ${result.status}`);
    console.log(`   Tiempo de carga: ${result.loadTime}ms`);
    
    if (result.errors.length > 0) {
      console.log(`   Errores:`);
      result.errors.forEach(err => console.log(`     - ${err}`));
    }
    
    if (result.warnings.length > 0) {
      console.log(`   Advertencias:`);
      result.warnings.forEach(warn => console.log(`     - ${warn}`));
    }
    
    if (result.styles.styleSheetCount !== undefined) {
      console.log(`   Estilos CSS: ${result.styles.styleSheetCount} hojas de estilo`);
    }
  }
  
  // Guardar reporte JSON
  const fs = require('fs');
  fs.writeFileSync('ui-validation-report.json', JSON.stringify(results, null, 2));
  console.log('\n💾 Reporte guardado en: ui-validation-report.json');
  console.log('📸 Screenshots guardados en: validation-screenshots/');
  
  return results;
}

// Crear carpeta para screenshots
const fs = require('fs');
if (!fs.existsSync('validation-screenshots')) {
  fs.mkdirSync('validation-screenshots');
}

// Ejecutar validación
validateUI()
  .then(() => {
    console.log('\n✅ Validación completada');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Error en la validación:', error);
    process.exit(1);
  });