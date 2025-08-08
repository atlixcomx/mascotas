# 📋 Validación Completa de Campos - Base de Datos vs Formularios

## 🐕 Modelo Perrito

### Campos en Base de Datos (Prisma)
```typescript
model Perrito {
  // Identificadores
  id: String @id
  codigo: String @unique // ATL-2024-001
  nombre: String
  slug: String @unique
  
  // Multimedia
  fotos: String @db.Text // JSON array
  fotoPrincipal: String
  
  // Información básica
  edad: String
  tamano: String // ENUM: chico, mediano, grande
  raza: String
  sexo: String // ENUM: macho, hembra
  peso: Float? // OPCIONAL
  
  // Historia
  historia: String @db.Text
  fechaIngreso: DateTime
  tipoIngreso: String // ENUM: entrega_voluntaria, rescate, decomiso
  procedencia: String? // OPCIONAL
  responsableIngreso: String? // OPCIONAL
  
  // Salud
  vacunas: Boolean
  esterilizado: Boolean
  desparasitado: Boolean
  saludNotas: String? @db.Text // OPCIONAL
  
  // Temperamento
  energia: String // ENUM: baja, media, alta
  aptoNinos: Boolean
  aptoPerros: Boolean
  aptoGatos: Boolean
  caracter: String @db.Text // JSON array
  
  // Estado
  estado: String // ENUM: disponible, proceso, adoptado
  destacado: Boolean
  vistas: Int
  
  // Adopción
  fechaAdopcion: DateTime? // OPCIONAL
  adoptanteNombre: String? // OPCIONAL
  adoptanteTelefono: String? // OPCIONAL
}
```

### 🔴 PROBLEMAS ENCONTRADOS EN FORMULARIO NUEVO PERRITO

1. **Campo `descripcion` en formulario → `historia` en BD**
   - El formulario captura "descripcion" pero la BD espera "historia"
   
2. **Campo `vacunado` en formulario → `vacunas` en BD**
   - Diferente nombre de campo boolean

3. **Campos que NO EXISTEN en BD pero están en formulario:**
   - `padecimientos` (array) - NO EXISTE
   - `vacunasDetalle` (array) - NO EXISTE
   - `tratamientos` (array) - NO EXISTE
   - `alergias` (array) - NO EXISTE
   - `fotosInternas` (array) - NO EXISTE
   - `fotosCatalogo` (array) - NO EXISTE
   - `personalidad` - NO EXISTE (debe ser parte de `caracter`)

4. **Campo `peso` es Float en BD pero String en formulario**
   - Necesita conversión parseFloat()

5. **Valores de ENUM incorrectos:**
   - ~~tamano: "pequeño" → debe ser "chico"~~ ✅ YA CORREGIDO
   - tamano solo acepta: chico, mediano, grande

## 🔧 CORRECCIONES NECESARIAS

### 1. En API `/api/admin/perritos/route.ts`:

```typescript
// ELIMINAR referencias a campos que no existen:
// - padecimientos
// - vacunasDetalle  
// - tratamientos
// - alergias
// - fotosInternas
// - fotosCatalogo

// Estos datos deben guardarse en NotaPerrito o ExpedienteMedico
```

### 2. En Formulario Nuevo Perrito:

```typescript
// Cambiar nombres de campos:
formData.descripcion → historia
formData.vacunado → vacunas

// Convertir tipos:
peso: parseFloat(formData.peso) || null
```

### 3. Manejo de Información Adicional:

Los campos adicionales deben manejarse así:
- **Padecimientos**: Crear NotaPerrito tipo 'salud'
- **Alergias**: Crear NotaPerrito tipo 'salud'
- **Vacunas detalladas**: Crear ExpedienteMedico tipo 'vacuna'
- **Tratamientos**: Crear ExpedienteMedico tipo 'tratamiento'

## 📝 Modelo Solicitud

### Campos en Base de Datos
```typescript
model Solicitud {
  // Identificadores
  id: String @id
  codigo: String @unique // ADPX-0001
  perritoId: String
  
  // Datos solicitante
  nombre: String
  edad: Int // NÚMERO
  telefono: String
  email: String
  direccion: String
  ciudad: String
  codigoPostal: String
  
  // Información adicional
  tipoVivienda: String // casa, departamento
  tienePatio: Boolean
  experiencia: String @db.Text
  otrasMascotas: String? // OPCIONAL
  motivoAdopcion: String @db.Text
  
  // Documentos
  ineUrl: String? // OPCIONAL
  comprobanteUrl: String? // OPCIONAL
  
  // Estado
  estado: String // nueva, revision, entrevista, prueba, aprobada, rechazada
  
  // QR
  origenQR: String? // OPCIONAL
}
```

## 🏪 Modelo Comercio

### Campos en Base de Datos
```typescript
model Comercio {
  // Identificadores
  id: String @id
  codigo: String @unique
  nombre: String
  slug: String @unique
  categoria: String // restaurant, hotel, cafe, tienda
  logo: String? // OPCIONAL
  
  // Información
  descripcion: String @db.Text
  direccion: String
  telefono: String
  email: String? // OPCIONAL
  website: String? // OPCIONAL
  horarios: String
  
  // Pet friendly
  servicios: String @db.Text // JSON array
  restricciones: String? @db.Text // OPCIONAL
  certificado: Boolean
  fechaCert: DateTime? // OPCIONAL
  
  // Ubicación
  latitud: Float? // OPCIONAL
  longitud: Float? // OPCIONAL
}
```

## 🏥 Modelo ExpedienteMedico

### Campos en Base de Datos
```typescript
model ExpedienteMedico {
  id: String @id
  perritoId: String
  
  tipo: String // vacuna, consulta, cirugia, tratamiento, desparasitacion
  descripcion: String @db.Text
  fecha: DateTime
  veterinario: String? // OPCIONAL
  veterinariaId: String? // OPCIONAL
  
  // Para vacunas
  vacunaTipo: String? // multiple, rabia, parvovirus, etc
  proximaDosis: DateTime? // OPCIONAL
  
  // Para medicamentos
  medicamento: String? // OPCIONAL
  dosis: String? // OPCIONAL
  duracion: String? // OPCIONAL
  
  // Archivos
  documentos: String? @db.Text // JSON array - OPCIONAL
  
  costo: Float? // OPCIONAL
  notas: String? @db.Text // OPCIONAL
}
```

## ✅ CHECKLIST DE VALIDACIONES

### Formulario Nuevo Perrito
- [ ] Cambiar `descripcion` → `historia`
- [ ] Cambiar `vacunado` → `vacunas`
- [ ] Convertir `peso` String → Float
- [ ] Eliminar campos no existentes en BD
- [ ] Validar ENUMs correctos

### Formulario Edición Perrito
- [ ] Mismas validaciones que nuevo
- [ ] Verificar que ID existe

### Formulario Solicitud Adopción
- [ ] Validar `edad` es número entero
- [ ] Validar `tipoVivienda` es enum válido
- [ ] Validar email formato correcto

### Catálogo Público
- [ ] Mostrar solo perritos con estado='disponible'
- [ ] Parsear JSON de fotos correctamente
- [ ] Parsear JSON de caracter correctamente

### Panel Admin
- [ ] Validar tipos de datos en tablas
- [ ] Formatear fechas correctamente
- [ ] Mostrar booleanos como Si/No

## 🚨 ACCIÓN INMEDIATA REQUERIDA

1. **Modificar API de creación de perritos** para eliminar campos inexistentes
2. **Ajustar formulario** para usar nombres correctos de campos
3. **Crear migraciones** si se necesitan campos adicionales
4. **Validar tipos de datos** antes de enviar a BD