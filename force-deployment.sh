#!/bin/bash

echo "=== Forzando nuevo deployment ==="
echo ""
echo "Este script creará un commit vacío para forzar un nuevo deployment"
echo ""

# Crear un commit vacío con timestamp
timestamp=$(date +"%Y-%m-%d %H:%M:%S")
git commit --allow-empty -m "Force deployment - $timestamp"

# Push a GitHub
git push origin main

echo ""
echo "✅ Commit enviado a GitHub"
echo ""
echo "Ahora verifica en Vercel si aparece el nuevo deployment"
echo "Si no aparece:"
echo "1. Ve a Settings → Git en tu proyecto de Vercel"
echo "2. Verifica que esté conectado a atlixcomx/mascotas"
echo "3. Si no está conectado, reconéctalo"
echo "4. Si está conectado pero no funciona, desconecta y vuelve a conectar"