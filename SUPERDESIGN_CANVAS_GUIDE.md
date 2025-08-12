# 🎨 Guía para Superdesign Canvas - Centro de Adopción Atlixco

## 🚀 Configuración Rápida

### 1. **Iniciar el Servidor de Desarrollo**
```bash
npm run dev
```
El sitio estará disponible en: `http://localhost:3000`

### 2. **Acceder a Superdesign Canvas**
- Abrir Superdesign Canvas
- Conectar con el proyecto local
- URL: `http://localhost:3000`

## 📱 Páginas Principales para Previsualizar

### 🏠 **Página de Inicio** (`/`)
- **URL**: `http://localhost:3000/`
- **Descripción**: Landing page principal con información del centro
- **Elementos clave**: Hero section, estadísticas, testimonios

### 🐕 **Catálogo de Perritos** (`/catalogo`)
- **URL**: `http://localhost:3000/catalogo`
- **Descripción**: Galería de perritos disponibles para adopción
- **Elementos clave**: Filtros, búsqueda, tarjetas de perritos

### 📝 **Formulario de Adopción** (`/solicitud-adopcion`)
- **URL**: `http://localhost:3000/solicitud-adopcion`
- **Descripción**: Formulario completo para solicitar adopción
- **Elementos clave**: Formulario multi-paso, validaciones

### 🏪 **Comercios Pet Friendly** (`/comercios-friendly`)
- **URL**: `http://localhost:3000/comercios-friendly`
- **Descripción**: Directorio de comercios amigables con mascotas
- **Elementos clave**: Mapa, filtros por categoría

### 🔐 **Panel de Administración** (`/admin`)
- **URL**: `http://localhost:3000/admin`
- **Descripción**: Panel de gestión del centro
- **Elementos clave**: Dashboard, gestión de perritos, solicitudes

## 🎨 Componentes Principales

### **Header** (`src/components/layout/Header.tsx`)
- Navegación principal
- Logo del centro
- Menú responsive

### **Footer** (`src/components/layout/Footer.tsx`)
- Información de contacto
- Enlaces importantes
- Redes sociales

### **PerritoCard** (`src/components/ui/PerritoCard.tsx`)
- Tarjeta individual de perrito
- Imagen, nombre, edad
- Botón de "Me interesa"

### **AdoptionForm** (`src/components/forms/AdoptionForm.tsx`)
- Formulario de adopción
- Validaciones en tiempo real
- Subida de documentos

### **SearchBar** (`src/components/search/SearchBar.tsx`)
- Búsqueda de perritos
- Filtros avanzados
- Autocompletado

## 🎯 Paleta de Colores

### **Colores Principales**
- **Rojo Puebla**: `#af1731` (Primario)
- **Rojo Oscuro**: `#840f31` (Secundario)
- **Dorado**: `#c79b66` (Acento)
- **Verde Gobierno**: `#3d9b84` (Terciario)

### **Colores de Fondo**
- **Blanco**: `#ffffff` (Principal)
- **Gris Claro**: `#f9fafb` (Secundario)
- **Beige**: `#e2be96` (Acento)

### **Colores de Texto**
- **Negro**: `#0e312d` (Principal)
- **Gris**: `#6b7280` (Secundario)
- **Blanco**: `#ffffff` (Sobre fondos oscuros)

## 📐 Tipografías

### **Fuentes Principales**
- **Albert Sans**: Títulos y headings
- **Poppins**: Texto de cuerpo y navegación

### **Tamaños de Fuente**
- **H1**: 2.5rem (40px)
- **H2**: 2rem (32px)
- **H3**: 1.5rem (24px)
- **Body**: 1rem (16px)
- **Small**: 0.875rem (14px)

## 📱 Breakpoints Responsive

### **Mobile First**
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1440px
- **Large Desktop**: 1440px+

## 🎨 Elementos de Diseño

### **Sombras**
- **Sombra Suave**: `0 2px 8px rgba(0, 0, 0, 0.1)`
- **Sombra Media**: `0 4px 16px rgba(0, 0, 0, 0.15)`
- **Sombra Fuerte**: `0 8px 32px rgba(0, 0, 0, 0.2)`

### **Bordes Redondeados**
- **Pequeño**: `4px`
- **Mediano**: `8px`
- **Grande**: `16px`
- **Completo**: `50%`

### **Espaciado**
- **XS**: `4px`
- **S**: `8px`
- **M**: `16px`
- **L**: `24px`
- **XL**: `32px`
- **XXL**: `48px`

## 🔧 Configuración Técnica

### **Variables de Entorno Necesarias**
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
NEXTAUTH_SECRET=[SECRET_KEY]
NEXTAUTH_URL=http://localhost:3000
UPLOADTHING_SECRET=[UPLOADTHING_SECRET]
UPLOADTHING_APP_ID=[UPLOADTHING_APP_ID]
```

### **Dependencias Principales**
- **Next.js**: 15.4.5
- **React**: 19.1.0
- **TypeScript**: 5.9.2
- **Prisma**: 5.8.0
- **NextAuth**: 4.24.5

## 🎯 Flujo de Usuario

### **1. Usuario Público**
1. Visita la página de inicio
2. Explora el catálogo de perritos
3. Filtra por características
4. Selecciona un perrito
5. Completa formulario de adopción

### **2. Administrador**
1. Accede al panel admin
2. Gestiona perritos (agregar, editar, eliminar)
3. Revisa solicitudes de adopción
4. Actualiza estado de perritos
5. Genera reportes

## 📊 Métricas de Performance

### **Objetivos de Rendimiento**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### **Optimizaciones Implementadas**
- Lazy loading de imágenes
- Code splitting automático
- Optimización de fuentes
- Compresión de assets

## 🚀 Comandos Útiles

### **Desarrollo**
```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción
```

### **Base de Datos**
```bash
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Sincronizar esquema
npm run db:studio    # Abrir Prisma Studio
```

### **Testing**
```bash
npm run test         # Ejecutar tests unitarios
npm run test:e2e     # Ejecutar tests end-to-end
npm run test:coverage # Generar reporte de cobertura
```

## 🎨 Consejos para Superdesign Canvas

### **1. Previsualización Responsive**
- Probar en diferentes tamaños de pantalla
- Verificar navegación móvil
- Comprobar formularios en touch

### **2. Interacciones**
- Probar hover states
- Verificar animaciones
- Comprobar transiciones

### **3. Accesibilidad**
- Verificar contraste de colores
- Probar navegación por teclado
- Comprobar lectores de pantalla

### **4. Performance**
- Monitorear tiempos de carga
- Verificar optimización de imágenes
- Comprobar lazy loading

## 📞 Soporte

Si encuentras algún problema durante la previsualización:

1. **Verificar que el servidor esté corriendo**: `npm run dev`
2. **Revisar la consola del navegador** para errores
3. **Verificar variables de entorno** configuradas
4. **Comprobar conexión a la base de datos**

---

**¡Listo para previsualizar en Superdesign Canvas!** 🎨✨
