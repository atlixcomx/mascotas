#!/bin/bash
# Script de build para Vercel con optimización de memoria

echo "🚀 Iniciando build optimizado para Vercel..."

# Aumentar límite de memoria para Node.js
export NODE_OPTIONS="--max-old-space-size=4096"

# Limpiar caché si existe
rm -rf .next

# Ejecutar build
npm run build

echo "✅ Build completado"