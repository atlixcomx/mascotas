-- Primero verifica si las tablas existen
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Si no hay tablas, ejecuta el schema de Prisma manualmente
-- O usa prisma db push desde tu local