#!/bin/bash
# Script para temporalmente deshabilitar páginas dinámicas

echo "Deshabilitando páginas dinámicas temporalmente..."

# Renombrar páginas dinámicas a .tsx.bak
mv src/app/admin/comercios/\[id\]/page.tsx src/app/admin/comercios/\[id\]/page.tsx.bak 2>/dev/null || true
mv src/app/admin/expedientes/\[id\]/consulta/page.tsx src/app/admin/expedientes/\[id\]/consulta/page.tsx.bak 2>/dev/null || true
mv src/app/admin/expedientes/\[id\]/page.tsx src/app/admin/expedientes/\[id\]/page.tsx.bak 2>/dev/null || true
mv src/app/admin/perritos/\[id\]/page.tsx src/app/admin/perritos/\[id\]/page.tsx.bak 2>/dev/null || true
mv src/app/admin/seguimientos/\[id\]/nuevo/page.tsx src/app/admin/seguimientos/\[id\]/nuevo/page.tsx.bak 2>/dev/null || true
mv src/app/admin/seguimientos/\[id\]/page.tsx src/app/admin/seguimientos/\[id\]/page.tsx.bak 2>/dev/null || true
mv src/app/admin/solicitudes/\[id\]/page.tsx src/app/admin/solicitudes/\[id\]/page.tsx.bak 2>/dev/null || true
mv src/app/catalogo/\[slug\]/page.tsx src/app/catalogo/\[slug\]/page.tsx.bak 2>/dev/null || true
mv src/app/comercios/\[slug\]/page.tsx src/app/comercios/\[slug\]/page.tsx.bak 2>/dev/null || true
mv src/app/solicitud-adopcion/\[slug\]/page.tsx src/app/solicitud-adopcion/\[slug\]/page.tsx.bak 2>/dev/null || true
mv src/app/solicitud/\[perritoId\]/page.tsx src/app/solicitud/\[perritoId\]/page.tsx.bak 2>/dev/null || true

echo "Páginas dinámicas deshabilitadas"