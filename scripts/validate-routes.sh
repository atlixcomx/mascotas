#!/bin/bash

echo "🔍 Validando rutas del sitio Atlixco..."
echo "========================================="

BASE_URL="https://4tlixco.vercel.app"

# Array de rutas a validar
declare -a routes=(
  "/"
  "/ui-test"
  "/diagnostics" 
  "/perritos"
  "/perritos/max-labrador"
  "/perritos/luna-mestiza"
  "/perritos/rocky-pitbull"
  "/solicitud/test-id"
  "/admin/login"
  "/admin"
  "/admin/perritos"
  "/admin/solicitudes"
  "/test"
)

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

total=0
success=0
errors=0

echo ""
for route in "${routes[@]}"
do
  total=$((total + 1))
  url="${BASE_URL}${route}"
  echo -n "Validando $route ... "
  
  # Hacer petición HTTP y capturar código de respuesta
  response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  
  if [ "$response" = "200" ]; then
    echo -e "${GREEN}✅ OK${NC} (HTTP $response)"
    success=$((success + 1))
    
    # Verificar contenido básico
    content=$(curl -s "$url" | head -500)
    
    # Verificar si hay contenido HTML
    if [[ $content == *"<html"* ]] || [[ $content == *"<!DOCTYPE"* ]]; then
      echo "   └─ HTML detectado ✓"
    else
      echo -e "   └─ ${YELLOW}⚠️  No se detectó HTML válido${NC}"
    fi
    
    # Verificar si hay estilos CSS
    if [[ $content == *"<style"* ]] || [[ $content == *"styles"* ]] || [[ $content == *".css"* ]]; then
      echo "   └─ CSS detectado ✓"
    else
      echo -e "   └─ ${YELLOW}⚠️  No se detectaron estilos CSS${NC}"
    fi
    
  else
    echo -e "${RED}❌ ERROR${NC} (HTTP $response)"
    errors=$((errors + 1))
    
    # Si es 500, intentar obtener más información
    if [ "$response" = "500" ]; then
      echo -e "   └─ ${RED}Error interno del servidor${NC}"
    fi
  fi
  
  echo ""
done

echo "========================================="
echo "📊 RESUMEN DE VALIDACIÓN"
echo "========================================="
echo "Total de rutas: $total"
echo -e "Exitosas: ${GREEN}$success${NC} ($((success * 100 / total))%)"
echo -e "Con errores: ${RED}$errors${NC} ($((errors * 100 / total))%)"
echo ""

# Verificar rutas específicas con más detalle
echo "🔎 Validación detallada de páginas críticas:"
echo "-------------------------------------------"

# Homepage
echo -n "1. Homepage (/) - "
content=$(curl -s "$BASE_URL/" 2>/dev/null | head -1000)
if [[ $content == *"Centro de Adopción"* ]]; then
  echo -e "${GREEN}✅ Contenido correcto${NC}"
else
  echo -e "${RED}❌ Contenido no encontrado${NC}"
fi

# UI Test
echo -n "2. UI Test (/ui-test) - "
content=$(curl -s "$BASE_URL/ui-test" 2>/dev/null | head -1000)
if [[ $content == *"Prueba UI"* ]]; then
  echo -e "${GREEN}✅ Contenido correcto${NC}"
else
  echo -e "${RED}❌ Contenido no encontrado${NC}"
fi

# Diagnostics
echo -n "3. Diagnostics (/diagnostics) - "
content=$(curl -s "$BASE_URL/diagnostics" 2>/dev/null | head -1000)
if [[ $content == *"Diagnóstico"* ]]; then
  echo -e "${GREEN}✅ Contenido correcto${NC}"
else
  echo -e "${RED}❌ Contenido no encontrado${NC}"
fi

echo ""
echo "✅ Validación completada"