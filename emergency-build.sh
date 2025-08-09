#!/bin/bash

echo "🚨 EMERGENCY BUILD SCRIPT"

# Limpiar todo
echo "🗑️ Limpiando cache..."
rm -rf .next
rm -rf .temp-pages

# Crear directorio temporal
mkdir -p .temp-pages

# Mover TODAS las páginas excepto las esenciales
echo "📦 Moviendo páginas..."

# Lista de páginas que SÍ queremos mantener
KEEP_PAGES=(
  "src/app/page.tsx"
  "src/app/not-found.tsx"
  "src/app/error.tsx"
  "src/app/loading.tsx"
)

# Mover todas las demás páginas
find src/app -name "page.tsx" -type f | while read -r file; do
  should_keep=false
  for keep in "${KEEP_PAGES[@]}"; do
    if [[ "$file" == "$keep" ]]; then
      should_keep=true
      break
    fi
  done
  
  if [[ "$should_keep" == false ]]; then
    echo "  Moving: $file"
    mv "$file" "$file.backup"
  fi
done

echo "🏗️ Building..."
NODE_OPTIONS='--max-old-space-size=8192' next build

echo "🔄 Restaurando páginas..."
find src/app -name "*.backup" -type f | while read -r file; do
  original="${file%.backup}"
  mv "$file" "$original"
done

echo "✅ Build completado"