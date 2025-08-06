#!/bin/bash

echo "=== Asistente para subir código a GitHub ==="
echo ""
echo "Este script te ayudará a subir el código al nuevo repositorio"
echo "Necesitarás tu nombre de usuario y contraseña de GitHub"
echo ""

read -p "Ingresa tu usuario de GitHub (atlixcomx): " username
username=${username:-atlixcomx}

echo ""
echo "Ahora necesitas crear un Personal Access Token:"
echo "1. Ve a https://github.com/settings/tokens"
echo "2. Haz clic en 'Generate new token (classic)'"
echo "3. Dale un nombre como 'atlixco-deploy'"
echo "4. Selecciona el permiso 'repo' (completo)"
echo "5. Haz clic en 'Generate token'"
echo "6. Copia el token generado"
echo ""

read -s -p "Pega aquí tu Personal Access Token: " token
echo ""

if [ -z "$token" ]; then
    echo "Error: No se proporcionó un token"
    exit 1
fi

echo ""
echo "Configurando y subiendo el código..."

# Configurar el remote con autenticación
git remote set-url origin https://${username}:${token}@github.com/atlixcomx/mascotas.git

# Hacer push
git push -u origin main

echo ""
echo "¡Listo! El código se ha subido exitosamente."
echo ""
echo "Ahora puedes:"
echo "1. Ir a https://github.com/atlixcomx/mascotas para ver tu código"
echo "2. Conectar el repositorio con Vercel para deployar"