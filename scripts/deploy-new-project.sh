#!/bin/bash

echo "🚀 Creando nuevo proyecto en Vercel..."

# Asegurarse de que no hay vinculación previa
rm -rf .vercel

# Crear nuevo proyecto con configuración específica
echo "Configurando nuevo proyecto..."

# Preguntar por el nombre del proyecto
echo "Nombre del proyecto: atlixco-public-demo"

# Configurar variables de entorno localmente
export VERCEL_ORG_ID=""
export VERCEL_PROJECT_ID=""

# Intentar crear proyecto sin vinculación previa
vercel --name atlixco-public-demo --yes --public

echo "✅ Proyecto creado"