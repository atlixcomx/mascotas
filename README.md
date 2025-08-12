
# Centro de Adopción Atlixco

## Descripción
Sistema web para gestionar adopciones de mascotas del Centro Municipal de Adopción y Bienestar Animal de Atlixco, Puebla.

**Última actualización**: Diciembre 2024 - Conversión a Client Components
**Build**: Forzando nuevo deployment con optimizaciones

## 🚀 Stack Tecnológico
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Deployment**: Vercel
- **UI Components**: shadcn/ui

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar migraciones
npx prisma migrate dev

# Iniciar desarrollo
npm run dev 🌐 URLs

Producción: https://4tlixco.vercel.app
Desarrollo: http://localhost:3000
GitHub: https://github.com/sjamesmx/atlixco

📋 Funcionalidades Principales

✅ Catálogo de 100+ perritos en adopción
✅ Formulario de solicitud de adopción
✅ Panel administrativo
✅ Sistema de QR para 140 comercios pet-friendly
✅ Notificaciones por email
✅ Proceso de adopción digitalizado

🎯 Objetivos

Aumentar adopciones de 30 a 50+ mensuales
Reducir tiempo de permanencia en el centro
Mejorar visibilidad mediante QRs en comercios

👥 Equipo
Centro Municipal de Adopción y Bienestar Animal de Atlixco, Puebla
chore: Trigger Vercel deployment - mobile menu contrast fixes
