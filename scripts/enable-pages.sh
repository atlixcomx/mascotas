#!/bin/bash
# Script para re-habilitar páginas dinámicas

echo "Re-habilitando páginas dinámicas..."

# Restaurar páginas dinámicas
mv src/app/admin/comercios/\[id\]/page.tsx.bak src/app/admin/comercios/\[id\]/page.tsx 2>/dev/null || true
mv src/app/admin/expedientes/\[id\]/consulta/page.tsx.bak src/app/admin/expedientes/\[id\]/consulta/page.tsx 2>/dev/null || true
mv src/app/admin/expedientes/\[id\]/page.tsx.bak src/app/admin/expedientes/\[id\]/page.tsx 2>/dev/null || true
mv src/app/admin/perritos/\[id\]/page.tsx.bak src/app/admin/perritos/\[id\]/page.tsx 2>/dev/null || true
mv src/app/admin/seguimientos/\[id\]/nuevo/page.tsx.bak src/app/admin/seguimientos/\[id\]/nuevo/page.tsx 2>/dev/null || true
mv src/app/admin/seguimientos/\[id\]/page.tsx.bak src/app/admin/seguimientos/\[id\]/page.tsx 2>/dev/null || true
mv src/app/admin/solicitudes/\[id\]/page.tsx.bak src/app/admin/solicitudes/\[id\]/page.tsx 2>/dev/null || true
mv src/app/catalogo/\[slug\]/page.tsx.bak src/app/catalogo/\[slug\]/page.tsx 2>/dev/null || true
mv src/app/comercios/\[slug\]/page.tsx.bak src/app/comercios/\[slug\]/page.tsx 2>/dev/null || true
mv src/app/solicitud-adopcion/\[slug\]/page.tsx.bak src/app/solicitud-adopcion/\[slug\]/page.tsx 2>/dev/null || true
mv src/app/solicitud/\[perritoId\]/page.tsx.bak src/app/solicitud/\[perritoId\]/page.tsx 2>/dev/null || true

echo "Páginas dinámicas restauradas"