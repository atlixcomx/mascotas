# Configuración Inicial del Sistema

## 1. Crear las tablas en la base de datos

Una vez que el deployment esté listo, necesitas ejecutar las migraciones de Prisma:

1. Ve a Supabase → SQL Editor
2. Ejecuta este comando para ver si las tablas ya existen:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

3. Si no hay tablas, necesitarás ejecutar el schema de Prisma.

## 2. Crear usuario administrador

En el SQL Editor de Supabase, ejecuta:

```sql
-- Crear usuario admin (password: admin123)
INSERT INTO "Usuario" (email, password, nombre, role, "createdAt", "updatedAt")
VALUES (
  'admin@atlixco.gob.mx',
  '$2a$10$rBYQlHvASJYwXUSPWt6TgeVQGGbVNuBLmZxa.s9DqRNhpOj8MJZ9.',
  'Administrador',
  'admin',
  NOW(),
  NOW()
);
```

## 3. Acceder al sistema

1. URL principal: https://tu-proyecto.vercel.app
2. Panel admin: https://tu-proyecto.vercel.app/admin
3. Credenciales:
   - Email: admin@atlixco.gob.mx
   - Password: admin123

## 4. Próximos pasos

1. Cambiar la contraseña del administrador
2. Agregar los primeros perritos
3. Configurar el email para notificaciones (opcional)
4. Personalizar los textos y colores si es necesario