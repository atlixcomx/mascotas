#!/bin/bash

# Script para copiar el proyecto a un nuevo repositorio

echo "Este script copiará tu proyecto al nuevo repositorio"
echo "Asegúrate de haber clonado el repositorio vacío primero"
echo ""
echo "1. Abre una nueva terminal"
echo "2. Ejecuta: git clone https://github.com/atlixcomx/mascotas.git ~/Desktop/mascotas-nuevo"
echo "3. Luego ejecuta este script"
echo ""
read -p "¿Ya clonaste el repositorio vacío? (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]
then
    # Copiar todos los archivos excepto .git
    echo "Copiando archivos..."
    rsync -av --exclude='.git' --exclude='node_modules' --exclude='.next' ./ ~/Desktop/mascotas-nuevo/
    
    echo ""
    echo "Archivos copiados!"
    echo ""
    echo "Ahora:"
    echo "1. cd ~/Desktop/mascotas-nuevo"
    echo "2. git add ."
    echo "3. git commit -m 'Initial commit - Sistema de adopción Atlixco'"
    echo "4. git push origin main"
fi