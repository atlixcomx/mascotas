const fs = require('fs');
const path = require('path');

console.log('🔄 Restoring directories...');

// Restaurar directorios
const dirs = fs.readdirSync('src/app');
dirs.forEach(dir => {
  if (dir.endsWith('.disabled')) {
    const oldPath = path.join('src/app', dir);
    const newPath = oldPath.replace('.disabled', '');
    fs.renameSync(oldPath, newPath);
    console.log(`Restored: ${newPath}`);
  }
});

console.log('✅ Restoration complete');