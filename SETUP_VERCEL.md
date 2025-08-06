# 🚀 SETUP COMPLETO PARA VERCEL - EJECUTAR PASO A PASO

## PASO 1: CONFIGURAR VARIABLES DE ENTORNO

### Opción A: Via Vercel CLI (Copia estos comandos)
```bash
# 1. Login a Vercel
vercel login

# 2. Vincular proyecto (ejecutar desde la carpeta del proyecto)
vercel link

# 3. Agregar DATABASE_URL
vercel env add DATABASE_URL
# Cuando pregunte el valor: file:./dev.db
# Seleccionar: Production, Preview, Development (todos)

# 4. Agregar NEXTAUTH_SECRET  
vercel env add NEXTAUTH_SECRET
# Cuando pregunte el valor: atlixco-adopcion-secret-key-2024
# Seleccionar: Production, Preview, Development (todos)

# 5. Agregar NEXTAUTH_URL
vercel env add NEXTAUTH_URL  
# Cuando pregunte el valor: https://atlixco-5xngluf2i-atlixco-s-projects.vercel.app
# Seleccionar: Production, Preview, Development (todos)

# 6. Forzar nuevo deploy
vercel --prod --force
```

### Opción B: Via Dashboard Web
1. Ir a: https://vercel.com/dashboard
2. Seleccionar proyecto "atlixco"
3. Settings > Environment Variables
4. Agregar estas 3 variables:

| Name | Value | Environments |
|------|-------|--------------|
| DATABASE_URL | file:./dev.db | Production, Preview, Development |
| NEXTAUTH_SECRET | atlixco-adopcion-secret-key-2024 | Production, Preview, Development |  
| NEXTAUTH_URL | https://atlixco-5xngluf2i-atlixco-s-projects.vercel.app | Production, Preview, Development |

5. Deployments > Redeploy último deployment

---

## PASO 2: VERIFICAR QUE FUNCIONA

### A. Test Homepage
- Abrir: https://atlixco-5xngluf2i-atlixco-s-projects.vercel.app
- ✅ Debe cargar la homepage
- ✅ Click en "Ver Perritos Disponibles" 
- ✅ Debe ir a catálogo (aunque esté vacío)

### B. Test Admin
- Abrir: https://atlixco-5xngluf2i-atlixco-s-projects.vercel.app/admin
- ✅ Login con: admin@atlixco.gob.mx / Atlixco2024!
- ✅ Debe entrar al dashboard
- ✅ Métricas deben aparecer (aunque en 0)

---

## PASO 3: POBLAR CON DATOS DE EJEMPLO

### Una vez que el admin funcione:

1. **Ir a Admin > Perritos > Agregar Perrito**

2. **Crear Perrito 1:**
   - Nombre: Max
   - Raza: Mestizo  
   - Edad: 2 años
   - Sexo: macho
   - Tamaño: mediano
   - Historia: Max fue rescatado de las calles de Atlixco. Es muy cariñoso y juguetón, perfecto para una familia activa que le dé mucho amor.
   - Energía: media
   - ✅ Apto para niños
   - ✅ Vacunado, Esterilizado, Desparasitado
   - Características: Cariñoso, Juguetón, Protector
   - Foto Principal: https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400
   - ✅ Destacado

3. **Crear Perrito 2:**
   - Nombre: Luna
   - Raza: Chihuahua mix
   - Edad: 1 año
   - Sexo: hembra  
   - Tamaño: chico
   - Historia: Luna es una perrita muy dulce y tranquila. Le encanta estar en brazos y es perfecta para familias que buscan una compañera calmada.
   - Energía: baja
   - ✅ Apto para niños ✅ Apto para gatos
   - ✅ Vacunado, Esterilizado, Desparasitado
   - Características: Tranquila, Cariñosa, Tímida
   - Foto Principal: https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400

4. **Crear Perrito 3:**
   - Nombre: Rocky
   - Raza: Pastor Alemán mix
   - Edad: 3 años
   - Sexo: macho
   - Tamaño: grande
   - Historia: Rocky es un guardián nato pero muy noble. Necesita una familia con experiencia en perros grandes y espacio suficiente para correr.
   - Energía: alta
   - ✅ Apto para otros perros
   - ✅ Vacunado, Esterilizado, Desparasitado  
   - Características: Protector, Leal, Energético
   - Foto Principal: https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400

---

## PASO 4: TEST COMPLETO DEL FLUJO

### A. Test Usuario Público:
1. Ir a: https://atlixco-5xngluf2i-atlixco-s-projects.vercel.app
2. ✅ Homepage debe mostrar stats actualizados  
3. Click "Ver Perritos Disponibles"
4. ✅ Catálogo debe mostrar los 3 perritos
5. ✅ Filtros deben funcionar
6. Click en "Ver Detalles" de Max
7. ✅ Página individual debe cargar
8. Click "¡Quiero Adoptarlo!"
9. ✅ Formulario multi-step debe funcionar
10. Llenar formulario completo
11. ✅ Debe generar código ADPX-XXXX

### B. Test Admin:
1. Volver a admin: https://atlixco-5xngluf2i-atlixco-s-projects.vercel.app/admin
2. ✅ Dashboard debe mostrar: 3 perritos, 1 solicitud
3. Click "Perritos" en sidebar
4. ✅ Debe mostrar los 3 perritos creados
5. Click "Solicitudes" en sidebar  
6. ✅ Debe mostrar la solicitud recibida
7. Click "Editar" en algún perrito
8. ✅ Formulario debe cargar con datos
9. Cambiar algo y guardar
10. ✅ Debe actualizarse correctamente

---

## 🎯 RESULTADO ESPERADO FINAL:

### ✅ Sistema 100% Funcional:
- Frontend público navegable con perritos
- Formulario de adopción completo  
- Panel admin con CRUD completo
- Dashboard con métricas reales
- API funcionando correctamente

### ✅ URLs Activas:
- Público: https://atlixco-5xngluf2i-atlixco-s-projects.vercel.app
- Admin: https://atlixco-5xngluf2i-atlixco-s-projects.vercel.app/admin  
- Catálogo: https://atlixco-5xngluf2i-atlixco-s-projects.vercel.app/perritos

### ✅ Credenciales:
- Email: admin@atlixco.gob.mx
- Password: Atlixco2024!

---

## 🚨 SI ALGO FALLA:

### Error de login admin:
```bash
# Ver logs de Vercel:
vercel logs --follow

# Si no existe el usuario admin, se creará automáticamente
# en el primer deployment con las variables configuradas
```

### Error de base de datos:
```bash
# SQLite se crea automáticamente
# Verificar que las variables estén configuradas:
vercel env ls
```

### Variables no se aplican:
```bash
# Después de agregar variables, siempre redeploy:
vercel --prod --force
```

---

**⏱️ TIEMPO TOTAL: ~20-30 minutos**

¡Después de esto tendrás el sistema completo funcionando! 🚀