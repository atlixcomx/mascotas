# Variables de Entorno para Vercel

Copia estas variables en la configuración de Vercel:

## 1. DATABASE_URL
```
postgresql://postgres:[TU-PASSWORD-DE-SUPABASE]@db.ofhmzxisdnnkglmdkcin.supabase.co:5432/postgres
```
**IMPORTANTE**: Reemplaza [TU-PASSWORD-DE-SUPABASE] con la contraseña que creaste en Supabase

## 2. NEXTAUTH_SECRET
```
7YG+Gz7oJUdHVRQ79XdV0yaoIB0BC+AbxqOgkQ2hKEQ=
```

## 3. NEXTAUTH_URL
```
https://[TU-PROYECTO].vercel.app
```
**IMPORTANTE**: Reemplaza [TU-PROYECTO] con el nombre de tu proyecto en Vercel

## 4. EMAIL_FROM (opcional por ahora)
```
adopciones@atlixco.gob.mx
```

## 5. EMAIL_PASSWORD (opcional por ahora)
```
dejar-vacio-por-ahora
```

## Variables adicionales:

## 6. NODE_ENV
```
production
```

## 7. PRISMA_HIDE_UPDATE_MESSAGE
```
true
```

---

### Pasos en Vercel:
1. En tu proyecto → Settings → Environment Variables
2. Agrega cada variable una por una
3. Asegúrate de que estén disponibles para Production, Preview y Development
4. Guarda los cambios
5. Redeploy el proyecto