-- Crear tablas para PostgreSQL/Supabase

-- Tabla Perrito
CREATE TABLE "Perrito" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "fotos" TEXT NOT NULL,
    "fotoPrincipal" TEXT NOT NULL,
    "edad" TEXT NOT NULL,
    "tamano" TEXT NOT NULL,
    "raza" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "peso" REAL,
    "historia" TEXT NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL,
    "procedencia" TEXT,
    "vacunas" BOOLEAN NOT NULL DEFAULT false,
    "esterilizado" BOOLEAN NOT NULL DEFAULT false,
    "desparasitado" BOOLEAN NOT NULL DEFAULT false,
    "saludNotas" TEXT,
    "energia" TEXT NOT NULL,
    "aptoNinos" BOOLEAN NOT NULL DEFAULT false,
    "aptoPerros" BOOLEAN NOT NULL DEFAULT false,
    "aptoGatos" BOOLEAN NOT NULL DEFAULT false,
    "caracter" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'disponible',
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "vistas" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Perrito_pkey" PRIMARY KEY ("id")
);

-- Tabla Solicitud
CREATE TABLE "Solicitud" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "perritoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "edad" INTEGER NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "codigoPostal" TEXT NOT NULL,
    "tipoVivienda" TEXT NOT NULL,
    "tienePatio" BOOLEAN NOT NULL,
    "experiencia" TEXT NOT NULL,
    "otrasMascotas" TEXT,
    "motivoAdopcion" TEXT NOT NULL,
    "ineUrl" TEXT,
    "comprobanteUrl" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'nueva',
    "fechaEntrevista" TIMESTAMP(3),
    "inicioPrueba" TIMESTAMP(3),
    "finPrueba" TIMESTAMP(3),
    "fechaAdopcion" TIMESTAMP(3),
    "motivoRechazo" TEXT,
    "origenQR" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- Tabla Comercio
CREATE TABLE "Comercio" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "logo" TEXT,
    "descripcion" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "website" TEXT,
    "horarios" TEXT NOT NULL,
    "servicios" TEXT NOT NULL,
    "restricciones" TEXT,
    "certificado" BOOLEAN NOT NULL DEFAULT false,
    "fechaCert" TIMESTAMP(3),
    "latitud" REAL,
    "longitud" REAL,
    "qrEscaneos" INTEGER NOT NULL DEFAULT 0,
    "conversiones" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Comercio_pkey" PRIMARY KEY ("id")
);

-- Tabla Usuario
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- Tabla NotaPerrito
CREATE TABLE "NotaPerrito" (
    "id" TEXT NOT NULL,
    "perritoId" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NotaPerrito_pkey" PRIMARY KEY ("id")
);

-- Tabla NotaSolicitud
CREATE TABLE "NotaSolicitud" (
    "id" TEXT NOT NULL,
    "solicitudId" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NotaSolicitud_pkey" PRIMARY KEY ("id")
);

-- Tablas de NextAuth
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- Crear índices únicos
CREATE UNIQUE INDEX "Perrito_slug_key" ON "Perrito"("slug");
CREATE UNIQUE INDEX "Solicitud_codigo_key" ON "Solicitud"("codigo");
CREATE UNIQUE INDEX "Comercio_codigo_key" ON "Comercio"("codigo");
CREATE UNIQUE INDEX "Comercio_slug_key" ON "Comercio"("slug");
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- Agregar foreign keys
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_perritoId_fkey" FOREIGN KEY ("perritoId") REFERENCES "Perrito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "NotaPerrito" ADD CONSTRAINT "NotaPerrito_perritoId_fkey" FOREIGN KEY ("perritoId") REFERENCES "Perrito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "NotaSolicitud" ADD CONSTRAINT "NotaSolicitud_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Crear usuario administrador (password: admin123)
INSERT INTO "Usuario" ("id", "email", "password", "nombre", "role", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin@atlixco.gob.mx',
  '$2a$10$rBYQlHvASJYwXUSPWt6TgeVQGGbVNuBLmZxa.s9DqRNhpOj8MJZ9.',
  'Administrador',
  'admin',
  NOW(),
  NOW()
);