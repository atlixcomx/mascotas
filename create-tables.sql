-- CreateTable
CREATE TABLE "Perrito" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "fechaIngreso" DATETIME NOT NULL,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Solicitud" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "fechaEntrevista" DATETIME,
    "inicioPrueba" DATETIME,
    "finPrueba" DATETIME,
    "fechaAdopcion" DATETIME,
    "motivoRechazo" TEXT,
    "origenQR" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Solicitud_perritoId_fkey" FOREIGN KEY ("perritoId") REFERENCES "Perrito" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comercio" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "fechaCert" DATETIME,
    "latitud" REAL,
    "longitud" REAL,
    "qrEscaneos" INTEGER NOT NULL DEFAULT 0,
    "conversiones" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'admin',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "NotaPerrito" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "perritoId" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NotaPerrito_perritoId_fkey" FOREIGN KEY ("perritoId") REFERENCES "Perrito" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NotaSolicitud" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "solicitudId" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NotaSolicitud_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Perrito_slug_key" ON "Perrito"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Solicitud_codigo_key" ON "Solicitud"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Comercio_codigo_key" ON "Comercio"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Comercio_slug_key" ON "Comercio"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

