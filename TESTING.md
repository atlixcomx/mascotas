# Testing Suite - Centro de Adopción Atlixco

Esta documentación describe la suite completa de testing implementada para el Centro de Adopción Atlixco.

## Estructura de Testing

El proyecto incluye tres tipos principales de pruebas:

### 1. Tests Unitarios (Jest + React Testing Library)
- **Ubicación**: `src/**/__tests__/` y `src/**/*.test.{ts,tsx}`
- **Propósito**: Probar componentes individuales y hooks
- **Herramientas**: Jest, React Testing Library, Testing Library User Event

### 2. Tests de Integración (Jest)
- **Ubicación**: `tests/api/`
- **Propósito**: Probar endpoints de API y funcionalidad del servidor
- **Herramientas**: Jest con environment Node.js

### 3. Tests E2E (Playwright)
- **Ubicación**: `tests/e2e/`
- **Propósito**: Probar flujos completos de usuario
- **Herramientas**: Playwright

## Scripts de Testing Disponibles

```bash
# Tests unitarios y de componentes
npm run test                    # Ejecutar todos los tests unitarios
npm run test:watch             # Ejecutar tests en modo watch
npm run test:coverage          # Ejecutar tests con coverage
npm run test:ci                # Ejecutar tests para CI/CD
npm run test:unit              # Solo tests unitarios (excluye E2E)
npm run test:api               # Solo tests de API

# Tests E2E
npm run test:e2e               # Ejecutar todos los tests E2E
npm run test:e2e:headed        # Ejecutar E2E con browser visible
npm run test:e2e:debug         # Ejecutar E2E en modo debug
npm run test:e2e:ui            # Ejecutar E2E con interfaz visual

# Todos los tests
npm run test:all               # Ejecutar todos los tipos de tests

# Setup
npm run playwright:install     # Instalar browsers de Playwright
```

## Componentes Probados

### Componentes UI
- ✅ **Button** (`src/components/ui/Button.tsx`)
  - Todas las variantes (primary, secondary, danger, outline, ghost)
  - Todos los tamaños (sm, md, lg)
  - Estados (loading, disabled)
  - Iconos (left, right)
  - Accesibilidad e interacciones

- ✅ **Card** (`src/components/ui/Card.tsx`)
  - Card básico con variantes (default, elevated, outlined, flat)
  - PerritoCard especializado con toda su funcionalidad
  - Estados (nuevo, destacado)
  - Botón de favoritos
  - Diferentes tamaños

- ✅ **Modal** (`src/components/ui/Modal.tsx`)
  - Modal base con diferentes tamaños
  - ConfirmModal para confirmaciones
  - AlertModal para alertas
  - Gestión de focus y escape
  - Prevención de scroll del body

- ✅ **SearchBar** (`src/components/search/SearchBar.tsx`)
  - Funcionalidad de búsqueda con debounce
  - Botón de limpieza
  - Sincronización con props externas
  - Indicador visual de estado pendiente

### Hooks Personalizados
- ✅ **useFetch** (`src/hooks/useFetch.ts`)
  - Peticiones HTTP con retry automático
  - Estados de loading, error, success
  - Detección de datos vacíos
  - Gestión de reintentos

- ✅ **usePerritos** (`src/hooks/usePerritos.ts`)
  - Construcción de URLs con filtros
  - Paginación
  - Estados de carga y error
  - Hook individual de perrito

## APIs Probadas

### Endpoints de Integración
- ✅ **GET /api/perritos**
  - Filtros (búsqueda, tamaño, edad, género, energía)
  - Paginación
  - Ordenamiento
  - Manejo de errores

- ✅ **GET /api/health**
  - Estado del sistema
  - Variables de entorno
  - Timestamp
  - Manejo de errores

- ✅ **Auth System** (`/api/auth`)
  - Configuración de NextAuth
  - Provider de credenciales
  - Callbacks JWT y session
  - Validación de usuarios
  - Seguridad de passwords

## Flujos E2E Probados

### 1. Navegación (`tests/e2e/navigation.spec.ts`)
- ✅ Navegación principal entre páginas
- ✅ Navegación con teclado
- ✅ Navegación responsive en móvil
- ✅ Manejo de errores 404
- ✅ Navegación del browser (back/forward)
- ✅ Tiempos de carga

### 2. Búsqueda y Filtros (`tests/e2e/search-filters.spec.ts`)
- ✅ Búsqueda por texto (nombre y raza)
- ✅ Filtros por tamaño y energía
- ✅ Combinación de filtros
- ✅ Manejo de resultados vacíos
- ✅ Debouncing de búsqueda
- ✅ Caracteres especiales
- ✅ Accesibilidad con teclado
- ✅ Funcionalidad móvil

### 3. Detalle de Perrito (`tests/e2e/perrito-detail.spec.ts`)
- ✅ Información básica del perrito
- ✅ Galería de imágenes
- ✅ Estado de adopción
- ✅ Características y personalidad
- ✅ Información de compatibilidad
- ✅ Historia del perrito
- ✅ Información de salud
- ✅ Botones de adopción
- ✅ Perritos similares
- ✅ Manejo de errores 404
- ✅ Responsive design
- ✅ SEO elements

### 4. Formulario de Adopción (`tests/e2e/adoption-form.spec.ts`)
- ✅ Campos requeridos del formulario
- ✅ Validaciones (email, teléfono)
- ✅ Envío exitoso
- ✅ Manejo de errores de envío
- ✅ Estados de loading
- ✅ Accesibilidad con teclado
- ✅ Funcionalidad móvil
- ✅ Información del perrito en el formulario

### 5. Login de Admin (`tests/e2e/admin-login.spec.ts`)
- ✅ Campos del formulario de login
- ✅ Validaciones de campos
- ✅ Login exitoso
- ✅ Manejo de credenciales incorrectas
- ✅ Toggle de visibilidad de password
- ✅ Estados de loading
- ✅ Navegación con teclado
- ✅ Funcionalidad móvil
- ✅ Redirección de sesión existente
- ✅ Accesibilidad

## Configuración de Coverage

El proyecto está configurado para mantener un **coverage mínimo del 70%** en:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

### Archivos Excluidos del Coverage
- Archivos de tipos TypeScript (*.d.ts)
- Stories de Storybook
- Layouts, loading, not-found y error pages de Next.js

## Mocks y Setup

### Mocks Globales
- `fetch` API
- `next/image`
- `next/link`
- `next/navigation`
- Observers (IntersectionObserver, ResizeObserver)
- `window.matchMedia`
- Animaciones (`requestAnimationFrame`)

### Setup de Testing
- Configuración automática de `@testing-library/jest-dom`
- Limpieza de mocks entre tests
- Configuración de environment jsdom para tests de React

## CI/CD Integration

### Script para CI/CD
```bash
npm run test:ci
```

Este script:
- Ejecuta todos los tests unitarios y de API
- Genera reporte de coverage
- No entra en modo watch
- Está optimizado para pipelines de CI/CD

### Para E2E en CI/CD
```bash
npm run playwright:install
npm run test:e2e
```

## Buenas Prácticas

### 1. Estructura de Tests
- Usar `describe` para agrupar tests relacionados
- Nombrar tests de forma descriptiva
- Incluir tests positivos y negativos
- Probar casos edge

### 2. Mocking
- Mock APIs externas y dependencias
- Usar mocks específicos por test cuando sea necesario
- Limpiar mocks después de cada test

### 3. Accesibilidad
- Todos los tests E2E incluyen pruebas de navegación con teclado
- Verificación de ARIA attributes
- Tests de funcionalidad móvil

### 4. Performance
- Tests de tiempo de carga en E2E
- Verificación de tamaños mínimos de touch targets
- Tests responsive para diferentes viewport sizes

## Desarrollo y Mantenimiento

### Agregar Nuevos Tests
1. **Tests Unitarios**: Crear archivos `*.test.tsx` junto a los componentes
2. **Tests de API**: Agregar en `tests/api/`
3. **Tests E2E**: Agregar en `tests/e2e/`

### Debugging
- Usar `test:watch` para desarrollo iterativo
- Usar `test:e2e:debug` para debugging visual de E2E
- Usar `test:e2e:ui` para interfaz visual de Playwright

### Reportes
- Coverage HTML: `coverage/lcov-report/index.html`
- Playwright reports: `playwright-report/index.html`

## Comando de Ejemplo para Desarrollo

```bash
# Desarrollo con watch mode
npm run test:watch

# Coverage completo
npm run test:coverage

# E2E con browser visible
npm run test:e2e:headed

# Todo junto para validación final
npm run test:all
```

La suite de testing asegura la calidad del código y previene regresiones en todas las funcionalidades críticas del Centro de Adopción Atlixco.