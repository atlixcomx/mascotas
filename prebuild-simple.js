const fs = require('fs');
const path = require('path');

console.log('🚀 Quick prebuild...');

// Solo mover páginas que sabemos que causan problemas (mantenemos login habilitado)
const problematicPages = [
  'src/app/test',
  'src/app/debug-admin',
  'src/app/diagnostics',
  'src/app/simple-test',
  'src/app/test-deployment',
  'src/app/ui-test'
];

problematicPages.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    fs.renameSync(fullPath, fullPath + '.disabled');
    console.log(`Disabled: ${dir}`);
  }
});

console.log('✅ Ready for build');