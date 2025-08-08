#!/bin/bash

# Script para aplicar migraciones en producción
echo "🔄 Aplicando migraciones de base de datos..."

# Ejecutar migraciones
npx prisma migrate deploy

# Verificar el estado
if [ $? -eq 0 ]; then
    echo "✅ Migraciones aplicadas exitosamente"
    
    # Generar cliente de Prisma
    echo "🔧 Generando cliente de Prisma..."
    npx prisma generate
    
    echo "✅ Todo listo!"
else
    echo "❌ Error al aplicar migraciones"
    exit 1
fi