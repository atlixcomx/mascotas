# Configuración de Variables de Entorno en Vercel

## Variables Requeridas para el Deploy

Para que el módulo admin funcione correctamente en Vercel, necesitas configurar las siguientes variables de entorno en el Dashboard de Vercel:

### 1. Variables de Base de Datos
- `DATABASE_URL` - URL de conexión a la base de datos PostgreSQL

### 2. Variables de NextAuth
- `NEXTAUTH_SECRET` - Clave secreta para NextAuth
- `NEXTAUTH_URL` - URL completa de la aplicación (ej: https://tu-app.vercel.app)

### 3. Variables de UploadThing
- `UPLOADTHING_TOKEN` - Token de API de UploadThing
- `UPLOADTHING_URL` - URL de API (normalmente: https://api.uploadthing.com)

### 4. **Variables de Admin (NUEVAS - REQUERIDAS)**
- `ADMIN_EMAIL` - Email del administrador (ej: admin@atlixco.gob.mx)
- `ADMIN_PASSWORD` - Contraseña del administrador

## Cómo Configurar en Vercel

1. Ve a tu proyecto en https://vercel.com/dashboard
2. Haz clic en "Settings"
3. Ve a "Environment Variables"
4. Agrega cada variable con su valor correspondiente
5. Asegúrate de seleccionar "Production", "Preview" y "Development" según sea necesario

## Variables Críticas para Admin

Las nuevas variables `ADMIN_EMAIL` y `ADMIN_PASSWORD` son **OBLIGATORIAS** para que el login del módulo admin funcione.

Sin estas variables, el deploy fallará o el admin no podrá hacer login.

## Valores Recomendados

```env
ADMIN_EMAIL=admin@atlixco.gob.mx
ADMIN_PASSWORD=[contraseña-segura-aquí]
```

## Verificación

Una vez configuradas las variables:

1. Realiza un nuevo deploy
2. Intenta hacer login en `/admin/login`
3. Verifica que el sistema funcione correctamente

## Solución de Problemas

Si el deploy falla:
- Verifica que todas las variables estén configuradas
- Revisa los logs del deploy en Vercel
- Asegúrate de que `ADMIN_EMAIL` y `ADMIN_PASSWORD` estén configuradas