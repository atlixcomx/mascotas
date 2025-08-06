#!/bin/bash
# 🚀 SCRIPT DE CONFIGURACIÓN AUTOMÁTICA PARA VERCEL
# Ejecutar desde la carpeta del proyecto: ./COMANDOS_VERCEL.sh

echo "🚀 Configurando proyecto Atlixco en Vercel..."

# 1. Verificar que estamos en la carpeta correcta
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde la carpeta del proyecto"
    exit 1
fi

echo "✅ Carpeta del proyecto verificada"

# 2. Login a Vercel (si no está logueado)
echo "🔐 Verificando login de Vercel..."
vercel whoami || vercel login

# 3. Vincular proyecto
echo "🔗 Vinculando proyecto..."
vercel link --yes

# 4. Configurar variables de entorno
echo "⚙️  Configurando variables de entorno..."

# DATABASE_URL
echo "Configurando DATABASE_URL..."
echo "file:./dev.db" | vercel env add DATABASE_URL production
echo "file:./dev.db" | vercel env add DATABASE_URL preview  
echo "file:./dev.db" | vercel env add DATABASE_URL development

# NEXTAUTH_SECRET
echo "Configurando NEXTAUTH_SECRET..."
echo "atlixco-adopcion-secret-key-2024" | vercel env add NEXTAUTH_SECRET production
echo "atlixco-adopcion-secret-key-2024" | vercel env add NEXTAUTH_SECRET preview
echo "atlixco-adopcion-secret-key-2024" | vercel env add NEXTAUTH_SECRET development

# NEXTAUTH_URL
echo "Configurando NEXTAUTH_URL..."
echo "https://4tlixco.vercel.app" | vercel env add NEXTAUTH_URL production
echo "https://4tlixco.vercel.app" | vercel env add NEXTAUTH_URL preview
echo "https://4tlixco.vercel.app" | vercel env add NEXTAUTH_URL development

# 5. Deploy con nuevas variables
echo "🚀 Desplegando con nuevas variables..."
vercel --prod --force

echo "✅ ¡Configuración completada!"
echo ""
echo "🌐 URLs disponibles:"
echo "   Público: https://4tlixco.vercel.app"
echo "   Admin:   https://4tlixco.vercel.app/admin"
echo ""
echo "🔑 Credenciales admin:"
echo "   Email:    admin@atlixco.gob.mx"  
echo "   Password: Atlixco2024!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Abrir https://4tlixco.vercel.app/admin"
echo "   2. Hacer login con las credenciales"
echo "   3. Agregar perritos de ejemplo en Admin > Perritos"
echo "   4. Probar el flujo completo"