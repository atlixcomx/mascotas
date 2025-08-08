# APIs del Módulo de Gestión de Mascotas

## Resumen
Se han creado/actualizado las siguientes APIs para el módulo de gestión de mascotas con Next.js 15 y App Router, incluyendo validación con Zod y manejo completo de errores.

## APIs Implementadas

### 1. GET /api/admin/perritos - Listar mascotas con filtros

**Funcionalidad:** Lista mascotas con filtros avanzados y paginación.

**Nuevos filtros disponibles:**
- `tipoIngreso`: entrega_voluntaria, rescate, decomiso
- `fechaInicio`: Filtrar por fecha de ingreso desde
- `fechaFin`: Filtrar por fecha de ingreso hasta
- `energia`: baja, media, alta
- `sexo`: macho, hembra
- `aptoNinos`: true/false
- `aptoPerros`: true/false
- `aptoGatos`: true/false
- `vacunas`: true/false
- `esterilizado`: true/false
- `destacado`: true/false

**Ejemplo de uso:**
```
GET /api/admin/perritos?tipoIngreso=rescate&fechaInicio=2024-01-01&energia=alta&page=1&limit=10
```

**Respuesta mejorada:**
```json
{
  "perritos": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "filtros": { /* filtros aplicados */ },
  "resumen": {
    "disponibles": 20,
    "enProceso": 15,
    "adoptados": 15
  }
}
```

### 2. POST /api/admin/perritos - Crear nueva mascota

**Funcionalidad:** Crea una nueva mascota con generación automática de código ATL-YYYY-XXX.

**Campos adicionales soportados:**
- `padecimientos`: string[] - Array de padecimientos médicos
- `vacunasDetalle`: Array con detalles de vacunas aplicadas
- `tratamientos`: Array con tratamientos médicos
- `alergias`: string[] - Array de alergias conocidas
- `fotosInternas`: string[] - URLs de fotos para uso interno
- `fotosCatalogo`: string[] - URLs de fotos para mostrar en catálogo

**Validación Zod:** Todos los campos son validados automáticamente.

**Generación automática de código:** Formato ATL-2024-001, ATL-2024-002, etc.

**Ejemplo de payload:**
```json
{
  "nombre": "Rex",
  "raza": "Mestizo",
  "edad": "2 años",
  "sexo": "macho",
  "tamano": "mediano",
  "historia": "Rescatado de la calle en condiciones deplorables...",
  "tipoIngreso": "rescate",
  "padecimientos": ["dermatitis", "desnutrición"],
  "vacunasDetalle": [
    {
      "nombre": "Múltiple",
      "fecha": "2024-01-15",
      "veterinario": "Dr. García"
    }
  ],
  "tratamientos": [
    {
      "descripcion": "Antibiótico para infección",
      "fechaInicio": "2024-01-15",
      "fechaFin": "2024-01-25"
    }
  ],
  "alergias": ["polen"]
}
```

### 3. GET /api/admin/perritos/[id] - Obtener detalle de mascota

**Funcionalidad:** Obtiene información detallada de una mascota específica.

**Información adicional incluida:**
- Expediente médico (últimos 10 registros)
- Padecimientos extraídos de las notas
- Alergias registradas
- Tratamientos aplicados
- Vacunas detalladas
- Días en refugio calculados

### 4. PUT /api/admin/perritos/[id] - Actualizar mascota

**Funcionalidad:** Actualiza información de mascota con validación Zod.

**Características:**
- Actualización parcial (solo campos enviados)
- Validación automática con Zod
- Historial detallado en notas
- Soporte para todos los campos adicionales

### 5. DELETE /api/admin/perritos/[id] - Eliminar mascota (soft delete)

**Funcionalidad:** Implementa soft delete por defecto, con opción de hard delete.

**Modos de eliminación:**
- **Soft Delete (default):** Cambia estado a "eliminado" y prefija nombre con "[ELIMINADO]"
- **Hard Delete:** Usa parámetro `?force=true` para eliminación permanente

**Ejemplo:**
```
DELETE /api/admin/perritos/123                    # Soft delete
DELETE /api/admin/perritos/123?force=true         # Hard delete
```

### 6. POST /api/admin/perritos/[id]/fotos - Subir fotos

**Funcionalidad:** Sube fotos organizadas por tipo.

**Tipos de foto soportados:**
- `principal`: Foto principal del perrito
- `galeria`: Fotos para mostrar en galería
- `interna`: Fotos para uso interno del refugio
- `catalogo`: Fotos específicas para catálogo

**Validaciones:**
- Tipos de archivo: JPG, PNG, WebP
- Tamaño máximo: 5MB
- Nombres únicos automáticos

**Ejemplo de uso:**
```javascript
const formData = new FormData()
formData.append('archivo', file)
formData.append('tipo', 'principal')
formData.append('descripcion', 'Foto después del baño')

fetch('/api/admin/perritos/123/fotos', {
  method: 'POST',
  body: formData
})
```

### 7. DELETE /api/admin/perritos/[id]/fotos/[fotoId] - Eliminar foto

**Funcionalidad:** Elimina fotos específicas por tipo.

**Parámetros:**
- `tipo`: Tipo de foto a eliminar (query parameter)

**Ejemplo:**
```
DELETE /api/admin/perritos/123/fotos/imagen123.jpg?tipo=galeria
```

### 8. GET /api/admin/perritos/[id]/fotos - Listar fotos

**Funcionalidad:** Lista todas las fotos organizadas por tipo.

**Respuesta:**
```json
{
  "perritoId": "123",
  "fotoPrincipal": "/uploads/perritos/123/principal.jpg",
  "fotos": {
    "principal": [...],
    "galeria": [...],
    "internas": [...],
    "catalogo": [...]
  },
  "total": 15
}
```

## Validaciones Implementadas

### Esquemas Zod creados:
- `crearPerritoSchema`: Validación completa para crear mascotas
- `actualizarPerritoSchema`: Validación parcial para actualizar
- `filtrosPerritoSchema`: Validación de filtros de búsqueda
- `subirFotoSchema`: Validación para subida de fotos
- `eliminarFotoSchema`: Validación para eliminación de fotos

### Campos validados:
- Formatos de fecha
- Tipos enum (sexo, tamaño, energía, etc.)
- URLs válidas para fotos
- Arrays de strings para padecimientos y alergias
- Objetos estructurados para vacunas y tratamientos

## Manejo de Errores

Todas las APIs implementan manejo robusto de errores:

### Errores de validación Zod (400):
```json
{
  "error": "Datos inválidos",
  "details": [
    {
      "path": ["edad"],
      "message": "Edad es requerida"
    }
  ]
}
```

### Errores de autenticación (401):
```json
{
  "error": "No autorizado"
}
```

### Errores de no encontrado (404):
```json
{
  "error": "Perrito no encontrado"
}
```

### Errores internos (500):
```json
{
  "error": "Error interno del servidor"
}
```

## Archivos Creados/Modificados

1. **Nuevo:** `/src/lib/validations/perrito.ts` - Esquemas de validación Zod
2. **Actualizado:** `/src/app/api/admin/perritos/route.ts` - APIs GET y POST mejoradas
3. **Actualizado:** `/src/app/api/admin/perritos/[id]/route.ts` - APIs individuales mejoradas
4. **Nuevo:** `/src/app/api/admin/perritos/[id]/fotos/route.ts` - Gestión de fotos
5. **Nuevo:** `/src/app/api/admin/perritos/[id]/fotos/[fotoId]/route.ts` - Operaciones específicas de fotos

## Notas de Implementación

### Almacenamiento de campos adicionales:
- Los campos `padecimientos`, `alergias` y `tratamientos` se almacenan como notas especializadas
- Las `vacunasDetalle` se integran con el modelo `ExpedienteMedico`
- Las `fotosInternas` se registran en notas con referencias a archivos

### Generación de códigos:
- Formato: ATL-YYYY-XXX (ejemplo: ATL-2024-001)
- Incremental automático por año
- Verificación de unicidad antes de asignar

### Soft Delete:
- Estado cambia a "eliminado"
- Nombre se prefixa con "[ELIMINADO]"
- Datos se conservan para auditoría
- Opción de hard delete para casos especiales

### Manejo de archivos:
- Almacenamiento en `/public/uploads/perritos/[id]/`
- Nombres únicos con timestamp y hash aleatorio
- Creación automática de directorios
- Eliminación física opcional del archivo

Todas las APIs están listas para uso en producción con validación completa, manejo de errores robusto y documentación detallada.